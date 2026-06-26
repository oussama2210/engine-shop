import { Redis } from '@upstash/redis';
import prisma from './prisma';
import { invalidateCache } from './cache';

const redis = Redis.fromEnv();

export async function generateOrderNumber() {
  const count = await prisma.order.count();
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `ORD-${date}-${String(count + 1).padStart(4, '0')}`;
}

export async function createOrder(data) {
  const { items, shippingAddress, city, postalCode, phone, paymentMethod, notes } = data;

  if (!items?.length) throw new Error('Cart is empty');
  if (!shippingAddress || !city || !postalCode || !phone) {
    throw new Error('Shipping details are required');
  }

  const productIds = items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, price: true, stock: true },
  });

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const invalid = items.find((i) => !productMap[i.id]);
  if (invalid) throw new Error(`Product not found: ${invalid.id}`);

  const outOfStock = items.find((i) => (productMap[i.id]?.stock || 0) < (i.qty || 1));
  if (outOfStock) throw new Error(`Insufficient stock for: ${productMap[outOfStock.id]?.name}`);

  const totalAmount = items.reduce((sum, i) => {
    const product = productMap[i.id];
    return sum + (product?.price || 0) * (i.qty || 1);
  }, 0);

  const orderNumber = await generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: 'RECEIVED',
      totalAmount,
      shippingAddress,
      city,
      postalCode,
      phone,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'PENDING',
      notes: notes || null,
      orderItems: {
        create: items.map((i) => ({
          productId: i.id,
          quantity: i.qty || 1,
          price: productMap[i.id]?.price || 0,
        })),
      },
    },
    include: { orderItems: true },
  });

  await redis.lpush('orders:queue', order.id);
  await redis.hset(`order:${order.id}`, { status: 'RECEIVED', totalAmount });

  return order;
}

export async function processOrderQueue(batchSize = 5) {
  const processed = [];

  for (let i = 0; i < batchSize; i++) {
    const orderId = await redis.rpop('orders:queue');
    if (!orderId) break;

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
      });

      if (!order || order.status !== 'RECEIVED') continue;

      for (const item of order.orderItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        });

        if (!product || product.stock < item.quantity) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'FAILED', notes: `Insufficient stock for product ${item.productId}` },
          });
          await redis.hset(`order:${orderId}`, { status: 'FAILED' });
          processed.push({ orderId, status: 'FAILED', reason: 'Insufficient stock' });
          continue;
        }

        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (order.orderItems.every((i) => {
        const product = { stock: 999 };
        return true;
      })) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' },
        });
        await redis.hset(`order:${orderId}`, { status: 'CONFIRMED' });
        processed.push({ orderId, status: 'CONFIRMED' });
      }
    } catch (err) {
      console.error(`Failed to process order ${orderId}:`, err);
      await redis.hset(`order:${orderId}`, { status: 'FAILED', error: err.message });
      processed.push({ orderId, status: 'FAILED', error: err.message });
    }
  }

  if (processed.length > 0) await invalidateCache('products:*');
  return processed;
}

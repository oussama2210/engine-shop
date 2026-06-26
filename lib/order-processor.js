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

  const totalAmount = items.reduce((sum, i) => {
    const product = productMap[i.id];
    return sum + (product?.price || 0) * (i.qty || 1);
  }, 0);

  const orderNumber = await generateOrderNumber();

  // Atomic stock reservation + order creation in a single transaction.
  // updateMany with stock >= qty acts as an optimistic lock:
  // if stock was already taken by another concurrent request, count will be 0
  // and the transaction throws, rolling back everything.
  const order = await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const qty = item.qty || 1;
      const result = await tx.product.updateMany({
        where: { id: item.id, stock: { gte: qty } },
        data: { stock: { decrement: qty } },
      });

      if (result.count === 0) {
        const name = productMap[item.id]?.name || item.id;
        throw new Error(`Insufficient stock for: ${name}`);
      }
    }

    return await tx.order.create({
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
  });

  await redis.lpush('orders:queue', order.id);
  await redis.hset(`order:${order.id}`, { status: 'RECEIVED', totalAmount });

  return order;
}

export async function releaseStock(productId, quantity) {
  await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: quantity } },
  });
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

      // Stock was already reserved atomically in createOrder.
      // Here we just confirm the order. If any validation fails,
      // we release the reserved stock.
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });
      await redis.hset(`order:${orderId}`, { status: 'CONFIRMED' });
      processed.push({ orderId, status: 'CONFIRMED' });
    } catch (err) {
      console.error(`Failed to process order ${orderId}:`, err);
      await redis.hset(`order:${orderId}`, { status: 'FAILED', error: err.message });

      // Release stock that was reserved in createOrder
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { orderItems: true },
        });
        if (order?.orderItems) {
          for (const item of order.orderItems) {
            await releaseStock(item.productId, item.quantity);
          }
        }
      } catch (releaseErr) {
        console.error(`Failed to release stock for order ${orderId}:`, releaseErr);
      }

      processed.push({ orderId, status: 'FAILED', error: err.message });
    }
  }

  if (processed.length > 0) await invalidateCache('products:*');
  return processed;
}

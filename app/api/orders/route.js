import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/order-processor';
import { Redis } from '@upstash/redis';
import { sanitizeInput, sanitizeObject, validateRequired, validateTypes, types, patterns, handleApiError, withRateLimit, logSecurityEvent } from '@/lib/security';

const redis = Redis.fromEnv();

export async function POST(request) {
  try {
    await withRateLimit(request);
    const body = await request.json();

    validateRequired(body, ['items', 'shippingAddress', 'city', 'postalCode', 'phone']);
    validateTypes(body, {
      items: { type: 'array', message: 'Items must be an array' },
      shippingAddress: { type: 'string', max: 500 },
      city: { type: 'string', max: 100 },
      postalCode: { type: 'string', max: 20 },
      phone: { type: 'string', max: 20, pattern: patterns.phone },
      notes: { type: 'string', max: 2000 },
    });

    if (!body.items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    for (const item of body.items) {
      validateRequired(item, ['id', 'qty']);
      validateTypes(item, {
        id: { type: 'string', pattern: patterns.id },
        qty: { type: 'integer', min: 1, max: 100 },
        price: { type: 'number', min: 0 },
      });
    }

    const sanitizedBody = {
      ...body,
      shippingAddress: sanitizeInput(body.shippingAddress),
      city: sanitizeInput(body.city),
      postalCode: sanitizeInput(body.postalCode),
      phone: sanitizeInput(body.phone),
      notes: body.notes ? sanitizeInput(body.notes) : '',
    };

    const order = await createOrder(sanitizedBody);
    logSecurityEvent('OrderCreated', { orderId: order.id, orderNumber: order.orderNumber });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalAmount: order.totalAmount,
          items: order.orderItems.length,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function GET() {
  try {
    const queueLength = await redis.llen('orders:queue');
    return NextResponse.json({ queueLength });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

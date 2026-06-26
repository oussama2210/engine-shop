import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/order-processor';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function POST(request) {
  try {
    const body = await request.json();
    const order = await createOrder(body);

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
    const status = error.message.includes('required') || error.message.includes('empty') || error.message.includes('not found')
      ? 400
      : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function GET() {
  try {
    const queueLength = await redis.llen('orders:queue');
    return NextResponse.json({ queueLength });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

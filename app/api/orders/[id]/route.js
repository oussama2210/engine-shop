import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const cached = await redis.hgetall(`order:${id}`);
    if (cached?.status === 'CONFIRMED' || cached?.status === 'FAILED') {
      return NextResponse.json({
        id,
        status: cached.status,
        totalAmount: cached.totalAmount ? parseFloat(cached.totalAmount) : null,
        fromCache: true,
      });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        paymentStatus: true,
        createdAt: true,
        orderItems: {
          select: { quantity: true, price: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await redis.hset(`order:${order.id}`, {
      status: order.status,
      totalAmount: String(order.totalAmount),
    });

    return NextResponse.json({
      ...order,
      items: order.orderItems.length,
      fromCache: false,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

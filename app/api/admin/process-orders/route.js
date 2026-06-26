import { NextResponse } from 'next/server';
import { processOrderQueue } from '@/lib/order-processor';

export async function POST() {
  try {
    const results = await processOrderQueue(5);
    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

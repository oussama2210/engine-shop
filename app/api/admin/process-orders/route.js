import { NextResponse } from 'next/server';
import { processOrderQueue } from '@/lib/order-processor';
import { requireAdmin, handleApiError, logSecurityEvent } from '@/lib/security';

export async function POST(request) {
  try {
    const session = await requireAdmin();
    const results = await processOrderQueue(5);
    logSecurityEvent('OrdersProcessed', { count: results.length, adminId: session.userId });
    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    return handleApiError(error, request);
  }
}

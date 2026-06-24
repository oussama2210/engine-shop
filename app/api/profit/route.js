import { NextResponse } from 'next/server';
import { getProfitSummary, getProductProfit } from '@/lib/profit';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      const result = await getProductProfit(productId);
      if (!result) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(result);
    }

    const summary = await getProfitSummary();
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

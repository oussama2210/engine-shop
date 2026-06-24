import { NextResponse } from 'next/server';
import { getProductProfit } from '@/lib/profit';

export async function GET(request, { params }) {
  try {
    const { productId } = await params;
    const result = await getProductProfit(productId);
    if (!result) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { InventoryService } from '@/lib/inventory';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (productId) {
      const stock = await InventoryService.getStock(productId);
      return NextResponse.json({ productId, stock });
    } else {
      const summary = await InventoryService.getInventorySummary();
      return NextResponse.json(summary);
    }
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, quantity, operation = 'set' } = body;
    
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'productId and quantity are required' },
        { status: 400 }
      );
    }

    let result;
    if (operation === 'reserve') {
      // Atomic optimistic-lock reservation — safe under concurrent requests
      result = await InventoryService.reserveStockAtomic(productId, quantity);
    } else if (operation === 'release') {
      result = await InventoryService.releaseStock(productId, quantity);
    } else {
      result = await InventoryService.updateStock(productId, quantity, operation);
    }
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { updates } = body;
    
    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates must be an array' },
        { status: 400 }
      );
    }
    
    const results = await InventoryService.bulkUpdateStock(updates);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
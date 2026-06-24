import { NextResponse } from 'next/server';
import { InventoryService } from '@/lib/inventory';

export async function GET(request, { params }) {
  try {
    const { productId } = await params;
    const stock = await InventoryService.getStock(productId);
    return NextResponse.json({ productId, stock });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { productId } = await params;
    const body = await request.json();
    const { quantity, operation = 'set' } = body;
    
    if (quantity === undefined) {
      return NextResponse.json(
        { error: 'quantity is required' },
        { status: 400 }
      );
    }
    
    const result = await InventoryService.updateStock(productId, quantity, operation);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { productId } = await params;
    const body = await request.json();
    const { quantity } = body;
    
    if (quantity === undefined) {
      return NextResponse.json(
        { error: 'quantity is required' },
        { status: 400 }
      );
    }
    
    // Check if product exists and has enough stock
    const inStock = await InventoryService.isInStock(productId, quantity);
    if (!inStock) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }
    
    // Reserve stock (subtract)
    const result = await InventoryService.reserveStock(productId, quantity);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
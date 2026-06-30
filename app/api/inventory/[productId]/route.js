import { NextResponse } from 'next/server';
import { InventoryService } from '@/lib/inventory';
import { validateRequired, validateTypes, types, requireAuth, handleApiError, withRateLimit, logSecurityEvent } from '@/lib/security';

export async function GET(request, { params }) {
  try {
    const { productId } = await params;
    const stock = await InventoryService.getStock(productId);
    return NextResponse.json({ productId, stock });
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function POST(request, { params }) {
  try {
    await withRateLimit(request);
    await requireAuth();
    const { productId } = await params;
    const body = await request.json();
    
    validateRequired(body, ['quantity']);
    validateTypes(body, {
      quantity: { type: 'integer' },
      operation: { type: 'string', max: 20 },
    });

    const { quantity, operation = 'set' } = body;
    const validOps = ['set', 'add', 'subtract'];
    if (!validOps.includes(operation)) {
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }
    
    const result = await InventoryService.updateStock(productId, quantity, operation);
    logSecurityEvent('InventoryUpdated', { productId, operation, quantity });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function PATCH(request, { params }) {
  try {
    await withRateLimit(request);
    await requireAuth();
    const { productId } = await params;
    const body = await request.json();
    
    validateRequired(body, ['quantity']);
    validateTypes(body, { quantity: { type: 'integer', min: 1 } });
    
    const { quantity } = body;
    
    const inStock = await InventoryService.isInStock(productId, quantity);
    if (!inStock) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }
    
    const result = await InventoryService.reserveStock(productId, quantity);
    logSecurityEvent('InventoryReserved', { productId, quantity });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return handleApiError(error, request);
  }
}
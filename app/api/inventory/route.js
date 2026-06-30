import { NextResponse } from 'next/server';
import { InventoryService } from '@/lib/inventory';
import { validateRequired, validateTypes, types, requireAuth, handleApiError, withRateLimit, logSecurityEvent } from '@/lib/security';

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
    return handleApiError(error, request);
  }
}

export async function POST(request) {
  try {
    await withRateLimit(request);
    await requireAuth();
    const body = await request.json();
    
    validateRequired(body, ['productId', 'quantity']);
    validateTypes(body, {
      productId: { type: 'string', pattern: /^[a-zA-Z0-9_-]+$/ },
      quantity: { type: 'integer' },
      operation: { type: 'string', max: 20 },
    });

    const { productId, quantity, operation = 'set' } = body;
    const validOps = ['set', 'add', 'subtract', 'reserve', 'release'];
    if (!validOps.includes(operation)) {
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    let result;
    if (operation === 'reserve') {
      result = await InventoryService.reserveStockAtomic(productId, quantity);
    } else if (operation === 'release') {
      result = await InventoryService.releaseStock(productId, quantity);
    } else {
      result = await InventoryService.updateStock(productId, quantity, operation);
    }
    logSecurityEvent('InventoryUpdated', { productId, operation, quantity });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function PATCH(request) {
  try {
    await withRateLimit(request);
    await requireAuth();
    const body = await request.json();
    const { updates } = body;
    
    if (!Array.isArray(updates) || updates.length > 100) {
      return NextResponse.json(
        { error: 'Updates must be an array of max 100 items' },
        { status: 400 }
      );
    }
    
    for (const update of updates) {
      validateRequired(update, ['productId', 'quantity']);
      validateTypes(update, {
        productId: { type: 'string' },
        quantity: { type: 'integer' },
        operation: { type: 'string', max: 20 },
      });
    }
    
    const results = await InventoryService.bulkUpdateStock(updates);
    logSecurityEvent('InventoryBulkUpdated', { count: updates.length });
    return NextResponse.json({ success: true, results });
  } catch (error) {
    return handleApiError(error, request);
  }
}
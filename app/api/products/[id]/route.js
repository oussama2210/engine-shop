import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCached, invalidateCache } from '@/lib/cache';
import { sanitizeInput, sanitizeObject, validateRequired, validateTypes, types, requireAuth, handleApiError, withRateLimit, logSecurityEvent } from '@/lib/security';

const allowedUpdateFields = ['name', 'price', 'buyPrice', 'salePrice', 'stock', 'description', 'images', 'featured', 'categoryId'];

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const product = await getCached(`product:${id}`, async () => {
      const p = await prisma.product.findUnique({
        where: { id },
        include: { category: { select: { name: true, slug: true } } },
      });
      return p;
    }, 300);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function PATCH(request, { params }) {
  try {
    await withRateLimit(request);
    await requireAuth();
    const { id } = await params;
    const body = sanitizeObject(await request.json());

    const filtered = {};
    for (const key of allowedUpdateFields) {
      if (body[key] !== undefined) filtered[key] = body[key];
    }

    if (Object.keys(filtered).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    if (filtered.name) {
      validateTypes(filtered, { name: { type: 'string', max: 200 } });
      filtered.name = sanitizeInput(filtered.name);
    }
    if (filtered.price !== undefined) {
      validateTypes(filtered, { price: { type: 'number', min: 0 } });
    }
    if (filtered.stock !== undefined) {
      validateTypes(filtered, { stock: { type: 'integer', min: 0 } });
    }

    const product = await prisma.product.update({
      where: { id },
      data: filtered,
    });

    await invalidateCache(`product:${id}`);
    await invalidateCache('products:*');
    logSecurityEvent('ProductUpdated', { productId: id });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function DELETE(request, { params }) {
  try {
    await withRateLimit(request);
    await requireAuth();
    const { id } = await params;

    await prisma.product.delete({ where: { id } });
    await invalidateCache(`product:${id}`);
    await invalidateCache('products:*');
    logSecurityEvent('ProductDeleted', { productId: id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, request);
  }
}

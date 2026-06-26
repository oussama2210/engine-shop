import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCached, invalidateCache } from '@/lib/cache';

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: body,
    });

    await invalidateCache(`product:${id}`);
    await invalidateCache('products:*');

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });

    await invalidateCache(`product:${id}`);
    await invalidateCache('products:*');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

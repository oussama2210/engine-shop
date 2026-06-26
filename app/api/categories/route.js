import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCached } from '@/lib/cache';

export async function GET() {
  try {
    const categories = await getCached('categories:all', async () => {
      const data = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true } } },
      });
      return data;
    }, 600);

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

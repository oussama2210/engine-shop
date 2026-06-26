import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCached, invalidateCache } from '@/lib/cache';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const cacheKey = `products:${category || ''}:${search || ''}:${featured || ''}:${page}:${limit}`;

    const data = await getCached(cacheKey, async () => {
      const where = {};
      if (category) where.category = { slug: category };
      if (search) where.name = { contains: search, mode: 'insensitive' };
      if (featured === 'true') where.featured = true;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: { category: { select: { name: true, slug: true } } },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ]);

      return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
    }, 300);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, buyPrice, price, salePrice, category, stock, description, image, featured } = body;

    if (!name || price == null) {
      return NextResponse.json({ error: 'name and price are required' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        buyPrice: buyPrice != null ? buyPrice : null,
        price,
        salePrice: salePrice != null ? salePrice : null,
        stock: stock != null ? stock : 0,
        description: description || '',
        images: image ? [image] : [],
        featured: featured || false,
        categoryId: category || 'default',
      },
    });

    await invalidateCache('products:*');
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

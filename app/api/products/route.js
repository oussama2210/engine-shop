import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCached, invalidateCache } from '@/lib/cache';
import { sanitizeInput, sanitizeObject, validateRequired, validateTypes, types, patterns, requireAuth, handleApiError, withRateLimit, logSecurityEvent } from '@/lib/security';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ? sanitizeInput(searchParams.get('category')) : null;
    const search = searchParams.get('search') ? sanitizeInput(searchParams.get('search')) : null;
    const featured = searchParams.get('featured');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;

    if (search && search.length > 200) {
      return NextResponse.json({ error: 'Search query too long' }, { status: 400 });
    }

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
    return handleApiError(error, request);
  }
}

export async function POST(request) {
  try {
    await withRateLimit(request);
    await requireAuth();
    const body = sanitizeObject(await request.json());

    validateRequired(body, ['name', 'price']);
    validateTypes(body, {
      name: { type: 'string', max: 200, message: 'Product name must be under 200 characters' },
      price: { type: 'number', min: 0, message: 'Price must be a positive number' },
      buyPrice: { type: 'number', min: 0 },
      salePrice: { type: 'number', min: 0 },
      stock: { type: 'integer', min: 0 },
      description: { type: 'string', max: 5000 },
      featured: { type: 'boolean' },
    });

    const { name, buyPrice, price, salePrice, category, stock, description, image, featured } = body;
    const sanitizedName = sanitizeInput(name);

    const slug = sanitizedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name: sanitizedName,
        slug,
        buyPrice: buyPrice != null ? buyPrice : null,
        price,
        salePrice: salePrice != null ? salePrice : null,
        stock: stock != null ? stock : 0,
        description: description || '',
        images: image ? [sanitizeInput(image)] : [],
        featured: featured || false,
        categoryId: category || 'default',
      },
    });

    await invalidateCache('products:*');
    logSecurityEvent('ProductCreated', { productId: product.id, userId: (await auth())?.userId });
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    return handleApiError(error, request);
  }
}

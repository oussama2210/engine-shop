import { NextResponse } from 'next/server';
import { uploadImage, deleteImage, listImages } from '@/lib/storage';
import { requireAuth, handleApiError, withRateLimit, logSecurityEvent } from '@/lib/security';
import { uploadRatelimit } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    await withRateLimit(request, uploadRatelimit);
    await requireAuth();
    
    const formData = await request.formData();
    const file = formData.get('file');
    const productId = formData.get('productId') || 'temp';

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type (PNG, JPG, WebP, GIF only)' }, { status: 400 });
    }

    if (file.name.length > 255) {
      return NextResponse.json({ error: 'Filename too long' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    const dangerousExts = ['html', 'htm', 'js', 'svg', 'xml'];
    if (dangerousExts.includes(ext)) {
      return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 });
    }

    const url = await uploadImage(file, String(productId));
    logSecurityEvent('FileUploaded', { productId, size: file.size, type: file.type });
    return NextResponse.json({ success: true, url });
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function DELETE(request) {
  try {
    await requireAuth();
    const { filePath } = await request.json();
    
    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json({ error: 'filePath is required' }, { status: 400 });
    }

    if (filePath.includes('..') || filePath.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    await deleteImage(filePath);
    logSecurityEvent('FileDeleted', { filePath });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, request);
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const images = await listImages(productId);
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

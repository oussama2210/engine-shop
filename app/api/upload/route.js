import { NextResponse } from 'next/server';
import { uploadImage, deleteImage, listImages } from '@/lib/storage';

export async function POST(request) {
  try {
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

    const url = await uploadImage(file, productId);
    return NextResponse.json({ success: true, url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { filePath } = await request.json();
    if (!filePath) {
      return NextResponse.json({ error: 'filePath is required' }, { status: 400 });
    }
    await deleteImage(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const images = await listImages(productId);
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

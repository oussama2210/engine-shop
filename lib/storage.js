import { getSupabaseAdmin } from './supabase';

const BUCKET = 'products';

export async function ensureBucket() {
  const supabase = getSupabaseAdmin();
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
    });
  }
}

export async function uploadImage(file, productId) {
  const supabase = getSupabaseAdmin();
  await ensureBucket();

  const ext = file.name.split('.').pop().toLowerCase();
  const filePath = `${productId || 'temp'}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return getPublicUrl(filePath);
}

export async function uploadImages(files, productId) {
  const results = await Promise.allSettled(
    files.map((file) => uploadImage(file, productId))
  );
  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : { error: r.reason?.message || 'Upload failed' }
  );
}

export function getPublicUrl(filePath) {
  const supabase = getSupabaseAdmin();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteImage(filePath) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).delete([filePath]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

export async function deleteImages(filePaths) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).delete(filePaths);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

export async function listImages(productId, folder = '') {
  const supabase = getSupabaseAdmin();
  const prefix = folder || (productId ? `${productId}/` : '');
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) throw new Error(`List failed: ${error.message}`);
  return (data || []).map((f) => ({
    name: f.name,
    url: getPublicUrl(`${prefix}${f.name}`),
    created_at: f.created_at,
  }));
}

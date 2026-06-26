const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function api(path, options = {}) {
  const url = `${API_BASE}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

export async function getProducts({ category, search, featured, page, limit } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  if (featured) params.set('featured', featured);
  if (page) params.set('page', String(page));
  if (limit) params.set('limit', String(limit));
  const qs = params.toString();
  return api(`/products${qs ? `?${qs}` : ''}`);
}

export async function getProduct(id) {
  return api(`/products/${id}`);
}

export async function getCategories() {
  return api('/categories');
}

export async function createOrder(data) {
  return api('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getOrderStatus(id) {
  return api(`/orders/${id}`, { next: { revalidate: 0 } });
}

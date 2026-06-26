import { NextResponse } from 'next/server';
import { apiRatelimit, uploadRatelimit, checkRateLimit } from '@/lib/rate-limit';

const ADMIN_AUTH_ENABLED = process.env.ADMIN_AUTH_ENABLED === 'true';

function getIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || '127.0.0.1';
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // ── Admin route protection ──
  if (ADMIN_AUTH_ENABLED && pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('session')?.value;
    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── API rate limiting ──
  if (pathname.startsWith('/api/')) {
    const ip = getIp(request);
    const isUpload = pathname.startsWith('/api/upload');
    const limiter = isUpload ? uploadRatelimit : apiRatelimit;
    const identifier = `${ip}`;

    const result = await checkRateLimit(identifier, limiter);

    const response = result.allowed
      ? NextResponse.next()
      : NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );

    response.headers.set('X-RateLimit-Limit', String(result.limit));
    response.headers.set('X-RateLimit-Remaining', String(Math.max(0, result.remaining)));
    response.headers.set('X-RateLimit-Reset', String(result.reset));

    return response;
  }

  // ── Security headers ──
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

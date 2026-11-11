import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);
export const ACCESS_COOKIE = 'savignac_acces';

async function sha256(value: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Protection board par mot de passe (SITE_PASSWORD) puis internationalisation. */
export default async function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  const { pathname } = req.nextUrl;

  if (password && pathname !== '/acces') {
    const expected = await sha256(`savignac:${password}`);
    if (req.cookies.get(ACCESS_COOKIE)?.value !== expected) {
      const url = req.nextUrl.clone();
      url.pathname = '/acces';
      url.search = pathname === '/' ? '' : `?retour=${encodeURIComponent(pathname + req.nextUrl.search)}`;
      return NextResponse.redirect(url);
    }
  }
  if (pathname === '/acces') return NextResponse.next();
  return intl(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|images|video|.*\\..*).*)'],
};

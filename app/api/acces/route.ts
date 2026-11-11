import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'node:crypto';

const COOKIE = 'savignac_acces';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const given = String(form.get('motdepasse') ?? '');
  const retour = String(form.get('retour') ?? '/');
  const password = process.env.SITE_PASSWORD;
  const safe = retour.startsWith('/') && !retour.startsWith('//') ? retour : '/';

  if (!password || given === password) {
    const res = NextResponse.redirect(new URL(safe, req.url), 303);
    if (password) {
      res.cookies.set(COOKIE, createHash('sha256').update(`savignac:${password}`).digest('hex'), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }
    return res;
  }
  const url = new URL('/acces', req.url);
  url.searchParams.set('erreur', '1');
  if (safe !== '/') url.searchParams.set('retour', safe);
  return NextResponse.redirect(url, 303);
}

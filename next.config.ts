import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { redirects as legacyRedirects } from './content/redirects';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [420, 640, 800, 1080, 1280, 1600, 1920],
    imageSizes: [64, 120, 240, 320],
  },
  async redirects() {
    return legacyRedirects.map((r) => ({ source: r.source, destination: r.destination, permanent: true }));
  },
  async headers() {
    // Démonstration board : rien n'est indexé (section 14).
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

export default withNextIntl(nextConfig);

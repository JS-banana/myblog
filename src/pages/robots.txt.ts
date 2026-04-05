import type { APIContext } from 'astro';
import { SITE } from '@/config/site';

export async function GET(context: APIContext) {
  const site = context.site ?? new URL(SITE.placeholderUrl);
  const sitemapUrl = new URL('/sitemap-index.xml', site);

  return new Response(
    [`User-agent: *`, `Allow: /`, ``, `Sitemap: ${sitemapUrl.href}`].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
}

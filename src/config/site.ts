export const SITE = {
  name: '孙小帅',
  romanName: 'Panionk',
  description: '技术、AI、生活',
  author: '孙小帅',
  locale: 'zh_CN',
  language: 'zh-cn',
  placeholderUrl: 'https://example.com',
  defaultOgImage: '/og-default.svg',
} as const;

export function getSiteTitle(pageTitle?: string, type: 'website' | 'article' = 'website') {
  if (!pageTitle || (type === 'website' && pageTitle === SITE.name)) {
    return SITE.name;
  }

  return `${pageTitle} — ${SITE.name}`;
}

export const SITE = {
  name: '阿帅油',
  description: '技术、AI、生活',
  author: '阿帅油',
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

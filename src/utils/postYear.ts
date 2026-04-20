import type { CollectionEntry } from 'astro:content';
import slugCache from '../content/.slug-cache.json';

interface SlugCacheEntry {
  slug: string;
  title: string;
  year: string;
}

const typedSlugCache = slugCache as Record<string, SlugCacheEntry>;

export function getCanonicalYear(post: CollectionEntry<'posts'>): number {
  const sourcePath = post.data.sourcePath;
  if (sourcePath) {
    const cachedEntry = typedSlugCache[sourcePath];
    if (cachedEntry) {
      const cachedYear = Number(cachedEntry.year);
      if (Number.isInteger(cachedYear)) {
        return cachedYear;
      }
    }
  }

  return post.data.date.getFullYear();
}

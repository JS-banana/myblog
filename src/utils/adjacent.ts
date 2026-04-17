import { getCollection, type CollectionEntry } from 'astro:content';
import { getCanonicalYear } from './postYear';

export interface Neighbors {
  prev: CollectionEntry<'posts'> | null;
  next: CollectionEntry<'posts'> | null;
}

export async function getAdjacentPosts(id: string): Promise<Neighbors> {
  const posts = (await getCollection('posts'))
    .sort((a, b) => +b.data.date - +a.data.date);
  const idx = posts.findIndex((p) => p.id === id);
  if (idx < 0) return { prev: null, next: null };
  return {
    next: posts[idx - 1] ?? null,
    prev: posts[idx + 1] ?? null,
  };
}

export function postHref(post: CollectionEntry<'posts'>): string {
  return `/posts/${getCanonicalYear(post)}/${post.data.slug}`;
}

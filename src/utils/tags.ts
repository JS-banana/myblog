import { getCollection, type CollectionEntry } from 'astro:content';

export interface TagEntry {
  tag: string;
  posts: CollectionEntry<'posts'>[];
  count: number;
}

export async function getAllTags(): Promise<TagEntry[]> {
  const posts = await getCollection('posts');
  const map = new Map<string, CollectionEntry<'posts'>[]>();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)!.push(post);
    }
  }
  return [...map.entries()]
    .map(([tag, posts]) => ({
      tag,
      posts: posts.sort((a, b) => +b.data.date - +a.data.date),
      count: posts.length,
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function tagToSlug(tag: string): string {
  return encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'));
}

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '@/config/site';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sorted = posts.sort(
    (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) =>
      b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: `${SITE.name}的博客`,
    description: SITE.description,
    site: context.site!,
    items: sorted.map((post: CollectionEntry<'posts'>) => {
      const year = post.data.date.getFullYear();
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/posts/${year}/${post.data.slug}/`,
      };
    }),
    customData: `<language>${SITE.language}</language>`,
  });
}

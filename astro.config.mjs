import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com', // 上线后替换为真实域名
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // 使用 CSS 变量适配暗色模式
      theme: 'css-variables',
    },
  },
});

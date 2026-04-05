import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://example.com';

export default defineConfig({
  site, // 域名尚未定稿，当前阶段允许使用占位值
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // 使用 CSS 变量适配暗色模式
      theme: 'css-variables',
    },
  },
});

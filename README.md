# blog

个人技术博客，基于 Astro 构建，采用极简文字流风格。

## 项目定位

这个仓库只负责博客网站和界面功能。文章内容由独立的 `posts` 仓库同步生成，只有标记 `publish: true` 的文章会进入 `src/content/posts/`。

## 开发

```bash
npm install
npm run dev
npm run build
npm run preview
```

常用校验：

```bash
npm run verify
```

## 部署

- 主站：<https://blog.laifuyou.com>
- GitHub Pages 备用：<https://js-banana.github.io/myblog/>
- RSS：<https://blog.laifuyou.com/rss.xml>
- RSS 备用：<https://js-banana.github.io/myblog/rss.xml>

Vercel 负责主站部署，GitHub Pages 作为备用静态出口。GitHub Pages 构建由 `.github/workflows/deploy-pages.yml` 触发。

## 内容约定

- 不手动维护 `src/content/posts/` 下的同步文章。
- slug、description、tags 由同步脚本生成并缓存。
- 新文章图片统一使用 Cloudflare R2 图床。

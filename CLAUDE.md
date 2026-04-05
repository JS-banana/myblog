# blog

个人技术博客项目，基于 Astro 构建，极简文字流风格。

## 项目定位

- 展示仓库，内容由 `posts` 仓库（Obsidian 写作库）通过 GitHub Actions 自动同步
- 只有标注了 `publish: true` 的文章才会同步进来
- slug、description、tags 由同步脚本调用 AI 自动生成，不在源文件手动维护

## 技术栈

- **框架**：Astro（零 JS 默认输出）
- **样式**：纯 CSS 变量，无 Tailwind
- **部署**：Vercel（Git 集成自动部署）
- **图片**：Cloudflare R2（统一图床，新文章使用）

## 目录结构

```
src/
├── content/posts/      # 同步脚本写入，按年份子目录，不要手动修改
├── content.config.ts   # Content Collections schema
├── layouts/            # BaseLayout、PostLayout
├── pages/              # 路由页面
├── components/         # 复用组件
└── styles/global.css   # CSS 变量 + 极简排版
docs/
└── plans/              # 设计方案文档
```

## 内容同步

同步脚本位于 `posts` 仓库的 `.github/scripts/sync-posts.mjs`，推送到 posts 仓库 main 分支时自动触发。

需要配置的 GitHub Secrets：
- `BLOG_REPO_TOKEN` — PAT，具有本仓库写权限
- `AI_API_KEY` — 国内大模型 API Key
- `AI_BASE_URL` — 兼容 OpenAI SDK 的接口地址

## URL 规范

文章 URL 格式：`/posts/{年份}/{slug}`，如 `/posts/2022/koa-onion-model`

slug 由 AI 从标题自动提取，首次生成后通过 `src/content/.slug-cache.json` 缓存固定，不会改变。

## 开发

```bash
npm install
npm run dev      # 本地开发
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

## 设计规范

- 内容宽度上限 640px，大量留白
- 颜色通过 CSS 变量管理，支持亮色/暗色模式
- 无 JavaScript 框架依赖，ThemeToggle 为纯 Astro 组件
- SEO：Open Graph、JSON-LD、sitemap、RSS 全部覆盖

## 参考资料

- 设计方案：`docs/plans/blog-rebuild-plan.md`
- 视觉参考：https://tw93.fun

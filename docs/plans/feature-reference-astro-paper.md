# 功能参考：astro-paper

> 来源：https://github.com/satnaing/astro-paper (4400+ stars, MIT)
> 用途：后续迭代的功能参考和实现思路，不直接使用其代码
>
> 说明：本文件是功能灵感清单；源码级验证结论见 `docs/plans/reference-study-tw93-astropaper-source.md`。

## 1. 动态 OG 图生成

**价值**：每篇文章自动生成社交分享卡片图，无需手动设计。

**astro-paper 实现方式**：
- 使用 `satori`（JSX → SVG）+ `@resvg/resvg-js`（SVG → PNG）在构建时生成
- 模板定义在 `src/utils/og-templates/`，分 post 和 site 两个模板
- 支持文章级别自定义 OG 图（frontmatter 中指定 `ogImage`）
- 通过 `SITE.dynamicOgImage` 开关控制是否启用
- 使用 Google Fonts 加载自定义字体到 OG 图中

**我们的接入思路**：
- 安装 `satori` + `@resvg/resvg-js`
- 创建 OG 图模板（可用极简文字风格，匹配博客整体调性）
- 在 `src/pages/posts/[...slug].png.ts` 创建动态 endpoint
- Head 组件中将 OG 图 URL 指向生成的 PNG

## 2. Pagefind 静态搜索

**价值**：构建时索引全站内容，支持中文分词，零服务端，客户端体积小。

**astro-paper 实现方式**：
- 安装 `pagefind` + `@pagefind/default-ui`
- 构建后执行 `pagefind --site dist` 自动索引
- 搜索页 `/search` 使用 `@pagefind/default-ui` 渲染搜索框和结果
- 键盘快捷键 `/` 聚焦搜索（可选）

**我们的接入思路**：
- `npm install pagefind @pagefind/default-ui`
- 新增 `src/pages/search.astro` 页面
- `package.json` build 脚本改为 `astro build && pagefind --site dist`
- Header 中加搜索入口链接

## 3. View Transitions（页面切换动画）

**价值**：页面导航时平滑过渡，提升浏览体验，类似 SPA 效果。

**astro-paper 实现方式**：
- 使用 Astro 内置 `<ViewTransitions />` 组件
- 在 `Layout.astro` 的 `<head>` 中引入
- 为文章卡片等元素设置 `transition:name` 实现元素级动画
- 暗色模式需要在 `astro:before-swap` 和 `astro:after-swap` 事件中同步主题，防止切换闪烁
- `meta[name=theme-color]` 也需在 transition 事件中更新（Android 导航栏颜色）

**我们的接入思路**：
- 在 `BaseLayout.astro` 的 `<head>` 中加 `<ViewTransitions />`
- 在 Head 组件的主题初始化脚本中添加 view transition 事件监听
- 逐步为 PostList 等组件加 `transition:name`

## 4. 草稿与定时发布

**价值**：`draft: true` 文章开发时可见、生产隐藏；未来日期文章自动延迟上线。

**astro-paper 实现方式**：
- frontmatter 支持 `draft: boolean`
- `src/utils/postFilter.ts` 过滤函数：生产环境排除 draft 和未来日期文章
- `scheduledPostMargin`（默认 15 分钟）允许定时发布文章提前少量时间上线，补偿构建延迟
- dev 模式下所有文章可见，方便预览

**我们的接入思路**：
- Content schema 中加 `draft: z.boolean().default(false)`
- 在 getCollection 调用时加过滤：`getCollection('posts', ({ data }) => !data.draft)`
- 同步脚本中：源文章没有 `publish: true` 的已经不会同步，draft 字段作为博客仓库内的二次控制

## 5. 代码块复制按钮

**价值**：技术博客核心体验，读者一键复制代码。

**astro-paper 实现方式**：
- 通过内联 `<script>` 在页面加载后遍历所有 `<pre>` 元素
- 为每个代码块注入一个复制按钮（绝对定位在右上角）
- 点击后调用 `navigator.clipboard.writeText()`
- 复制成功后按钮文字/图标短暂变为 "已复制" 反馈

**我们的接入思路**：
- 在 `PostLayout.astro` 底部加一段内联脚本
- 遍历 `.prose pre` 注入按钮
- 纯 CSS 定位 + 纯 JS 逻辑，不需要任何框架

## 6. 文章内上下篇导航

**价值**：引导读者继续阅读，提升页面浏览深度。

**astro-paper 实现方式**：
- 在 `PostDetails.astro` 中获取排序后的全部文章列表
- 找到当前文章的前后索引
- 在文章底部渲染 "上一篇" / "下一篇" 链接

**我们的接入思路**：
- 在 `[...slug].astro` 的 `getStaticPaths` 中，为每篇文章的 props 注入 prev/next
- 在 `PostLayout.astro` 底部渲染导航链接

## 7. TOC 自动生成

**价值**：长文导航，方便读者跳转到感兴趣的章节。

**astro-paper 实现方式**：
- 使用 `remark-toc` + `remark-collapse` 插件
- 在 `astro.config.mjs` 中配置 remark 插件
- 文章中写 `## Table of Contents` 即自动生成目录
- `remark-collapse` 将目录折叠为可展开区域

**替代方案**：
- 不用 remark 插件，而是用 Astro 的 `render()` 返回的 `headings` 数组
- 在 PostLayout 中渲染为侧边栏或文章顶部的目录组件
- 这种方式更灵活，可以做成固定侧边 TOC

## 8. 社交分享按钮

**价值**：方便读者分享文章到社交平台。

**astro-paper 实现方式**：
- `src/components/ShareLinks.astro` 组件
- 支持平台：WhatsApp、Facebook、X (Twitter)、Telegram、Pinterest、Email
- 通过 URL scheme 构造分享链接（`https://twitter.com/intent/tweet?text=...&url=...`）
- 在 `src/constants.ts` 中配置启用的平台列表

**我们的接入思路**：
- 创建 `ShareLinks.astro` 组件
- 在 PostLayout 文章底部引入
- 根据需要选择平台（微信比较特殊，可能需要二维码方式）

---

## 其他值得关注的细节

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 标题锚点链接 | 鼠标悬停标题时出现 `#` 锚点，方便复制深链接 | 中 |
| 滚动进度条 | 文章页顶部的阅读进度条 | 低 |
| 返回顶部按钮 | 长文滚动后出现 | 低 |
| 自定义 404 页面 | 友好的 404 提示 | 中 |
| RTL 支持 | 从右到左文字方向 | 不需要 |
| Docker 支持 | 容器化开发环境 | 低 |
| 图片灯箱 | 点击图片放大查看（社区请求中，尚未实现） | 中 |

---

## 技术依赖速查

当实现以上功能时可能需要的包：

```
satori @resvg/resvg-js     # 动态 OG 图
pagefind @pagefind/default-ui  # 静态搜索
remark-toc remark-collapse    # TOC 自动生成
@shikijs/transformers          # 代码块增强（diff 高亮、行号、文件名）
dayjs                          # 日期格式化（如需更灵活的格式）
```

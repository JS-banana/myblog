# 参考源码研究：tw93 + AstroPaper（source-level）

> 目的：基于源码而不是页面截图，提炼可落地的借鉴点，避免“看起来像”但实现代价失控。
>
> 研究日期：2026-04-08
> 研究仓库快照：
> - `satnaing/astro-paper` @ `f3005328e548805226aba54414122c7174645e83`
> - `tw93/tw93.github.io` @ `b2498898a5bb5f010712411c5f7ff3885117d284`

## 1) 我们当前基线（对照起点）

- 首页当前仅 `PostList + Pagination`，无内容层次分区：
  - `src/pages/index.astro`（按时间排序 + slice）
- 列表项当前仅标题+日期：
  - `src/components/PostList.astro`
- 文章页当前仅正文、时间、tag，无上一篇/下一篇、复制代码、阅读进度：
  - `src/layouts/PostLayout.astro`
- 顶部导航当前仅“文章/关于”，无搜索、归档、标签入口：
  - `src/components/Header.astro`
- SEO 与主题初始化已具备基础能力：
  - `src/components/Head.astro`

## 2) tw93 源码可借鉴点（首页气质与内容流）

### 2.1 首页本质是“时间流”，但每条有摘要信息

- `tw93.github.io/_layouts/home.html` 使用 `include post-item` 渲染列表，并保留分页逻辑。
- `tw93.github.io/_includes/post-item.html` 中单条结构是：
  - `title`
  - `date`（方括号样式）
  - `summary`

**结论**：你定的“首页就是文章列表”与源码一致，但不是“仅标题索引”；它是“带摘要的内容流”。

### 2.2 导航很克制，但搜索入口前置

- `tw93.github.io/_includes/header.html` 的菜单项包含 `Weekly`、`About`，并在 header 右侧固定搜索按钮。

**结论**：不需要首页塞“我是谁”，但需要把“找内容”的入口前置（搜索/筛选/归档之一）。

### 2.3 风格是“留白 + 字体层次 + 摘要节奏”，不是炫技组件堆叠

- `_sass/_page.scss` 中列表标题字号、摘要字号、行高都做了层次分离。

**结论**：可借鉴的是阅读节奏，不是复制同款动画或 Jekyll 机制。

## 3) AstroPaper 源码可借鉴点（功能模块清单）

### 3.1 首页内容组织：Featured + Recent（可选）

- `astro-paper/src/pages/index.astro`：
  - 统一排序 `getSortedPosts`
  - 分离 `featured` 与 `recent`
  - 保持 `All Posts` 作为总入口

**结论**：我们可以保持“首页=文章列表”，但增加轻编辑能力（精选/置顶）而不门户化。

### 3.2 文章页增强是模块化组合，不是单点大改

- `astro-paper/src/layouts/PostDetails.astro`：
  - 上下篇
  - 分享组件
  - 回到顶部
  - 滚动进度
  - 标题锚点
  - 代码复制按钮

**结论**：文章页增强可以按模块逐项接入，适合迭代推进。

### 3.3 搜索、归档、标签均为独立页面

- 搜索：`src/pages/search.astro`（Pagefind UI + URL `q` 参数同步）
- 归档：`src/pages/archives/index.astro`（按年/月分组）
- 标签：`src/pages/tags/index.astro`（聚合 tag）

**结论**：信息架构上应避免把所有发现能力挤在首页，首页保持时间流主路径即可。

### 3.4 构建链路的取舍要谨慎

- AstroPaper `build` 包含 `pagefind --site dist && cp -r dist/pagefind public/`。
- 我们当前 `build` 仍是纯 `astro build`。

**结论**：搜索是高价值项，但引入 Pagefind 会改变构建链路和依赖；应在 Next 阶段引入，不放在首页第一轮 UI 改造里。

## 4) 可借鉴 / 不借鉴决策

## 4.1 必借鉴（短期）

- 首页列表项增加摘要（保持时间流主体）
- 首页支持“轻编辑”字段：`featured` 或 `series`（最多一种先落地）
- 文章页补上一篇/下一篇
- 文章页补代码复制按钮
- 站点导航新增“搜索”或“归档”入口（至少一个）

## 4.2 条件借鉴（中期）

- Pagefind 搜索（依赖 + 构建改造）
- 归档页（年/月分组）
- 标签页（tag 聚合与规范化）
- 阅读进度条、标题锚点

## 4.3 明确不借鉴（当前阶段）

- 不引入 Tailwind 体系，继续沿用当前纯 CSS 变量
- 不把首页改成“个人介绍页/门户页”
- 不复制 tw93 的 Jekyll 模板结构与历史兼容逻辑

## 5) 使用真实内容验证的约束

验证内容使用：`/Users/sunss/myself/posts/blog`（当前 23 篇，2021-2026 分布）。

注意点：
- 源文中存在旧字段（如 `permalink/categories`），以 receiver contract 为准落库。
- 列表摘要优先使用 `description`，缺失时再用正文截断生成，避免布局抖动。
- 验证时必须覆盖：短标题、超长标题、长正文、包含代码块文章。

## 6) 对本项目的最终策略（本研究输出）

- `tw93.fun`：作为首页/站点气质参考（内容流形态）
- `AstroPaper`：作为功能路线参考（模块清单）
- 本仓库：坚持当前 Astro + 纯 CSS + content contract，不做技术栈漂移

下一份执行文档：`docs/plans/blog-iteration-roadmap.md`

# 博客 V1/P0 本地完成 checklist

> 依据：`docs/plans/blog-rebuild-plan.md`、`docs/plans/blog-rebuild-plan-review.md`、`.omx/plans/prd-docs-plans-blog-rebuild.md`、`.omx/plans/test-spec-docs-plans-blog-rebuild.md`
>
> 目标：验证 **local completion**，不验证域名、部署、GitHub push、远端 `posts` 同步联通。

## 1. Docs / Scope
- [ ] `docs/plans/blog-rebuild-plan.md` 明确区分 local completion 与 launch。
- [ ] `docs/plans/blog-rebuild-plan-review.md` 仍作为评审补充记录，不被改写成执行计划。
- [ ] `docs/plans/blog-rebuild-v1-checklist.md` 与 PRD / test spec 的边界一致。
- [ ] `feature-reference-astro-paper.md` 仍明确后置，不出现在本轮 V1/P0 必做项里。
- [ ] 当前阶段的非目标明确写出：域名、部署、GitHub push、远端 sync、astro-paper backlog。

## 2. App Baseline
- [ ] 首页能显示最新文章列表。
- [ ] 当文章数量超过分页阈值时，`/page/2` 及后续分页可访问。
- [ ] `/posts/{year}/{slug}` 能渲染示例文章。
- [ ] `/about` 页面可访问。
- [ ] `/rss.xml` 正常生成。
- [ ] 主题初始化和主题切换可用，且无明显闪烁回退。
- [ ] 文章页、列表页、页脚、头部的基础排版保持可读。

## 3. Content Contract
- [ ] `src/content.config.ts` 支持本阶段需要的最小 receiver contract。
- [ ] `updated` / `sourceId` 若出现，仅作为预留/可选字段处理。
- [ ] `src/content/.slug-cache.json` 存在且为有效 JSON。
- [ ] `src/content/.redirects.json` 存在且为有效 JSON。
- [ ] 至少一篇 sample/generated content 证明 frontmatter、slug、source/sourcePath 的落地方式。
- [ ] 不引入 generalized sync engine，不把 receiver contract 扩展成远端自动化实现。

## 4. SEO / Redirect Baseline
- [ ] canonical 正常输出。
- [ ] OG / Twitter Card / JSON-LD 正常输出。
- [ ] preview noindex 在非生产/预览上下文仍然生效。
- [ ] placeholder 域名不阻塞本地 build。
- [ ] `src/content/.redirects.json` 作为本地 source of truth 被清楚记录。
- [ ] 文档中明确：当前阶段不验证真实上线 301 行为。
- [ ] 可变品牌名 / site metadata 的改动成本保持较低。

## 5. Local Verification
- [ ] `npm run build` 通过。
- [ ] 如新增本地校验脚本，则脚本本身通过。
- [ ] 验证结果逐条对照 test spec 的 A-E 记录，而不是只写“build 过了”。
- [ ] 明确列出所有仍然 deferred 的事项。

## 6. Exit Criteria
满足以下条件后，才可把本阶段视为完成：
1. 上述 checklist 全部勾选。
2. `.omx/plans/test-spec-docs-plans-blog-rebuild.md` 的相关项有可追踪证据。
3. 未把 launch 阶段事项悄悄算进本阶段完成条件。

## 7. Evidence Format
- Docs：变更文件列表 + 对应 checklist 项
- App：路由 / 页面 / RSS / 主题的本地检查结果
- Content contract：schema 与 JSON 结构证明
- SEO / redirect：head 输出与 redirect 文档证据
- Verification：命令输出摘要 + test spec 对照
- Deferred：明确列出仍在后置的 launch 项目

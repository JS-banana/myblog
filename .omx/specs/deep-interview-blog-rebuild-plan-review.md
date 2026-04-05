# Deep Interview Spec — blog-rebuild-plan-review

## Metadata
- Profile: standard
- Rounds: 3
- Final ambiguity: 0.134
- Threshold: 0.20
- Context type: greenfield-with-plan-artifact
- Context snapshot: `.omx/context/blog-rebuild-plan-review-20260404T083143Z.md`
- Transcript: `.omx/interviews/blog-rebuild-plan-review-20260404T084318Z.md`

## Clarity breakdown
| Dimension | Score |
|---|---:|
| Intent | 0.90 |
| Outcome | 0.85 |
| Scope | 0.82 |
| Constraints | 0.90 |
| Success Criteria | 0.72 |

Readiness gates:
- Non-goals: explicit
- Decision boundaries: explicit
- Pressure pass: complete

## Intent
在正式搭建 Astro 博客前，对现有重建方案做一次偏架构和运营维度的评审，目标不是推翻方案，而是提前补齐会在 V1 上线后暴露的治理与维护缺口，减少返工。

## Desired Outcome
得到一份更稳妥的博客重建方案：
1. V1 可以快速上线；
2. 内容同步链路可观测、可失败恢复；
3. URL / slug / SEO 不容易在后期失控；
4. AI 生成元数据有明确兜底策略；
5. V1 与 V2 边界足够清晰。

## In Scope
- 评审 `docs/plans/blog-rebuild-plan.md`
- 补充 V1 必需但原文未完全明确的治理项与工程项
- 给出风险补丁和验收补丁
- 同时兼顾短期上线与长期维护

## Out of Scope / Non-goals
以下明确为 V1 非目标：
- 站内搜索
- 评论系统
- 标签归档页
- 历史图片资源迁移
- 复杂后台 / 编辑系统
- 访问统计面板

## Decision Boundaries
允许 OMX / 方案评审直接给出的补充决策：
- 可建议为 AI 元数据增加 frontmatter 手动覆盖机制
- 可建议增加同步链路观测、重试、失败保护、预检机制
- 可建议补充 URL / redirect / canonical / metadata 稳定性策略
- 可建议细化实施顺序与验收标准

不应越界假设的内容：
- 不直接把 V2 功能抬进 V1
- 不引入重型 CMS / 后台系统
- 不假设需要复杂用户系统或数据库

## Constraints
- 技术栈保持 Astro + 纯 CSS + Vercel
- 内容来源仍为独立 `posts` 仓库
- 站点风格保持极简、文字流、低 JS
- 不新增非必要依赖和复杂系统
- 同步机制仍以 GitHub Actions 为主

## Testable Acceptance Criteria
- 方案文档应明确 AI 元数据的人工作兜底规则
- 方案文档应明确 slug 稳定性与未来变更时的 URL 策略
- 方案文档应明确同步失败时的最小保护措施（日志、失败提示、重试、避免脏写）
- 方案文档应明确 V1 非目标，避免范围蔓延
- 方案文档应补充更可执行的上线验收项，而不只是“页面能打开”

## Assumptions exposed + resolutions
1. **假设：AI 生成元数据足够稳定，无需人工干预**  
   - Resolution: 否。接受 frontmatter 手动覆盖 `slug` / `description` / `tags`。
2. **假设：V1 只要尽快上线即可，不必考虑长期治理**  
   - Resolution: 否。用户明确要求一并考虑。
3. **假设：V1 可能继续扩张到搜索/评论/统计等能力**  
   - Resolution: 否。用户已明确列为非目标。

## Pressure-pass findings
通过对 AI 元数据链路做反向压力测试，确认原方案的最大缺口不是框架选型，而是“元数据治理缺少兜底”。因此建议把“手动优先、AI 兜底、缓存固化”写成明确规则。

## Technical context findings
当前方案已经比较完整，主要优势：
- 技术栈选择克制，符合博客场景
- 内容与展示仓分离，职责清晰
- 路由与 schema 初稿已经足够接近实现

当前方案主要缺口：
1. **内容治理缺口**：AI 元数据没有 manual override 入口
2. **同步工程缺口**：没有写清 dry-run / diff / failure report / idempotency
3. **URL 稳定性缺口**：只有旧 VuePress 重定向，缺少未来 slug 调整时的映射策略
4. **SEO 细节缺口**：缺少 canonical、文章级 OG 图策略、发布日期/更新时间策略
5. **上线验收缺口**：缺少结构化的 acceptance checklist

## Recommended plan supplements
### P0（建议补进 V1 方案）
1. **元数据覆盖规则**  
   - frontmatter 若存在 `slug` / `description` / `tags`，则优先手动值；缺失时才调用 AI。  
   - `slug` 一旦生成后应长期稳定，不因正文小改动重新生成。
2. **同步链路的幂等与可观测性**  
   - 同步脚本支持 dry-run / summary 输出。  
   - workflow 失败时给出失败文章列表。  
   - 当 AI 调用失败时，不应产生半成品写入。
3. **slug 稳定性策略**  
   - 不要只用 `标题 + 内容 hash` 作为 slug 缓存键；正文小改会导致重新命中失败。  
   - 更稳妥的是以 `source path + 首次生成 slug`（或显式 `source id`）固化映射。
4. **URL 稳定策略**  
   - 保留一个 redirect map（如 `src/content/.redirects.json` 或同步侧维护映射）。  
   - 未来若 slug 手动修正，可自动生成 301。
5. **SEO 最小补丁**  
   - 明确 canonical URL。  
   - 明确 `publishedTime` / `modifiedTime` 来源。  
   - 明确默认 OG 图与文章级 OG 图 fallback 规则。
6. **上线验收清单**  
   - 首页、分页、文章页、RSS、sitemap、about、暗黑模式、OG、重定向、同步日志都要有明确检查项。

### P1（强烈建议预留）
1. **frontmatter 增加 `updated` 可选字段**：以后支持更新时间，不强制 V1 全量补。
2. **source filename / source path 持久化**：方便溯源与后续重定向。
3. **同步摘要 PR/commit message 规范**：便于回溯是哪次内容同步带来的变更。
4. **草稿预检命令**：本地先跑 sync dry-run，再正式推送。

### P2（后续可选）
1. 标签页
2. Pagefind 搜索
3. 评论系统
4. 图片迁移自动化

## Brownfield evidence vs inference
- Evidence: 当前方案文档已明确双仓、Astro、AI 生成元数据、slug cache、旧 URL 重定向、V2 预留项。
- Inference: 未来最可能的返工点将来自 metadata governance、sync observability、URL evolution，而不是页面实现本身。

## Condensed transcript
- 用户希望同时兼顾 V1 上线和长期治理。
- 用户接受 AI 元数据的 frontmatter 手动覆盖兜底。
- 用户明确将搜索、评论、标签归档、历史图片迁移、复杂后台、统计面板排除出 V1。

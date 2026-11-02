# 0103abc 的网站

[访问网站](https://0103abc.github.io/) · [题解列表](https://0103abc.github.io/solution_list.html) · [题库与在线判题](https://0103abc.github.io/oj/) · [做题记录](https://0103abc.github.io/solve_list.html)

0103abc 的个人网站，基于 [Astro](https://astro.build/) 和 [astro-koharu](https://github.com/cosZone/astro-koharu) 主题，记录算法题解与学习过程。

## 内容与旧链接

迁移保留原站全部 4 篇题解、1 条做题记录、在线对拍器和 AI 猫娘应用。题解列表支持搜索、OJ 筛选和分页；全文搜索使用 Pagefind。

| 原有网址 | 新文章网址 |
| --- | --- |
| `/solutions/CF1654F.html` | `/post/CF1654F` |
| `/solutions/P16910.html` | `/post/P16910` |
| `/solutions/P14510.html` | `/post/P14510` |
| `/solutions/p1001.html` | `/post/p1001` |

原有题解网址仍直接显示完整正文。`/solution_list.html`、`/solve_list.html`、`/duipai-online.html` 和 `/ai/catgirl/` 均保留。

原始网站逐字节存档在 [`migration/original/`](migration/original/)，SHA-256 校验和、原站提交及主题提交记录在 [`migration/manifest.json`](migration/manifest.json)。原文中的公式、C++ 代码与既有作者标注均保留；只修复 CF1654F 文末多余的 Markdown 代码围栏，P1001 从 HTML 转为 Markdown。旧版工具源码保持不变；GitHub Pages 与原站一样不能执行 PHP，其服务能力仍取决于原有外部接口或用户自行配置的后端。

## 在网页写博客

打开 [写作室](https://0103abc.github.io/editor/)，在「文章属性」中填写标题、日期、标签和分类，在编辑区写 Markdown 并实时预览，然后点击右上角「发布」。草稿自动保存在当前浏览器，也可下载 Markdown 备份。

新文章的发布时间默认填入当前时刻，按浏览器本地时区显示；可手动切换 UTC−12:00 到 UTC+14:00（包含半小时、45 分钟偏移），换算时保留同一实际时刻，保存为 UTC ISO 8601 字符串。已有文章日期保持不变。

首次发布按面板提示创建 GitHub fine-grained token：Resource owner 为 `0103abc`，Repository access 只选 `0103abc.github.io`，Contents 权限为 **Read and write**。在写作室连接后即可直接发布；不需要本地 Git 或终端。令牌仅存在当前页面内存中，不进入文章、仓库、localStorage 或 sessionStorage。

发布会在 `main` 分支的 `src/content/blog/` 下创建新 Markdown 文件，并将本次发布副本的 `draft` 设为 `false`；GitHub Actions 自动构建和部署。完成前可从面板查看发布进度。网页入口仅允许 `0103abc` 账号发布，重复地址会被拒绝，原有文章和题解不会被覆盖。现阶段支持**新文章发布**；编辑已有文章请使用 GitHub 仓库编辑器。详细说明见 [网页发布指南](docs/features/github-publishing.md)。

## GitHub 登录评论

文章底部通过 [giscus](https://giscus.app/zh-CN) 提供评论，访客可使用自己的 GitHub 账号登录。评论保存在本仓库的 GitHub Discussions → General 中，也可以直接在 GitHub 中管理。giscus GitHub App 已授权此仓库，配置位于 `config/site.yaml`。旧题解网址与新文章网址共用同一条讨论。

## Hydro 题库与在线判题

[博客题库入口](https://0103abc.github.io/oj/)连接现有的 [Hydro OJ](https://hydro.tail6c7680.ts.net/)，提供题库、代码提交、评测记录、排名、训练及比赛入口，支持按题库域和题号直达。保留 Hydro 原有账号、访问权限、题目、测试数据与提交记录；OJ 使用原 Hydro 账号，博客评论使用 GitHub 账号。

后端运行在自有电脑的 WSL `Ubuntu-Recovered` 中，复用原有 MongoDB、HydroJudge、沙箱和 Tailscale Funnel HTTPS 入口，不购买服务器或域名。需保持电脑、WSL 及网络运行；关机或休眠时 OJ 会离线，GitHub Pages 博客和 giscus 评论独立运行。软件和托管使用免费方案，本机电费及网络费用由设备所有者承担。

博客直接打开原 OJ 的实时题库与记录，不复制或重建数据库，因此在 Hydro 中增题、出比赛和提交后即可看到最新数据。连接地址及题库域位于 [`src/data/hydro.json`](src/data/hydro.json)。恢复和备份说明见 [Hydro 运维说明](docs/features/hydro.md)。

## 本地运行

需要 Node.js >= 22.20.0（建议 Node.js 24）和 pnpm 10.28.2。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

构建与校验：

```sh
pnpm lint:fix
pnpm check
pnpm build
node scripts/verify-migration.mjs
```

站点信息和导航配置在 [`config/site.yaml`](config/site.yaml)。文章位于 `src/content/blog/`；原站题解的难度等补充信息以及做题记录在 `src/data/legacy.json`。新文章按主题的 frontmatter 格式添加；`link` 字段保持稳定，`categories: [[题解, 洛谷]]` 的文章自动显示在题解目录。

## GitHub Pages 部署

1. 将本项目源码提交到本仓库的 `main` 分支。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. [部署工作流](.github/workflows/deploy.yml)会安装依赖、检查类型、构建、验证迁移完整性并部署 `dist/`。

无需修改域名，正式地址仍为 https://0103abc.github.io/ 。旧站版本可以从 Git 历史和迁移存档恢复。

## 版权、许可与致谢

- **站点与内容**：本站由 [0103abc](https://github.com/0103abc) 维护。0103abc 原创文章的版权归 0103abc；转载、引用、代码及其他第三方材料的权利归相应权利人，署名及授权以各篇原文标注为准。迁移不改变文章原有的版权归属或授权，文章未新增统一的开放内容许可。P1001 原文的 ChatGPT 生成标注予以保留。
- **主题代码**：基于 [cosZone/astro-koharu](https://github.com/cosZone/astro-koharu)，由 **cosine（余弦 / yusixian）及 astro-koharu 贡献者**开发。本仓库保留原主题的 **GNU Affero General Public License version 3（AGPL-3.0）**，主题及其修改依该许可提供；完整许可见 [`LICENSE`](LICENSE)，上游署名与说明见 [主题原始 README](https://github.com/cosZone/astro-koharu/blob/main/README.md) 和 [`NOTICE`](NOTICE)。本站迁移、配置和兼容性修改由 0103abc 维护，不代表主题由 0103abc 原创。
- **设计来源**：astro-koharu 的设计灵感来自 [amehime/hexo-theme-shoka](https://github.com/amehime/hexo-theme-shoka)。保留网站页脚中的主题和设计来源链接。
- **评论与判题**：评论由 [giscus](https://github.com/giscus/giscus) 提供（MIT）；在线判题由独立部署的 [Hydro](https://github.com/hydro-dev/Hydro) 提供（AGPL-3.0）。各项目及依赖适用各自许可，其版权不归本站所有。
- **头像**：使用站点维护者指定的 [Codeforces 头像](https://codeforces.com/userpic.codeforces.org/5323692/title/a26d018dce6b24da.jpg)，在本仓库保存本地副本。该图片保留原权利归属，不因收录而适用主题代码许可，也不声明为本站原创。
- **其他依赖与素材**：第三方依赖、字体、图标及图片仍适用各自许可与权利声明；不将第三方素材或原站文章一概声明为 0103abc 所有，也不将代码许可自动扩展为对全部内容和素材的授权。

主题版本：7.7.4；本次基于上游提交 `329ce55513a8057708c93c11c5b8c096680ad83c`。本站完整源码：[0103abc/0103abc.github.io](https://github.com/0103abc/0103abc.github.io)。

# 0103abc 的网站

[访问网站](https://0103abc.github.io/) · [题解列表](https://0103abc.github.io/solution_list.html) · [做题记录](https://0103abc.github.io/solve_list.html)

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
- **其他依赖与素材**：第三方依赖、字体、图标及图片仍适用各自许可与权利声明；不将第三方素材或原站文章一概声明为 0103abc 所有，也不将代码许可自动扩展为对全部内容和素材的授权。

主题版本：7.7.4；本次基于上游提交 `329ce55513a8057708c93c11c5b8c096680ad83c`。本站完整源码：[0103abc/0103abc.github.io](https://github.com/0103abc/0103abc.github.io)。

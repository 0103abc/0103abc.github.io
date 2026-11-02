# Hydro 题库

博客 `/oj/` 是已有 Hydro 的入口。题库、提交、排名与账号由同一个 Hydro 数据库提供，无需在两个网站之间导入、覆盖或定时复制。博客本身仍由 GitHub Pages 托管。

## 当前连接

- 公网地址：<https://hydro.tail6c7680.ts.net/>
- WSL 发行版：`Ubuntu-Recovered`
- HTTP 转发：Tailscale Funnel → `127.0.0.1:9080`（Caddy）→ `127.0.0.1:8888`（Hydro）
- MongoDB：`127.0.0.1:27017`；判题沙箱：`127.0.0.1:5050`，仅监听本机。
- 数据目录：`/data/db`、`/data/file`；Hydro 配置与自定义插件：`/root/.hydro`。

保留原站的登录要求和五个域：`system`、`codeforces`、`atcoder`、`qoj`、`uoj`。挂载的外站题库与远程判题仍取决于各平台和原有账号绑定情况；本机 C++ 编译、自测与判题服务已验证。

本次恢复前已在服务停止时备份数据库、文件、配置与 PM2 进程清单：

```text
/var/backups/hydro/pre-blog-sync-20261102T015732Z.tar
```

备份保存在 WSL 内，限 root 读取。它可能包含账号信息和配置密钥，请勿上传公开仓库。它与数据库在同一虚拟磁盘内，需要长期容灾时应自行另存到其他磁盘。本次没有重装 Hydro 或初始化数据库。

## 启动与检查

在 Windows PowerShell 中启动已有发行版：

```powershell
wsl -d Ubuntu-Recovered -u root
```

在 WSL 中检查：

```sh
export PATH="/root/.nix-profile/bin:/opt/gcc-16.2.0/bin:$PATH"
pm2 list
tailscale funnel status
```

`caddy`、`mongodb`、`hydro-sandbox`、`hydrooj` 四个进程应为 `online`。已保存 PM2 清单并启用 `pm2-root.service`，在发行版启动时恢复；`tailscaled.service` 已启用。不要在仍有服务运行时再次运行 Hydro 安装器。

如果需要手动恢复已保存的进程：

```sh
pm2 resurrect
```

公网入口复用已有的 Tailscale Funnel。当前配置相当于：

```sh
tailscale funnel --bg http://127.0.0.1:9080
```

主机原 80 端口有冲突，因此 Caddy 使用 9080，仅绑定 loopback；原 Caddyfile 已备份在 `/var/backups/hydro/Caddyfile-before-blog-sync`。无需开放 MongoDB 或沙箱到公网。

电脑关机、休眠、WSL 被停止或网络中断时无法判题。WSL 服务自启并不等于 Windows 开机自动启动此发行版。重新启动 Windows 后需启动上述 WSL 发行版。

## 修改博客入口

编辑 `src/data/hydro.json` 的 `baseUrl` 和 `domains`，重新部署博客即可。此文件只有公开入口配置；数据库 URI、密码、GitHub OAuth 密钥和测试数据均不放在博客源码中。

博客的 giscus 评论与 OJ 登录互相独立。giscus 使用 GitHub 账号；Hydro 保留已有登录方式，没有新建或重置用户密码。

## 软件来源

Hydro：<https://github.com/hydro-dev/Hydro>，AGPL-3.0。免费公网转发服务说明：<https://tailscale.com/docs/features/tailscale-funnel>。部署使用现有环境，不需要新增付费服务器、域名或 API；电力与网络由本机承担。

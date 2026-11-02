---
title: "CF1929E Sasha and the Happy Tree Cutting 题解"
date: "2026-02-02T08:35:15.000Z"
link: "luogu-nix4ibzh"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "状态压缩"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/nix4ibzh)。

难度：$3/10$

感觉是没啥难度的题。先考虑一个暴力的 dp：设 $f_i$ 表示当前处理了 $i$ 集合内所有的简单路径，至少需要染几条边。初始条件是 $f_0=0$。然后再维护一下 $g_i$ 表示 $i$ 连向其父亲的边被哪些简单路径覆盖了，转移就是简单的了，直接 $f_{i\cup g_i}\leftarrow f_i+1$ 即可。

直接暴力 dp 时间复杂度是 $O(n2^k)$ 的，无法通过。但是注意到因为 $k$ 很小，所以本质不同的 $g_i$ 是 $O(k)$ 级别的，因此只需要转移 $O(k)$ 轮即可，总时间复杂度优化到 $O(k2^k)$ 可以通过该题。

```cpp line-number
namespace Loyalty
{
    vector<int> adj[N];
    int dep[N], up[N], f[N], g[N], vis[N];
    inline void dfs(int u, int fa)
    {
        up[u] = fa, dep[u] = dep[fa] + 1;
        for (int &v : adj[u])
            if (v != fa)
                dfs(v, u);
    }
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        fill(g + 1, g + n + 1, 0ll);
        for_each(adj + 1, adj + n + 1, [&](auto &edges) { edges.clear(); });
        for (int i = 1; i < n; ++i)
        {
            int a, b;
            cin >> a >> b;
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
        }
        dfs(1, 0);
        int k;
        cin >> k;
        for (int i = 0; i < (1 << k); ++i)
            f[i] = inf, vis[i] = 0;
        f[0] = 0;
        for (int i = 0; i < k; ++i)
        {
            int a, b;
            cin >> a >> b;
            if (dep[a] < dep[b])
                a ^= b ^= a ^= b;
            while (dep[a] != dep[b])
                g[a] |= (1 << i), a = up[a];
            while (a != b)
            {
                g[a] |= (1 << i), g[b] |= (1 << i);
                a = up[a], b = up[b];
            }
        }
        for (int i = 1; i <= n; ++i)
            if (!vis[g[i]])
            {
                vis[g[i]] = 1;
                for (int j = (1 << k) - 1; ~j; --j)
                    f[g[i] | j] = min(f[g[i] | j], f[j] + 1);
            }
        cout << f[(1 << k) - 1] << '\n';
    }
}
```

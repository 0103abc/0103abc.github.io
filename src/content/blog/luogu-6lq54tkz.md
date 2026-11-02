---
title: "CF1632E2 Distance Tree (hard version) 题解"
date: "2026-03-16T05:54:19.000Z"
link: "luogu-6lq54tkz"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "搜索", "深度优先搜索", "二分"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/6lq54tkz)。

好难啊/ll

有一个贪心策略是连的一条边一定有一端是 $1$ 号点，证明是显然的。

记 $f_i$ 为以 $i$ 为根的子树内最长的 $i$ 为一端的链，$g_i$ 为以 $i$ 为根的子树内非严格次长的 $i$ 为一端的链，$dep_i$ 为 $i$ 点的深度，这些信息显然可以一次 dfs 在 $O(n)$ 时间复杂度内求解。

此时可以考虑二分最长距离，做到时间复杂度 $O(n^2\log n)$。这里给出一个全流程均为严格线性的做法：

现在需要求出若添加一条距离 $1$ 号点 $x$ 的边（设当前处理到的点是 $1,y$），则：

+ 若 $1\sim y$ 点的距离不超过当前枚举的答案 $S$，则无需进行操作。
+ 否则，容易证明此时最优的贪心策略一定是把边从 $1$ 号点接到 $y$ 号点子树内直径的中点上，直径中点也是容易 $O(n)$ 求出的。

直接模拟上述流程看上去是 $O(n^3)$ 的，但是注意到上述信息均是单调的可以双指针优化扫描。记 $suf_i$ 表示直径是经过 $u$ 点且在 $u$ 的子树内处理的，且 $1$ 号点到 $u$ 点的距离超过 $i$ 的点里，对应直径最长的值，则可以注意到若 $i$ 点子树内经过 $i$ 点的直径，其两侧距离分别为 $f_i$ 和 $g_i$（$f_i\ge g_i$），则此时这条经过 $i$ 点且以 $i$ 为根的直径对 $[1,dep_i+g_i-1]$ 的 $suf_i$ 都能产生贡献，因此一次后缀和即可处理出 $suf$。此时再用双指针维护答案即可做到严格线性求解。

```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    vector<int> adj[N];
    int dep[N], f[N], g[N], suf[N];
    inline void dfs(int u, int fa)
    {
        dep[u] = dep[fa] + 1;
        for (int &v : adj[u])
            if (v != fa)
            {
                dfs(v, u);
                if (f[v] + 1 > f[u])
                    g[u] = f[u], f[u] = f[v] + 1;
                else if (f[v] + 1 > g[u])
                    g[u] = f[v] + 1;
            }
        chkmax(suf[dep[u] + g[u] - 1], f[u] + g[u]);
    }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i)
            adj[i].clear(), f[i] = g[i] = 0, suf[i] = -1;
        for (int i = 1; i < n; ++i)
        {
            int a, b;
            cin >> a >> b;
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
        }
        dep[0] = -1;
        dfs(1, 0);
        suf[n + 1] = -1;
        for (int i = n; i; --i)
            suf[i] = max(suf[i], suf[i + 1]);
        int mx = *max_element(dep + 1, dep + n + 1), pos = 1;
        for (int i = 1; i <= n; ++i)
        {
            while (i + (suf[pos] + 1) / 2 > pos)
                ++pos;
            cout << min(pos, mx) << ' ';
        }
        cout << '\n';
    }
} // namespace Loyalty
```

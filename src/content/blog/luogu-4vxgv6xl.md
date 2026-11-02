---
title: "P9847 [ICPC 2021 Nanjing R] Crystalfly 题解"
date: "2025-10-05T14:02:54.000Z"
link: "luogu-4vxgv6xl"
categories: ["题解"]
tags: ["洛谷", "动态规划", "树形动态规划"]
draft: false
---

注意到 $t\le 3$，于是想到对 $t$ 的值做分类讨论。$t\le 2$ 时若拿走了 $u$ 点的蝴蝶，但是没有立即前往 $u$ 点的某个儿子 $v$ 取走所有的蝴蝶，那么以后就必然无法再拿走 $v$ 点的蝴蝶了。而 $t=3$ 在 $t\le 2$ 的基础上增加了一种情况：拿走了 $u$ 点的蝴蝶，走到另一个距离 $u$ 点 $1$ 单位的点 $w$，然后回到 $u$，再拿走 $v$ 点的蝴蝶。

于是转移是显然的，设 $f_x$ 表示当前考虑了 $x$ 子树内的答案，**不考虑 $x$ 点**，最多可以拿走多少个蝴蝶：

+ $f_x=\sum\limits_{v\in \text{son}_x}f_v+\max\limits_{v\in\text{son}_x}a_v$
+ $f_x=\sum\limits_{v\in\text{son}_x}f_v+\max\limits_{w\neq v}(a_v-f_v+\sum\limits_{k\in \text{son}_v}f_k+a_w)$（其中 $w$ 点满足 $t_w=3$）

答案为 $f_1+a_1$。

额外记录 $g_x=\sum\limits_{v\in\text{son}_x}f_v$ 既可做到 $O(n\log n)$ 或 $O(n)$ 求解。

```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 4000010;
const int inf = 1e18;
const int mod = 998244353;

vector<int> adj[N];
int typ[N], f[N], g[N], a[N];
inline void dfs(int u, int fa)
{
    vector<int> arr;
    int m1 = -1, m2 = -1, i1 = 0, i2 = 0;
    for (int &v : adj[u])
        if (v != fa)
        {
            dfs(v, u), g[u] += f[v];
            if (typ[v] == 3)
            {
                if (a[v] >= m1)
                    m2 = m1, m1 = a[i1 = v];
                else if(a[v] >= m2)
                    m2 = a[i2 = v];
            }
        }
    for (int &v : adj[u])
        if (v != fa)
        {
            f[u] = max(f[u], a[v] + g[u]);
            if (~m1)
                f[u] = max(f[u], ((v != i1) ? m1 : m2) + g[u] + a[v] + g[v] - f[v]);
        }
}

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    int T;
    cin >> T;
    while (T--)
    {
        int n;
        cin >> n;
        for_each(adj + 1, adj + n + 1, [&](auto &o) { o.clear(); });
        for (int i = 1; i <= n; ++i)
            cin >> a[i];
        for (int i = 1; i <= n; ++i)
            cin >> typ[i];
        fill(f + 1, f + n + 1, 0);
        fill(g + 1, g + n + 1, 0);
        for (int i = 1; i < n; ++i)
        {
            int a, b;
            cin >> a >> b;
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
        }
        dfs(1, 0);
        cout << f[1] + a[1] << '\n';
    }
    return 0;
}
```

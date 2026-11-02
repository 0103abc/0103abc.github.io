---
title: "P17145 [NOI 2026] 彩虹树 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p17145"
categories: ["题解"]
tags: ["洛谷", "动态规划", "图论", "树", "基础算法", "差分"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P17145).
:::

:::info[Solution]{open}
题目可以被理解是对每个集合 $S$ 统计有多少种不同的子树颜色数序列，然后再求和。记 $x_u$ 表示以 $u$ 结点为根的子树中不同颜色的数量，$z_u$ 表示 $u$ 结点为根的子树中，同时在 $u$ 的祖先中出现过的颜色数。

考虑 dp。设 $f_{i,j,k}$ 表示 $i$ 为根的子树中有多少种不同的缤纷度序列，满足 $x_u=j$ 且最少 $k$ 种颜色在祖先中出现。因为根结点没有祖先，因此最终只需要统计 $k=0$ 的 dp 信息即可。

现在考虑合并儿子结点的信息。记 $u$ 点的 $k$ 个儿子的信息分别为 $(x_1,z_1),(x_2,z_2),\ldots,(x_k,z_k)$，记 $M_x=\max x_i,M_z=\max z_i,A=\sum x_i,B=\sum z_i$，则合并后可能得到的 $(x,z)$ 组为 $(A,B),(A-1,B-1),\ldots,(A-B+M_z,M_z),(A-B+M_z-1,M_z),\ldots,(M_x,M_z)$。合法转移点可以看作是一个分段函数，第一段是 $(A,B)\to (A-B+M_z,M_z)$，第二段是 $(A-B+M_z,M_z)\to (M_x,M_z)$。因此考虑分组做 dp，用三个树上背包分别维护 $(\sum x_i,\sum z_i),(\sum (x_i-z_i),\max z_i),(\max x_i,\max z_i)$ 对应折线的起点拐点和终点然后用二维差分将整条折线上的状态加入 $f_{u,*,*}$ 中即可。合并 dp 信息是容易的，这里不再赘述。

最终答案显然就是 $\sum\limits_if_{1,i,0}$。时间复杂度为 $O(n^4)$ 但是有效状态数很少所以可以通过。
:::

:::success[Code]
```cpp line-numbers
// #include "rainbow.h"
#include <bits/stdc++.h>
using namespace std;

int rainbow(int c, int n, std::vector<int> f);

constexpr int N = 205;
constexpr int mod = 998244353;

int siz[N], dp[N][N][N];
vector<int> adj[N];

int f[N][N], p[N][N], h[N][N], tmp[N][N];
int f1[N][N], f2[N][N], g[N][N];
int vx[N * N], vz[N * N], vw[N * N];

inline void add(int &x, int y) { x += y; if (x >= mod) x -= mod; if (x < 0) x += mod; }

inline void clr(int a[N][N], int n, int m) {
    for (int i = 0; i <= n; ++i) memset(a[i], 0, (m + 1) * sizeof(int));
}

inline void cpy(int a[N][N], int b[N][N], int n, int m) {
    for (int i = 0; i <= n; ++i) memcpy(a[i], b[i], (m + 1) * sizeof(int));
}

inline void dfs(int u) {
    siz[u] = 1;
    for (int &v : adj[u]) dfs(v), siz[u] += siz[v];
    int now = 1;
    clr(f, siz[u], siz[u]), clr(p, siz[u], siz[u]), clr(h, siz[u], siz[u]);
    f[1][1] = p[0][1] = h[1][1] = 1;
    for (int &v : adj[u]) {
        int idx = 0;
        for (int i = 1; i <= siz[v]; ++i)
            for (int j = 0; j <= i; ++j)
                if (dp[v][i][j]) ++idx, vx[idx] = i, vz[idx] = j, vw[idx] = dp[v][i][j];
        clr(tmp, siz[v] + now, siz[v] + now);
        for (int i = 1; i <= now; ++i)
            for (int j = 0; j <= i; ++j)
                for (int k = 1; k <= idx; ++k)
                    add(tmp[i + vx[k]][j + vz[k]], 1ll * f[i][j] * vw[k] % mod);
        cpy(f, tmp, siz[v] + now, siz[v] + now);
        clr(tmp, siz[v] + now, siz[v] + now);
        for (int i = 0; i <= now; ++i)
            for (int j = 1; j <= now; ++j)
                for (int k = 1; k <= idx; ++k)
                    add(tmp[i + vx[k] - vz[k]][max(j, vz[k])], 1ll * p[i][j] * vw[k] % mod);
        cpy(p, tmp, siz[v] + now, siz[v] + now);
        clr(tmp, siz[v] + now, siz[v] + now);
        for (int i = 1; i <= now; ++i)
            for (int j = 1; j <= i; ++j)
                for (int k = 1; k <= idx; ++k)
                    add(tmp[max(i, vx[k])][max(j, vz[k])], 1ll * h[i][j] * vw[k] % mod);
        cpy(h, tmp, siz[v] + now, siz[v] + now);
        now += siz[v];
    }
    clr(f1, siz[u] + 1, siz[u] + 1), clr(f2, siz[u] + 1, siz[u] + 1), clr(g, siz[u], siz[u]);
    for (int i = 1; i <= siz[u]; ++i)
        for (int j = 1; j <= i; ++j) add(f1[i][j], h[i][j]);
    for (int i = 0; i <= siz[u]; ++i)
        for (int j = 1; j <= siz[u]; ++j)
            if (p[i][j]) add(f1[i + j][j], -p[i][j]), add(f2[i][j], p[i][j]);
    for (int i = 1; i <= siz[u]; ++i)
        for (int j = 0; j <= i; ++j)
            if (f[i][j]) add(f2[i - j][j + 1], -f[i][j]);
    for (int j = 0; j <= siz[u]; ++j) {
        int now = 0;
        for (int i = 1; i <= siz[u]; ++i) add(now, f1[i][j]), add(g[i][j], now);
    }
    for (int i = 0; i <= siz[u]; ++i) {
        int now = 0;
        for (int j = 0; i + j <= siz[u]; ++j) {
            add(now, f2[i][j]);
            if (i || j) add(g[i + j][j], now);
        }
    }
    for (int i = 1; i <= siz[u]; ++i)
        for (int j = 1; j <= i; ++j)
            if (g[i][j]) add(dp[u][i][j], g[i][j]), add(dp[u][i][j - 1], g[i][j]);
}

int rainbow(int c, int n, vector<int> fa) {
    memset(dp, 0, sizeof dp);
    for (int i = 0; i < n; ++i) adj[i].clear();
    for (int i = 1; i < n; ++i) adj[fa[i]].push_back(i);
    dfs(0);
    int res = 0;
    for (int i = 1; i <= n; ++i) add(res, dp[0][i][0]);
    return res;
}
```
:::

难度：黑-

鲜活指数：8

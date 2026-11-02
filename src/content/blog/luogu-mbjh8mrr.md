---
title: "P9850 [ICPC 2021 Nanjing R] Ancient Magic Circle in Teyvat 题解"
date: "2026-04-21T03:05:55.000Z"
link: "luogu-mbjh8mrr"
categories: ["题解"]
tags: ["洛谷", "数学", "组合数学"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/mbjh8mrr)。

推荐阅读：[三元环计数入门](https://www.luogu.com.cn/article/ckjwwy2o)。

直接数蓝色子图是困难的，因此想到容斥计算，记 $f_i$ 表示选择四个点**恰好**有 $i$ 条红色边的方案数，$g_i$ 表示选择四个点**至少**有 $i$ 条红色边的方案数，则根据二项式反演可知有 $g_i=\sum\limits_{j=i}^6\binom ji(-1)^{j-i}f_j$，最终的答案就是 $|g_0-g_6|$，显然有 $g_0=f_0-f_1+f_2-f_3+f_4-f_5+f_6,g_6=f_6$，因此就有 $|g_0-g_6|=|f_0-f_1+f_2-f_3+f_4+f_5|$。

考虑计数 $f_i$，因为 $i$ 的取值范围只有 $0,1,\ldots,5$ 所以这里直接分类讨论：

### $i=0$

即在图中选择四个点的方案数，答案显然就是 $\binom n4$。

### $i=1$

即先选择一条红色边，剩下的点随便选。答案就是 $m\binom{n-2}2$。

### $i=2$

此时需要进一步分类讨论：

+ 两条边不相连：考虑容斥，用在图中任选两条边的方案数减去在图中选两条边有交点的方案数，答案就是 $\binom m2-\sum\limits_{i=1}^n\binom{\deg(i)}2$。
+ 两条边相连：枚举交点，剩下一个点随便选，答案就是 $(n-3)\sum\limits_{i=1}^n\binom{\deg(i)}2$。
+ 因此总方案数就是 $\binom m2+(n-4)\sum\limits_{i=1}^n\binom{\deg(i)}2$。

### $i=3$

此时需要进一步分类讨论：

+ 选了一个三元环：直接三元环计数即可。记图中三元环个数为 $C_3$，则答案就是 $(n-3)C_3$。
+ 三条边形成一个链式结构：枚举中间的那条边，记这条边为 $<u,v>$，则从 $u$ 点连出去的边有 $\deg_u-1$ 种选法，$v$ 点连出去的边有 $\deg_v-1$ 种选法，方案数就是 $\sum\limits_{<u,v>}(\deg_u-1)(\deg_v-1)$，但是选择的边可能会组成一个三元环，因此还需要容斥掉这类情况，在此基础上答案减去 $3C_3$ 即可。
+ 三条边形成一个菊花结构：枚举菊花的顶点 $u$，方案数就是从 $u$ 点随便选出三条边，方案数就是 $\sum\limits_{i=1}^n\binom{\deg(i)}3$。
+ 因此总方案数就是 $(n-6)C_3+\sum\limits_{i=1}^n\binom{\deg(i)}3+\sum\limits_{<u,v>}(\deg_u-1)(\deg_v-1)$。

### $i=4$

此时需要进一步分类讨论：

+ 选了一个四元环：直接四元环计数即可。记图中四元环个数为 $C_4$，则答案就是 $C_4$。
+ 选了一个三元环带出去一条边，则在三元环计数的时候记录所有三元环（根据求三元环的过程可以得知三元环数量不超过 $O(m\sqrt m)$），答案就是 $\sum\limits_{(i,j,k)\in C_3}(\deg(i)+\deg(j)+\deg(k)-6)$。
+ 因此总方案数就是 $C_4+\sum\limits_{(i,j,k)\in C_3}(\deg(i)+\deg(j)+\deg(k)-6)$。

### $i=5$

此时唯一的情况就是图上两个三元环共用了恰好一条边。枚举这条公共边 $<u,v>$，则答案即为 $\sum\limits_{<u,v>}\binom{C3_{<u,v>}}{2}$，其中 $C3_{<u,v>}$ 表示有多少个三元环经过了 $<u,v>$ 这条边，可以直接枚举三元环统计答案。

---

直接按照上面给出的过程分类讨论统计答案，时间复杂度为 $O(m\sqrt m)$，可以通过该题。

一个细节是计算 $\binom n4$ 的时候中途计算结果会爆 `long long`，需要仔细处理。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;
const int N = 200010;
const int mod = 1e9 + 7;
const int inf = 1e18;

using i128 = __int128;

pair<int, int> e[N];
int deg[N], buc[N], vis[N], fc[N];
vector<pair<int, int>> adj[N], adj2[N], adj3[N];

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; ++i) {
        int x, y; cin >> x >> y;
        ++deg[x], ++deg[y], e[i] = {x, y};
    }
    for (int i = 0; i < m; ++i) {
        auto [x, y] = e[i];
        if (deg[x] < deg[y] || deg[x] == deg[y] && x < y) adj[x].emplace_back(y, i), adj3[y].emplace_back(x, i);
        else adj[y].emplace_back(x, i), adj3[x].emplace_back(y, i);
        adj2[x].emplace_back(y, i), adj2[y].emplace_back(x, i);
    }
    int C3 = 0, c4 = 0, mc = 0;
    memset(vis, -1, sizeof vis);
    for (int i = 1; i <= n; ++i){
        for (auto &[j, i1] : adj[i]) vis[j] = i1;
        for (auto &[j, i1] : adj[i]) for (auto &[k, i2] : adj[j]) if (~vis[k]) {
            ++fc[i1], ++fc[i2], ++fc[vis[k]];
            mc += deg[i] + deg[j] + deg[k] - 6, ++C3;
        } for (auto &[j, i1] : adj[i]) vis[j] = -1;
    }
    for (int i = 1; i <= n; ++i) {
        for (auto &[j, i1] : adj3[i]) for (auto &[k, i2] : adj2[j]) if (deg[i] > deg[k] || deg[i] == deg[k] && i > k) c4 += buc[k]++;
        for (auto &[j, i1] : adj3[i]) for (auto &[k, i2] : adj2[j]) buc[k] = 0;
    }
    int cd = 0, c3 = 0, ec = 0, uc = 0;
    for (int i = 1; i <= n; ++i) cd += deg[i] * (deg[i] - 1) / 2;
    for (int i = 1; i <= n; ++i) c3 += deg[i] * (deg[i] - 1) * (deg[i] - 2) / 6;
    for (int i = 0; i < m; ++i) ec += (deg[e[i].first] - 1) * (deg[e[i].second] - 1);
    for (int i = 0; i < m; ++i) uc += fc[i] * (fc[i] - 1) / 2;
    int f0 = (i128)n * (n - 1) * (n - 2) * (n - 3) / 24;
    int f1 = m * (n - 2) * (n - 3) / 2;
    int f2 = m * (m - 1) / 2 + (n - 4) * cd;
    int f3 = (n - 6) * C3 + c3 + ec;
    int f4 = c4 + mc;
    int f5 = uc;
    cout << abs(f0 + f2 + f4 - f1 - f3 - f5) << '\n';
    return 0;
}
```

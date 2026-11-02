---
title: "CF1572D Bridge Club 题解"
date: "2026-08-10T07:12:41.000Z"
link: "luogu-5pn7juvk"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分", "图论", "二分图匹配", "网络流"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/5pn7juvk)。

一个暴力的做法是直接二分图建模，注意到直接把可以组队的点连起来，相邻两个点的 `popcount` 值差一定为 $1$，因此一定能得到一张二分图。直接增广 $k$ 次跑 dinic 即可。

但是边的数量是 $O(n2^n)$ 级别的，直接跑难以通过，考虑优化。观察图的结构可知，对图的一条匹配边 $<u,v>$，因为图中每个点的度数都是 $n$，也就是一条边最多影响 $2n-1$ 条其他的边使得其不能选，因此只需要选整张图中边权最大的 $k(2n-1)+1$ 条边然后建图增广 $k$ 次 dinic 即可。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

namespace MCMF {

int S, T, hhh[N], e[N], f[N], ne[N], w[N], idxx, q[N], d[N], pre[N], incf[N], st[N];
inline void ae(int a, int b, int c, int d) {
    e[idxx] = b, w[idxx] = d, f[idxx] = c, ne[idxx] = hhh[a], hhh[a] = idxx++;
    e[idxx] = a, w[idxx] = -d, f[idxx] = 0, ne[idxx] = hhh[b], hhh[b] = idxx++;
}
inline int spfa() {
    int hh = 0, tt = 1;
    memset(d, 0x3f, sizeof d);
    memset(incf, 0, sizeof incf);
    q[0] = S, d[S] = 0, incf[S] = inf;
    while (hh != tt) {
        int t = q[hh++];
        if (hh == N) hh = 0;
        st[t] = 0;
        for (int i = hhh[t]; ~i; i = ne[i]) {
            int v = e[i];
            if (f[i] && d[v] > d[t] + w[i]) {
                d[v] = d[t] + w[i];
                pre[v] = i, incf[v] = min(incf[t], f[i]);
                if (!st[v]) {
                    q[tt++] = v;
                    if (tt == N) tt = 0;
                    st[v] = 1;
                }
            }
        }
    }
    return incf[T] > 0;
}
inline void ek(int &F, int &C) {
    F = C = 0;
    while (spfa()) {
        int tt = incf[T];
        F += tt, C += tt * d[T];
        for (int i = T; i != S; i = e[pre[i] ^ 1]) f[pre[i]] -= tt, f[pre[i] ^ 1] += tt;
    }
}
inline void ek(int &F, int &C, int k) {
    F = C = 0;
    while (k-- && spfa()) {
        int tt = incf[T];
        F += tt, C += tt * d[T];
        for (int i = T; i != S; i = e[pre[i] ^ 1]) f[pre[i]] -= tt, f[pre[i] ^ 1] += tt;
    }
}
}

int a[N], id[N], vis[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, k, idx = 0; cin >> n >> k;
    for (int i = 0; i < (1 << n); ++i) cin >> a[i];
    k = min(k, (1ll << n) / 2);
    memset(MCMF::hhh, -1, sizeof MCMF::hhh);
    vector<tuple<signed, signed, int>> e;
    for (int i = 0; i < (1 << n); ++i) if (!__builtin_parity(i))
        for (int j = 0; j < n; ++j) e.emplace_back(a[i] + a[i ^ (1 << j)], i, i ^ (1 << j));
    int m = min<int>(e.size(), k * (2 * n - 1) + 1);
    sort(e.begin(), e.end(), greater<>()), e.resize(m);
    memset(id, -1, sizeof id);
    for (auto &[w, u, v] : e) {
        if (!~id[u]) id[u] = idx++;
        if (!~id[v]) id[v] = idx++;
    }
    MCMF::S = N - 1, MCMF::T = N - 2;
    for (auto &[w, x, y] : e) {
        int u = id[x], v = id[y];
        MCMF::ae(u, v, 1, -w);
        if (!vis[u]) MCMF::ae(MCMF::S, u, 1, 0), vis[u] = 1;
        if (!vis[v]) MCMF::ae(v, MCMF::T, 1, 0), vis[v] = 1;
    }
    int F, C; MCMF::ek(F, C, k);
    cout << -C << '\n';
}

} // namespace lowspeed_song
```
:::

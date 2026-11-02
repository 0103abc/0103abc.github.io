---
title: "CF1061E Politics 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1061e"
categories: ["题解"]
tags: ["Codeforces", "图论", "树", "网络流"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1061E).
:::

:::info[Solution]{open}
先把子树限制拆分成若干个互相独立的块，则一个块只有一个限制条件。此时对每个树都可以把所有点恰好分割到若干个块内，并知道每个块内必须恰好选多少个点。然后考虑一个城市 $i$，如果其在第一个树中属于块 $x$，第二个树中属于块 $y$。则选城市 $i$ 相当于第一个树的块 $x$ 用掉一个名额，第二个树的块 $y$ 用掉一个名额。

直接跑 MCMF 即可。具体的，从源点 $S$ 出发开始向第一个树的块连边，容量是要选的点的数量，费用为 $0$。从第二个树的块向汇点 $T$ 连边，容量也是要选的点的数量，费用也是 $0$。第一个树的 $x$ 块和第二个树的 $y$ 块连一条边，容量为 $1$，费用为 $-a_i$，直接跑最小费用最大流即可。
:::

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
}

vector<int> adj[N], adj2[N];
int n, r1, r2, a[N], req[N], req2[N], bel[N], bel2[N], need[N], need2[N];
inline void dfs(int u, int fa, int las, vector<int> adj[N], int req[N], int bel[N], int need[N]) {
    if (~req[u]) {
        if (~las) need[las] -= req[u];
        las = u;
    } bel[u] = las;
    for (int &v : adj[u]) if (v != fa) dfs(v, u, las, adj, req, bel, need);
}
inline int build(vector<int> adj[N], int rt, int req[N], int bel[N], int need[N]) {
    for (int i = 0; i <= n + 1; ++i) bel[i] = -1, need[i] = 0;
    for (int i = 1; i <= n; ++i) if (~req[i]) need[i] = req[i];
    dfs(rt, 0, -1, adj, req, bel, need);
    for (int i = 1; i <= n; ++i)
        if (need[i] < 0 && ~req[i]) return 0;
    return 1;
}
inline void sol([[maybe_unused]]int __testcase_id) {
    memset(MCMF::hhh, -1, sizeof MCMF::hhh);
    cin >> n >> r1 >> r2;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj2[a].emplace_back(b), adj2[b].emplace_back(a);
    }
    memset(req, -1, sizeof req);
    memset(req2, -1, sizeof req2);
    int q; cin >> q;
    while (q--) {
        int k, x; cin >> k >> x;
        req[k] = x;
    } cin >> q;
    while (q--) {
        int k, x; cin >> k >> x;
        req2[k] = x;
    }
    if (req[r1] != req2[r2]) cout << -1 << '\n';
    else if (!build(adj, r1, req, bel, need)) cout << -1 << '\n';
    else if (!build(adj2, r2, req2, bel2, need2)) cout << -1 << '\n';
    else {
        MCMF::S = 0, MCMF::T = n << 1 | 1;
        for (int i = 1; i <= n; ++i)
            if (~req[i]) MCMF::ae(MCMF::S, i, need[i], 0);
        for (int i = 1; i <= n; ++i)
            if (~req2[i]) MCMF::ae(n + i, MCMF::T, need2[i], 0);
        for (int i = 1; i <= n; ++i)
            MCMF::ae(bel[i], bel2[i] + n, 1, -a[i]);
        int F, C; MCMF::ek(F, C);
        cout << ((F != req[r1]) ? -1 : -C) << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：5

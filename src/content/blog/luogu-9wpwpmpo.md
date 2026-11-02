---
title: "CF1264E Beautiful League 题解"
date: "2026-08-08T12:01:18.000Z"
link: "luogu-9wpwpmpo"
categories: ["题解"]
tags: ["Codeforces", "图论", "网络流", "基础算法", "差分"]
draft: false
---

为啥有黑来着。

有经典结论：竞赛图三元环数量为 $\binom n3-\sum\limits_{i=1}^n\binom{\deg_i}{2}$，其中 $\deg_i$ 表示 $i$ 点的出度。最大化三元环的数量即最小化 $\sum\limits_{i=1}^n\binom{\deg_i}2$ 也就是最小化 $\sum \deg_i^2$ 的值。

后面部分十分套路，考虑费用流建模。如果 $u,v$ 之间的比赛结果未确定，则建一个比赛结点 $e_{u,v}$，然后连下面的边：

+ $S\to e_{u,v}$，容量为 $1$，费用为 $0$。
+ $e_{u,v}\to u$，容量为 $1$，费用为 $0$。
+ $e_{u,v}\to v$，容量为 $1$，费用为 $0$。

则此时若 $e_{u,v}\to u$ 这条边走了流，表示 $u$ 再比赛中赢了 $v$，否则表示 $v$ 在比赛中赢了 $u$。

记第 $i$ 个人在已经确定结果的比赛中有 $a_i$ 次胜利，现在网络流又分配给了她 $x$ 场胜利，则最终的出度就是 $a_i+x$，代价为 $\binom{a_i+x}2$。对这个二次式做差分，则此时第一场额外胜利将会增加 $a_i$ 的代价，第二场增加 $a_i+1$ 的代价，第三场增加 $a_i+2$ 的代价，以此类推。因此考虑从队伍 $i$ 向汇点 $T$ 连若干条容量为 $1$ 的边，费用分别为 $a_i,a_i+1,\ldots$，这样若在 $i$ 队伍处有 $f$ 的流量，一定会走费用最小的 $f$ 条边流出去，额外费用刚好就是 $\binom{a_i+f}2-\binom{a_i}2$。直接建图然后跑最小费用最大流即可。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

vector<int> adj[N];
int deg[N], win[N], mt[55][55];
char res[55][55];

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

inline void init() {
}

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m; cin >> n >> m;
    vector<pair<int, int>> unk;
    memset(MCMF::hhh, -1, sizeof MCMF::hhh);
    for (int i = 0; i < n; ++i) res[i][i] = '0';
    while (m--) {
        int u, v; cin >> u >> v; --u, --v;
        adj[u].emplace_back(v), adj[v].emplace_back(u);
        res[u][v] = '1', res[v][u] = '0', mt[u][v] = mt[v][u] = 1, ++win[u];
    } for (int i = 0; i < n; ++i) for (int j = i + 1; j < n; ++j) if (!mt[i][j])
        ++deg[i], ++deg[j], unk.emplace_back(i, j);
    MCMF::S = N - 1, MCMF::T = N - 2;
    vector<tuple<int, int, int>> match;
    for (int i = 0; i < unk.size(); ++i) {
        auto [u, v] = unk[i];
        MCMF::ae(MCMF::S, n + i + 1, 1, 0);
        MCMF::ae(n + i + 1, u, 1, 0);
        MCMF::ae(n + i + 1, v, 1, 0);
        match.emplace_back(u, v, MCMF::idxx - 4);
    }
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < deg[i]; ++j) MCMF::ae(i, MCMF::T, 1, win[i] + j);
    int F, C; MCMF::ek(F, C);
    for (auto &[u, v, eu] : match) {
        if (!MCMF::f[eu]) res[u][v] = '1', res[v][u] = '0';
        else res[v][u] = '1', res[u][v] = '0';
    } for (int i = 0; i < n; ++i, cout << '\n')
        for (int j = 0; j < n; ++j) cout << res[i][j];
}

} // namespace lowspeed_song
```
:::

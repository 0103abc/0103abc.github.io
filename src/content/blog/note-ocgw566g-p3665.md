---
title: "P3665 [USACO17OPEN] Switch Grass P 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p3665"
categories: ["题解"]
tags: ["洛谷", "图论", "最小生成树", "树"]
draft: false
---

:::info[Description]
[LInk](https://www.luogu.com.cn/problem/P3665).
:::

:::info[Solution]{open}
容易证明求出最小生成树后，答案一定是生成树的一条边的边长。

因此一个简单的想法是，考虑直接拿 set 维护每条边的边权，然后每次修改操作直接维护 $u$ 点以及其所有相邻点来维护答案。但是可以被菊花图卡成 $O(nq\log n)$ 的时间复杂度。

考虑优化。（一个神奇的做法是）魔改 Kruskal 算法求最小生成树的流程，保持每个连通块都是一个链，然后在合并连通块的过程中，直接连接连通块的一对端点，保持连通块仍然为链的形态。修改的时候还是枚举所有相邻点更新 set 来维护的信息即可。

可以证明其正确性。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

struct DSU {
    int fa[N];
    inline DSU() { iota(fa, fa + N, 0); }
    inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
    inline int merge(int x, int y) {
        x = find(x), y = find(y);
        if (x != y) return fa[x] = y, 1;
        return 0;
    }
} dsu;

int core[N], col[N];
tuple<int, int, int> e[N];
vector<pair<int, int>> adj[N];

inline void sol() {
    int n, m, k, q; cin >> n >> m >> k >> q;
    for (int i = 1; i <= m; ++i) {
        int a, b, c; cin >> a >> b >> c;
        e[i] = {a, b, c};
    } for (int i = 1; i <= n; ++i) cin >> col[i];
    iota(core + 1, core + n + 1, 1);
    sort(e + 1, e + m + 1, [&](auto &l, auto &r) { return get<2>(l) < get<2>(r); });
    multiset<int> se;
    for (int i = 1; i <= m; ++i) {
        auto [a, b, c] = e[i];
        if (dsu.find(a) != dsu.find(b)) {
            adj[core[dsu.find(a)]].emplace_back(core[dsu.find(b)], c);
            adj[core[dsu.find(b)]].emplace_back(core[dsu.find(a)], c);
            core[dsu.find(b)] = core[dsu.find(a)], dsu.fa[dsu.find(a)] = dsu.find(b);
        }
    } for (int i = 1; i <= n; ++i)
        for (auto &[j, w] : adj[i])
            if (i < j && col[i] != col[j]) se.emplace(w);
    while (q--) {
        int a, b; cin >> a >> b;
        for (auto &[v, w] : adj[a])
            if (col[a] != col[v] && b == col[v]) se.erase(se.find(w));
            else if (col[a] == col[v] && b != col[v]) se.emplace(w);
        col[a] = b;
        cout << *se.begin() << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：8

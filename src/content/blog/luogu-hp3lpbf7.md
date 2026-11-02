---
title: "CF1325F Ehab's Last Theorem 题解"
date: "2026-05-08T02:41:13.000Z"
link: "luogu-hp3lpbf7"
categories: ["题解"]
tags: ["Codeforces", "搜索", "深度优先搜索", "图论", "树", "基础算法", "排序"]
draft: false
---

APIO 讲课例题。

独立集比较难找，考虑先处理更好找的简单环。注意到求出图的任意一棵生成树后，若图中存在一个 $v\to u$ 的返祖边，则 $u$ 到 $v$ 存在一个包含 $|dep_u-dep_v|+1$ 个点的简单环，其中 $dep_i$ 表示 $i$ 点在找到的 DFS 生成树上的深度。因此对每条这样的返祖边，若其满足 $|dep_u-dep_v|+1\ge\lceil\sqrt n\rceil$，则可以直接找到一个点数不小于 $\lceil\sqrt n\rceil$ 的简单环。

考虑若一张图不能通过上述方式找出简单环满足怎样的性质。注意到此时对图上任意一个点 $u$，其到达任意一个深度不低于其的点所需要的边的数量都不超过 $B-2$ 条。因此**从 $u$ 出发向上的返祖边数量也同样不会超过 $B-2$ 条**。因此把所有点按照深度从大到小排序，然后按排序后的顺序贪心选独立集即可满足题目中给出的限制条件。

时间复杂度 $O(n\log n)$。优化到 $O(n)$ 也是简单的，直接 DFS 遍历整棵树然后先 DFS 处理所有叶子结点再判断根结点是否可以选即可，代码偷懒写了 $O(n\log n)$。

```cpp line-numbers
pair<int, int> e[N];
vector<int> adj[N], adj2[N];
int a[N], dep[N], up[N], vis[N], to[N];
inline void dfs(int u, int fa) {
    dep[u] = dep[fa] + 1, up[u] = fa;
    if (fa) adj2[u].emplace_back(fa), adj2[fa].emplace_back(u);
    for (int &v : adj[u]) if (!dep[v]) dfs(v, u);
}
inline void sol() {
    int n, m; cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int a, b; cin >> a >> b;
        e[i] = {a, b};
        adj[a].emplace_back(b);
        adj[b].emplace_back(a);
    } dfs(1, 0);
    int B = (int)ceil(sqrt(n));
    set<pair<int, int>> used_edges;
    for (int i = 1; i <= n; ++i)
        for (int &j : adj2[i]) used_edges.emplace(i, j);
    for (int i = 1; i <= m; ++i) {
        auto [u, v] = e[i];
        if (!used_edges.count({u, v}) && abs(dep[u] - dep[v]) >= B - 1) {
            cout << 2 << '\n';
            if (dep[u] > dep[v]) swap(u, v);
            vector<int> ring;
            while (v != u) {
                ring.emplace_back(v);
                v = up[v];
            } ring.emplace_back(u);
            cout << ring.size() << '\n';
            for (int &i : ring) cout << i << ' ';
            cout << '\n';
            return;
        }
    } cout << 1 << '\n';
    vector<int> independent;
    int pos = 1;
    iota(to + 1, to + n + 1, 1);
    sort(to + 1, to + n + 1, [&](auto &l, auto &r) { return dep[l] > dep[r]; });
    for (int i = 0; i < B; ++i) {
        while (pos <= n && vis[to[pos]]) ++pos;
        assert(pos <= n), vis[to[pos]] = 1, independent.emplace_back(to[pos]);
        for (int &j : adj[to[pos]]) vis[j] = 1; vis[to[pos]] = 1;
    } for (int &v : independent) cout << v << ' ';
    cout << '\n';
}
```

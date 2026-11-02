---
title: "P14606 [NWRRC 2025] Games of Chess 题解"
date: "2026-07-19T16:23:47.000Z"
link: "luogu-wdaxd6cm"
categories: ["题解"]
tags: ["洛谷", "搜索", "深度优先搜索", "图论", "树", "数据结构", "并查集"]
draft: false
---

$n$ 为奇数时显然无解。

先考虑图是一个树怎么做。用堆维护当前没被处理的深度最深的叶子结点 $u$ 点，若其父亲结点 $v$ 的儿子数量为奇数则直接把 $v$ 点和其所有儿子结点全部染同样颜色 $v$ 为根子树就处理完了，否则先让 $v$ 和其所有儿子结点全部染同样颜色，然后让 $v$ 继续向上和其父亲结点做处理即可。

然后考虑把问题扩展到图上。容易想到求出图的任意一个 DFS 树，然后把问题在 DFS 树上考虑并额外处理返祖边。具体的：对当前最深的叶子结点 $u$，若其父亲结点 $v$ 的儿子数量为奇数则同样直接把 $v$ 的所有儿子和 $v$ 都染同样颜色即可；若 $v$ 的儿子数量为偶数则需要分类讨论：

+ 若 $v$ 的所有儿子结点都没有返祖边，则同样先暂时把 $v$ 和其所有儿子合并为一组，然后保留 $v$ 继续处理即可。
+ 若 $v$ 存在儿子结点有返祖边，则任选其中一个有返祖边的儿子结点 $x$，记这条返祖边连接了 $x,a$ 两个点，则把 $v$ 和除了 $x$ 以外的所有儿子结点染同一个颜色，然后保留 $x$ 点并将其继续往上处理即可。

容易证明上述算法的正确性。代码具体实现可以用堆来找当前最深的叶子结点，用并查集来维护同色块。时间复杂度为 $O(n\log n)$。

:::success[代码实现]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int vis[N];
vector<int> adj[N];

struct DSU {
    int fa[N];
    inline DSU() { iota(fa, fa + N, 0); }
    inline void init(int maxn) { iota(fa, fa + maxn + 1, 0); }
    inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
    inline int merge(int x, int y) {
        x = find(x), y = find(y);
        if (x != y) return fa[x] = y, 1;
        return 0;
    }
} dsu;

priority_queue<pair<int, int>> q;

int siz[N], fa[N], dep[N], used[N];
vector<int> adj2[N], up[N];
inline void dfs(int u, int fa_) {
    dep[u] = dep[fa_] + 1, q.emplace(dep[u], u);
    for (int &v : adj[u])
        if (!dep[v]) fa[v] = u, adj2[u].emplace_back(v), dfs(v, u);
        else if (v != fa[u] && dep[v] < dep[u]) up[u].emplace_back(v);
    sort(up[u].begin(), up[u].end(), [&](auto &l,auto &r) { return dep[l] < dep[r]; });
}

inline void gao(int u, int ban = 0) {
    for (int &v : adj2[u]) if (!used[v] && v != ban) dsu.fa[v] = u, used[v] = 1;
}

inline void sol() {
    int n, m; cin >> n >> m; while (q.size()) q.pop();
    for (int i = 1; i <= n; ++i) adj[i].clear(), adj2[i].clear(), up[i].clear(), used[i] = dep[i] = fa[i] = siz[i] = 0;
    dsu.init(n);
    while (m--) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } fa[1] = 0, dfs(1, 0);
    if (n & 1) { cout << -1 << '\n'; return; }
    while (q.size()) {
        auto [d, x] = q.top(); q.pop();
        if (!used[x] && d == dep[x]) {
            if (!fa[x]) break;
            int cnt = 0, id = 0;
            for (int &v : adj2[fa[x]])
                if (!used[v]) {
                    ++cnt;
                    if (!id && up[v].size()) id = v;
                }
            if (cnt & 1) gao(fa[x]), used[fa[x]] = 1;
            else if (!id) gao(fa[x]);
            else {
                int f = up[id].back();
                up[id].pop_back();
                int o = fa[id];
                fa[id] = f, dep[id] = dep[f] + 1;
                adj2[f].emplace_back(id);
                used[o] = 1, gao(o, id), q.emplace(dep[id], id);
            }
        }
    } for (int i = 1; i <= n; ++i) cout << dsu.find(i) << ' ';
    cout << '\n';
}

} // namespace lowspeed_song

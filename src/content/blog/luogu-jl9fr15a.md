---
title: "P14211 [ROI 2016 Day2] 快递服务 题解"
date: "2026-07-09T06:45:07.000Z"
link: "luogu-jl9fr15a"
categories: ["题解"]
tags: ["洛谷", "搜索", "深度优先搜索", "图论", "树", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/jl9fr15a)。

对链公共部分的形态分类讨论。

在讨论之前，先求出每条路径 $u_i\leftrightarrow v_i$ 在树上的 LCA 结点 $w_i$。

### 1. 链公共部分是一条直链

枚举直链深度最大的点为 $x$，则对第 $i$ 条路径 $u_i\leftrightarrow v_i$ 而言，若其有恰好一个端点在 $x$ 结点为根的子树中，则其在 $x$ 位置往上最多能覆盖到 $w_i$ 位置。

而若第 $i$ 条路径和第 $j$ 条路径都存在恰好一个端点在 $x$ 结点为根的子树中，则 $x$ 结点一定在这两条路径的公共部分中，其从 $x$ 位置开始向上的公共路径长度就是 $dep_x-\max(dep_{w_i},dep_{w_j})$。

固定 $x$ 时 $dep_x$ 是定值，为了让答案最大只需要让 $-\max(dep_{w_i},dep_{w_j})$ 的值最大也就是 $\max(dep_{w_i},dep_{w_j})$ 的值最小，因此只需要对每个 $x$ 点都求出恰好有一个端点在 $x$ 子树内的路径中 $dep_{w_i}$ 最小的两条即可。

然后发现这个东西可以直接树上 dp 求出来，维护 $f_{u,0/1}$ 表示 $u$ 点子树内 $dep_{w_i}$ 最小的两条路径的 $dep$ 值，$g_{u,0/1}$ 是对应 $f_{u,0/1}$ 的路径编号，则转移可以考虑提前维护集合 $A_i$ 表示所有满足存在一个端点为 $i$ 的路径组成的编号集合，然后初始化的时候直接把 $A_u$ 集合内所有路径的答案更新到 $f_{u,0/1}$ 和 $g_{u,0/1}$ 上，然后直接DFS 整个树更新 dp 信息即可。

### 2. 链公共部分存在拐点

此时两条路径 $i,j$ 必然满足其 LCA 对应点相同即 $w_i=w_j$，因此容易想到维护集合 $B_i$ 表示所有满足 LCA 为 $i$ 的路径组成的编号集合。

考虑枚举这个链的一个单链最深点 $x$，这里认为路径端点中 $u_i,u_j$ 点在 $x$ 为根的子树中，$v_i,v_j$ 点不在 $x$ 为根的子树中。

若链的另一个单链最深点为 $y$，则这个链的长度就是 $\text{dist}(x,y)$。因为 $x$ 和链的 LCA 结点 $w_i$ 都已经确定了，因此贪心的希望 $y$ 点的深度最大。

于是问题被转化为：

> 枚举点 $x$，在所有满足一侧端点 LCA 为 $x$ 的路径对 $(i,j)$ 中，找出一对满足 $i\neq j,w_i=w_j$ 且另一侧端点 LCA 尽量深的点对。

在 $x$ 的子树中选两个点 $i,j$ 使得其 LCA 为 $x$，只需要满足 $i,j$ 不同时在 $x$ 的某个儿子结点为根的子树中即可。

然后现在问题是找另一个单链最深点 $y$。有经典结论是 LCA 深度最深的点一定是所有候选点按照 DFS 序排序后在相邻点对中选出。因此可以在 DFS 过程中用 multiset 来维护当前的候选集合，这样每在候选集合中添加一个点时只需要和其关于 DFS 序的前驱 / 后继结点求 LCA 并更新答案即可。

合并子树的 multiset 信息可以套路的启发式合并。

因此问题被解决，总时间复杂度为 $O(n\log ^2n)$，可以通过该题。

:::success[代码实现]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N], A[N];
int n, k, u[N], v[N], w[N], timestamp, f[20][N], dfn[N], dep[N], lg[N];

inline int get(int x, int y) { return dfn[x] < dfn[y] ? x : y; }
inline void dfs(int u, int fa) {
    dep[u] = dep[fa] + 1, f[0][dfn[u] = ++timestamp] = fa;
    for (int &v : adj[u]) if (v != fa) dfs(v, u);
}

inline int lca(int u, int v) {
    if (u == v) return u;
    u = dfn[u], v = dfn[v];
    if (u > v) swap(u, v);
    int lgx = lg[v - u++];
    return get(f[lgx][u], f[lgx][v - (1 << lgx) + 1]);
}

inline int dist(int u, int v) {
    return dep[u] + dep[v] - 2 * dep[lca(u, v)];
}

int mx = -1, AA, BB;
inline void chkmax(int val, int u, int v) {
    if (val > mx) mx = val, AA = u, BB = v;
}

namespace Sub1 {
    int f[N][2], g[N][2];
    inline void upd(int x, int d, int id) {
        if (!id) return;
        if (g[x][0] == id) { f[x][0] = min(f[x][0], d); return; }
        if (g[x][1] == id) {
            f[x][1] = min(f[x][1], d);
            if (f[x][1] < f[x][0]) swap(f[x][0], f[x][1]), swap(g[x][0], g[x][1]);
            return;
        }
        if (d < f[x][0]) {
            f[x][1] = f[x][0], g[x][1] = g[x][0];
            f[x][0] = d, g[x][0] = id;
        } else if (d < f[x][1]) f[x][1] = d, g[x][1] = id;
    }
    inline void dfs(int u) {
        f[u][0] = f[u][1] = inf, g[u][0] = g[u][1] = 0;
        for (int &v : A[u]) upd(u, dep[w[v]], v);
        for (int &v : adj[u]) dfs(v), upd(u, f[v][0], g[v][0]), upd(u, f[v][1], g[v][1]);
        if (g[u][0] && g[u][1]) chkmax(dep[u] - max(f[u][0], f[u][1]), g[u][0], g[u][1]);
    }
}

namespace Sub2 {
    struct Info { int x, id; };
    inline int oth(const Info &r) { return u[r.id] == r.x ? v[r.id] : u[r.id]; }
    struct Cmp {
        inline bool operator()(const Info &l, const Info &r) const {
            int a = oth(l), b = oth(r);
            if (dfn[a] != dfn[b]) return dfn[a] < dfn[b];
            return l.id < r.id || l.id == r.id && l.x < r.x;
        }
    };
    multiset<Info, Cmp> se[N];
    inline void chk(int u, Info a, Info b) {
        if (a.id == b.id || w[a.id] != w[b.id]) return;
        if (dep[u] < dep[w[a.id]]) return;
        int x = oth(a), y = oth(b), w = lca(x, y), v = dist(w, u);
        chkmax(v, a.id, b.id);
    }
    inline void ins(int u, Info x) {
        auto it = se[u].lower_bound(x);
        if (it != se[u].end()) chk(u, x, *it);
        if (it != se[u].begin()) chk(u, x, *prev(it));
        se[u].emplace(x);
    }
    inline void dfs(int u) {
        for (int &v : A[u]) ins(u, Info{u, v});
        for (int &v : adj[u]) {
            dfs(v);
            if (se[u].size() < se[v].size()) se[u].swap(se[v]);
            for (const Info &i : se[v]) ins(u, i);
            multiset<Info, Cmp>().swap(se[v]);
        }
    }
}

inline void sol() {
    cin >> n >> k;
    for (int i = 2; i <= n; ++i) {
        int x; cin >> x;
        adj[x].emplace_back(i);
    }
    lg[0] = -1;
    for (int i = 1; i < N; ++i) lg[i] = lg[i >> 1] + 1;
    dfs(1, 0);
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j + (1 << i) - 1 <= n; ++j)
            f[i][j] = get(f[i - 1][j], f[i - 1][j + (1 << (i - 1))]);
    for (int i = 1; i <= k; ++i) {
        cin >> u[i] >> v[i];
        w[i] = lca(u[i], v[i]);
        A[u[i]].emplace_back(i);
        A[v[i]].emplace_back(i);
    }
    Sub1::dfs(1), Sub2::dfs(1);
    if (mx <= 0) mx = 0, AA = 1, BB = 2;
    cout << mx << '\n' << AA << ' ' << BB << '\n';
}

} // namespace lowspeed_song

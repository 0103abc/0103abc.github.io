---
title: "P5327 [ZJOI2019] 语言 题解"
date: "2026-08-11T09:27:29Z"
link: "note-he8i0q35-p5327"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "搜索", "深度优先搜索", "基础算法", "排序"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P5327).
:::

:::info[Solution]{open}
记 $S_i$ 为所有过点 $i$ 的路径端点集合，则考虑固定点 $u$，求所有过点 $u$ 的语言路径的并集有多少条边。

考虑一个树上的一个点集的生成子树的环游长度，容易发现这个东西就是把所有点按照 DFS 序从小到大排序，然后求环形状态下相邻两个点的距离的和，最后再加上 $1$ 即可。

考虑一条路径 $s\leftrightarrow t$，设其一个端点是 $x=s$，则因为这条路径过了 $s\to t$ 上的每个点，所以对路径上的每个点 $u$ 都必有 $x\in S_u$，对另一端点 $x=t$ 也做同样的流程。

设 $cnt_{u,x}$ 表示有多少条边过 $u$ 的语言路径把 $x$ 当作端点。这个东西直接树上差分离线下来处理，然后合并子树信息的时候就是子树对应信息加，用 dsu on tree 或者线段树合并来优化一下时间复杂度即可。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
int a[N], st[N][20], dep[N], res, n, m, dfn[N], rev[N], timestamp;
inline void dfs(int u, int fa) {
    dep[u] = dep[fa] + 1, st[u][0] = fa, dfn[u] = ++timestamp, rev[timestamp] = u;
    for (int &v : adj[u]) if (v != fa) dfs(v, u);
}
inline int lca(int a, int b) {
    if (dep[a] < dep[b]) swap(a, b);
    for (int i = 19; ~i; --i) if (dep[a] - dep[b] >> i & 1) a = st[a][i];
    if (a == b) return a;
    for (int i = 19; ~i; --i) if (st[a][i] != st[b][i]) a = st[a][i], b = st[b][i];
    return st[a][0];
}
inline int dist(int a, int b) { return dep[a] + dep[b] - 2 * dep[lca(a, b)]; }

struct Node {
    int l, r, cnt, mi, mx;
    inline Node() { l = r = cnt = mi = mx = 0; }
} tree[N << 6];
int val[N << 6], idx, pool;
vector<pair<int, int>> e[N];

inline int newnode() {
    int p;
    if (pool) p = pool, pool = tree[p].l;
    else p = ++idx;
    tree[p] = Node();
    return val[p] = 0, p;
}

inline void recycle(int p) {
    if (p <= n) return;
    tree[p].l = pool, pool = p;
}

inline void pushup(int p) {
    int L = tree[p].l, R = tree[p].r;
    tree[p].mi = tree[L].mi ? tree[L].mi : tree[R].mi;
    tree[p].mx = tree[R].mx ? tree[R].mx : tree[L].mx;
    val[p] = val[L] + val[R];
    if (tree[L].mx && tree[R].mi) val[p] -= dep[lca(tree[L].mx, tree[R].mi)];
}

inline void push(int p, int pos) {
    if (tree[p].cnt) tree[p].mi = tree[p].mx = rev[pos], val[p] = dep[rev[pos]];
    else tree[p].mi = tree[p].mx = 0, val[p] = 0;
}

inline void mdf(int l, int r, int rt, int pos, int v) {
    if (l == r) {
        tree[rt].cnt += v, push(rt, l);
        return;
    } int mid = l + r >> 1;
    if (pos <= mid) {
        if (!tree[rt].l) tree[rt].l = newnode();
        mdf(l, mid, tree[rt].l, pos, v);
    } else {
        if (!tree[rt].r) tree[rt].r = newnode();
        mdf(mid + 1, r, tree[rt].r, pos, v);
    }
    pushup(rt);
}

inline void merge(int rt1, int rt2, int l, int r) {
    if (l == r) {
        tree[rt1].cnt += tree[rt2].cnt;
        push(rt1, l), recycle(rt2);
        return;
    } int mid = l + r >> 1;
    if (tree[rt1].l && tree[rt2].l) merge(tree[rt1].l, tree[rt2].l, l, mid);
    else if (tree[rt2].l) tree[rt1].l = tree[rt2].l;
    if (tree[rt1].r && tree[rt2].r) merge(tree[rt1].r, tree[rt2].r, mid + 1, r);
    else if (tree[rt2].r) tree[rt1].r = tree[rt2].r;
    pushup(rt1), recycle(rt2);
}

inline void get(int a, int b, int x) {
    int L = lca(a, b);
    e[a].emplace_back(dfn[x], 1);
    e[b].emplace_back(dfn[x], 1);
    e[L].emplace_back(dfn[x], -1);
    if (st[L][0]) e[st[L][0]].emplace_back(dfn[x], -1);
}

inline void dfs2(int u, int fa) {
    for (int &v : adj[u]) if (v != fa)
        dfs2(v, u), merge(u, v, 1, n);
    for (auto &[v, w] : e[u]) mdf(1, n, u, v,w);
    if (tree[u].mi) res += val[u] - dep[lca(tree[u].mi, tree[u].mx)];
}

inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n >> m, idx = n;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } res = 0, dfs(1, 0);
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= n; ++j) st[j][i] = st[st[j][i - 1]][i - 1];
    for (int i = 0; i < m; ++i) {
        int a, b; cin >> a >> b;
        get(a, b, a), get(a, b, b);
    } dfs2(1, 0), cout << res / 2 << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：6

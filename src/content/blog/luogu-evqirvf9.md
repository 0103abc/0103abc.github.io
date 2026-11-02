---
title: "CF955F Heaps 题解"
date: "2026-08-31T01:53:43.000Z"
link: "luogu-evqirvf9"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "图论", "树", "数据结构", "线段树"]
draft: false
---

设 $f_{i,j}$ 表示以 $i$ 为根的子树中满 $j$ 叉树的深度最大值是多少。由满 $j$ 叉树的性质可知若 $i$ 点共有 $c_i$ 个子结点，则 $j>c_i$ 时必有 $f_{i,j}=1$。因此合法的 dp 状态数是 $O(n)$ 级别的。转移也是容易的，直接在其子树内找 $f$ 值最大的 $k$ 个状态，即 $f_{i,j}=\operatorname{kthmax}\limits_{k\in\text{son}_i}f_{k,j}+1$。

然后考虑怎么从 $f_{i,j}$ 还原出 $dp_k(u)$ 的信息，发现 $dp_k(u)$ 就是在子树内对 dp 信息取最大值，因此直接线段树合并即可做到 $O(n\log n)$ 解决问题。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N], f[N];

struct Node {
    int l, r, sum;
} tree[N << 5];

int idx, n, rt[N], res;

inline void mdf(int l, int r, int &rt, int x, int v) {
    if (!rt) rt = ++idx;
    if (l == r) { tree[rt].sum = max(tree[rt].sum, v); return; }
    int mid = l + r >> 1;
    if (x <= mid) mdf(l, mid, tree[rt].l, x, v);
    else mdf(mid + 1, r, tree[rt].r, x, v);
    tree[rt].sum = tree[tree[rt].l].sum + tree[tree[rt].r].sum;
}

inline int merge(int rt1, int rt2, int l, int r) {
    if (!rt1 || !rt2) return rt1 | rt2;
    if (l == r) return tree[rt1].sum = max(tree[rt1].sum, tree[rt2].sum), rt1;
    int mid = l + r >> 1;
    tree[rt1].l = merge(tree[rt1].l, tree[rt2].l, l, mid);
    tree[rt1].r = merge(tree[rt1].r, tree[rt2].r, mid + 1, r);
    tree[rt1].sum = tree[tree[rt1].l].sum + tree[tree[rt1].r].sum;
    return rt1;
}

inline void dfs(int u, int fa) {
    vector<int> son;
    for (int &v : adj[u]) if (v != fa)
        dfs(v, u), son.emplace_back(v), rt[u] = merge(rt[u], rt[v], 1, n);
    vector<vector<int>> g(son.size() + 1); f[u].resize(son.size() + 1);
    for (int &v : son) {
        int lim = min(f[v].size() - 1, son.size());
        for (int i = 1; i <= lim; ++i) g[i].emplace_back(f[v][i]);
    } for (int i = 1; i <= son.size(); ++i) {
        if (g[i].size() < i) f[u][i] = 2;
        else {
            nth_element(g[i].begin(), g[i].end() - i, g[i].end());
            f[u][i] = g[i][g[i].size() - i] + 1;
        } mdf(1, n, rt[u], i, f[u][i] - 1);
    } res += tree[rt[u]].sum + n;
}

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    cin >> n;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } dfs(1, 0), cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

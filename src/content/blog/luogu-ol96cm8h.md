---
title: "CF1976F Remove Bridges 题解"
date: "2026-08-11T22:04:50.000Z"
link: "luogu-ol96cm8h"
categories: ["题解"]
tags: ["Codeforces", "搜索", "深度优先搜索", "基础算法", "贪心"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ol96cm8h)。

:::info[Solution]{open}
题目的限制是，如果一条边是桥则其下端点为根的子树内边全都必须是桥。因此第一条边的上端点必须为 $1$ 号结点，而所有非桥的树边必然构成一个包含根 $1$ 结点的连通子树。设这个子树一共有 $c$ 个点，则其中有 $c-1$ 条原树边不是桥。剩余的桥数量就是 $n-c$。

因此问题被转化为用 $c$ 条新的边最多可以覆盖多少个点组成这样一个根子树。设选出的根子树有 $x$ 个叶子结点（不含根结点），则其实际有 $x+1$ 个叶子结点，为了让所有叶子结点连出的边都不是桥，需要让这些结点两两配对，最少需要 $\lceil\frac x2\rceil$ 条边。容易证明这个限制是可以取到的。

因此问题再次被转化为：选择一个包含根结点的子树，使得其最多有 $2k-1$ 个非根结点叶子，且在这个基础上点的数量最多。

然后考虑怎么最大化点的数量。设 $f_u$ 表示从 $u$ 结点向下走到叶子结点的最长距离是多少，这个一次 DFS 就可以求出。然后考虑直接贪心，每次找出剩下部分中 $f$ 值最大的 $u$ 结点，然后把 $u$ 结点往下的路径删除，取出前 $2k-1$ 大的 $f$ 链即可。这个东西可以写一个类似重剖的东西然后直接拿堆维护做到 $O(n\log n)$ 的时间复杂度解决问题，
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
priority_queue<int> q;
int up[N], dep[N], son[N], siz[N], top[N], idx, dfn[N], bk[N], Son[N], Son_[N];
inline void dfs(int u, int fa) {
    siz[u] = 1, dep[u] = dep[fa] + 1, up[u] = fa, Son_[u] = u;
    for (int &v : adj[u]) if (v != fa) {
        dfs(v, u), siz[u] += siz[v];
        if (siz[son[u]] < siz[v]) son[u] = v;
        if (dep[Son_[u]] < dep[Son_[v]]) Son_[u] = Son_[v], Son[u] = v;
    }
}
inline void dfs2(int u, int Top, int fa) {
    top[u] = Top, dfn[u] = ++idx, bk[idx] = u;
    if (Son[u]) dfs2(Son[u], Top, u);
    for (int &v : adj[u]) if (v != fa && v != Son[u]) dfs2(v, v, u);
    if (Son_[u] == u) q.emplace(dep[u] - dep[top[u]] + 1);
}

inline void sol([[maybe_unused]]int __testcase_id) {
    int n; cin >> n, idx = 0;
    for (int i = 1; i <= n; ++i) adj[i].clear();
    while (q.size()) q.pop();
    for (int i = 1; i <= n; ++i) up[i] = dep[i] = son[i] = siz[i] = top[i] = dfn[i] = bk[i] = Son[i] = Son_[i] = 0;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } dfs(1, 0), dfs2(1, 1, 0);
    int res = n - q.top();
    cout << res << ' '; q.pop();
    for (int i = 1; i < n - 1; ++i) {
        if (q.size()) res -= q.top(), q.pop();
        if (q.size()) res -= q.top(), q.pop();
        cout << res << ' ';
    } cout << '\n';
}

} // namespace lowspeed_song
```
:::

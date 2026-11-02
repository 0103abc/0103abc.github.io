---
title: "P11855 [CSP-J 2022 山东] 部署 题解"
date: "2025-03-05T14:08:48.000Z"
link: "luogu-2ixtoroh"
categories: ["题解"]
tags: ["洛谷", "基础算法", "差分", "搜索", "深度优先搜索", "前缀和"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/2ixtoroh)。

正解好像是树上维护懒标记然后下传，~~但是众所周知我不会维护懒标记~~，所以考虑一个相对偏 ds 的做法。

发现题目的查询操作全在修改操作之后，因此考虑离线做法。先记录每一个点 $i$ 的 $1,2$ 两种操作的权值，设其为 $v1_i,v2_i$。可以发现两个操作之间互相独立，因此考虑分离处理之。

对于 $1$ 操作：一个点 $x$ 会对 $x$ 子树内的结点产生影响，其子树内的结点 DFS 序连续，因此可以维护其 DFS 序的差分序列，然后一次前缀和求值。

对于 $2$ 操作：一个点 $x$ 会对 $x$ 本身，$x$ 的父亲和 $x$ 的一级儿子结点产生影响，其中 $x$ 和 $x$ 的父亲可以单独暴力处理到差分序列上，剩余的 $x$ 的一级连续儿子结点在 BFS 序上连续，可以对 BFS 序维护差分序列，然后一次前缀和求值。

最后把每一个点 $i$ 的答案加上 $a_i$，然后直接查表查询答案即可。时间复杂度为 $O(n)$，可以通过。

```cpp
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
const int mod = 998244353;
vector<int> adj[N];
int v1[N], v2[N], a[N];
int res[N];
int dfn1[N], dfn2[N], siz[N], son[N], leaf[N], up[N];
int idx1, idx2;
int bk[N], bk2[N];
void prep_dfs(int u, int fa) {
    dfn1[u] = ++idx1, siz[u] = 1;
    bk[idx1] = u, up[u] = fa;
    for (int &v : adj[u])
        if (v != fa) prep_dfs(v, u), siz[u] += siz[v];
}
void prep_dfs() {
    prep_dfs(1, 0);
}
int vis[N];
int L[N], R[N], deg[N];
void prep_bfs() {
    queue<int> q;
    q.emplace(1);
    vis[1] = 1;
    dfn2[1] = idx2 = 1;
    bk2[1] = 1;
    while (q.size()) {
        int t = q.front();
        q.pop();
        for (int &g : adj[t])
            if (!vis[g]) {
                vis[g] = 1;
                dfn2[g] = ++idx2;
                bk2[idx2] = g;
                if (!L[t]) L[t] = R[t] = idx2;
                else R[t] = idx2;
                q.emplace(g);
            }
    }
}
int diff[N], diff2[N];
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i < n; ++i) {
        int x, y;
        cin >> x >> y;
        adj[x].emplace_back(y);
        adj[y].emplace_back(x);
        ++deg[x], ++deg[y];
    }
    for (int i = 1; i <= n; ++i)
        if (deg[i] == 1) {
            if (i > 1) leaf[i] = 1;
            else if (i == 1 && n == 1) leaf[i] = 1;
        }
    if (n == 1) leaf[1] = 1;
    int m;
    cin >> m;
    for (int i = 0; i < m; ++i) {
        int p, x, y;
        cin >> p >> x >> y;
        if (p == 1) v1[x] += y;
        else v2[x] += y;
    }
    prep_dfs(), prep_bfs();
    for (int i = 1; i <= n; ++i) {
        diff[dfn1[i]] += v1[i], diff[dfn1[i] + siz[i]] -= v1[i];
        diff2[dfn2[i]] += v2[i], diff2[dfn2[i] + 1] -= v2[i];
        if (i != 1) diff2[dfn2[up[i]]] += v2[i], diff2[dfn2[up[i]] + 1] -= v2[i];
        if (!leaf[i]) diff2[L[i]] += v2[i], diff2[R[i] + 1] -= v2[i];
    }
    for (int i = 1; i <= n; ++i) diff[i] += diff[i - 1], diff2[i] += diff2[i - 1];
    for (int i = 1; i <= n; ++i) res[i] = diff[dfn1[i]] + diff2[dfn2[i]];
    int q;
    cin >> q;
    while (q--) {
        int x;
        cin >> x;
        cout << res[x] + a[x] << '\n';
    }
    return 0;
}
```

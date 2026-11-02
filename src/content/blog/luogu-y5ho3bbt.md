---
title: "CF1029E Tree with Small Distances 题解"
date: "2025-02-24T01:43:02.000Z"
link: "luogu-y5ho3bbt"
categories: ["题解"]
tags: ["Codeforces", "数据结构", "堆"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/y5ho3bbt)。

签到题。令根节点深度为 $1$，则考虑到一个点如果深度 $>3$，那么她或者距离她 $\le 1$ 的结点就必须进行操作。因此拿个堆每一次找到当前没有被更新过且需要被更新的深度最深的点，用她的父亲暴力更新她父亲距离不超过 $1$ 的结点，时间复杂度为 $O(n\log n)$ 可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int mod = 1e9 + 7;
const int N = 1048600;
vector<int> adj[N];
int depth[N], parent[N];
int vis[N];
void dfs(int u, int fa) {
    depth[u] = depth[fa] + 1;
    parent[u] = fa;
    for (int &v : adj[u])
        if (v != fa) dfs(v, u);
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int n;
    cin >> n;
    for (int i = 1; i < n; ++i) {
        int a, b;
        cin >> a >> b;
        adj[a].emplace_back(b);
        adj[b].emplace_back(a);
    }
    dfs(1, 0);
    priority_queue<pair<int, int>> q;
    for (int i = 1; i <= n; ++i)
        if (depth[i] > 3) q.emplace(depth[i], i);
    int cnt = 0;
    while (q.size()) {
        auto [y, x] = q.top();
        q.pop();
        if (vis[x]) continue;
        x = parent[x];
        ++cnt;
        vis[x] = 1;
        for (int &i : adj[x]) vis[i] = 1;
    }
    cout << cnt << '\n';
    return 0;
}
```

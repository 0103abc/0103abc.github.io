---
title: "P13271 [NOI2025] 机器人 题解"
date: "2025-07-18T07:07:02.000Z"
link: "luogu-dc3ol88h"
categories: ["题解"]
tags: ["洛谷", "基础算法", "前缀和", "图论", "最短路"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/dc3ol88h)。

简单签到题，考虑建图。

首先有一个 $O(nk)$ 个点的建图方式是直接拆 $k$ 层然后层和层之间连边，但是肯定过不去。考虑优化，发现两个点同层之间的连边大多都是无效的，只有两个点这一层上都有路才连边，如果只有一个点在这一层上有边那么把这个点直接连到另一个点最高的那一层上，权值可以简单前缀和计算，而如果两个点在该层都没有边那么就不连，最后跑最短路统计答案即可。这样点的数量是 $O(m)$ 级别的，可以通过。

```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;

const int N = 1000010;
const int inf = 1e18;
const int mod = 1e9 + 7;

int v[N], w[N], d[N], bk[N], dis[N], res[N], pre[N];
vector<int> x[N], y[N], z[N], id[N];
vector<pair<int, int>> adj[N];
struct Node
{
    int u, val;
    inline bool operator<(const Node &r) const
    {
        return val > r.val;
    }
};

signed main()
{
    // freopen("robot4.in", "r", stdin);
    // freopen("1.out", "w", stdout);
    cin.tie(0)->sync_with_stdio(false);
    int cas, n, m, k;
    cin >> cas >> n >> m >> k;
    for (int i = 1; i < k; ++i)
        cin >> v[i];
    for (int i = 2; i <= k; ++i)
        cin >> w[i], pre[i] = pre[i - 1] + w[i];
    int idx = 0;
    for (int i = 1; i <= n; ++i)
    {
        cin >> d[i];
        x[i].resize(d[i] + 2), y[i].resize(d[i] + 2);
        z[i].resize(d[i] + 2), id[i].resize(d[i] + 2);
        for (int j = 1; j <= d[i]; ++j)
        {
            x[i][j] = i, cin >> y[i][j] >> z[i][j];
            id[i][j] = ++idx, bk[idx] = y[i][j];
        }
    }
    cerr << idx << '\n';
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= d[i]; ++j)
            if (d[y[i][j]] >= j)
                adj[id[i][j]].emplace_back(id[y[i][j]][j], z[i][j]);
            else
            {
                int cost = pre[j] - pre[d[y[i][j]]], t = y[i][j];
                if (d[t])
                    adj[id[i][j]].emplace_back(id[t][d[t]], z[i][j] + cost);
            }
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= d[i]; ++j)
        {
            if (j > 1)
                adj[id[i][j]].emplace_back(id[i][j - 1], w[j]);
            if (j < d[i])
                adj[id[i][j]].emplace_back(id[i][j + 1], v[j]);
        }
    priority_queue<Node> q;
    memset(dis, 0x3f, sizeof dis);
    memset(res, 0x3f, sizeof res);
    q.push({id[1][1], dis[id[1][1]] = 0});
    while (q.size())
    {
        auto [u, ds] = q.top();
        q.pop();
        assert(u);
        if (dis[u] >= ds)
            for (auto &[v, w] : adj[u])
                if (dis[v] > dis[u] + w)
                    q.push({v, dis[v] = dis[u] + w});
    }
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= d[i]; ++j)
            res[i] = min(res[i], dis[id[i][j]]);
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= d[i]; ++j)
            res[y[i][j]] = min(res[y[i][j]], dis[id[i][j]] + z[i][j]);
    for (int i = 1; i <= n; ++i)
        cout << (res[i] < 1e18 ? res[i] : -1) << ' ';
    cout << '\n';
    return 0;
}

/*

0
5 6 3
2 4
1 1
3 2 5 3 1 4 2
1 3 2
2 1 2 4 1
0
0

*/
```

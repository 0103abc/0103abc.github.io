---
title: "CF1693C Keshi in Search of AmShZ 题解"
date: "2025-02-24T06:17:35.000Z"
link: "luogu-jn505pkj"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "图论", "最短路"]
draft: false
---

考虑倒着 dp。设 $f_i$ 表示从 $i$ 到 $n$ 最优策略下最多走多少步。考虑到若要保证从 $i$ 点走到 $j$ 点，那么需要先把所有比走到 $j$ 点更差的边全部断掉，才能保证从 $i$ 走到 $j$ 一定为最差情况。那么 dp 就是：初始条件为 $f_n=0$，转移对于每一个 $i\in[1,n)$，都有 $f_i=\min\limits_{\text{There is an edge from }i\text{ to }j}(f_j+c_{i,j}+1)$，其中 $c_{i,j}$ 表示从 $i$ 点走到 $j$ 点最少要断多少条 $i$ 点的出边。

$c_{i,j}$ 是容易计算的，显然有：

$$c_{i,j}=\sum\limits_{\text{There is an edge from }i\text{ to }k}[f_j<f_k]$$

于是可以直接暴力转移，时间复杂度为 $O(nm)$。考虑一个很厉害的优化：考虑到 $c_{i,j}+1>0$，因此图中不存在负权边和负权环，考虑用 dijkstra 维护，每一次从堆顶端取出当前 $f$ 权值最小的结点。此时可以证明 $c_{i,j}$ 的值一定单调不递增，且每一次递减的值不会超过 $1$，而且还可以发现初始 $c_{i,j}$ 的值其实就是 $\deg(i)$。因此可以直接简单的在 dijkstra 的过程中暴力维护，时间复杂度为 $O(m\log m)$，可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 200100;
vector<int> adj[N];
int deg[N], dis[N];
struct Node {
    int dis, u;
    bool operator<(const Node &r) const {
        return dis > r.dis;
    }
};
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int n, m;
    cin >> n >> m;
    while (m--) {
        int a, b;
        cin >> a >> b;
        adj[b].emplace_back(a);
        ++deg[a];
    }
    priority_queue<Node> q;
    memset(dis, 0x3f, sizeof dis);
    q.push({dis[n] = 0, n});
    while (q.size()) {
        auto [Dis, u] = q.top();
        q.pop();
        if (dis[u] >= Dis) {
            for (auto &v : adj[u])
                if (dis[v] > dis[u] + deg[v]) q.push({dis[v] = dis[u] + deg[v]--, v});
                else --deg[v];
        }
    }
    cout << dis[1] << '\n';
    return 0;
}
```

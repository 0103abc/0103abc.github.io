---
title: "CF1815F OH NO1 (-2-3-4) 题解"
date: "2025-02-26T02:15:59.000Z"
link: "luogu-sccqp7vf"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "算法思想", "构造", "数据结构", "堆"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/sccqp7vf)。

第一篇 $3500$ 题解欸（

一道诈骗题。考虑到对于每一个三元环 $<a,b,c>$ ，其都有三条无向边 $<a,b>,<a,c>,<b,c>$ 将其连接。每一次操作是让一条边 $<x,y>$ 的两个端点的点权同时增加 $v$（ $1\le v\le 4$ ）。那么可以考虑对于上面提到的每一个三元环 $<a,b,c>$，考虑给其三条边对应端点的点权分别增加 $1,2,3$ ，那么 $a,b,c$ 三个点的点权就会分别增加 $3,4,5$ （顺序非一一对应）。

那么提前给每一个三元环上对应的点权增加 $3$ ，此时 $<a,b,c>$ 这个三元环三个点点权就要分别增加 $0,1,2$ 。考虑再次等价替换问题。给所有的三元环定向，那么增加的点权可以看作是三元环中该点所对应的出度。于是问题就变为了：给定一张由若干个三元环组成的无向图，现在要给每一条边定向， $i$ 点的点权为 $v_i+\text{deg}_i$ ，其中 $v_i$ 为 $i$ 点原来的点权加上 $i$ 点在三元环中出现的次数的三倍， $\text{deg}_i$ 为 $i$ 点在图定向之后的出度。只需要构造定向方案，使得 $\forall 1\le i<j\le n,v_i+\text{deg}_i\neq v_j+\text{deg}_j$ 成立即可。

对于上述的定向问题，考虑一个简单的贪心：在 $v_i$ 的值已知的条件下，尽量的让 $v_i$ 的偏序关系和 $\text{deg}_i$ 的偏序关系相同。因此考虑简单贪心：用一个优先队列维护当前所有的点，每一次取出优先队列中当前点权最小的点，然后把这个点的出度尽量减小即可。但是这样需要动态更新每一个点当前的 $v_i+\text{deg}_i$ 的值。因此考虑每一次弹出点权最小结点的时候，先判断当前点权是否是当前最新的值即可。可以证明，这样贪心一定可以构造出一组满足题目要求的方案。时间复杂度为 $O(m\log m)$ ，可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
int a[N], b[N], c[N], d[N], use[N];
vector<pair<int, int>> adj[N], huan[N];
int calc(int m1, int m2, int x, int y) {
    if (min(x, y) == m1 && max(x, y) == m2) return 2;
    return 1 + 2 * (int)(min(x, y) != m1);
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    cerr << fixed << setprecision(5);
    int T;
    cin >> T;
    while (T--) {
        int n, m;
        cin >> n >> m;
        fill(use + 1, use + n + 1, 0);
        for (int i = 1; i <= n; ++i) cin >> d[i];
        for (int i = 1; i <= m; ++i) cin >> a[i] >> b[i] >> c[i];
        for (int i = 1; i <= m; ++i) d[a[i]] += 3, d[b[i]] += 3, d[c[i]] += 3;
        for (int i = 1; i <= n; ++i) adj[i].clear();
        for (int i = 1; i <= m; ++i) huan[i].clear();
        for (int i = 1; i <= m; ++i) {
            adj[a[i]].emplace_back(b[i], i);
            adj[b[i]].emplace_back(a[i], i);
            adj[a[i]].emplace_back(c[i], i);
            adj[c[i]].emplace_back(a[i], i);
            adj[b[i]].emplace_back(c[i], i);
            adj[c[i]].emplace_back(b[i], i);
        }
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;
        for (int i = 1; i <= n; ++i) q.emplace(d[i], i);
        int index = 0;
        while (q.size()) {
            auto [val, id] = q.top();
            q.pop();
            if (val == d[id]) {
                use[id] = ++index;
                for (auto &[i, _] : adj[id])
                    if (!use[i]) {
                        q.emplace(++d[i], i);
                        huan[_].emplace_back(id, i);
                    }
            }
        }
        for (int i = 1; i <= m; ++i) {
            assert(huan[i].size() == 3);
            int m1 = min({use[a[i]], use[b[i]], use[c[i]]});
            int m2 = max({use[a[i]], use[b[i]], use[c[i]]});
            cout << calc(m1, m2, use[a[i]], use[b[i]]) << ' ' << calc(m1, m2, use[b[i]], use[c[i]]) << ' ' << calc(m1, m2, use[a[i]], use[c[i]]) << '\n';
        }
    }
    return 0;
}
```

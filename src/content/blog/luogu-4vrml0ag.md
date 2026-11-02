---
title: "P14610 [NWRRC 2025] Keys and Grates 题解"
date: "2025-11-27T11:11:37.000Z"
link: "luogu-4vrml0ag"
categories: ["题解"]
tags: ["洛谷", "基础算法", "排序", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/4vrml0ag)。

900 AC，稍微写个题解。

[$O(n^2)$](https://www.luogu.com.cn/problem/AT_abc273_f) 的区间 dp 做法是简单的，但是基于这个做法优化没啥前途。

考虑建图。先将数轴上所有点的坐标离散化，然后以 $s$ 点作为数轴的分界点。对于 $s$ 点右侧相邻的两个点 $x,y$（$x<y$），$x$ 向 $y$（离散化后的坐标）连一条边权为 $y-x$ 的边，$s$ 点左侧相邻的两个点 $x,y$（$x<y$），$y$ 向 $s$ 连一条边权为 $x-y$ 的边。

此时还存在钥匙 $-$ 门对应关系的限制。考虑将钥匙向门连一条边权为两点间距离的边，然后拓扑排序求出 $s$ 向 $t$ 点的最长路长度就是答案。

这个建图策略的正确性可以这样理解：对于一个门，先处理掉其和钥匙在 $s$ 点同侧的情况。然后根据拓扑排序的原理，若其想要被加入队列，当且仅当其入度为 $0$ 即其已经被所有连向该点的所有边更新最长路。而连向一个门点的边无非只有下面两个情况：

+ 从 $s$ 点方向连过来一条边。
+ 从其对应的在另一侧的钥匙所对应的点连过来一条边。

该点确实会被 $s$ 点连过来的边直接更新最长路长度，但是此时其入度仍然不为 $0$ 根据拓扑排序的规则此时其不会被入队，只有等到另一侧连过来的边将其最长路答案更新时其才会被入队，此时最长路答案已经正确。

而对于另外一个钥匙 $-$ 门对应关系的边跨过该门的情况，考虑这对新的关系中门对应的点的位置，显然这个门还需要被从 $s$ 点方向连过来的边更新答案，而这个方向过来的点显然需要先更新原来门对应的点的关系才能入队，因此某个点的最长路在入队的时刻，存的答案一定就是到达该点最少需要移动的距离。

实现的时候不特判掉钥匙 $-$ 门在 $s$ 点同一侧的情况也是正确的。时间复杂度瓶颈在于对点的坐标离散化，因此总时间复杂度为 $O(n\log n)$，可以通过该题。

```cpp line-numbers
namespace Loyalty
{
    int a[N], b[N], f[N << 1], deg[N << 1];
    vector<pair<int, int>> adj[N << 1];
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        int n, s, t;
        cin >> n >> s >> t;
        for (int i = 0; i <= 2 * n + 3; ++i)
            adj[i].clear(), f[i] = -inf, deg[i] = 0;
        vector<int> v = {s, t};
        for (int i = 1; i <= n; ++i)
            cin >> a[i] >> b[i], v.emplace_back(a[i]), v.emplace_back(b[i]);
        sort(v.begin(), v.end()), v.erase(unique(v.begin(), v.end()), v.end());
        for (int i = 1; i <= n; ++i)
            a[i] = lower_bound(v.begin(), v.end(), a[i]) - v.begin() + 1, 
            b[i] = lower_bound(v.begin(), v.end(), b[i]) - v.begin() + 1;
        s = lower_bound(v.begin(), v.end(), s) - v.begin() + 1;
        t = lower_bound(v.begin(), v.end(), t) - v.begin() + 1;
        for (int i = 1; i <= n; ++i)
            adj[a[i]].emplace_back(b[i], abs(v[a[i] - 1] - v[b[i] - 1])), ++deg[b[i]];
        for (int i = s - 1; i; --i)
            adj[i + 1].emplace_back(i, abs(v[i] - v[i - 1])), ++deg[i];
        for (int i = s; i < v.size(); ++i)
            adj[i].emplace_back(i + 1, abs(v[i] - v[i - 1])), ++deg[i + 1];
        queue<int> q;
        q.emplace(s);
        f[s] = 0;
        while (q.size())
        {
            int t = q.front();
            q.pop();
            for (auto &[g, w] : adj[t])
            {
                f[g] = max(f[g], f[t] + w);
                if (!--deg[g])
                    q.emplace(g);
            }
        }
        cout << max(-1ll, f[t]) << '\n';
    }
}
```

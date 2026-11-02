---
title: "AT_agc056_c [AGC056C] 01 Balanced 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-at_agc056_c"
categories: ["题解"]
tags: ["AtCoder", "字符串", "基础算法", "差分", "图论", "最短路"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/AT_agc056_c).
:::

:::info[Solution]{open}
记 $d_i$ 表示前 $i$ 位中 $0$ 的数量减去 $1$ 的数量是多少，然后特殊处理一下 $d_0=0$。题目的条件可以被刻画为：

+ $|d_i-d_{i-1}|=1$。
+ 对一组限制条件 $(l,r)$ 而言必须满足 $d_r=d_{l-1}$。

因此考虑差分约束建模。对一组限制条件 $(l,r)$ 而言，其必须满足 $d_r=d_{l-1}$，可以建一组连接 $l-1,r$ 两个点，边权为 $0$ 的双向边。

然后对 $|d_i-d_{i-1}|=1$ 的限制可以考虑先把限制放宽得到 $|d_i-d_{i-1}|\le 1$，这个是容易建模的，直接拆绝对值然后建 $i\to i-1$ 和 $i-1\to i$ 的权值为 $1$ 的边即可。

然后从 $0$ 号点跑一遍最短路得到 $dis_i$ 数组就是一组满足条件且字典序最小的 $d_i$。考虑这个为什么是对的。因为每个位置都尽量让 $v_i$ 的值大，也就是尽量选择 $v_i=v_{i+1}+1$ 这个松弛操作，对应的就是贪心的能在当前位填 $0$ 就填 $0$ 因此确实可以满足字典序最小的条件。

直接跑 01-bfs 可以做到线性时间复杂度求解。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int dis[N];
vector<pair<int, int>> adj[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m; cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int l, r; cin >> l >> r;
        adj[l - 1].emplace_back(r, 0);
        adj[r].emplace_back(l - 1, 0);
    } for (int i = 1; i <= n; ++i) adj[i].emplace_back(i - 1, 1), adj[i - 1].emplace_back(i, 1);
    deque<int> q;
    memset(dis, -0x3f, sizeof dis);
    dis[0] = 0, q.emplace_back(0);
    while (q.size()) {
        int t = q.front(); q.pop_front();
        for (auto &[g, w] : adj[t]) if (dis[g] < -inf / 2) {
            dis[g] = dis[t] + w;
            if (!w) q.emplace_front(g);
            else q.emplace_back(g);
        }
    }
    for (int i = 1; i <= n; ++i)
        if (dis[i - 1] > dis[i]) cout << 1;
        else cout << 0;
    cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：8

---
title: "P9499 「RiOI-2」change 题解"
date: "2026-07-26T12:50:33.000Z"
link: "luogu-x29avzj0"
categories: ["题解"]
tags: ["洛谷", "数学", "基础算法", "贪心", "数据结构", "堆"]
draft: false
---

非常困难的题目。考虑对当前的每一个第 $i$ 类物品，记录一个信息 $w$ 表示组成她的哪些物品，在只考虑前 $i$ 类物品的情况下，最多可以贡献的价值是多少。

首先如果直接保留当前物品，则可得到 $v_i$ 的贡献，因此可以直接更新每张纸币代价为 $\max(w,v_i)$，新加入的 $c_i$ 张物品的代价就是 $v_i$。然后考虑把当前所有物品按照 $w$ 的值从小到大排序，每次选出代价最小的 $x_i$ 个物品将其合并成更高一级的物品，最后剩下的 $<x_i$ 个物品直接反悔回去，贡献就是 $\sum w$。容易证明该反悔贪心的正确性。

实现这个过程使用小根堆对每个物品维护 $w$ 即可。

考虑优化时间复杂度。容易想到如果两个物品的 $w$ 和级别都相同，则其可以被看作是本质相同的物品。因此想到把若干 $w$ 相同级别也相同的物品合并，用小根堆维护二元组信息 $(w,cnt)$ 表示当前级别中有 $cnt$ 个 $w$ 的物品即可。

直接模拟上述算法时间复杂度爆炸了，因此考虑优化。注意到若对每个物品级别 $i$，满足 $x_i\ge 2$，则物品的总数至少回折半。而若 $x_i=1$，则所有物品的信息都不会发生变化，直接继承上一层的所有信息即可。因此总时间复杂度被优化到 $O(n\log n)$，可以通过本题。

实现细节是因为中间贪心的过程中需要比较 $w$ 信息大小关系所以中途不能取模需要到最后再取模，同样 $cnt$ 信息中途也不能取模。分析 $w,cnt$ 的上界后可以发现用 `__int128` 可以存储所有中途的信息。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int v[N], c[N], x[N];

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> v[i];
    for (int i = 1; i <= n; ++i) cin >> c[i];
    for (int i = 1; i < n; ++i) cin >> x[i];
    i128 res = 0;
    priority_queue<pair<i128, i128>, vector<pair<i128, i128>>, greater<pair<i128, i128>>> q;
    for (int i = 1; i <= n; ++i) {
        if (c[i]) q.emplace(v[i], c[i]);
        i128 sum = 0;
        while (q.size() && q.top().first < v[i]) sum += q.top().second, q.pop();
        if (sum) q.emplace(v[i], sum);
        if (i == n) break;
        if (x[i] > 1) {
            priority_queue<pair<i128, i128>, vector<pair<i128, i128>>, greater<pair<i128, i128>>> q2;
            i128 w = 0, cnt = x[i];
            while (q.size()) {
                auto [w_, cnt_] = q.top(); q.pop();
                if (cnt_ < cnt) cnt -= cnt_, w += cnt_ * w_;
                else {
                    w += w_ * cnt, cnt_ -= cnt, q2.emplace(w, 1);
                    if (cnt_ >= x[i]) q2.emplace(w_ * x[i], cnt_ / x[i]);
                    w = cnt_ % x[i] * w_, cnt = x[i] - cnt_ % x[i];
                }
            } if (cnt < x[i]) res += w;
            q.swap(q2);
        }
    }
    while (q.size()) {
        auto [w, cnt] = q.top(); q.pop();
        res += w * cnt;
    }
    cout << (int)(res % mod) << '\n';
}

} // namespace lowspeed_song
```
:::

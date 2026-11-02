---
title: "CF436E Cardboard Box 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf436e"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "模拟", "图论", "网络流"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF436E).
:::

:::info[Solution]{open}
特别经典的反悔贪心题。考虑怎么通过选 $i$ 个性性的方案来扩展到选 $i+1$ 个星星的方案：

+ 选择一个没有星星的位置并在该位置获得一个星星。
+ 选择一个已经有一个星星的位置并撤销获得操作，在该位置重新获得两个星星。
+ 选择一个已经有一个星星的位置并撤销获得操作，在另一个没有星星的位置获得两个星星。
+ 选择一个已经有两个星星的位置，并撤销获得操作，然后重新让该位置有一个星星。然后再选择一个没有星星的位置，让这个位置获得两个星星。

上述贪心策略的正确性可以建立费用流模型然后模拟来证明。

实现过程中直接维护五个小根堆，内部分别存储下列信息：

+ 所有没有星星的位置中，$a_i$ 的值。
+ 所有没有星星的位置中，$b_i$ 的值。
+ 所有有恰一个星星的位置中，$b_i-a_i$ 的值。
+ 所有有恰一个星星的位置中，$-a_i$ 的值，
+ 所有有恰两个星星的位置中，$a_i-b_i$ 的值。

对上述的四种贪心方法分类讨论然后模拟维护即可，这里不再赘述。时间复杂度为 $O(n\log n)$ 可以通过。

据说有不用反悔贪心的做法。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N], buc[N];

inline void sol() {
    int n, w; cin >> n >> w;
    for (int i = 1; i <= n; ++i) cin >> a[i] >> b[i];
    // first: val
    // second: id
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q1, q2, q3, q4, q5;
    q1.emplace(inf, n + 1), q2.emplace(inf, n + 1), q3.emplace(inf, n + 1), q4.emplace(inf, n + 1), q5.emplace(inf, n + 1);
    for (int i = 1; i <= n; ++i) q1.emplace(a[i], i), q2.emplace(b[i], i);
    int res = 0;
    for (int i = 1; i <= w; ++i) {
        while (q1.size() > 1 && buc[q1.top().second]) q1.pop();
        while (q2.size() > 1 && buc[q2.top().second]) q2.pop();
        while (q3.size() > 1 && buc[q3.top().second] != 1) q3.pop();
        while (q4.size() > 1 && buc[q4.top().second] != 1) q4.pop();
        while (q5.size() > 1 && buc[q5.top().second] != 2) q5.pop();
        int v1 = q1.top().first, v2 = q3.top().first, v3 = q2.top().first + q4.top().first, v4 = q2.top().first + q5.top().first;
        res += min({v1, v2, v3, v4});
        if (v1 == min({v1, v2, v3, v4})) {
            int id = q1.top().second;
            q1.pop(), buc[id] = 1;
            q3.emplace(b[id] - a[id], id), q4.emplace(-a[id], id);
        } else if (v2 == min({v1, v2, v3, v4})) {
            int id = q3.top().second;
            q3.pop(), buc[id] = 2;
            q5.emplace(a[id] - b[id], id);
        } else if (v3 == min({v1, v2, v3, v4})) {
            int id = q2.top().second, id2 = q4.top().second;
            q2.pop(), q4.pop(), buc[id] = 2, buc[id2] = 0;
            q1.emplace(a[id2], id2), q2.emplace(b[id2], id2), q5.emplace(a[id] - b[id], id);
        } else {
            int id = q2.top().second, id2 = q5.top().second;
            q2.pop(), q5.pop(), buc[id] = 2, buc[id2] = 1;
            q3.emplace(b[id2] - a[id2], id2), q4.emplace(-a[id2], id2), q5.emplace(a[id] - b[id], id);
        }
    }
    cout << res << '\n';
    for (int i = 1; i <= n; ++i) cout << buc[i];
    cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：6

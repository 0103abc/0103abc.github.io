---
title: "P8684 [蓝桥杯 2019 省 B] 灵能传输 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p8684"
categories: ["题解"]
tags: ["洛谷", "基础算法", "前缀和", "贪心", "排序"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P8684).
:::

:::info[Solution]{open}
题目中给的变化规则有一个非常套路的转化方式是对整个序列做前缀和，此时操作可以被转化为是选中一个 $i$，交换 $i-1$ 和 $i$ 位置的前缀和 $s_{i-1},s_i$ 的值（$i\neq n$）。

因此可以求出前缀和数组 $s$，然后重新排列 $s_1,s_2,\ldots,s_{n-1}$ 的值，使得 $\max\limits_{i=1}^n|s_i-s_{i-1}|$ 的值最小。

考虑贪心处理。钦定 $s_0\le s_n$，则考虑将中间部分的前缀和数组重排为一个单谷序列和一个单峰序列的形式。调整法可以证明一定能取到最小值。

时间复杂度为 $O(n\log n)$，瓶颈在于排序。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N];

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i], a[i] += a[i - 1];
    sort(a + 1, a + n);
    if (a[0] > a[n]) swap(a[0], a[n]);
    int pos = lower_bound(a + 1, a + n, a[0]) - a;
    int l = a[0], r = a[pos], res = 0;
    for (int i = pos - 1; i; --i) {
        if (l >= r) res = max(res, l - a[i]), l = a[i];
        else res = max(res, r - a[i]), r = a[i];
    } res = max(res, abs(l - r));
    l = a[pos], r = a[n];
    for (int i = pos + 1; i < n; ++i) {
        if (l <= r) res = max(res, a[i] - l), l = a[i];
        else res = max(res, a[i] - r), r = a[i];
    } res = max(res, abs(l - r));
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：8

---
title: "CF1392F Omkar and Landslide 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf1392f"
categories: ["题解"]
tags: ["Codeforces", "数学", "构造"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1392F).
:::

:::info[Solution]{open}
先找不变量，容易发现操作前后整个序列的和是不会变化的。然后还可以发现操作结束后相邻两个元素的差要么是 $0$ 要么是 $1$，因此可以观察出结论是记 $sum$ 为整个序列内所有元素的和，则操作完成后序列的形态是已知的。证明比较简单。

后面的部分是相对容易的，~~一通对着样例拟合参数之后就过了。~~
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N];

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    int sum = accumulate(a + 1, a + n + 1, 0ll);
    sum -= n * (n + 1) / 2;
    for (int i = 1; i <= n; ++i) a[i] = sum / n + i;
    for (int i = 1; i <= sum % n; ++i) ++a[i];
    for (int i = 1; i <= n; ++i) cout << a[i] << ' ';
    cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：青

鲜活指数：6

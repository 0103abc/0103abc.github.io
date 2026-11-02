---
title: "CF1107F Vasya and Endless Credits 题解"
date: "2026-05-22T12:49:31.000Z"
link: "luogu-xcp0px98"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "基础算法", "贪心", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/xcp0px98)。

直接 dp 比较困难，考虑套路的用贪心来优化 dp 过程。

设 $f_{i,j}$ 表示当前考虑了前 $i$ 个产品，在买车的时候还有 $j$ 个产品没还完钱，最多可以有多少钱用来买车。简单调整可得买产品的过程中先买 $b_i$ 更小的产品再买 $b_i$ 更大的产品一定不会让答案更差，因此把所有产品按照 $b_i$ 从大到小排序，按照这个顺序处理所有产品即可。

初始条件显然是 $f_{0,0}=0,f_{0,i}\leftarrow -\infin(i>0)$。对于 dp 状态 $f_{i,j}$，当前需要处理第 $i$ 个产品，可能的转移如下：

+ 没有购买第 $i$ 个产品，$f_{i,j}\leftarrow f_{i-1,j}$。
+ 购买第 $i$ 个产品，且买车的时候还在还债，$f_{i,j}\leftarrow f_{i-1,j-1}+a_i-b_i(j-1)$（最优策略下所有还在还债的产品的购买时间一定是从买车时间开始向前的一段连续后缀）。
+ 购买第 $i$ 个产品，且买车的时候已经还完债了：$f_{i,j}\leftarrow f_{i-1,j}+a_i-b_ik_i$。

答案即为 $\max\limits_{i=0}^nf_{n,i}$。直接模拟上述 dp 流程时间复杂度为 $O(n^2)$，可以轻松通过该题。

```cpp line-numbers
int a[N], b[N], k[N];
struct Product {
    int a, b, d;
} x[N];
int f[510][510];
inline void sol([[maybe_unused]] int CASEID) {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> x[i].a >> x[i].b >> x[i].d;
    sort(x + 1, x + n + 1, [&](auto &l, auto &r) { return l.b > r.b; });
    memset(f, -0x3f, sizeof f);
    f[0][0] = 0;
    // f[i][j]: 考虑了前 i 个产品，最后仍然有 j 个产品没有还完钱，最多可以得到多少钱
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j <= i; ++j) f[i][j] = f[i - 1][j];
        for (int j = 0; j <= i; ++j) f[i][j] = max(f[i][j], f[i - 1][j] + x[i].a - x[i].b * x[i].d);
        for (int j = 1; j <= i; ++j) f[i][j] = max(f[i][j], f[i - 1][j - 1] + x[i].a - (j - 1) * x[i].b);
    } int mx = 0;
    for (int i = 0; i <= n; ++i) mx = max(mx, f[n][i]);
    cout << mx << '\n';
}
```

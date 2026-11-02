---
title: "P1943 Local Maxima 题解"
date: "2025-05-17T04:36:24.000Z"
link: "luogu-5v98pl04"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数学", "概率与期望"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/5v98pl04)。

一个按值插入 dp 的做法，感觉更好想到。

把 $1\sim n$ 中的元素从大到小依次插入到 dp 中。设 $f_i$ 表示当前数组中有 $n-i+1\sim n$ 的值，局部最大值的期望是多少。那么显然有初始值 $f_1=1$。设当前要转移 $f_i$，那么考虑 $n-i+1$ 这个值插入到由 $n-i+2\sim n$ 组成的排列会带来的贡献：共有 $i$ 种不同的插入方案，其中若 $n-i+1$ 插入到了排列的开头，则其会在原来排列的基础上额外带来 $1$ 的贡献，否则其不会带来额外的贡献。因此有 simple 的 dp 转移式：$f_i=\frac{if_{i-1}+1}{i}$。

改写上面的 dp 形式得到 $f_i=f_{i-1}+\frac1i$，即 $f_i=\sum\limits_{j=1}^i\frac1j$。该式为调和级数形式，记作 $H(n)$，其有近似公式 $H(n)\approx\ln(n)+\gamma$，其中 $\gamma$ 为欧拉-马歇罗尼常数，近似为 $0.57721566490153286060651209$。$|H(n)-\ln(n)-\gamma|$ 的值随 $n$ 增大呈减小的趋势，当 $n>10^7$ 时值远远小于精度要求 $10^{-8}$，而若 $n\le 10^7$ 直接 $O(n)$ 递推即可。

```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 10000010;
double f[N];
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(8);
    int n;
    cin >> n;
    if (n < N) {
        for (int i = 1; i <= n; ++i) f[i] = f[i - 1] + 1. / i;
        cout << f[n] << '\n';
    } else {
        cout << log(n) + 0.57721566490153286060651209 << '\n';
    }
    return 0;
}
```

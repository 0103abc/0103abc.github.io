---
title: "P11458 [USACO24DEC] All Pairs Similarity P 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p11458"
categories: ["题解"]
tags: ["洛谷", "基础算法", "差分"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P11458).
:::

:::info[Solution]{open}
集合幂级数入门题，但是我咋不会做。

首先由经典结论：$\frac{|x\cap y|}{|x\cup y|}=\frac{|x|+|y|}{|x\cup y|}-1$，因此题目要求的式子 $\sum\limits_T\frac{|S\cap T|}{|S\cup T|}=\sum\limits_T(\frac{|S|+|T|}{|S\cup T|}-1)=|S|\sum\limits_T\frac{cnt_T}{|S\cup T|}+\sum\limits_T\frac{|T|cnt_T}{|S\cup T|}-n$。

考虑解决更通用的问题，记 $h_S=\sum\limits_Tf_Tg_{S\cup T}$，则考虑提取 $R=S\cup T$ 则有 $h_S=\sum\limits_{R\supseteq S}g_r\sum\limits_{T\subseteq R}f_T[S\cup T=R]$，继续推导拆掉 $[S\cup T=R]$ 后可得 $h_S=\sum\limits_{R\supseteq S}g_R\sum\limits_{T\subseteq R}f_t\sum\limits_{P\subseteq R}(-1)^{|R|-|P|}[S\in P\land T\in P]$，交换球和顺序可得 $h_S=\sum\limits_{P\supseteq S}(\sum\limits_{T\in P}f_t)(\sum\limits_{R\supseteq P}(-1)^{|R|-|P|}g_R)$。

然后式子的两个部分可以分别计算。具体的：

+ $\sum\limits_{T\subseteq P}f_T$ 可以看作是对 $f$ 数组做子集和。
+ $\sum\limits_{R\supseteq P}(-1)^{|R|-|P|}g_R$ 可以看作是对 $g$ 的超集做差分。
+ 答案就是对应位置相乘后得到的超集和 $h_S=\sum\limits_{P\supseteq S}H_P$。

然后这个东西做两遍就可以把题目要求出的式子求出来，总时间复杂度为 $O(n+k2^k)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, k, a[N];

inline vector<int> gao(vector<int> f, vector<int> g) {
    for (int i = 0; i < k; ++i)
        for (int j = 0; j < (1 << k); ++j)
            if (j >> i & 1) f[j] = (f[j] + f[j ^ (1 << i)]) % mod;
    for (int i = 0; i < k; ++i)
        for (int j = 0; j < (1 << k); ++j)
            if (~j >> i & 1) g[j] = (g[j] - g[j | (1 << i)] + mod) % mod;
    for (int i = 0; i < (1 << k); ++i) f[i] = f[i] * g[i] % mod;
    for (int i = 0; i < k; ++i)
        for (int j = 0; j < (1 << k); ++j)
            if (~j >> i & 1) f[j] = (f[j] + f[j | (1 << i)]) % mod;
    return f;
}

inline void sol() {
    cin >> n >> k;
    vector<int> cnt(1 << k), sum(1 << k), g(1 << k);
    for (int i = 0; i < n; ++i) cin >> a[i], ++cnt[a[i]];
    for (int i = 1; i < (1 << k); ++i) {
        int bit = __builtin_popcount(i);
        sum[i] = cnt[i] * bit % mod, g[i] = inversion(bit);
    } vector<int> A = gao(cnt, g), B = gao(sum, g);
    for (int i = 0; i < n; ++i) cout << (A[a[i]] * __builtin_popcount(a[i]) % mod + B[a[i]] + mod - n) % mod << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：7

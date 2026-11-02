---
title: "CF1548C The Three Little Pigs 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1548c"
categories: ["题解"]
tags: ["Codeforces", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1548C).
:::

:::info[Solution]{open}
题目中给的式子相当于是 $\sum\limits_{i=0}^n\binom{3i}x$。直接算肯定是不行的，容易想到把这个东西用 GF 或者 dp 来求，这里给出一个 dp 求的做法：

设 $f_{i,j}=\sum\limits_{k=0}^n\binom{3k+j}i$（$j\in\lbrace 0,1,2\rbrace$），则要求的式子就是 $f_{x,0}$。考虑对着这个和式做一些手脚让这个 dp 是可以递推的：

$f_{i,j}=\sum\limits_{k=0}^n\binom{3k+j}i=\sum\limits_{k=0}^n\binom{3k+j-1}i+\sum\limits_{k=0}^n\binom{3k+j-1}{i-1}=f_{i,j-1}+f_{i-1,j-1}$（$j\in\lbrace1,2\rbrace$）。

$f_{i,0}=(f_{i,0}+f_{i,1}+f_{i,2})-f_{i,1}-f_{i,2}=\sum\limits_{k=0}^{3n+2}\binom ik-f_{i,1}-f_{i,2}=\binom{3n+3}{i+1}-f_{i,1}-f_{i,2}$。

边界情况是 $f_{0,0}=f_{0,1}=f_{0,2}=n+1$。直接递推时间复杂度就是线性的。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int fac[N], inv[N], ifac[N], pwr[N], ipwr[N];

inline void init() {
    fac[0] = inv[0] = ifac[0] = 1;
    fac[1] = inv[1] = ifac[1] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
    pwr[0] = ipwr[0] = 1;
    for (int i = 1; i < N; ++i) {
        pwr[i] = pwr[i - 1] * 2 % mod;
        ipwr[i] = ipwr[i - 1] * i2 % mod;
    }
}

inline int binom(int a, int b) {
    if (b < 0 || a < b) return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}

int f[N][3];

const int i3 = inversion(3);

inline void sol() {
    int n, q; cin >> n >> q;
    f[0][0] = f[0][1] = f[0][2] = n + 1;
    for (int i = 1; i <= 3 * n; ++i) {
        f[i][0] = (binom(3 * n + 3, i + 1) - 2 * f[i - 1][0] - f[i - 1][1] + 3 * mod) % mod * i3 % mod;
        f[i][1] = (f[i][0] + f[i - 1][0]) % mod;
        f[i][2] = (f[i][1] + f[i - 1][1]) % mod;
    }
    while (q--) {
        int x; cin >> x;
        cout << f[x][0] << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：蓝

鲜活指数：2

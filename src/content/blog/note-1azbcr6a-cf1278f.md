---
title: "CF1278F Cards 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1278f"
categories: ["题解"]
tags: ["Codeforces", "数学", "概率与期望", "多项式"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1278F).
:::

:::info[Solution]{open}
枚举出现了 $i$ 次王牌，则有 $n-i$ 次抽取没有出现王牌，概率就是 $\sum\limits_ii^k\binom ni(\frac 1m)^i(\frac{m-1}m)^i$。

简单推一下式子：

$$
\begin{aligned}
 &\sum\limits_ii^k\binom ni(\frac 1m)^i(\frac{m-1}m)^i\\
=&\frac1{m^n}\sum\limits_ii^k\binom ni(m-1)^{n-i}\\
=&\frac1{m^n}\sum\limits_{i=0}^n\binom ni(m-1)^{n-i}\sum\limits_{j=0}^kS_2(k,j)\binom ijj!\\
=&\frac1{m^n}\sum\limits_{j=0}^kS_2(k,j)j!\sum\limits_{i=j}^n\binom ni\binom ij(m-1)^{n-i}\\
=&\frac1{m^n}\sum\limits_{j=0}^kS_2(k,j)j!\binom nj\sum\limits_{i=j}^n\binom{n-j}{i-j}(m-1)^{n-i}\\
=&\frac1{m^n}\sum\limits_{j=0}^kS_2(k,j)j!\binom nj\sum\limits_{i=0}^{n-j}\binom{n-j}{i}(m-1)^{n-i-j}\\
=&\frac1{m^n}\sum\limits_{j=0}^kS_2(k,j)j!\binom njm^{n-j}
\end{aligned}
$$

直接做时间复杂度就是 $O(k^2)$ 的，拿多项式优化一下可以做到单 $\log$ 时间复杂度。
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
    int res = 1;
    for (int i = a; i > a - b; --i) res = res * i % mod;
    return res * ifac[b] % mod;
}

int S2[5010][5010];

inline void sol() {
    int n, m, k; cin >> n >> m >> k;
    S2[0][0] = 1;
    for (int i = 1; i <= k; ++i)
        for (int j = 1; j <= i; ++j) S2[i][j] = (S2[i - 1][j] * j % mod + S2[i - 1][j - 1]) % mod;
    int res = 0;
    for (int i = 1; i <= k; ++i) res = (res + S2[k][i] * fac[i] % mod * binom(n, i) % mod * power(m, n - i, mod) % mod) % mod;
    cout << res * inversion(power(m, n, mod)) % mod << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：6

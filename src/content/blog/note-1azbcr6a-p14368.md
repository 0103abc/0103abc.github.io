---
title: "P14368 [JOISC 2018] 修行 / Asceticism 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p14368"
categories: ["题解"]
tags: ["洛谷", "数学", "组合数学"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P14368).
:::

:::info[Solution]{open}
问题可以看作是问有多少个 $1\sim n$ 的排列满足其可以被恰好划分为 $k$ 个极长上升子段。

设答案为 $f_k$ 则根据 Worpitzky 恒等式 $m^n=\sum\limits_{i=1}^mf_k\binom{n+m-i}n$，即固定一个有 $k-1$ 个下降的排列，对应值域为 $1\sim m$ 的序列数为 $\binom{n+m-k}n$。

对这个东西做二项式反演可得 $f_k=\sum\limits_{i=0}^k(-1)^i\binom{n+1}i(k-i)^n$，直接做就是 $O(n\log n)$ 的。
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

inline void sol() {
    int n, k; cin >> n >> k;
    int res = 0;
    for (int i = 0; i <= k; ++i) {
        int val = binom(n + 1, i) * power(k - i, n, mod) % mod;
        if (i & 1) res = (res + mod - val) % mod;
        else res = (res + val) % mod;
    } cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：2

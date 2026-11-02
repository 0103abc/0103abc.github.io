---
title: "P13939 [EC Final 2019] Black and White 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p13939"
categories: ["题解"]
tags: ["洛谷", "数学", "组合数学"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P13939).
:::

:::info[Solution]{open}
考虑从给一个初始状态调整维护答案的变化量。把路径看作是一个长度为 $n+m$ 的 $01$ 序列，其中 $0$ 代表向上移动，$1$ 代表向右移动。初始状态就是 $n$ 个 $0$ 拼接上 $m$ 个 $1$ 得到的序列。

考虑把一对相邻的 $01$ 修改成 $10$。简单算一下可知路径权值的变化量就是 $(-1)^i$（若两个位置分别是第 $i-1$ 次移动和第 $i$ 次移动）。进一步调整后发现满足条件的 $01$ 序列必然满足下标为偶数位置上的 $0$ 的数量恰为 $k+\lfloor\frac n2\rfloor$。这个东西直接组合数算就行，最终答案就是 $\binom{\lfloor\frac{n+m}2\rfloor}{k+\lfloor\frac n2\rfloor}\binom{\lceil\frac{n+m}2\rceil}{n-k-\lfloor\frac n2\rfloor}$。预处理阶乘和阶乘逆可做到线性时间复杂度。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int fac[N], inv[N], ifac[N];

inline void init() {
    fac[0] = inv[0] = ifac[0] = 1;
    fac[1] = inv[1] = ifac[1] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
}

inline int binom(int a, int b) {
    if (b < 0 || a < b) return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}

inline void sol() {
    int n, m, k; cin >> n >> m >> k;
    cout << binom((n + m) / 2, k + n / 2) * binom((n + m + 1) / 2, n - k - n / 2) % mod << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：6

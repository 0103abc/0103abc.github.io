---
title: "CF1762E Tree Sum 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1762e"
categories: ["题解"]
tags: ["Codeforces", "图论", "树"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1762E).
:::

:::info[Solution]{open}
容易发现 $n$ 是奇数的时候答案一定为 $0$。

然后如果树的形态确定，则固定树的根为 $1$ 号结点，一条边的权值可以不被其切出的子树内点的数量唯一确定。具体的，设没被切出的部分有 $l$ 个点，则对这一侧所有的点都必须满足其和其相邻的点的边的权值的乘积必须为 $-1$。现在把这一侧 $l$ 个点的 $l$ 个等式全部相乘，则一条完全在这一侧内的边的贡献被全部抵消，因此左侧最后只剩下当前边的权值，而等式右侧则是 $(-1)^l$。因此当前边的权值就是 $(-1)^l$。

也就是说，边权之和一侧点的数量的奇偶性有关，和树的具体形态无关。而且当 $n$ 为偶数的时候每个树都可以恰好对应一种合法的给边赋权值方式。

最后考虑算答案。枚举 $l=1,2,\ldots,n-1$，因为只有在 $1$ 点到 $n$ 点路径上的边才会对答案有贡献，因此要求当前边必须位于 $1$ 到 $n$ 的简单路径上，点 $1$ 在大小为 $l$ 的一侧，点 $n$ 在大小为 $n-l$ 的一侧。考虑计数，先从剩下的 $n-2$ 个点中选取 $l-1$ 个点放到 $1$ 号点这一侧，然后两侧点内部分别构成生成树，最后要选择这条边的两个端点。把式子合并一下就是：$\sum\limits_{l=1}^{n-1}(-1)^l\binom{n-2}{l-1}l^{l-1}(n-l)^{n-l-1}$，直接算时间复杂度为 $O(n\log n)$，我猜可以优化到严格线性但是懒得想了。
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
    int n; cin >> n;
    if (n & 1) { cout << 0 << '\n'; return; }
    int res = 0;
    for (int i = 1; i < n; ++i) {
        int val = binom(n - 2, i - 1) * power(i, i - 1, mod) % mod * power(n - i, n - i - 1, mod) % mod;
        if (i & 1) res = (res + mod - val) % mod;
        else res = (res + val) % mod;
    } cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：8

---
title: "P13618 [ICPC 2024 APC] Bánh Bò 题解"
date: "2026-07-09T03:29:46.000Z"
link: "luogu-jk4iwc80"
categories: ["题解"]
tags: ["洛谷", "数学", "线性代数", "基础算法", "差分", "组合数学"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/jk4iwc80)。

记 $a_{i,j}\in\lbrace0,1\rbrace$ 表示 $(i,j)$ 位置格子的颜色。

把 $2\times 2$ 相邻的四个 $6\times 7$ 矩阵拼到一起做差可以得到 $a_{i,j}+a_{i+6,j+7}=a_{i+6,j}+a_{i,j+7}$。因此容易想到按 $(i\bmod 6,j\bmod 7)$ 的值将整个矩阵划分为 $42$ 个等价类分别讨论。

对一个等价类而言，其大小必然是长 $\frac n6$ 宽 $\frac m7$ 的矩阵，为了方便后面记 $X=\frac n6,Y=\frac m7$，改等价类对应的矩阵为 $b$。则此时根据前面的推论可以得到有 $b_{i,j}+b_{i+1,j+1}=b_{i+1,j}+b_{i,j+1}$。发现这个就是二阶差分的形式，因此 $b$ 的形态必然要么每一行内所有元素相等，要么每一列内所有元素相等。

这里存在一种特殊情况是 $b$ 矩阵内所有元素均相等。后面为了方便将这个情况归类为所有行元素相等的情况。

然后考虑对所有等价类做整体计数。

在 $6\times 7$ 基础块中考虑一行一行的计数。假设当前在处理基础块中第 $i$ 行对答案的贡献。考虑枚举这一行里有 $i$ 个块是所有行元素相等的块。然后为了满足题目中一开始给出的条件，这 $i$ 个行元素相同的块每一行的 $a$ 数组中的和必须相同。算贡献可以再枚举每一行 $a$ 数组中元素的和为 $j$，贡献即为 $\sum\limits_{j=0}^i{\binom ij}^X$。记这个贡献为 $A(i)$。

然后再考虑列元素相等的块对答案的贡献。和前面行元素相等的部分本质相同，但是需要容斥掉所有元素都相等的情况，钦定有 $k$ 个位置是所有元素都相同的，然后每个位置要么是全 $0$ 要么是全 $1$ 有两种选法，对答案的贡献即为 $\sum\limits_{j=0}^i(-1)^j\binom ij2^jf(i-j)$，其中 $f(i)$ 是不管不能所有元素都相等这个条件时的答案，有 $f(i)=\sum\limits_{j=0}^i{\binom ij}^Y$。记这个贡献为 $B(i)$。

因此对一个 $6\times 7$ 的基础块，记其第 $i$ 行中 $1$ 的个数是 $r_i$，第 $j$ 列中 $1$ 的个数是 $c_j$，答案就是 $\prod\limits_iA(r_i)\prod\limits_jB(c_j)$。直接枚举基础块内每个格子填的是 $0/1$ 显然不行，考虑进一步优化。按列做状压 dp，设 $f_{i,j}$ 表示当前处理到了第 $i$ 列，当前所有已处理了的列中每一行对应格子的行型格子数量组成的集合为 $j$，对答案的贡献是多少。$j$ 可以直接压成 $8$ 进制来处理。转移枚举下一行每个格子分别是行型 / 列型然后更新 $j$ 集合和答案即可。具体细节见代码。

```cpp line-numbers
namespace lowspeed_song {

int fac[N], inv[N], ifac[N];
int a[N], f[N], ff[N], cost[N], dlt[N], A[N], B[N];

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
    int n, m; cin >> n >> m;
    int g[8] = {0}, A[8] = {0}, B[8] = {0};
    for (int i = 0; i < 8; ++i)
        for (int j = 0; j <= i; ++j) A[i] = (A[i] + power(binom(i, j), n / 6, mod)) % mod;
    for (int i = 0; i < 7; ++i)
        for (int j = 0; j <= i; ++j) g[i] = (g[i] + power(binom(i, j), m / 7, mod)) % mod;
    for (int i = 0; i < 7; ++i)
        for (int j = 0; j <= i; ++j) {
            int now = binom(i, j) * (1 << j) % mod * g[i - j] % mod;
            if (j & 1) B[i] = (B[i] + mod - now) % mod;
            else B[i] = (B[i] + now) % mod;
        }
    for (int i = 0; i < 64; ++i) {
        cost[i] = B[6 - __builtin_popcount(i)];
        for (int j = 0; j < 6; ++j) if (i >> j & 1) dlt[i] += (1 << (j + j + j));
    }
    f[0] = 1;
    for (int i = 0; i < 7; ++i) {
        memset(ff, 0, sizeof ff);
        for (int j = 0; j < (1 << 18) ;++j)
            for (int k = 0; k < (1 << 6); ++k)
                ff[j + dlt[k]] = (ff[j + dlt[k]] + f[j] * cost[k] % mod) % mod;
        for (int j = 0; j < (1 << 18); ++j) f[j] = ff[j];
    }
    int ans = 0;
    for (int i = 0; i < (1 << 18); ++i) {
        int tmp = i, res = f[i];
        for (int j = 0; j < 6; ++j) res = res * A[tmp & 7] % mod, tmp >>= 3;
        ans = (ans + res) % mod;
    }
    cout << ans << '\n';
}

} // namespace lowspeed_song
```

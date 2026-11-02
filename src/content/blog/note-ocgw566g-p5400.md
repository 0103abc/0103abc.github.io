---
title: "P5400 [CTS2019] 随机立方体 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p5400"
categories: ["题解"]
tags: ["洛谷", "数学", "组合数学"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P5400).
:::

:::info[Solution]{open}
相对比较套路的题。考虑先钦定若干个极大点，然后用二项式反演从至少 $k$ 个推出恰好 $k$ 个的解。

特判掉 $k>\min(n,m,l)$ 的情况，此时显然是无解的。

然后考虑钦定有 $i$ 个极大点。记 $A_i$ 表示**恰好**有 $j$ 个极大点的填数方案数，$B_i$ 表示**至少**有 $j$ 个极大点的方案数，则显然根据二项式反演可得 $A_k=\sum\limits_{i=k}^r(-1)^{i-k}\binom ikB_i$，这里记 $r=\min(n,m,k)$。因此后面只需要对相对更容易算的 $B_i$ 做计数。记钦定的 $i$ 个极大点按照其中数字从小到大排列为 $p_1,p_2,\ldots,p_i$ 则因为其横轴坐标必须互不相同因此有 $n(n-1)\ldots(n-i+1)$ 种选法。同理纵轴坐标和竖轴坐标也必须互不相同，因此三个坐标合起来共有 $A_n^iA_m^iA_l^i$ 种选法。

然后考虑怎么保证选出来的这些点都是极大点。对前 $j$ 个点 $p_1,p_2,\ldots,p_j$ 考虑把和她们有至少一个维度的坐标相同的所有格子放到集合 $S_j$ 中。不在 $S_j$ 中的格子必须同时满足 $x$ 不等于这 $j$ 个点的任何 $x$ 且 $y$ 不等于这 $j$ 个点的任何 $y$ 且 $z$ 不等于这 $j$ 个点的任何 $z$。因此集合外共有 $(n-j)(m-j)(l-j)$ 个格子，因此有 $|S_j|=nml-(n-j)(m-j)(l-j)$。记 $g_j=nml-(n-j)(m-j)(l-j)$，则因为 $p_1,p_2,\ldots,p_j$ 按数值从小到大排列，要让她们都是极大点，必须满足 $S_j$ 集合中最大的数位于 $p_j$ 位置。

考虑对每个集合 $S_j$，要求最大的数字固定放在 $p_j$ 位置，其余数字没有额外限制，在所有情况中的占比就是 $\frac1{g_j}$。因为集合满足 $S_1\subset S_2\subset\ldots\subset S_i$，因此考虑依次要求 $S_i$ 的最大值位于 $p_i$ 位置，$S_{i-1}$ 的最大值位于 $p_{i-1}$ 位置，以此类推。同时满足上面所有条件在所有情况中的占比就是 $\prod\limits_{j=1}^i\frac1{g_j}$。因此有 $\frac{B_i}{n!}=\frac{A_n^iA_m^iA_l^i}{\prod\limits_{j=1}^i[nml-(n-j)(m-j)(l-j)]}$。记 $f_i=\frac{B_i}{n!}$，考虑直接递推算这个东西那么有 $f_0=1$，$f_i=f_{i-1}\frac{(n-i+1)(m-i+1)(l-i+1)}{(nml-(n-i)(m-i)(l-i))}$ 可以直接线性递推出来。最后直接二项式反演出 $A_k=\sum\limits_{i=k}^r(-1)^{i-k}\binom ikf_i$ 即可。

总时间复杂度可以精细实现后做到严格线性。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int fac[N], inv[N], ifac[N], c[N], g[N], pre[N];

inline void init() {
    fac[0] = inv[0] = ifac[0] = fac[1] = inv[1] = ifac[1] = 1;
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
    int n, m, l, k, res = 0; cin >> n >> m >> l >> k;
    function<int(int)> calc = [&](int x) { return (n - x) * (m - x) % mod * (l - x) % mod; };
    int r = min({n, m, l});
    g[0] = pre[0] = 1;
    for (int i = 1; i <= r; ++i) {
        g[i] = g[i - 1] * (n - i + 1) % mod * (m - i + 1) % mod * (l - i + 1) % mod;
        c[i] = (n * m % mod * l % mod - (n - i) * (m - i) % mod * (l - i) % mod + mod) % mod;
        pre[i] = pre[i - 1] * c[i] % mod;
    } pre[r] = inversion(pre[r]);
    for (int i = r - 1; i; --i) pre[i] = pre[i + 1] * c[i + 1] % mod;
    for (int i = k; i <= r; ++i) {
        if ((i - k) & 1) res = (res + mod - binom(i, k) * g[i] % mod * pre[i] % mod) %mod;
        else res = (res + binom(i, k) * g[i] % mod * pre[i] % mod) % mod;
    } cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：7

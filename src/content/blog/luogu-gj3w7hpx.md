---
title: "CF2048G Kevin and Matrices 题解"
date: "2025-12-12T15:54:45.000Z"
link: "luogu-gj3w7hpx"
categories: ["题解"]
tags: ["Codeforces", "数学", "线性代数", "组合数学"]
draft: false
---

容易证明，对于题目中给出的式子：

$$
\min_{1\le i\le n}\left(\max_{1\le j\le m}a_{i,j}\right)\le\max_{1\le j\le m}\left(\min_{1\le i\le n}a_{i,j}\right)
$$

若要其成立，则当且仅当：

$$
\min_{1\le i\le n}\left(\max_{1\le j\le m}a_{i,j}\right)=\max_{1\le j\le m}\left(\min_{1\le i\le n}a_{i,j}\right)
$$

然后可以发现，若一个矩阵是好的，那么此时必然存在一个点 $(i,j)$，使得这个位置的值在第 $i$ 行中是最大值，且在第 $j$ 行中是最小值。

继续观察这些好的位置，可以发现所有好的位置的坐标必然可以表示为两个集合的笛卡尔积的形式。此时对答案计数，直接枚举好的位置的坐标会算重，因此考虑容斥，钦定当前集合 $A$ 中有 $i$ 个 $x$ 轴坐标，集合 $B$ 中有 $j$ 个 $y$ 轴坐标，强制钦定 $A$ 和 $B$ 的笛卡尔积得到的坐标都是好的的方案数。

此时还可以发现对于一个好的矩阵，其所有好的位置的值都必须相同。于是考虑枚举这个值 $val$，此时钦定的 $i$ 行所有元素的值都不能超过 $val$，钦定的 $j$ 列所有元素的值都不能小于 $val$。

于是考虑直接组合计数。对于枚举的三元组 $(i,j,val)$，显然其容斥系数为 $(-1)^{i+j}$，强制钦定后的方案数其实就是先从 $n$ 行中选择 $i$ 行 $m$ 列中选择 $j$ 列（此时行列之间是相互独立的），然后先给这些行和列选权值，剩下位置的值随便选。

然后就是很基础的推式子了。

$$
\begin{aligned}
&\sum\limits_{val=1}^v\sum\limits_{i=1}^n\sum\limits_{j=1}^m(-1)^{i+j}\binom ni\binom mj val^{i(m-j)}(v-val+1)^{j(n-i)}v^{(n-i)(m-j)}\\
=&\sum\limits_{val=1}^v\sum\limits_{i=1}^n(-1)^i\binom ni\sum\limits_{j=1}^m(-1)^j\binom mjval^{i(m-j)}(v-val+1)^{j(n-i)}v^{(n-i)(m-j)}\\
=&\sum\limits_{val=1}^v\sum\limits_{i=1}^n(-1)^i\binom ni\sum\limits_{j=1}^m(-1)^j\binom mj(v^{n-i})^{m-j}(val^i)^{m-j}((v-val+1)^{n-i})^j\\
=&\sum\limits_{val=1}^v\sum\limits_{i=1}^n(-1)^i\binom ni\sum\limits_{j=1}^m\binom mj(-1\times(v-val+1)^{n-i})^j(v^{n-i}\times val^i)^{m-j}\\
=&\sum\limits_{val=1}^v\sum\limits_{i=1}^n(-1)^i\binom ni(-(v-val+1)^{n-i}+v^{n-i}val^i)^m
\end{aligned}
$$

用快速幂可以做到单组数据 $O(nv\log m)$ 算答案。

```cpp line-numbers
namespace Loyalty
{
    int fac[N], inv[N], ifac[N];
    inline void init()
    {
        for (int i = 0; i < 2; ++i)
            fac[i] = inv[i] = ifac[i] = 1;
        for (int i = 2; i < N; ++i)
        {
            fac[i] = 1ll * fac[i - 1] * i % mod;
            inv[i] = mod - 1ll * inv[mod % i] * (mod / i) % mod;
            ifac[i] = 1ll * ifac[i - 1] * inv[i] % mod;
        }
    }
    inline int binom(int i, int j)
    {
        if (j < 0 || i < j)
            return 0;
        return 1ll * fac[i] * ifac[j] % mod * ifac[i - j] % mod;
    }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n, m, v, res = 0;
        cin >> n >> m >> v;
        auto coef = [&](int i) { return (i & 1) ? mod - 1 : 1; };
        for (int val = 1; val <= v; ++val)
            for (int i = 1; i <= n; ++i)
                add(res, 1ll * coef(i) * binom(n, i) % mod * (power(mod - power(v - val + 1, n - i, mod) + 1ll * power(v, n - i, mod) * power(val, i, mod) % mod, m, mod)) % mod), 
                sub(res, 1ll * coef(i) * binom(n, i) % mod * power(1ll * power(v, n - i, mod) * power(val, i, mod) % mod, m, mod) % mod);
        cout << res << '\n';
    }
}
```

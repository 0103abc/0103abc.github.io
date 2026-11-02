---
title: "P5667 拉格朗日插值2 题解"
date: "2025-11-08T16:19:28.000Z"
link: "luogu-khfrcogy"
categories: ["题解"]
tags: ["洛谷", "数学", "多项式", "算法思想", "构造"]
draft: false
---

### Lagrange 插值

> 给出 $n$ 个点 $(x_i,y_i)$ 满足 $x_i\neq x_j$，可以唯一确定一个 $n-1$ 次多项式 $y=f(x)$ 过上述所有 $n$ 个点。
>
> 现在给出 $k$，求 $f(k)$ 的值。

一个简单的想法是直接 Gauss 消元，可以 $O(n^3)$ 解出这个 $n-1$ 次多项式每一项的系数。

这里介绍一下用 Lagrange 插值的解法：

+ 构造 $n$ 个函数 $f_i(x)$ 表示该函数过点 $(x_i,y_i)$，对于任意 $j\neq i$ 都过点 $(x_j,0)$。容易发现令 $f(x)=\sum\limits_{i=1}^nf_i(x)$ 就可以得到一个满足条件的函数 $f(x)$。
+ 然后考虑构造因式分解：对于每个 $f_i(x)$ 多项式构造一项 $x-x_j(i\neq j)$，然后凑一个系数 $a_i$ 满足 $f_i(x_i)=y_i$，容易解方程得到 $a_i=\dfrac{y_i}{\prod\limits_{j\neq i}(x_i-x_j)}$。
+ 于是有：$f(k)=\sum\limits_{i=1}^nf_i(k)=\sum\limits_{i=1}^ny_i\prod\limits_{j\neq i}\frac{k-x_j}{x_i-x_j}$，可以在 $O(n^2)$ 的时间复杂度内求解。

:::success[$O(n^2\log n)$ 解法]
```cpp line-numbers
inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
{
    cin >> n >> k;
    for (int i = 1; i <= n; ++i)
        cin >> x[i] >> y[i];
    int sum = 0;
    for (int i = 1; i <= n; ++i)
    {
        int inner_product = y[i];
        for (int j = 1; j <= n; ++j)
            if (i != j)
                inner_product = inner_product * (k - x[j] + mod) % mod * inversion(x[i] - x[j] + mod) % mod;
        sum = (sum + inner_product) % mod;
    }
    cout << sum << '\n';
}
```
:::

:::success[$O(n^2)$ 解法]
```cpp line-numbers
int x[N], y[N], n, k;
inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
{
    cin >> n >> k;
    for (int i = 1; i <= n; ++i)
        cin >> x[i] >> y[i];
    int sum = 0;
    for (int i = 1; i <= n; ++i)
    {
        int product_numerator = y[i], product_denominator = 1;
        for (int j = 1; j <= n; ++j)
            if (i != j)
                product_numerator = product_numerator * (k - x[j] + mod) % mod, 
                product_denominator = product_denominator * (x[i] - x[j] + mod) % mod;
        sum = (sum + product_numerator * inversion(product_denominator) % mod) % mod;
    }
    cout << sum << '\n';
}
```
:::

### 001. [P5667 拉格朗日插值2](https://www.luogu.com.cn/problem/P5667)

根据上面的理论，容易得到：

$$f(m+k)=\sum\limits_{i=0}^ny_i\prod\limits_{j\neq i}\frac{m+k-j}{i-j}$$

可以 $O(n^2)$ 时间复杂度求解。

考虑对这个东西进行优化。注意到 $k$ 的取值是连续的一段，所以从这里突破：

$$
\begin{aligned}
f(m+k)
&=\sum\limits_{i=0}^ny_i\prod\limits_{j\neq i}\frac{m+k-j}{i-j}\\
&=\sum\limits_{i=0}^ny_i\prod\limits_{j\neq i}(m+k-j)\prod\limits_{j\neq i}\frac1{i-j}\\
&=\sum\limits_{i=0}^ny_i\frac{(m+k)!}{(m+k-n-1)!}(-1)^{n-i}\frac1{i!(n-i)!(m+k-i)}\\
&=\frac{(m+k)!}{(m+k-n-1)!}\sum\limits_{i=0}^ny_i(-1)^{n-i}\frac1{i!(n-i)!(m+k-i)}\\
&=\frac{(m+k)!}{(m+k-n-1)!}\sum\limits_{i=0}^n\left[\frac1{i!}\times y_i\times(-1)^{n-i}\frac1{(n-i)!}\right]\times \frac1{m+k-i}
\end{aligned}
$$

记 $P_i=\frac{(m+i)!}{(m+i-n-1)!},A_i=\frac1{i!}\times y_i\times(-1)^{n-i}\frac1{(n-i)!},B_i=\frac1{m+i}$，则可以用 NTT 求出 $C=A\odot B$ 即 $C$ 为 $A,B$ 两个序列的等差卷积，而 $P_i$ 显然可以线性递推。

但是这真的对吗？？？把卷积形式写出来之后发现其形如：$C_k=\sum\limits_iA_iB_{k-i}$（$0\le i\le n$），这怎么还出来负数下标了（）不过解决这个问题也是简单的，重新记 $B_i=\frac1{m+i-n}$，此时有 $C_{n+k}=\sum\limits_{i=0}^nA_iB_{n+k-i}$，将其写成卷积的形式只需要对所有 $i>n$ 都记 $A_i=0$ 就可以扩展为 $C_{n+k}=\sum\limits_{i=0}^{n+k}A_iB_{n+k-i}$ 的形式。

一次 NTT 卷积即可求出 $C=A\odot B$ 这个等差卷积。

因此总时间复杂度为 $O(n\log n+m)$，分段打表阶乘可以把后面的 $O(m)$ 省去。

跑了 973ms，喜提最劣解（没事至少这个能过）

:::success[Code]
```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1100010;
const int mod = 998244353;
const int inf = 1e18;

using ld = long double;
using ull = unsigned long long;
using i128 = __int128;
const ull base = 13331;

namespace Luminescent
{
    const double pi = acos(-1);
    const ld pi_l = acosl(-1);
    struct DSU
    {
        int fa[N];
        inline DSU() { iota(fa, fa + N, 0); }
        inline void init(int maxn) { iota(fa, fa + maxn + 1, 0); }
        inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
        inline int merge(int x, int y)
        {
            x = find(x), y = find(y);
            if (x != y)
                return fa[x] = y, 1;
            return 0;
        }
    };
    inline void add(int &x, int a) { x = (x + a) % mod; }
    inline void sub(int &x, int a) { x = (x - a + mod) % mod; }
    inline int power(int a, int b, int c)
    {
        int sum = 1;
        while (b)
        {
            if (b & 1)
                sum = 1ll * sum * a % c;
            a = 1ll * a * a % c, b >>= 1;
        }
        return sum;
    }
    inline int inversion(int x) { return power(x, mod - 2, mod); }
    inline int inversion(int x, int mod) { return power(x, mod - 2, mod); }
    inline int varphi(int x)
    {
        int phi = 1;
        for (int i = 2; i * i <= x; ++i)
            if (x % i == 0)
            {
                phi *= (i - 1);
                x /= i;
                while (x % i == 0)
                    phi *= i, x /= i;
            }
        if (x > 1)
            phi *= (x - 1);
        return phi;
    }
}
using namespace Luminescent;

namespace Poly
{
    const int g = 3;
    int rev[N];
    void ntt(int *a, int n, int mode)
    {
        int bit = 1;
        while ((1 << bit) < n)
            ++bit;
        for (int i = 0; i < n; ++i)
        {
            rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));
            if (i < rev[i])
                swap(a[i], a[rev[i]]);
        }
        for (int l = 2; l <= n; l <<= 1)
        {
            int x = power(g, (mod - 1) / l, mod);
            if (mode == 1)
                x = inversion(x);
            for (int i = 0; i < n; i += l)
            {
                int v = 1;
                for (int j = 0; j < l / 2; ++j, v = v * x % mod)
                {
                    int v1 = a[i + j], v2 = a[i + j + l / 2] * v % mod;
                    a[i + j] = (v1 + v2) % mod, a[i + j + l / 2] = (v1 - v2 + mod) % mod;
                }
            }
        }
    }
    // calc convolution: c[i] = \sum\limits_{j=0}^i (a[j] * b[i - j])
    void convolution(int *a, int n, int *b, int m, int *c)
    {
        int tn = n, tm = m;
        n = n + m + 2;
        while (__builtin_popcount(n) > 1)
            ++n;
        // cerr << "n = " << n << '\n';
        for (int i = tn + 1; i <= n + 1; ++i)
            a[i] = 0;
        for (int i = tm + 1; i <= n + 1; ++i)
            b[i] = 0;
        ntt(a, n, 0), ntt(b, n, 0);
        for (int i = 0; i < n; ++i)
            c[i] = a[i] * b[i] % mod;
        ntt(c, n, 1);
        const int inv_n = inversion(n);
        for (int i = 0; i <= n + m; ++i)
            c[i] = c[i] * inv_n % mod;
    }
}

namespace Loyalty
{
    inline void init() { }
    int y[N], n, m;
    int fac[N], inv[N], ifac[N];
    int A[N], B[N], C[N], P[N];
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        cin >> n >> m;
        for (int i = 0; i < 2; ++i)
            fac[i] = inv[i] = ifac[i] = 1;
        for (int i = 2; i < N; ++i)
        {
            fac[i] = fac[i - 1] * i % mod;
            inv[i] = mod - inv[mod % i] * (mod / i) % mod;
            ifac[i] = ifac[i - 1] * inv[i] % mod;
        }
        for (int i = 0; i <= n; ++i)
            cin >> y[i];
        auto coef = [&](int x) { return (x & 1) ? (mod - 1) : 1; };
        for (int i = 0; i <= n; ++i)
            A[i] = ifac[i] * y[i] % mod * coef(n - i) % mod * ifac[n - i] % mod;
        for (int i = 0; i <= n + n; ++i)
            B[i] = inversion(m + i - n);
        Poly::convolution(A, n + n, B, n + n, C);
        int fac_m = 1, ifac_m = 1;
        for (int i = 2; i <= m; ++i)
            fac_m = fac_m * i % mod;
        for (int i = 2; i <= m - n - 1; ++i)
            ifac_m = ifac_m * i % mod;
        ifac_m = inversion(ifac_m);
        for (int k = 0; k <= n; ++k)
        {
            P[k] = fac_m * ifac_m % mod;
            fac_m = fac_m * (m + k + 1) % mod;
            ifac_m = ifac_m * inversion(m + k - n) % mod;
        }
        for (int k = 0; k <= n; ++k)
            cout << C[n + k] * P[k] % mod << ' ';
        cout << '\n';
    }
}

signed main()
{
    // freopen("1.in", "r", stdin);
    // freopen("1.out", "w", stdout);
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int T = 1;
    // cin >> T;
    Loyalty::init();
    for (int ca = 1; ca <= T; ++ca)
        Loyalty::main(ca, T);
    return 0;
}

```
:::

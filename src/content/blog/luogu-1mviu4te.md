---
title: "P5172 [清华集训 2014] Sum 题解"
date: "2026-02-02T03:57:06.000Z"
link: "luogu-1mviu4te"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造"]
draft: false
---

给定 $n,r$，求 $\sum\limits_{d=1}^n(-1)^{\lfloor d\sqrt r\rfloor}$ 的值。

### Sol 3

先考虑一个经典结论：
$$
(-1)^x=1-2[x\bmod 2=1]
$$
然后考虑从这个结论入手来获取一些有用的信息：
$$
\begin{aligned}
 &(-1)^x\\
=&1-2[x\bmod 2=1]\\
=&1-2(x-2\lfloor\frac x2\rfloor)\\
=&1-2x+4\lfloor\frac x2\rfloor
\end{aligned}
$$
然后考虑把这个东西带入原式：
$$
\begin{aligned}
 &\sum\limits_{d=1}^n(-1)^{\lfloor d\sqrt r\rfloor}\\
=&\sum\limits_{d=1}^n(1-2\lfloor d\sqrt r\rfloor+4\lfloor\frac{\lfloor d\sqrt r\rfloor}2\rfloor)\\
=&(\sum\limits_{d=1}^n1)-(\sum\limits_{d=1}^n2\lfloor d\sqrt r\rfloor)+(\sum\limits_{d=1}^n4\lfloor\frac{\lfloor d\sqrt r\rfloor}2\rfloor)\\
=&n-(\sum\limits_{d=1}^n2\lfloor d\sqrt r\rfloor)+(\sum\limits_{d=1}^n4\lfloor\frac{d\sqrt r}2\rfloor)\\
\end{aligned}
$$
考虑换元，令 $x=\sqrt r$，则此时考虑构造函数 $\gamma(a,b,c,n)=\sum\limits_{i=1}^n\lfloor\frac{ax+b}c\times i\rfloor$，那么上式的答案可以表示为 $n-2\gamma(1,0,1,n)+4\gamma(1,0,2,n)$。因此只需要用类欧把 $\gamma$ 函数给表示出来即可。

这里注意到 $\frac{ax+b}c$ 的值是一个定值，因此容易想到对其值进行分类讨论：

**1. $\large\frac{ax+b}c=1$**

此时有 $\gamma(a,b,c,n)=\sum\limits_{i=1}^n 1=n$。

**2.** $\large\frac{ax+b}c>1$

记 $t=\frac{ax+b}c,T=\lfloor t\rfloor$，则考虑构造类欧形式：
$$
\begin{aligned}
 &\gamma(a,b,c,n)\\
=&\sum\limits_{i=1}^n\lfloor ti\rfloor\\
=&\sum\limits_{i=1}^n\lfloor ti-Ti+Ti\rfloor\\
=&\sum\limits_{i=1}^n\lfloor ti-Ti\rfloor+\sum\limits_{i=1}^nTi\\
=&\sum\limits_{i=1}^n\lfloor(\frac{ax+b}c-T)i\rfloor+\frac{n(n+1)T}2\\
=&\gamma(a,b-cT,c,n)+\frac{n(n+1)T}2
\end{aligned}
$$
**3.** $\large\frac{ax+b}c<1$

此时有 $T=0$，无法继续使用上面的递归公式递归处理答案，因此考虑换一个方法。
$$
\begin{aligned}
 &\gamma(a,b,c,n)\\
=&\sum\limits_{i=1}^n\lfloor ti\rfloor\\
=&\sum\limits_{i=1}^n\sum\limits_{j=1}^{\lfloor nt\rfloor}[j<ti]\\
=&\sum\limits_{i=1}^n\sum\limits_{j=1}^{\lfloor nt\rfloor}[i>\frac jt]\\
=&\sum\limits_{j=1}^{\lfloor nt\rfloor}\sum\limits_{i=1}^n[i>\frac jt]\\
=&\sum\limits_{j=1}^{\lfloor nt\rfloor}(n-\lfloor \frac jt\rfloor)\\
=&\sum\limits_{j=1}^{\lfloor nt\rfloor}\left(n-\left\lfloor\frac j{\frac{ax+b}c}\right\rfloor \right)\\
=&\sum\limits_{j=1}^{\lfloor nt\rfloor}\left(n-\left\lfloor\frac{jc}{ax+b}\right\rfloor \right)\\
=&n\lfloor nt\rfloor-\sum\limits_{j=1}^{\lfloor nt\rfloor}\left\lfloor\frac{c}{ax+b}j\right\rfloor\\
=&n\lfloor nt\rfloor-\sum\limits_{j=1}^{\lfloor nt\rfloor}\left\lfloor\frac{c(ax-b)}{a^2x^2-b^2}j\right\rfloor\\
=&n\lfloor nt\rfloor-\sum\limits_{j=1}^{\lfloor nt\rfloor}\left\lfloor\frac{cax-cb}{a^2r-b^2}j\right\rfloor\\
=&n\lfloor nt\rfloor-\gamma(ca,-cb,a^2r-b^2,\lfloor nt\rfloor)
\end{aligned}
$$
同样也得到了递归公式。简单分析可知该算法时间复杂度同样为 $O(\log n)$ 级别，可以通过该题。

**corner case**

需要特殊处理 $\sqrt r\in\mathbb{N}$ 的情况。

```cpp line-numbers
namespace Loyalty
{
    static int isqu(unsigned long long x)
    {
        if (x == 0)
            return 0;
        int sh = __builtin_ctzll(x);
        int drop = (sh & ~1);
        x >>= drop;
        if (x & 6ULL)
            return -1;
        const unsigned long long xr = x;
        unsigned long long z = (3ULL - x) >> 1;
        unsigned long long y = x * z;
        for (int i = 0; i < 5; ++i)
        {
            unsigned long long w = (3ULL - z * y) >> 1;
            y *= w;
            z *= w;
        }
        if (y & (1ULL << 62))
            y = 0ULL - y;
        y &= ~(1ULL << 63);
        if (y >= (1ULL << 32))
            return -1;
        if (y * y != xr)
            return -1;
        return (int)(y << (drop / 2));
    }
    int n, r, k;
    double x;
    inline int solve(int a, int b, int c, int n)
    {
        if (!n)
            return 0;
        int g = gcd(gcd(a, b), c);
        a /= g, b /= g, c /= g;
        int t = (a * x + b) / c;
        if (a * x + b == c)
            return n;
        else if (t)
            return n * (n + 1) / 2 * t + solve(a, b - c * t, c, n);
        else
        {
            int nt = (a * x + b) * n / c;
            return n * nt - solve(a * c, -b * c, a * a * r - b * b, nt);
        }
    }
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        cin >> n >> r;
        x = sqrt(r);
        if (~(k = isqu(r)))
        {
            if (k & 1)
                cout << ((n & 1) ? -1 : 0) << '\n';
            else
                cout << n << '\n';
        }
        else
            cout << n - 2 * solve(1, 0, 1, n) + 4 * solve(1, 0, 2, n) << '\n';
    }
}
```

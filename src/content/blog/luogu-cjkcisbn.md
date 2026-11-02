---
title: "P10832 [COTS 2023] 传 Mapa 题解"
date: "2025-11-12T06:17:04.000Z"
link: "luogu-cjkcisbn"
categories: ["题解"]
tags: ["洛谷", "数学", "多项式"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/cjkcisbn)。

[选自 11 月做题笔记](https://www.luogu.com.cn/article/obgeyrgs)。

### 028. [P10832 [COTS 2023] 传 Mapa](https://www.luogu.com.cn/problem/P10832)

题目给出了明确的提示“把 $x_i,y_i$ 看成一个整体组来考虑”，于是容易想到 Lagrange 插值插出 $f$ 函数，根据经典结论可知插出的函数恰有 $n$ 项，然后再编一个大于 $\max y_i$ 的模数（例如 $10^9+7$）在模意义下插值。此时 $f$ 函数每一项的系数都不超过 $2^{30}$，直接转成二进制扔到 $s$ 串里传输即可。

而对于逆变换，直接套 Lagrange 插值板子即可。

```cpp
namespace Loyalty
{
    inline void init() { }
    int x[N], y[N], a[N];
    char s[N];
    inline void dasongsong()
    {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i)
            cin >> x[i] >> y[i];
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= n; ++j)
            {
                int numerator = y[j], denominator = 1;
                for (int k = 1; k <= n; ++k)
                    if (k != j)
                    {
                        numerator = numerator * (i - x[k] + mod) % mod;
                        denominator = denominator * (x[j] - x[k] + mod) % mod;
                    }
                a[i] = (a[i] + numerator * inversion(denominator) % mod) % mod;
            }
        cout << n * 30 << '\n';
        for (int i = 1; i <= n; ++i)
            for (int j = 0; j < 30; ++j)
                cout << (a[i] >> j & 1);
        cout << '\n';
    }
    inline void ruahao()
    {
        int n, q, k;
        cin >> n >> q >> k;
        scanf("%s", s + 1);
        for (int i = 1; i <= n; ++i)
        {
            int l = i * 30 - 29, r = i * 30;
            a[i] = 0;
            for (int j = r; j >= l; --j)
                a[i] = a[i] << 1 | (s[j] & 1);
        }
        while (q--)
        {
            int k;
            cin >> k;
            int sum = 0;
            for (int i = 1; i <= n; ++i)
            {
                int numerator = a[i], denominator = 1;
                for (int j = 1; j <= n; ++j)
                    if (j != i)
                    {
                        numerator = numerator * (k - j + mod) % mod;
                        denominator = denominator * (i - j + mod) % mod;
                    }
                sum = (sum + numerator * inversion(denominator) % mod) % mod;
            }
            cout << sum << '\n';
        }
    }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        int ty;
        cin >> ty;
        if (ty == 1)
            dasongsong();
        else
            ruahao();
    }
}
```

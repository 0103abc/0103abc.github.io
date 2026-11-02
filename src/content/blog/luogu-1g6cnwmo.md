---
title: "P6012 [P5087] 数学 加强版 题解"
date: "2025-11-14T14:17:03.000Z"
link: "luogu-1g6cnwmo"
categories: ["题解"]
tags: ["洛谷", "数学", "多项式", "算法思想", "分治"]
draft: false
---

选自 [11 月做题笔记](https://www.luogu.com.cn/article/obgeyrgs)。

### 039. [P6012 [P5087] 数学 加强版](https://www.luogu.com.cn/problem/P6012)

这是不是生成函数板子啊/yun，容易发现答案就是 $[x^k]\prod\limits_{i=1}^n(a_ix+1)$，这个东西形如 $n$ 个多项式相乘，使用分治 NTT 即可。因为模数非 NTT 友好所以可以使用拆系数的 FFT 求解。

总时间复杂度为 $O(n\log^2n)$，可以通过该题。

```cpp line-numbers
namespace Poly
{
    using cpx = complex<ld>;
    vector<int> rev;

    inline void fft(vector<cpx> &a, int mode)
    {
        int n = (int)a.size();
        int bit = 0;
        while ((1 << bit) < n)
            ++bit;

        rev.assign(n, 0);
        for (int i = 0; i < n; ++i)
        {
            rev[i] = (i ? (rev[i >> 1] >> 1) : 0) | ((i & 1) << (bit - 1));
            if (i < rev[i])
                swap(a[i], a[rev[i]]);
        }

        for (int len = 2; len <= n; len <<= 1)
        {
            ld ang = 2.0L * pi_l / len;
            cpx wn = (mode == 1)
                         ? cpx(cosl(ang), -sinl(ang))
                         : cpx(cosl(ang), sinl(ang));
            for (int i = 0; i < n; i += len)
            {
                cpx w(1.0L, 0.0L);
                for (int j = 0; j < (len >> 1); ++j)
                {
                    cpx u = a[i + j];
                    cpx v = a[i + j + (len >> 1)] * w;
                    a[i + j] = u + v;
                    a[i + j + (len >> 1)] = u - v;
                    w *= wn;
                }
            }
        }
    }

    inline vector<int> convolution(const vector<int> &a, const vector<int> &b, int p)
    {
        if (a.empty() || b.empty())
            return {};

        if ((int)a.size() * (int)b.size() <= 1000)
        {
            int n = (int)a.size();
            int m = (int)b.size();
            vector<int> c(n + m - 1);
            for (int i = 0; i < n; ++i)
                for (int j = 0; j < m; ++j)
                    c[i + j] = (c[i + j] + a[i] * b[j]) % p;
            return c;
        }

        int need = (int)a.size() + (int)b.size() - 1;
        int n = 1;
        while (n < need)
            n <<= 1;

        vector<cpx> A1(n), A2(n), B1(n), B2(n), C1(n), C2(n), C3(n);

        for (int i = 0; i < n; ++i)
        {
            int av = 0, bv = 0;
            if (i < (int)a.size())
            {
                av = a[i] % p;
                if (av < 0)
                    av += p;
            }
            if (i < (int)b.size())
            {
                bv = b[i] % p;
                if (bv < 0)
                    bv += p;
            }

            A1[i] = cpx((av >> 15), 0.0L);
            A2[i] = cpx((av & 32767), 0.0L);
            B1[i] = cpx((bv >> 15), 0.0L);
            B2[i] = cpx((bv & 32767), 0.0L);
        }

        fft(A1, 1);
        fft(A2, 1);
        fft(B1, 1);
        fft(B2, 1);

        for (int i = 0; i < n; ++i)
        {
            C1[i] = A2[i] * B2[i];
            C2[i] = A1[i] * B2[i] + A2[i] * B1[i];
            C3[i] = A1[i] * B1[i];
        }

        fft(C1, -1);
        fft(C2, -1);
        fft(C3, -1);

        vector<int> res(need);
        for (int i = 0; i < need; ++i)
        {
            long long v0 = (long long)(C1[i].real() / n + 0.5L) % p;
            long long v1 = (long long)(C2[i].real() / n + 0.5L) % p;
            long long v2 = (long long)(C3[i].real() / n + 0.5L) % p;

            long long t0 = v0;
            long long t1 = v1 * (1ll << 15) % p;
            long long t2 = v2 * (1ll << 30) % p;
            long long v = (t0 + t1 + t2) % p;
            res[i] = (int)v;
        }
        return res;
    }

    inline vector<int> inverse(const vector<int> &a, int n, int p)
    {
        if (n == 1)
        {
            int a0 = (a[0] % p + p) % p;
            return vector<int>{inversion(a0, p)};
        }
        int m = (n + 1) >> 1;
        vector<int> b = inverse(a, m, p);
        vector<int> a_cut(n);
        for (int i = 0; i < n && i < (int)a.size(); ++i)
            a_cut[i] = (a[i] % p + p) % p;
        vector<int> c = convolution(a_cut, b, p);
        if ((int)c.size() < n)
            c.resize(n, 0);
        else
            c.resize(n);
        vector<int> d(n);
        d[0] = (2 - c[0]) % p;
        if (d[0] < 0)
            d[0] += p;
        for (int i = 1; i < n; ++i)
        {
            d[i] = (-c[i]) % p;
            if (d[i] < 0)
                d[i] += p;
        }
        vector<int> res = convolution(b, d, p);
        if ((int)res.size() < n)
            res.resize(n, 0);
        else
            res.resize(n);

        return res;
    }

    inline vector<int> inverse(const vector<int> &a, int p)
    {
        return inverse(a, (int)a.size(), p);
    }

    inline vector<int> set(const vector<int> &f, int c, int p)
    {
        int n = (int)f.size();
        vector<int> g(n + 1);
        for (int i = 0; i < n; ++i)
        {
            g[i + 1] = (g[i + 1] + f[i]) % p;
            g[i] = (g[i] + 1ll * c * f[i]) % p;
        }
        return g;
    }
}

namespace Loyalty
{
    int n, k, a[N];
    inline vector<int> cdq(int l, int r)
    {
        if (l == r)
            return {1, a[l]};
        int mid = l + r >> 1;
        return Poly::convolution(cdq(l, mid), cdq(mid + 1, r), mod);
    }
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        cin >> n >> k;
        for (int i = 1; i <= n; ++i)
            cin >> a[i];
        cout << cdq(1, n)[k] << '\n';
    }
}

```

## 做题笔记补充

这是不是生成函数板子啊/yun

容易发现答案就是 $[x^k]\prod\limits_{i=1}^n(a_ix+1)$，这个东西形如 $n$ 个多项式相乘，使用分治 NTT 即可。因为模数非 NTT 友好所以可以使用拆系数的 FFT 求解。

总时间复杂度为 $O(n\log^2n)$，可以通过该题。

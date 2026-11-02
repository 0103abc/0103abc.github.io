---
title: "CF403D Beautiful Pairs of Numbers 题解"
date: "2025-08-29T15:34:28.000Z"
link: "luogu-g7w4rwq4"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "前缀和", "动态规划", "数学", "组合数学"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/g7w4rwq4)。

首先注意到存在方案时 $k$ 的量级不超过 $O(\sqrt n)$（ $\sum\limits_{i=1}^n$ 是 $O(n^2)$ 量级），因此当 $k>50$ 时直接输出 $0$，此时只需要考虑 $k\le 50$ 时的做法。一种常规的做法是设 $f_{i,j,k}$ 表示当前考虑了前 $i$ 个位置，最后一次选择的区间长度为 $j$，当前共选择了 $k$ 个区间，**钦定选的区间长度从小到大**的方案数（为什么这样钦定是对的？选择的区间长度互不相同但是长度之间互相没有影响，因此随便钦定个顺序然后最后答案乘以 $k!$ 即可），用前缀和优化然后统一预处理可以做到 $O(T+n^\frac{5}{2})$ 解决。

这里再提供一种题解区里比较厉害的做法：设 $f_{i,j}$ 表示当前所有区间长度的和为 $i$，共选择了 $j$ 个区间，**仍然钦定选的区间长度从小到大**的方案数。这个 dp 是容易转移的。然后考虑怎么算答案：枚举区间总长度为 $i$，然后剩下的部分可以拿组合数算一下然后乘以 $k!$，答案就是 $\sum\limits_{i=1}^n{k!\binom{n+k-i}kf_{k,i}}$，显然可以 $O(n^\frac52)$ 预处理然后 $O(1)$ 回答，总时间复杂度也为 $O(T+n^\frac52)$ 可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;

const int N = 1000010;
const int mod = 1e9 + 7;
const int inf = 1e18;
using ld = long double;
using ull = unsigned long long;

int n, fac[N], ifac[N], inv[N], f[2010][2010], g[2010][2010];
inline void add(int &x, int v) { x = (x + v) % mod; }
inline int binom(int a, int b)
{
    if (b < 0 || a < b)
        return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int T;
    cin >> T;
    for (int i = 0; i < 2; ++i)
        fac[i] = inv[i] = ifac[i] = 1;
    for (int i = 2; i < N; ++i)
    {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
    g[0][0] = 1;
    for (int i = 1; i <= 50; ++i)
        for (int j = i * (i + 1) / 2; j <= 1000; ++j)
            g[i][j] = (g[i][j - i] + g[i - 1][j - i]) % mod;
    for (int i = 1; i <= 1000; ++i)
        for (int j = 1; j <= 50; ++j)
        {
            for (int k = j * (j + 1) / 2; k <= i; ++k)
                add(f[i][j], g[j][k] * binom(j + i - k, j) % mod);
            f[i][j] = f[i][j] * fac[j] % mod;
        }
    while (T--)
    {
        int n, k;
        cin >> n >> k;
        if (k > 50)
        {
            cout << 0 << '\n';
            continue;
        }
        cout << f[n][k] << '\n';
    }
    return 0;
}
```

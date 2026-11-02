---
title: "P13382 [GCJ 2011 Finals] Runs 题解"
date: "2025-10-25T11:33:01.000Z"
link: "luogu-3o44fp8k"
categories: ["题解"]
tags: ["洛谷", "动态规划", "字符串"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/3o44fp8k)。

建议先做 [P7967](https://www.luogu.com.cn/problem/P7967)。考虑连续段 dp。为了方便处理，这里把字符串 $s$ 离散化，记 $w$ 表示 $s$ 中最大的字符。

设 $f_{i,j}$ 表示当前用了前 $i$ 个字符，当前有恰好 $j$ 个连续段的方案数。因为 $s$ 串被离散化了，所以初始条件为 $f_{1,1}=1$。

转移时考虑插入一个新的**连续段**（注意：不是单个字符），考虑将其插入对答案造成的影响：

+ 插入到两个连续段之间：新增一个连续段
+ 插入到一个连续段内：新增两个连续段

因此想到一个简单的转移：若当前用到第 $i$ 个字符，当前恰有 $j$ 个连续段，那么枚举插入到一个连续段内的连续段数 $k$，插入到两个连续段之间的连续段数 $p$（需满足 $k\neq 0\lor p\neq 0$ 且 $j+2k+p\le cnt$，其中 $cnt$ 是原始串 $s$ 的连续段数量），转移方程即为：

$$
f_{i+1,j+2k+p}\leftarrow f_{i,j}\binom{buc_i-1}{k+p-1}\binom{j+1}{p}\binom{pre_i-j}{k}
$$

其中 $buc_i$ 为串 $s$ 中字符 $i$ 出现的次数，$pre_i$ 为串 $s$ 中字符 $1$ 到字符 $i$ 出现次数的总和（$s$ 为离散化后的串）。

直接暴力转移时间复杂度为 $O(\sum n^3\omega)$，其中 $\omega$ 为字符集大小，这里取 $\omega=26$，可以通过。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <iostream>
#include <string.h>
#include <bits/stl_algo.h>
#define int long long
using namespace std;
const int N = 1000010;
const int inf = 1e18;
const int mod = 1000003;

inline int power(int a, int b, int c)
{
    int ans = 1;
    while (b)
    {
        if (b & 1)
            ans = ans * a % c;
        a = a * a % c, b >>= 1;
    }
    return ans;
}

inline int inversion(int x) { return power(x, mod - 2, mod); }

using ull = unsigned long long;
using i128 = __int128;

int f[30][110];
char s[N], t[N];
int fac[N], inv[N], ifac[N];
inline int binom(int a, int b)
{
    if (b < 0 || a < b)
        return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}
inline void add(int &x, int v) { x += v; if (x >= mod) x -= mod; }

signed main()
{
    // freopen("1.in", "r", stdin);
    // freopen("1.out", "w", stdout);
    // cin.tie(0)->sync_with_stdio(false);
    for (int i = 0; i < 2; ++i)
        fac[i] = inv[i] = ifac[i] = 1;
    for (int i = 2; i < N; ++i)
    {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
    int T, ca = 1;
    cin >> T;
    while (T--)
    {
        scanf("%s", s + 1);
        int n = strlen(s + 1), buc[30] = {0};
        for (int i = 1; i <= n; ++i)
            t[i] = s[i];
        sort(t + 1, t + n + 1);
        int _ = unique(t + 1, t + n + 1) - t - 1;
        for (int i = 1; i <= n; ++i)
            s[i] = lower_bound(t + 1, t + _ + 1, s[i]) - t + 'a' - 1;
        for (int i = 1; i <= n; ++i)
            ++buc[s[i] - 'a' + 1];
        memset(f, 0, sizeof f);
        f[1][1] = 1;
        int cnt = 1;
        for (int i = 1; i < n; ++i)
            if (s[i] != s[i + 1])
                ++cnt;
        int now = buc[1];
        for (int i = 2; i <= _; ++i)
        {
            for (int j = 0; j <= min(now, cnt); ++j)
                for (int k = 0; k <= min(buc[i], cnt); ++k)
                    for (int p = 0; p <= cnt && k + p <= buc[i]; ++p)
                        if ((k || p) && j + 2 * k + p <= cnt)
                            add(f[i][j + 2 * k + p], f[i - 1][j] * binom(buc[i] - 1, k + p - 1) % mod * binom(j + 1, p) % mod * binom(now - j, k) % mod);
            now += buc[i];
        }
        cout << "Case #" << (ca++) << ": ";
        cout << f[_][cnt] << '\n';
    }
    return 0;
}

```

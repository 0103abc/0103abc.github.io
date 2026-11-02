---
title: "CF185D Visit of the Great 题解"
date: "2025-09-29T14:18:59.000Z"
link: "luogu-of8c24d8"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/of8c24d8)。

~~吐槽一句：这样例纯 10Q 吧~~

对于任意两个位置 $i,j$ 满足 $l\le i<j\le r$，其 $\gcd$ 为：$\gcd(k^{2^i}+1,k^{2^j}+1)$。设这个值为 $g$，那么有 $k^{2^i}\equiv k^{2^j}\equiv g-1\pmod g$，又因为 $g-1\equiv -1\pmod g$，所以 $k^{2^i}\equiv (-1)^{2^i}\equiv 1\pmod g$ 即 $-1\equiv 1\pmod g$。因此可以确定 $g\mid 2$ 即 $g\in\lbrace 1,2\rbrace$。简单分类即可得到 $g=2$ 当且仅当 $k$ 是奇数，$g=1$ 当且仅当 $k$ 是偶数。

然后这个题就做完了：求 $\text{lcm}$ 可以先求出所有数的连乘积，然后再除掉这些数的共同因子。有必有除共同因子当且仅当 $g=2$ 即 $2\nmid k$，直接除以 $2^{r-l}$ 即可。而前面的连乘积形如：

$$
(k^{2^l}+1)(k^{2^{l+1}}+1)\ldots(k^{2^r}+1)
$$

考虑给这个东西变换一下形式，得到：

$$
(k^{2^l}+1)(k^{(2^l)^2}+1)\ldots(k^{(2^l)^{2^{r-l}}}+1)
$$

这个东西看上去十分眼熟，考虑初一数学的经典技巧，在前面补一项 $k^{2^l}-1$ 然后平方差消过去，最终得到上面式子的值为：

$$
\frac{k^{2^{r+1}}-1}{k^{2^l}-1}
$$

可以在 $O(\log n)$ 的时间复杂度内用快速幂和逆元计算。最后记得 $2\nmid k$ 的时候把答案除以公约数部分的 $2^{r-l}$。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
const int inf = 1e18;
int k, l, r, p;
inline int power(int a, int b, int c)
{
    a %= c;
    int ans = 1;
    while (b)
    {
        if (b & 1)
            ans = ans * a % c;
        a = a * a % c, b >>= 1;
    }
    return ans;
}
inline int inversion(int x) { return power(x, p - 2, p); }

int a[N], fa[N], siz[N];
inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
inline void merge(int x, int y)
{
    x = find(x), y = find(y);
    if (x != y)
        fa[x] = y, siz[y] += siz[x];
}

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    int T;
    cin >> T;
    while (T--)
    {
        cin >> k >> l >> r >> p;
        if (p == 2)
        {
            cout << (1 ^ (k & 1)) << '\n';
            continue;
        }
        int dz = 0;
        if (k % p)
            dz = power(k, power(2, l, p - 1), p);
        int res = power(2, r - l + 1, p), dzr = 0;
        if (k % p)
            dzr = power(k, power(2, r + 1, p - 1), p);
        if (dz != 1)
            res = power((dz + p - 1) % p, p - 2, p) * (dzr + p - 1) % p;
        if (k & 1)
            res = res * power(power(2, r - l, p), p - 2, p) % p;
        cout << res << '\n';
    }
    return 0;
}
```

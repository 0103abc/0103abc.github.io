---
title: "P5481 [BJOI2015] 糖果 题解"
date: "2025-07-09T11:30:31.000Z"
link: "luogu-2tyti24z"
categories: ["题解"]
tags: ["洛谷", "数学", "数论", "动态规划", "组合数学"]
draft: false
---

题目就是说让你用 $1\sim k$ 填一个 $n\times m$ 的表格，要求表格任意两行不同且每一行单调不递减，求方案数。发现行与行之间互相独立，因此考虑分开统计，计算出有多少种可以选择的行填法，设这个值为 $x$ 那么答案显然就是 $A_x^n$，此时问题变为有多少个长度为 $m$ 元素在 $1\sim k$ 之间的单调不递减序列。平方 dp 是简单的，但是显然这样无法通过。

考虑转化上面的问题：把下标看做 $x$ 坐标，值看做 $y$ 坐标，那么就相当于是求在一个平面直角坐标系上，从 $(1,1)$ 点向左 / 上走到 $(m,1),(m,2),\ldots,(m,k)$ 点的方案数的和，经典公式可得总方案数为 $\sum\limits_{i=1}^k\binom{m+i-2}{i-1}=\binom{m-1}{0}+\binom{m}{1}+\binom{m+1}{2}+\ldots+\binom{m+k-2}{k-1}=\binom{m}{0}+\binom{m}{1}+\binom{m+1}{2}+\ldots+\binom{m+k-2}{k-1}=\binom{m+k-1}{k-1}$，问题变为求 $\binom{a}{b}\bmod p$ 且 $a,b$ 都很大 $p$ 非质数且很大但是 $a-b$ 不大的神秘情况。考虑拆组合数，$\binom{a}{b}=\frac{a!}{b!(a-b)!}=\frac{a(a-1)(a-2)\ldots(b+1)}{(a-b)!}=\frac{a(a-1)(a-2)\ldots(b+1)}{1\times 2\times 3\times\ldots\times(a-b)}$，对这些项分解质因数然后扔到哈希表里一一抵消，分解质因数可以先线性筛出 $10^6$ 以内的数的最小质因子，然后若当前数 $\le 10^6$ 查表否则用 pollard rho 暴算，卡卡常可以通过。

```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;

const int N = 1000010;
const int inf = 1e18;

int n, m, k, mod;
int low[N], isp[N], pr[N], idx;
void sieve()
{
    isp[1] = low[1] = 1;
    for (int i = 2; i < N; ++i)
    {
        if (!isp[i])
            isp[i] = 1, low[i] = i, pr[++idx] = i;
        for (int j = 1; j <= idx && 1ll * i * pr[j] < N; ++j)
        {
            isp[i * pr[j]] = 1;
            low[i * pr[j]] = pr[j];
            if (i % pr[j] == 0)
                break;
        }
    }
}
unordered_map<int, int> mp;
mt19937 rnd(time(0));
inline int optimize(const int &a, const int &b, const int &c)
{
    register int ans = a * b - (long long)((long double)a * b / c + 0.5) * c;
    return ans < 0 ? ans + c : ans;
}
int ggcd(int a, int b)
{
    register int _a = __builtin_ctzll(a), _b = __builtin_ctzll(b);
    register int c = min(_a, _b);
    b >>= _b;
    while (a)
    {
        a >>= _a;
        register int diff = a - b;
        _a = __builtin_ctzll(diff);
        b = min(a, b);
        a = abs(diff);
    }
    return b << c;
}
int prime_list[] = {2, 7, 61};
int power(int a, int b, const int &c)
{
    register int s;
    for (s = 1; b; b >>= 1)
    {
        if (b & 1)
            s = optimize(s, a, c);
        a = optimize(a, a, c);
    }
    return s;
}
bool miller_rabin(const int &n, int &a)
{
    register int d = n - 1, r = 0;
    while (~d & 1)
        d >>= 1, ++r;
    register int x = power(a, d, n);
    if (x == 1)
        return true;
    for (register int i = 0; i < r; ++i)
    {
        if (x == n - 1)
            return true;
        x = optimize(x, x, n);
    }
    return false;
}
bool isprime(const int &n)
{
    if (n < 4)
        return n > 1;
    if (n == prime_list[0] || n == prime_list[1] || n == prime_list[2])
        return true;
    for (int i = 0; i < 3; ++i)
        if (n % prime_list[i] == 0 || !miller_rabin(n, prime_list[i]))
            return false;
    return true;
}
int seed, step;
inline int steps(int a, int mod)
{
    return (optimize(a, a, mod) + seed) % mod;
}
int floyd(const int &n)
{
    register int fast, slow, res = 1;
    seed = rnd() % n;
    fast = slow = rnd() % n;
    fast = steps(fast, n);
    for (register int i = 0; fast != slow; ++i)
    {
        res = optimize(res, fast + n - slow, n);
        if (!res)
            res = fast - slow + n;
        if (i % step == 0)
        {
            int g = ggcd(res, n);
            if (g != 1)
                return g;
            res = 1;
        }
        fast = steps(steps(fast, n), n), slow = steps(slow, n);
    }
    return ggcd(res, n);
}
int pollardrho(int n)
{
    if (n == 1)
        return 0;
    else if (isprime(n))
        return n;
    else
    {
        register int k = 1;
        step = (int)log(n);
        step = step << 1 | 1;
        while (k == 1)
            k = floyd(n);
        return max(pollardrho(k), pollardrho(n / k));
    }
}
void duel(int a, int val)
{
    if (isprime(a) || a == 1)
    {
        mp[a] = (mp[a] + mod + val) % mod;
        return;
    }
    while (a > 1)
    {
        int mpr;
        if (~a & 1)
            mpr = 2;
        else if (a % 3 == 0)
            mpr = 3;
        else if (a % 5 == 0)
            mpr = 5;
        else if (a % 7 == 0)
            mpr = 7;
        else if (a % 11 == 0)
            mpr = 11;
        else
            mpr = ((a < N) ? low[a] : pollardrho(a));
        // cerr << "Wtf? " << a << ' ' << mpr << '\n';
        mp[mpr] = (mp[mpr] + mod + val) % mod;
        a /= mpr;
    }
}
int solve(int a, int b)
{
    mp.clear();
    for (int i = a; i >= b + 1; --i)
    {
        // if (i % 2000 == 0)
        //     cerr << i << '\n';
        duel(i, 1 % mod), duel(a - i + 1, mod - 1);
    }
    int sum = 1;
    for (auto &[u, v] : mp)
        sum = sum * power(u, v, mod) % mod;
    return sum;
}

signed main()
{
    // freopen(".out", "w", stderr);
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    cin >> n >> m >> k >> mod;
    sieve();
    int key = solve(m + k - 1, k - 1), res = 1;
    for (int i = 1; i <= n; ++i)
        res = res * key % mod, key = (key + mod - 1) % mod;
    cout << res << '\n';
    return 0;
}
```

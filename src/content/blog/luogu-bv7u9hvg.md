---
title: "CF1513E Cost Equilibrium 题解"
date: "2025-08-23T15:08:50.000Z"
link: "luogu-bv7u9hvg"
categories: ["题解"]
tags: ["Codeforces", "数学", "计数"]
draft: false
---

鉴定为唐题。套路的先考虑什么样的数组是平衡数组：

+ 记 $\text{sum}=\sum\limits_{i=1}^na_i,\text{ave}=\frac{\text{sum}}n$。
+ 若 $\text{ave}\not\in\mathbb{N_+}$ 则显然该数组不可能为平衡数组。
+ 将数组内元素分为三个集合 $A=\lbrace a_x\mid x<\text{ave}\rbrace,B=\lbrace x\mid a_x=\text{ave}\rbrace,C=\lbrace x\mid a_x>\text{ave}\rbrace$，则显然 $B$ 集合内的元素不会影响答案。下面假设 $B$ 为空集：
+ 若有 $|A|=0$，则此时必有 $|C|=0$，很显然该数组为平衡数组。
+ 若有 $|A|=1$，则显然不论 $C$ 内元素即原数组 $a$ 中元素长什么样，数组都可以被唯一还原出来。$|C|=1$ 也同理。
+ 若有 $|A|>1,|C|>1$ 则显然唯一合法的情况是 $A,C$ 内部的下标都是连续的，即所有值比 $\text{ave}$ 小的元素和值比 $\text{ave}$ 大的元素在原数组中连续。

现在考虑计数。先特判掉 $\text{ave}\not\in\mathbb{N_+},|A|=0,|A|=1,|C|=1$ 的几种特殊情况。此时 $B$ 集合内的元素可以在所有 $n$ 个位置中随意填写，且这些元素对顺序不敏感，因此该部分方案数为 $\binom n{|B|}$，然后假设 $A$ 集合填在 $C$ 集合前面，那么此时两个集合的填写方案数都是可重集排列数，直接乘法原理将各部分相乘就可以求得答案。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;

const int N = 200010;
const int mod = 1e9 + 7;
const int inf = 1e18;
using ull = unsigned long long;

int a[N], b[N];
int fac[N], inv[N], ifac[N];
inline int binom(int a, int b)
{
    if (b < 0 || a < b)
        return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    int n;
    cin >> n;
    map<int, int> buc;
    for (int i = 1; i <= n; ++i)
        cin >> a[i], ++buc[a[i]];
    sort(a + 1, a + n + 1);
    int all = accumulate(a + 1, a + n + 1, 0ll);
    if (all % n)
        cout << 0 << '\n';
    else
    {
        all /= n;
        for (int i = 0; i < 2; ++i)
            fac[i] = inv[i] = ifac[i] = 1;
        for (int i = 2; i < N; ++i)
        {
            fac[i] = fac[i - 1] * i % mod;
            inv[i] = mod - inv[mod % i] * (mod / i) % mod;
            ifac[i] = ifac[i - 1] * inv[i] % mod;
        }
        int cnt = 0, pre = 0, suf = 0;
        for (int i = 1; i <= n; ++i)
            if (a[i] < all)
                ++pre;
            else if (a[i] > all)
                ++suf;
        if (pre <= 1 || suf <= 1)
        {
            int now = 1, all = n;
            for (int i = 1; i <= n; ++i)
                if (buc[a[i]])
                    now = now * binom(all, buc[a[i]]) % mod, all -= buc[a[i]], buc[a[i]] = 0;
            cout << now << '\n';
            return 0;
        }
        int now = binom(n, buc[all]);
        for (int i = 1; i <= n; ++i)
            if (a[i] < all && buc[a[i]])
                now = now * binom(pre, buc[a[i]]) % mod, pre -= buc[a[i]], buc[a[i]] = 0;
            else if (a[i] > all && buc[a[i]])
                now = now * binom(suf, buc[a[i]]) % mod, suf -= buc[a[i]], buc[a[i]] = 0;
        cnt = (cnt + now * 2) % mod;
        cout << cnt << '\n';
    }
    return 0;
}

```

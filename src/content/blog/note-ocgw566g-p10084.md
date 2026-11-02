---
title: "P10084 [GDKOI2024 提高组] 计算 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p10084"
categories: ["题解"]
tags: ["洛谷", "数学", "数论"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P10084).
:::

:::info[Solution]{open}
首先有经典结论 $\gcd(m^a-1,m^b-1)=m^{\gcd(a,b)}-1$，因此当 $a,b>0$ 时必有 $F(a,b)=m^{\gcd(a,b)}$，$L,R$ 就都可以被简单的表示出来。

然后可以发现 $L-1,R$ 都是 $m$ 的幂次的形式（这里认为 $0$ 是任何数的幂次），因此 $[L,R]$ 区间可以被分割成若干个长度为 $m$ 的完整段，每种模 $m$ 的余数都恰好出现 $\frac nm$ 次，其中 $n$ 是区间的长度即 $n=R-L+1$。问题变成：有 $k$ 个余数 $0,1,2,\ldots,m-1$，选一些数，使得余数的和在 $\bmod\ m$ 意义下为 $0$。

看到 $\bmod\ m$ 容易想到单位根反演，记 $\omega$ 为 $m$ 次单位根，则答案可以被表示为：$\frac 1m\sum\limits_{j=0}^{m-1}(\prod\limits_{p=0}^{m-1}(1+\omega^{jp}))^k$。记 $A_j=\prod\limits_{p=0}^{m-1}(1+\omega^{jp})$，则问题就在于计算 $A_j$ 的值。

记 $g=\gcd(j,m),t=\frac mg$，则 $\omega^j$ 的阶就是 $t$。令 $q=\omega^j$，因为 $q$ 的阶是 $t$，因此 $1,q,q^2,\ldots,q^{t-1}$ 就恰好是全部的 $t$ 次单位根。当 $p$ 从 $0$ 走到 $m-1$ 时，$q^p$ 会把这 $t$ 个单位根重复 $\frac mt=g$ 遍，因此显然有 $A_j=(\prod\limits_{p=0}^{t-1}(1+q^p))^{\frac mt}$。记 $B_t=\prod\limits_{p=0}^{t-1}(1+q^p)$，则只需要计算所有的 $B_t$ 的值即可。

有经典结论 $x^t-1=\prod\limits_{p=0}^{t-1}(x-q^p)$，代入 $x=-1$ 可得 $(-1)^t-1=\prod\limits_{p=0}^{t-1}(-1-q^i)=(-1)^t\prod\limits_{p=0}^{t-1}(1+q^t)$。

因此可以计算出 $B_i$ 的值：若 $i$ 为奇数，则 $B_i=2$，否则 $B_i=0$。反推可得若 $i$ 为奇数则有 $A_i^k=2^{\frac ni}$，否则有 $A_i^k=0$。

最后考虑所有 $m$ 次单位根中，阶恰好为 $t$ 的单位根恰好有 $\varphi(t)$ 个。因此可以考虑把所有的 $A_j^k$ 按照其阶 $t$ 的值来合并，即答案为 $\frac 1m\sum\limits_{t\mid m\land 2\nmid t}\varphi(t)2^{\frac nt}$。

具体实现过直接线性筛出 $\varphi$ 函数的值然后每组询问枚举 $m$ 的所有奇数因数 $t$ 算出 $\varphi(t)2^{\frac nt}$ 的值即可。总时间复杂度为 $O(V+T\sqrt m\log n)$，可以通过该题。注意幂的指数要对 $mod-1$ 取模而不是对 $mod$ 取模。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int phi[N], pr[N], isp[N], idx;

inline void init() {
    isp[1] = phi[1] = 1;
    for (int i = 2; i < N; ++i) {
        if (!isp[i]) pr[++idx] = i, phi[i] = i - 1;
        for (int j = 1; j <= idx && i * pr[j] < N; ++j) {
            isp[i * pr[j]] = 1;
            if (i % pr[j] == 0) { phi[i * pr[j]] = phi[i] * pr[j]; break; }
            phi[i * pr[j]] = phi[i] * (pr[j] - 1);
        }
    }
}

inline void sol() {
    int m, a, b, c, d; cin >> m >> a >> b >> c >> d;
    int res = 0, L = 1, R = 1;
    if (a && b) {
        int g = gcd(a, b);
        for (int i = 0; i < g; ++i) L *= m;
        ++L; 
    } else L = 1;
    if (c && d) {
        int g = gcd(c, d);
        for (int i = 0; i < g; ++i) R *= m;
    } else R = 0;
    if (L >= R) { cout << 1 << '\n'; return; }
    int n = R - L + 1;
    // cout << L << ' ' << R << '\n';
    for (int i = 1; i * i <= m; ++i) {
        if (m % i == 0) {
            if (i & 1) res = (res + power(2, n / i, mod) * phi[i] % mod) % mod;
            if (i * i != m && (m / i) % 2) res = (res + power(2, n / (m / i), mod) * phi[m / i] % mod) % mod;
        }
    }
    cout << res * inversion(m) % mod << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑

鲜活指数：5

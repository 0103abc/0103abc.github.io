---
title: "P10103 [GDKOI2023 提高组] 错排 题解"
date: "2026-07-02T06:31:56.000Z"
link: "luogu-y1knor8w"
categories: ["题解"]
tags: ["洛谷", "数学", "组合数学", "多项式"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/y1knor8w)。

记答案为 $f_{n,m}$，则考虑套路的对 $p_i\neq i$ 条件容斥，钦定有 $i$ 个位置 $x$ 满足 $x>m$ 且 $p_x=x$，剩下的数随便放，答案可以被表示为：

$$
f_{n,m}=\sum\limits_{i=0}^{n-m}(-1)^i\binom{n-m}i(n-m-i)!A_{n-m-i}^m
$$

需要特判 $2m>n$ 的情况，此时答案显然为 $0$。

套路的考虑离线所有询问然后用莫队来维护这个东西，问题在于如何快速的求出 $n\pm 1,m\pm 1$ 后的变化量 $\Delta$。

直接对着 $f_{n,m}$ 的式子做差看着就很难搞，考虑先把 $f_{n,m}$ 改写成更简单的形式：

$$
\begin{aligned}
f_{n,m}&=\sum\limits_{i=0}^{n-m}(-1)^i\binom{n-m}i(n-m-i)!A_{n-m-i}^m\\
&=\sum\limits_{i=0}^{n-m}(-1)^i\binom{n-m}i(n-m-i)!^2\frac1{(n-2m-i)!}\\
&=\sum\limits_{i=0}^{n-2m}(-1)^i\frac{(n-m)!}{i!(n-m-i)!}(n-m-i)!^2\frac{1}{(n-2m-i)!}\\
&=(n-m)!\sum\limits_{i=0}^{n-2m}(-1)^i\frac{(n-m-i)!}{i!(n-2m-i)!}\\
&=(n-m)!m!\sum\limits_{i=0}^{n-2m}(-1)^i\frac{\binom{n-m-i}m}{i!}
\end{aligned}
$$

这个东西还是很难维护，但 $f_{n,m}$ 已经没法继续化简了，想要进一步直接对着这个搞事情的话可以把 $f_{n,m}$ 写成生成函数的形式 $f_{n,m}=(n-m)!m![x^{n-2m}]\frac{e^{-x}}{(1-x)^{m+1}}$，但是看上去这个也没啥好的性质搞下去。

考虑换一个方向思考，先对式子换元，记 $r=n-2m,a=n-m$，则 $f_{n,m}=\frac{a!}{r!}\sum\limits_{i=0}^r(-1)^i\binom ri(a-i)!$。把式子的后半部分拿出来即 $g_{a,r}=\sum\limits_{i=0}^r(-1)^i\binom ri(a-i)!$，则得到 $g_{a,r}$ 后就有 $f_{n,m}=\frac{a!}{r!}g_{a,r}$。

考虑对 $g_{a,r}$ 快速求出 $r,\red{m}$ 两个量 $\pm 1$ 后的变化量 $\Delta$。此时考虑同时维护 $g_{a,r},g_{a-1,r-1}$ 两个值，这样在 $r,m$ 两个量 $\pm 1$ 时就可以 $O(1)$ 做到两个量互相转移，具体过程这里不再赘述。

因此直接拿普通莫队维护即可，时间复杂度为 $O(n\sqrt n)$。

:::success[代码]
```cpp line-numbers
namespace lowspeed_song {

int fac[N], inv[N], ifac[N];

inline void init() {
    fac[0] = inv[0] = ifac[0] = 1;
    fac[1] = inv[1] = ifac[1] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
}

inline int binom(int a, int b) {
    if (b < 0 || a < b) return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}

int res[N];

struct Query { int r, m, id; } Q[N];

inline void addM(int &R, int &M, int &x, int &y) {
    int tmp = ((R + M + 1) * x + R * y % mod) % mod;
    if (R > 0) y = (x + y) % mod;
    else y = 0;
    x = tmp, ++M;
}

inline void delM(int &R, int &M, int &x, int &y) {
    int tmp = (x - R * y % mod + mod) * inv[M] % mod;
    if (R > 0) y = (y + mod - tmp) % mod;
    else y = 0;
    x = tmp, --M;
}

inline void addR(int &R, int &M, int &x, int &y) {
    int tmp = ((R + M) * x % mod + R * y % mod) % mod;
    y = x, x = tmp, ++R;
}

inline void delR(int &R, int &M, int &x, int &y) {
    if (R == 1) x = y, y = 0;
    else {
        int tmp = (x - y * (R + M - 1) % mod + mod) % mod * inv[R - 1] % mod;
        x = y, y = tmp;
    } --R;
}

inline void sol() {
    int q; cin >> q;
    for (int i = 0; i < q; ++i) {
        int n, m; cin >> n >> m;
        if (m < 0 || n < m * 2) { res[i] = -1; continue; }
        Q[i] = {n - m - m, m, i};
    }
    int B = 316;
    sort(Q, Q + q, [&](auto &l, auto &r) {
        return l.r / B < r.r / B || l.r / B == r.r / B && l.m < r.m;
    });
    int R = 0, M = 0, x = 1, y = 0;
    for (int i = 0; i < q; ++i) {
        while (R < Q[i].r) addR(R, M, x, y);
        while (R > Q[i].r) delR(R, M, x, y);
        while (M < Q[i].m) addM(R, M, x, y);
        while (M > Q[i].m) delM(R, M, x, y);
        if (~res[Q[i].id]) res[Q[i].id] = fac[Q[i].r + Q[i].m] * ifac[Q[i].r] % mod * x % mod;
        else res[Q[i].id] = 0;
    }
    for (int i = 0; i < q; ++i) cout << res[i] << '\n';
}

} // namespace lowspeed_song
```
:::

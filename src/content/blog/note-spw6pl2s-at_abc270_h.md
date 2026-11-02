---
title: "AT_abc270_h [ABC270Ex] add 1 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-at_abc270_h"
categories: ["题解"]
tags: ["AtCoder", "数学", "概率与期望"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/AT_abc270_h).
:::

:::info[Solution]{open}
记 $C_i$ 表示当前第 $i$ 个计数器的数值。考虑用 $K=\max\limits_i(A_i-C_i)$ 来记录一组计数器的状态。当且仅当 $K\le 0$ 时一组计数器才是满足题目要求的。考虑对于一个状态 $K$，若选择了第 $j$ 个计数其，则 $K$ 状态就会变成 $\min(K-1,A_j)$。

设 $f_i$ 表示当前的状态 $K=i$ 时，期望还需要操作多少次。记 $S_i$ 表示满足 $A_j<i$ 的 $j$ 的数量，则选中这 $S_i$ 个位置时新的状态是 $K-1$，否则新的状态是对应的 $A_j$ 值。因此转移方程可以被写作：$f_i=1+\frac{S_i}nf_{i-1}+\frac1n\sum\limits_{A_j\ge i}f_{A_j}$，可以做到 $O(V)$ 时间复杂度解决问题。

考虑进一步优化。套路的对相邻的两个 $f_i$ 做差：$f_{i+1}$ 的值可以被表示为 $f_{i+1}=1+\frac{S_i}nf_i+\frac 1n\sum\limits_{A_j\ge i}f_{A_j}$ 的形式，两式做差可得 $g_i=f_i-f_{i-1}$ 的递推式是 $g_{i+1}=\frac{S_i}ng_i$。再人为的定义 $f_{A_n+1}=f_{A_n}+1,g_{A_n+1}=1$，则答案可以被表示为 $f_{A_n}-f_0=\sum\limits_{j=1}^{A_n}g_j$ 的形式。

现在考虑一段 $k\in(A_{i-1},A_i]$，若满足 $A_i>A_{i-1}$，则这一段中恰好有前 $i-1$ 个 $A_j$ 满足 $A_j<k$，因此 $S_k=i-1$。设 $p=\frac{n}{i-1},d=A_i-A_{i-1}$，则若当前已经知道 $g_{A_i+1}=G$，则必有 $g_{A_i}=Gp,g_{A_i-1}=Gp^2,\ldots,g_{A_{i-1}+1}=Gp^d$。因此这一整段对答案的贡献就可以被表示为等比数列求和的形式即 $G(p+p^2+\ldots+p^d)=G\frac{p(p^d-1)}{p-1}$ 的形式，然后更新 $G\leftarrow Gp^d$ 即可。

于是问题的时间复杂度被优化到 $O(n\log V)$ 的级别，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int a[N], f[N], inv[N];

inline void init() {
    inv[0] = inv[1] = 1;
    for (int i = 2; i < N; ++i) inv[i] = mod - inv[mod % i] * (mod / i) % mod;
}

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    int all = 0;
    for (int i = n - 1; i; --i) {
        f[i] = (power(n * inv[i] % mod, a[i + 1] - a[i], mod) * f[i + 1] % mod + (power(n * inv[i] % mod, a[i + 1] - a[i], mod) - 1) * inversion(n * inv[i] % mod - 1) % mod * (n - all + mod) % mod * inv[i]) % mod;
        all = (all + f[i]) % mod;
    } cout << f[1] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：8

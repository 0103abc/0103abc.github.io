---
title: "P6031 CF1278F Cards 加强版 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p6031"
categories: ["题解"]
tags: ["洛谷", "数学", "概率与期望", "组合数学"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P6031).
:::

:::info[Solution]{open}
在上一题中已经得到了可以 $O(n\log n)$ 计算的答案形式 $\frac1{m^n}\sum\limits_{j=0}^kS_2(k,j)j!\binom njm^{n-j}$，现在考虑将其优化到严格线性时间复杂度解决。

现在令 $p=\frac 1m$，做一个随机试验：有 $n$ 个人，每个人独立的以概率 $p$ 被选中，设最终选中了 $X$ 个人，对一次确定的结果，$X^k$ 表示在选中的人中有顺序允许重复的选择 $k$ 次的方案书。

现在换一个角度数这 $k$ 次选择。假设这 $k$ 个位置中实际出现了 $j$ 个不同的人，则把 $k$ 个位置分成 $j$ 个非空组有 $S_2(k,j)$ 种方案，然后给 $j$ 个组安排 $j$ 个不同的人有 $j!\binom nj$ 种方案，这 $j$ 个人全部比选中的概率为 $p^j$。因此有 $\mathbb E[x^k]=\sum\limits_jS_2(k,j)j!\binom njp^j=A$。然后考虑对“恰好使用 $j$ 个不同的人”这一限制条件直接做容斥，得到 $j!S_2(k,j)=\sum\limits_{i=0}^j(-1)^{j-i}\binom jii^k$，代入原式可得 $\sum\limits_{j=0}^{\min(n,k)}\binom njp^j\sum\limits_{i=0}^j(-1)^{j-i}\binom jii^k$，交换求和可得 $\sum\limits_{i=0}^{\min(n,k)}i^k\binom nip^if_i$，其中 $f_i=\sum\limits_{j=0}^{\min(n,k)-i}(-p)^j\binom{n-i}j$。

考虑线性递推 $f_i$。初始条件显然是 $f_k=1$，递推可以倒推，根据 Pascal 公式可得 $f_i=(1-p)f_{i+1}+(-p)^{\min(n,k)-i}\binom{n-i-1}{\min(n,k)-i}$。

剩下部分的 $g_i=\binom nip^i$ 也同样可以线性递推，拆一下组合数就可以得到 $g_{i+1}=g_i\frac{n-i}i+1\times p$，初始条件是 $g_0=1$。

最后的答案就是 $\sum\limits_{i=0}^{\min(n,k)}i^kf_ig_i$，$i^k$ 是积性函数直接线性筛求出即可。总时间复杂度被优化到 $O(k)$，可以通过该题。

需要卡空间。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int inv[N], h[N];

inline void init() {
    inv[0] = inv[1] = h[0] = 1;
    for (int i = 2; i < N; ++i) inv[i] = mod - inv[mod % i] * (mod / i) % mod;
}

unsigned char isp[N];
signed pr[N / 10], idx;
int pwr[N];

inline void sol() {
    int n, m, k; cin >> n >> m >> k;
    int o = 1, x = inversion(m);
    for (int i = 1; i <= min(n, k); ++i) {
        o = o * (mod - x) % mod * ((n - min(n, k) + i - 1) % mod) % mod * inv[i] % mod;
        h[i] = ((1 - x + mod) % mod * h[i - 1] + o) % mod;
    }
    pwr[1] = isp[1] = 1;
    for (int i = 2; i < N; ++i) {
        if (!isp[i]) pr[++idx] = i, pwr[i] = power(i, k, mod);
        for (int j = 1; j <= idx && i * pr[j] < N; ++j) {
            if (i % pr[j] == 0) break;
            isp[i * pr[j]] = 1, pwr[i * pr[j]] = pwr[i] * pwr[pr[j]] % mod;
        }
    }
    int res = 0, w = 1;
    for (int i = 0; i <= min(n, k); ++i) {
        res = (res + pwr[i] * w % mod * h[min(n, k) - i]) % mod;
        if (i < min(n, k)) w = w * ((n - i) % mod) % mod * x % mod * inv[i + 1] % mod;
    }
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：6

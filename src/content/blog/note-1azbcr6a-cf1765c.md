---
title: "CF1765C Card Guessing 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1765c"
categories: ["题解"]
tags: ["Codeforces", "数学", "概率与期望", "动态规划", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1765C).
:::

:::info[Solution]{open}
记最近的 $\min(k,i-1)$ 张牌中，四种花色的牌的出现次数分别为 $a_1,a_2,a_3,a_4$，记出现次数最小值 $m=\min(a_1,a_2,a_3,a_4)$，则猜对的概率就是 $\frac{n-m}{4n-k}$。因此只需要知道所有花色的最小出现次数 $m$ 就可以求出猜测对的概率。

因此考虑 dp。设 $g_{i,j}$ 表示长度为 $i$ 的有序抽牌序列中四种花色的最小出现次数为 $m$ 的序列数量。转移过程再用另一个 dp 优化：$f_{i,j}$ 表示已经处理了若干种花色，当前一共放入 $i$ 张牌，已经处理花色的最小出现次数为 $j$ 的方案数。初始条件显然为 $f_{0,n+1}=1$。加入一种新的花色时可以枚举从该花色中取出 $p$ 张牌，先选择这 $p$ 张具体的牌然后排序方案数为 $A_n^p$，然后将她们插入原来长度为 $i$ 的序列有 $\binom{i+p}{p}$ 种方案，因此总的转移式即为：$f'_{i+p,\min(j,p)}\leftarrow f'_{i+p,\min(j,p)}+f_{i,j}A_n^p\binom{i+p}p$。处理完内层 dp 后直接转移 $g_{i,j}=f_{i,j}$ 即可。

然后考虑长度为 $i$ 的所有有序抽牌序列的数量为 $A(4n,s)$，对固定的 $k$ 猜对的概率为 $P_k=\frac1{A(4n,\min(k,i-1))}\sum\limits_ig_{\min(k,i-1),i}\frac{n-m}{4n-\min(k,i-1)}$，最终的答案就是 $\sum\limits_{i=1}^{4n}P_{\min(k,i-1)}$。

直接模拟上述流程时间复杂度为 $O(n^3)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int fac[N], inv[N], ifac[N], pwr[N], ipwr[N];

inline void init() {
    fac[0] = inv[0] = ifac[0] = 1;
    fac[1] = inv[1] = ifac[1] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
    pwr[0] = ipwr[0] = 1;
    for (int i = 1; i < N; ++i) {
        pwr[i] = pwr[i - 1] * 2 % mod;
        ipwr[i] = ipwr[i - 1] * i2 % mod;
    }
}

inline int binom(int a, int b) {
    if (b < 0 || a < b) return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}

int f[2010][2010], g[2010][2010], h[N];

inline void sol() {
    int n, k; cin >> n >> k;
    for (int i = 0; i <= n; ++i) f[i][i] = fac[n] * ifac[n - i] % mod;
    for (int o = 1; o < 4; ++o) {
        memset(g, 0, sizeof g);
        for (int i = 0; i <= o * n; ++i)
            for (int j = max<int>(0, i - (o - 1) * n); j <= min(n, i / o); ++j)
                for (int p = 0; p <= n; ++p)
                    g[i + p][min(j, p)] = (g[i + p][min(j, p)] + f[i][j] * fac[n] % mod * ifac[n - p] % mod * binom(i + p, p) % mod) % mod;
        memcpy(f, g, sizeof f);
    }
    // h[i]: 对固定的 i 猜测对的概率
    for (int i = 0; i <= 4 * n; ++i)
        for (int j = 0; j <= n; ++j) h[i] = (h[i] + f[i][j] * (n - j) % mod) % mod;
    int res = 0;
    for (int i = 0; i < n * 4; ++i) {
        int K = min(k, i);
        res = (res + h[K] * fac[n * 4 - K - 1] % mod * ifac[n * 4] % mod) % mod;
    } cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：8

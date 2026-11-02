---
title: "P4152 [WC2014] 时空穿梭 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p4152"
categories: ["题解"]
tags: ["洛谷", "数学", "数论"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P4152).
:::

:::info[Solution]{open}
比较 boring 的题。

容易发现答案可以被表示为 $\sum\limits_{d1,d2,\ldots,d_n}\binom{\gcd(d_1,d_2,\ldots,d_n)-1}{c-2}\prod\limits_{i=1}^n(m_i-d_i)$，套路的枚举 $\gcd$ 的值然后用莫比乌斯反演来搞得到 $\sum\limits_g\binom{g-1}{c-2}\sum\limits_{d_1,d_2,\ldots,d_n}(\sum\limits_{dg\mid d_1,d_2,\ldots,d_n}\mu(d))\prod\limits_{i=1}^n(m_i-d_i)$，交换求和顺序然后整理可得 $\sum\limits_{g'}(\sum\limits_{dg=g'}\binom{g-1}{c-2}\mu(d))\prod\limits_{i=1}^n\sum\limits_{g'\mid d_i}(m_i-d_i)$。

考虑把式子的左右两侧分开来求，左侧直接预处理的时间复杂度就是调和级数级别的，右边直接算时间复杂度就是对的，因此可以通过该题，总时间复杂度为 $O(nm+cm\log m)$。 

直接做需要卡常，容易想到内层用整除分块来维护，时间复杂度优化到 $O(n\sqrt m+cm\log m)$。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

unsigned char isp[N]; u16 C[22][N], g[22][N]; int idx, pr[N];

inline void init() {
    C[0][0] = 1;
    for (int i = 1; i < N; ++i) {
        C[0][i] = 1;
        #pragma GCC unroll 10
        for (int j = 1; j <= 20; ++j) { int x = C[j - 1][i - 1] + C[j][i - 1]; C[j][i] = x >= mod ? x - mod : x; }
    }
    isp[1] = 1;
    for (int i = 2; i < N; ++i) {
        if (!isp[i]) pr[++idx] = i;
        for (int j = 1; j <= idx && i * pr[j] < N; ++j) {
            isp[i * pr[j]] = 1;
            if (i % pr[j] == 0) break;
        }
    }
    for (int i = 2; i <= 20; ++i) {
        #pragma GCC unroll 8
        for (int j = 1; j < N; ++j) g[i][j] = C[i - 2][j - 1];
        for (int j = 1; j <= idx; ++j)
            #pragma GCC unroll 8
            for (int k = (N - 1) / pr[j]; k; --k)
                g[i][pr[j] * k] = g[i][pr[j] * k] >= g[i][k] ? g[i][pr[j] * k] - g[i][k] : g[i][pr[j] * k] + mod - g[i][k];
    }
}

int m[N];

inline void sol() {
    int n, c; cin >> n >> c;
    int mi = inf, res = 0;
    for (int i = 1; i <= n; ++i) cin >> m[i], mi = min(mi, m[i]);
    if (n == 1) { cout << C[c][m[1]] << '\n'; return; }
    if (c == 2) { int ans = 1; for (int i = 1; i <= n; ++i) ans = (i64)ans * m[i] * (m[i] - 1) / 2 % mod; cout << ans << '\n'; return; }
    if (c - 1 >= mi) { cout << 0 << '\n'; return; }
    int q[22], r[22];
    for (int j = 1; j <= n; ++j) q[j] = m[j] / (c - 1), r[j] = m[j] / q[j];
    for (int i = c - 1; i < mi; ++i) {
        int inner = g[c][i]; if (!inner) continue;
        #pragma GCC unroll 8
        for (int j = 1; j <= n; ++j) { if (i > r[j]) q[j] = m[j] / i, r[j] = m[j] / q[j]; inner = (i64)inner * ((i64)m[j] * q[j] - (i64)(q[j] + 1) * q[j] / 2 * i) % mod; }
        res += inner; if (res >= mod) res -= mod;
    }
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：-2

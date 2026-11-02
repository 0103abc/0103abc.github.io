---
title: "P17801 [CXOI2026] 大潘小潘向前 p 题解"
date: "2026-10-26T03:17:51.000Z"
link: "luogu-pvmooe5i"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数学", "组合数学"]
draft: false
---

首先问题可以被转化为计数长度为 $n$ 的整数序列 $a$ 满足下面两个条件：

+ $1\le a_i\le b_i$（$b_i$ 是所有对序列限制的上界）
+ 序列恰好有 $k-1$ 个位置 $i$ 满足 $a_i>a_{i+1}$。

考虑 dp。设 $f_{i,j}$ 表示当前考虑了前 $i$ 个位置，被切成了 $j$ 个连续不下降段，且 $i$ 位置为第 $j$ 个连续段的最后一个位置的方案数。初始条件显然就是 $f_{0,0}=1$。转移考虑枚举第 $j$ 个连续不下降段是 $[p,i]$，则转移方程可以写作 $f_{i,j}=\sum\limits_{p=1}^if_{p-1,j-1}g_{p,i}$，其中 $g_{p,i}$ 是 $[p,i]$ 区间形成不同的不下降段的数量。

现在考虑计算 $g_{i,j}$ 的值。注意到此时满足条件的序列 $a$ 必须满足 $a_i\le a_{i+1}\le\ldots\le a_j$，因此考虑先收紧上界，记 $c_k=\min\limits_{p=k}^jb_p$（即区间的后缀上界最小值），则上界限制可以变为 $1\le a_k\le c_k$，并且有 $c_i\le c_{i+1}\le\ldots\le c_j$。

规定空区间的方案数为 $g_{j+1,j}=1$，则可以得到递推式 $g_{i,j}=\sum\limits_{t=1}^{j-i+1}(-1)^{t-1}\binom{c_i}{t}g_{i+t,j}$。计算时固定右端点 $j$，按照 $i=j,j-1,\ldots,1$ 的顺序转移即可。由于组合数的下标 $t$ 不超过 $n$，可以利用 $\binom{x}{t}=\binom{x}{t-1}\frac{x-t+1}{t}$ 依次计算，不需要预处理到 $V$。

但是注意到上面 $f$ 的 dp 计算的是将序列切成 $j$ 个不下降段的方案数，并不等于恰好有 $j-1$ 个位置满足 $a_i>a_{i+1}$ 的序列数量。设 $A_k$ 表示恰好有 $k-1$ 个下降位置的序列数量。对于这样的序列，所有下降位置都必须切开，然后还要从剩下的 $n-k$ 个位置中选择 $j-k$ 个位置切开，因此有 $f_{n,j}=\sum\limits_{k=1}^jA_k\binom{n-k}{j-k}$。从小到大计算即可得到 $A_k=f_{n,k}-\sum\limits_{j=1}^{k-1}A_j\binom{n-j}{k-j}$。

计算所有 $g_{i,j}$ 和 $f_{i,j}$ 的时间复杂度均为 $O(n^3)$，最后反演的时间复杂度为 $O(n^2)$，因此整个算法的时间复杂度就是 $O(n^3)$，可以通过该题。

:::success[代码实现]
```cpp line-numbers

namespace lowspeed_song {

int C[1010][1010], inv[N];

inline void init() {
    C[0][0] = 1;
    for (int i = 1; i < 1010; ++i) {
        C[i][0] = 1;
        for (int j = 1; j <= i; ++j)
            C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % mod;
    }
    inv[0] = inv[1] = 1;
    for (int i = 2; i < N; ++i) inv[i] = mod - inv[mod % i] * (mod / i) % mod;
}

int x[N], y[N], b[N], f[510][510], g[510][510], res[N];

inline void sol() {
    int n, m, V; cin >> n >> m >> V;
    for (int i = 1; i <= m; ++i) cin >> x[i] >> y[i];
    for (int i = 1; i <= n; i++) b[i] = V;
    for (int i = 1; i <= m; ++i) b[x[i]] = min(b[x[i]], y[i]);
    memset(f, 0, sizeof f), memset(g, 0, sizeof g);
    for (int i = 1; i <= n; ++i) {
        g[i + 1][i] = 1;
        int mi = V;
        for (int j = i; j; --j) {
            mi = min(mi, b[j]);
            int s = 0, c = 1;
            for (int k = 1; k <= min(mi, i - j + 1); ++k) {
                c = c * (mi - k + 1) % mod * inv[k] % mod;
                if (k & 1) s = (s + c * g[j + k][i] % mod) % mod;
                else s = (s + mod - c * g[j + k][i] % mod) % mod;
            } g[j][i] = s;
        }
    } f[0][0] = 1;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= i; ++j)
            for (int k = j; k <= i; ++k) f[i][j] = (f[i][j] + f[k - 1][j - 1] * g[k][i] % mod) % mod;
    for (int i = 1; i <= n; ++i) {
        res[i] = f[n][i];
        for (int j = 1; j < i; ++j) res[i] = (res[i] + mod - C[n - j][i - j] * res[j] % mod) % mod;
        cout << res[i] << ' ';
    } cout << '\n';
}

} // namespace lowspeed_song
:::

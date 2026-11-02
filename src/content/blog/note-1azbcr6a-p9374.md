---
title: "P9374 「DROI」Round 2 单图 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p9374"
categories: ["题解"]
tags: ["洛谷", "图论", "强连通分量"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P9374).
:::

:::info[Solution]{open}
容易观察到合法的图结构必然是要么每个点没有入度要么没有出度要么是一个两个点的 SCC。

先不考虑两个点 SCC 这个结构，记有 $x$ 个点有没有入度，$y$ 个点没有出度。则对每个没有入度的点，其都只能连向没有出度的点。简单计数一下可以知道不同的连边方案数为 $(2^y-1)^x$。因为 $x+y=n$ 所以计数可以直接枚举 $x$ 的取值，总方案数就是 $\sum\limits_{i=0}^{n-1}\binom ni(2^{n-i}-1)^i$。

然后考虑枚举两个点 SCC 的数量为 $z$，得到总计数公式 $\sum\limits_{z=0}^{n/2}\binom{n}{2z}(\sum\limits_{i=0}^{n-2z-1}\binom {n-2z}i(2^{n-2z-i}-1)^i)(\prod\limits_{i=1}^{z}(2i-1))$。直接算时间复杂度是 $O(n^2)$ 的，考虑优化。注意到内层的 $\prod\limits_{i=1}^z(2i-1)$ 可以预处理出来，$\sum\limits_{i=0}^{n-2z-1}\binom{n-2z}i(2^{n-2z-i}-1)^i$ 可以对每个 $z$ 分别提前计算出答案。此时时间复杂度被优化到 $O(n^2+Tn)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int C[N][N], f[N], g[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int T, mod; cin >> T >> mod;
    C[0][0] = 1;
    for (int i = 1; i < N; ++i) {
        C[i][0] = 1;
        for (int j = 1; j <= i; ++j) C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % mod;
    }
    f[0] = 1;
    for (int i = 0; i < N; ++i)
        for (int j = 0; j < i; ++j)
            f[i] = (f[i] + C[i][j] * power(power(2, i - j, mod) - 1, j, mod) % mod) % mod;
    g[0] = 1;
    for (int i = 1; i < N; ++i) {
        g[i] = 1;
        for (int j = 1; j <= i; ++j) g[i] = g[i] * (j + j - 1) % mod;
    }
    while (T--) {
        int n; cin >> n;
        int res = 0;
        for (int i = 0; i <= n / 2; ++i)
            res = (res + C[n][i + i] * g[i] % mod * f[n - i - i] % mod) % mod;
        cout << res << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：蓝

鲜活指数：7

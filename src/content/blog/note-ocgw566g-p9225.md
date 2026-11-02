---
title: "P9225 「PEOI Rd1」寻宝（treasure） 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p9225"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数据结构", "线段树", "单调队列"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P9225).
:::

:::info[Solution]{open}
先考虑最暴力的 dp。设 $f_{i,j}$ 表示当前只考虑了前 $i$ 台机器，得到恰好 $j\times 2^i$ 个钻石需要花费多少时间。初始条件显然是 $f_{1,j}=ja_1+\frac{j(j-1)}2b_1$，转移枚举其中有 $k\times 2^i$ 个钻石由前 $i-1$ 个机器生产，此时第 $i$ 个机器需要生产恰好 $j-k$ 次，转移方程式可以写作 $f_{i,j}=\min\limits_{0\le k\le j}(f_{i-1,2k}+(j-k)a_i+\frac{(j-k)(j-k-1)}2b_i)$。最后的答案就是 $f_{n,1}$。

考虑优化。分析答案上界可得，一台机器使用 $x$ 次费用至少为 $1+2+3+\ldots+x=\frac{x(x+1)}2$，因为答案不超过 $a_n$ 因此每台机器最多使用 $O(\sqrt{a_n})$ 次。前 $i$ 台机器一共生产的钻石不会超过 $O(\sqrt{a_n}2^i)$ 次，因此 $j$ 只需要枚举到 $O(\sqrt {a_n})$ 级别即可。

考虑进一步优化。改写一下上面的 dp 转移方程式可得$f_{i,j}=ja_i+\frac{j(j-1)}2b_i+\min\limits_k(Y_i-jb_ik)$ 的形式，其中 $Y_k=f_{i-1,2k}+\frac{k(k+1)}2b_i-ka_i$，因此每个 $k$ 的转移可以看作是一个一次函数 $y=-kx+Y_k$ 的形式，查询的位置是 $x=jb_i$，可以使用李超线段树优化到 $O(n\sqrt V\log n)$ 级别，仍然不太能通过。

注意到查询的位置也是一个一次函数的形式，因此随着 $j$ 递增查询的位置也是单调递增的，因此考虑斜率优化，用单调队列维护下凸壳，时间复杂度优化到 $O(n\sqrt V)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N], q[N], f[5010][5010];

inline ld slope(int id, int x, int y) {
    return 1.L * (f[id - 1][2 * x] - f[id - 1][2 * y] - (x - y) * a[id] + (x * (x + 1) - y * (y + 1)) / 2 * b[id]) / (x - y);
}

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) cin >> b[i];
    const int lim = sqrt(2 * a[n]);
    for (int i = 1; i <= lim; ++i) f[1][i] = i * a[1] + i * (i - 1) / 2 * b[1];
    for (int i = 2; i <= n; ++i) {
        int head = 1, tail = 1;
        q[1] = 0;
        for (int j = 1; j <= lim; ++j) {
            if (j + j <= lim) {
                while (head < tail && slope(i, q[tail - 1], q[tail]) >= slope(i, q[tail], j)) --tail;
                q[++tail] = j;
            } while (head < tail && slope(i, q[head], q[head + 1]) <= j * b[i]) ++head;
            f[i][j] = f[i - 1][q[head] * 2] + (j - q[head]) * a[i] + (j - q[head]) * (j - q[head] - 1) / 2 * b[i];
        }
    } cout << f[n][1] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：7

---
title: "P15001 摧毁时间线 题解"
date: "2026-08-31T10:42:39.000Z"
link: "luogu-fwz6yqeu"
categories: ["题解"]
tags: ["洛谷", "动态规划", "区间动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/fwz6yqeu)。

考虑区间 dp。设 $f_{l,r,i,j}$ 表示当前删除了区间 $[l,r]$，整个区间都删除完后 $r+1$ 后面的下一个存活点是 $i$，且 $j$ 必须在 $[l,j-1]$ 区间内点全部删除完后才能被删除。

这个状态看着就很奇怪，考虑这个 $j$ 有什么用。设 $[l,r]$ 区间中最后一个删除的是 $k$，则在删除 $k$ 的那一刻，$[l,k-1]$ 区间已经全没了，她最后一个点被删的时候其右邻居一定是 $k$ 但是第三项还需要 $k$ 后面的下一个存活点。设这个点是 $p$ 其中 $k+1\le p\le r+1$ 那么为了让左半边删除完时 $p$ 还活着，必须保证 $p$ 要在 $[k+1,p-1]$ 删除之后再删。所以右侧区间状态是 $f_{k+1,r,i,p}$ 而左侧区间看到的第二个右侧存活点是 $p$。

为了方便，后面记贡献 $C(l,r,i,k)=(a_{l-1}-x_k)^2+(a_k-y_{r+1})^2+(a_{r+1}-z_i)^2$。若当前限制点满足 $j\in[l,r]$ 则因为 $j$ 必须晚于其左边的所有点删除，所以最后整个区间删除的 $k$ 必须满足 $k\ge j$。因此考虑枚举 $k,p$ 得到转移方程 $f_{l,r,i,j}=\max\limits_{k=j}^r\max\limits_{p=k+1}^{r+1}f_{l,k-1,p,j}+f_{k+1,r,i,p}+C(l,r,i,k)$。

然后还有另一种情况是 $j=r+1$ 也就是整个 $[l,r]$ 都需要在外面的 $r+1$ 之前删除即没有任何额外限制，此时 $k$ 可以在 $[l,r]$ 范围内任意取值，但是左区间必须保证 $k$ 一直活到左侧区间删完，所以左状态需要使用限制点 $k$，转移方程形如 $f_{l,r,i,r+1}=\max\limits_{k=l}^r\max\limits_{p=k+1}^{r+1}(f_{l,k-1,p,k}+f_{k+1,r,i,p}+C(l,r,i,k))$。

可能需要处理一下边界。

时间复杂度为 $O(n^6)$，但是常数特别小所以可以通过该题。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

mt19937 mt(time(0));

int a[N], x[N], y[N], z[N], f[62][62][62][62];

inline int C(int l, int r, int i, int k) {
    return (a[l - 1] - x[k]) * (a[l - 1] - x[k]) + (a[k] - y[r + 1]) * (a[k] - y[r + 1]) + (a[r + 1] - z[i]) * (a[r + 1] - z[i]);
}

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) cin >> x[i];
    for (int i = 1; i <= n; ++i) cin >> y[i];
    for (int i = 1; i <= n; ++i) cin >> z[i];
    for (int i = 1; i <= n; ++i)
        for (int j = i + 2; j <= n + 2; ++j)
            f[i][i][j][i] = f[i][i][j][i + 1] = C(i, i, j, i);
    for (int len = 2; len <= n; ++len)
        for (int l = 1, r = len; r <= n; ++l, ++r)
            for (int i = r + 2; i <= n + 2; ++i) {
                for (int j = l; j <= r; ++j)
                    for (int k = j; k <= r; ++k)
                        for (int p = k + 1; p <= r + 1; ++p)
                            f[l][r][i][j] = max(f[l][r][i][j], f[l][k - 1][p][j] + f[k + 1][r][i][p] + C(l, r, i, k));
                for (int k = l; k <= r; ++k)
                    for (int p = k + 1; p <= r + 1; ++p)
                        f[l][r][i][r + 1] = max(f[l][r][i][r + 1], f[l][k - 1][p][k] + f[k + 1][r][i][p] + C(l, r, i, k));
            }
    int res = 0;
    for (int i = 1; i <= n + 2; ++i)
        for (int j = 1; j <= n + 2; ++j) res = max(res, f[1][n][i][j]);
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

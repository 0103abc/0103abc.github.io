---
title: "P14300 [JOI2023 预选赛 R2] 货物列车 / Freight Train 题解"
date: "2025-11-19T13:35:29.000Z"
link: "luogu-7pvh7b54"
categories: ["题解"]
tags: ["洛谷", "动态规划", "背包"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/7pvh7b54)。

先观察题目的性质，可以发现：

+ 拿到货物之后一定是将其直接运回到 $1$ 位置（可能会在别的地方再上货物，但是不会把已经上过的货物再拿下来）。

继续观察还可以发现：除了走的距离最近的那一次以外，其余每一次拿货物都把车厢拉满一定是最优的。

于是可以考虑 dp。设 $f_{i,j,k}$ 表示当前考虑了 $i\sim n$ 这个后缀内的物品，一共拿了 $j$ 个（在模 $W$ 意义下，特殊的把 $0$ 看做是 $W$），走了 $k$ 的路程，可得到的最大价值是多少。此时转移方程形如：

+ $f_{i,j,k}\leftarrow \max(f_{i+1,j,k},f_{i+1,j-1,k}+a_i)$

特殊的，需要特判掉拿了恰好 $1$ 个物品时的情况：

+ $f_{i,1,k}\leftarrow \max(f_{i+1,1,k},f_{i+1,w,k-2(i-1)}+a_i)$

直接做时空复杂度都是 $O(n^4)$ 的（注意总距离是 $O(n^2)$ 级别的）。空间是容易优化的，注意到 $f_i$ 的信息只会从 $f_{i+1}$ 递推过来所以可以把 $i$ 这个维度滚动掉。

但是仍然难以优化时间复杂度。有一些题解里说可以使用决策单调性优化到三次方 $\log$ ~~但是我已经把决策单调性忘干净了~~ 所以（查看了题解之后）考虑使用另一种方法优化。

**此时可以注意到在最坏情况下只需要走 $O(\frac{n^2}W)$ 的路程就可以取走所有的物品，因此 $d>O(\frac{n^2}W)$ 时直接输出 $\sum a_i$ 即可。**

而对于剩下的情况必然有 $d<O(\frac{n^2}W)$，此时再跑暴力 dp 时间复杂度就降到 $O(n^3)$ 的了，可以通过该题。这也太牛了！

Fun fact：【】在写这个题的时候严肃的在 chkmax 函数中取了 `min`，并浪费了 $10$ 分钟调试。

```cpp
namespace Loyalty
{
    int a[N];
    vector<vector<int>> f[2];
    inline void chkmax(int &x, int y) { if (x < y) x = y; }
    inline void init() { }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        int n, w, d;
        cin >> n >> w >> d;
        for (int i = 2; i <= n; ++i)
            cin >> a[i];
        int lim = 0;
        for (int i = n; i > 1; i -= w)
            lim += 2 * (i - 1);
        if (d >= lim)
            cout << accumulate(a + 1, a + n + 1, 0ll) << '\n';
        else
        {
            f[0].resize(w + 2), f[1].resize(w + 2);
            for (int i = 0; i < w + 2; ++i)
                f[0][i].resize(d + 2, -inf), f[1][i].resize(d + 2, -inf);
            f[~n & 1][w][0] = 0;
            for (int i = n; i > 1; --i)
            {
                for (int j = 0; j <= d; ++j)
                {
                    f[i & 1][1][j] = f[~i & 1][1][j];
                    if (j >= 2 * (i - 1))
                        chkmax(f[i & 1][1][j], f[~i & 1][w][j - 2 * (i - 1)] + a[i]);
                }
                for (int j = 2; j <= w; ++j)
                    for (int k = 0; k <= d; ++k)
                        f[i & 1][j][k] = max(f[~i & 1][j][k], f[~i & 1][j - 1][k] + a[i]);
            }
            int res = 0;
            for (int i = 1; i <= w; ++i)
                for (int j = 0; j <= d; ++j)
                    chkmax(res, f[0][i][j]);
            cout << res << '\n';
        }
    }
}
```

## 做题笔记补充

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/obgeyrgs)。

先观察题目的性质，可以发现：

+ 拿到货物之后一定是将其直接运回到 $1$ 位置（可能会在别的地方再上货物，但是不会把已经上过的货物再拿下来）

继续观察还可以发现：除了走的距离最近的那一次以外，其余每一次拿货物都把车厢拉满一定是最优的。

于是可以考虑 dp。设 $f_{i,j,k}$ 表示当前考虑了 $i\sim n$ 这个后缀内的物品，一共拿了 $j$ 个（在模 $W$ 意义下，特殊的把 $0$ 看做是 $W$），走了 $k$ 的路程，可得到的最大价值是多少。此时转移方程形如：

+ $f_{i,j,k}\leftarrow \max(f_{i+1,j,k},f_{i+1,j-1,k}+a_i)$

特殊的，需要特判掉拿了恰好 $1$ 个物品时的情况：

+ $f_{i,1,k}\leftarrow \max(f_{i+1,1,k},f_{i+1,w,k-2(i-1)}+a_i)$

直接做时空复杂度都是 $O(n^4)$ 的（注意总距离是 $O(n^2)$ 级别的）。空间是容易优化的，注意到 $f_i$ 的信息只会从 $f_{i+1}$ 递推过来所以可以把 $i$ 这个维度滚动掉。

但是仍然难以优化时间复杂度。有一些题解里说可以使用决策单调性优化到三次方 $\log$ ~~但是我已经把决策单调性忘干净了~~ 所以（查看了题解之后）考虑使用另一种方法优化。

**此时可以注意到在最坏情况下只需要走 $O(\frac{n^2}W)$ 的路程就可以取走所有的物品，因此 $d>O(\frac{n^2}W)$ 时直接输出 $\sum a_i$ 即可。**

而对于剩下的情况必然有 $d<O(\frac{n^2}W)$，此时再跑暴力 dp 时间复杂度就降到 $O(n^3)$ 的了，可以通过该题。这也太牛了！

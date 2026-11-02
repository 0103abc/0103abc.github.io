---
title: "CF51E Pentagon 题解"
date: "2025-02-15T13:20:12.000Z"
link: "luogu-4eagtf1p"
categories: ["题解"]
tags: ["Codeforces", "图论", "最短路", "动态规划", "数学", "组合数学"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/4eagtf1p)。

考虑类似于 Floyd 的 dp 设计：设 $f_{o,i,j}$ 表示从 $i$ 到 $j$ 走了 $o$ 条边的不同方案数，那么显然有初始条件：对于每一条边 $u\leftrightarrow v$，都有 $f_{1,u,v}=f_{1,v,u}=1$。转移的话枚举中转点 $k$ 然后用 $f_{o,i,k}\times f_{1,k,j}$ 来转移 $f_{o+1,i,j}$ 即可。因为是五元环而且有正反两种绕法，所以每一个环都被计算了 $10$ 次，答案需要除以 $10$。

但是这样是错的，可以出现三元环套二元环的情况。此时直接暴力枚举一个三元环 $(i,j,k)$，每一个点 $i$ 都有 $\deg(i)$ 种往外伸展出二元环的方案数，因此该情况需要容斥减去 $\deg(i)+\deg(j)+\deg(k)-3$，其中 $\deg(i)$ 表示无向图中 $i$ 点的度数。时间复杂度为 $O(\omega n^3)$，其中 $\omega$ 是要找的环的长度，本题中取 $5$，可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 710;
int f[6][N][N], deg[N];
inline void add(int &x, int v) {
    x += v;
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; ++i) {
        int x, y;
        cin >> x >> y;
        ++deg[x], ++deg[y];
        f[1][x][y] = f[1][y][x] = 1;
    }
    for (int _ = 1; _ < 5; ++_)
        for (int k = 1; k <= n; ++k)
            for (int i = 1; i <= n; ++i)
                for (int j = 1; j <= n; ++j)
                    add(f[_+1][i][j], f[_][i][k]*f[1][k][j]);
    int s = 0;
    for (int i = 1; i <= n; ++i) add(s, f[5][i][i]);
    s /= 10;
    for (int i = 1; i <= n; ++i)
        for (int j = i + 1; j <= n; ++j)
            if (f[1][i][j])
                for (int k = j + 1; k <= n; ++k)
                    if (f[1][i][k] && f[1][j][k])
                        s -= deg[i] + deg[j] + deg[k] - 3;
    // for (int i = 1; i <= n; ++i) add(s, -f[2][i][i]*f[3][i][i]/12);
    cout << s << '\n';
    return 0;
}
```

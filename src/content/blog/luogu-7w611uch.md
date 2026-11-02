---
title: "CF147B Smile House 题解"
date: "2024-12-22T09:01:46.000Z"
link: "luogu-7w611uch"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "算法思想", "倍增"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/7w611uch)。

暴力可过，所以不写郑洁了！！111

考虑一个经典 dp。设 $f_{k,i,j}$ 表示从 $i$ 走到 $j$，且走了 $k$ 步，经过的路径的最大权值的和是多少。显然初始条件：对于每一条边 $u\to v$，且其边权为 $w$，都有 $f_{1,u,v}=w$。转移是简单的：枚举中转点 $x$，则 $f_{k,i,j}\leftarrow f_{k-1,i,x}+f_{1,x,y}$，可以做到 $O(n^4)$，氰微卡常可过。

考虑优化。中间这个中转点看着就很能优化，显然可以倍增一下做到 $O(n^3\log n)$，但是不想写了。

```cpp
#pragma GCC optimize(3)
#pragma GCC optimize("Ofast")
#pragma GCC optimize("inline")
#include <bits/stdc++.h>
// #define int long long
#define eb emplace_back
using namespace std;
const int N = 510;
const int mod = 998244353;
int f[310][310][310], mp[310][310];
void chkmax(int &x, int y) {
    if (x < y) x = y;
}
signed main() {
    int n, m;
    cin >> n >> m;
    memset(f, -0x3f, sizeof f);
    memset(mp, -0x3f, sizeof mp);
    for (int i = 0; i < m; ++i) {
        int x, y, z, w;
        cin >> x >> y >> z >> w;
        f[1][x][y] = z;
        f[1][y][x] = w;
        mp[x][y] = z;
        mp[y][x] = w;
    }
    for (int _ = 2; _ <= n; ++_)
        for (int k = 1; k <= n; ++k)
            for (int i = 1; i <= n; ++i) {
                for (int j = 1; j <= n; ++j)
                    chkmax(f[_][i][j], f[_ - 1][i][k] + mp[k][j]);
                if (f[_][i][i] > 0) {
                    cout << _ << '\n';
                    return 0;
                }
            }
    cout << "0\n";
    return 0;
}
```

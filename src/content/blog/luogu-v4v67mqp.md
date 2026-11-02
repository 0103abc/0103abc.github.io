---
title: "P12293 [蓝桥杯 2024 国 Java A] 合并小球 题解"
date: "2026-05-07T03:18:21.000Z"
link: "luogu-v4v67mqp"
categories: ["题解"]
tags: ["洛谷", "数学", "概率与期望", "动态规划", "组合数学"]
draft: false
---

根据期望的线性性考虑拆贡献算答案，容易发现可以合成一段球的部分一定是一个连续的区间，因此考虑记 $f_{i,j}$ 表示 $[i,j]$ **编号**内的小球恰好合并成一个球的概率，则最终答案就是 $\sum\limits_{i=1}^n\sum\limits_{j=i}^nf_{i,j}\prod\limits_{k=i}^jy_k$。

直接转移困难，考虑先设 $g_{i,j}$ 表示 $i$ 和 $j$ **位置**合并成一个球的概率（注意这里没有保证球只由编号为 $i,i+1,\ldots,j$ 的球组成）转移考虑只分析两端 $i,j$ 两个球，显然有 $i=j$ 时 $g_{i,j}=1$。而若 $i<j$，则经过单位时间后每个球都有 $\frac12$ 的独立概率向右移动，dp 转移式可以写作 $g_{i,j}=\frac{g_{i,j}+g_{i+1,j}+g_{i,j+1}+g_{i+1,j+1}}4$，因为转移带环所以需要移项得到 $g_{i,j}=\frac{g_{i+1,j}+g_{i,j+1}+g_{i+1,j+1}}3$。

然后考虑通过 $g$ 求 $f$，显然也有 $f_{i,i}=1$。而对于 $i<j$，直接记 $f_{i,j}=g_{x_i,x_j}$ 显然会算多，需要容斥掉算多的部分，容易发现 $f_{i,j}\leftarrow f_{i,j}-f_{i-1,j}-f_{i,j+1}+f_{i-1,j+1}$ 就可以得到正确的概率。维护 $y$ 数组所有区间内元素乘积即可做到 $O(n^2)$ 时间复杂度计算答案。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;
bool beginmem;
constexpr int N = 5000010;
constexpr int mod = 998244353;
constexpr int inf = 1e18;
using ld = long double;
using ull = unsigned long long;
using i128 = __int128;

inline int power(int a, int b, int c) {
    int ans = 1;
    while (b) {
        if (b & 1) ans = ans * a % c;
        a = a * a % c, b >>= 1;
    } return ans;
}

inline int inversion(int x) { return power(x, mod - 2, mod); }

int x[N], y[N], prod[510][510], f[510][510], g[510][510];
inline void init() {
}

inline void sol() {
    int n, T; cin >> n >> T;
    for (int i = 1; i <= n; ++i) cin >> x[i] >> y[i], y[i] %= mod;
    for (int i = 1; i <= n; ++i) {
        prod[i][i] = y[i];
        for (int j = i + 1; j <= n; ++j)
            prod[i][j] = prod[i][j - 1] * y[j] % mod;
    }
    const int i3 = inversion(3);
    for (int i = 1; i <= T; ++i) f[i][i] = 1;
    for (int i = T - 1; i; --i)
        for (int j = T - 1; j > i; --j) f[i][j] = (f[i + 1][j] + f[i][j + 1] + f[i + 1][j + 1]) * i3 % mod;
    int res = 0;
    for (int i = 1; i <= n; ++i)
        for (int j = i; j <= n; ++j) res = (res + prod[i][j] * (f[x[i]][x[j]] - f[x[i - 1]][x[j]] - f[x[i]][x[j + 1]] + f[x[i - 1]][x[j + 1]] + mod * 2) % mod) % mod;
    cout << res << '\n';
}
bool endmem;

signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int T = 1;
    // cin >> T;
    init();
    while (T--) sol();
    return 0;
}
```

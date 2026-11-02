---
title: "CF908G New Year and Original Order 题解"
date: "2025-02-13T14:07:03.000Z"
link: "luogu-12rxxr87"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/12rxxr87)。

补的 NOIP 集训的题。这种题肯定就只能数位 dp。对于一个数字 $S$，将其所有数位从小到大排序之后 $0$ 会全部变为前导零并消失，还剩下 $1\sim 9$ 这 $9$ 个数字。

可以发现这些数字之间对答案的贡献是互相独立的，因此可以对这 $9$ 个数字中每一个数字分别计算她们单独贡献。那么考虑设一个简单的 dp：设 $f_i$ 表示前 $i$ 位对当前枚举数位的值 $x$ 对答案的贡献。那么考虑分三类讨论：

+ 若当前枚举填写的位置的值 $<x$，那么对当前数的所有 $x$ 没有产生贡献。即 $f_i\leftarrow f_{i-1}$。
+ 若当前枚举填写的位置的值 $>x$，那么就会把所有值为 $x$ 的位整体左移一位，答案 $\times 10$。即 $f_i\leftarrow 10f_{i-1}$。
+ 若当前枚举填写的位置的值 $=x$，那么之前所有填写的值为 $x$ 的位整体左移，对答案的贡献 $\times 10$。然后还需要计算当前数的贡献。考虑用另一个 dp 来优化当前 dp 的转移：设 $g_i$ 表示前 $i$ 个位若在最后一位加入当前填写的字符 $x$，那么当前位会额外给答案贡献多少。此时可以继续分类讨论：
  + 若当前枚举填的数字 $\le x$，那么不会给之前所有填写的 $x$ 添加新的贡献，即 $g_i\leftarrow g_{i-1}$。
  + 若当前枚举填的数字 $>x$。那么会让之前所有填写的 $x$ 整体左移一位，即 $g_i\leftarrow 10g_{i-1}$。
+ 因此该部分整体的 dp 转移式为：$f_\leftarrow 10f_{i-1}+g_{i-1}$。

因为这是数位 dp 所以还需要额外设一个 $j$ 维度表示当前的数值是否顶了上界，转移的时候就随便带着转移即可。因此本题做完了，时间复杂度为 $O(|n|\omega^2)$，其中 $|n|$ 为 $n$ 在 $10$ 进制下的位数，$\omega$ 为字符集大小，本题中取 $9$。

代码，这是某人少有的清纯少女 style 代码。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 710;
const int mod = 1e9 + 7;
int f[N][2], g[N][2];
char s[N];
inline void add(int &x, int y) {
    x = (x + y) % mod;
}
signed main() {
    // cin.tie(0)->sync_with_stdio(false);
    scanf("%s", s + 1);
    int n = strlen(s + 1), sum = 0;
    for (int x = 1; x < 10; ++x) {
        memset(f, 0, sizeof f);
        memset(g, 0, sizeof g);
        f[0][1] = 0, g[0][1] = x;
        for (int i = 0; i < n; ++i)
            for (int o = 0; o < 2; ++o) {
                int liim = o ? (s[i + 1] & 15) : 9;
                for (int j = 0; j <= liim; ++j) {
                    int lim = o && j == (s[i + 1] & 15);
                    if (j < x) add(f[i + 1][lim], f[i][o]);
                    else if (j > x) add(f[i + 1][lim], f[i][o] * 10 % mod);
                    else add(f[i + 1][lim], (f[i][o] * 10 % mod + g[i][o]) % mod);
                    if (j <= x) add(g[i + 1][lim], g[i][o]);
                    else add(g[i + 1][lim], g[i][o] * 10 % mod);
                }
            }
        add(sum, (f[n][0] + f[n][1]) % mod);
    }
    cout << sum << '\n';
    return 0;
}
```

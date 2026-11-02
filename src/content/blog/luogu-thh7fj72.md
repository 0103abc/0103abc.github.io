---
title: "CF1731E Graph Cost 题解"
date: "2024-10-21T11:14:25.000Z"
link: "luogu-thh7fj72"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "数学", "数论", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/thh7fj72)。

~~呃呃呃，大水题~~

首先有一个简单的贪心策略：先加边权大的边，然后再加边权小的边。容易证明她是正确的。

然后问题变为对于每一个 $k\in[1,n]\cap\mathbb{N_+}$ 计算有多少个整数对 $(i,j)$ 满足 $1\le i<j\le n$ 且 $\gcd(i,j)=k$ 了。考虑 dp。设 $f_i$ 表示 $k=i$ 时上式的答案，则显然有 $f_i=\lfloor\frac{n}{i}\rfloor^2$。但是这显然是错的，因为 $2i$ 有可能被错误的统计在 $i$ 内。考虑容斥。将所有 $i$ 的倍数且不为 $i$ 的数的贡献在 $f_i$ 中减去。因此有：

$$f_i=\lfloor\frac{n}{i}\rfloor^2-\sum\limits_{k=2}^{+\infin}f_{ki}$$

直接暴力计算 $f$ 的值是调和级数的，因此这样就能在单组数据 $O(n\log n)$ 的时间复杂度内通过该题目。

代码：

```cpp
#include <bits/stdc++.h>
#define eb emplace_back
#define int long long
using namespace std;
const int N = 1000100;
int f[N];
signed main() {
    int T;
    cin >> T;
    while (T--) {
        int n, m;
        cin >> n >> m;
        for (int i = n; i; --i) {
            f[i] = (n / i) * (n / i);
            for (int j = 2; j * i <= n; ++j) {
                f[i] -= f[j * i];
            }
        }
        int sum = 0, cnt = 0;
        for (int i = n; i > 1; --i) {
            int k = min(m, f[i] / 2) / (i - 1) * (i - 1);
            m -= k;
            sum += k / (i - 1) * i;
        }
        if (m) {
            sum = -1;
        }
        cout << sum << '\n';
    }
    return 0;
}

```

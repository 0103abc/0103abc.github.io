---
title: "P11854 [CSP-J 2022 山东] 宴会 题解"
date: "2025-03-05T14:14:04.000Z"
link: "luogu-8d3bl5e1"
categories: ["题解"]
tags: ["洛谷", "基础算法", "三分"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/8d3bl5e1)。

容易观察到若以聚会点 $x_0$ 为自变量，$x_0$ 所对应的所需时间 $y_0$ 为因变量，则该函数为没有连续相同值的单峰函数。因此考虑对答案三分，对于每一个三分到的值直接暴力 $O(n)$ 求解所需花费的时间即可。时间复杂度为 $O(n\log n)$ 可以通过。

```cpp
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
const int mod = 998244353;
int x[N], t[N];
signed main() {
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i) cin >> x[i];
        for (int i = 1; i <= n; ++i) cin >> t[i];
        double l = 0, r = 1e9;
        for (int i = 0; i < 400; ++i) {
            double m1 = l + (r - l) / 3, m2 = r - (r - l) / 3;
            double c1 = 0, c2 = 0;
            for (int j = 1; j <= n; ++j) c1 = max(c1, abs(m1 - x[j]) + t[j]);
            for (int j = 1; j <= n; ++j) c2 = max(c2, abs(m2 - x[j]) + t[j]);
            if (c1 > c2) l = m1; else r = m2;
        }
        if (abs(l - round(l)) < 1e-9) cout << fixed << setprecision(0) << l << '\n';
        else cout << fixed << setprecision(1) << l << '\n';
    }
    return 0;
}
```

---
title: "CF1270E Divide Points 题解"
date: "2025-02-24T05:38:45.000Z"
link: "luogu-xcd9eban"
categories: ["题解"]
tags: ["Codeforces", "数学", "概率与期望"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/xcd9eban)。

首先有一个很简单的做法就是对所有坐标点做奇偶染色，然后奇数点放在 $A$ 集合偶数点放在 $B$ 集合。但是若 $A,B$ 集合中存在一个空集合就爆了。

然后可以考虑到调整坐标，若存在空集合就把所有点的横纵坐标都除以 $2$ 然后再来跑上面的算法，直到跑出来解为止。但是可以被样例 $2$ 给 hack。

于是考虑到一个比较巧妙的手法：考虑把 $(x,y)$ 坐标映射到 $(\frac{x+y}2,\frac{x-y}2)$ 坐标，然后跑上面的算法直到跑出解为止。可以证明到坐标原点的距离每一次除以 $2$，期望最多除 $\log$ 次。因此时间复杂度为 $O(n\log n)$ 可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 500010;
int x[N], y[N];
signed main() {
    cout << fixed << setprecision(15);
    cin.tie(0)->sync_with_stdio(false);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> x[i] >> y[i];
    }
    while (1) {
        int c1 = 0, c2 = 0;
        for (int i = 1; i <= n; ++i)
            if ((x[i] + y[i]) & 1) ++c1;
            else ++c2;
        if (c1 && c2) {
            vector<int> v;
            for (int i = 1; i <= n; ++i)
                if ((x[i] + y[i]) & 1) v.emplace_back(i);
            cout << v.size() << '\n';
            for (int &i : v) cout << i << ' ';
            cout << '\n';
            return 0;
        } else {
            for (int i = 1; i <= n; ++i) {
                if (c1) ++x[i];
            }
            for (int i = 1; i <= n; ++i) {
                int _x = x[i], _y = y[i];
                x[i] = (_x+_y) / 2, y[i] = (_x-_y) / 2;
            }
        }
    }
    return 0;
}
```

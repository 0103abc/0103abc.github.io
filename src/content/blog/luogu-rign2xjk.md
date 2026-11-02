---
title: "CF793C Mice problem 题解"
date: "2025-02-15T01:02:37.000Z"
link: "luogu-rign2xjk"
categories: ["题解"]
tags: ["Codeforces", "数学", "计算几何"]
draft: false
---

比较简单的 $2300$。考虑把横纵坐标拆分考虑然后分别计算出横纵坐标在矩形内的时间区间 $[tl,tr]$，将全部这些区间取交集即可。时间复杂度为 $O(n)$。

特殊的，需要判断速度为 $0$ 的情况，**以及注意点在矩形边界上不算做矩形内。**

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 500010;
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int T;
    cin >> T;
    int x1, y1, x2, y2;
    cin >> x1 >> y1 >> x2 >> y2;
    vector<tuple<int, int, int>> v;
    while (T--) {
        int x_1, y_1, x_2, y_2;
        cin >> x_1 >> x_2 >> y_1 >> y_2;
        if (y_1) {
            v.emplace_back(x_1, y_1, 1);
        } else {
            if (x1 < x_1 && x_1 < x2) ;
            else {
                cout << "-1\n";
                return 0;
            }
        }
        if (y_2) {
            v.emplace_back(x_2, y_2, 0);
        } else {
            if (y1 < x_2 && x_2 < y2) ;
            else {
                cout << "-1\n";
                return 0;
            }
        }
    }
    double L = 0, R = 1e18;
    for (auto &[x, y, o] : v) {
        if (o) {
            double v1 = 1. * (x1 - x) / y;
            double v2 = 1. * (x2 - x) / y;
            if (v1 > v2) swap(v1, v2);
            L = max(L, v1), R = min(R, v2);
        } else {
            double v1 = 1. * (y1 - x) / y;
            double v2 = 1. * (y2 - x) / y;
            if (v1 > v2) swap(v1, v2);
            L = max(L, v1), R = min(R, v2);
        }
    }
    if (L < R) cout << L << '\n';
    else cout << -1 << '\n';
    return 0;
}


```

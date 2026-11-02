---
title: "CF804E The same permutation  题解"
date: "2025-03-02T15:49:35.000Z"
link: "luogu-b0zoun2h"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/b0zoun2h)。

首先有经典结论：对于一个长度为 $n$ 的数组 $a$，若交换其 $i,j$ 位置的元素的值（$i\neq j$），则其逆序对数必然发生改变。

因此可以证明若 $n\equiv 2,3\pmod 4$，则必然无解。否则可以构造答案使得其存在合法解；

若 $n\equiv 0\pmod 4$，则考虑将其相邻四个元素分为一组，每一组内先单独进行交换操作，然后再将每一个大组之间进行交换操作。容易证明这样必然涵盖了所有的交换操作。具体的构造方案可以写一个暴搜直接找出来。

若 $n\equiv 1\pmod 4$，则也用类似的方法，但是这样多一个 $n$ 无法处理。因此考虑在分组的过程中先将 $n$ 排除在外，然后在小组交换的过程中顺带把 $n$ 也交换掉。同样也可以暴搜打表找出合法解。

于是本题做完了，时间复杂度为 $O(n^2)$ 可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 200010;
void solve() {
    int n;
    cin >> n;
    if (n % 4 > 1) cout << "NO\n";
    else if (n % 4 == 0) {
        cout << "YES\n";
        for (int i = 0; i < n / 4; ++i) {
            cout << i * 4 + 1 << ' ' << i * 4 + 2 << '\n';
            cout << i * 4 + 1 << ' ' << i * 4 + 3 << '\n';
            cout << i * 4 + 2 << ' ' << i * 4 + 4 << '\n';
            cout << i * 4 + 1 << ' ' << i * 4 + 4 << '\n';
            cout << i * 4 + 2 << ' ' << i * 4 + 3 << '\n';
            cout << i * 4 + 3 << ' ' << i * 4 + 4 << '\n';
        }
        for (int i = 0; i < n / 4; ++i)
            for (int j = i + 1; j < n / 4; ++j) {
                cout << i * 4 + 1 << ' ' << j * 4 + 1 << "\n";
                cout << i * 4 + 1 << ' ' << j * 4 + 2 << "\n";
                cout << i * 4 + 1 << ' ' << j * 4 + 3 << "\n";
                cout << i * 4 + 2 << ' ' << j * 4 + 1 << "\n";
                cout << i * 4 + 2 << ' ' << j * 4 + 4 << "\n";
                cout << i * 4 + 1 << ' ' << j * 4 + 4 << "\n";
                cout << i * 4 + 2 << ' ' << j * 4 + 3 << "\n";
                cout << i * 4 + 3 << ' ' << j * 4 + 1 << "\n";
                cout << i * 4 + 4 << ' ' << j * 4 + 2 << "\n";
                cout << i * 4 + 3 << ' ' << j * 4 + 2 << "\n";
                cout << i * 4 + 2 << ' ' << j * 4 + 2 << "\n";
                cout << i * 4 + 3 << ' ' << j * 4 + 3 << "\n";
                cout << i * 4 + 4 << ' ' << j * 4 + 1 << "\n";
                cout << i * 4 + 4 << ' ' << j * 4 + 4 << "\n";
                cout << i * 4 + 3 << ' ' << j * 4 + 4 << "\n";
                cout << i * 4 + 4 << ' ' << j * 4 + 3 << "\n";
            }
    } else {
        cout << "YES\n";
        for (int i = 0; i < n / 4; ++i) {
            cout << i * 4 + 1 << ' ' << i * 4 + 2 << '\n';
            cout << i * 4 + 1 << ' ' << i * 4 + 3 << '\n';
            cout << i * 4 + 1 << ' ' << i * 4 + 4 << '\n';
            cout << i * 4 + 2 << ' ' << i * 4 + 3 << '\n';
            cout << i * 4 + 2 << ' ' << n << '\n';
            cout << i * 4 + 3 << ' ' << n << '\n';
            cout << i * 4 + 1 << ' ' << n << '\n';
            cout << i * 4 + 3 << ' ' << i * 4 + 4 << '\n';
            cout << i * 4 + 2 << ' ' << i * 4 + 4 << '\n';
            cout << i * 4 + 4 << ' ' << n << '\n';
        }
        for (int i = 0; i < n / 4; ++i)
            for (int j = i + 1; j < n / 4; ++j) {
                cout << i * 4 + 1 << ' ' << j * 4 + 1 << "\n";
                cout << i * 4 + 1 << ' ' << j * 4 + 2 << "\n";
                cout << i * 4 + 1 << ' ' << j * 4 + 3 << "\n";
                cout << i * 4 + 2 << ' ' << j * 4 + 1 << "\n";
                cout << i * 4 + 2 << ' ' << j * 4 + 4 << "\n";
                cout << i * 4 + 1 << ' ' << j * 4 + 4 << "\n";
                cout << i * 4 + 2 << ' ' << j * 4 + 3 << "\n";
                cout << i * 4 + 3 << ' ' << j * 4 + 1 << "\n";
                cout << i * 4 + 4 << ' ' << j * 4 + 2 << "\n";
                cout << i * 4 + 3 << ' ' << j * 4 + 2 << "\n";
                cout << i * 4 + 2 << ' ' << j * 4 + 2 << "\n";
                cout << i * 4 + 3 << ' ' << j * 4 + 3 << "\n";
                cout << i * 4 + 4 << ' ' << j * 4 + 1 << "\n";
                cout << i * 4 + 4 << ' ' << j * 4 + 4 << "\n";
                cout << i * 4 + 3 << ' ' << j * 4 + 4 << "\n";
                cout << i * 4 + 4 << ' ' << j * 4 + 3 << "\n";
            }
    }
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int T;
    // cin >> T;
    T = 1;
    while (T--) { 
        solve();
    }
    return 0;
}
```

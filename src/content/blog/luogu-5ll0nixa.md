---
title: "CF364C Beautiful Set 题解"
date: "2025-02-14T04:38:05.000Z"
link: "luogu-5ll0nixa"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造", "数学", "数论", "基础算法", "排序"]
draft: false
---

真不会做啊呜呜呜呜呜呜呜呜呜

考虑一个简单的构造：给出一个质因子集合 $S$，然后用 $S$ 内的质因数组合出前 $k$ 小的数。但是这样很明显不能保证正确性，于是考虑调整答案：

将集合 $S$ 内所有元素从大到小排序，依次对于每一个质因子 $x$：若 $x$ 在序列中出现的次数不足 $\frac k2$，那么从小到大，给所有不是 $x$ 倍数的数乘以 $x$ 使得其变为 $x$ 的倍数，并保持其余所有数出现次数不变，而 $x$ 的倍数出现次数自增 $1$。因此这个东西只会让每一个质因子出现的次数变多而不会变少，而且不会出现新的质因子，因此可以证明其正确性。

事实证明取 $S=\lbrace2,3,5,7,11\rbrace$ 即可在题目给定条件下通过该题目。因为 $k$ 太小所以直接随便暴力枚举就可以通过该题。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 200010;
int a[510][510];

signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int k;
    cin >> k;
    set<int> se, se2;
    int c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0;
    for (int i = 2; i <= 2 * k * k; ++i) {
        int j = i;
        while (j % 2 == 0) j /= 2;
        while (j % 3 == 0) j /= 3;
        while (j % 5 == 0) j /= 5;
        while (j % 7 == 0) j /= 7;
        while (j % 11 == 0) j /= 11;
        if (j == 1) {
            se.emplace(i);
            if (i % 2 == 0) ++c1;
            if (i % 3 == 0) ++c2;
            if (i % 5 == 0) ++c3;
            if (i % 7 == 0) ++c4;
            if (i % 11 == 0) ++c5;
            if (se.size() >= k) break;
        }
    }
    se2.clear();
    for (const int &i : se)
        if (i % 11 != 0) se2.emplace(i);
    while (c5 * 2 < k) {
        auto it = se2.begin();
        int val = *it;
        se2.erase(it);
        if (se.find(val * 11) == se.end() && val * 11 <= 2 * k * k) {
            se.erase(se.find(val));
            se.emplace(val * 11);
            ++c5;
        }
    }
    se2.clear();
    for (const int &i : se)
        if (i % 7 != 0) se2.emplace(i);
    while (c4 * 2 < k) {
        auto it = se2.begin();
        int val = *it;
        se2.erase(it);
        if (se.find(val * 7) == se.end() && val * 7 <= 2 * k * k) {
            se.erase(se.find(val));
            se.emplace(val * 7);
            ++c4;
        }
    }
    se2.clear();
    for (const int &i : se)
        if (i % 5 != 0) se2.emplace(i);
    while (c3 * 2 < k) {
        auto it = se2.begin();
        int val = *it;
        se2.erase(it);
        if (se.find(val * 5) == se.end() && val * 5 <= 2 * k * k) {
            se.erase(se.find(val));
            se.emplace(val * 5);
            ++c3;
        }
    }
    se2.clear();
    for (const int &i : se)
        if (i % 3 != 0) se2.emplace(i);
    while (c2 * 2 < k) {
        auto it = se2.begin();
        int val = *it;
        se2.erase(it);
        if (se.find(val * 3) == se.end() && val * 3 <= 2 * k * k) {
            se.erase(se.find(val));
            se.emplace(val * 3);
            ++c2;
        }
    }
    se2.clear();
    for (const int &i : se)
        if (i % 2 != 0) se2.emplace(i);
    while (c1 * 2 < k) {
        auto it = se2.begin();
        int val = *it;
        se2.erase(it);
        if (se.find(val * 2) == se.end() && val * 2 <= 2 * k * k) {
            se.erase(se.find(val));
            se.emplace(val * 2);
            ++c1;
        }
    }
    for (const int &i : se) cout << i << ' ';
    cout << '\n';
    return 0;
}

```

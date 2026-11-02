---
title: "CF1804D Accommodation 题解"
date: "2024-10-22T12:04:05.000Z"
link: "luogu-n7wbjjde"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/n7wbjjde)。

又是大水题。

考虑连续两个元素对答案的贡献。

+ $(0,0)$：一居室和二居室对答案的贡献均为 $0$。（$1$）
+ $(0,1)$：一居室和二居室对答案的贡献均为 $1$。（$2$）
+ $(1,0)$：一居室和二居室对答案的贡献均为 $1$。（$3$）
+ $(1,1)$：一居室对答案的贡献为 $2$，二居室对答案的贡献为 $1$。（$4$）

因此可以发现只有（$4$）时一居室和二居室答案不一样，因此考虑简单贪心。最小值就尽可能让 $(1,1)$ 用二居室，最大值就尽可能让 $(1,1)$ 用一居室。时间复杂度为 $O(nm)$。

代码十分好写。

```cpp
#pragma GCC optimize(3)
#include <bits/stdc++.h>
#define eb emplace_back
#define int long long
using namespace std;
const int N = 200100;
int f[N][22][2], a[N];
signed main() {
    int n, m;
    cin >> n >> m;
    int c1 = 0, c2 = 0;
    for (int i = 1; i <= n; ++i) {
        string s;
        cin >> s;
        s = ' ' + s;
        int ff = 0;
        for (int j = 1; j <= m; ++j) {
            if (s[j] == '1') {
                ++ff;
            }
        }
        int gg = 0;
        for (int j = 1; j < m; ++j) {
            if (s[j] == '1' && s[j + 1] == '1') {
                ++j, ++gg;
            }
        }
        int hh = 0;
        for (int j = 1; j < m; ++j) {
            if (!(s[j] == '1' && s[j + 1] == '1')) {
                ++j, ++hh;
            }
        }
        c1 += ff - max(0ll, m / 4 - hh);
        c2 += ff - min(m / 4, gg);
    }
    cout << c2 << ' ' << c1 << '\n';
    return 0;
}

/*



*/
```

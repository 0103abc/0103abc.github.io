---
title: "CF1137B Camp Schedule 题解"
date: "2025-02-24T06:05:47.000Z"
link: "luogu-fgec09k7"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "二分"]
draft: false
---

笑点解析：不会 KMP

考虑一个简单的贪心：新建的串中能多放一个串 $t$ 就是一个串 $t$。于是可以得到 $O(n)$ 的解法，然后很高兴的获得 wa。

考虑做法为什么错了。发现每一次往新建串中放 $t$ 时，都可以去利用前面放过的 $t$。发现可以利用的长度就是 $t$ 中最大的 $l$ 满足 $l<|t|$ 且 $t_{[1:l]}=t_{[|t|-l+1:|t|]}$。发现这就是 kmp 算法中 border 的定义，直接跑 kmp 或者用哈希二分均可。这里采用了 kmp 的做法（更好写）。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 500010;
char s[N], t[N];
int border[N];
signed main() {
    cout << fixed << setprecision(15);
    // cin.tie(0)->sync_with_stdio(false);
    scanf("%s%s", s + 1, t + 1);
    int n = strlen(s + 1), m = strlen(t + 1);
    for (int i = 2, j = 0; i <= m; ++i) {
        while (j && t[i] != t[j + 1]) j = border[j];
        if (t[i] == t[j + 1]) ++j;
        border[i] = j;
    }
    int c1 = 0, c2 = 0, c3 = 0, c4 = 0;
    for (int i = 1; i <= n; ++i)
        if (s[i] == '1') ++c1;
        else ++c2;
    for (int i = 1; i <= m; ++i)
        if (t[i] == '1') ++c3;
        else ++c4;
    if (c1 < c3 || c2 < c4) {
        puts(s + 1);
    } else {
        int c5 = 0, c6 = 0;
        int len = border[m];
        for (int i = len + 1; i <= m; ++i)
            if (t[i] == '1') ++c5;
            else ++c6;
        c1 -= c3, c2 -= c4;
        int cnt = 0;
        while (c1 >= c5 && c2 >= c6) {
            c1 -= c5, c2 -= c6;
            ++cnt;
        }
        for (int i = 1; i <= m; ++i) cout << t[i];
        for (int j = 1; j <= cnt; ++j)
            for (int i = len + 1; i <= m; ++i)
                cout << t[i];
        for (int i = 0; i < c1; ++i) cout << 1;
        for (int i = 0; i < c2; ++i) cout << 0;
        cout << '\n';
    }
    return 0;
}
```

---
title: "CF898F Restoring the Expression 题解"
date: "2025-02-14T00:48:02.000Z"
link: "luogu-fcp4in19"
categories: ["题解"]
tags: ["Codeforces", "字符串", "字符串哈希"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/fcp4in19)。

简单题。不知道为什么有 $2300$。

考虑判断等式 $a+b=c$ 是否成立。直接做需要 $O(n)$ 的高精度计算，考虑优化。根据模运算的基本性质，可以知道，对于任意一个正整数 $p$，若 $a+b=c$ 成立，则 $(a\bmod p+b\bmod p)\bmod p=c\bmod p$ 也必然成立。因此考虑选取大模数 $p$，然后类似于哈希的方法计算一个前缀 $\bmod\ p$ 的值，从而 $O(1)$ 直接计算出某一个区间 $\bmod\ p$ 的值。此时枚举加号和等号的位置可以做到 $O(n^2)$。

考虑继续优化。容易发现加号和等号的合法组合只有 $O(n)$ 级别（位数原因），因此只枚举位数意义下可能成立的符号组合即可。时间复杂度降低到 $O(n)$，可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int base = 10, mod = 123456791;
const int N = 1000100;
char s[N];
int bit[N], h[N], n;
inline int get(int x, int y) {
    return (h[y] - h[x - 1] * bit[y - x + 1] % mod + mod) % mod;
}
int ok(int l, int r) {
    if (l > 1) {
        int x = get(1, l - 1), y = get(l, r - 1), z = get(r, n);
        if ((x + y) % mod != z) return 0;
        if (1 != l - 1 && s[1] == '0') return 0;
        if (l != r - 1 && s[l] == '0') return 0;
        if (r != n && s[r] == '0') return 0;
        for (int i = 1; i < l; ++i) cout << s[i];
        cout << "+";
        for (int i = l; i < r; ++i) cout << s[i];
        cout << "=";
        for (int i = r; i <= n; ++i) cout << s[i];
        cout << '\n';
        exit(0);
        return 1;
    } return 0;
}
signed main() {
    // cin.tie(0)->sync_with_stdio(false);
    scanf("%s", s + 1);
    bit[0] = 1;
    for (int i = 1; i < N; ++i) {
        bit[i] = bit[i - 1] * base % mod;
        h[i] = h[i - 1] * base + s[i] - '0';
        h[i] %= mod;
    }
    n = strlen(s + 1);
    for (int i = n / 3; i <= n / 2; ++i) {
        ok(i + 1, n - i + 1);
        ok(i, n - i + 1);
        ok(n - i - i + 1, n - i + 1);
        ok(n - i - i + 2, n - i + 1);
    }
    cout << "-1\n";
    return 0;
}
```

---
title: "CF460D Little Victor and Set 题解"
date: "2025-02-13T10:06:06.000Z"
link: "luogu-v9plzxe1"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造", "基础算法", "贪心"]
draft: false
---

首先特判 $r-l+1\le 20$ 的情况，可以直接暴力枚举。

剩下的分类讨论：

+ $k\ge 4$，构造任意相邻四个元素即可，异或值为 $0$。
+ $k=1$，构造最小值 $l$ 即可。
+ $k=2$，构造 $2k,2k+1$ 相邻两个数即可，异或值为 $1$。
+ $k=3$。考虑到构造 $k=2$ 时异或值就可以为 $1$，所以只需要考虑是否可以构造出 $0$。那么可以发现构造 $2^{j+1}-1,2^i+2^j-1,2^i+2^j$ 一定是最优解。贪心的理性证明，若钦定 $i$ 位置前两个数选择了 $1$，$j$ 位置后两个串选择了 $1$，那么为了贪心的让极差最小，肯定后面部分让后面两个串一直都选 $1$，第一个串 $i$ 后面一直都选 $0$ 最优。枚举 $i,j$ 判断是否有合法解即可。时间复杂度为 $O(\log^2n)$ 可以随便通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 500100;
const int mod = 1e9 + 7;
int a[N], n, s;
int power(int a, int b, int c) {
    int ans = 1;
    while (b) {
        if (b & 1) ans = ans * a % c;
        a = a * a % c, b >>= 1;
    }
    return ans;
}
int inversion(int x, int mod) {
    return power(x, mod - 2, mod);
}
int binom(int a, int b) {
    if (a < b) return 0;
    int res = 1;
    a %= mod;
    for (int i = 1; i <= b; ++i) res = res * (a - i + 1) % mod;
    for (int i = 1; i <= b; ++i) res = res * inversion(i, mod) % mod;
    return res;
}
inline int op(int x) { return x * 2 - 1; }
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int l, r, k;
    cin >> l >> r >> k;
    int mi = 1e18;
    vector<int> res;
    if (r - l <= 20) {
        for (int i = 1; i < (1 << (r - l + 1)); ++i) {
            if (__builtin_popcount(i) > k) continue;
            int xr = 0;
            for (int j = 0; j < r - l + 1; ++j)
                if (i >> j & 1) xr ^= (j + l);
            if (xr < mi) {
                mi = xr;
                res.clear();
                for (int j = 0; j < r - l + 1; ++j)
                    if (i >> j & 1) res.emplace_back(j + l);
            }
        }
        cout << mi << '\n' << res.size() << '\n';
        for (int &i : res) cout << i << ' ';
        cout << '\n';
    } else if (k == 1) {
        cout << l << '\n' << 1 << '\n' << l << '\n';
    } else if (k == 2) {
        int id = -1, mi = 1e18;
        for (int i = l; i < r && i <= l + 100; ++i)
            if ((i ^ (i + 1)) < mi) mi = i ^ (i + 1), id = i;
        cout << mi << '\n' << 2 << '\n';
        cout << id << ' ' << id + 1 << '\n';
    } else if (k == 3) {
        for (int i = 60; i; --i)
            for (int j = i - 1; ~j; --j) {
                int x = (1ll << i) | (1ll << j), b = x ^ (x - 1), c = x - 1;
                if (x >= l && x <= r && b >= l && b <= r && c >= l && c <= r) {
                    cout << 0 << '\n' << 3 << '\n' << x << ' ' << b << ' ' << c << '\n';
                    return 0;
                }
            }
        int id = -1, mi = 1e18;
        for (int i = l; i < r && i <= l + 100; ++i)
            if ((i ^ (i + 1)) < mi) mi = i ^ (i + 1), id = i;
        cout << mi << '\n' << 2 << '\n';
        cout << id << ' ' << id + 1 << '\n';
    } else {
        int id = -1, mi = 1e18;
        for (int i = l; i + 2 < r && i <= l + 100; ++i)
            if ((i ^ (i + 1) ^ (i + 2) ^ (i + 3)) < mi) mi = i ^ (i + 1) ^ (i + 2) ^ (i + 3), id = i;
        cout << mi << '\n' << 4 << '\n';
        cout << id << ' ' << id + 1 << ' ' << id + 2 << ' ' << id + 3 << '\n';
    }
    return 0;
}

```

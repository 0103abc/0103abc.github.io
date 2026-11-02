---
title: "CF1834D Survey in Class 题解"
date: "2024-10-24T13:52:22.000Z"
link: "luogu-nytudzys"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心"]
draft: false
---

好题啊！

考虑一个经典套路。

> 若一个人不会，则她的分数 $-1$，否则她的分数 $+1$。

转化问题。

> 首先一个人的分数 $-1$，若她会，则她的分数 $+2$。

此时考虑两个人 $A$，$B$。对于问题 $i$：

+ $A$ 和 $B$ 都不会问题 $i$。则相对贡献为 $0$。
+ $A$ 和 $B$ 都会问题 $i$。则相对贡献为 $0$。
+ $A$ 会问题 $i$，$B$ 不会问题 $i$，则相对贡献为 $2$。
+ $B$ 会问题 $i$，$A$ 不会问题 $i$，则相对贡献为 $-2$。

因而若 $A$ 和 $B$ 两个人贡献了极差，且 $A$ 的分数不低于 $B$ 的分数，则令 $A$ 会的问题集合为 $S_a$，$B$ 会的问题集合为 $S_b$，则答案为 $2|S_a-(S_a\cap S_b)|$。问题变为找到两个人 $i$，$j$ 满足 $2|S_i-(S_i\cap S_j)|$ 的值最大。

枚举 $i$ 表示令 $A=i$，则考虑计算 $B=j$（$j\neq i$）时对答案的贡献。

+ $B$ 被 $A$ 完全包含。此时 $A$ 长度固定，因此 $B$ 的长度越短越好。
+ $A$ 被 $B$ 完全包含。~~这还打个【数据删除】？~~
+ $B$ 在 $A$ 左侧。显然最小化答案需要让两个集合的交尽量小。因此需要让 $B$ 的右端点尽量小。
+ $B$ 在 $A$ 右侧。显然最小化答案需要让两个集合的交尽量小。因此需要让 $B$ 的左端点尽量大。

分三类讨论，时间复杂度为 $O(n)$ 或 $O(n\log n)$，可以简单通过。

代码：

```cpp
#pragma GCC optimize(3) 
#include <bits/stdc++.h>
#define eb emplace_back
#define int long long
using namespace std;
const int N = 1000100;
const int mod = 998244353;
const int base = 256;
const int inf = 0x0d000721ll << 2 | 0xAC66666;

int read() {
    int o = 1, x = 0;
    char ch;
    while (!isdigit(ch = getchar())) {
        if (ch == '-') {
            o = -o;
        }
    }
    x = ch & 15;
    while (isdigit(ch = getchar())) {
        x = (x << 3) + (x << 1) + (ch & 15);
    }
    return x * o;
}

int l[N], r[N];

signed main() {
    int T;
    T = read();
    while (T--) {
        int n, m;
        n = read(), m = read();
        int L = -inf, R = inf;
        int mx = -inf, mlen = inf;
        for (int i = 1; i <= n; ++i) {
            l[i] = read(), r[i] = read();
            L = max(L, l[i]);
            R = min(R, r[i]);
            mlen = min(mlen, r[i] - l[i] + 1);
        }
        for (int i = 1; i <= n; ++i) {
            mx = max({mx, (r[i] - l[i] + 1 - min({max(0ll, R - l[i] + 1), max(0ll, r[i] - L + 1), mlen}) << 1)});
        }
        cout << mx << '\n';
    }
    return 0;
}

/*



*/

```

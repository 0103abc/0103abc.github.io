---
title: "CF607C Marbles 题解"
date: "2025-01-31T14:36:56.000Z"
link: "luogu-9wzg0v9f"
categories: ["题解"]
tags: ["Codeforces", "字符串", "字符串匹配"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/9wzg0v9f)。

手玩了一会儿之后发现，考虑到把一个弹珠移动到终点之后，若另一个弹珠想要移动到终点则必须执行其最后一次操作。此时若这个操作和第一个弹珠的操作相逆，则显然执行这个操作之后会把第一个弹珠给移出来，而若要把第一个弹珠移回去，则第二个弹珠又被移出了。因此这个情况需要被判掉。

但是这显然是不对的。考虑到如果两个弹珠最后两个操作逆序，且逆序对应操作相逆，那么想要把其中一个弹珠移过去，会让另外故一个弹珠以同样的方式被移出来，而要将其移回去就会把第一个弹珠再移出来。这种情况也不符合条件。

同样的，将其扩展，若两个弹珠最后 $k$ 个操作逆序且逆序对应操作相逆，那么两个弹珠将在最后阶段不停的进行死循环。容易（打表）发现其余所有情况均可以满足条件。因此问题被转化为：

> 有两个字符串 $s_1,s_2$，长度均为 $n$。现在问是否存在一个 $k$ 满足 $1\le k<n$，满足 $s_1,s_2$ 分别取出最后 $k$ 个字符，并将 $s_2$ 反序，对 $s_2$ 的每一个字符求逆后，$s_1=s_2$。

这个问题是简单的，直接正反哈希一下就行了。时间复杂度为 $O(n)$ 可以通过。

代码：

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000100;
int a[N];
char s[N], t[N];
inline char anot(char o) {
    if (o == 'N') o = 'S'; else if (o == 'S') o = 'N';
    if (o == 'E') o = 'W'; else if (o == 'W') o = 'E';
    return o;
}
signed main() {
    // cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n;
    cin >> n;
    scanf("%s%s", s + 1, t + 1);
    for (int i = 1; i < n; ++i) {
        t[i] = anot(t[i]);
    }
    using ull = unsigned long long;
    ull h1 = 0, h2 = 0;
    ull bit = 1, base = 13331;
    for (int i = n - 1; i; --i) {
        h1 = h1 + bit * s[i];
        h2 = h2 * base + t[i];
        if (h1 == h2) {
            cout << "NO\n";
            return 0;
        }
        bit *= base;
    }
    cout << "YES\n";
}
```

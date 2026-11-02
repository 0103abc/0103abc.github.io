---
title: "CF1458D Flip and Reverse 题解"
date: "2025-08-11T12:56:30.000Z"
link: "luogu-xjttr7km"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "字符串"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/xjttr7km)。

这是给人想的？？？？？？？？？？？？

构建图模型，把 $0$ 看做是 $x\to x-1$ 的有向边，$1$ 看做是 $x\to x+1$ 的有向边，**这样一次操作的合法条件就是在图上走一个环，答案就是这张图字典序最小的欧拉路径**。然后贪心处理，对于一个点 $u$ 如果能走到 $u-1$ 且若 $u+1$ 有边且能走回来，那么就贪心的走 $u-1$，否则走 $u+1$。时间复杂度为 $O(n)$。

代码经过了一点压行处理。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;

const int N = 1000010;
const int inf = 1e18;
const int mod = 1e9 + 7;

char s[N];
int buc[N];

signed main()
{
    int T;
    cin >> T;
    while (T--)
    {
        scanf("%s", s + 1);
        int n = strlen(s + 1), x = n;
        fill(buc, buc + n + n + 2, 0), for_each(s + 1, s + n + 1, [&](char &o) { ++buc[(o == '1') ? (x++) : (--x)]; });
        for_each(s + 1, s + (x = n) + 1, [&](...) { cout << ((buc[x - 1] && (buc[x - 1] > 1 || !buc[x])) ? (--buc[--x], 0) : (--buc[x++], 1)); });
        cout << '\n';
    }
    return 0;
}
```

---
title: "CF1996G Penacony 题解"
date: "2025-02-28T06:39:52.000Z"
link: "luogu-c33d0bg3"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "差分"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/c33d0bg3)。

一个很好理解很好写的做法。显然答案的上界是 $n$。

考虑对于一条 $a\sim b$ 的路径，则要么在圆上顺时针走要么逆时针走。考虑定义一条路径的状态 $F(u\to v)$：

+ $F(u\to v)=1$：即维护 $u$ 顺时针走到 $v$ 的路径。
+ $F(u\to v)=0$：即维护 $u$ 逆时针走到 $v$ 的路径。

那么可以定义一段路 $x\to y$ 的状态（$x,y$ 相邻），记作 $G(x\to y)$：

+ 对于一条从 $u$ 走到 $v$ 的路径，若其顺时针走包含 $x\sim y$，则在 $G(x\to y)$ 中添加 $u\to v$ 的路径，否则其便然逆时针走包含 $x\sim y$，不添加该条路径。

此时 $G(x\to y)$ 为一个路径集合。下面说明对于两个路径集合 $G_1,G_2$，若 $G_1\neq G_2$，则 $G_1,G_2$ 所对应的环上路径必然不能都不维护：

因为 $G_1\neq G_2$，所以 $G_1,G_2$ 中必然存在一个路径 $u\sim v$ 满足其在 $G_1,G_2$ 中恰好出现了一次。考虑到若 $G_1,G_2$ 对应路径同时不维护，则对于上面的 $u\sim v$ 路径而言，其无法顺时针或逆时针来从 $u$ 移动到 $v$ 而不经过任何不维护的路段。因此可以证明选择的删除集合 $S$ 必然不能同时包含 $G_1,G_2$。

然后下面说明若 $\forall G_1,G_2\in S,G_1=G_2$，则该删除方案必然可行：此时只需要按照 $S$ 中维护出现的路径集合 $G$，按照 $G$ 的方式来顺时针 / 逆时针维护路径即可。

因此可以证明，答案必然是选择一个合法的路径集合 $g$，然后对于所有 $G(x\sim y)=g$ 的环上路径，停止对其的维护，其余路径全部维护。此时问题变为如何快速的记录 $G(x\sim y)$ 的值。考虑对于每一条路径 $u\sim v$ 随机一个整数 $r$，然后让 $u\sim v$ 顺时针下所有经过的边全部异或上 $r$，这个操作可以使用差分来实现。最后只需要用 `map` 求出所有 $G(x\sim y)$ 的众数，用 $n$ 减去她即可。时间复杂度为 $O(n\log n)$。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/hash_policy.hpp>
#define int long long
using namespace std;
const int N = 500010;
int diff[N];
mt19937_64 mt(time(0));
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int T;
    cin >> T;
    while (T--) {
        int n, m;
        cin >> n >> m;
        for (int i = 1; i <= n; ++i) diff[i] = 0;
        for (int i = 1; i <= m; ++i) {
            int a, b;
            cin >> a >> b;
            int rng = mt();
            diff[a] ^= rng, diff[b] ^= rng;
        }
        for (int i = 2; i <= n; ++i) diff[i] ^= diff[i - 1];
        map<int, int> mp;
        for (int i = 1; i <= n; ++i) ++mp[diff[i]];
        int res = n;
        for (auto &[i, j] : mp) res = min(res, n - j);
        cout << res << '\n';
    }
    return 0;
}
```

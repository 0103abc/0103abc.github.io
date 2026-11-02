---
title: "CF629D Babaei and Birthday Cake 题解"
date: "2025-02-25T05:41:33.000Z"
link: "luogu-n72romjt"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/n72romjt)。

鉴定为：【模板】最长上升子序列。

考虑到问题只和编号、体积两个状态有偏序关系，因此考虑对一个维度排序，然后对另一个维度求最长上升子序列。考虑到编号维的最值相对较小更容易处理，因此对体积从小到大排序，然后对编号维度跑 LIS 即可。直接做时间复杂度为 $O(n^2)$，考虑用 BIT 优化，时间复杂度降为 $O(n\log n)$ 可以通过。

如果 wa on test $37$ 那么检查排序时若体积相等，则是否按照编号降序排序。

代码：

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
const long double pi = acosl(-1);
struct Cake {
    int r, h, id;
} cake[N];
int tree[N], f[N];
void add(int x, int v) {
    for (; x < N; x += (x &- x)) tree[x] = max(tree[x], v);
}
int query(int x) {
    int s = 0;
    for (; x; x -= (x &- x)) s = max(s, tree[x]);
    return s;
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> cake[i].r >> cake[i].h, cake[i].id = i;
    sort(cake + 1, cake + n + 1, [&](auto &l, auto &r) {
        return l.r * l.r * l.h < r.r * r.r * r.h || l.r * l.r * l.h == r.r * r.r * r.h && l.id > r.id;
    });
    for (int i = 1; i <= n; ++i) {
        f[i] = query(cake[i].id - 1) + cake[i].r * cake[i].r * cake[i].h;
        add(cake[i].id, f[i]);
    }
    cout << *max_element(f + 1, f + n + 1) * pi << '\n';
    return 0;
}
```

---
title: "CF1310D Tourism 题解"
date: "2025-02-24T08:03:34.000Z"
link: "luogu-eov4f0nq"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分", "图论", "二分图匹配", "动态规划"]
draft: false
---

神秘的。直接做看上去十分困难，但是考虑到图中不能走出奇环，利用“二分图不存在奇环”这个性质，给图中每一个点随机赋值为 $0/1$，然后建图要求两个点权值不同才连边。此时不需要考虑奇环限制，暴力跑 dp 即可。因为一次算法正确率极低，而又不可能枚举所有的权值情况，因此考虑随机若干组数据（略大于 $30000$ 组），就可以通过了。具体可以稍微卡一下时。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 200100;
using ull = unsigned long long;
int n, k, a[2010][2010], f[2010][2010], col[N];
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cin >> n >> k;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= n; ++j)
            cin >> a[i][j];
    int res = 1e18;
    srand(time(0));
    while (1. * clock() / CLOCKS_PER_SEC < 2.95) {
        for (int i = 1; i <= n; ++i) col[i] = rand() & 1;
        for (int i = 0; i <= k; ++i)
            for (int j = 1; j <= n; ++j) f[i][j] = 1e18;
        f[0][1] = 0;
        for (int i = 0; i < k; ++i)
            for (int j = 1; j <= n; ++j)
                for (int p = 1; p <= n; ++p)
                    if (j != p && col[j] != col[p])
                        f[i + 1][p] = min(f[i + 1][p], f[i][j] + a[j][p]);
        res = min(res, f[k][1]);
    }
    cout << res << '\n';
    return 0;
}
```

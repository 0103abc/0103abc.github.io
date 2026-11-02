---
title: "CF1101F Trucks and Cities 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-cf1101f"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "基础算法", "二分"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1101F).
:::

:::info[Solution]{open}
考虑区间 dp。设 $f_{i,j,k}$ 表示每公里油耗为 $1$ 的车，从 $i$ 到 $j$ 加 $k$ 次油所需要的最少的邮箱容量是多少。转移考虑枚举决策点 $p$，即为 $f_{i,j,k}\leftarrow\max(f_{i,p,k-1},a_j-a_p)$。

直接做是 $O(n^4)$ 的，难以通过。注意到上面的东西决策有单调性可以整体二分优化 dp，时间复杂度降低到 $O(n^3)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N];
signed f[401][401][401];
inline void cdq(int pos, int k, int l, int r, int ll, int rr) {
    if (l > r) return;
    int mid = l + r >> 1, mi = inf, id = -1;
    for (int i = ll; i <= min(mid, rr); ++i) if (mi > max<int>(a[mid] - a[i], f[pos][i][k - 1]))
        mi = max<int>(a[mid] - a[i], f[pos][i][k - 1]), id = i;
    f[pos][mid][k] = mi, cdq(pos, k, l, mid - 1, ll, id), cdq(pos, k, mid + 1, r, id, rr);
}
inline void sol() {
    int n, m; cin >> n >> m;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i)
        for (int j = i; j <= n; ++j) f[i][j][0] = a[j] - a[i];
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= n; ++j) cdq(i, j, i + 1, n, i + 1, n);
    int res = 0;
    for (int i = 1; i <= m; ++i) {
        int s, t, c, r; cin >> s >> t >> c >> r;
        res = max(res, c * f[s][t][r]);
    } cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：4

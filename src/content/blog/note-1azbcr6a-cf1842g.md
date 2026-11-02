---
title: "CF1842G Tenzing and Random Operations 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1842g"
categories: ["题解"]
tags: ["Codeforces", "动态规划"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1842G).
:::

:::info[Solution]{open}
直接推是可以做的但是比较无聊，因此考虑编一个组合意义。可以看作是一个人从 $1$ 号点出发，每次从 $i$ 号点移动到 $i+1$ 号点，问移动到 $n+1$ 点的方案数是多少。从 $i$ 到 $i+1$ 初始有 $a_i$ 种移动方法。然后随机一个位置 $p$ 就相当于是额外加若干条从 $q$ 走到 $q+1$ 的路（$q\ge p$），有 $v$ 种移动方法。

考虑直接 dp。设 $f_{i,j}$ 表示当前考虑了前 $i$ 个位置，使用 $j$ 次随机，有多少种不同的走法。转移是简单的：

+ 不使用工具，$f_{i+1,j}\leftarrow f_{i,j}a_{i+1}$
+ 使用工具，需要进一步分类讨论：
  + 用一个以前用过的工具，$f_{i+1,j}\leftarrow f_{i,j}jv$。
  + 新开一个工具，$f_{i+1,j+1}\leftarrow f_{i,j}(i+1)(m-j)v$，其中 $i+1$ 是该工具出现的位置，$m-j$ 是可以选择的方案数。

答案是容易算的，枚举用的工具数量然后直接统计一下就好了。时间复杂度为 $O(n^2)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], f[5010][5010];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m, v; cin >> n >> m >> v;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    f[0][0] = 1;
    for (int i = 0; i < n; ++i)
        for (int j = 0; j <= min(m, i); ++j) {
            f[i + 1][j + 1] = (f[i + 1][j + 1] + f[i][j] * (i + 1) % mod * v % mod * (m - j) % mod) % mod;
            f[i + 1][j] = (f[i + 1][j] + f[i][j] * a[i + 1] % mod + f[i][j] * v % mod * j % mod) % mod;
        }
    int res = 0;
    const int inv = inversion(n);
    for (int i = 0; i <= min(n, m); ++i) res = (res + f[n][i] * power(inv, i, mod) % mod) % mod;
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：9

---
title: "CF1733E Conveyor 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf1733e"
categories: ["题解"]
tags: ["Codeforces", "动态规划"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1733E).
:::

:::info[Solution]{open}
容易发现若在所有时刻中，有 $w$ 个时刻 $(x,y)$ 位置有物品，则这些物品中一定恰有 $\lceil\frac w2\rceil$ 个物品是向右移动的，$\lfloor\frac w2\rfloor$ 个物品是向下移动的。因此对每个 $(x,y)$ 只需要知道 $(x-1,y)$ 和 $(x,y-1)$ 位置有过的物品数量就可以求出 $(x,y)$ 位置有过的物品的数量，可以直接 dp 求解。

直接对每组询问都暴力跑一遍平方的 dp，时间复杂度为 $O(Qnm)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], f[124][124], g[124][124];

inline void sol() {
    memset(f, 0, sizeof f);
    memset(g, 0, sizeof g);
    int t, x, y; cin >> t >> x >> y;
    f[1][1] = t - x - y + 1, g[1][1] = t - x - y;
    for (int i = 1; i <= x + 1; ++i)
        for (int j = 1; j <= y + 1; ++j) {
            f[i][j] += f[i - 1][j] / 2 + (f[i][j - 1] + 1) / 2;
            g[i][j] += g[i - 1][j] / 2 + (g[i][j - 1] + 1) / 2;
        }
    cout << ((f[x + 1][y + 1] != g[x + 1][y + 1]) ? "YES" : "NO") << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：9

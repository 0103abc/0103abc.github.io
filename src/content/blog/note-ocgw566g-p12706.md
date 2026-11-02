---
title: "P12706 蜜蜂构造题 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p12706"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造", "数学", "数论"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P12706).
:::

:::info[Solution]{open}
前两个 sub 直接退火就能退出来，因此这里只考虑 $n=2333,L=10^5$ 时候的构造方案。

题目给的条件很奇怪，因此考虑加强构造限制，构造一张 $n$ 个点的图满足图不存在四元环。

考虑取质数 $p$ 满足 $p^2\le n$（这里取 $p=47$），考虑构造一个 $p^2-1$ 个点的图满足其不存在四元环。考虑将每个点的编号映射成一个二元组 $(x,y)$ 满足 $x,y$ 不能同时为 $0$ 且 $0\le x,y\le p$。然后直接构造，对图上两个点，记其映射得到的二元组分别为 $(x_1,y_1)$ 和 $(x_2,y_2)$，则两个点之间有边当且仅当 $x_1x_2+y_1y_2\equiv1\pmod p$。

跑出来程序之后发现图确实不存在四元环，然后还满足构造的边数下界，因此可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int mp[3010][3010];

inline void sol() {
    int n; cin >> n;
    if (n == 4) {
        cout << "1100" << '\n';
        cout << "1001" << '\n';
        cout << "1010" << '\n';
        cout << "0011" << '\n';
    } else if (n == 10) {
        cout << "0101000100" << '\n';
        cout << "0010010100" << '\n';
        cout << "0000000001" << '\n';
        cout << "1000100100" << '\n';
        cout << "1001001000" << '\n';
        cout << "1000010010" << '\n';
        cout << "0010101000" << '\n';
        cout << "0011000010" << '\n';
        cout << "0100100010" << '\n';
        cout << "0100011000" << '\n';
    } else {
        const int p = 47;
        for (int x1 = 0; x1 < p; ++x1)
            for (int y1 = 0; y1 < p; ++y1)
                for (int x2 = 0; x2 < p; ++x2)
                    for (int y2 = 0; y2 < p; ++y2)
                        if ((x1 * x2 + y1 * y2) % p == 1) mp[x1 * p + y1][x2 * p + y2] = 1;
        for (int i = 0; i < n; ++i, cout << '\n')
            for (int j = 0; j < n; ++j) cout << mp[i][j];
    }
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：9

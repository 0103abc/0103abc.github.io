---
title: "P14106 [ZJCPC 2017] Yet Another Game of Stones 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p14106"
categories: ["题解"]
tags: ["洛谷", "数学", "博弈"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P14106).
:::

:::info[Solution]{open}
考虑对不同的 $b_i$ 分类讨论：

+ $b_i=2$：
  + 若 $a_i$ 为奇数，则显然该堆石子是 Bob 必胜的。
  + 若 $a_i$ 为偶数，则 Alice 必须一次取完，否则 Bob 可以取一个石子变成上一类情况，然后变成 Bob 必胜的。
+ $b_i=1$：
  + 若 $a_i$ 为大于 $1$ 的奇数，则 Alice 必须一次取完，否则 Bob 同样可以做一次操作让这一堆石子变成 Bob 必胜的。
  + 若 $a_i$ 为偶数，则 Alice 必须一次取到只剩下 $1$ 个石子，否则 Bob 同样可以做一次操作让这一堆石子变成 Bob 必胜的。

统计一下有多少个出现上面情况的石子堆，如果这样的堆的数量 $>1$ 则肯定是 Bob 必胜的，否则做一次 Nim 博弈然后简单分类讨论一下即可。

总时间复杂度为 $O(n)$。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N];

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) cin >> b[i];
    int c1 = 0, c2 = 0;
    for (int i = 1; i <= n; ++i) {
        if (a[i] % 2 && b[i] == 2) ++c1;
        if (a[i] > 1 && b[i] == 1 || a[i] % 2 == 0 && b[i] == 2) {
            ++c2;
            if (a[i] % 2 == 0 && b[i] == 1) a[i] = 1;
            else a[i] = 0;
        }
    }
    if (c1 ||c2 > 1) cout << "Bob\n";
    else {
        int nim = 0;
        for (int i = 1; i <= n; ++i) nim ^= a[i];
        if (nim && !c2 || !nim && c2) cout << "Alice\n";
        else cout << "Bob\n";
    }
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：4

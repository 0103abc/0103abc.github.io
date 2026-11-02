---
title: "CF1780E Josuke and Complete Graph 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-cf1780e"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1780E).
:::

:::info[Solution]{open}
题目的条件可以看作是奇数有多少个 $k$ 满足区间内存在 $i\neq j\land i,j\in[l,r]$ 使得 $\gcd(i,j)=k$，也可以看作是存在至少两对 $(i,j)$ 满足 $i,j\in[l,r]$ 且 $\gcd(i,j)=k$，进一步转化就是 $\lfloor\frac{l-1}k\rfloor+2\le \lfloor\frac rk\rfloor$。

后面部分是简单的，直接对 $k\ge l$ 和 $k<l$ 两类情况分别讨论。$k\ge l$ 部分答案显然就是 $\max(0,\lfloor\frac r2\rfloor-l)$，$k<l$ 直接整除分块算答案即可。总时间复杂度为 $O(T\sqrt l)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

inline void sol() {
    int l, r; cin >> l >> r;
    int res = max<int>(0, r / 2 - l + 1);
    for (int i = 1, j; i < l; i = j + 1) {
        j = (l - 1) / ((l - 1) / i);
        res += max<int>(0, min(j, r / ((l - 1) / i + 2)) - i + 1);
    }
    cout << res << '\n';
}

} // namespace lowspeed_song

```
:::

难度：青

鲜活指数：-2

---
title: "P2284 [HNOI2003] 密室之门 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p2284"
categories: ["题解"]
tags: ["洛谷", "数学", "数论"]
draft: false
---

:::info[Description]
https://www.luogu.com.cn/problem/P2284
:::

:::info[Solution]{open}
问题可以被转化为判断一组同余方程组是否有解。容易想到直接枚举每一对同余方程组 $(i,j)$ 判断第 $i$ 个同余方程和第 $j$ 个同余方程联立后是否可以得到解。

具体的，记两个同余方程分别为：

+ $x\equiv b_1\pmod {a_1}$
+ $x\equiv b_2\pmod {b_2}$

则根据 Bezout 定理的推论可知上述同余方程组优解当且仅当 $\gcd(a_1,a_2)\mid |b_2-b_1|$。因此直接暴力枚举时间复杂度为 $O(n^2\log V)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N];

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> b[i] >> a[i], a[i] = b[i] - a[i];
    for (int i = 1; i <= n; ++i)
        for (int j = i + 1; j <= n; ++j)
            if (abs(a[i] - a[j]) % gcd(b[i], b[j])) {
                cout << "impossible\n";
                return;
            }
    cout << "possible\n";
}

} // namespace lowspeed_song
```
:::

难度：绿

鲜活指数：1

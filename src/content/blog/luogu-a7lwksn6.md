---
title: "P3421 [POI 2005] SKO-Knights 题解"
date: "2026-07-29T06:55:04.000Z"
link: "luogu-a7lwksn6"
categories: ["题解"]
tags: ["洛谷", "数学", "数论"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/a7lwksn6)。

可以证明只使用 $(A,B),(0,C)$ 两种变换就可以凑出所有的变换。

考虑逐个加入新的变换。设当前加入的变换为 $(a,b)$，则：

+ 此时横坐标可以到达的最小正间隔从 $A$ 变为 $\gcd(A,a)$。用 exgcd 凑出一个横坐标恰好为 $g$ 的变换，作为新的 $(A,B)$ 变换。
+ 原来的 $(A,B)$ 变换和新加入的 $(a,b)$ 变换可以组合出一个横坐标变化量为 $0$ 的移动，此时纵坐标的移动就是 $\frac{|Ab-aB|}{\gcd(A,a)}$。因此把 $(0,C)$ 变换修改为 $(0,\gcd(C,\frac{|Ab-aB|}{\gcd(A,a)}))$ 变换即可。

容易证明上述做法的正确性。

每加入一个变换时间复杂度都是 $O(\log n)$ 的，因此总时间复杂度为 $O(n\log n)$，可以通过该题。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N];

inline void sol() {
    int n; cin >> n;
    for (int i = 0; i < n; ++i) cin >> a[i] >> b[i];
    int pos = 0; while (!a[pos]) ++pos;
    swap(a[0], a[pos]), swap(b[0], b[pos]);
    int A = a[0], B = b[0], C = 0;
    for (int i = 1; i < n; ++i) {
        int x, y, g = exgcd(abs(A), abs(a[i]), x, y);
        if (A < 0) x = -x;
        if (a[i] < 0) y = -y;
        int t = abs(A * b[i] - B * a[i]) / g;
        A = g, B = B * x + b[i] * y, C = gcd(C, t);
        if (C) B = (B % C + C) % C;
    } cout << A << ' ' << B << '\n' << 0 << ' ' << C << '\n';
}

} // namespace lowspeed_song
```
:::

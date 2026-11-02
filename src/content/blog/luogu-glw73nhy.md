---
title: "P12468 [Math×Girl] 距离 题解"
date: "2026-07-30T09:49:28.000Z"
link: "luogu-glw73nhy"
categories: ["题解"]
tags: ["洛谷", "算法思想", "分治"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/glw73nhy)。

钦定 $x\ge y$，此时只需要考虑 $x'=ky'$ 的情况。特判已经满足条件的 $x,y$。

然后考虑一个简单的暴力算法：枚举 $y$ 的变化量，然后直接通过公式计算出 $x$ 的变化量最小是多少。

然后再考虑一个稍微复杂一点的暴力：枚举 $x'=ky'$ 这个等量关系的 $k$ 值。固定 $k$ 值后让 $ky'$ 值最接近 $x$ 的一个值 $y'$ 一定满足 $y'=\lfloor\frac xk\rfloor$ 或 $y'=\lfloor\frac xk\rfloor+1$。

但是此时仍然不知道枚举量是多少。考虑一个简单的答案上界，固定 $y$ 的值不懂，把 $x$ 修改成最接近 $y$ 的倍数。因此答案上界显然不会超过 $\lfloor\frac y2\rfloor$。因此上面两个暴力算法枚举的界限都可以被简单确定。

套路的结合两个暴力算法，考虑根号分治，若 $y\le \sqrt x$ 则使用第一个暴力，否则使用第二个暴力。加一些剪枝后即可通过该题。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int x, y;

inline int calc(int k) {
    return min(abs(x / k * k - x), abs((x / k + 1) * k - x)) + abs(y - k);
}

inline int calc2(int k) {
    return min(abs(x / k * k - x) + abs(x / k - y), abs((x / k + 1) * k - x) + abs(x / k + 1 - y));
}

inline void sol() {
    cin >> x >> y;
    if (x < y) swap(x, y);
    if (x % y == 0 || y % x == 0) { cout << 0 << '\n'; return; }
    int res = 1e7;
    if (y <= sqrt(x)) {
        res = calc(y);
        for (int i = 1; i < res; ++i) res = min({res, calc(y + i), calc(y - i)});
    } else {
        res = calc2(x / y);
        for (int i = x / y + 1; res + 1.L * x / i > y; ++i) res = min(res, calc2(i));
        for (int i = x / y - 1; i && res - 1.L * x / i > -y; --i) res = min(res, calc2(i));
    }
    cout << res << '\n';
}

} // namespace lowspeed_song
```

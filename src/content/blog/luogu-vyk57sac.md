---
title: "P16942 「LAOI-18」铃喵 题解"
date: "2026-06-21T06:09:02.000Z"
link: "luogu-vyk57sac"
categories: ["题解"]
tags: ["洛谷", "数学", "代数"]
draft: false
---

注意到当 $b=20639,c=260263$ 时：

$$
\left(5b+10\cdot\left\lfloor\dfrac{8c}b\right\rfloor\right)a^3+\left(43c+\left\lfloor\dfrac{8c}b\right\rfloor\right)a^2-(214b+3833)a+2c-5b-15121=(91a+9810)(1145a^2-451a+41)
$$

于是本题解决。个人感觉完全不是题。

```cpp line-numbers
inline void sol() {
    int l, r; cin >> l >> r;
    for (int i = l; i <= r; ++i) cout << "20639 260263\n";
}
```

---

一个不太需要观察的做法：先猜测对任意的 $a$ 都存在一组固定的 $(b,c)$ 解满足条件。记 $d=\lfloor\frac{8c}b\rfloor$。因为原式是三次式，因此其是二次式 $1145a^2-451a+41$ 的倍数则其可以被表示为 $(ua+v)(1145a^2-451a+41)$ 的形式，其中 $u,v$ 为整数。

对比系数可得需要同时满足条件 $5b+10d=1145u,43c+d=1145v-451u,-214b-3833=41u-451v,2c-5b-15121=41v$。解这个不定方程组可以得到通解 $b=20639+488474t,c=260263+6003015t,d=100+1617991t$。又因为还需要满足 $d=\lfloor\frac{8c}b\rfloor$，一个个试 $t$ 的值可以发现 $t=0$ 即符合条件。

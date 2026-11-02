---
title: "AT_arc158_d [ARC158D] Equation 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-at_arc158_d"
categories: ["题解"]
tags: ["AtCoder", "数学", "概率与期望"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/AT_arc158_d).
:::

:::info[Solution]{open}
没有人类了。考虑记 $F(x,y,z)=(x+y+z)(x^n+y^n+z^n)(x^{2n}+y^{2n}+z^{2n}),G(x,y,z)=x^{3n}+y^{3n}+z^{3n}$。注意到 $F(x,y,z)$ 和 $G(x,y,z)$ 的次数只差 $1$ 而且都是齐次式，因此考虑直接任取一组 $a,b,c$，记 $x=ta,y=tb,z=tc$。因为 $F$ 的总次数为 $3n+1$ 而 $G$ 的总次数为 $3n$ 因此 $F(ta,tb,tc)=t^{3n+1}F(a,b,c),G(ta,tb,tc)=t^{3n}G(a,b,c)$。因此只需要满足 $t^{3n+1}F(a,b,c)=t^{3n}G(a,b,c)$ 且 $t\neq 0$ 就可以在等式左右两侧同时约掉 $t^{3n}$ 得到 $tF(a,b,c)=G(a,b,c)$。因此直接取 $t=\frac{G(a,b,c)}{F(a,b,c)}$ 则 $(ta,tb,tc)$ 就一定能够满足原等式。

然后如果真的随 $a,b,c$ 则有可能因为 $t=0$ 导致没有解，因此多随几组 $(a,b,c)$ 即可（随即一组成功的概率还是很大的）。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

inline void sol() {
    int n, p; cin >> n >> p;
    mt19937 mt(time(0));
    uniform_int_distribution<int> dist(1, p - 1);
    int a[3];
    while (1) {
        a[0] = dist(mt), a[1] = dist(mt), a[2] = dist(mt);
        sort(a, a + 3);
        if (a[0] == a[1] || a[1] == a[2]) continue;
        int x = (a[0] + a[1] + a[2]) % p * (power(a[0], n, p) + power(a[1], n, p) + power(a[2], n, p)) % p * (power(a[0], n + n, p) + power(a[1], n + n, p) + power(a[2], n + n, p) % p) % p, y = (power(a[0], n + n + n, p) + power(a[1], n + n + n, p) + power(a[2], n + n + n, p)) % p, div = y * inversion(x, p) % p;
        if (div) { a[0] = a[0] * div % p, a[1] = a[1] * div % p, a[2] = a[2] * div % p; break; }
    } sort(a, a + 3);
    cout << a[0] << ' ' << a[1] << ' ' << a[2] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：无法评定

鲜活指数：无法评定

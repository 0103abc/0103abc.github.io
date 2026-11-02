---
title: "P12441 [NERC2023] Joy of Pokémon Observation 题解"
date: "2026-05-13T12:55:17.000Z"
link: "luogu-uaxtkndn"
categories: ["题解"]
tags: ["洛谷", "数学", "数论"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/uaxtkndn)。

先特判 $s=1$ 的情况。$s=2$ 和 $s=3$ 的做法类似，后面只讨论 $s=3$。类比 CRT 的做法，记 $\text{LCM}=\operatorname{lcm}(l_1,l_2,l_3),p_1=x_1\bmod\frac{\text{LCM}}{a_1},p_2=x_2\bmod\frac{\text{LCM}}{a_2},p_3=x_3\bmod\frac{\text{LCM}}{a_3}$。枚举 $p_1,p_2$ 的值，则此时转化为 $s=1$ 的情况，先判断是否有解然后求出 $p_1,p_2$ 对应的 $x_1,x_2$ 数量统计答案即可。

```cpp line-numbers
inline void sol() {
    int t, s; cin >> t >> s;
    if (s == 1) {
        int x; cin >> x;
        cout << ((t % x) ? 0 : 1) << '\n';
    } else if (s == 2) {
        int x, y, res = 0; cin >> x >> y;
        int LCM = lcm(x, y), cnt = 0;
        for (int i = 0; i < LCM / y; ++i)
            if (t >= i * y) {
                int d = (t - i * y) % LCM;
                if (d % x == 0) cnt += (t - i * y) / LCM + 1;
            }
        cout << cnt << '\n';
    } else {
        int x, y, z; cin >> x >> y >> z;
        int LCM = lcm(lcm(x, y), z), cnt = 0;
        for (int i = 0; i < LCM / z; ++i)
            for (int j = 0; j < LCM / y; ++j)
                if (t >= i * z + j * y) {
                    int d = (t - i * z - j * y) % LCM;
                    if (d % x == 0) cnt += ((t - i * z - j * y) / LCM + 1) * ((t - i * z - j * y) / LCM + 2) / 2;
                }
        cout << cnt << '\n';
    }
}
```

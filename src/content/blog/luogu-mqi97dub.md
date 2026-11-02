---
title: "CF493E Vasya and Polynomial 题解"
date: "2026-06-29T13:31:24.000Z"
link: "luogu-mqi97dub"
categories: ["题解"]
tags: ["Codeforces", "数学", "多项式"]
draft: false
---

$a>b$ 时显然无解，直接特判掉这种情况。

然后考虑对多项式 $P$ 的系数进行分类讨论：

**1. $P$ 中存在某一个系数的值大于 $a$**。

此时必然有 $P(t)>a$，因此无需讨论该情况。

**2. $P$ 中系数的最大值为 $a$**。

此时注意到若 $P$ 中存在 $\ge 2$ 个系数为 $a$，则同样的必然有 $P(t)>a$。因此此时必然是 $P$ 的最高次项的系数为 $a$，其余项的系数为 $0$。

先考虑 $n=0$ 的情况。此时 $P(x)=a$，则当且仅当 $a=b$ 时合法。

然后考虑 $n\ge 1$ 的情况。此时 $P(x)=ax^n$，先把 $t$ 带入多项式中得到 $P(t)=at^n=a$，因此必须有 $t^n=a$。此时又因为 $t\in\mathbb N_+$，所以解得 $t=1$。

然后再把 $a$ 带入多项式中。此时得到 $P(a)=a^{n+1}=b$，解这个高次方程即可。具体的：

+ 若 $a=1$，则若 $b=1$ 则方程有无穷解，否则无解。
+ 否则（$a\neq 1$），因为增长是指数级别的所以直接暴力算方程是否存在解即可。

**3. $P$ 中系数的最大值小于 $a$**。

此时发现多项式 $P$ 可以被看作是一个 $a$ 进制的数，因此直接把 $b$ 表示成 $a$ 进制的形式，然后判断是否合法即可。因此也可以证明该类情况最多存在一个合法的多项式 $P$。

有一点 corner case，注意讨论的时候不要把答案算重。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N];
inline void sol() {
    int t, a, b; cin >> t >> a >> b;
    if (a > b) cout << 0 << '\n';
    else {
        if (t == 1 && a == 1 && b == 1) cout << "inf\n";
        else {
            int res = 0;
            if (a > 1) {
                if (t == 1) {
                    int tmp = b;
                    while (tmp % a == 0) tmp /= a;
                    if (tmp == 1 && a != b) ++res;
                }
                int tmp = b, pwr = 1, all = 0;
                while (tmp) all += (tmp % a) * pwr, pwr *= t, tmp /= a;
                if (all == a) ++res;
            }
            if (a == b) ++res;
            cout << res << '\n';
        }
    }
}

} // namespace lowspeed_song
```

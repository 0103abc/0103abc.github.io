---
title: "P17064 [JRKSJ R10 热身赛] Infinite Strife, 题解"
date: "2026-07-04T15:03:42.000Z"
link: "luogu-m09lit4r"
categories: ["题解"]
tags: ["洛谷", "数学", "组合数学", "数论"]
draft: false
---

~~口胡做法，不知道对不对。~~ 是对的。

简单推导可知 $a_n=[x^0](x^{-1}+1+x)^n$。

由经典结论 $(x^{-1}+1+x)^{11a+b}\equiv (x^{-11}+1+x^{11})^a(x^{-1}+1+x)^b\pmod{11}$ 可知 $a_{11p+q}\equiv a_pa_q\pmod{11}$，即 $a_n\bmod 11$ 为 $n$ 在 $11$ 进制下每位的乘积 $\bmod\ 11$ 的值。

然后考虑在 $F_{11}^{\times}$ 中取离散对数：模 $11$ 意义下的原根为 $2$，因此最终的答案可以被表示为 $2^S\bmod 11$ 的形式，其中 $S$ 是所有被乘进去的 $a_i$ 的对数的和。根据费马小定理可知 $S$ 只需要求出 $\bmod\ 10$ 意义下的值即可被正确计算。

然后考虑把 $S$ 先表示出来：对 $a$ 序列做 $c$ 次前缀积后原来的 $a_i$ 在第 $n$ 项的指数是 $\binom{n+c-i-1}{c-1}$，因此 $S\equiv \sum\limits_{i=1}^n\log(a_i)\binom{n+c-i-1}{c-1}\pmod {10}$。

分别算出 $S\bmod 2$ 和 $S\bmod 5$ 的值然后直接暴力 CRT 即可求出 $S\bmod 10$ 的值。

计算 $S\bmod p$ 的值考虑先按 $11$ 进制下某一位是多少分组，每一组的 $i$ 都是一个连续的区间，而根据经典二项式结论可知 $\sum\limits_{i=l}^r\binom{n+c-i-1}{c-1}=\binom{n-l+c}c-\binom{n-r-1+c}c$，因此贡献可以被拆成若干个组合数求和的形式。

而又因为模数 $10$ 不是质数，因此考虑分别求出 $S\bmod 2$ 和 $S\bmod 5$ 的值，暴力 CRT 合并即可求出最终的答案。

~~代码先咕了。~~

:::success[代码]
```cpp line-numbers
namespace lowspeed_song {

int C[11][11], pre[N], val[N];

inline void init() {
    C[0][0] = 1;
    for (int i = 1; i < 10; ++i) {
        C[i][0] = 1;
        for (int j = 1; j <= i; ++j) C[i][j] = C[i - 1][j - 1] + C[i - 1][j];
    }
}

inline int lucas(int a, int b, int c) {
    int res = 1;
    while (a || b) {
        if (a % c < b % c) return 0;
        res = res * C[a % c][b % c] % c, a /= c, b /= c;
    } return res;
}

inline int calc(int n, int c, int p) {
    const int Log[] = {0, 0, 8, 7, 3, 7, 6, 3, 7, 2, 5};
    int pwr = 1, res = 0, cs = 0; while (pwr <= c) pwr *= p;
    for (int i = 0; i < pwr; ++i) val[i] = lucas(i, c, p), cs = (cs + val[i]) % p;
    for (int j = 1; j <= n; j *= 11) {
        const int is = inversion(j * 11 % pwr, pwr);
        for (int i = 0; i < pwr + pwr; ++i) pre[i + 1] = (pre[i] + val[i * (j * 11 % pwr) % pwr]) % p;
        function<int(int, int)> qry = [&](int st, int len) -> int {
            if (len <= 0) return 0;
            return (len / pwr * cs % p + pre[st % pwr * is % pwr + pwr + 1] - pre[st % pwr * is % pwr + pwr - len % pwr + 1] + p) % p;
        };
        for (int i = 1; i <= 10 && j * i <= n; ++i) {
            int sum = qry(n - j * i + c, (n - j * i) / (j * 11) + 1);
            if (n + 1 - j * i - j >= 0) sum = (sum + p - qry(n - j * i - j + c, (n + 1 - j * i - j) / (j * 11) + 1)) % p;
            res = (res + Log[i] * sum % p + p) % p;
        }
    }
    return res;
}


inline void sol() {
    int n, c; cin >> n >> c;
    int s2 = calc(n, c, 2), s5 = calc(n, c, 5), exp = 0;
    while (exp % 2 != s2 || exp % 5 != s5) ++exp;
    cout << power(2, exp, 11) << '\n';
}

} // namespace lowspeed_song
```
:::

---
title: "P10896 移言丁真：Unavoided linyue 题解"
date: "2026-08-05T13:30:12.000Z"
link: "luogu-o2kw1jz6"
categories: ["题解"]
tags: ["洛谷", "基础算法", "前缀和", "数学", "概率与期望", "组合数学"]
draft: false
---

套路的考虑把括号串放到二维平面上考虑，记 `(` 的权值为 $1$，`)` 的权值为 $-1$，权值数组为 $w_i$，前缀和数组为 $S_i$，则括号串可以看作是一条过 $(i,S_i)$ 点的折线。则此时路径最低点到起点的纵坐标高度差就是无法匹配的右括号数量，路径最低点到终点的纵坐标高度差就是无法匹配的左括号数量。记上面两个值分别为 $x,y$，则这个串的权值（即能匹配的括号数）就是 $\frac{l_i-x-y}2$。

因此一个括号串可以用一个三元组 $(a_i,b_i,c_i)$ 来表示，其中 $a_i$ 表示无法匹配的右括号数量，$b_i$ 表示无法匹配的左括号数量，$c_i$ 表示已经确定可以匹配的权值。则显然原串中左括号数量是 $b_i+c_i$，右括号数量是 $a_i+c_i$。

接下来考虑这些括号穿已经确定时，怎么排列才能让最终的权值最小。假设拼接后整条路径的最低点在第 $p$ 个括号串中，对其他括号串而言，若其 $a_i>b_i$ 则说明这个串整体在折线上向下走，应该放在第 $p$ 个串的左边，否则这个串整体在折线上往上走，应该放在第 $p$ 个串右边。此时第 $p$ 个串对起点终点到全局最低点的高度差的和贡献了 $a_p+b_p$ 的代价，其余串则贡献了 $|a_i-b_i|$ 的代价。因此这样对答案的贡献就是 $a_p+b_p+\sum\limits_{i\neq p}|a_i-b_i|=\sum\limits_i|a_i-b_i|-2\min(a_p,b_p)$。为了让最终的权值尽量小，容易想到让 $\min(a_p,b_p)$ 值最大的 $p$ 作为中间的串 $p$，因此确定所有串后最小的权值就是 $\frac{\sum\limits_il_i-\sum\limits_i|a_i-b_i|}2-\max\limits_i\min(a_i,b_i)$。记 $L_i=b_i+c_i,R_i=a_i+c_i$ 即第 $i$ 个串的左右括号数量，则权值还可以被表示为 $\sum\limits_i\min(L_i,R_i)-\max\limits_i\min(a_i,b_i)$ 的形式。

考虑分别计算两个部分的期望值。对长度为 $l$ 的随机括号串，枚举其中的左括号数 $j$ 可得 $\mathbb E[\min(L,R)]=\frac1{2^l}\sum\limits_{j=0}^l\min(j,l-j)\binom lj$。因为所有 $l_i$ 的总和为 $n$，因此对每个串直接枚举 $j$ 的时间复杂度还是线性的。

然后考虑算 $\mathbb E[\max\limits_i\min(a_i,b_i)]$ 的值。这个部分相对比较困难。设 $t_i=\min(a_i,b_i)$ 则有 $\mathbb E[\max\limits_i t_i]=\sum\limits_{k\ge 1}P(\max\limits_i t_i\ge k)=\sum\limits_{k\ge 1}(1-\prod\limits_iP(t_i<k))$。现在问题在于如何快速计算一个长度为 $l$ 个随机括号串中 $t=\min(a_i,b_i)$ 各个取值分布的概率情况。

考虑继续在折线图上考虑问题。把原来的折线路径整体向上平移 $a_i$ 个单位，则此时路径从高度 $a_i$ 出发，在高度 $b_i$ 结束，整条路径任意时刻都不在 $x$ 轴的下方且至少碰到过一次 $x$ 轴。因此 $t=\min(a_i,b_i)$ 就可以看作是平移后起点和终点高度的较小值。设 $h=\lfloor\frac l2\rfloor$，固定 $t=r$ 相当于起点和终点中至少有一个高度为 $r$ 且另一个高度至少为 $r$。这个东西可以直接枚举另一个高度然后用反射容斥来算折线数量，省略中间的 dirty work，最后的答案就是：

+ $\binom{l+1}{h-r}$，其中 $l$ 为偶数。
+ $2\binom l{h-r}$，其中 $l$ 为奇数（这个部分要乘以 $2$ 是因为起点和终点的奇偶性不同需要算两遍）。

记上面的东西值为 $F(l,r)$。

因为总共存在 $2^l$ 个长度为 $l$ 的括号串，所以 $P(t<k)=\frac{\sum\limits_{r=0}^{k-1}F(l,r)}{2^l}$。枚举 $k$ 的过程中顺带维护 $F(l,*)$ 的前缀和即可线性得到当前字符串的所有 $P(t<k)$ 的值。

记 $G_k=\prod\limits_i P(t_i<k)$，则因为各个括号串之间互相独立，因此 $G_k$ 就是所有 $t_i<k$ 的概率即 $G_k=P(\max\limits_i t_i<k)$。因此 $\mathbb E[\max\limits_i t_i]=\sum\limits_{k\ge 1}(1-G_k)$。具体实现过程中维护数组 $G_k$ 的值，初始所有 $G_k$ 的值都为 $1$，处理一个长度为 $l$ 的串时枚举 $k\le\lfloor\frac k2\rfloor$ 维护 $F(l,r)$ 的前缀和，从而求出 $P(t<k)$ 然后乘入 $G_k$ 中即可。

预处理阶乘，阶乘逆和二的幂的逆元即可做到线性求解问题。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int fac[N], inv[N], ifac[N], pwr[N], ipwr[N];

inline void init() {
    fac[0] = inv[0] = ifac[0] = 1;
    fac[1] = inv[1] = ifac[1] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
    pwr[0] = ipwr[0] = 1;
    for (int i = 1; i < N; ++i) {
        pwr[i] = pwr[i - 1] * 2 % mod;
        ipwr[i] = ipwr[i - 1] * i2 % mod;
    }
}

inline int binom(int a, int b) {
    if (b < 0 || a < b) return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}

int f[N], a[N];

inline void sol() {
    int n = 0, m, res = 0, mx = 0; cin >> m;
    for (int i = 1; i <= m; ++i) cin >> a[i], n += a[i], mx = max(mx, a[i] / 2);
    for (int i = 0; i < N; ++i) f[i] = 1;
    for (int i = 1; i <= m; ++i) {
        res = (res + a[i] * i2 % mod + mod - a[i] * binom(a[i] - 1, (a[i] - 1) / 2) % mod * ipwr[a[i]] % mod) % mod;
        int pre = 0;
        for (int j = 1; j <= a[i] / 2; ++j) {
            pre = (pre + ((a[i] & 1) ? 2 * binom(a[i], a[i] / 2 - j + 1) % mod : binom(a[i] + 1, a[i] / 2 - j + 1))) % mod;
            f[j] = f[j] * pre % mod * ipwr[a[i]] % mod;
        }
    } for (int i = 1; i <= mx; ++i) res = (res + mod - 1 + f[i]) % mod;
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

---
title: "P11284 「GFOI Round 2」Strings 题解"
date: "2026-08-05T13:06:13.000Z"
link: "luogu-g96mdbx3"
categories: ["题解"]
tags: ["洛谷", "字符串", "动态规划", "数学", "数论"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/g96mdbx3)。

[部分内容参考了该题解](https://www.luogu.com.cn/article/zzaf1yya)。

大的来了。

题目的条件可以看作是存在整数 $l$ 满足 $3l\le k$ 且前 $2l$ 个数构成回文串，因此问题可以看作是统计长度不超过 $n$ 的序列中存在一个足够短的偶数长度回文前缀的序列数量。

考虑 dp，设 $f_i$ 表示长度为 $2i$ 且最短偶回文串恰好为整个串的序列的数量。长度为 $2i$ 的回文串一共有 $m^i$ 个，但是其中某些回文串可能有更短的偶回文前缀。假设最短回文前缀的长度为 $2j$，则序列的前 $2j$ 位有 $f_j$ 种填写方案，为了将其补全成长度为 $2i$ 的回文串，中间还有 $i-2j$ 个位置可以随便填，因此该类的不合法方案数就是 $f_jm^{i-2j}$ 种。

把上面东西合起来写可以得到递推式 $f_i=m^i-\sum\limits_{j=1}^{\lfloor\frac i2\rfloor}f_jm^{i-2j}$。

然后考虑枚举最短回文前缀的长度 $2l$。序列的总长度为 $k$ 时因为要求 $3l\le k$，而前 $2l$ 位有 $f_l$ 种填法，后 $k-2l$ 位随便填，方案数就是 $f_lm^{k-2l}$。

因此总的答案就是 $\sum\limits_{i=1}^{\lfloor\frac n3\rfloor}f_i\sum\limits_{k=3i}^nm^{k-2i}$，直接算时间复杂度是 $O(n^2)$ 的，考虑优化。答案内层是一个等比数列求和的形式，因此还可以被表示为 $\sum\limits_{i=1}^{\lfloor\frac n3\rfloor}f_i\frac{m^i-m^{n-2i+1}}{1-m}$ 的形式，也就是 $\frac1{1-m}(\sum\limits_{i=1}^{\lfloor\frac n3\rfloor}f_im^i-\sum\limits_{i=1}^{\lfloor\frac n3\rfloor}f_im^{n-2i+1})$，求和部分可以优化到线性时间复杂度。

（我想到这里就不会了）

记 $S(n,t)=\sum\limits_{i=1}^nf_im^{ti}$，则答案可以表示为 $\frac{S(\lfloor\frac n3\rfloor,1)-m^{n+1}S(\lfloor\frac n3\rfloor,-2)}{1-m}$ 的形式。

先考虑怎么优化递推的时间复杂度。已知 $f_l=m^l-\sum\limits_{i=1}^{\lfloor\frac l2\rfloor}f_im^{l-2i}$，则把递推公式直接带入到 $S(*,*)$ 中，可得 $S(n,t)=\sum\limits_{l=1}^n(m^l-\sum\limits_{i=1}^{\lfloor\frac l2\rfloor}f_im^{l-2i})m^{tl}=\sum\limits_{i=1}^nm^lm^{tl}-\sum\limits_{l=1}^n\sum\limits_{i=1}^{\lfloor\frac l2\rfloor}f_im^{l-2i}m^{tl}=m^{(t+1)l}-\sum\limits_{l=1}^n\sum\limits_{i=1}^{\lfloor\frac l2\rfloor}f_im^{(t+1)l-2i}$。

现在考虑怎么优化算 $\sum\limits_{l=1}^n\sum\limits_{i=1}^{\lfloor\frac l2\rfloor}f_im^{(t+1)l-2i}$ 的值。考虑交换求和顺序，可得 $\sum\limits_{i=1}^{\lfloor\frac n2\rfloor}\sum\limits_{l=2i}^nf_im^{(t+1)l-2i}=\sum\limits_{i=1}^{\lfloor\frac n2\rfloor}f_im^{-2i}\sum\limits_{l=2i}^nm^{(t+1)l}$。换元记 $q=m^{t+1}$，则内层求和可以看作是 $\sum\limits_{l=2i}^nq^l=\frac{q^{2i}-q^{n+1}}{1-q}$，因此双重和式的值为 $\sum\limits_{i=1}^{\lfloor\frac n2\rfloor}f_im^{-2i}\frac{q^{2i}-q^{n+1}}{1-q}=\frac{1}{1-q}(\sum\limits_{i=1}^{\lfloor\frac n2\rfloor}f_im^{-2i}q^{2i}-q^{n+1}\sum\limits_{i=1}^{\lfloor\frac n2\rfloor}f_im^{-2i})$。

然后考虑分别算两个求和的值。第一个求和中，$m^{-2i}q^{2i}=m^{-2i}(m^{t+1})^{2i}=m^{2ti}$，因此第一项可以变为 $\sum\limits_{i=1}^{\lfloor\frac n2\rfloor}f_im^{2ti}=S(\lfloor\frac n2\rfloor,2t)$；第二个求和中 $\sum\limits_{i=1}^{\lfloor\frac n2\rfloor}f_im^{-2i}=S(\lfloor\frac n2\rfloor,-2)$。又因为 $q^{n+1}=m^{(n+1)(t+1)},\sum\limits_{l=1}^nm^{(t+1)l}=\frac{m^{t+1}-m^{(n+1)(t+1)}}{1-m^{t+1}}$，因此可得整个双重和式的值为 $S(n,t)=\frac{m^{t+1}-m^{(n+1)(t+1)}}{1-m^{t+1}}-\frac{S(\lfloor\frac n2\rfloor,2t)-m^{(n+1)(t+1)}S(\lfloor\frac n2\rfloor,-2)}{1-m^{t+1}}$，边界情况是 $S(0,t)=0$。

考虑分析一下时间复杂度。看上去很爆炸，但是考虑使用记忆化搜索来优化，设递归深度为 $dep$ 则每次递归 $n$ 的值都会除以 $2$，因此有 $dep\sim O(\log n)$。而在第 $d$ 层可能出现的不同 $t$ 值的状态也只有 $O(d)$ 级别，因此总状态数就是 $\sum\limits_{d=0}^{O(\log n)}O(d)=O(\log^2n)$ 的。每次递归内层还需要做快速幂和记忆化（需要开 `map` 维护）等操作，因此总时间复杂度可以近似看作是 $O(\log^3n)$ 级别的。

需要单独处理 $m^{t+1}\equiv 1\pmod{10^9+7}$ 的情况，这个时候不能直接套上面的公式除过去，需要做一些特殊的处理。

递推过程中可能出问题的地方有下面三类：$\frac 1m,\frac1{1-m},\frac1{1-m^{t+1}}$，考虑什么时候会出现问题：

第一类显然当且仅当 $m\equiv 0\pmod{10^9+7}$ 时会出问题，第二类显然当且仅当 $m\equiv 1\pmod{10^9+7}$ 时会出问题，第三类比较困难，可以想到如果 $m\equiv 1\pmod{10^9+7}$ 或 $m\equiv -1\pmod{10^9+7}$ 时会出问题。下面可以证明会出问题的情况只有这两类，即证明除了 $m\equiv \pm 1\pmod{10^9+7}$ 不存在其余 $m$ 满足 $m^{t+1}\equiv 1\pmod{10^9+7}$。考虑上述做法一开始递归的时候只会调用 $S(L,1)$ 和 $S(L,-2)$ 两个值，在递归的过程中会从 $S(n,t)$ 开始不停的调用 $S(\lfloor\frac n2\rfloor,2t)$ 和 $S(\lfloor\frac n2\rfloor,-2)$ 两个函数，因此所有可能取到的 $t$ 只有 $t=2^j(j\in\mathbb N)$ 和 $t=-2^j(j\in\mathbb N_+)$ 两类情况。因为递归每次回将 $n$ 除以 $2$，而题目中保证 $n\le 10^{18}$ 因此这里可能出现的 $j$ 不会超过单 $\log$ 级别也就是 $60$。

现在假设 $m\not\equiv 0\pmod{10^9+7}$，设 $m$ 在模 $10^9+7$ 意义下的乘法群中的阶是 $d$（也就是最小的满足 $m^d\equiv1\pmod{10^9+7}$ 的正整数 $d$），根据费马小定理可知 $d\mid 1000000006$，而 $1000000006$ 的质因数分解形式为 $2\times 500000003$，因此 $d$ 的所有可能取值只有 $1,2,500000003,1000000006$ 四种。

当 $d=1$ 时显然只能取 $m\equiv 1\pmod{10^9+7}$，当 $d=2$ 时有 $m^2\equiv 1\pmod{10^9+7}\land m\not\equiv 1\pmod{10^9+7}$，因此只能取 $m\equiv -1\pmod{10^9+7}$。

比较复杂的情况是 $d$ 的后两个取值。如果有 $m^{t+1}\equiv 1\pmod{10^9+7}$，则必有 $d\mid t+1$。当 $d$ 是 $500000003$ 或者 $1000000006$ 时都必然有 $500000003\mid t+1$。考虑对 $t$ 的值做分类讨论：

如果 $t=2^j$，则必须满足 $2^j+1\equiv0\pmod{500000003}$ 即 $2^j\equiv-1\pmod{500000003}$；如果 $t=-2^j$ 则必须满足 $1-2^j\equiv0\pmod{500000003}$ 即 $2^j\equiv 1\pmod{500000003}$。因为 $\operatorname{ord}_{500000003}(2)=500000002$（$500000002=2\times 41^2\times 148721$ 对三个质因子 $q\in\lbrace 2,41,148721\rbrace$ 验证都有 $2^{500000002/q}\not\equiv 1\pmod{500000003}$），因此此时必须满足 $500000002\mid j$。而 $2^j\equiv -1\pmod{500000003}$ 必须满足 $j\equiv 250000001\pmod{500000002}$。而因为在题目限制下递归满足 $j\le60$，因此不需要处理后两种情况。

现在考虑特判这三个 corner case：

+ $m\equiv 0\pmod{10^9+7}$：此时答案显然为 $0$。
+ $m\equiv 1\pmod{10^9+7}$：在模意义下只有一种字符，长度 $k\ge 3$ 的唯一序列一定满足条件，取 $l=1$ 即可。因此长度从 $3$ 到 $n$ 的序列都符合条件，答案即为 $n-2$。
+ $m\equiv-1\pmod{10^9+7}$：相对比较复杂的情况。设 $F(x)=\sum\limits_{i=1}^xf_i$，当 $m\equiv -1$ 时 $f_i=(-1)^i(1-F(\lfloor\frac i2\rfloor))$，因此对 $i\ge 1$ 有递推式 $f_{2i}=1-F(i),f_{2i+1}=F(i)-1=-f_{2i}$。因此前缀和满足 $F(2i+1)=-1,F(2i)=-F(i)$。此时再定义 $G(i)=\sum\limits_{j=1}^iF(j)$ 则因为奇数位置的 $F$ 都为 $-1$，偶数位置的 $F$ 都满足 $F(2i)=-F(i)$，因此又有递推公式 $G(x)=-\lceil\frac x2\rceil-G(\lfloor\frac x2\rfloor)$。
+ 然后考虑算答案。当 $m\equiv -1$ 时固定 $l$ 值后剩余部分的贡献为 $\sum\limits_{k=3l}^n(-1)^{k-2l}=\sum\limits_{k=3l}^n(-1)^k$，只有 $l\equiv n\pmod 2$ 时上式的值不为 $0$。此时考虑进一步分类讨论：
  + 如果 $2\mid n$ 则只需要枚举偶数 $l=2i$，最终的答案可以表示为 $\lfloor\frac L2\rfloor-G(\lfloor\frac L2\rfloor)$ 的形式，其中 $L=\lfloor\frac n3\rfloor$。
  + 如果 $2\nmid n$ 则只需要枚举奇数 $l=2i+1$，最终的答案可以表示为 $\lfloor\frac{L+1}2\rfloor-G(\lfloor\frac{L-1}2\rfloor)$ 的形式，其中 $L=\lfloor\frac n3\rfloor$。
+ 很显然 $G(n)$ 可直接递归 $O(\log n)$ 时间复杂度求解，因此该部分算答案的总时间复杂度也是 $O(\log n)$ 的。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, m;
map<pair<int, int>, int> mp;

inline int S(int n, int t) {
    if (!n) return 0;
    if (mp.count({n, t})) return mp[{n, t}];
    int a = power(m, ((t + 1) % (mod - 1) + mod - 1) % (mod - 1), mod), b = power(m, ((i128)(n + 1) * (t + 1) % (mod - 1) + mod - 1) % (mod - 1), mod);
    return mp[{n, t}] = inversion(mod + 1 - a) * (a - b - S(n / 2, t * 2) + mod * 2 + b * S(n / 2, -2) % mod) % mod;
}

inline int sumF(int n) {
    if (!n) return 0;
    return (mod + mod - sumF(n >> 1) - (n + 1) * i2 % mod) % mod;
}

inline int calc(int n) {
    if (n & 1) return ((n / 3 + 1) / 2 % mod + mod - sumF(n / 2)) % mod;
    return (n / 3 % mod + mod - sumF(n / 2)) % mod;
}

inline void sol() {
    cin >> n >> m; m %= mod;
    if (!m) cout << 0 << '\n';
    else if (m == 1) cout << (n - 2) % mod << '\n';
    else if (m == mod - 1) cout << calc(n) << '\n';
    else {
        mp.clear();
        cout << inversion((1 - m + mod) % mod) * (S(n / 3, 1) - power(m, n + 1, mod) * S(n / 3, -2) % mod + mod) % mod << '\n';
    }
}

} // namespace lowspeed_song
```
:::

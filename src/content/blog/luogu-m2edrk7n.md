---
title: "AT_ajo2024_final_c Final Exam 题解"
date: "2026-02-08T06:26:37.000Z"
link: "luogu-m2edrk7n"
categories: ["题解"]
tags: ["AtCoder", "数学", "概率与期望", "动态规划", "算法思想", "构造"]
draft: false
---

贴的 $2024$ 年的题解，今天发现洛谷搬这个题了就发出来了（）

**Hint**

> 考虑对于每一个 $F(i)$ 的值，将 $i$ 按照奇偶性分类？

**Solution**

> 首先可以暴力搜索算出每一个 $F(i)$ 的值，这是简单的，可以通过 $n\le 9$ 的部分。
>
> 然后有一个简单的 dp 思路：设 $f_{i,j}$ 表示当前在 $(i,j)$ 的概率，可以在 $O(n^2)$ 的时间复杂度内解决（其实是 $O(n^2)-O(1)$ 的）。通过 $n\le 1500$ 的分数。
>
> ----------
>
> 考虑先对于给定的 $i$ 求 $F(i)$。若存在一条路径从 $(0,0)$ 经过若干个结点走到了 $(i,j)$（$j>0$），则必然可以找到一条和这个路径每一步方向均相反的路径。考虑计算这个人分别走这两条路径概率的比值。容易发现，若当前在点 $(x,y)$（$y>0$），$y$ 的变化 $\Delta y$ 已知，则从 $(x,y)$ 走到 $(x+1,y+\Delta y)$ 的概率和从 $(x,-y)$ 走到 $(x+1,-y-\Delta y)$ 的概率相同。若 $y=0$，则若 $\Delta y=1$，则从 $(x,y)$ 走到 $(x+1,y+\Delta y)$ 的概率为 $\frac 1 3$，从 $(x,-y)$ 走到 $(x+1,-y-\Delta y)$ 的概率为 $\frac 2 3$。
>
> 显而易见的是只需要分别计数两条路径中 $y=0$ 时不同 $\Delta y$ 出现的次数即可。考虑到这两条路径因为完全对称，所以 $y=0$ 出现的次数必然相同。考虑定义 $y=0$ 时 $\Delta y=1$ 则会让 $y$ 移动到 $x$ 轴上方（简记为“上行”），$\Delta y=-1$ 则会让 $y$ 移动到 $x$ 轴下方（简记为“下行”）。因为最终 $(x,y)$ 位于 $x$ 轴上方，$(x,-y)$ 位于 $x$ 轴下方，所以可以简单证明 $(x,y)$ 中上行操作比下行操作多 $1$，$(x,-y)$ 中上行操作比下行操作少 $1$。经过这通分析之后可以发现最终移动到 $(x,y)$ 的概率是移动到 $(x,-y)$ 概率的 $\frac1 2$。
>
> 令 $P(x,y)$ 表示移动到 $(x,y)$ 的概率，则有 $\forall y>0,P(x,y)=\frac12P(x,-y)$。
>
> 于是考虑对 $n$ 做奇偶分析。因为每一次移动操作 $x,y$ 的奇偶性都会发生变化，所以说 $x+y$ 的奇偶性不会变化，均为偶数。因此若 $2\nmid n$，则经过 $n$ 次操作之后人一定不会移动到 $(n,0)$ 位置。此时答案即为 $\sum\limits_{y>0}P(n,y)$，有 $\sum\limits_{y>0}P(n,y)=\frac{1}{2}\sum\limits_{y>0}P(n,-y)$，又因为 $\sum\limits_{y\neq 0}P(n,y)=1$，所以有 $\sum\limits_{y>0} P(n,y)=\frac{1}{3}$。于是这一类情况就被解决掉了。
>
> 剩下 $2\mid n$ 的情况。同样的还有 $\sum\limits_{y>0}P(n,y)=\frac{1}{2}\sum\limits_{y>0}P(n,-y)$，但是此时 $\sum\limits_{y\neq 0}P(n,y)=1$ 不成立。所以考虑计算出 $P(n,0)$ 的答案，有 $\sum\limits_{y\neq 0}P(n,y)=1-P(n,0)$ 成立，联立上面的方程式就可以求出 $\sum\limits_{y>0}P(n,y)$ 的值。问题变为求 $P(n,0)$。显然可以 $O(n^2)$ 暴力 dp 求解，但是这和上面的做法没有本质的区别。
>
> 对于 $P(n,0)$，对于 $y\neq 0$ 的情况，由 $(x,y)$ 转移向 $(x+1,y+\Delta y)$，概率为 $\frac{1}{3}$ 和概率为 $\frac{2}{3}$ 的边出现的次数是相同的。关键就在于 $y=0$ 的时候，走了多少条 $\Delta y=-1$ 的概率为 $\frac 2 3$ 的边。这里枚举走了 $i$ 条这样的边，则简单推导后可以发现此时经过了 ${n/2}-i$ 条概率为 $\frac13$ 的边，${n/2}+i$ 条概率为 $\frac23$ 的边。其中 $0\le i\le {n/2}$。
>
> 也就是说，若 $y=0$ 时走了 $i$ 条 $\Delta y=-1$ 即概率为 $\frac23$ 的边，则对于每一条这样的路径，人这么走的概率都为 $\large(\frac13)^{\frac{n}{2}-i}\times(\frac23)^{\frac{n}{2}+i}$。新的问题是对每一个 $i$ 计数有多少条这样的路径，可以简单组合计数得到路径的数目为 $\large\binom{n}{{n/2}+i}-\binom{n}{{n/2}+i+1}$。这里认为 $x<y$ 时 $\binom{x}{y}=0$。为了方便记录这个值为 $cnt_i$。
>
> 因此答案即为 $P(n,0)=\large\sum\limits_{i=0}^{n/2}cnt_i(\frac13)^{{n/2}-i}(\frac23)^{{n/2}+i}$（$2\mid n$）。
>
> 直接暴力对每一个 $P(i,0)$（$2\mid i\land 2\le i\le n$）计数并求和，时间复杂度为 $O(n^2)$（其实是 $O(n)-O(n)$ 的，相比前面确实有了优化）。
>
> 继续优化。考虑到 $cnt_i$ 其实是一个很复杂的，对于每个 $i$ 都需要 $O(n)$ 计算的表达式，把她再次展开，得到 $P(n,0)=\large\sum\limits_{i=0}^{n/2}(\binom{n}{{n/2}+i}-\binom{n}{{n/2}+i+1})(\frac13)^{{n/2}-i}(\frac23)^{{n/2}+i}$。考虑到 $\frac13$ 和 $\frac23$ 为倍数关系，因此将 $\frac23$ 拆分为 $2$ 和 $\frac13$，得到 $P(n,0)=\large\sum\limits_{i=0}^{n/2}(\frac13)^n\times 2^i(\binom{n}{{n/2}+i}-\binom{n}{{n/2}+i+1})$，即 $P(n,0)=\large\sum\limits_{i=0}^{n/2}(\frac13)^n\times [2^i\binom{n}{{n/2}+i}-2^i\binom{n}{{n/2}+i+1}]$。其中前面的 $(\frac13)^n$ 是容易计算的，而后半部分的 $\large 2^i\binom{n}{{n/2}+i}-2^i\binom{n}{{n/2}+i+1}$ 则可以被拆为 $2^i\binom{n}{{n/2}+i}$ 和 $2^i\binom n{{n/2}+i+1}$ 两个部分。
>
> 于是考虑拆分式子，并构造下面的两个函数：$\large f(n)=\sum\limits_{i=0}^{{n/2}}2^{{n/2}+i}\binom n{{\frac n2}+i}$，$\large g(x)=\sum\limits_{i=0}^{n/2}2^{{n/2}+i+1}\binom{n}{{n/2}+i+1}$。则经过推导可以得到下面的递推式：
> $$
> \large f(i+2)=9f(i)-2^{i/2}\binom{i}{i/2}+2^{i/2+1}\binom{i}{i/2-1}, \quad 
> g(i+2)=9g(i)-2^{i/2}\binom{i}{{i/2}+1}+2^{{i/2}+1}\binom{i}{{i/2}}.
> $$
> 初始条件手算可以得到 $f_0=1,g_0=0$。
>
> 很显然这两个式子做差之后随便算一下就可以得到 $P(n,0)$ 了，这一步是容易的。剩下的只需要预处理幂次和组合数，显然可以通过线性求逆元等方式做到 $O(n)$。于是总时间复杂度为 $O(n)$，可以通过该题。

**Code**

```cpp
#pragma GCC optimize(3)
#pragma GCC optimize("Ofast")
#pragma GCC optimize("inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 10000100, mod = 998244353;
int n, fac[N], inv[N], ifac[N], pw2[N], pw3[N], f[N], g[N];
int binom(int x, int y) {
    if (y < 0 || x < y) return 0;
    return fac[x] * ifac[y] % mod * ifac[x - y] % mod;
}
signed main() {
    cin.tie(0)->sync_with_stdio(0);
    cin >> n;
    for (int i = 0; i < 2; ++i) fac[i] = inv[i] = ifac[i] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
    pw2[0] = pw3[0] = 1;
    for (int i = 1; i < N; ++i) {
        pw2[i] = pw2[i - 1] * 2 % mod;
        pw3[i] = pw3[i - 1] * 3 % mod;
    }
    f[0] = 1, g[0] = 0;
    for (int i = 0; i + 2 < N; i += 2) {
        f[i + 2] = (f[i] * 9 % mod - binom(i, i / 2) * pw2[i >> 1] % mod + binom(i, i / 2 - 1) * pw2[i / 2 + 1] % mod + mod) % mod;
        g[i + 2] = (g[i] * 9 % mod - binom(i, i / 2 + 1) * pw2[i >> 1] % mod + binom(i, i / 2) * pw2[i / 2 + 1] % mod + mod) % mod;
    }
    int i3 = inv[3], s = 0; 
    for (int i = 1; i <= n; ++i) {
        int qz = (1'000'000'000'000'000'000 / i) % mod;
        if (i & 1) s = (s + pw3[i - 1] * qz % mod) % mod;
        else s = (s + (g[i] - f[i] + mod + pw3[i]) * i3 % mod * qz % mod) % mod;
    }
    cout << s << '\n';
    return 0;
}
```

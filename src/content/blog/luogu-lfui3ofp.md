---
title: "P9535 [YsOI2023] 连通图计数 题解"
date: "2026-02-07T00:58:45.000Z"
link: "luogu-lfui3ofp"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "数学", "组合数学"]
draft: false
---

难度：$6/10$

注意到有 $m\in\lbrace n-1,n,n+1\rbrace$，容易想到对 $m$ 的值分类讨论处理：

## 1. $m=n-1$

此时图的形态是一棵树，显然有 $a_i=\deg(i)$。而度数问题容易想到在 Prufer 序列上考虑：度数为 $a_i$ 的结点在 Prufer 序列上会出现 $a_i-1$ 次，因此简单组合计数可得答案为：

$$
\frac{(n-2)!}{\prod\limits_{i=1}^n(a_i-1)!}
$$

## 2. $m=n$

考虑到图是简单连通图，因此图的形态必然是一个基环树。考虑对每个结点而言，$a_i$ 的值和 $\deg(i)$ 之间的关联：

+ 若 $i$ 号结点不在环上，那么必然有 $\deg(i)=a_i$。
+ 若 $i$ 号结点在环上，那么必然有 $\deg(i)=a_i+1$（无法影响环两侧之间点的连通关系）。

而又因为有 $\sum\limits_{i=1}^n\deg(i)=2n$，所以简单作差之后可得环上点的数目为 $2n-\sum\limits_{i=1}^na_i$。此时考虑建圆方树的经典套路，找出环之后把环上所有点之间相互的连边全部删去，然后建一个新点连接环上原来所有的点。此时得到了原图的一个圆方树。考虑这步操作对答案产生的影响：这样会导致环上所有点之间原有的连边关系消失，即无法唯一确定原有的环上连边顺序。根据环排列可知一个方点连的边对应到原图上有 $\frac{(2n-\sum\limits_{i=1}^na_i-1)!}2$ 种不同连边方法。此时剩下一个有 $n+1$ 个结点构成的圆方树，根据 $m=n-1$ 时的讨论可知剩余部分的答案为 $\frac{(n-1)!}{2\prod\limits_{i=1}^n(a_i-1)}$。乘法原理可得最终答案为：

$$
\frac{(n-1)!}{2\prod\limits_{i=1}^n(a_i-1)!}
$$

## 3. $m=n+1$

考虑到图是简单连通图，因此图的形态必然是树加上两条边即一个有恰好两个环的图。此时图没有基环树那么好的性质，但是因为环的数量很少，所以考虑从这里突破问题，即讨论环之间的关系：

### 3.1 两个环之间没有公共边

和之前 $2$ 部分的做法差不多？此时两个环之间互相独立，因此同样考虑建圆方树，找出两个环，然后分别对两个环建方点。考虑到两个环上一共有 $2n+2-\sum\limits_{i=1}^na_i$ 个结点，因此容易想到枚举第一个环上有 $k$ 个结点，那么第二个环上就有 $2n+2-\sum\limits_{i=1}^na_i-k$ 个结点。在不考虑环的情况下，生成树数量就是 $\frac{n!}{\prod\limits_{i=1}^n(a_i-1)}$，而此时生成树上又多了两个环，所以需要根据环排列来重新更改式子得到：$\frac{n!}{\prod\limits_{i=1}^n(a_i-1)(k-1)!(2n-\sum\limits_{i=1}^na_i+1-k)}$。为了方便，之后记 $p=2n+2-\sum\limits_{i=1}^na_i-k$，则上式又可以写作：$\frac{n!}{\prod\limits_{i=1}^n(a_i-1)!(k-1)!(p-1)!}$。

但是此时仍然存在问题：很显然在圆方树上方点和方点之间是不能相邻的，所以此时必须保证 $n+1,n+2$ 两个点之间没有边相连。直接做是困难的，所以考虑容斥处理，强制钦定两个点之间有边相连。考虑经典套路把 $n+1,n+2$ 两个点看做是同一个点，那么此时该点的度数即为 $k+p-2$。此时根据 $2$ 部分的结果可知生成树数量为 $\frac{(n-1)!}{\prod\limits_{i=1}^n(a_i-1)!(k+p-3)!}\binom{k+p-2}{k-1}$。容斥掉这个部分，总的答案即为 $\frac{n!}{\prod\limits_{i=1}^n(a_i-1)!(k-1)!(p-1)!}-\frac{(n-1)!}{\prod\limits_{i=1}^n(a_i-1)!(k+p-3)!}\binom{k+p-2}{k-1}$。因为有 $p+k=2n+2-\sum\limits_{i=1}^na_i$，所以上面的答案又可以被表示为 $\frac{n!}{\prod\limits_{i=1}^n(a_i-1)!(k-1)!(p-1)!}-\frac{(n-1)!}{\prod\limits_{i=1}^n(a_i-1)!(2n-1-\sum\limits_{i=1}^na_i)!}\binom{2n-\sum\limits_{i=1}^na_i}{k-1}=\frac{(n-1)!(2n-\sum\limits_{i=1}^na_i-3)(\sum\limits_{i=1}^na_i-n)}{8\prod\limits_{i=1}^n(a_i-1)!}$。

### 3.2 两个环之间有公共边

容易注意到此时两个环最多有一段连续的公共边。考虑继续对点在图上的位置做分类讨论，然后计算其 $a_i$ 和 $\deg(i)$ 的关系：

+ 若 $i$ 点不在任何一个环上，那么有 $a_i=\deg(i)$。
+ 若 $i$ 点恰好在一个环上，那么有 $a_i=\deg(i)-1$。
+ 若 $i$ 点同时在两个环上，那么有 $a_i=\deg(i)-2$。

而又因为有 $\sum\limits_{i=1}^n\deg(i)=2n$，所以简单作差之后可得环上点的数目为 $2n-\sum\limits_{i=1}^na_i$。此时同样考虑建圆方树，两个环之间有公共边就代表她们整体形成了一个点双联通分量，那么建圆方树的时候就只需要建 $n+1$ 号点同时连向两个环上的所有点，然后把两个环之间所有边全部删去，那么该点的度数即为 $2n-\sum\limits_{i=1}^na_i$。此时先不考虑是否合法，总共可以得到的树的数量即为 $\frac{(n-1)!}{\prod\limits_{i=1}^{n+1}(a_i-1)!}$。然后考虑在所有圆点中选出两个点使得她们之间的连边恰好组成了两个环之间的公共边，方案数很显然就是 $\binom{2n-\sum\limits_{i=1}^na_i}2$。考虑什么时候这两个点在图上确实满足条件：显然当且仅当这两个点在图上有恰好三条简单路径可以连接。

然后再考虑剩下的 $2n-\sum\limits_{i=1}^na_i-2$ 个点划分成三条链的方案数。为了方便，记 $u=2n-\sum\limits_{i=1}^na_i$。因为链和链之间是不区分的，所以该部分的方案数就是：$\frac{(u-2)!(\binom u2-3)}{3!}$。根据乘法原理，把三个部分的答案相乘，可知总方案数就是 $\frac{(n-1)!u(u-3)(u+2)}{24\prod\limits_{i=1}^n(a_i-1)!}$，也就是 $\large\frac{(n-1)!(2n-\sum\limits_{i=1}^na_i)(2n-\sum\limits_{i=1}^na_i-3)(2n-\sum\limits_{i=1}^na_i+2)}{24\prod\limits_{i=1}^n(a_i-1)!}$。

把两种情况得到的答案相加，就可得到该情况的总方案数。总时间复杂度为 $O(n)$ 可通过该题。

```cpp line-numbers
namespace Loyalty
{
    int a[N], fac[N], inv[N], ifac[N];
    inline void init()
    {
        for (int i = 0; i < 2; ++i)
            fac[i] = inv[i] = ifac[i] = 1;
        for (int i = 2; i < N; ++i)
        {
            fac[i] = fac[i - 1] * i % mod;
            inv[i] = mod - inv[mod % i] * (mod / i) % mod;
            ifac[i] = ifac[i - 1] * inv[i] % mod;
        }
    }
    inline int binom(int a, int b)
    {
        if (b < 0 || a < b)
            return 0;
        return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
    }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n, m;
        cin >> n >> m;
        for_each(a + 1, a + n + 1, [&](auto &input) { cin >> input; });
        if (m == n - 1)
        {
            int product = 1;
            for (int i = 1; i <= n; ++i)
                product = product * fac[a[i] - 1] % mod;
            cout << fac[n - 2] * inversion(product) % mod << '\n';
        }
        else if (m == n)
        {
            int product = 2;
            for (int i = 1; i <= n; ++i)
                product = product * fac[a[i] - 1] % mod;
            cout << fac[n - 1] * inversion(product) % mod << '\n';
        }
        else
        {
            int product = 1;
            for (int i = 1; i <= n; ++i)
                product = product * fac[a[i] - 1] % mod;
            product = inversion(product);
            const int i8 = inversion(8), i24 = inversion(24);
            int sum = accumulate(a + 1, a + n + 1, 0ll);
            int v1 = fac[n - 1] * (n + n - sum - 3) % mod * (sum - n) % mod * i8 % mod * product % mod;
            int v2 = fac[n - 1] * (n + n - sum) % mod * (n + n - sum - 3) % mod * (n + n - sum + 2) % mod * i24 % mod * product % mod;
            cout << (v1 + v2) % mod << '\n';
        }
    }
} // namespace Loyalty
```

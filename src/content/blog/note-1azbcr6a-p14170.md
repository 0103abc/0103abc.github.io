---
title: "P14170 二分图最大匹配期望 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p14170"
categories: ["题解"]
tags: ["洛谷", "数学", "概率与期望", "图论", "二分图匹配", "基础算法", "二分"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P14170).
:::

:::info[Solution]{open}
先回顾一下 Hall 定理：

> 对一张二分图 $G$ 而言，设其左部点集合为 $V_1$，右部点集合为 $V_2$，则其存在大小为 $|V_1|$ 的最大匹配当且仅当 $\forall S\subseteq V_1\Longrightarrow |S|\le |N(S)|$。

这里给出 Hall 定理的一个推论；

> 对一张二分图 $G$，设其左部点集合为 $V_1$，右部点集合为 $V_2$，则其最大匹配大小为 $|V_1|-\max\limits_{S\subseteq V_1}(|S|-|N(S)|)$。

对一个左部点集合 $S$，考虑记 $v(S)=|S|-|N(S)|$，则上面的最大匹配大小可以被表示为 $|V_1|-\max\limits_{S\subseteq V_1}v(S)$，因此问题可以被转化为求 $\max\limits_{S\subseteq V_1}v(S)$ 的期望值是多少。

考虑对一个二分图，记这个二分图的**好集合**为其左部点集合的所有子集中，满足 $\max\limits_{S\subseteq V_1}v(S)=v(S)$ 的集合 $S$。然后再定义**极好集合**为该二分图的所有**好集合**中，大小最小的集合。可以证明对任意二分图，都恰好存在一个**极好集合**。具体的：若两个不同的集合 $A,B$ 都是**极好集合**，则其交集 $A\cap B$ 也必然是**极好集合**，而显然有 $|A\cap B|\le\min(|A|,|B|)$。

然后考虑 dp。设 $f_{S,T}$ 表示只考虑 $S,T$ 两个点集内的点，以及一端在 $S$ 集合内一端在 $T$ 集合内的边时，把这张图看作是一个以 $S$ 集合为左部点，$T$ 集合为右部点的二分图中，若 $S$ 集合的邻域恰好为 $T$ 集合，而且存在一个匹配使得 $S$ 集合中所有点都能匹配到 $T$ 集合中的不同点的概率是多少；$g_{S,T}$ 表示在上面的条件下，$S$ 集合是该生成二分图的**极好集合**的概率是多少。

初始条件显然是 $f_{0,0}=g_{0,0}=1$。

为了方便转移，这里记 $all_{S,T}$ 表示在上面的条件下，$T$ 集合中的每个点都至少被 $S$ 集合中某个点连到的概率是多少；$noth_{S,T}$ 表示在上面的条件下，$T$ 集合中的每个点都无法被 $S$ 集合中的任意一个点连到的概率是多少。这两个东西是好处理的。具体来说：

+ $noth_{S,T}$ 是十分容易的，每条边的贡献都是独立的，因此直接乘起来可得 $noth_{S,T}=\prod\limits_{i\in S\land j\in T}(1-p_{i,j})$。
+ $all_{S,T}$ 也不是很困难，考虑容斥，对某个点 $j\in T$ 其不被 $S$ 集合中任意一个点连到的概率为 $noth_{S,2^j}$。然后不同右端点直接也是互相独立的，因此同样可以直接相乘，得到 $all_{S,T}=\prod\limits_{j\in T}(1-noth_{S,2^j})$。

然后考虑转移 $f,g$ 两个 dp 数组。

先考虑第一个条件：$S$ 点集的邻域恰好为 $T$，概率显然是 $all_{S,T}$。然后考虑容斥算不合法概率，如果某张图不能把 $S$ 完全匹配，则其必然满足 $\max\limits_{S'\subseteq S}v(S')\neq 0$。取该左部点集唯一的**极好集合** $A\subseteq S$ 然后再设 $B\subseteq T$ 是 $A$ 集合的邻域，则此时一定有 $|A|>|B|$。$A$ 是左部点集唯一的**极好集合**的概率就是 $g_{A,B}$，然后还需要保证 $B$ 集合是 $A$ 集合的完整邻域，所以 $A$ 集合不能有边连向 $T\backslash B$，概率就是 $noth_{A,T\backslash B}$。删掉 $A,B$ 两个点集后，剩下的部分 $S\backslash A$ 必须能完全匹配到 $T\backslash B$，所以还需要额外乘 $f_{S\backslash A,T\backslash B}$。

总结一下，$f$ 数组的转移就是 $f_{S,T}=all_{S,T}-\sum\limits_{A,B}g_{A,B}\times f_{S\backslash A,T\backslash B}\times noth_{A,T\backslash B}$，限制条件是 $A\subseteq S,B\subseteq T,|A|>|B|$。

然后考虑转移 $g$ 数组。同样先从邻域恰好为 $T$ 的图开始，也就是 $all_{S,T}$。同样考虑容斥，如果 $S$ 集合不是**极好集合**，则说明其一定存在一个真子集 $A\subset S$ 为**极好集合**。设 $A$ 集合的邻域为 $B$，则为了让 $S$ 不是**极好集合**，必须有 $|A|-|B|\ge d$。确定 $A,B$ 两个集合后，同样还是分开算贡献，$A$ 集合成为**极好集合**的概率为 $g_{A,B}$，然后 $A$ 集合不能有边连向 $T\backslash B$，概率为 $noth_{A,T\backslash B}$，剩下的 $S\backslash A$ 必须能够完全匹配到 $T\backslash B$ 所以还需要额外乘 $f_{S\backslash A,T\backslash B}$。

总结一下，$g$ 数组的转移就是 $g_{S,T}=all_{S,T}-\sum\limits_{A,B}g_{A,B}\times f_{S\backslash A,T\backslash B}\times noth_{A,T\backslash B}$，不一样的地方是限制条件为 $A\subset S,B\subseteq T,|A-|B|\ge |S|-|T|$。

转移这两个数组的时候直接一起转移即可。

最后考虑怎么统计答案。设整张图的**极好集合**为 $S$，$S$ 集合在整张图中的邻域集合为 $T$，则此时 $\max\limits_{S'\subseteq S}v(S)=|S|-|T|$ 因此该图的最大匹配大小就是 $n-|S|+|T|$。为了保证 $S$ 在整张图上的邻域恰好还是 $T$ 集合，需要保证 $S$ 集合不连向 $U_R\backslash T$ 集合，因此概率需要乘 $noth_{S,U_R\backslash T}$。然后考虑剩下的左部点部分 $U_L\backslash S$，她们必须能够值用二分图右部点中的剩余点 $U_R\backslash T$ 来完全匹配。一位内不知道具体连到了哪些剩余的右部点，因此考虑再次枚举这个邻域 $T'\subseteq U_R\backslash T$。这个部分邻域恰好为 $T'$ 且能够完全匹配的概率是 $f_{U_L\backslash S,T'}$，同时还需要保证这些点都不连向集合 $U_R\backslash T\backslash T'$ 因此还需要额外乘以 $noth_{U_L\backslash S,U_R\backslash T\backslash T'}$。

总结一下，这一类二分图度对答案的贡献可以表示为 $g_{S,T}\times noth_{S,U_R\backslash T}\times f_{U_L\backslash S,T'}\times noth_{U_L\backslash S,U_R\backslash T\backslash T'}\times (n-|S|+|T|)$。枚举所有的集合 $S,T,T'$ 然后把所有贡献相加即可得到最终的答案。

该算法的时间复杂度为 $O(3^{n+m})$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int p[610][610], tmp[610][610], all[610][610], noth[610][610], cnt[610], f[610][610], g[610][610];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m; cin >> n >> m;
    const int inv100 = inversion(100);
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < m; ++j) cin >> p[i][j], p[i][j] = p[i][j] * inv100 % mod;
    for (int i = 0; i < n; i++) {
        tmp[i][0] = 1;
        for (int t = 1; t < (1 << m); ++t) {
            int j = __builtin_ctz(t);
            tmp[i][t] = tmp[i][t ^ (1 << j)] * (1 - p[i][j] + mod) % mod;
        }
    }
    for (int t = 0; t < (1 << m); ++t) noth[0][t] = 1;
    for (int s = 1; s < (1 << n); ++s) {
        int i = __builtin_ctz(s), pre = s ^ (1 << i);
        for (int t = 0; t < (1 << m); ++t) noth[s][t] = noth[pre][t] * tmp[i][t] % mod;
    }
    for (int s = 0; s < (1 << n); ++s) {
        all[s][0] = 1;
        for (int t = 1; t < (1 << m); ++t) {
            all[s][t] = 1;
            for (int S = t; S; S = (S - 1) & t) all[s][t] = (all[s][t] + mod - all[s][t ^ S] * noth[s][S] % mod) % mod;
        }
    }
    for (int s = 0; s < (1 << n); ++s)
        for (int t = 0; t < (1 << m); ++t) f[s][t] = g[s][t] = 0;
    f[0][0] = g[0][0] = 1;
    for (int s = 1; s < (1 << n); ++s) {
        for (int t = 0; t < (1 << m); ++t) {
            if (__builtin_popcount(s) > __builtin_popcount(t)) {
                g[s][t] = all[s][t];
                for (int a = (s - 1) & s; ; a = (a - 1) & s) {
                    for (int b = t; ; b = (b - 1) & t) {
                        if (__builtin_popcount(a) - __builtin_popcount(b) >= __builtin_popcount(s) - __builtin_popcount(t)) g[s][t] = (g[s][t] + mod - g[a][b] * f[s ^ a][t ^ b] % mod * noth[a][t ^ b] % mod) % mod;
                        if (!b) break;
                    } if (!a) break;
                }
            } else {
                f[s][t] = all[s][t];
                for (int a = s; a; a = (a - 1) & s)
                    for (int b = t; ; b = (b - 1) & t) {
                        if (__builtin_popcount(a) > __builtin_popcount(b)) f[s][t] = (f[s][t] + mod - g[a][b] * f[s ^ a][t ^ b] % mod * noth[a][t ^ b] % mod) % mod;
                        if (!b) break;
                    }
            }
        }
    }
    int res = 0;
    for (int s = 0; s < (1 << n); ++s)
        for (int t = 0; t < (1 << m); ++t)
            for (int t0 = (((1 << m) - 1) ^ t);; t0 = (t0 - 1) & (((1 << m) - 1) ^ t)) {
                res = (res + g[s][t] * noth[s][(((1 << m) - 1) ^ t)] % mod * f[((1 << n) - 1) ^ s][t0] % mod * noth[((1 << n) - 1) ^ s][(((1 << m) - 1) ^ t) ^ t0] % mod * (n - __builtin_popcount(s) + __builtin_popcount(t)) % mod) % mod;
                if (!t0) break;
            }
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

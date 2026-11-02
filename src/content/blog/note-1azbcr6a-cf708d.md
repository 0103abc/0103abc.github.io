---
title: "CF708D Incorrect Flow 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf708d"
categories: ["题解"]
tags: ["Codeforces", "图论", "网络流"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF708D).
:::

:::info[Solution]{open}
好玩的来了。

考虑对于一条 $u\to v$ 的边，其初始给定的容量为 $c$，流量为 $f$，则需要分类讨论 $c$ 和 $f$ 之间的大小关系：

#### $f\le c$

此时当前的容量是合法的，有下面的几种操作方式：

+ 减少流量：每减少 $1$ 就需要让 $f$ 减少 $1$，花费 $1$ 的代价。本质可以看作是撤销原来一单位的 $u\to v$ 流量，也就是让费用流沿着反方向 $v\to u$ 走一单位。边的容量为 $f$，费用为 $1$。
+ 增加流量，但是不超过 $c$：每增加 $1$ 就需要让 $f$ 增加 $1$，花费 $1$ 的代价。$u\to v$ 的边容量为 $c-f$ 费用为 $1$。
+ 增加流量且超过 $c$：容量和费用都需要增加 $1$，因此花费 $2$ 的代价。$u\to v$ 的边容量为 $+\infin$ 费用为 $2$。

#### $f>c$

这条边初始就不合法，因此需要先花费 $f-c$ 的代价平衡容量和流量，然后再进行操作。同样需要分类讨论：

+ 首先需要把前 $f-c$ 单位的流量退流，连一条 $v\to u$ 容量为 $f-c$ 费用为 $0$ 的边，然后提前增加 $f-c$ 的代价即可。
+ 然后如果要继续退流，则每单位的代价为 $1$，连一条 $v\to u$ 容量为 $c$ 费用为 $1$ 的边即可。
+ 如果要增加流量，则每单位的代价为 $2$，连一条 $u\to v$ 容量为 $+\infin$ 费用为 $2$ 的边即可。

然后还需要考虑流量不守恒的问题。记 $d_i$ 表示 $i$ 点当前的出流减去当前的入流是多少。则对于一条边 $u\to v$ 而言，初始先更新 $d_u\leftarrow d_u+f,d_v\leftarrow d_v-f$。处理完后如果 $d_i<0$ 则说明这个点流进来的流量太多了，因此从超级源点 $S$ 向 $i$ 点连一条容量为 $-d_i$ 费用为 $0$ 的边即可；如果 $d_i>0$ 则说明这个点流出的流量太多了，因此从 $i$ 点向超级汇点 $T$ 连一条容量为 $d_i$ 费用为 $0$ 的边即可。

因为 $1$ 号点和 $n$ 号点不要求流量守恒，所以额外加一条从 $n$ 号结点连向 $1$ 号结点的流量为 $+\infin$ 费用为 $0$ 的边即可。

最后算答案只需要跑一遍从 $S$ 点到 $T$ 点的最小费用最大流，然后求出最小的费用就是答案。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

namespace MCMF {

int S, T, hhh[N], e[N], f[N], ne[N], w[N], idxx, q[N], d[N], pre[N], incf[N], st[N];
inline void ae(int a, int b, int c, int d) {
    e[idxx] = b, w[idxx] = d, f[idxx] = c, ne[idxx] = hhh[a], hhh[a] = idxx++;
    e[idxx] = a, w[idxx] = -d, f[idxx] = 0, ne[idxx] = hhh[b], hhh[b] = idxx++;
}
inline int spfa() {
    int hh = 0, tt = 1;
    memset(d, 0x3f, sizeof d);
    memset(incf, 0, sizeof incf);
    q[0] = S, d[S] = 0, incf[S] = inf;
    while (hh != tt) {
        int t = q[hh++];
        if (hh == N) hh = 0;
        st[t] = 0;
        for (int i = hhh[t]; ~i; i = ne[i]) {
            int v = e[i];
            if (f[i] && d[v] > d[t] + w[i]) {
                d[v] = d[t] + w[i];
                pre[v] = i, incf[v] = min(incf[t], f[i]);
                if (!st[v]) {
                    q[tt++] = v;
                    if (tt == N) tt = 0;
                    st[v] = 1;
                }
            }
        }
    }
    return incf[T] > 0;
}
inline void ek(int &F, int &C) {
    F = C = 0;
    while (spfa()) {
        int tt = incf[T];
        F += tt, C += tt * d[T];
        for (int i = T; i != S; i = e[pre[i] ^ 1]) f[pre[i]] -= tt, f[pre[i] ^ 1] += tt;
    }
}
}

int d[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m; cin >> n >> m;
    memset(MCMF::hhh, -1, sizeof MCMF::hhh);
    int res = 0;
    while (m--) {
        int u, v, c, f; cin >> u >> v >> c >> f, d[u] += f, d[v] -= f;
        if (f <= c) MCMF::ae(v, u, f, 1), MCMF::ae(u, v, c - f, 1), MCMF::ae(u, v, inf, 2);
        else res += f - c, MCMF::ae(v, u, f - c, 0), MCMF::ae(v, u, c, 1), MCMF::ae(u, v, inf, 2);
    } MCMF::ae(n, 1, inf, 0), MCMF::S = n + 1, MCMF::T = n + 2;
    for (int i = 1; i <= n; ++i)
        if (d[i] > 0) MCMF::ae(i, MCMF::T, d[i], 0);
        else if (d[i] < 0) MCMF::ae(MCMF::S, i, -d[i], 0);
    int F, C; MCMF::ek(F, C);
    cout << res + C << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：8

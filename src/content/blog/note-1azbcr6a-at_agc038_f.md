---
title: "AT_agc038_f [AGC038F] Two Permutations 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-at_agc038_f"
categories: ["题解"]
tags: ["AtCoder", "图论", "网络流"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/AT_agc038_f).
:::

:::info[Solution]{open}
套路的在置换环的角度下考虑。把 $p$ 这个排列看作是若干个置换环，则对一个长度大于 $1$ 的环如哦 $A$ 想要保持为排列则要么整个环全都取 $A_i=i$ 要么全都取 $A_i=P_i$。容易证明不存在第三种情况。$q$ 排列也是同理的。

因此可以看作是给每个置换环设一个布尔变量。对 $p$ 排列而言定义 $x_C$ 布尔变量：若 $C$ 环中所有元素都取的 $A_i=i$ 则记 $x_C=1$，否则记 $x_C=0$。对 $q$ 排列的定义和对 $p$ 排列的相反，若 $C$ 环中所有元素都取得 $A_i=i$ 则 $y_C=0$，否则 $y_C=1$。

最大化 $A_i\neq B_i$ 的数量等价于最小化 $A_i=B_i$ 的数量。因此考虑枚举所有的位置 $i$ 考虑其什么时候满足 $A_i=B_i$。设 $x$ 是 $i$ 所在的 $p$ 环变量，$y$ 是 $j$ 所在的 $q$ 环变量，则可以直接分类讨论：

+ 若 $P_i=Q_i=i$ 则不管怎样都只能有 $A_i=B_i=i$。
+ 若 $P_i=i,Q_i\neq i$ 则此时 $A_i$ 的值永远只能是 $i$，$B_i=i$ 当且仅当 $Q$ 环不动也就是 $y=0$。因此此时 $A_i=B_i$ 当且仅当 $y=0$。产生一个一元费用 $c_{y,0}=1$，连边 $y\to T$，边的容量为 $1$。
+ 若 $P_i\neq i,Q_i=i$ 则情况和前面的正好相反，此时产生一元费用 $c_{x,1}=1$，连边 $S\to x$，边的容量为 $1$。
+ 然后考虑复杂的二元关系。如果 $P_i\neq Q_i$ 而且有 $P_i\neq i,Q_i\neq i$ 则如果想要让 $A_i=B_i$ 必须满足两边都取到 $i$ 也就是 $x=1,y=0$。因此费用表中只有 $c_{1,0}=1$。因为 $c_{1,0}$ 可以用反向边来表示，因此连一条 $y\to x$，容量为 $1$ 的边即可。
+ 最后剩下 $P_i=Q_i\neq i$ 的情况。此时 $(x,y)=(1,0)$ 或者 $(x,y)=(0,1)$ 都是可以产生贡献的 $(x,y)$ 组。费用表中有 $c_{0,1}=c_{1,0}=1$，因此直接连边 $x\to y$ 和 $y\to x$，两条边的容量都是 $1$ 即可。

跑一遍 dinic 然后用 $n$ 减去 dinic 的最大流再减去初始满足 $P_i=Q_i=i$ 的 $i$ 的位置即可。 
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

namespace Flow {

int S, T, dep[N], cur[N];
struct edg {
    int e, f, o;
    edg(int a, int b) { e = a, f = b, o = 0; }
} ; vector<edg> adj[N];
inline void link(int s, int e, int f) {
    adj[s].push_back({edg(e, f)}), adj[e].push_back(edg(s, 0));
    int s1 = adj[s].size() - 1, s2 = adj[e].size() - 1;
    adj[s][s1].o = s2, adj[e][s2].o = s1;
}
inline bool bfs() {
    queue<int> q;
    memset(dep, 0, sizeof dep), memset(cur, 0, sizeof cur);
    dep[S] = 1, q.emplace(S);
    while (q.size()) {
        int p = q.front(); q.pop();
        for (auto &[r, f, _] : adj[p]) if (f && !dep[r]) {
            dep[r] = dep[p] + 1, q.emplace(r);
            if (r == T) return 1;
        }
    } return 0;
}
inline int dfs(int p, int f) {
    if (p == T) return f;
    int s = 0;
    for (int &i = cur[p]; i < adj[p].size(); ++i) {
        if (!f) break;
        int q = adj[p][i].e, fx = adj[p][i].f;
        if (fx && dep[p] + 1 == dep[q]) {
            int delta = dfs(q, min(f, fx));
            if (!delta) continue;
            adj[p][i].f -= delta, adj[q][adj[p][i].o].f += delta;
            f -= delta, s += delta;
        }
    }
    return s ? s : (dep[p] = 0);
}
inline int dinic() {
    int s = 0;
    while (bfs()) s += dfs(S, inf);
    return s;
}

} // namespace Flow

int a[N], b[N], p[N], q[N], pid[N], qid[N], idx;

inline void sol([[maybe_unused]]int __testcase_id) {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i], ++a[i];
    for (int i = 1; i <= n; ++i) cin >> b[i], ++b[i];
    int res = n;
    for (int i = 1; i <= n; ++i) {
        if (!p[i]) {
            p[i] = i;
            for (int j = a[i]; j != i; j = a[j]) p[j] = i;
            if (a[i] != i) pid[i] = ++idx;
        } if (!q[i]) {
            q[i] = i;
            for (int j = b[i]; j != i; j = b[j]) q[j] = i;
            if (b[i] != i) qid[i] = ++idx;
        }
    } Flow::S = N - 1, Flow::T = N - 2;
    for (int i = 1; i <= n; ++i) {
        if (a[i] == b[i] && a[i] == i) --res;
        else if (a[i] == i && b[i] != i) Flow::link(Flow::S, qid[q[i]], 1);
        else if (a[i] != i && b[i] == i) Flow::link(pid[p[i]], Flow::T, 1);
        else if (a[i] == b[i]) Flow::link(pid[p[i]], qid[q[i]], 1), Flow::link(qid[q[i]], pid[p[i]], 1);
        else Flow::link(pid[p[i]], qid[q[i]], 1);
    } // cerr << "!!!\n";
    cout << res - Flow::dinic() << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：8

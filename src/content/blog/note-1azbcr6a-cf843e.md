---
title: "CF843E Maximum Flow 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf843e"
categories: ["题解"]
tags: ["Codeforces", "图论", "网络流", "算法思想", "构造"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF843E)
:::

:::info[Solution]{open}
特别神秘的题目。考虑最大流的残量网络。设从源点 $S$ 从残量网络中能到达的点集为 $S$ 类点，其余点位 $T$ 类点。因为当前流是最大流所以 $T$ 点必然是 $T$ 类点。

考虑最小割建模。对一条原边 $u\to v$，如果 $g=0$ 则必有 $f=0$。因为容量为正，因此正向的残量为 $c-f>0$。因此如果有 $u\in S$ 则必有 $v\in S$。此时必然不能出现 $u\in S,v\in T$。为了禁止这种割法在最小割图中建立一条 $u\to v$，容量为 $+\infin$ 的边即可。

如果 $g=1$ 则必有 $f>0$。残量网络中一定存在一个容量为 $f$ 的反向便 $v\to u$ 因此此时不能出现 $v\in S,u\in T$。为了禁止这种割法在最小割图中建立一条 $u\to v$ 的容量为 $+\infin$ 的边即可。而此时如果有 $u\in S,v\in T$ 则残量网络中正向残量必须为 $0$，因此此时必然有 $c=f$ 即这条边必然是满流边。因此还需要额外建立一条 $u\to v$ 容量为 $1$ 的边，这样最小割每割掉一条这样的边就对应了一条满流变，因此最小割的大小就是最少的满流边的数量。

对着这个最小割图跑一遍 dinic 得到该图的残量网络，然后还可以得到最小割两侧的点集 $S,T$。考虑怎么具体构造出每条边的流量。

对 $g=0$ 的边直接设该边的流量为 $0$ 即可。

对 $g=1$ 的边，需要先保证流量是正整数，因此先给每条这样的边设置下界 $1$，问题变为一个有下界可行流。考虑先给每条 $g=1$ 的边强制放入 $1$ 单位的流量，然后用超级源点和超级汇点补齐流量平衡，再加入一条 $t\to s$ 的边以处理 $s,t$ 两个点不需要处理流量守恒的问题跑依次可行流即可得到 $g=1$ 边的实际流量。具体建模方法和上一个题是几乎完全一样的，这里就不再赘述了。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

// 最小费用可行流
namespace MF {

int S, T, hhh[N], e[N], f[N], ne[N], idxx, q[N], dep[N], cur[N];
inline void init() { memset(hhh, -1, sizeof hhh), idxx = 0; }
inline int ae(int a, int b, int c) {
    int id = idxx;
    e[idxx] = b, f[idxx] = c, ne[idxx] = hhh[a], hhh[a] = idxx++;
    e[idxx] = a, f[idxx] = 0, ne[idxx] = hhh[b], hhh[b] = idxx++;
    return id;
}
inline int bfs() {
    int hh = 0, tt = 0;
    memset(dep, -1, sizeof dep);
    q[tt++] = S, dep[S] = 0;
    while (hh < tt) {
        int u = q[hh++];
        for (int i = hhh[u]; ~i; i = ne[i]) {
            int v = e[i];
            if (f[i] && !~dep[v]) dep[v] = dep[u] + 1, q[tt++] = v;
        }
    }
    return dep[T] != -1;
}
inline int dfs(int u, int lim) {
    if (u == T) return lim;
    for (int &i = cur[u]; ~i; i = ne[i]) {
        int v = e[i];
        if (f[i] && dep[v] == dep[u] + 1) {
            int x = dfs(v, min(lim, f[i]));
            if (x) {
                f[i] -= x, f[i ^ 1] += x;
                return x;
            }
        }
    } return 0;
}

inline int dinic(int s, int t) {
    S = s, T = t;
    int res = 0, x;
    while (bfs()) {
        memcpy(cur, hhh, sizeof hhh);
        while ((x = dfs(S, inf))) res += x;
    }
    return res;
}
inline void reach(int u, int *vis) {
    vis[u] = 1;
    for (int i = hhh[u]; ~i; i = ne[i])
        if (f[i] && !vis[e[i]]) reach(e[i], vis);
}
}

int d[N], u[N], v[N], g[N], id[N], vis[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m, s, t; cin >> n >> m >> s >> t; MF::init();
    for (int i = 1; i <= m; ++i) {
        cin >> u[i] >> v[i] >> g[i];
        if (!g[i]) MF::ae(u[i], v[i], inf);
        else MF::ae(u[i], v[i], 1), MF::ae(v[i], u[i], inf);
    }
    int res = MF::dinic(s, t);
    memset(vis, 0, sizeof vis);
    MF::reach(s, vis), MF::init();
    memset(d, 0, sizeof d);
    int S = n + 1, T = n + 2;
    MF::ae(t, s, inf);
    for (int i = 1; i <= m; ++i) if (g[i])
        id[i] = MF::ae(u[i], v[i], inf), ++d[u[i]], --d[v[i]];
    int need = 0;
    for (int i = 1; i <= n; ++i)
        if (d[i] > 0) MF::ae(i, T, d[i]), need += d[i];
        else if (d[i] < 0) MF::ae(S, i, -d[i]);
    int F = MF::dinic(S, T);
    cout << res << '\n';
    for (int i = 1; i <= m; ++i)
        if (!g[i]) cout << 0 << ' ' << 1 << '\n';
        else cout << MF::f[id[i] ^ 1] + 1 << ' ' << (vis[u[i]] && !vis[v[i]] ? MF::f[id[i] ^ 1] + 1 : MF::f[id[i] ^ 1] + 2) << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑

鲜活指数：8

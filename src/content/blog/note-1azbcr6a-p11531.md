---
title: "P11531 [THUPC 2025 初赛] 检查站 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p11531"
categories: ["题解"]
tags: ["洛谷", "图论", "网络流"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P11531).
:::

:::info[Solution]{open}
套路的考虑最小割建模求解。把每个分部点 $i$ 拆成入点 $in_i$ 和出点 $out_i$，然后从入点向出点连一条容量为 $1$ 的边。割掉这条边就代表选择这个分部设立检查站，花费代价为 $1$。

然后对原图上的一条边 $u\to v$ 如果其属于分部 $r$ 则因为题目保证分布 $r$ 的办公室就在 $u,v$ 中的一个点，因此可以强制要求这条边经过分部 $r$ 表示为 $u\to in_r\to out_r\to v$ 的形式，其中 $u\to in_r$ 和 $out_r\to v$ 的容量都设为 $+\infin$ 表示这些关系是不能被切割的。因此问题的答案就变为建模出的图从 $1$ 点到 $n$ 点的最小割，由最大流最小割定理可以将最小割转化为最大流，跑一遍 dinic 即可。
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


inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m, c; cin >> n >> m >> c;
    Flow::S = 1, Flow::T = n;
    for (int i = n + 1; i <= n + c; ++i) Flow::link(i, i + c, 1);
    for (int i = 1; i <= c; ++i) { int t; cin >> t; }
    for (int i = 1; i <= m; ++i) {
        int a, b, r; cin >> a >> b >> r;
        Flow::link(a, r + n, inf), Flow::link(n + c + r, b, inf);
    } cout << Flow::dinic() << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：4

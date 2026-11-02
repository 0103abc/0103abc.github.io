---
title: "CF1146G Zoning Restrictions 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1146g"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "模拟", "图论", "网络流"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1146G)
:::

:::info[Solution]{open}
考虑最小割。套路的考虑一个割会把所有点分成和源点 $S$ 连通的集合和和汇点 $T$ 连通的集合。则所有对答案产生贡献的边当且仅当其被割即其是从 $S$ 类点连向 $T$ 类点的边。给每个点 $i$ 按照其高度为 $0,1,2,\ldots,h$ 拆成 $h+1$ 个点，构成一条 $S\to v_{i,0}\to v_{i,1}\to\ldots\to v_{i,h}\to T$ 的链，如果最终选择的高度是 $a_j$ 则割边是 $v_{j,a_j-1}\to v_{j,a_j}$ 的边并将其计入贡献中。因此点 $v_{j,0},v_{j,1},\ldots,v_{j,a_j-1}$ 为 $S$ 类点，剩下的 $v_{j,a_j},v_{j,a_j+1},\ldots,v_{j,h}$ 为 $T$ 类点。也就是说，对一个限制高度 $x$ 而言 $v_{j,x}$ 是 $S$ 类点当且仅当 $a_j>x$。

然后考虑怎么处理限制条件。对一个限制 $(l,r,x,c)$ 建立一个辅助点 $P$，并连接 $v_{j,l},v_{j,l+1},\ldots,v_{j,r}$ 这些点到 $P$ 点，并让这些边的容量都设为 $+\infin$。然后连接 $P\to T$ 的边，容量为 $c$。

现在考虑这个建图方式为什么是对的：

#### 有至少一座房子的高度 $>x$

假设存在某个 $j\in[l,r]$ 满足 $a_j>x$ 则根据前面的结论 $v_{j,x}$ 是 $S$ 类点。此时存在不会被割掉的边 $v_{j,x}\to P$，因此 $P$ 点也是 $S$ 类点。所以此时 $P\to T$ 这条边一定被割掉了，容量为 $c$。

#### 没有房子的高度 $>x$

此时所有的 $j\in[l,r]$ 都不满足 $a_j>x$ 则根据前面的结论 $v_{j,x}$ 都是 $T$ 类点，因此 $P$ 点也同样是 $T$ 类点，$P\to T$ 这条边一定不会被割掉。

---

因此建模的正确性得证，直接模拟上述流程跑 dinic 即可。一个小细节是注意每组限制条件都需要额外新开一个辅助点 $P$。
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
    int n, h, m; cin >> n >> h >> m;
    Flow::S = N - 1, Flow::T = N - 2;
    function<int(int, int)> get = [&](int i, int j) { return (i - 1) * (h + 2) + j; };
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= h + 1; ++j)
            Flow::link(get(i, j), get(i, j + 1), h * h - (j - 1) * (j - 1));
    for (int i = 1; i <= n; ++i) {
        Flow::link(Flow::S, get(i, 1), inf);
        Flow::link(get(i, h + 2), Flow::T, inf);
    }
    int idx = n * (h + 2);
    while (m--) {
        int l, r, x, c; cin >> l >> r >> x >> c;
        if (x == h) continue;
        Flow::link(++idx, Flow::T, c);
        for (int i = l; i <= r; ++i) Flow::link(get(i, x + 2), idx, inf);
    } cout << n * h * h - Flow::dinic() << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：7

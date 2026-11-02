---
title: "AT_agc029_f [AGC029F] Construction of a tree 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-at_agc029_f"
categories: ["题解"]
tags: ["AtCoder", "图论", "二分图匹配", "基础算法", "二分", "搜索", "广度优先搜索"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/AT_agc029_f).
:::

:::info[Solution]{open}
考虑二分图建模。固定 $1$ 号结点为树的根结点，则对每个非根结点 $2\sim n$ 其都有一个父亲结点 $f_i$。构建二分图，左部点为编号 $2,3,4,\ldots,n$ 的点，右部点为集合 $S_1,S_2,\ldots,S_{n-1}$。如果 $x\in S_i$ 就在左部点 $x$ 和右部点 $E_i$ 之间连一条边。

先在二分图上求一个完美匹配，由 Hall 定理可知若不存在完美匹配则必然无解，否则设集合 $S_i$ 匹配到的结点为 $f_i$，考虑让 $S_i$ 这个集合负责把 $f_i$ 结点接入树中。具体的：

从 $1$ 号结点开始 BFS，假设当前已经访问到了结点 $x$ 则考虑枚举所有满足 $x\in S_i$ 且还没有使用过的集合 $S_i$。因为 $x\in S_i\land f_i\in S_i$ 因此可以直接连边 $<x,f_i>$ 作为集合 $S_i$ 的答案。然后记 $f_i$ 的父亲结点为 $x$，把 $f_i$ 加入到队列中并继续 BFS 扩展即可。

如果 BFS 结束后仍然有结点没有被访问到，则说明已经无法通过任何集合向外继续扩展，因此此时不存在合法方案，直接输出 $-1$ 即可。

因为这个题数据范围太大了所以没法写匈牙利，只能被迫写 dinic 了。
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

vector<int> S[N];
pair<int, int> res[N];
int F[N], vis[N], fa[N], id[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n; cin >> n;
    Flow::S = 1, Flow::T = n + n;
    for (int i = 2; i <= n; ++i) Flow::link(Flow::S, i, 1);
    for (int i = 1; i < n; ++i) {
        int c; cin >> c;
        while (c--) {
            int w; cin >> w;
            S[w].emplace_back(i);
            if (w != 1) Flow::link(w, n + i, 1);
        } Flow::link(n + i, Flow::T, 1);
    } if (Flow::dinic() != n - 1) { cout << -1 << '\n'; return; }
    for (int i = 1; i <= n; ++i)
        for (auto &[e, f, o] : Flow::adj[n + i])
            if (2 <= e && e <= n && f) { F[i] = e; break; }
    queue<int> q; q.emplace(1);
    while (q.size()) {
        int t = q.front(); q.pop();
        for (int &i : S[t]) if (!vis[i])
            vis[i] = 1, fa[F[i]] = t, id[F[i]] = i, q.emplace(F[i]);
    } for (int i = 1; i < n; ++i) if (!vis[i]) { cout << -1 << '\n'; return; }
    for (int i = 2; i <= n; ++i) res[id[i]] = {fa[i], i};
    for (int i = 1; i < n; ++i) cout << res[i].first << ' ' << res[i].second << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑

鲜活指数：9

---
title: "CF2068K Amusement Park Rides 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf2068k"
categories: ["题解"]
tags: ["Codeforces", "图论", "网络流", "基础算法", "二分", "二分图匹配"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF2068K).
:::

:::info[Solution]{open}
相同的 $a_i$ 对应到开放时刻集合是相同的，因此直接合并相同 $a_i$ 即可。

设不同的值为 $p_1,p_2,\ldots,p_m$，出现次数为 $c_1,c_2,\ldots.c_m$。对 $i$ 而言，其可以选择的时间是 $p_i,2p_i,3p_i,\ldots$，因此可以把问题看作是一个二分图匹配，左边是每一种 $p_i$，右边是每一个可以使用的时间 $t$。如果 $p_i\mid t$ 说明 $i$ 类项目可以被安排在时间 $t$ 上，直接在左部点中的 $p_i$ 和右部点中的 $t$ 之间连一条流量为 $1$ 的边。然后从源点 $S$ 向左部点 $i$ 连一条流量为 $c_i$ 的边，右部点 $t$ 向汇点 $T$ 连一条流量为 $1$ 的边即可。

一个简单的想法是直接二分答案时刻为 $t$ 然后对每个 $t$ 建出网络流图跑 dinic 验证流量是否满流，但是时间复杂度不太能接受。考虑进一步优化，维护集合 $mp_t$ 表示由多少个种类的项目需要尝试时间 $t$。一开始每个 $p_i$ 的第一个可以尝试的时间就是 $p_i$，因此在 $mp_{p_i}$ 集合中加入项目 $i$。之后每次取出 $mp$ 中最小的可用时间 $t$ 建立一个新的时间点，然后把 $mp_t$ 集合中的所有项目类边连向这个时间点，在原来的残量网络上直接跑 dinic 即可。

因为一次只会新增一个时间点，而且其到汇点 $T$ 的边的容量为 $1$，因此最大流也最多只会增加 $1$。如果加入该时间点后最大流成功的增加了 $1$ 则说明时间 $t$ 是有用的，对所有 $i\in mp_t$ 继续考虑其下一个倍数 $p_i+t$，然后把这些点扔到 $mp_{p_i+t}$ 集合里即可。如果没有变化则说明增广失败，不需要继续生成其后面的倍数。

时间复杂度是 $O(能过)$ 的。
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

int id[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n; cin >> n;
    map<int, int> cnt;
    for (int i = 0; i < n; ++i) {
        int x; cin >> x;
        ++cnt[x];
    }
    vector<int> p, c;
    for (auto &[x, y] : cnt) p.emplace_back(x), c.emplace_back(y);
    Flow::S = 0, Flow::T = 1;
    int idx = 2;
    for (int i = 0; i < p.size(); ++i) id[i] = idx++, Flow::link(Flow::S, id[i], c[i]);
    map<int, vector<int>> mp;
    for (int i = 0; i < p.size(); ++i) mp[p[i]].emplace_back(i);
    int flow = 0, res = 0;
    while (flow < n) {
        auto [t, v] = *mp.begin();
        mp.erase(mp.begin());
        int u = idx++;
        for (int &i : v) Flow::link(id[i], u, 1);
        Flow::link(u, Flow::T, 1);
        if (Flow::dinic()) {
            ++flow;
            for (int &i : v) mp[t + p[i]].emplace_back(i);
        } res = t;
    } cout << res << '\n';
    for (int i = 0; i <= idx; ++i) Flow::adj[i].clear();
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：6

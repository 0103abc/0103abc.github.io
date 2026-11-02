---
title: "CF1268E Happy Cactus 题解"
date: "2026-08-10T05:50:56.000Z"
link: "luogu-v859iai5"
categories: ["题解"]
tags: ["Codeforces", "图论", "树", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/v859iai5)。

先考虑图是一个树的情况。此时定义 $f_u$ 表示当前已经处理的边中所有从 $u$ 结点出发的沿边权递增的路径能够到达的点的数量。这个是容易处理的，直接把边权从大到小排序然后按顺序转移即可。

然后考虑把上述做法扩展到仙人掌上。考虑如果当前一条边 $<u,v>$ 在仙人掌的某个环上，则处理该边的时候 $u,v$ 两个点有可能已经通过环的另一侧连接起来了，此时直接转移的话答案会算重。容易发现此时 $<u,v>$ 边必然是整个环上权值最小的边。进一步分析可以发现算重的部分就是处理该环的最大边是她两个端点当前能够到达的那些点。因此在处理最大边的时候把这个值记为 $g_i$，则之后处理最小边的时候把答案额外减去 $g_i$ 即可。

找仙人掌中所有的环是容易的，这里就不展开说了。

文字部分描述的可能不太清楚，建议参考代码实现理解。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, m;
pair<int, int> e[N];
vector<pair<int, int>> adj[N];
int f[N], g[N], Min[N], fa[N], fa_[N], dep[N];

inline void gao(int u, int v, int id) {
    vector<int> v1 = {id}, v2;
    for (int i = u; i != v; i = fa[i]) v2.emplace_back(fa_[i]);
    reverse(v2.begin(), v2.end());
    for (int &i : v2) v1.emplace_back(i);
    int mi = min_element(v1.begin(), v1.end()) - v1.begin();
    int mx = max_element(v1.begin(), v1.end()) - v1.begin();
    int ok = 1;
    for (int i = mi; i != mx; ) {
        if (v1[i] > v1[(i + 1) % v1.size()]) ok = 0;
        i = (i + 1) % v1.size();
    } for (int i = mi; i != mx; ) {
        if (v1[i] > v1[(i + v1.size() - 1) % v1.size()]) ok = 0;
        i = (i + v1.size() - 1) % v1.size();
    } if (ok) Min[v1[mi]] = v1[mx];
}

inline void dfs(int u, int pid) {
    for (auto &[v, id] : adj[u]) if (id != pid) {
        if (!dep[v]) dep[v] = dep[u] + 1, fa[v] = u, fa_[v] = id, dfs(v, id);
        else if (dep[u] > dep[v]) gao(u, v, id);
    }
}

inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int u, v; cin >> u >> v;
        e[i] = {u, v}, adj[u].emplace_back(v, i), adj[v].emplace_back(u, i);
    } dep[1] = 1, dfs(1, 0);
    for (int i = 1; i <= n; ++i) f[i] = 1;
    for (int i = m; i; --i) {
        auto &[u, v] = e[i];
        int val = f[u] + f[v];
        if (Min[i]) val -= g[Min[i]];
        f[u] = f[v] = g[i] = val;
    } for (int i = 1; i <= n; ++i) cout << f[i] - 1 << ' '; cout << '\n';
}

} // namespace lowspeed_song
```
:::

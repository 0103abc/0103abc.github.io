---
title: "CF1307F Cow and Vacation 题解"
date: "2026-08-11T09:27:29Z"
link: "note-he8i0q35-cf1307f"
categories: ["题解"]
tags: ["Codeforces", "数据结构", "并查集", "搜索", "广度优先搜索", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/he8i0q35)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1307F).
:::

:::info[Solution]{open}
考虑先把每条边中间额外加入一个点，这样 $k\leftarrow 2k$ 就变为了偶数。然后此时两个休息点之间可以互相到达当且仅当其距离不超过 $k$ 可以直接用并查集维护。把所有休息点扔到队列里跑多源 BFS 然后把所有距离不超过 $\frac k2$ 的点都用并查集合并到相同连通块中即可。

对每一组询问 $x,y$，若这两个点在树上的距离不超过 $k$ 则可以直接走过去，否则考虑先从 $x$ 往 $y$ 的方向走 $\frac k2$ 步来到 $x'$，从 $y$ 向 $x$ 的方向走 $\frac k2$ 步来到 $y'$，然后判断 $x'$ 和 $y'$ 两个点是否在并查集的相同连通块中即可。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
int st[N][20], dep[N], dis[N];
inline void dfs(int u, int fa) {
    st[u][0] = fa, dep[u] = dep[fa] + 1;
    for (int &v : adj[u]) if (v != fa) dfs(v, u);
}
inline int lca(int a, int b) {
    if (dep[a] < dep[b]) swap(a, b);
    for (int i = 19; ~i; --i) if (dep[a] - dep[b] >> i & 1) a = st[a][i];
    if (a == b) return a;
    for (int i = 19; ~i; --i) if (st[a][i] != st[b][i]) a = st[a][i], b = st[b][i];
    return st[a][0];
}
inline int dist(int a, int b) { return dep[a] + dep[b] - 2 * dep[lca(a, b)]; }
inline int kth(int x, int k) {
    for (int i = 19; ~i; --i) if (k >> i & 1) x = st[x][i];
    return x;
}

struct DSU {
    int fa[N];
    inline DSU() { iota(fa, fa + N, 0); }
    inline void init(int maxn) { iota(fa, fa + maxn + 1, 0); }
    inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
    inline int merge(int x, int y) {
        x = find(x), y = find(y);
        if (x != y) return fa[x] = y, 1;
        return 0;
    }
} dsu;

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, k, r; cin >> n >> k >> r;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(n + i), adj[n + i].emplace_back(a);
        adj[b].emplace_back(n + i), adj[n + i].emplace_back(b);
    } dfs(1, 0);
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= n + n - 1; ++j) st[j][i] = st[st[j][i - 1]][i - 1];
    queue<int> q;
    memset(dis, 0x3f, sizeof dis);
    while (r--) {
        int x; cin >> x;
        q.emplace(x), dis[x] = 0;
    } while (q.size()) {
        int t = q.front(); q.pop();
        if (dis[t] == k) break;
        for (int &v : adj[t]) {
            dsu.merge(v, t);
            if (dis[v] > dis[t] + 1) dis[v] = dis[t] + 1, q.emplace(v);
        }
    } int Q; cin >> Q; while (Q--) {
        int x, y; cin >> x >> y;
        int L = lca(x, y), d = dist(x, y);
        if (d <= k + k) cout << "YES\n";
        else {
            int xp = (k <= dep[x] - dep[L]) ? dsu.find(kth(x, k)) : dsu.find(kth(y, d - k));
            int yp = (k <= dep[y] - dep[L]) ? dsu.find(kth(y, k)) : dsu.find(kth(x, d - k));
            cout << ((xp == yp) ? "YES" : "NO") << '\n';
        }
    }
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：8

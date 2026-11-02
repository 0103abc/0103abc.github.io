---
title: "P4055 [JSOI2009] 游戏 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p4055"
categories: ["题解"]
tags: ["洛谷", "基础算法", "二分", "图论", "二分图匹配", "搜索", "深度优先搜索"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P4055).
:::

:::info[Solution]{open}
网格图相邻点连边后得到的是二分图（即对网格图按照下标和奇偶性做黑白染色），问题被转化为二分图博弈。

因为二分图博弈太困难了，所以这里直接写结论不对结论做证明（将来可能会单独开一篇博客来补证明）：

+ 如果二分图存在一个最大匹配不包含起点，则后手必胜。
+ 否则先手必胜。

然后考虑怎么判断是否存在不包含起点的二分图最大匹配。先求出任意一组二分图最大匹配，如果此时起点已经不在最大匹配上了那么后手此时必胜。否则从所有的未匹配点开始出发进行 DFS 搜索交错路：假设当前有一条路径 $u\to v\to w$ 其中 $u$ 未是未匹配点，$u\to v$ 不是匹配边，但 $v\to w$ 是匹配边。则考虑交换两条边的匹配状态，原来的非匹配边 $u\to v$ 变成匹配边，匹配边 $v\to w$ 变成非匹配边。此时 $u$ 点变成匹配点，$w$ 点变成非匹配点，仍然是一组合法的最大匹配。然后从 $w$ 开始继续往后递归处理，流程和前面的 $u\to v\to w$ 的操作方式相似。

可以证明上面的方法可以搜索出全部可能存在于某个最大匹配上的点（证明可以考虑任意两组最大匹配之间的差异一定可以拆成若干条交错路径或者交错环）。因此直接模拟上述算法流程即可。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

char s[110][110];
vector<int> adj[N];
int timestamp, mat[N], mate[N], vis[N], res[N];
inline void dfs2(int u) {
    res[u] = 1;
    for (int &v : adj[u]) // 枚举所有非匹配边 u -- v
        if (mate[u] != v) {
            int w = mate[v];
            if (~w && !res[w]) dfs2(w); // v -- w 是匹配边，切换两条边的状态
        }
}

inline int dfs(int u) {
    for (int &v : adj[u])
        if (vis[v] != timestamp) {
            vis[v] = timestamp;
            if (!~mat[v] || dfs(mat[v])) return mat[v] = u, 1;
        }
    return 0;
}

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m; cin >> n >> m;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j) cin >> s[i][j];
    const int dx[] = {0, 1, 0, -1}, dy[] = {1, 0, -1, 0};
    function<int(int, int)> get = [&](int i, int j) { return (i - 1) * m + j; };
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (s[i][j] == '.')
                for (int d = 0; d < 4; ++d) {
                    int ix = i + dx[d], iy = j + dy[d];
                    if (ix >= 1 && ix <= n && iy >= 1 && iy <= m && s[ix][iy] == '.')
                        adj[get(i, j)].emplace_back(get(ix, iy)), adj[get(ix, iy)].emplace_back(get(i, j));
                }
    // cerr << "#1\n";
    memset(mat, -1, sizeof mat);
    memset(mate, -1, sizeof mate);
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (s[i][j] == '.' && (i + j) % 2 == 0) ++timestamp, dfs(get(i, j));
    // cerr << "#1.5\n";
    for (int i = 1; i <= n * m; ++i)
        if (~mat[i]) mate[i] = mat[i], mate[mat[i]] = i;
    // cerr << "#2\n";
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (s[i][j] == '.' && !~mate[get(i, j)] && !res[get(i, j)]) dfs2(get(i, j));
    int win = 0;
    for (int i = 1; i <= n * m; ++i) win |= res[i];
    if (!win) { cout << "LOSE\n"; return; }
    cout << "WIN\n";
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (res[get(i, j)]) cout << i << ' ' << j << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：7

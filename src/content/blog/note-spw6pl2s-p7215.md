---
title: "P7215 [JOISC 2020] 首都 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p7215"
categories: ["题解"]
tags: ["洛谷", "算法思想", "分治", "图论", "树", "搜索", "广度优先搜索"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P7215).
:::

:::info[Solution]{open}
先思考 $O(n^2)$ 做法。容易想到钦定某个点 $u$ 必须选，然后直接 BFS 暴力向外扩展出所有需要选的颜色。枚举每个 $u$ 点可以做到 $O(n^2)$。

考虑进一步优化。树上连通块问题容易想到点分治优化。记当前的分治中心为 $u$，则直接在当前分治子树内暴力扩展出需要选的颜色，时间复杂度即可被优化到 $O(n\log n)$。

容易证明若某个子树内，从子树的分治重心出发会扩展到子树外侧，则其一定不会成为严格最优解。因此上述贪心策略正确。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
int siz[N], used[N], best, rt, up[N], bel[N];

inline void getsiz(int u, int fa) {
    siz[u] = 1;
    for (int &v : adj[u])
        if (v != fa && !used[v]) getsiz(v, u), siz[u] += siz[v];
}

inline void getcen(int u, int fa, int tot) {
    int mx = tot - siz[u];
    for (int &v : adj[u]) if (v != fa && !used[v]) getcen(v, u, tot), mx = max(mx, siz[v]);
    if (mx < best) best = mx, rt = u;
}

inline void dfs(int u, int fa, int id) {
    up[u] = fa, bel[u] = id;
    for (int &v : adj[u]) if (v != fa && !used[v]) dfs(v, u, id);
}

vector<int> pos[N];
int res = inf, c[N], vc[N], vp[N], n, k;

// 若必须选择结点 x，最少需要花费的颜色数
inline void calc(int x) {
    queue<int> q;
    int cnt = 0;
    function<int(int, int)> add = [&](int x, int id) {
        vc[x] = id, ++cnt;
        for (int &i : pos[x]) if (bel[i] != id) return 0;
        for (int &i : pos[x]) q.emplace(i);
        return 1;
    };
    if (!add(c[x], x)) return;
    while (q.size()) {
        int t = q.front(); q.pop();
        while (t != x && vp[t] != x) {
            vp[t] = x;
            if (vc[c[t]] != x && !add(c[t], x)) return;
            t = up[t];
        }
    } res = min(res, cnt - 1);
}

inline void dfs(int x) {
    getsiz(x, 0), best = inf, getcen(x, 0, siz[x]);
    dfs(rt, 0, rt), calc(rt), used[rt] = 1;
    for (int &v : adj[rt]) if (!used[v]) dfs(v);
}

inline void sol() {
    cin >> n >> k;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b);
        adj[b].emplace_back(a);
    }
    for (int i = 1; i <= n; ++i)
        cin >> c[i], pos[c[i]].emplace_back(i);
    dfs(1), cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：6

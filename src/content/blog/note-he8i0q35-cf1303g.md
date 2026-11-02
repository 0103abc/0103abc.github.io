---
title: "CF1303G Sum of Prefix Sums 题解"
date: "2026-08-11T09:27:29Z"
link: "note-he8i0q35-cf1303g"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "分治", "图论", "树", "基础算法", "前缀和"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1303G).
:::

:::info[Solution]{open}
看到树上路径问题容易想到点分治。设当前的分治中心为 $c$，则考虑一条经过 $c$ 点的路径 $u\to c\to v$，其中 $u,v$ 在删除 $c$ 点后位于不同的连通块内。

对 $u$ 这一侧的信息，不考虑 $c$ 点，则记 $S_u=\sum a_x,T_u=\sum\operatorname{dist}(c,x)a_x$，对 $v$ 这一侧记 $L_u=\operatorname{dist}(c,v)+1,H_v$ 为路径 $c\to v$ 本身的前缀和的和。那么整条路径 $u\to c\to v$ 的答案就可以表示为 $H_v+S_uL_v+T_u$。然后固定 $u$ 后发现式子可以被写成 $y=S_ux+T_u$ 的形式，形如一条一次函数，因此直接用 LiChao SegTree 维护即可。代码细节很多。

还有一个 2log 的 DSU on tree + 动态凸包的做法，但是我~~懒得写~~觉得我写不动，所以没写。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

vector<int> adj[N];
int n, a[N], siz[N], ans, lsh[N], vis[N];

namespace LiChaoSgt {
    int tree[N << 2], lim, cnt;
    pair<int, int> seg[N];
    vector<int> use;
    inline int calc(int id, int x) { return id ? seg[id].first * lsh[x] + seg[id].second : inf; }
    inline void ins(int l, int r, int rt, int id) {
        if (!tree[rt]) {
            tree[rt] = id, use.emplace_back(rt);
            return;
        }
        if (l == r) {
            if (calc(id, l) < calc(tree[rt], l)) tree[rt] = id;
            return;
        } int mid = l + r >> 1;
        if (calc(id, mid) < calc(tree[rt], mid)) swap(tree[rt], id);
        if (calc(id, l) < calc(tree[rt], l)) ins(l, mid, rt << 1, id);
        if (calc(id, r) < calc(tree[rt], r)) ins(mid + 1, r, rt << 1 | 1, id);
    }
    inline void ins(int k, int b, int id) { seg[id] = {k, b}, ins(0, lim, 1, id); }
    inline int qry(int l, int r, int rt, int val) {
        if (l == r) return calc(tree[rt], val);
        int mid = l + r >> 1, now = calc(tree[rt], val);
        if (val <= mid) return min(now, qry(l, mid, rt << 1, val));
        return min(now, qry(mid + 1, r, rt << 1 | 1, val));
    }
    inline void clear() {
        for (int x : use) tree[x] = 0;
        use.clear(), cnt = 0;
    }
}

inline void dfs(int u, int fa) {
    siz[u] = 1;
    for (int &v : adj[u]) if (v != fa && !vis[v])
        dfs(v, u), siz[u] += siz[v];
}

inline int getrt(int u, int fa, int s) {
    for (int &v : adj[u])
        if (v != fa && !vis[v] && siz[v] > s / 2)
            return getrt(v, u, s);
    return u;
}

struct Node { int len, h, k, b; };

inline void get(int u, int fa, int dep, int s, int h, int t, vector<Node> &v, int c) {
    s += a[u], t += dep * a[u], h += a[c] + s;
    v.push_back({dep + 1, h, s, t});
    for (int x : adj[u]) if (x != fa && !vis[x])
        get(x, u, dep + 1, s, h, t, v, c);
}

inline void calc(vector<vector<Node>> &v, int op) {
    LiChaoSgt::clear();
    for (int j = 0; j < v.size(); ++j) {
        int i = op ? v.size() - j - 1 : j;
        for (auto &x : v[i]) {
            int res = LiChaoSgt::qry(0, LiChaoSgt::lim, 1, x.len);
            if (res != inf) ans = max(ans, x.h - res);
        }
        for (auto &x : v[i]) LiChaoSgt::ins(-x.k, -x.b, ++LiChaoSgt::cnt);
    }
    LiChaoSgt::clear();
}

inline void solve(int s) {
    dfs(s, 0);
    int c = getrt(s, 0, siz[s]);
    vis[c] = 1;
    vector<vector<Node>> v;
    for (int x : adj[c]) if (!vis[x]) {
        v.emplace_back();
        get(x, c, 1, 0, a[c], 0, v.back(), c);
    }
    v.push_back({{1, a[c], 0, 0}});
    calc(v, 0), calc(v, 1);
    for (int x : adj[c]) if (!vis[x]) solve(x);
}

inline void init() {
}

inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n;
    LiChaoSgt::lim = n;
    for (int i = 0; i <= n; ++i) lsh[i] = i;
    for (int i = 1, u, v; i < n; ++i) {
        cin >> u >> v;
        adj[u].emplace_back(v), adj[v].emplace_back(u);
    }
    for (int i = 1; i <= n; ++i) cin >> a[i];
    solve(1);
    cout << ans << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：-2

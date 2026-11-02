---
title: "CF1413F Roads and Ramen 题解"
date: "2026-08-11T09:27:29Z"
link: "note-he8i0q35-cf1413f"
categories: ["题解"]
tags: ["Codeforces", "数据结构", "线段树", "图论", "树", "搜索", "深度优先搜索"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/he8i0q35)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1413F).
:::

:::info[Solution]{open}
考虑以 $1$ 号结点为根建树，然后给每个结点染色 $col_i$，若从根结点走到当前结点经过的石子数量为偶数，则 $col_i=0$，否则 $col_i=1$。

则此时两个点之间石子路数量为偶数当且仅当两个点颜色相同。

然后容易发现结论：最长合法路径一定可以i让一个端点是整个树直径的某个端点。因此考虑先求出树的任意一条直径的两个端点 $A,B$ 然后只需要维护从 $A,B$ 两个点出发能走到的最远的同色点即可。

考虑用线段树维护改信息，一条边状态翻转后会导致她整个子树的点颜色全部翻转。因此考虑用 DFS 序把整个子树变成一个区间然后用线段树维护区间内颜色 $0/1$ 的点的最大深度。修改一条边直接交换子树内对应结点两个颜色的信息即可。具体实现给两个端点 $A,B$ 分别开一个线段树维护信息即可。

时间复杂度为 $O(n\log n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int dis[N], n;
vector<pair<int, int>> adj[N];

struct SegTree {
    int up[N], dep[N], siz[N], dfn[N], timestamp, w[N], bk[N];
    inline SegTree() {
        memset(up, 0, sizeof up);
        memset(dep, 0, sizeof dep);
        memset(siz, 0, sizeof siz);
        memset(dfn, 0, sizeof dfn);
        memset(bk, 0, sizeof bk);
        timestamp = 0;
    }
    inline void dfs(int u, int fa) {
        up[u] = fa, dep[u] = dep[fa] + 1, siz[u] = 1, bk[dfn[u] = ++timestamp] = u;
        for (auto &[v, _] : adj[u]) if (v != fa) w[v] = w[u] ^ _, dfs(v, u), siz[u] += siz[v];
    }
    int l[N], r[N], mx[N][2], tag[N];
    inline void init(int rt, int p) {
        l[rt] = r[rt] = p, mx[rt][0] = mx[rt][1] = tag[rt] = 0;
        mx[rt][w[bk[p]]] = dep[bk[p]];
    }
    inline void pushup(int rt) {
        l[rt] = l[rt << 1], r[rt] = r[rt << 1 | 1];
        for (int o : {0, 1}) mx[rt][o] = max(mx[rt << 1][o], mx[rt << 1 | 1][o]);
    }
    inline void build(int l, int r, int rt) {
        if (l == r) return init(rt, l);
        int mid = l + r >> 1; build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
        pushup(rt);
    }
    inline void init(int rt) { dfs(rt, 0), build(1, n, 1); }
    inline void push(int rt) { tag[rt] ^= 1, swap(mx[rt][0], mx[rt][1]); }
    inline void pushdown(int rt) { if (tag[rt]) push(rt << 1), push(rt << 1 | 1), tag[rt] = 0; }
    inline void mdf(int rt, int ll, int rr) {
        if (ll <= l[rt] && r[rt] <= rr) return push(rt);
        int mid = l[rt] + r[rt] >> 1; pushdown(rt);
        if (ll <= mid) mdf(rt << 1, ll, rr);
        if (mid < rr) mdf(rt << 1 | 1, ll, rr);
        pushup(rt);
    }
    inline void upd(int a, int b) {
        int pos = (dep[a] < dep[b]) ? b : a;
        mdf(1, dfn[pos], dfn[pos] + siz[pos] - 1);
    }
} Sgt1, Sgt2;

tuple<int, int, int> e[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n;
    for (int i = 1; i < n; ++i) {
        int a, b, c; cin >> a >> b >> c, e[i] = {a, b, c};
        adj[a].emplace_back(b, c), adj[b].emplace_back(a, c);
    } queue<int> q; memset(dis, -0x3f, sizeof dis), dis[1] = 0, q.emplace(1);
    while (q.size()) {
        int t = q.front(); q.pop();
        for (auto &[g, w] : adj[t]) if (dis[g] < -inf / 2) dis[g] = dis[t] + 1, q.emplace(g);
    } int p1 = max_element(dis + 1, dis + n + 1) - dis;
    memset(dis, -0x3f, sizeof dis), dis[p1] = 0, q.emplace(p1);
    while (q.size()) {
        int t = q.front(); q.pop();
        for (auto &[g, w] : adj[t]) if (dis[g] < -inf / 2) dis[g] = dis[t] + 1, q.emplace(g);
    } int p2 = max_element(dis + 1, dis + n + 1) - dis;
    Sgt1.init(p1), Sgt2.init(p2);
    int Q; cin >> Q; while (Q--) {
        int x; cin >> x;
        auto [a, b, c] = e[x];
        Sgt1.upd(a, b), Sgt2.upd(a, b);
        cout << max(Sgt1.mx[1][0], Sgt2.mx[1][0]) - 1 << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：4

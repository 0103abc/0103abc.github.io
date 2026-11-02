---
title: "P11812 [PA 2015] 精确打击 / Kontrmanifestacja 题解"
date: "2026-06-22T04:22:50.000Z"
link: "luogu-ftou8hnh"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "基础算法", "差分", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ftou8hnh)。

先随便找到图上的一个环，若删除该环上所有的点和边后图仍然不是一个 DAG 那么必然不存在满足条件的结点。

否则，记这个环为图的一个基准环，则其余所有环都必然形如基准环上一点 $S$ 从基准环外走一段到基准环上一点 $T$ 然后沿着基准环从点 $T$ 回到点 $S$ 的形式。考虑枚举这样的点 $T$，快速找到一个可行的起点 $S$ 使得外部路径 $S\rightsquigarrow T$ 绕开的基准环上的点尽量多。

固定 $T$ 后直接在环上枚举 $S$ 时间复杂度就爆了，考虑优化。对每个不在基准环上的点 $u$ 维护集合 $R_u$ 表示所有能够通过外部路径走到 $u$ 点的环上起点 $S$ 组成的集合（需要注意的是 $R_u$ 集合中所有的 $S\in R_u$ 必须满足 $S$ 存在一条不经过基准环上任何一条边走到 $u$ 点的路径）。考虑建原图的反图然后通过反图来转移出所有的 $R_u$ 集合：

1. 存在基准环上一点 $v$ 直接连到 $u$ 上：$R_u\leftarrow \lbrace v\rbrace$
2. 存在基准环外一点 $v$ 直接连到 $u$ 上：$R_u\leftarrow R_v$

其中这里的 $A\leftarrow B$ 指的是把 $B$ 集合中所有元素都加入到 $A$ 集合中。

容易证明上面算 $R_u$ 集合的转移图是一个 DAG，因此可以这么转移。

此时考虑利用 $R_u$ 集合来快速的找出图上其他的环：枚举 $u$ 点在原图上的所有出边 $v$，若 $v$ 点在基准环上，则令 $T=v$，就可以在图上找到一个新的环。因此此时基准环上 $S\rightsquigarrow T$ 一段路径上的点就不在答案范围内，给基准环上所有点重标号然后差分处理即可求出答案。

但是这个做法还有一个问题：如果直接暴力合并 $R_u$ 集合转移的话最坏时空复杂度都是 $O(n^2)$ 级别的。这里给出一个糖糖的做法，考虑在 DAG 上做线段树合并，枚举 $T$ 找最优的 $S$ 就是问 $R_u$ 集合中 $\ge T$ 的最小位置，直接在线段树上二分即可。

此时时间复杂度和空间复杂度都是 $O(n\log n)$ 级别的，可以通过该题。

```cpp line-numbers
vector<int> adj[N], cyc;
int ok, n, m, col[N], up[N];

inline void dfs(int u) {
    if (ok) return;
    col[u] = 1;
    for (int &v : adj[u]) {
        if (!col[v]) up[v] = u, dfs(v);
        else if (col[v] == 1) {
            vector<int> cyc_;
            int tmp = u;
            while (tmp != v) cyc_.emplace_back(tmp), tmp = up[tmp];
            cyc_.emplace_back(tmp), reverse(cyc_.begin(), cyc_.end()), cyc = cyc_, ok = 1;
            return;
        } if (ok) return;
    } col[u] = 2;
}

struct Node {
    int l, r, siz;
} tree[N << 5];

int single[N];
int idx = 0;
inline int newnode(int ls = 0, int rs = 0) {
    tree[++idx].l = ls, tree[idx].r = rs;
    tree[idx].siz = tree[ls].siz + tree[rs].siz;
    return idx;
}

inline int build(int l, int r, int x) {
    int p = newnode();
    if (l == r) { tree[p].siz = 1; return p; }
    int mid = l + r >> 1;
    if (x <= mid) tree[p].l = build(l, mid, x);
    else tree[p].r = build(mid + 1, r, x);
    return tree[p].siz = 1, p;
}

inline int one(int u) {
    if (!single[u]) single[u] = build(0, cyc.size() - 1, u);
    return single[u];
}

inline int merge(int a, int b, int l, int r) {
    if (!a || !b) return a | b;
    if (a == b) return a;
    if (tree[a].siz < tree[b].siz) swap(a, b);
    if (tree[a].siz == r - l + 1) return a;
    if (l == r) return a;
    int mid = l + r >> 1;
    int L = merge(tree[a].l, tree[b].l, l, mid);
    int R = merge(tree[a].r, tree[b].r, mid + 1, r);
    if (L == tree[a].l && R == tree[a].r) return a;
    return newnode(L, R);
}

inline int lowb(int p, int x, int l, int r) {
    if (!p || r < x) return -1;
    if (l == r) return l;
    int mid = l + r >> 1, res = -1;
    if (x <= mid) res = lowb(tree[p].l, x, l, mid);
    if (~res) return res;
    return lowb(tree[p].r, x, mid + 1, r);
}

inline int find(int p) {
    int l = 0, r = cyc.size() - 1;
    while (l < r) {
        int mid = l + r >> 1;
        if (tree[p].l) r = mid, p = tree[p].l;
        else l = mid + 1, p = tree[p].r;
    } return l;
}

int deg[N], pos[N], ic[N], root[N], diff[N], bad[N];

inline void sol() {
    cin >> n >> m;
    vector<pair<int, int>> e;
    while (m--) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), e.emplace_back(a, b);
    } for (int i = 1; i <= n && !ok; ++i)
        if (!col[i]) dfs(i);
    if (!ok) { cout << "NIE\n"; return; }
    memset(pos, -1, sizeof pos);
    for (int i = 0; i < cyc.size(); ++i) pos[cyc[i]] = i, ic[cyc[i]] = 1;
    for (auto &[u, v] : e)
        if (!ic[u] && !ic[v]) ++deg[v];
    queue<int> q;
    vector<int> topo;
    for (int i = 1; i <= n; ++i)
        if (!ic[i] && !deg[i]) q.emplace(i);
    while (q.size()) {
        int t = q.front(); q.pop(); topo.emplace_back(t);
        for (int &g : adj[t]) if (!ic[g] && !--deg[g]) q.emplace(g);
    } if (n - cyc.size() != topo.size()) cout << 0 << "\n\n";
    else {
        for (auto &[u, v] : e)
            if (ic[u] && !ic[v])
                root[v] = merge(root[v], one(pos[u]), 0, cyc.size() - 1);
        for (int &u : topo) if (root[u])
            for (int &v : adj[u]) if (!ic[v]) root[v] = merge(root[v], root[u], 0, cyc.size() - 1);
        function<void(int, int)> add = [&](int l, int r) {
            if (l < r) l += cyc.size();
            ++l, r += cyc.size() - 1;
            if (l <= r) ++diff[l], --diff[r + 1];
        };
        for (auto &[u, v] : e) {
            if (ic[u] && ic[v]) add(pos[u], pos[v]);
            else if (!ic[u] && ic[v]) {
                if (!root[u]) continue;
                int t = pos[v], s = lowb(root[u], t, 0, cyc.size() - 1);
                if (!~s) s = find(root[u]) + cyc.size();
                add(s, t);
            }
        } int now = 0;
        for (int i = 0; i < 2 * cyc.size(); ++i) {
            now += diff[i];
            if (now > 0) bad[i % cyc.size()] = 1;
        } vector<int> res;
        for (int i = 0; i < cyc.size(); ++i)
            if (!bad[i]) res.emplace_back(cyc[i]);
        cout << res.size() << '\n', sort(res.begin(), res.end());
        for (int &i : res) cout << i << ' '; cout << '\n';
    }
}

```

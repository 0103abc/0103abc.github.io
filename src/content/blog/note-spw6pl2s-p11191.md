---
title: "P11191 「KDOI-10」超级演出 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p11191"
categories: ["题解"]
tags: ["洛谷", "算法思想", "分治"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P11191).
:::

:::info[Solution]{open}
固定 $l$ 来做是困难的，考虑换一个思考方向，可以发现若 $r$ 是固定的，则随着 $l$ 变小，每个乐队的退场情况也是单调的。因此记 $pos_i$ 表示想要让 $i$ 乐队退场的话左端点 $l$ 的值最大是多少。

假设已经求出了 $pos$ 数组的值，那么对一组询问 $[l,r]$ 而言，答案显然就是 $\sum\limits_{i=l}^r[pos_i\ge l]$，离线二维数点即可单 $\log$ 求解。

现在考虑怎么求 $pos$ 数组。容易发现为了让 $i$ 能够出场，必须存在一条出边 $i\to j$ 满足 $pos_j\ge pos_i$。因此 $pos$ 数组的转移就形如 $pos_i=\max\limits_{i\to j}pos_j$。当然还需要特判 $i$ 可以直接走到 $1$ 的情况，此时 $pos_i=1$。

发现这个东西既可以从自己转移给别人也可以从别人转移给自己。因此想到根号分治，设一个阈值 $B$，如果 $a_i$ 的度数 $\le B$ 就直接暴力更新，否则就等该一个度数 $\le B$ 的点更新自己的 $pos$ 值。根号平衡一下可得 $B=\sqrt n$ 时平衡时间复杂度为 $O(n\sqrt n)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N], adj2[N];
vector<pair<int, int>> Q[N];

struct BIT {
    int tree[N];
    inline BIT() { memset(tree, 0, sizeof tree); }
    inline void add(int x, int v) { for (; x < N; x += (x &- x)) tree[x] += v; }
    inline int qry(int x) { int s = 0; for (; x; x -= (x &- x)) s += tree[x]; return s; }
    inline int qry(int l, int r) { return qry(r) - qry(l - 1); }
} fwt;

int yc[N], pos[N], pos_[N], deg[N], a[N], las[N], las2[N], res[N];

inline void sol() {
    int n, m, k, q, cnt = 0; cin >> n >> n >> m >> k >> q;
    const int B = sqrt(m);
    while (m--) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), ++deg[a];
        if (b == 1) las[a] = 1;
    } for (int i = 1; i <= k; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i)
        if (deg[i] > B) for (int &j : adj[i]) adj2[j].emplace_back(i);
    for (int i = 1; i <= k; ++i) {
        if (las[a[i]]) pos[i] = i;
        else if (deg[a[i]] > B) pos[i] = yc[a[i]];
        else for (int &v : adj[a[i]]) pos[i] = max(pos[i], pos_[v]);
        for (int &v : adj2[a[i]]) yc[v] = max(yc[v], pos[i]);
        pos_[a[i]] = pos[i];
    } for (int i = 1; i <= q; ++i) {
        int l, r; cin >> l >> r;
        Q[r].emplace_back(l, i);
    } for (int i = 1; i <= k; ++i) {
        if (las2[a[i]]) fwt.add(las2[a[i]], -1), --cnt;
        if (pos[i]) fwt.add(pos[i], 1), las2[a[i]] = pos[i], ++cnt;
        for (auto &[x, id] : Q[i]) res[id] = n - cnt - 1 + fwt.qry(x - 1);
    } for (int i = 1; i <= q; ++i) cout << res[i] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：6

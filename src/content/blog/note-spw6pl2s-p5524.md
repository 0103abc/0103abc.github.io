---
title: "P5524 [Ynoi2012] NOIP2015 充满了希望 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p5524"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "基础算法", "排序", "前缀和"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P5524).
:::

:::info[Solution]{open}
先把所有的操作和询问离线下来。然后考虑维护一个最近一次 $2$ 操作时间戳的线段树，只需要支持单点修改，单点求值和区间推平三个操作即可。对每次 $3$ 操作，记录下时间戳 $tim_i$。

然后把询问和操作放在一起处理，按右端点 $r$ 从小到大排序，每次遇到操作 $3$ 的时候，在 $tim_i$ 的位置上更新答案；对每个询问 $[l,r]$ 因为 $r$ 这个维度已经被处理掉了，所以直接查询当前从 $l$ 位置开始的一段后缀和即可。这个东西拿 BIT 维护就行。

总时间复杂度为 $O(n\log n)$，可以通过。
:::

:::success[Code]
需要靠波动卡过去。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

struct Info { int o, x, y, z; } op[N];

struct BIT {
    i64 tree[N];
    inline BIT() { memset(tree, 0, sizeof tree); }
    inline void add(int x, int v) { for (++x; x < N; x += (x &- x)) tree[x] += v; }
    inline i64 qry(int x) { i64 s = 0; for (++x; x; x -= (x &- x)) s += tree[x]; return s; }
    inline i64 qry(int l, int r) { return qry(r) - qry(l - 1); }
} fwt;

struct Node {
    int l, r, tim, tag;
    inline void init(int p) { l = r = p, tim = tag = 0; }
    inline void push(int v) { tim = tag = v; }
} tree[N << 2];

inline Node operator+(const Node &l, const Node &r) {
    return {l.l, r.r, 0, 0};
}

inline void build(int l, int r, int rt) {
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline void pushdown(int rt) {
    if (tree[rt].tag) {
        tree[rt << 1].push(tree[rt].tag);
        tree[rt << 1 | 1].push(tree[rt].tag);
        tree[rt].tag = 0;
    }
}

inline void mdf(int rt, int pos, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (l == r) return tree[rt].push(v);
    int mid = l + r >> 1; pushdown(rt);
    mdf((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos, v);
}

inline void mdf(int rt, int ll, int rr, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].push(v);
    int mid = l + r >> 1; pushdown(rt);
    if (ll <= mid) mdf(rt << 1, ll, rr, v);
    if (mid < rr) mdf(rt << 1 | 1, ll, rr, v);
}

inline int qry(int rt, int pos) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (l == r) return tree[rt].tim;
    int mid = l + r >> 1; pushdown(rt);
    return qry((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos);
}

int tim[N];
i64 res[N];
vector<pair<int, int>> Q[N];

inline void sol() {
    int n, m, q; cin >> n >> m >> q;
    build(1, n, 1);
    for (int i = 1; i <= m; ++i) {
        cin >> op[i].o;
        if (op[i].o == 1) {
            cin >> op[i].x >> op[i].y;
            int v1 = qry(1, op[i].x), v2 = qry(1, op[i].y);
            mdf(1, op[i].x, v2), mdf(1, op[i].y, v1);
        } else if (op[i].o == 2) {
            cin >> op[i].x >> op[i].y >> op[i].z;
            mdf(1, op[i].x, op[i].y, i);
        } else {
            cin >> op[i].x;
            tim[i] = qry(1, op[i].x);
        }
    }
    for (int i = 1; i <= q; ++i) {
        int l, r; cin >> l >> r;
        Q[r].emplace_back(l, i);
    }
    for (int i = 1; i <= m; ++i) {
        if (op[i].o == 3) fwt.add(tim[i], op[tim[i]].z);
        for (auto &[l, id] : Q[i]) res[id] = fwt.qry(l, i);
    }
    for (int i = 1; i <= q; ++i) cout << res[i] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：8

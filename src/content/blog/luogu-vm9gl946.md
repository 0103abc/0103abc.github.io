---
title: "P6794 [SNOI2020] 水池 题解"
date: "2026-07-27T15:36:19.000Z"
link: "luogu-vm9gl946"
categories: ["题解"]
tags: ["洛谷", "基础算法", "二分", "数据结构", "线段树", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/vm9gl946)。

先考虑灌水操作会发生什么。在 $x$ 位置加水直到 $a_x\ge h$，特判掉原来已经有 $a_x\ge h$ 的情况。然后考虑水位上涨到 $h$ 的时候只能越过高度 $<h$ 的挡板。因此从 $x$ 位置出发二分找出左右第一块高度 $\ge h$ 的挡板。假设她们围出的格子区间是 $[L,R]$，则最终只需要推平 $[L,R]$ 区间内的水位为 $h$ 即可。

然后考虑排水操作。把第 $x$ 个格的水放干。设当前 $a_x=w$，则同样二分找出左右第一块高度 $\ge w$ 的挡板，设她们围出的格子区间是 $[L,R]$，则显然只有 $[L,R]$ 范围内的位置会受影响。考虑 $x$ 左边的某个位置 $p\ge L$，水从 $p$ 往 $x$ 方向流的过程中最高的挡板会挡住最后剩下的水，因此排水后 $p$ 位置的水位就是 $\max\limits_{j=p}^{x-1}b_j$（这里 $b$ 数组存储的是挡板的高度），因此左半段的水位高度就是挡板的后缀最大值。同理右半段的水位高度就是挡板的前缀最大值。这个东西同样可以线段树维护。

最后考虑修改挡板高度。这个是十分容易的，直接做单点修改即可。

但是题目还需要维护版本信息。常规做法是上可持久化，但是我比较懒，所以我建了版本树，然后在版本树上做 DFS，访问完儿子结点后直接回滚线段树的结点信息即可。

总时间复杂度为 $O(n\log n)$，可以通过该题。代码实现过程中注意访问以及下传左右子树标记的顺序。

:::success[Code]
大数据结构题代码写注释是好习惯！

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int h[N];

struct Node {
    // val: 当前水位
    // lmx: 区间内所有格子的左挡板的最大高度
    // rmx: 区间内所有格子的右挡板的最大高度
    int l, r, lmx, rmx, val, tag;
    inline void init(int p) { l = r = p, lmx = h[p - 1], rmx = h[p], val = tag = 0; }
} tree[N << 2];

inline Node operator+(const Node &l, const Node &r) {
    return {l.l, r.r, max(l.lmx, r.lmx), max(l.rmx, r.rmx), 0, 0};
}

vector<pair<int, Node>> hist;

int las[N << 2], cur;

inline void save(int rt) {
    if (las[rt] != cur) {
        las[rt] = cur;
        hist.emplace_back(rt, tree[rt]);
    }
}

// 区间推平
inline void set(int rt, int v) {
    save(rt), tree[rt].tag = 1, tree[rt].val = v;
}

// 排水口在区间右侧，从右往左计算水位
inline void el(int rt, int v) {
    save(rt), tree[rt].tag = 2, tree[rt].val = v;
}

// 排水口在区间左侧，从左往右计算水位
inline void er(int rt, int v) {
    save(rt), tree[rt].tag = 3, tree[rt].val = v;
}

inline void pushdown(int rt) {
    if (tree[rt].tag) {
        if (tree[rt].tag == 1) {
            set(rt << 1, tree[rt].val);
            set(rt << 1 | 1, tree[rt].val);
        } else if (tree[rt].tag == 2) {
            el(rt << 1 | 1, tree[rt].val);
            el(rt << 1, max(tree[rt].val, tree[rt << 1 | 1].lmx));
        } else {
            er(rt << 1, tree[rt].val);
            er(rt << 1 | 1, max(tree[rt].val, tree[rt << 1].rmx));
        }
    }
    save(rt);
    tree[rt].tag = tree[rt].val = 0;
}

inline void build(int l, int r, int rt) {
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

// 查询 pos 位置的当前水位
inline int qry(int rt, int pos) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (l == r) return tree[rt].val;
    int mid = l + r >> 1; pushdown(rt);
    return qry((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos);
}

// 在不超过 pos 的位置中，找最靠右的格子 L，使其左侧挡板高度至少为 v
inline int qryL(int rt, int pos, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (l > pos) return -1;
    if (tree[rt].lmx < v) return -1;
    if (l == r) return l;
    int mid = l + r >> 1; pushdown(rt);
    int res = qryL(rt << 1 | 1, pos, v);
    if (~res) return res;
    return qryL(rt << 1, pos, v);
}

// 在不小于 pos 的位置中，找最靠左的格子 R，使其右侧挡板高度至少为 v
inline int qryR(int rt, int pos, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (r < pos) return -1;
    if (tree[rt].rmx < v) return -1;
    if (l == r) return l;
    int mid = l + r >> 1; pushdown(rt);
    int res = qryR(rt << 1, pos, v);
    if (~res) return res;
    return qryR(rt << 1 | 1, pos, v);
}

// 区间推平
inline void mdf(int rt, int ll, int rr, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return set(rt, v);
    int mid = l + r >> 1; pushdown(rt);
    if (ll <= mid) mdf(rt << 1, ll, rr, v);
    if (mid < rr) mdf(rt << 1 | 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

// 处理排水口左边的区间
inline void mdfL(int rt, int ll, int rr, int &v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return el(rt, v), (void)(v = max(v, tree[rt].lmx));
    int mid = l + r >> 1; pushdown(rt);
    if (mid < rr) mdfL(rt << 1 | 1, ll, rr, v);
    if (ll <= mid) mdfL(rt << 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

// 处理排水口右边的区间
inline void mdfR(int rt, int ll, int rr, int &v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return er(rt, v), (void)(v = max(v, tree[rt].rmx));
    int mid = l + r >> 1; pushdown(rt);
    if (ll <= mid) mdfR(rt << 1, ll, rr, v);
    if (mid < rr) mdfR(rt << 1 | 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

// 修改某一格的左挡板
inline void mdfwL(int rt, int pos, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (l == r) return save(rt), (void)(tree[rt].lmx = v);
    int mid = l + r >> 1; pushdown(rt);
    mdfwL((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos, v);
    save(rt), tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

// 修改某一格的右挡板
inline void mdfwR(int rt, int pos, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (l == r) return save(rt), (void)(tree[rt].rmx = v);
    int mid = l + r >> 1; pushdown(rt);
    mdfwR((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos, v);
    save(rt), tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

int res[N];

struct Info { int id, x, h; } op[N];

inline void apply(int id) {
    if (op[id].id == 0) {
        // cover
        if (qry(1, op[id].x) >= op[id].h) return;
        mdf(1, qryL(1, op[id].x, op[id].h), qryR(1, op[id].x, op[id].h), op[id].h);
    } else if (op[id].id == 1) {
        int h = qry(1, op[id].x);
        int L = qryL(1, op[id].x, h), R = qryR(1, op[id].x, h);
        { int v = 0; mdfL(1, L, op[id].x, v); }
        { int v = 0; mdfR(1, op[id].x, R, v); }
    } else if (op[id].id == 2) {
        mdfwR(1, op[id].x, op[id].h);
        mdfwL(1, op[id].x + 1, op[id].h);
    } else res[id] = qry(1, op[id].x);
}

vector<int> adj[N];

inline void undo(int snap) {
    while (hist.size() > snap) {
        tree[hist.back().first] = hist.back().second;
        hist.pop_back();
    }
}

inline void dfs(int u) {
    int snap = hist.size();
    if (u) cur = u, apply(u);
    for (int &v : adj[u]) dfs(v);
    undo(snap);
}

inline void sol() {
    int n, q; cin >> n >> q;
    for (int i = 1; i < n; ++i) cin >> h[i];
    h[0] = h[n] = inf;
    build(1, n, 1);
    for (int i = 1; i <= q; ++i) {
        int fa; cin >> op[i].id >> fa >> op[i].x;
        if (op[i].id == 0 || op[i].id == 2) cin >> op[i].h;
        adj[fa].emplace_back(i);
    } dfs(0);
    for (int i = 1; i <= q; ++i)
        if (op[i].id == 3) cout << res[i] << '\n';
}

} // namespace lowspeed_song
```
:::

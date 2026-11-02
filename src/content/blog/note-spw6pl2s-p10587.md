---
title: "P10587 「ALFR Round 2」C 小 Y 的数 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p10587"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "图论", "树"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P10587).
:::

:::info[Solution]{open}
考虑势能线段树。在线段树的每个结点上维护其对应区间的最大值，最小值，区间内所有数最小加多少可以存在至少一个数是好的，以及取到最小值的数的数量有多少四个信息。推平操作直接维护，加操作上势能，乘操作特判乘 $1$ 后其余情况在推平前对单点最多执行 $O(\log V)$ 次而推平之后势能就是对的了。

上述做法时间复杂度为 $O(n\log^2n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], nxt[N];

struct Node {
    int l, r, mi, mx, dis, cnt, add, cov;
    // dis: 最小的 nxt[a[i]]   cnt: 出现次数
    inline void init(int p) { l = r = p, mi = mx = a[p], dis = nxt[a[l]], cnt = 1, add = cov = 0; }
    inline void set(int x) { mi = mx = x, dis = nxt[x], cnt = r - l + 1, cov = x, add = 0; }
    inline void psh(int x) { mi += x, mx += x, dis -= x; if (cov) cov += x; else add += x; }
} tree[N << 2];

inline Node operator+(const Node &l, const Node &r) {
    Node res;
    res.l = l.l, res.r = r.r, res.mi = min(l.mi, r.mi), res.mx = max(l.mx, r.mx);
    res.dis = min(l.dis, r.dis), res.add = res.cov = 0, res.cnt = 0;
    if (res.dis == l.dis) res.cnt += l.cnt; 
    if (res.dis == r.dis) res.cnt += r.cnt;
    return res;
}

inline void pushdown(int rt) {
    if (tree[rt].cov) tree[rt << 1].set(tree[rt].cov), tree[rt << 1 | 1].set(tree[rt].cov), tree[rt].cov = 0;
    if (tree[rt].add) tree[rt << 1].psh(tree[rt].add), tree[rt << 1 | 1].psh(tree[rt].add), tree[rt].add = 0;
}

inline void build(int l, int r, int rt) {
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1; build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline void mdfadd(int rt, int ll, int rr, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) {
        if (tree[rt].mi == tree[rt].mx) return tree[rt].set(tree[rt].mi + v);
        if (v <= tree[rt].dis) return tree[rt].psh(v);
    }
    int mid = l + r >> 1; pushdown(rt);
    if (ll <= mid) mdfadd(rt << 1, ll, rr, v);
    if (mid < rr) mdfadd(rt << 1 | 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline void mdfcov(int rt, int ll, int rr, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].set(v);
    int mid = l + r >> 1; pushdown(rt);
    if (ll <= mid) mdfcov(rt << 1, ll, rr, v);
    if (mid < rr) mdfcov(rt << 1 | 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline void mdfmul(int rt, int ll, int rr, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr && tree[rt].mi == tree[rt].mx) return tree[rt].set(tree[rt].mi * v);
    int mid = l + r >> 1; pushdown(rt);
    if (ll <= mid) mdfmul(rt << 1, ll, rr, v);
    if (mid < rr) mdfmul(rt << 1 | 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline int qry(int rt, int ll, int rr) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].dis ? 0 : tree[rt].cnt;
    int mid = l + r >> 1, res = 0; pushdown(rt);
    if (ll <= mid) res = qry(rt << 1, ll, rr);
    if (mid < rr) res += qry(rt << 1 | 1, ll, rr);
    return res;
}

inline void sol() {
    int n, m; cin >> n >> m;
    constexpr int good[] = {42, 424, 4242, 42424, 424242, 50001};
    for (int i = 1, j = 0; i <= 500000; ++i) {
        while (good[j] < i) ++j;
        nxt[i] = good[j] - i;
    }
    for (int i = 1; i <= n; ++i) cin >> a[i];
    build(1, n, 1);
    while (m--) {
        int o; cin >> o;
        if (o == 1) {
            int l, r, x; cin >> l >> r >> x;
            mdfadd(1, l, r, x);
        } else if (o == 2) {
            int l, r, x; cin >> l >> r >> x;
            if (x > 1) mdfmul(1, l, r, x);
        } else if (o == 3) {
            int l, r, x; cin >> l >> r >> x;
            mdfcov(1, l, r, x);
        } else {
            int l, r; cin >> l >> r;
            cout << qry(1, l, r) << '\n';
        }
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：3

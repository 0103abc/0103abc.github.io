---
title: "P13780 「o.OI R2」愿天堂没有分块 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p13780"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "基础算法", "二分"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P13780).
:::

:::info[Solution]{open}
有点板了。套路的，先求出 $O(n)$ 个极小 mex 区间，然后考虑离线扫描线。把所有询问按照左端点从大到小处理，然后同时扫描线 $p=n,n-1,\ldots,1$ 即扫描线左端点维度。扫描到 $p$ 点时，把所有满足左端点 $l=p$ 的极小 MEX 区间加入到数据结构中。于是处理询问 $[L,R]$ 时，只需要处理数据结构中右端点 $r\le R$ 的子区间 $[l,r]$ 即可。

考虑对每个 MEX 值，维护 $mi_x=\min\lbrace r\mid(l,r,x){ \scriptsize\mathbb{已被加入}}{\tiny\:}\rbrace$。则对于询问 $[L,R]$，$x$ 能够再询问内部出现当且仅当 $mi_x\le R$。因此只需要对每个询问找出最小的 $x$ 使得 $mi_x>R$ 即可。

考虑具体实现这个黑盒数据结构。用一个值域线段树，对每个 MEX 值 $x$，保存 $mi_x$ 的值，每个非叶子结点维护其为根的子树中所有叶子结点的 $mi_x$ 最大值。这样每次查询直接在线段树结构上二分即可，更新极小 MEX 区间 $(l,r,x)$ 只需要执行操作 $mi_x\leftarrow\min(mi_x,r)$。这是一个单点修改操作，因此普通线段树即可维护。

总时间复杂度为 $O(n\log n)$，可以通过本题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], res[N], root[N];
vector<int> pos[N];
vector<pair<int, int>> seg[N], cand[N];
struct Query { int l, r, id; } Q[N];

int idx;
struct Node {
    int l, r, mi;
} tree[N * 24];

inline int build(int l, int r) {
    int rt = ++idx;
    tree[rt].mi = tree[rt].l = tree[rt].r = 0;
    if (l == r) return rt;
    int mid = l + r >> 1;
    tree[rt].l = build(l, mid);
    tree[rt].r = build(mid + 1, r);
    return rt;
}

inline int mdf(int p, int l, int r, int pos, int val) {
    int rt = ++idx;
    tree[rt] = tree[p];
    if (l == r) return tree[rt].mi = val, rt;
    int mid = l + r >> 1;
    if (pos <= mid) tree[rt].l = mdf(tree[p].l, l, mid, pos, val);
    else tree[rt].r = mdf(tree[p].r, mid + 1, r, pos, val);
    tree[rt].mi = min(tree[tree[rt].l].mi, tree[tree[rt].r].mi);
    return rt;
}

inline int qry(int rt, int l, int r, int lim) {
    if (l == r) return l;
    int mid = l + r >> 1;
    if (tree[tree[rt].l].mi < lim) return qry(tree[rt].l, l, mid, lim);
    return qry(tree[rt].r, mid + 1, r, lim);
}

inline void norm(vector<pair<int, int>> &v) {
    sort(v.begin(), v.end(), [&](const pair<int, int> &l, const pair<int, int> &r) {
        if (l.first != r.first) return l.first < r.first;
        return l.second > r.second;
    });
    v.erase(unique(v.begin(), v.end()), v.end());
    vector<pair<int, int>> tmp;
    int m = (int)v.size();
    vector<int> suf(m + 1, 1e9);
    for (int j = m - 1; j >= 0; --j)
        suf[j] = min(suf[j + 1], v[j].second);
    for (int j = 0; j < m; ++j)
        if (suf[j + 1] > v[j].second)
            tmp.emplace_back(v[j]);
    v.swap(tmp);
}

namespace SegTree {
    struct Node {
        int l, r, mx;
        inline void init(int p) { l = r = p, mx = 1e9; }
        inline void push(int v) { mx = min(mx, v); }
    } tree[N << 2];
    inline Node operator+(const Node &l, const Node &r) {
        return {l.l, r.r, max(l.mx, r.mx)};
    }
    inline void build(int l, int r, int rt) {
        if (l == r) return tree[rt].init(l);
        int mid = l + r >> 1;
        build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    inline void mdf(int rt, int pos, int v) {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (l == r) return tree[rt].push(v);
        int mid = l + r >> 1;
        mdf((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos, v);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    inline int find(int rt, int ll, int rr, int v) {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (l == r) return l;
        if (tree[rt << 1].mx > v) return find(rt << 1, ll, rr, v);
        return find(rt << 1 | 1, ll, rr, v);
    }
}

inline void sol() {
    int n, q; cin >> n >> q;
    for (int i = 1; i <= n; ++i) cin >> a[i], --a[i], pos[a[i]].emplace_back(i);
    root[0] = build(0, n + 1);
    for (int i = 1; i <= n; ++i) {
        if (a[i] > n + 1) root[i] = root[i - 1];
        else root[i] = mdf(root[i - 1], 0, n + 1, a[i], i);
    }
    for (int i = 1; i <= n; ++i)
        if (a[i]) cand[0].emplace_back(i, i);
        else cand[1].emplace_back(i, i);
    for (int i = 0; i <= n; ++i) {
        norm(cand[i]);
        seg[i].swap(cand[i]);
        if (i == n) continue;
        for (auto &[l, r] : seg[i]) {
            int L = 0, R = (int)pos[i].size() - 1, best = -1;
            while (L <= R) {
                int mid = L + R >> 1;
                if (pos[i][mid] < l) best = mid, L = mid + 1;
                else R = mid - 1;
            }
            if (~best) {
                int xl = pos[i][best], xr = r;
                int mex = qry(root[xr], 0, n + 1, xl);
                if (mex <= n) cand[mex].emplace_back(xl, xr);
            }
            L = 0, R = (int)pos[i].size() - 1, best = -1;
            while (L <= R) {
                int mid = L + R >> 1;
                if (pos[i][mid] > r) best = mid, R = mid - 1;
                else L = mid + 1;
            }
            if (~best) {
                int xl = l, xr = pos[i][best];
                int mex = qry(root[xr], 0, n + 1, xl);
                if (mex <= n) cand[mex].emplace_back(xl, xr);
            }
        }
    }
    for (int i = 1; i <= q; ++i) cin >> Q[i].l >> Q[i].r, Q[i].id = i;
    sort(Q + 1, Q + q + 1, [&](auto &l, auto &r) { return l.l > r.l; });
    vector<tuple<int, int, int>> sweep;
    for (int i = 0; i <= n; ++i)
        for (auto &[l, r] : seg[i]) sweep.emplace_back(l, r, i);
    sort(sweep.begin(), sweep.end(), [&](auto &l, auto &r) { return get<0>(l) > get<0>(r); });
    SegTree::build(0, n + 1, 1);
    int p = 0;
    for (int i = 1; i <= q; ++i) {
        while (p < sweep.size() && get<0>(sweep[p]) >= Q[i].l)
            SegTree::mdf(1, get<2>(sweep[p]), get<1>(sweep[p])), ++p;
        res[Q[i].id] = SegTree::find(1, 0, n + 1, Q[i].r) + 1;
    }
    for (int i = 1; i <= q; ++i) cout << res[i] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：2

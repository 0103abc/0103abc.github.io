---
title: "P14268 [ROI 2015 Day2] 路灯 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p14268"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P14268)
:::

:::info[Solution]{open}
问题可以被转化为从开始到当前时刻，至少有一次全部亮的区间的数量。因此容易想到维护历史信息。

记 $f_i$ 表示历史上以 $i$ 为左端点，能够全部亮的最远右端点是什么。如果 $i$ 位置的路灯从未亮起，则记 $f_i=i-1$。那么答案就可以被表示为 $\sum\limits_{i=1}^n(f_i-i+1)$。

考虑处理修改。把一段区间的灯全部弄坏是简单的，不需要处理历史数组 $f$ 的全部信息，只需要修改当前灯的状态即可。

然后考虑把一段区间的灯全部修改的操作。用 ODT 来动态维护当前所有的连续全 $1$ 段。对一个区间 $[l,r]$ 而言，其会和本来就亮着的灯组成一个更大的全 $1$ 段 $[L,R]\supseteq [l,r]$。那么对每个 $i\in[L,R]$，区间 $[i,R]$ 都是正常工作的，因此执行操作 $f_i\leftarrow \max(f_i,R)$（$i\in[L,R]$）即可。

$f$ 数组需要支持区间查询和区间对不固定常数取 $\max$ 两个操作，套路的用 Jiry 线段树维护即可。总时间复杂度为 $O(n\log n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N];
char s[N];

struct Node {
    int l, r, sum, mx, tag;
    inline void init(int p) { l = r = p, mx = sum = a[p], tag = -1; }
    inline void push(int v) { sum = (r - l + 1) * v, mx = tag = v; }
} tree[N << 2];

inline Node operator+(const Node &l, const Node &r) {
    return {l.l, r.r, l.sum + r.sum, max(l.mx, r.mx), -1};
}

inline void build(int l, int r, int rt) {
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    build(l, mid, rt << 1);
    build(mid + 1, r, rt << 1 | 1);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline void pushdown(int rt) {
    if (~tree[rt].tag) {
        tree[rt << 1].push(tree[rt].tag);
        tree[rt << 1 | 1].push(tree[rt].tag);
        tree[rt].tag = -1;
    }
}

inline void mdf(int rt, int ll, int rr, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].push(v);
    int mid = l + r >> 1; pushdown(rt);
    if (ll <= mid) mdf(rt << 1, ll, rr, v);
    if (mid < rr) mdf(rt << 1 | 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline int find(int rt, int ll, int rr, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (r < ll || rr < l) return -1;
    if (tree[rt].mx < v) return -1;
    if (l == r) return l;
    int mid = l + r >> 1; pushdown(rt);
    int res = find(rt << 1, ll, rr, v);
    if (~res) return res;
    return find(rt << 1 | 1, ll, rr, v);
}



inline void sol() {
    int n, q; cin >> n >> q;
    scanf("%s", s + 1);
    set<pair<int, int>> seg;
    for (int i = 1; i <= n; ++i) {
        if (s[i] == '0') a[i] = i - 1;
        else {
            int j = i;
            while (j < n && s[j + 1] == '1') ++j;
            seg.emplace(i, j);
            for (int k = i; k <= j; ++k) a[k] = j;
            i = j;
        }
    } build(1, n, 1);
    cout << tree[1].sum - n * (n - 1) / 2 << '\n';
    function<void(int, int)> turn_off = [&](int l, int r) {
        auto it = seg.lower_bound({l, -1});
        if (it != seg.begin() && prev(it)->second >= l) it = prev(it);
        vector<pair<int, int>> add;
        while (it != seg.end() && it->first <= r) {
            int L = it->first, R = it->second;
            it = seg.erase(it);
            if (L < l) add.emplace_back(L, l - 1);
            if (r < R) add.emplace_back(r + 1, R);
        } for (auto &[l, r] : add) seg.emplace(l, r);
    };
    function<pair<int, int>(int, int)> turn_on = [&](int l, int r) {
        auto it = seg.lower_bound({l, -1});
        int L = l, R = r;
        if (it != seg.begin() && prev(it)->second + 1 >= l) it = prev(it);
        while (it != seg.end() && it->first <= R + 1)
            L = min(L, it->first), R = max(R, it->second), it = seg.erase(it);
        seg.emplace(L, R);
        return pair<int, int>{L, R};
    };
    while (q--) {
        int l, r, c; cin >> l >> r >> c;
        if (!c) turn_off(l, r);
        else {
            auto [L, R] = turn_on(l, r);
            int p = find(1, L, R, R);
            if (p == -1) p = R + 1;
            if (p > L) mdf(1, L, p - 1, R);
       } cout << tree[1].sum - n * (n - 1) / 2 << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：5

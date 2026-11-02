---
title: "P14761 [Opoi 2025] CCD 的序列 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p14761"
categories: ["题解"]
tags: ["洛谷", "数据结构", "平衡树", "基础算法", "前缀和"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P14761)
:::

:::info[Solution]{open}
大份题目。套路的把左括号 `(` 的权值设为 $1$，右括号 `)` 的权值设为 $-1$，然后用 fhq treap 来维护这个括号序列的权值。对一次插入操作 $l,r$ 而言，特判掉 $l=r$ 的情况，然后记 $[l+1,r]$ 区间中有 $a$ 个没匹配的左括号和 $b$ 个没匹配的右括号，则插入的左括号会让 $b$ 个没匹配的右括号在原串中匹配的左括号向前移动一个，右括号对左括号的影响也是同样的。此时插入的最内层左右括号就会匹配。因此答案就可以被表示为 $2(a+b)$。

$a,b$ 的信息是容易计算的，$a$ 就是序列权值后缀和的最大值，$b$ 就是序列权值前缀和的相反数的最大值，直接在 fhq treap 上维护即可。时间复杂度为 $O(n\log n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

struct Node {
    int l, r, siz, key, val, sum, lmi, rmx;
    inline Node() {
        l = r = siz = key = val = sum = lmi = rmx = 0;
    }
} tree[N];
inline void upd(int rt) {
    tree[rt].siz = 1 + tree[tree[rt].l].siz + tree[tree[rt].r].siz;
    tree[rt].sum = tree[rt].val + tree[tree[rt].l].sum + tree[tree[rt].r].sum;
    tree[rt].lmi = min(tree[tree[rt].l].lmi, tree[tree[rt].l].sum + tree[rt].val + tree[tree[rt].r].lmi);
    tree[rt].rmx = max(tree[tree[rt].r].rmx, tree[tree[rt].r].sum + tree[rt].val + tree[tree[rt].l].rmx);
}
int cnt = 0;
inline int newnode(int v) {
    ++cnt, tree[cnt].val = tree[cnt].sum = v, tree[cnt].siz = 1, tree[cnt].key = rand();
    tree[cnt].lmi = min<int>(0, v), tree[cnt].rmx = max<int>(0, v);
    return cnt;
}
inline int merge(int x, int y) {
    if (!x || !y) return x | y;
    if (tree[x].key < tree[y].key) {
        tree[x].r = merge(tree[x].r, y);
        upd(x);
        return x;
    } else {
        tree[y].l = merge(x, tree[y].l);
        upd(y);
        return y;
    }
}
inline pair<int, int> split(int rt, int k) {
    if (!rt) return {0, 0};
    if (tree[tree[rt].l].siz + 1 <= k) {
        auto res = split(tree[rt].r, k - tree[tree[rt].l].siz - 1);
        tree[rt].r = res.first;
        upd(rt);
        return {rt, res.second};
    } else {
        auto res = split(tree[rt].l, k);
        tree[rt].l = res.second;
        upd(rt);
        return {res.first, rt};
    }
}
inline int qmin(int &rt, int l, int r) {
    auto res = split(rt, r);
    auto res2 = split(res.first, l - 1);
    int val = tree[res2.second].lmi;
    rt = merge(merge(res2.first, res2.second), res.second);
    return val;
}
inline int qmax(int &rt, int l, int r) {
    auto res = split(rt, r);
    auto res2 = split(res.first, l - 1);
    int val = tree[res2.second].rmx;
    rt = merge(merge(res2.first, res2.second), res.second);
    return val;
}
inline void ins(int &rt, int pos, int v) {
    auto res = split(rt, pos);
    rt = merge(merge(res.first, newnode(v)), res.second);
}

inline void sol() {
    int n, rt = 0; cin >> n;
    for (int i = 1; i <= n; ++i) {
        int l, r; cin >> l >> r;
        if (l == r) {
            cout << 0 << '\n';
            ins(rt, l, -1), ins(rt, l, 1);
        } else {
            cout << 2 * (qmax(rt, l + 1, r) - qmin(rt, l + 1, r)) << '\n';
            ins(rt, r, -1), ins(rt, l, 1);
        }
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：-2

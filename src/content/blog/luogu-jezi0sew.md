---
title: "CF895E Eyes Closed 题解"
date: "2025-02-13T05:29:50.000Z"
link: "luogu-jezi0sew"
categories: ["题解"]
tags: ["Codeforces", "数学", "概率与期望", "数据结构", "线段树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/jezi0sew)。

这真的不是 AT_abc331_f？

考虑维护每一个数的值的期望。初始时时候显然 $i$ 位置的值期望为 $a_i$。

现在对于一次对 $[l_1,r_1],[l_2,r_2]$ 执行的操作。现在定义 $s_1=\sum\limits_{i=l_1}^{r_1}a_i,s_2=\sum\limits_{i=l_2}^{r_2}a_i$。分别考虑两个区间内元素期望值的变化：

1. 计算区间 $[l_1,r_1]$ 内值的期望变化。

区间 $[l_2,r_2]$ 中选择一个数的期望值为 $\frac{s_2}{r_2-l_2+1}$，和区间 $[l_1,r_1]$ 内某一个值交换的概率为 $\frac{1}{r_1-l_1+1}$。因此 $[l_1,r_1]$ 中某一个值 $i\in[l_1,r_1]$ 期望值有 $\frac{1}{r_1-l_1+1}$ 的概率变为 $\frac{s_2}{r_2-l_2+1}$，有 $\frac{r_1-l_1}{r_1-l_1+1}$ 的概率不变。

即 $\forall i\in[l_1,r_1],a'_i=\frac{1}{r_1-l_1+1}\times\frac{s_2}{r_2-l_2+1}+\frac{r_1-l_1}{r_1-l_1+1}\times a_i$。

2. 计算区间 $[l_2,r_2]$ 内值的期望变化。

该部分同理：区间 $[l_1,r_1]$ 中选择一个数的期望值为 $\frac{s_1}{r_1-l_1+1}$，和区间 $[l_2,r_2]$ 内某一个值交换的概率为 $\frac1{r_2-l_2+1}$。因此 $[l_2,r_2]$ 中某一个值 $i\in[l_2,r_2]$ 期望值有 $\frac1{r_2-l_2+1}$ 的概率变为 $\frac{s_1}{r_1-l_1+1}$，有 $\frac{r_2-l_2}{r_2-l_2+1}$ 的概率不变。

即 $\forall i\in[l_2,r_2],a_i'=\frac{1}{r_2-l_2+1}\times\frac{s_1}{r_1-l_1+1}+\frac{r_2-l_2}{r_2-l_2+1}\times a_i$。

问题即区间乘区间加区间求和，使用两个懒标记的线段树维护即可。时间复杂度为 $O(n\log n)$ 可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 200010;
const int mod = 1e9 + 7;
int a[N];
struct Node {
    int l, r;
    double sum, add, mul;
    void init(int p) {
        l = r = p;
        sum = a[p];
        add = 0, mul = 1;
    }
    void push(double ladd, double lmul) {
        sum = sum * lmul + ladd * (r - l + 1);
        mul *= lmul;
        add = add * lmul + ladd;
    }
} tree[N << 2];
Node operator+(const Node &l, const Node &r) {
    return {l.l, r.r, l.sum + r.sum, 0.0, 1.0};
}
void build(int l, int r, int rt) {
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    build(l, mid, rt << 1);
    build(mid + 1, r, rt << 1 | 1);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}
void pushdown(int rt) {
    if (tree[rt].add != 0 || tree[rt].mul != 1) {
        tree[rt << 1].push(tree[rt].add, tree[rt].mul);
        tree[rt << 1 | 1].push(tree[rt].add, tree[rt].mul);
        tree[rt].add = 0, tree[rt].mul = 1;
    }
}
void modifyadd(int rt, int ll, int rr, double v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].push(v, 1.0);
    int mid = l + r >> 1;
    pushdown(rt);
    if (ll <= mid) modifyadd(rt << 1, ll, rr, v);
    if (mid < rr) modifyadd(rt << 1 | 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}
void modifymul(int rt, int ll, int rr, double v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].push(0.0, v);
    int mid = l + r >> 1;
    pushdown(rt);
    if (ll <= mid) modifymul(rt << 1, ll, rr, v);
    if (mid < rr) modifymul(rt << 1 | 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}
double query(int rt, int ll, int rr) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].sum;
    int mid = l + r >> 1;
    double sum = 0;
    pushdown(rt);
    if (ll <= mid) sum = query(rt << 1, ll, rr);
    if (mid < rr) sum += query(rt << 1 | 1, ll, rr);
    return sum;
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    build(1, n, 1);
    while (q--) {
        int o;
        cin >> o;
        if (o == 1) {
            int l1, r1, l2, r2;
            cin >> l1 >> r1 >> l2 >> r2;
            double s1 = query(1, l1, r1), s2 = query(1, l2, r2);
            modifymul(1, l1, r1, 1. * (r1 - l1) / (r1 - l1 + 1));
            modifyadd(1, l1, r1, 1. / (r1 - l1 + 1) * s2 / (r2 - l2 + 1));
            modifymul(1, l2, r2, 1. * (r2 - l2) / (r2 - l2 + 1));
            modifyadd(1, l2, r2, 1. / (r2 - l2 + 1) * s1 / (r1 - l1 + 1));
        } else {
            int l, r;
            cin >> l >> r;
            cout << query(1, l, r) << '\n';
        }
    }
    return 0;
}
```

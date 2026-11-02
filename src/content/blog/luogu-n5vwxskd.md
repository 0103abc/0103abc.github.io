---
title: "CF1420D Rescue Nibel! 题解"
date: "2025-03-01T12:53:29.000Z"
link: "luogu-n5vwxskd"
categories: ["题解"]
tags: ["Codeforces", "数学", "组合数学", "数据结构", "线段树"]
draft: false
---

一个很神经病的做法。显然可以考虑枚举每一段最小单位长度的区间，然后记录有多少种不同的选 $k$ 条线段的方法包含这一段区间。显然这样会计算重复。

问题变为怎么不让答案计算重。考虑从左往右枚举每一个最小单位长度的段，设其左端点为 $l$，则只需要让所有线段不同时覆盖 $l$ 左侧的段落即可。因此只需要钦定当前选择的全部 $k$ 个区间中包含一个区间使得其左端点为 $l$。假设当前知道当前单位区间 $l$ 点有 $m$ 个覆盖的线段，以 $m$ 为左端点的线段数量为 $c$，则考虑容斥，用总方案数减去不合法方案数，显然为 $\binom{m}{k}-\binom{m-c}{k}$。用线段树维护每一个单位区间被多少条线段覆盖，开桶记录每一个单位区间是多少区间的左端点，然后直接套用公式计算答案即可。时间复杂度为 $O(n\log n)$ 可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <iostream>
#include <algorithm>
#define int long long
using namespace std;
const int N = 600010;
int l[N], r[N], tmp[N], buc[N];
int fac[N], inv[N], ifac[N];
const int mod = 998244353;
int binom(int x, int y) {
    if (y < 0 || x < y) return 0;
    return fac[x] * ifac[y] % mod * ifac[x - y] % mod;
}
struct Node {
    int l, r, sum, tag;
    void init(int p) {
        l = r = p;
        sum = tag = 0;
    }
    void push(int v) {
        sum += (r - l + 1) * v;
        tag += v;
    }
} tree[N << 2];
Node operator+(const Node &l, const Node &r) {
    return {l.l, r.r, l.sum + r.sum, 0};
}
void build(int l, int r, int rt) {
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    build(l, mid, rt << 1);
    build(mid + 1, r, rt << 1 | 1);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}
void pushdown(int rt) {
    if (tree[rt].tag) {
        tree[rt << 1].push(tree[rt].tag);
        tree[rt << 1 | 1].push(tree[rt].tag);
        tree[rt].tag = 0;
    }
}
void modify(int rt, int ll, int rr, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].push(v);
    int mid = l + r >> 1; pushdown(rt);
    if (ll <= mid) modify(rt << 1, ll, rr, v);
    if (mid < rr) modify(rt << 1 | 1, ll, rr, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}
int query(int rt, int ll, int rr) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].sum;
    int mid = l + r >> 1, s = 0; pushdown(rt);
    if (ll <= mid) s = query(rt << 1, ll, rr);
    if (mid < rr) s += query(rt << 1 | 1, ll, rr);
    return s;
}
int vis[N];
void solve() {
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; ++i) cin >> l[i] >> r[i];
    for (int i = 0; i < 2; ++i) fac[i] = inv[i] = ifac[i] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
    int sum = 0, idx = 0;
    for (int i = 1; i <= n; ++i) tmp[++idx] = l[i], tmp[++idx] = r[i];
    sort(tmp + 1, tmp + idx + 1);
    idx = unique(tmp + 1, tmp + idx + 1) - tmp - 1;
    build(1, idx, 1);
    for (int i = 1; i <= n; ++i) l[i] = lower_bound(tmp + 1, tmp + idx + 1, l[i]) - tmp;
    for (int i = 1; i <= n; ++i) r[i] = lower_bound(tmp + 1, tmp + idx + 1, r[i]) - tmp;
    for (int i = 1; i <= n; ++i) modify(1, l[i], r[i], 1);
    for (int i = 1; i <= n; ++i) ++buc[l[i]];
    for (int i = 1; i <= n; ++i) {
        if (vis[l[i]]) continue;
        int m = query(1, l[i], l[i]), cnt = buc[l[i]];
        vis[l[i]] = 1;
        sum = (sum + binom(m, k) + mod - binom(m - cnt, k) % mod) % mod;
    }
    cout << sum << '\n';
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int T;
    // cin >> T;
    T = 1;
    while (T--) { 
        solve();
    }
    return 0;
}
```

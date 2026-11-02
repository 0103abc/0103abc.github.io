---
title: "P12866 [JOI Open 2025] 抽奖 / Lottery 题解"
date: "2026-05-15T05:45:35.000Z"
link: "luogu-ng0txe27"
categories: ["题解"]
tags: ["洛谷", "基础算法", "二分", "模拟", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ng0txe27)。

直接做是困难的，考虑二分答案，问题变为判定玩家是否可以中 $p$ 次奖。简单调整分析后可以发现对给定的区间 $[L,R]$ 而言 $p$ 合法的充要条件是：

+ $0\le p\le\min\limits_{i=L}^R(x_i+y_i)$
+ $\sum\limits_{i=L}^R\min(x_i,p)\ge p\times\frac{R-L+1}2$
+ $\sum\limits_{i=L}^R\min(y_i,p)\ge p\times\frac{R-L+1}2$

直接模拟上述过程可以做到 $O(nQ\log n)$ 时间复杂度，考虑优化。分别维护三个条件是否成立，第一个条件直接 ST 表求区间静态最值，第二、三个条件都可以直接在主席树上二分，然后取三个条件的 $\min$ 值就是最大合法的 $p$ 值。时空复杂度均为 $O((n+Q)\log n)$，可以通过该题。

```cpp line-numbers
#define int long long
int n, q, x[N], y[N], lg[N], st[N][20], pre[2][N], rt[2][N], idx;
struct Node {
    int l, r, cnt, sum;
} tree[N * 80];
void pushup(int p) {
    tree[p].cnt = tree[tree[p].l].cnt + tree[tree[p].r].cnt;
    tree[p].sum = tree[tree[p].l].sum + tree[tree[p].r].sum;
}

inline int ins(int rt, int l, int r, int pos) {
    int pp = ++idx;
    tree[pp] = tree[rt];
    if (l == r) {
        ++tree[pp].cnt, tree[pp].sum += pos;
        return pp;
    }
    int mid = l + r >> 1;
    if (pos <= mid) tree[pp].l = ins(tree[pp].l, l, mid, pos);
    else tree[pp].r = ins(tree[pp].r, mid + 1, r, pos);
    pushup(pp);
    return pp;
}

inline int chk(int small_cnt, int small_sum, int t, int len) {
    int lhs = small_sum + 1ll * t * (len - small_cnt);
    int rhs = 1ll * t * len / 2;
    return lhs >= rhs;
}

inline int query(int rt1, int rt2, int l, int r, int small_cnt, int small_sum, int len) {
    if (l == r) {
        small_cnt += tree[rt2].cnt - tree[rt1].cnt;
        small_sum += tree[rt2].sum - tree[rt1].sum;
        return chk(small_cnt, small_sum, l, len) ? l : -1;
    }
    int mid = l + r >> 1;
    int L1 = tree[rt1].l, L2 = tree[rt2].l;
    int left_cnt = tree[L2].cnt - tree[L1].cnt;
    int left_sum = tree[L2].sum - tree[L1].sum;
    if (chk(small_cnt + left_cnt, small_sum + left_sum, mid, len)) {
        int res = query(tree[rt1].r, tree[rt2].r, mid + 1, r, small_cnt + left_cnt, small_sum + left_sum, len);
        return !~res ? mid : res;
    } else return query(tree[rt1].l, tree[rt2].l, l, mid, small_cnt, small_sum, len);
}
#undef int
void init(int N, int Q, vector<int> X, vector<int> Y) {
    n = N, q = Q;
    for (int i = 1; i <= n; ++i) x[i] = X[i - 1], y[i] = Y[i - 1];
    lg[0] = -1; for (int i = 1; i <= n; ++i) st[i][0] = x[i] + y[i], lg[i] = lg[i >> 1] + 1;
    for (int i = 1; i < 20; ++i) for (int j = 1; j <= n - (1 << i) + 1; ++j)
        st[j][i] = min(st[j][i - 1], st[j + (1 << (i - 1))][i - 1]);
    for (int i = 1; i <= n; ++i) {
        pre[0][i] = pre[0][i - 1] + x[i], pre[1][i] = pre[1][i - 1] + y[i];
        rt[0][i] = ins(rt[0][i - 1], 0, 2e9, x[i]), rt[1][i] = ins(rt[1][i - 1], 0, 2e9, y[i]);
    }
}

#define int long long
inline int qry(int l, int r) {
    int lgx = lg[r - l + 1];
    return min(st[l][lgx], st[r - (1 << lgx) + 1][lgx]);
}

inline int qmin(int typ, int l, int r) {
    return query(rt[typ][l - 1], rt[typ][r], 0, 2e9, 0, 0, r - l + 1);
}
#undef int
int max_prize(int L, int R) {
    ++L, ++R;
    return min({qry(L, R), qmin(0, L, R), qmin(1, L, R)});
    // long long l = 0, r = inf, best = -1;
    // for (int i = L; i <= R; ++i) r = min<long long>(r, x[i] + y[i]);
    // while (l <= r) {
    //     long long mid = l + r >> 1;
    //     long long sum = 0, sum2 = 0;
    //     for (int i = L; i <= R; ++i) sum += min<long long>(mid, x[i]);
    //     for (int i = L; i <= R; ++i) sum2 += min<long long>(mid, y[i]);
    //     if (min(sum, sum2) >= 1ll * (R - L + 1) / 2 * mid) best = mid, l = mid + 1;
    //     else r = mid - 1;
    // }
    // return best;
}
```

---
title: "P3278 [SCOI2013] 多项式的运算 题解"
date: "2025-04-17T15:50:31.000Z"
link: "luogu-xldw6e1k"
categories: ["题解"]
tags: ["洛谷", "数据结构", "平衡树", "线段树", "图论", "树"]
draft: false
---

比较恶心的 FHQ-Treap 板子题，~~建议先阅读某一个 c 开头 y 结尾的网站再写~~。最后一个操作十分难以维护（~~看着很拉插~~），但是发现这个操作的询问次数不超过 $10$ 次所以就直接暴力计算每一个点的系数然后相乘求答案就行。前两个操作也是简单的，即【模板】线段树 $2$（欸我是不是还没过那题），在平衡树上维护加法标记和乘法标记，在 pushdown 的时候先下传乘法标记再下传加法标记，然后区间加的时候更新加法标记和单点的值，区间乘的时候更新加法标记，乘法标记和单点的值即可。

对于向右平移 $[l,r]$ 的操作，考虑将区间用 split 操作划分为若干部分（非常粗暴的做法）：

[![pEhf639.png](https://s21.ax1x.com/2025/04/17/pEhf639.png)](https://imgse.com/i/pEhf639)

直接五次 split 划分操作划分出 $6$ 个区间，然后把粉色部分的 FHQ Treap 合并入橙色部分的 FHQ Treap 中，左边单独蓝色的区域用一个新的值为 $0$ 的结点覆盖，剩余部分直接平移到绿色部分即可。

特殊的，发现当 $l=r$ 时中间部分出现了长度为负数的区间，这个时候单独特判一下即可。跑的有点慢，但是能过。

```cpp
// #pragma GCC optimize(3,"Ofast","inline","unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/rope>
#define int long long
using namespace std;
const int N = 400010;
const int inf = 2e9;
const int mod = 20130426;
using ull = unsigned long long;
template<class _T>
using treap = __gnu_pbds::tree<_T, __gnu_pbds::null_type, less_equal<_T>, __gnu_pbds::rb_tree_tag, __gnu_pbds::tree_order_statistics_node_update>;
using POD = pair<double, double>;
struct Node {
    int l, r, siz, key, val, add, mul;
} tree[N << 1];
int cnt;
int newnode(int x) {
    ++cnt;
    tree[cnt].siz = 1;
    tree[cnt].key = rand();
    tree[cnt].val = x;
    return cnt;
}
void pushmul(int x, int val) {
    tree[x].mul = tree[x].mul * val % mod;
    tree[x].add = tree[x].add * val % mod;
    tree[x].val = tree[x].val * val % mod;
}
void pushadd(int x, int val) {
    tree[x].add = (tree[x].add + val) % mod;
    tree[x].val = (tree[x].val + val) % mod;
}
void pushdown(int rt) {
    if (tree[rt].mul != 1) {
        if (tree[rt].l) pushmul(tree[rt].l, tree[rt].mul);
        if (tree[rt].r) pushmul(tree[rt].r, tree[rt].mul);
        tree[rt].mul = 1;
    }
    if (tree[rt].add) {
        if (tree[rt].l) pushadd(tree[rt].l, tree[rt].add);
        if (tree[rt].r) pushadd(tree[rt].r, tree[rt].add);
        tree[rt].add = 0;
    }
}
void upd(int rt) {
    tree[rt].siz = tree[tree[rt].l].siz + 1 + tree[tree[rt].r].siz;
}
int merge(int x, int y) {
    if (!x || !y) return x | y;
    if (tree[x].key < tree[y].key) {
        pushdown(x);
        tree[x].r = merge(tree[x].r, y);
        upd(x);
        return x;
    } else {
        pushdown(y);
        tree[y].l = merge(x, tree[y].l);
        upd(y);
        return y;
    }
}
pair<int, int> split(int rt, int k) {
    if (!rt) return {0, 0};
    pushdown(rt);
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
int query(int &rt, int x) {
    auto res = split(rt, x);
    auto res2 = split(res.first, x - 1);
    int val = tree[res2.second].val;
    rt = merge(merge(res2.first, res2.second), res.second);
    return val;
}
signed main() {
    // freopen("1.in", "r", stdin);
    // freopen("1.out", "w", stdout);
    // freopen("debug.err", "w", stderr);
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    srand(time(0));
    int root = 0;
    for (int i = 1; i <= 200005; ++i) root = merge(root, newnode(0));
    int q;
    cin >> q;
    while (q--) {
        string o;
        cin >> o;
        if (o == "mul") {
            int l, r, v;
            cin >> l >> r >> v;
            ++l, ++r;
            auto res = split(root, r);
            auto res2 = split(res.first, l - 1);
            pushmul(res2.second, v);
            root = merge(merge(res2.first, res2.second), res.second);
        } else if (o == "add") {
            int l, r, v;
            cin >> l >> r >> v;
            ++l, ++r;
            auto res = split(root, r);
            auto res2 = split(res.first, l - 1);
            pushadd(res2.second, v);
            root = merge(merge(res2.first, res2.second), res.second);
        } else if (o == "mulx") {
            int l, r;
            cin >> l >> r;
            ++l, ++r;
            // assert(l!=r);
            if (l == r) {
                auto res = split(root, l - 1);
                auto res2 = split(res.second, 1);
                auto res3 = split(res2.second, 1);
                tree[res3.first].val += tree[res2.first].val;
                int nd = newnode(0);
                root = merge(res.first, merge(nd, merge(res3.first, res3.second)));
                continue;
            }
            auto res = split(root, l - 1);
            auto res2 = split(res.second, 1);
            auto res3 = split(res2.second, r - l - 1);
            auto res4 = split(res3.second, 1);
            auto res5 = split(res4.second, 1);
            tree[res5.first].val += tree[res4.first].val;
            tree[res5.first].val %= mod;
            int nd = newnode(0);
            root = merge(res.first, merge(nd, merge(res2.first, merge(res3.first, merge(res5.first, res5.second)))));
        } else {
            int x;
            cin >> x;
            int sum = 0, pwr = 1;
            for (int i = 1; i <= 200005; ++i) {
                sum = (sum + pwr * query(root, i) % mod) % mod;
                // if (query(root, i)) cout << i << ": " << query(root, i) << '\n';
                pwr = pwr * x % mod;
            }
            cout << sum << '\n';
        }
    }
    return 0;
}
```

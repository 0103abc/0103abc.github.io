---
title: "P12179 DerrickLo's Game (UBC002B) 题解"
date: "2025-04-13T17:16:56.000Z"
link: "luogu-e7e3el55"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树"]
draft: false
---

看到代价为平方式，可以想到拆括号列一次函数然后扔到李超线段树中维护，但是这个题和李超线段树没有关系。

观察题目，发现给出的操作十分奇奇怪怪，因此考虑手玩小数据然后观察性质。

容易发现，$2$ 操作若操作的区间为 $[l,r]$，则必须满足 $r-l+1=2$，可以证明其他情况一定不优：

+ $r-l+1=1$，这样的 $2$ 操作显然没用。
+ $r-l+1>2$，则设 $[l,r]$ 区间中某一个最大值所在位置为 $p$，那么依次操作：
  + $[p-1,p],[p-2,p-1],\ldots,[l,l+1]$
  + $[p,p+1],[p+1,p+2],\ldots,[r-1,r]$
  + 上面的两组区间，可以得到和直接操作 $[l,r]$ 等价的效果。此时其代价为 $4(r-l)$，而原代价为 $(r-l+1)^2$。令 $t=r-l$，则两式分别为 $4t$ 和 $(t+1)^2$。做差得 $(t+1)^2-4t=(t-1)^2\ge 0$，因此必然这样转化不会更优。

此时问题就简单了。考虑一个位置 $x$，若其不为区间 $[l,r]$ 最大值，则其是会被 $1$ 操作单独更新还是被 $2$ 操作用相邻的元素更新。设区间最大值为 $M$，则：

+ $1$ 操作代价为 $M-a_x$。
+ $2$ 操作代价为 $4$。

因此若 $M-a_x<4$ 则使用 $1$ 操作更新，否则使用 $2$ 操作更新，一定是一组最优解。

先考虑不带修改怎么做。发现对于每一个区间 $[l,r]$ 只需要处理和其最大值的差 $<4$ 的数的数量即可（不关心其具体在什么位置）。在下标意义上对值域做处理是困难的，但考虑到这样的数的不同值数量不超过 $4$，因此线段树维护区间前 $4$ 大值以及其出现的次数然后一点点判即可。

带修改就是再加个修改操作，总时间复杂度为大常数 $O((n+Q)\log n)$，可以通过。

```cpp
// #pragma GCC optimize(3,"Ofast","inline","unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/rope>
#define int long long
using namespace std;
const int N = 1000010;
const int inf = 2e9;
const int mod = 998244353;
using ull = unsigned long long;
template<class _T>
using treap = __gnu_pbds::tree<_T, __gnu_pbds::null_type, less_equal<_T>, __gnu_pbds::rb_tree_tag, __gnu_pbds::tree_order_statistics_node_update>;
int a[N];
struct Node {
    int l, r;
    int m[5] = {0}, c[5] = {0};
    void init(int p) {
        l = r = p;
        memset(m, 0, sizeof m);
        memset(c, 0, sizeof c);
        m[0] = a[p], c[0] = 1;
    }
} tree[N << 2];
Node operator+(const Node &l, const Node &r) {
    Node res;
    res.l = l.l, res.r = r.r;
    int p1 = 0, p2 = 0;
    for (int i = 0; i < 5; ++i) {
        if (l.m[p1] > r.m[p2]) {
            res.m[i] = l.m[p1];
            res.c[i] = l.c[p1];
            ++p1;
        } else if (l.m[p1] < r.m[p2]) {
            res.m[i] = r.m[p2];
            res.c[i] = r.c[p2];
            ++p2;
        } else {
            res.m[i] = l.m[p1];
            res.c[i] = l.c[p1] + r.c[p2];
            ++p1, ++p2;
        }
        // if (i) assert(res.m[i] != res.m[i - 1]);
    }
    return res;
}
void build(int l, int r, int rt) {
    if (l == r)return tree[rt].init(l);
    int mid = l + r >> 1;
    build(l, mid, rt << 1);
    build(mid + 1, r, rt << 1 | 1);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}
void modi(int rt, int p, int v) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (l == r) {
        tree[rt].m[0] = v;
        tree[rt].c[0] = 1;
        return;
    }
    int mid = l + r >> 1;
    if (p <= mid) modi(rt << 1, p, v);
    else modi(rt << 1 | 1, p, v);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}
Node query(int rt, int ll, int rr) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt];
    int mid = l + r >> 1;
    if (ll <= mid&&mid < rr) return query(rt << 1, ll, rr) + query(rt<<1|1, ll, rr);
    if (ll <= mid) return query(rt<<1, ll, rr);
    return query(rt<<1|1, ll, rr);
}
signed main() {
    // freopen("debug.err", "w", stderr);
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    srand(time(0));
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    build(1, n, 1);
    while (q--) {
        int o;
        cin >> o;
        if (o == 1) {
            int k, x;
            cin >> k >> x;
            a[k] = x;
            modi(1, k, x);
        } else {
            int l, r;
            cin >> l >> r;
            Node t = query(1, l, r);
            assert(t.c[0]);
            if (t.c[0] == r-l+1) cout << "0\n";
            else if (!t.c[1]) cout << "0\n";
            else {
                int len = r - l + 1 - t.c[0], sum = 0;
                for (int i = 1; i < 5; ++i) {
                    if (!t.c[i]) break;
                    assert(t.m[i] < t.m[i - 1]);
                    if (t.m[0] - t.m[i] < 4) sum += (t.m[0] - t.m[i]) * t.c[i], len -= t.c[i];
                }
                sum += len * 4;
                cout << sum << '\n';
            }
        }
    }
    return 0;
}
```

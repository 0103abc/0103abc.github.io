---
title: "CF1705E Mark and Professor Koro 题解"
date: "2025-02-14T14:47:12.000Z"
link: "luogu-blae0me6"
categories: ["题解"]
tags: ["Codeforces", "数据结构", "线段树", "基础算法", "二分", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/blae0me6)。

可以发现题目模拟的其实就是二进制加法和二进制减法。因此考虑用一个线段树来维护每一位的值（$0/1$），然后对于每一个操作：

+ 若要让第 $i$ 位 $+1$，则：
  + 若第 $i$ 位的值本来是 $0$，则直接将其变为 $1$。
  + 否则从 $i$ 开始往后找到第一个为 $0$ 的位 $p$，然后把 $p$ 位变为 $1$，$[i,p-1]$ 一段区间内所有位都变为 $0$。
+ 若要让第 $i$ 位 $-1$，则：
  + 若第 $i$ 位的值本来是 $1$，则直接将其变为 $0$。
  + 否则从 $i$ 开始往后找到第一个为 $1$ 的位 $p$，然后把 $p$ 位变为 $0$，$[i,p-1]$ 一段区间内所有位都变为 $1$。

答案就是从前往后第一个 $1$ 的位。

区间推平可以直接维护 lazy tag 处理，而其余的操作可以用线段树二分处理，但是【】不喜欢线段树二分，因此她选择使用二分套线段树求和，时间复杂度为 $O(n\log^2n)$。使用峮带菜的快读快写然后卡一卡常就能卡过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
// #define int long long
using namespace std;
const int N = 200030;
const int mod = 1e9 + 7;
int a[N], b[N];
struct Node {
    int l, r, sum, tag;
    void init(int p) {
        l = r = p;
        sum = a[p], tag = -1;
    }
    void push(int v) {
        sum = (r - l + 1) * v, tag = v;
    }
};
Node operator+(const Node &l, const Node &r) {
    return {l.l, r.r, l.sum + r.sum, -1};
}
class SegmentTree {
    Node tree[N << 2];
public:
    void pushup(int rt) {
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    void pushdown(int rt) {
        if (~tree[rt].tag) {
            tree[rt << 1].push(tree[rt].tag);
            tree[rt << 1 | 1].push(tree[rt].tag);
            tree[rt].tag = -1;
        }
    }
    void build(int l, int r, int rt) {
        if (l == r) return tree[rt].init(l);
        int mid = l + r >> 1;
        build(l, mid, rt << 1);
        build(mid + 1, r, rt << 1 | 1);
        pushup(rt);
    }
    void modify(int rt, int ll, int rr, int v) {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (ll <= l && r <= rr) return tree[rt].push(v);
        int mid = l + r >> 1;
        pushdown(rt);
        if (ll <= mid) modify(rt << 1, ll, rr, v);
        if (mid < rr) modify(rt << 1 | 1, ll, rr, v);
        pushup(rt);
    }
    int query(int rt, int ll, int rr) {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (ll <= l && r <= rr) return tree[rt].sum;
        int mid = l + r >> 1, s = 0;
        pushdown(rt);
        if (ll <= mid) s = query(rt << 1, ll, rr);
        if (mid < rr) s += query(rt << 1 | 1, ll, rr);
        return s;
    }
} sgt;
int slv[N];
namespace aimat {
    char *p1,*p2,buf[100010],obuf[100010],*p3=obuf;
    #define gc() (p1==p2&&(p2=(p1=buf)+fread(buf,1,100000,stdin),p1==p2)?EOF:*p1++)
    #define pc(x) (p3==obuf+100000&&fwrite(p3=obuf,1,100000,stdout),*p3++=x)
    int read(){
        int x=0;
        char c=gc();
        while(c<48)c=gc();
        while(47<c)x=(x<<3)+(x<<1)+(c&15),c=gc();
        return x;
    }
    void write(int x){
        if(9<x)write(x/10);
        pc(x%10|48);
    }
} using namespace aimat;
signed main() {
    // cin.tie(0)->sync_with_stdio(false);
    int n, q;
    n = read(), q = read();
    for (int i = 1; i <= n; ++i) {
        int x;
        x = read();
        ++a[x];
        slv[i] = x;
    }
    for (int i = 1; i + 1 < N; ++i) a[i + 1] += a[i] >> 1, a[i] &= 1;
    sgt.build(1, N - 1, 1);
    while (q--) {
        int k, l;
        k = read(), l = read();
        // cin >> k >> l;
        do {
            int la = slv[k];
            int val = sgt.query(1, la, la);
            if (val == 1) {
                sgt.modify(1, la, la, 0);
            } else {
                int l = la + 1, r = N - 1, best = -1;
                while (l <= r) {
                    int mid = l + r >> 1;
                    int tv = sgt.query(1, la, mid);
                    if (tv) best = mid, r = mid - 1;
                    else l = mid + 1;
                }
                // cerr << "best = " << best << '\n';
                sgt.modify(1, best, best, 0);
                sgt.modify(1, la, best - 1, 1);
            }
        } while (0);
        slv[k] = l;
        do {
            int val = sgt.query(1, l, l);
            if (!val) {
                sgt.modify(1, l, l, 1);
            } else {
                int ll = l;
                int l = ll + 1, r = N - 1, best = -1;
                while (l <= r) {
                    int mid = l + r >> 1;
                    int tv = mid - ll + 1 - sgt.query(1, ll, mid);
                    if (tv) best = mid, r = mid - 1;
                    else l = mid + 1;
                }
                sgt.modify(1, best, best, 1);
                sgt.modify(1, ll, best - 1, 0);
            }
        } while (0);
        do {
            int l = 1, r = N - 1, best = -1;
            while (l <= r) {
                int mid = l + r >> 1;
                int tv = sgt.query(1, mid, N - 1);
                if (tv > 0) best = mid, l = mid + 1;
                else r = mid - 1;
            }
            // cout << best << '\n';
            write(best); pc('\n');
        } while (0);
    }
    fwrite(obuf,1,p3-obuf,stdout);
    return 0;
}


```

---
title: "P14564 圆环 题解"
date: "2025-11-24T04:15:11.000Z"
link: "luogu-qgzb3c8a"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "动态规划", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/qgzb3c8a)。

先考虑暴力怎么做。容易想到 dp。先按照 $x$ 为关键字升序排序。根据经典套路可以设 $f_{i,j}$ 表示当前执行了前 $i$ 个操作，当前一只手在位置 $y_i$ 另一只手在位置 $j$，最少需要花费的代价。容易观察到不需要区分两只手，因此这个状态设计正确。

转移则分为下面的两个情况：

+ 当前操作的手和上一次操作的手是一样的，枚举另一只手的位置 $j$，转移方程形如：$f_{i,j}\leftarrow f_{i-1,j}+\operatorname{Dist}(y_i,y_{i-1})$。
+ 当前操作的手和上一次操作的手不一样，枚举当前操作的手上一次所在的位置 $j$，转移方程形如：$f_{i,y_{i-1}}\leftarrow f_{i-1,j}+\operatorname{Dist}(j,y_i)$。

一个特殊情况是当前操作的 $x_i$ 和上一次操作的 $x_{i-1}$ 对应的两个时刻相同，此时两次操作必须使用不同的手，一个比较好的处理方法是此时只保留 $f_{i,y_{i-1}}$ 的值，将其余值全部赋值为 $+\infin$ 即可。

然后你会发现这个转移形如一个十字，考虑套用 [ARC073F Many Moves](https://www.luogu.com.cn/problem/AT_arc073_d) 的套路，用线段树维护 $f$ 数组的变化。初始处理 $f_{1,*}$ 的值是容易的，可以线性扫描求解。

而对于两种转移：

+ 对于第一种情况，$\operatorname{Dist}(y_i,y_{i-1})$ 在 $i$ 固定的情况下是一个定值，因此这个操作其实就是整体加 $\operatorname{Dist}(y_i,y_{i-1})$。
+ 对于第二种情况，修改的位置只有 $f_{i,y_i}$ 一个可以看作是单点修改，问题在于怎么求后面的值。套路的拆 $\operatorname{Dist}$ 的贡献，可以得到 $\operatorname{Dist}(j,y_i)$ 的值为：
  + $\operatorname{Dist}(j,y_i)=\min(y_i-j,n-y_i+j)$（$j\le y_i$）。
  + $\operatorname{Dist}(j,y_i)=\min(j-y_i,n-j+y_i)$（$j>y_i$）。
+ 把转移方程完整列出，可以发现只需要在线段树上维护 $f_{*,i}+i$ 和 $f_{*i,i}-i$ 的最小值就可以区间查询最小值快速的计算后半部分的 $\min$ 值。然后再维护 $f_{*,i}$ 的值支持单点查询然后求个 $\min$ 再赋值回 $f_{i,y_i}$ 位置即可。
+ 还剩下 $x_i=x_{i-1}$ 的特殊情况，此时需要把 $[1,y_{i-1})$ 和 $(y_{i+1},n]$ 的值全部赋值为 $+\infin$。一个偷懒的做法是直接把这两段区间的值都加一个 $+\infin$ 就可以达到上面的效果。

总时间复杂度为 $O(n\log n)$，可以通过。注意因为 $+\infin$ 的值很大所以需要开 `__int128` 算答案。

```cpp line-numbers
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
const int mod = 998244353;
const int inf = 1e18;

using ld = long double;
using ull = unsigned long long;
using i128 = __int128;
const ull base = 13331;

namespace Luminescent
{
    const double pi = acos(-1);
    const ld pi_l = acosl(-1);
    struct DSU
    {
        int fa[N];
        inline DSU() { iota(fa, fa + N, 0); }
        inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
        inline int merge(int x, int y)
        {
            x = find(x), y = find(y);
            if (x != y)
                return fa[x] = y, 1;
            return 0;
        }
    };
    inline void add(int &x, int v) { x = (x + v) % mod; }
    inline void sub(int &x, int v) { x = (x - v + mod) % mod; }
    inline int power(int a, int b, int c)
    {
        int sum = 1;
        while (b)
        {
            if (b & 1)
                sum = 1ll * sum * a % c;
            a = 1ll * a * a % c, b >>= 1;
        }
        return sum;
    }
    inline int inversion(int x, int mod) { return power(x, mod - 2, mod); }
    inline int varphi(int x)
    {
        int phi = 1;
        for (int i = 2; i * i <= x; ++i)
            if (x % i == 0)
            {
                phi *= (i - 1);
                x /= i;
                while (x % i == 0)
                    phi *= i, x /= i;
            }
        if (x > 1)
            phi *= (x - 1);
        return phi;
    }
} using namespace Luminescent;

using i128 = __int128;

namespace Loyalty
{
    struct Nodee
    {
        int x, y;
    } a[N];
    int n, m, f[N];
    inline int dist(int i, int j)
    {
        if (i > j)
            i ^= j ^= i ^= j;
        return min(j - i, n - j + i);
    }
    struct Node
    {
        int l, r;
        i128 m1, m2, sum, tag;
        // m1: (f[i] + i)_min
        // m2: (f[i] - i)_min
        inline void init(int p)
        {
            l = r = p, tag = 0, sum = f[p];
            m1 = f[p] + p, m2 = f[p] - p;
        }
        inline void push(i128 x)
        {
            m1 += x, m2 += x, tag += x, sum += (i128)(r - l + 1) * x;
        }
    } tree[N << 2];
    inline Node operator+(const Node &l, const Node &r)
    {
        return {l.l, r.r, min(l.m1,r.m1), min(l.m2,r.m2), l.sum + r.sum, 0};
    }
    inline void pushdown(int rt)
    {
        if (tree[rt].tag)
        {
            tree[rt << 1].push(tree[rt].tag);
            tree[rt << 1 | 1].push(tree[rt].tag);
            tree[rt].tag = 0;
        }
    }
    inline void build(int l, int r, int rt)
    {
        if (l == r)
            return tree[rt].init(l);
        int mid = l + r >> 1;
        build(l, mid, rt << 1);
        build(mid + 1, r, rt << 1 | 1);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    // 单点修改
    inline void loyalty(int rt, int pos, i128 v)
    {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (l == r)
        {
            tree[rt].m1 = v + l, tree[rt].m2 = v - l;
            tree[rt].sum = v;
            return;
        }
        int mid = l + r >> 1;
        pushdown(rt);
        loyalty((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos, v);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    // 区间加
    inline void loyalty(int rt, int ll, int rr, i128 v)
    {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (ll <= l && r <= rr)
            return tree[rt].push(v);
        int mid = l + r >> 1;
        pushdown(rt);
        if (ll <= mid)
            loyalty(rt << 1, ll, rr, v);
        if (mid < rr)
            loyalty(rt << 1 | 1, ll, rr, v);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    // 区间求最值
    inline Node luminescent(int rt, int ll, int rr)
    {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (l > r)
            return {0, 0, (i128)inf * 1000000000ll, (i128)inf * 1000000000ll, 0, 0};
        if (ll <= l && r <= rr)
            return tree[rt];
        int mid = l + r >> 1;
        pushdown(rt);
        if (ll <= mid && mid < rr)
            return luminescent(rt << 1, ll, rr) + luminescent(rt << 1 | 1, ll, rr);
        if (ll <= mid)
            return luminescent(rt << 1, ll, rr);
        return luminescent(rt << 1 | 1, ll, rr);
    }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        int cccccccc;
        cin >> cccccccc >> n >> m;
        for (int i = 1; i <= m; ++i)
            cin >> a[i].x >> a[i].y;
        sort(a + 1, a + m + 1, [&](auto &l, auto &r) { return l.x < r.x; });
        for (int i = 1; i <= n; ++i)
            f[i] = min(dist(1, i) + dist(n, a[1].y), dist(n, i) + dist(1, a[1].y));
        build(1, n, 1);
        // cerr << "debug: ";
        // for (int i = 1; i <= n; ++i)
        //     cerr << luminescent(1, i, i).sum << ' ';
        // cerr << '\n';
        for (int i = 2; i <= m; ++i)
        {
            // cerr << "wtf: ";
            // for (int i = 1; i <= n; ++i)
            //     cerr << luminescent(1, i, i).sum << ' ';
            // cerr << '\n';
            i128 pnt = luminescent(1, a[i].y, a[i].y).sum;
            if (a[i].y <= n)
            {
                auto o = luminescent(1, a[i].y, n);
                pnt = min({pnt, o.m1 - a[i].y, n + a[i].y + o.m2});
            }
            if (a[i].y > 1)
            {
                auto o = luminescent(1, 1, a[i].y - 1);
                // cerr << "rr " << o.m1 << ' ' << o.m2 << ' ' << o.m2 + a[i].y << ' ' << n - a[i].y + o.m1 << '\n';
                pnt = min({pnt, o.m2 + a[i].y, n - a[i].y + o.m1});
            }
            // cerr << "now pnt = " << pnt << ' ' << a[i].y << '\n';
            loyalty(1, 1, n, dist(a[i].y, a[i - 1].y));
            loyalty(1, a[i - 1].y, pnt);
            if (a[i].x == a[i - 1].x)
            {
                if (a[i - 1].y > 1)
                    loyalty(1, 1, a[i - 1].y - 1, inf);
                if (a[i - 1].y < n)
                    loyalty(1, a[i - 1].y + 1, n, inf);
                // for (int j = 1; j <= n; ++j)
                //     if (j != a[i - 1].y)
                //         loyalty(1, j, inf);
            }
            // cerr << "debug: ";
            // for (int i = 1; i <= n; ++i)
            //     cerr << luminescent(1, i, i).sum << ' ';
            // cerr << '\n';
        }
        i128 res = (i128)inf * inf;
        for (int i = 1; i <= n; ++i)
            res = min(res, luminescent(1, i, i).sum);
        cout << (int)res << '\n';
        // for (int i = 2; i <= m; ++i)
        // {
        //     if (a[i].x != a[i - 1].x)
        //     {
        //         for (int j = 1; j <= n; ++j)
        //             f[i][j] = f[i - 1][j] + dist(a[i].y, a[i - 1].y);
        //         for (int k = 1; k <= n; ++k)
        //             f[i][a[i - 1].y] = min(f[i][a[i - 1].y], f[i - 1][k] + dist(k, a[i].y));
        //     }
        //     else
        //     {
        //         f[i][a[i - 1].y] = f[i - 1][a[i - 1].y] + dist(a[i].y, a[i - 1].y);
        //         for (int k = 1; k <= n; ++k)
        //             f[i][a[i - 1].y] = min(f[i][a[i - 1].y], f[i - 1][k] + dist(k, a[i].y));
        //         for (int j = 1; j <= n; ++j)
        //             if (j != a[i - 1].y)
        //                 f[i][j] = inf;
        //     }
        //     // if (a[i].x == a[i - 1].x)
        //     // {
        //     //     for (int j = 1; j <= n; ++j)
        //     //         if (j != a[i - 1].y)
        //     //             f[i][j] = inf;
        //     // }
        // }
        // int res = inf;
        // for (int i = 1; i <= n; ++i)
        //     res = min(res, f[m][i]);
        // cout << res << '\n';
    }
}

signed main()
{
    // freopen("1.in", "r", stdin);
    // freopen("1.out", "w", stdout);
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int T = 1;
    // cin >> T;
    for (int ca = 1; ca <= T; ++ca)
        Loyalty::main(ca, T);
    return 0;
}
```

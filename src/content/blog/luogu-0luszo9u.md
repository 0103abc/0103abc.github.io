---
title: "P5621 [DBOI2019] 德丽莎世界第一可爱 题解"
date: "2025-10-28T05:10:59.000Z"
link: "luogu-0luszo9u"
categories: ["题解"]
tags: ["洛谷", "基础算法", "排序", "算法思想", "分治", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/0luszo9u)。

题解区里怎么没有写二进制分组 KDT 的（）

先考虑其弱化版 [P3769 [CH弱省胡策R2] TATT](https://www.luogu.com.cn/problem/P3769)。该问题求解的是四维意义下的 LIS，容易想到先按第一维排序，然后转化为三维的偏序关系。

比较常规的解法是 cdq 分治套 cdq 分治优化 dp，但是这里采用 KD-Tree 来优化她。

按照第一维排序后，设 $f_i$ 表示当前以 $i$ 点为结尾的 LIS 长度最长是多少。有初始状态 $f_i=1$，转移方程形如：

$$
f_i=(\max\limits_{x_j\le x_i,y_j\le y_i,z_j\le z_i}f_j)+1
$$

考虑用数据结构优化。~~容易想到写一个树套树~~。注意到前面部分的查询其实就是在一个三维空间中查询最大值，然后添加 $i$ 位置就是在 KD-Tree 上单点插入。在每个结点上维护子树最大值信息，可以做到 $O(n^{5/3})$ 解决该问题。

---

这个题在上个题的基础上加了一个点的权值，只需要把上一题的 dp 初始条件修改为 $f_i=C_i$，转移方程修改为：

$$
f_i=(\max\limits_{E_j\le E_i,A_j\le A_i,D_j\le D_i}f_j)+1
$$

按照 $H$ 从小到大排序转移即可，需要大力卡常才能过。（然后直接拿下了最优解？？？）

---

可读（但是被卡常了）的代码：

```cpp line-numbers
// Author: 美丽好 rua 的大宋宋

// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <iostream>
#include <string.h>
#include <bits/stl_algo.h>
#define int long long
using namespace std;
const int N = 100010;
const int inf = 1e18;
const int mod = 998244353;

inline int power(int a, int b, int c)
{
    int ans = 1;
    while (b)
    {
        if (b & 1)
            ans = ans * a % c;
        a = a * a % c, b >>= 1;
    }
    return ans;
}

inline int inversion(int x) { return power(x, mod - 2, mod); }

using ull = unsigned long long;
using i128 = __int128;

const int dim = 3;
int m, lx[3], rx[3];
struct Node
{
    int x[3], val, mx, l, r, L[3], R[3];
} tree[N];

int dest[N], root[20], cnt, idx;

inline void pushup(int rt)
{
    tree[rt].mx = max({tree[rt].val, tree[tree[rt].l].mx, tree[tree[rt].r].mx});
    for (int i = 0; i < dim; ++i)
    {
        tree[rt].L[i] = tree[rt].R[i] = tree[rt].x[i];
        if (tree[rt].l)
        {
            tree[rt].L[i] = min(tree[rt].L[i], tree[tree[rt].l].L[i]);
            tree[rt].R[i] = max(tree[rt].R[i], tree[tree[rt].l].R[i]);
        }
        if (tree[rt].r)
        {
            tree[rt].L[i] = min(tree[rt].L[i], tree[tree[rt].r].L[i]);
            tree[rt].R[i] = max(tree[rt].R[i], tree[tree[rt].r].R[i]);
        }
    }
}

inline int build(int l, int r, int dim_op)
{
    int mid = l + r >> 1;
    nth_element(dest + l, dest + mid, dest + r + 1, [&](auto &l, auto &r)
    {
        return tree[l].x[dim_op] < tree[r].x[dim_op];
    });
    tree[dest[mid]].l = tree[dest[mid]].r = 0;
    if (l < mid)
        tree[dest[mid]].l = build(l, mid - 1, (dim_op + 1) % dim);
    if (mid < r)
        tree[dest[mid]].r = build(mid + 1, r, (dim_op + 1) % dim);
    pushup(dest[mid]);
    return dest[mid];
}

inline void push_cache(int &rt)
{
    if (!rt)
        return;
    if (tree[rt].l)
        push_cache(tree[rt].l);
    dest[++cnt] = rt;
    if (tree[rt].r)
        push_cache(tree[rt].r);
    rt = 0;
}

inline int luminescent(int rt)
{
    if (!rt)
        return 0;
    int ok = 1;
    for (int i = 0; i < dim; ++i)
        if (lx[i] <= tree[rt].L[i] && tree[rt].R[i] <= rx[i])
            ;
        else
        {
            ok = 0;
            break;
        }
    if (ok)
        return tree[rt].mx;
    for (int i = 0; i < dim; ++i)
        if (tree[rt].R[i] < lx[i] || rx[i] < tree[rt].L[i])
            return 0;
    ok = 1;
    for (int i = 0; i < dim; ++i)
        if (!(lx[i] <= tree[rt].x[i] && tree[rt].x[i] <= rx[i]))
        {
            ok = 0;
            break;
        }
    if (ok)
        return max({luminescent(tree[rt].l), luminescent(tree[rt].r), tree[rt].val});
    return max(luminescent(tree[rt].l), luminescent(tree[rt].r));
}

inline void ins(int x[3], int val)
{
    ++idx;
    for (int i = 0; i < dim; ++i)
        tree[idx].x[i] = x[i];
    tree[idx].val = val;
    dest[cnt = 1] = idx;
    for (int i = 0; ; ++i)
        if (!root[i])
        {
            root[i] = build(1, cnt, 0);
            break;
        }
        else
            push_cache(root[i]);
}

inline int qry(int _lx[3], int _rx[3])
{
    for (int i = 0; i < 3; ++i)
        lx[i] = _lx[i], rx[i] = _rx[i];
    int mx = 0;
    for (int i = 0; i < 20; ++i)
        if (root[i])
            mx = max(mx, luminescent(root[i]));
    return mx;
}

struct Point
{
    int x, y, z, w, cost;
} pnt[N];
int f[N];

signed main()
{
    // freopen("1.in", "r", stdin);
    // freopen("1.out", "w", stdout);
    cin.tie(0)->sync_with_stdio(false);
    cin >> m;
    for (int i = 1; i <= m; ++i)
        cin >> pnt[i].x >> pnt[i].y >> pnt[i].z >> pnt[i].w >> pnt[i].cost;
    sort(pnt + 1, pnt + m + 1, [&](auto &l, auto &r) { return make_tuple(l.x, l.y, l.z, l.w) < make_tuple(r.x, r.y, r.z, r.w); });
    for (int i = 1; i <= m; ++i)
        f[i] = pnt[i].cost;
    int mx = -inf;
    for (int i = 1; i <= m; ++i)
    {
        int x[3] = {pnt[i].y, pnt[i].z, pnt[i].w};
        int _[3] = {(int)-1e9, (int)-1e9, (int)-1e9};
        int val = qry(_, x) + pnt[i].cost;
        mx = max(mx, val);
        ins(x, val);
    }
    cout << mx << '\n';
    return 0;
}

```

经过大力卡常之后 AC 的代码：

```cpp line-numbers
// Author: 美丽好 rua 的大宋宋

// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#pragma GCC target("sse,sse2,sse3,ssse3,sse4.1,sse4.2,avx,avx2,popcnt")

#include <bits/stdc++.h>
using namespace std;

const int N = 100010;
const int dim = 3;
const int MAXL = 16;

#if defined(__GNUC__)
#define LIKELY(x) (__builtin_expect(!!(x), 1))
#define UNLIKELY(x) (__builtin_expect(!!(x), 0))
#define HOT __attribute__((hot))
#else
#define LIKELY(x) (x)
#define UNLIKELY(x) (x)
#define HOT
#endif

int m, lx[3], rx[3];

struct Node
{
    int x[3], l, r, L[3], R[3];
    long long val, mx;
} tree[N];

int dest[N], root[MAXL], cnt, idx;

static int OP = 0;
static const int nxt[3] = {1, 2, 0};

static bool cmp_idx(const int &a, const int &b)
{
    return tree[a].x[OP] < tree[b].x[OP];
}

inline void pushup(int rt)
{
    Node &t = tree[rt];
    const int l = t.l, r = t.r;

    long long mx0 = t.val;
    if (l)
    {
        long long v = tree[l].mx;
        if (v > mx0)
            mx0 = v;
    }
    if (r)
    {
        long long v = tree[r].mx;
        if (v > mx0)
            mx0 = v;
    }
    t.mx = mx0;
    if (t.mx < 0)
        t.mx = 0;

    int L0 = t.x[0], R0 = L0;
    if (l)
    {
        if (tree[l].L[0] < L0)
            L0 = tree[l].L[0];
        if (tree[l].R[0] > R0)
            R0 = tree[l].R[0];
    }
    if (r)
    {
        if (tree[r].L[0] < L0)
            L0 = tree[r].L[0];
        if (tree[r].R[0] > R0)
            R0 = tree[r].R[0];
    }
    t.L[0] = L0;
    t.R[0] = R0;

    int L1 = t.x[1], R1 = L1;
    if (l)
    {
        if (tree[l].L[1] < L1)
            L1 = tree[l].L[1];
        if (tree[l].R[1] > R1)
            R1 = tree[l].R[1];
    }
    if (r)
    {
        if (tree[r].L[1] < L1)
            L1 = tree[r].L[1];
        if (tree[r].R[1] > R1)
            R1 = tree[r].R[1];
    }
    t.L[1] = L1;
    t.R[1] = R1;

    int L2 = t.x[2], R2 = L2;
    if (l)
    {
        if (tree[l].L[2] < L2)
            L2 = tree[l].L[2];
        if (tree[l].R[2] > R2)
            R2 = tree[l].R[2];
    }
    if (r)
    {
        if (tree[r].L[2] < L2)
            L2 = tree[r].L[2];
        if (tree[r].R[2] > R2)
            R2 = tree[r].R[2];
    }
    t.L[2] = L2;
    t.R[2] = R2;
}

inline int build(int l, int r, int op)
{
    int mid = (l + r) >> 1;
    OP = op;
    nth_element(dest + l, dest + mid, dest + r + 1, cmp_idx);
    int rt = dest[mid];
    tree[rt].l = tree[rt].r = 0;
    if (l < mid)
        tree[rt].l = build(l, mid - 1, nxt[op]);
    if (mid < r)
        tree[rt].r = build(mid + 1, r, nxt[op]);
    pushup(rt);
    return rt;
}

inline void push_cache(int &rt)
{
    if (!rt)
        return;
    if (tree[rt].l)
        push_cache(tree[rt].l);
    dest[++cnt] = rt;
    if (tree[rt].r)
        push_cache(tree[rt].r);
    rt = 0;
}

HOT inline void luminescent(int rt, long long &best)
{
    if (UNLIKELY(!rt))
        return;
    if (tree[rt].mx <= best)
        return;

    Node &t = tree[rt];

    if (t.R[0] < lx[0] || rx[0] < t.L[0] ||
        t.R[1] < lx[1] || rx[1] < t.L[1] ||
        t.R[2] < lx[2] || rx[2] < t.L[2])
        return;

    if (lx[0] <= t.L[0] && t.R[0] <= rx[0] &&
        lx[1] <= t.L[1] && t.R[1] <= rx[1] &&
        lx[2] <= t.L[2] && t.R[2] <= rx[2])
    {
        if (t.mx > best)
            best = t.mx;
        return;
    }

    if (lx[0] <= t.x[0] && t.x[0] <= rx[0] &&
        lx[1] <= t.x[1] && t.x[1] <= rx[1] &&
        lx[2] <= t.x[2] && t.x[2] <= rx[2])
    {
        if (t.val > best)
            best = t.val;
    }

    const int lc = t.l, rc = t.r;

#if defined(__GNUC__)
    if (lc)
        __builtin_prefetch(&tree[lc], 0, 1);
    if (rc)
        __builtin_prefetch(&tree[rc], 0, 1);
#endif

    int first = lc, second = rc;
    if (rc && (!lc || tree[rc].mx > tree[lc].mx))
    {
        first = rc;
        second = lc;
    }

    if (first && tree[first].mx > best)
        luminescent(first, best);
    if (second && tree[second].mx > best)
        luminescent(second, best);
}

inline void ins(int x[3], long long val)
{
    ++idx;
    tree[idx].x[0] = x[0];
    tree[idx].x[1] = x[1];
    tree[idx].x[2] = x[2];
    tree[idx].val = val;
    dest[cnt = 1] = idx;

    if (!root[0])
    {
        root[0] = build(1, cnt, 0);
        return;
    }
    push_cache(root[0]);
    if (!root[1])
    {
        root[1] = build(1, cnt, 0);
        return;
    }
    push_cache(root[1]);
    if (!root[2])
    {
        root[2] = build(1, cnt, 0);
        return;
    }
    push_cache(root[2]);
    if (!root[3])
    {
        root[3] = build(1, cnt, 0);
        return;
    }
    push_cache(root[3]);
    if (!root[4])
    {
        root[4] = build(1, cnt, 0);
        return;
    }
    push_cache(root[4]);
    if (!root[5])
    {
        root[5] = build(1, cnt, 0);
        return;
    }
    push_cache(root[5]);
    if (!root[6])
    {
        root[6] = build(1, cnt, 0);
        return;
    }
    push_cache(root[6]);
    if (!root[7])
    {
        root[7] = build(1, cnt, 0);
        return;
    }
    push_cache(root[7]);
    if (!root[8])
    {
        root[8] = build(1, cnt, 0);
        return;
    }
    push_cache(root[8]);
    if (!root[9])
    {
        root[9] = build(1, cnt, 0);
        return;
    }
    push_cache(root[9]);
    if (!root[10])
    {
        root[10] = build(1, cnt, 0);
        return;
    }
    push_cache(root[10]);
    if (!root[11])
    {
        root[11] = build(1, cnt, 0);
        return;
    }
    push_cache(root[11]);
    if (!root[12])
    {
        root[12] = build(1, cnt, 0);
        return;
    }
    push_cache(root[12]);
    if (!root[13])
    {
        root[13] = build(1, cnt, 0);
        return;
    }
    push_cache(root[13]);
    if (!root[14])
    {
        root[14] = build(1, cnt, 0);
        return;
    }
    push_cache(root[14]);
    if (!root[15])
    {
        root[15] = build(1, cnt, 0);
        return;
    }
    push_cache(root[15]);
    root[MAXL - 1] = build(1, cnt, 0);
}

inline long long qry(int _lx[3], int _rx[3])
{
    lx[0] = _lx[0];
    lx[1] = _lx[1];
    lx[2] = _lx[2];
    rx[0] = _rx[0];
    rx[1] = _rx[1];
    rx[2] = _rx[2];
    long long best = 0;

    {
        int rt = root[0];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[1];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[2];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[3];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[4];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[5];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[6];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[7];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[8];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[9];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[10];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[11];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[12];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[13];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[14];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }
    {
        int rt = root[15];
        if (rt)
        {
            if (tree[rt].mx > best)
            {
                Node &t = tree[rt];
                if (!(t.R[0] < lx[0] || rx[0] < t.L[0] || t.R[1] < lx[1] || rx[1] < t.L[1] || t.R[2] < lx[2] || rx[2] < t.L[2]))
                    luminescent(rt, best);
            }
        }
    }

    return best;
}

struct Point
{
    int x, y, z, w, cost;
} pnt[N];

static bool cmp(const Point &a, const Point &b)
{
    if (a.x != b.x)
        return a.x < b.x;
    if (a.y != b.y)
        return a.y < b.y;
    if (a.z != b.z)
        return a.z < b.z;
    return a.w < b.w;
}

static char buf[1000010];
static char *p1 = buf, *p2 = buf;
#define gc() (p1 == p2 && (p2 = (p1 = buf) + fread(buf, 1, 1000000, stdin), p1 == p2) ? EOF : *p1++)
static int read()
{
    int x = 0, op = 1, c = gc();
    while (c < 48)
    {
        if (c == '-')
            op = -1;
        c = gc();
    }
    while (c > 47)
    {
        x = (x << 3) + (x << 1) + (c & 15);
        c = gc();
    }
    return x * op;
}

int main()
{
    m = read();
    for (int i = 1; i <= m; ++i)
        pnt[i].x = read(), pnt[i].y = read(), pnt[i].z = read(),
        pnt[i].w = read(), pnt[i].cost = read();

    sort(pnt + 1, pnt + m + 1, cmp);

    long long ans = LLONG_MIN;
    for (int i = 1; i <= m; ++i)
    {
        int x3[3] = {pnt[i].y, pnt[i].z, pnt[i].w};
        int lo[3] = {INT_MIN, INT_MIN, INT_MIN};
        long long best = qry(lo, x3) + pnt[i].cost;
        if (best > ans)
            ans = best;
        ins(x3, best);
    }
    cout << ans << '\n';
    return 0;
}


```

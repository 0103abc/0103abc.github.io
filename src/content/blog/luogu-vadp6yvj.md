---
title: "P10756 [COI 2023] Sličnost 题解"
date: "2025-11-13T16:08:38.000Z"
link: "luogu-vadp6yvj"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/vadp6yvj)。

~~你说的对但是我今天刚学会可持久化线段树~~

这题怎么没题解啊/yun

先给出一个简要题意：

> 给定两个长度为 $n$ 个排列 $a,b$ 和一个参数 $k$，定义这两个排列的权值为：在 $a,b$ 中各选取一个长度为 $k$ 的连续子段，其组成集合的交集最大值。
>
> 有 $Q$ 次操作。每一次操作会交换 $a$ 数组中相邻两个元素。你需要在所有操作之前和每次操作后求出两个排列的权值。

直接暴力是 $O(Qn^3)$ 的，可以用一些手段优化到 $O(Qn^2)$，但是显然没有前途。

考虑一个经典技巧：

+ 记录数组 $id1_i,id2_i$ 分别表示 $i$ 元素在 $a,b$ 两个数组中出现的位置。
+ 考虑对 $a$ 数组中的每个值 $x$，求出若其被选在长度为 $k$ 的连续子段内，选择区间的左端点 $l_1$ 的取值范围区间。容易算出有 $l_1\in[\max(1,id1_x-k+1),\min(id1_x,n-k+1)$。
+ 同理对 $b$ 数组的每个值 $x$，求出若其被选在长度为 $k$ 的连续子段中，选择区间的左端点 $l_2$ 的取值范围区间。容易算出有 $l_2\in[\max(1,id2_x-k+1),\min(id2_x,n-k+1)]$。
+ 于是对每个值 $x$，其同时出现在 $a,b$ 两个数组中（即对答案做出 $1$ 的贡献），当且仅当第一个数组选择的区间 $[l_1,r_1]$ 满足 $id1_x\in[l_1,r_1]$，第二个数组选择的区间 $[l_2,r_2]$ 满足 $id2_x\in[l_2,r_2]$。而 $[l_1,r_1],[l_2,r_2]$ 两个区间在上面都算出来了。因此可以想到把这个问题放到一个二维平面上，这样一来满足条件的区间形如一个矩形，横坐标 $x\in[l_1,r_1]$，纵坐标 $y\in[l_2,r_2]$（这里记的都是坐标开始的位置）。

此时可以发现，问题被转化为：

> 有一个 $(n-k+1)\times(n-k+1)$ 的二维格点网格和 $m$ 个矩形，你要求出一个格点，使得这个格点被矩形覆盖次数最多。
>
> 然后还有 $Q$ 次询问，每一次询问会对 $O(1)$ 个矩形的横坐标方向做最多 $1$ 单位的修改（即不动 / 左右平移 $1$ 个单位），执行完操作之后你还是要求一个格点使得这个格点被矩形覆盖次数最多。

可以想到对每一行开一个线段树来维护每个点的信息，但是这显然是开不下的。注意到相邻两行的线段树之间修改次数的和是 $O(n)$ 级别的，因此想到开一个有 $n$ 个版本的可持久化线段树维护维护每个横坐标的信息（区间最大值和区间最大值的出现次数），再维护一个线段树来维护可持久化线段树上每个版本的答案。

查询操作就是对可持久化线段树上每个版本的答案全部合并起来求最大值和最大值出现次数，这个东西可以很好的在线段树上维护。

然后还有修改操作。因为只会修改 $O(1)$ 个矩形，且此时只会修改横坐标，而横坐标又只会进行最多 $1$ 单位的修改，因此直接暴力修改边界上最多 $2$ 个横坐标的信息（直接在可持久化线段树上修改对应版本，然后同时更新线段树上的最值信息），查询同样还是查线段树根结点即可。具体细节见代码。

一些比较难受的地方是可持久化线段树空间要开足（虽然这个题空间限制是 1G 但是还是很卡空间，不能全开 `long long`）。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#define int long long

using namespace std;
const int N = 100010;
const int mod = 167772161;
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
        int fa[N], cnt[N];
        inline DSU() { iota(fa, fa + N, 0), fill(cnt, cnt + N, 1); }
        inline void init(int maxn) { iota(fa, fa + maxn + 1, 0), fill(cnt, cnt + maxn + 1, 1); }
        inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
        inline int merge(int x, int y)
        {
            x = find(x), y = find(y);
            if (cnt[x] > cnt[y])
                x ^= y ^= x ^= y;
            if (x != y)
                return fa[x] = y, cnt[y] += cnt[x], 1;
            return 0;
        }
    };
    inline void add(int &x, int a) { x = (x + a) % mod; }
    inline void sub(int &x, int a) { x = (x - a + mod) % mod; }
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
    inline int inversion(int x) { return power(x, mod - 2, mod); }
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
        if (x > 1) phi *= (x - 1);
        return phi;
    }
}
using namespace Luminescent;

namespace Loyalty
{
    int a[N], b[N], id1[N], id2[N];
    struct Squ { int l1, r1, l2, r2; } op[N];
    struct Event { int l, r, op; };
    vector<Event> event[N];
    signed root[N];
    inline void init() { }
    namespace SegTree
    {
        struct Node
        {
            int l, r, mx, cnt;
            inline void init(int p) { l = r = p, mx = cnt = 0; }
        } tree[N << 2];
        inline Node operator+(const Node &l, const Node &r)
        {
            Node o;
            o.l = l.l, o.r = r.r, o.mx = max(l.mx, r.mx), o.cnt = 0;
            if (o.mx == l.mx)
                o.cnt += l.cnt;
            if (o.mx == r.mx)
                o.cnt += r.cnt;
            return o;
        }
        inline void build(int l, int r, int rt)
        {
            if (l == r)
                return tree[rt].init(l);
            int mid = l + r >> 1;
            build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
            tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
        }
        inline void loyalty(int rt, int pos, int mx, int cnt)
        {
            int &l = tree[rt].l, &r = tree[rt].r;
            if (l == r)
            {
                tree[rt].mx = mx, tree[rt].cnt = cnt;
                return;
            }
            int mid = l + r >> 1;
            loyalty((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos, mx, cnt);
            tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
        }
    }
    int idx;
    struct Node
    {
        signed l, r;
        int mx, cnt, tag;
    } tree[N * 340];
    inline void pushup(int rt)
    {
        tree[rt].mx = max(tree[tree[rt].l].mx, tree[tree[rt].r].mx);
        tree[rt].cnt = 0;
        if (tree[tree[rt].l].mx == tree[rt].mx)
            tree[rt].cnt += tree[tree[rt].l].cnt;
        if (tree[tree[rt].r].mx == tree[rt].mx)
            tree[rt].cnt += tree[tree[rt].r].cnt;
    }
    inline void pushdown(int rt)
    {
        if (tree[rt].tag)
        {
            tree[++idx] = tree[tree[rt].l];
            tree[rt].l = idx;
            tree[++idx] = tree[tree[rt].r];
            tree[rt].r = idx;
            tree[tree[rt].l].mx += tree[rt].tag;
            tree[tree[rt].r].mx += tree[rt].tag;
            tree[tree[rt].l].tag += tree[rt].tag;
            tree[tree[rt].r].tag += tree[rt].tag;
            tree[rt].tag = 0;
        }
    }
    inline void build(signed &rt, int l, int r)
    {
        rt = ++idx;
        tree[rt].cnt = r - l + 1;
        tree[rt].mx = tree[rt].tag = 0;
        if (l == r)
            return;
        int mid = l + r >> 1;
        build(tree[rt].l, l, mid);
        build(tree[rt].r, mid + 1, r);
    }
    inline void loyalty(signed &rt, int l, int r, int ll, int rr, int v)
    {
        tree[++idx] = tree[rt];
        rt = idx;
        if (ll <= l && r <= rr)
        {
            tree[rt].mx += v, tree[rt].tag += v;
            return;
        }
        int mid = l + r >> 1;
        pushdown(rt);
        if (ll <= mid)
            loyalty(tree[rt].l, l, mid, ll, rr, v);
        if (mid < rr)
            loyalty(tree[rt].r, mid + 1, r, ll, rr, v);
        pushup(rt);
    }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        int n, k, q;
        cin >> n >> k >> q;
        for (int i = 1; i <= n; ++i)
            cin >> a[i], id1[a[i]] = i;
        for (int i = 1; i <= n; ++i)
            cin >> b[i], id2[b[i]] = i;
        for (int i = 1; i <= n; ++i)
        {
            int l1 = max(1ll, id1[i] - k + 1), r1 = min(id1[i], n - k + 1);
            int l2 = max(1ll, id2[i] - k + 1), r2 = min(id2[i], n - k + 1);
            op[i] = {l1, r1, l2, r2};
            event[l1].push_back({l2, r2, 1});
            event[r1 + 1].push_back({l2, r2, -1});
        }
        SegTree::build(1, n, 1);
        build(root[0], 1, n - k + 1);
        for (int i = 1; i <= n; ++i)
        {
            root[i] = root[i - 1];
            for (auto &[l, r, o] : event[i])
                loyalty(root[i], 1, n - k + 1, l, r, o);
            SegTree::loyalty(1, i, tree[root[i]].mx, tree[root[i]].cnt);
        }
        cout << SegTree::tree[1].mx << ' ' << SegTree::tree[1].cnt << '\n';
        auto mahiro = [&](int &i) -> void
        {
            int l1 = max(1ll, id1[i] - k + 1), r1 = min(id1[i], n - k + 1);
            int l2 = max(1ll, id2[i] - k + 1), r2 = min(id2[i], n - k + 1);
            if (op[i].l1 + 1 == l1)
            {
                // 整体往右平移 删除最左侧一列
                loyalty(root[op[i].l1], 1, n - k + 1, l2, r2, -1);
                SegTree::loyalty(1, op[i].l1, tree[root[op[i].l1]].mx, tree[root[op[i].l1]].cnt);
            }
            else if (op[i].l1 - 1 == l1)
            {
                // 整体往左平移 在最左侧添加一列
                loyalty(root[l1], 1, n - k + 1, l2, r2, 1);
                SegTree::loyalty(1, l1, tree[root[l1]].mx, tree[root[l1]].cnt);
            }
            if (op[i].r1 + 1 == r1)
            {
                // 整体往右平移 在最右侧添加一列
                loyalty(root[r1], 1, n - k + 1, l2, r2, 1);
                SegTree::loyalty(1, r1, tree[root[r1]].mx, tree[root[r1]].cnt);
            }
            else if (op[i].r1 - 1 == r1)
            {
                // 整体往左平移 在最右侧删除一列
                loyalty(root[op[i].r1], 1, n - k + 1, l2, r2, -1);
                SegTree::loyalty(1, op[i].r1, tree[root[op[i].r1]].mx, tree[root[op[i].r1]].cnt);
            }
            op[i] = {l1, r1, l2, r2};
        };
        while (q--)
        {
            int t;
            cin >> t;
            swap(id1[a[t]], id1[a[t + 1]]);
            swap(a[t], a[t + 1]);
            mahiro(a[t]), mahiro(a[t + 1]);
            cout << SegTree::tree[1].mx << ' ' << SegTree::tree[1].cnt << '\n';
        }
    }
}

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int T = 1;
    // cin >> T;
    Loyalty::init();
    for (int ca = 1; ca <= T; ++ca)
        Loyalty::main(ca, T);
    return 0;
}
```

## 做题笔记补充

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/obgeyrgs)。

直接暴力是 $O(Qn^3)$ 的，可以用一些手段优化到 $O(Qn^2)$，但是显然没有前途。

考虑一个经典技巧：

+ 记录数组 $id1_i,id2_i$ 分别表示 $i$ 元素在 $a,b$ 两个数组中出现的位置。
+ 考虑对 $a$ 数组中的每个值 $x$，求出若其被选在长度为 $k$ 的连续子段内，选择区间的左端点 $l_1$ 的取值范围区间。容易算出有 $l_1\in[\max(1,id1_x-k+1),\min(id1_x,n-k+1)$。
+ 同理对 $b$ 数组的每个值 $x$，求出若其被选在长度为 $k$ 的连续子段中，选择区间的左端点 $l_2$ 的取值范围区间。容易算出有 $l_2\in[\max(1,id2_x-k+1),\min(id2_x,n-k+1)]$。
+ 于是对每个值 $x$，其同时出现在 $a,b$ 两个数组中（即对答案做出 $1$ 的贡献），当且仅当第一个数组选择的区间 $[l_1,r_1]$ 满足 $id1_x\in[l_1,r_1]$，第二个数组选择的区间 $[l_2,r_2]$ 满足 $id2_x\in[l_2,r_2]$。而 $[l_1,r_1],[l_2,r_2]$ 两个区间在上面都算出来了。因此可以想到把这个问题放到一个二维平面上，这样一来满足条件的区间形如一个矩形，横坐标 $x\in[l_1,r_1]$，纵坐标 $y\in[l_2,r_2]$（这里记的都是坐标开始的位置）。

此时可以发现，问题被转化为：

> 有一个 $(n-k+1)\times(n-k+1)$ 的二维格点网格和 $m$ 个矩形，你要求出一个格点，使得这个格点被矩形覆盖次数最多。
>
> 然后还有 $Q$ 次询问，每一次询问会对 $O(1)$ 个矩形的横坐标方向做最多 $1$ 单位的修改（即不动 / 左右平移 $1$ 个单位），执行完操作之后你还是要求一个格点使得这个格点被矩形覆盖次数最多。

可以想到对每一行开一个线段树来维护每个点的信息，但是这显然是开不下的。注意到相邻两行的线段树之间修改次数的和是 $O(n)$ 级别的，因此想到开一个有 $n$ 个版本的可持久化线段树维护维护每个横坐标的信息（区间最大值和区间最大值的出现次数），再维护一个线段树来维护可持久化线段树上每个版本的答案。

查询操作就是对可持久化线段树上每个版本的答案全部合并起来求最大值和最大值出现次数，这个东西可以很好的在线段树上维护。

然后还有修改操作。因为只会修改 $O(1)$ 个矩形，且此时只会修改横坐标，而横坐标又只会进行最多 $1$ 单位的修改，因此直接暴力修改边界上最多 $2$ 个横坐标的信息（直接在可持久化线段树上修改对应版本，然后同时更新线段树上的最值信息），查询同样还是查线段树根结点即可。

一些比较难受的地方是可持久化线段树空间要开足（虽然这个题空间限制是 1G 但是还是很卡空间，不能全开 `long long`）。

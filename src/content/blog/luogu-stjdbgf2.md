---
title: "P15555 [CCPC 2025 哈尔滨站] 比赛 题解"
date: "2026-03-20T13:34:10.000Z"
link: "luogu-stjdbgf2"
categories: ["题解"]
tags: ["洛谷", "动态规划", "基础算法", "贪心", "排序"]
draft: false
---

很牛的题。这个 $k$ 的限制看上去就很不舒服，考虑先处理 $k=1$ 的情况。

此时 $O(nq)$ 的暴力是容易的。考虑对每次询问直接暴力 dp 处理，dp 限制内部考虑贪心，显然对于位置 $i$ 而言，在保证合法的情况下 $x_i$ 的值越小越好。因此设 $f_i$ 表示当前处理了 $L_i\sim i$ 的人，$x_i$ 的值最小是多少。显然有初始条件 $f_{L_i} = l_{L_i}$，转移方程 $f_i=\max(f_{i-1}+d,l_i)$。此时合法的充要条件即为 $\forall i\in[L_i,R_i]\cap\mathbb N,f_i\le r_i$。

因为每次询问会单独给出一个 $d$ 所以上面的 dp 无法直接上 ddp 维护。因此考虑套路的展开 dp 方程式，得到：$f_i=\max\limits_{j=L}^i\max(l_j+d(i-j))$，因此可行性条件可以看作是对每个 $i\in[L,R]$ 都有 $\forall j\in[L,i),l_j+d(i-j)\le r_j$，移项可得有 $\max\limits_{j=L}^{i-1}(l_j+d(i-j)-r_j)\le 0$，套路的分离参数把 $i,j$ 的项分开考虑得到 $\max\limits_{j=L}^{i-1}[(l_j-jd)-(r_i-id)]\le 0$。为了让里面这个东西的值最大，容易想到在左侧取一个 $j$ 满足 $l_j-jd$ 的值最大，右侧取一个 $i$ 满足 $r_i-id$ 的值最小（显然需要满足 $L\le j<i\le R$）。

考虑用一个黑盒 ds 来维护上面的信息，在该黑盒的每个结点上维护信息 $mx$ 表示在该区间上的所有 $i$ 中 $l_i-id$ 的最大值，$mi$ 表示在该区间上的所有 $i$ 中 $r_i-id$ 的最小值，$df$ 表示在该区间上所有 $i$ 的 $(l_j-jd)-(r_i-id)$ 的最大值。先不管这个 $d$ 怎么处理考虑先合并信息，那么假设此时要合并的结点左右儿子分别为 $L,R$ 两个结点，$mx,mi$ 是容易的直接取对应的 $\max$ / $\min$ 值即可，而 $df$ 则可以直接从左右儿子继承，或在 $L$ 中取 $\max$，在 $R$ 中取 $\min$，即：$df=\max(L.df,R.df,L.mx-R.mi)$。

此时考虑 $d$ 的信息怎么处理，这个东西可以看作是每次操作会先对区间的 $i$ 位置值对应增加 $id$，操作结束时刻对区间的 $i$ 位置值对应减少 $id$，也就是每次区间加 / 减一个一次函数。注意到一次操作内只有给定的询问区间 $[L,R]$ 内的数才会被考虑到其余的数都不会被考虑到，因此直接把区间加减一次函数看作是对整体做操作。然后考虑到问题没有强制在线因此考虑 P5073 的套路把所有的 $d$ 离线下来从小到大排序，此时相邻两次 $d$ 的询问可以看作是整体加斜率为两个 $d$ 的差（这个值一定 $\ge 0$）截距为 $0$ 的一次函数，因此直接上 KTT 大力维护即可（注：为了保持 KTT 的结构这里需要把最小值取反，维护最小值相反数的最大值）。

然后容易发现 $k$ 这个信息是好处理的，很显然把 $L_i,L_i+1,\ldots,R_i$ 这些人按顺序依次分配到 $1,2,3,\ldots,k,1,2,3,\ldots,k,1,\ldots$ 队内就一定是最优的，证明简单调整法即可。

总时间复杂度为 $O(nk\log^3n)$ 瓶颈在于维护 KTT。但是众所周知 KTT 十分跑不满，实际运行下来也就 $O(nk\log^2n)$ 级别，因此可以通过该题，最大点用时 3.17s。

到目前另一篇 KTT 题解没有给出代码实现，为了方便后人调试这里给出一篇代码风格比较好的 KTT 实现。

```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    struct Line
    {
        int k, b;
        inline Line(int _k = 0, int _b = 0) { k = _k, b = _b; }
        inline void add(int v) { b += k * v; }
    } ;
    inline Line operator+(const Line &l, const Line &r)
    {
        return {l.k + r.k, l.b + r.b};
    }
    // first: 当前时刻最优的线
    // second: 这条线还能维持多久优势
    inline pair<Line, int> calc(Line x, Line y)
    {
        if (x.b < y.b)
            swap(x, y);
        if (x.k < y.k)
            return {x, (x.b - y.b) / (y.k - x.k)};
        return {x, inf};
    }
    // 打包信息的值和其势能信息
    struct Entry
    {
        Line line;
        int shi;
        inline Entry(Line _line = Line(), int _shi = inf) { line = _line, shi = _shi; }
        inline void add(int x) { line.add(x); if (shi < inf / 2) shi -= x; }
    };
    struct Node
    {
        signed l, r;
        Entry mx, mi, df;
        int tag;
        inline Node() { l = r = tag = 0; }
        inline void init(int p, const vector<int> &L, const vector<int> &R)
        {
            l = r = p, tag = 0;
            mx = {{-p, L[p]}, inf};
            mi = {{p, -R[p]}, inf};
            df = {{0, -inf}, inf};
        }
        inline void push(int x)
        {
            mx.add(x), mi.add(x), df.add(x);
            tag += x;
        }
    };
    inline Entry max(const Entry &l, const Entry &r)
    {
        auto o = calc(l.line, r.line);
        return {o.first, min({l.shi, r.shi, o.second})};
    }
    inline Entry add(const Entry &l, const Entry &r)
    {
        return {l.line + r.line, min(l.shi, r.shi)};
    }
    inline Node operator+(const Node &l, const Node &r)
    {
        Node res;
        res.l = l.l, res.r = r.r, res.tag = 0;
        res.df = max(max(l.df, r.df), add(l.mx, r.mi));
        res.mi = max(l.mi, r.mi), res.mx = max(l.mx, r.mx);
        return res;
    }
    class KTT
    {
        int n;
    public:
        vector<Node> tree;
        // Node tree[N << 2];
        vector<int> L, R;
        inline KTT(int maxN = 0)
        {
            n = maxN;
            tree.resize(n + 2 << 2);
            for (int i = 0; i < (n + 2 << 2); ++i)
                tree[i] = Node();
        }
        inline void reset(int maxN = 0) { n = maxN; }
        inline void clr(int n = 0) { tree.resize(n + 2 << 2); for (int i = 0; i < (n + 2 << 2); ++i) tree[i] = Node(); }
        inline void reclr(int n = 0) { reset(n), clr(n); }
        inline void build(int l, int r, int rt)
        {
            if (l == r)
                return tree[rt].init(l, L, R);
            int mid = l + r >> 1;
            build(l, mid, rt << 1);
            build(mid + 1, r, rt << 1 | 1);
            tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
        }
        inline void init(const vector<int> &_vl, const vector<int> &_vr)
        {
            L = _vl, R = _vr;
            reclr(_vl.size() - 1);
            if (n)
                build(1, n, 1);
        }
        inline void pushdown(int rt)
        {
            if (tree[rt].tag)
                tree[rt << 1].push(tree[rt].tag), tree[rt << 1 | 1].push(tree[rt].tag), tree[rt].tag = 0;
        }
        inline void loyalty(int rt, int v)
        {
            if (tree[rt].l == tree[rt].r || v <= min({tree[rt].mi.shi, tree[rt].mx.shi, tree[rt].df.shi}))
                return tree[rt].push(v);
            int mid = tree[rt].l + tree[rt].r >> 1;
            pushdown(rt);
            loyalty(rt << 1, v), loyalty(rt << 1 | 1, v);
            tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
        }
        inline Node luminescent(int rt, int ll, int rr)
        {
            signed &l = tree[rt].l, &r = tree[rt].r;
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
    } tree[5];
    struct Query
    {
        int l, r, d, id;
    } Q[N];
    int res[N];
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n, k;
        cin >> n >> k;
        vector<int> L(n + 1), R(n + 1);
        for (int i = 1; i <= n; ++i)
            cin >> L[i] >> R[i];
        for (int i = 0; i < k; ++i)
        {
            // cerr << "For k: " << i << '\n';
            vector<int> v1, v2;
            v1.emplace_back(0), v2.emplace_back(0);
            for (int j = i + 1; j <= n; j += k)
                v1.emplace_back(L[j]), v2.emplace_back(R[j]);
            tree[i].init(v1, v2);
        }
        int q;
        cin >> q;
        for (int i = 1; i <= q; ++i)
            cin >> Q[i].l >> Q[i].r >> Q[i].d, Q[i].id = i;
        sort(Q + 1, Q + q + 1, [&](auto &l, auto &r) { return l.d < r.d; });
        int las = 0;
        for (int i = 1; i <= q; ++i)
        {
            // cerr << "i = " << i << '\n';
            auto [l, r, d, id] = Q[i];
            int dlt = d - las;
            if (dlt)
                for (int j = 0; j < k; ++j)
                    tree[j].loyalty(1, dlt);
            if (dlt)
                las = d;
            int len = r - l + 1;
            res[id] = 1;
            for (int j = 0; j < k; ++j)
            {
                int ql = (l + j - 1) / k + 1, qr = ql + len / k - 1;
                if (ql < qr && tree[(l + j - 1) % k].luminescent(1, ql, qr).df.line.b > 0)
                {
                    res[id] = 0;
                    break;
                }
            }
        }
        for (int i = 1; i <= q; ++i)
            cout << (res[i] ? "Yes" : "No") << '\n';
    }
} // namespace Loyalty
```

## 做题笔记补充

难度评的比较高主要是因为 KTT 这个 ds 太冷门了（）oi wiki 上甚至都没有介绍（）

很牛的题。这个 $k$ 的限制看上去就很不舒服，考虑先处理 $k=1$ 的情况。

此时 $O(nq)$ 的暴力是容易的。考虑对每次询问直接暴力 dp 处理，dp 限制内部考虑贪心，显然对于位置 $i$ 而言，在保证合法的情况下 $x_i$ 的值越小越好。因此设 $f_i$ 表示当前处理了 $L_i\sim i$ 的人，$x_i$ 的值最小是多少。显然有初始条件 $f_{L_i} = l_{L_i}$，转移方程 $f_i=\max(f_{i-1}+d,l_i)$。此时合法的充要条件即为 $\forall i\in[L_i,R_i]\cap\mathbb N,f_i\le r_i$。

因为每次询问会单独给出一个 $d$ 所以上面的 dp 无法直接上 ddp 维护。因此考虑套路的展开 dp 方程式，得到：$f_i=\max\limits_{j=L}^i\max(l_j+d(i-j))$，因此可行性条件可以看作是对每个 $i\in[L,R]$ 都有 $\forall j\in[L,i),l_j+d(i-j)\le r_j$，移项可得有 $\max\limits_{j=L}^{i-1}(l_j+d(i-j)-r_j)\le 0$，套路的分离参数把 $i,j$ 的项分开考虑得到 $\max\limits_{j=L}^{i-1}[(l_j-jd)-(r_i-id)]\le 0$。为了让里面这个东西的值最大，容易想到在左侧取一个 $j$ 满足 $l_j-jd$ 的值最大，右侧取一个 $i$ 满足 $r_i-id$ 的值最小（显然需要满足 $L\le j<i\le R$）。

考虑用一个黑盒 ds 来维护上面的信息，在该黑盒的每个结点上维护信息 $mx$ 表示在该区间上的所有 $i$ 中 $l_i-id$ 的最大值，$mi$ 表示在该区间上的所有 $i$ 中 $r_i-id$ 的最小值，$df$ 表示在该区间上所有 $i$ 的 $(l_j-jd)-(r_i-id)$ 的最大值。先不管这个 $d$ 怎么处理考虑先合并信息，那么假设此时要合并的结点左右儿子分别为 $L,R$ 两个结点，$mx,mi$ 是容易的直接取对应的 $\max$ / $\min$ 值即可，而 $df$ 则可以直接从左右儿子继承，或在 $L$ 中取 $\max$，在 $R$ 中取 $\min$，即：$df=\max(L.df,R.df,L.mx-R.mi)$。

此时考虑 $d$ 的信息怎么处理，这个东西可以看作是每次操作会先对区间的 $i$ 位置值对应增加 $id$，操作结束时刻对区间的 $i$ 位置值对应减少 $id$，也就是每次区间加 / 减一个一次函数。注意到一次操作内只有给定的询问区间 $[L,R]$ 内的数才会被考虑到其余的数都不会被考虑到，因此直接把区间加减一次函数看作是对整体做操作。然后考虑到问题没有强制在线因此考虑 P5073 的套路把所有的 $d$ 离线下来从小到大排序，此时相邻两次 $d$ 的询问可以看作是整体加斜率为两个 $d$ 的差（这个值一定 $\ge 0$）截距为 $0$ 的一次函数，因此直接上 KTT 大力维护即可（注：为了保持 KTT 的结构这里需要把最小值取反，维护最小值相反数的最大值）。

然后容易发现 $k$ 这个信息是好处理的，很显然把 $L_i,L_i+1,\ldots,R_i$ 这些人按顺序依次分配到 $1,2,3,\ldots,k,1,2,3,\ldots,k,1,\ldots$ 队内就一定是最优的，证明简单调整法即可。

总时间复杂度为 $O(nk\log^3n)$ 瓶颈在于维护 KTT。但是众所周知 KTT 十分跑不满，实际运行下来也就 $O(nk\log^2n)$ 级别，因此可以通过该题。

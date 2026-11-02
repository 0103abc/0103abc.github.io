---
title: "P10045 [CCPC 2023 北京市赛] 线段树 题解"
date: "2025-11-16T08:39:19.000Z"
link: "luogu-6is5hs9a"
categories: ["题解"]
tags: ["洛谷", "数学", "数据结构", "线段树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/6is5hs9a)。

这我哪会啊

因为 $a_i$ 时刻为奇数，所以考虑把 $a_i$ 表示成 $2b_i+1$ 的形式。此时区间 $[l,r]$ 的乘积即可以表示为 $\prod\limits_{i=l}^r(2b_i+1)$ 的形式。又因为答案是对 $2^{20}$ 取模的，且有 $2\mid 2b_i$，因此上面的这个式子只用考虑有最多 $19$ 个选 $2b_i$ 的情况。

考虑直接用线段树维护这个东西。记 $cnt_i$ 表示在当前线段树结点对应区间 $[l,r]$ 上选 $i$ 个 $2b_i$ 作为乘积的方案数。合并枚举左右两侧选择的 $2b_i$ 数量然后简单计算即可。根据上面的分析只需要维护 $i=0\ldots 19$ 时的 $cnt_i$ 值即可。

总时间复杂度为 $O(nk^2\log n)$，其中 $k$ 取 $20$，卡常后可以过。

一个卡常技巧是答案用 `unsigned int` 存，众所周知 `unsigned int` 的乘法取模比 `int` 快，而且这个东西对 $2^{32}$ 自然溢出，然后就可以卡着时间限制通过。谴责出题人卡常。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
// #define int long long

using namespace std;
const int N = 200010;
const int mod = 1048576;
const int inf = 1e18;

#define int ui

using ui = unsigned;
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
        int fa[N], siz[N];
        inline DSU() { iota(fa, fa + N, 0), fill(siz, siz + N, 1); }
        inline void init(int maxn) { iota(fa, fa + maxn + 1, 0), fill(siz, siz + maxn + 1, 1); }
        inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
        inline int merge(int x, int y)
        {
            x = find(x), y = find(y);
            if (siz[x] > siz[y])
                x ^= y ^= x ^= y;
            if (x != y)
                return fa[x] = y, siz[y] += siz[x], 1;
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
        if (x > 1)
            phi *= (x - 1);
        return phi;
    }
}
using namespace Luminescent;

namespace Loyalty
{
    int C[N][22];
    int a[N], pwr[mod][20];
    struct Node
    {
        int l, r, cnt[20], tag;
        inline void init(int p)
        {
            l = r = p, tag = 0, memset(cnt, 0, sizeof cnt);
            cnt[0] = 1, cnt[1] = a[p];
        }
        inline void push(int x)
        {
            tag = (tag + x) % mod;
            int tmp[20] = {0};
            for (int i = 0; i < 20; ++i)
                for (int j = 0; j <= min(i, r - l + 1); ++j)
                    tmp[i] = (tmp[i] + cnt[j] * pwr[x][i - j] % mod * C[r - l + 1 - j][i - j]) % mod;
            for (int i = 0; i < 20; ++i)
                cnt[i] = tmp[i];
        }
    } tree[N << 2];
    inline Node operator+(const Node &l, const Node &r)
    {
        Node res;
        res.l = l.l, res.r = r.r, res.tag = 0;
        memset(res.cnt, 0, sizeof res.cnt);
        for (int i = 0; i < 20; ++i)
            for (int j = 0; i + j < 20; ++j)
                res.cnt[i + j] = (res.cnt[i + j] + l.cnt[i] * r.cnt[j] % mod) % mod;
        return res;
    }
    inline void build(int l, int r, int rt)
    {
        if (l == r)
            return tree[rt].init(l);
        int mid = l + r >> 1;
        build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
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
    inline void loyalty(int rt, int ll, int rr, int v)
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
    inline Node luminescent(int rt, int ll, int rr)
    {
        int &l = tree[rt].l, &r = tree[rt].r;
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
    inline void init() { }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        int n, q; cin >> n >> q;
        for (int i = 1; i <= n; ++i)
            cin >> a[i], --a[i];
        build(1, n, 1);
        for (int i = 0; i < mod; ++i)
        {
            pwr[i][0] = 1;
            for (int j = 1; j < 20; ++j)
                pwr[i][j] = pwr[i][j - 1] * i % mod;
        }
        for (int i = 0; i < N; ++i)
        {
            C[i][0] = 1;
            for (int j = 1; j <= min(i, 20u); ++j)
                C[i][j] = (C[i - 1][j] + C[i - 1][j - 1]) % mod;
        }
        while (q--)
        {
            int o, l, r, x; cin >> o >> l >> r;
            if (o == 1) { cin >> x; loyalty(1, l, r, x); }
            else
            {
                auto o = luminescent(1, l, r);
                int res = 0;
                for (int i = 0; i < 20; ++i)
                    res = (res + o.cnt[i]) % mod;
                cout << res << '\n';
            }
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

/*

为你翘课的那一天
花落的那一天
教室的那一间
我怎么看不见
消失的下雨天
我好想再淋一遍
没想到失去的勇气我还留着
好想再问一遍
你会等待还是离开
刮风这天我试过握着你手
但偏偏雨渐渐大到我看你不见
还要多久我才能在你身边
等到放晴的那天也许我会比较好一点
从前从前有个人爱你很久
但偏偏风渐渐把距离吹得好远
好不容易又能再多爱一天
但故事的最后你好像还是说了拜拜

*/
```

## 做题笔记补充

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/obgeyrgs)。

没见过就不会做系列

因为 $a_i$ 时刻为奇数，所以考虑把 $a_i$ 表示成 $2b_i+1$ 的形式。此时区间 $[l,r]$ 的乘积即可以表示为 $\prod\limits_{i=l}^r(2b_i+1)$ 的形式。又因为答案是对 $2^{20}$ 取模的，且有 $2\mid 2b_i$，因此上面的这个式子只用考虑有最多 $19$ 个选 $2b_i$ 的情况。

考虑直接用线段树维护这个东西。记 $cnt_i$ 表示在当前线段树结点对应区间 $[l,r]$ 上选 $i$ 个 $2b_i$ 作为乘积的方案数。合并枚举左右两侧选择的 $2b_i$ 数量然后简单计算即可。根据上面的分析只需要维护 $i=0\ldots 19$ 时的 $cnt_i$ 值即可。

总时间复杂度为 $O(nk^2\log n)$，其中 $k$ 取 $20$，卡常后可以过。

一个卡常技巧是答案用 `unsigned int` 存，众所周知 `unsigned int` 的乘法取模比 `int` 快，而且这个东西对 $2^{32}$ 自然溢出，然后就可以卡着时间限制通过。谴责出题人卡常。

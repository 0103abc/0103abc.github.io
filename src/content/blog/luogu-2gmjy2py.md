---
title: "P11288 [COTS 2017] 模板 Z1 题解"
date: "2026-05-06T14:52:55.000Z"
link: "luogu-2gmjy2py"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "动态规划", "基础算法", "模拟"]
draft: false
---

容易想到先求出 $lim_i$ 表示 $i$ 位置最大可以填多少，离线然后线段树区间覆盖即可做到单 $\log$。此时把所有位置分为两类：

+ $i$ 位置没有限制条件，则这个位置填 $0\sim h-1$ 这 $h$ 个数都不会对答案造成影响，在最后单独处理即可。
+ $i$ 位置有限制条件。后面将对该类限制条件进行讨论。

为了方便处理，后面把值域整体平移 $1$，即 $[0,h)\to [1,h]$。

比较套路的，对每个不同的限制 $x$，把所有 $lim_i=x$ 的位置 $i$ 放在一起单独考虑。给位置重标号，记该类 $x$ 有 $m$ 个位置，限制形如 $(l,r,x)$，则此时考虑 dp，设 $g_i$ 表示新序列前 $i$ 个位置满足了所有**已经结束**的限制，方案数是多少。直接转移比较困难，因此考虑再设 $f_{i,j}$ 表示当前处理到了位置 $i$，且最后一个填 $x$ 的位置是 $j$ 的方案数。初始条件显然是 $g_0=f_{0,0}=1$。

转移 $f$ 数组考虑分类讨论：

+ 第 $i$ 位填的数严格小于 $x$：
  + 此时这个位置有 $x-1$ 个不同的填写方法，显然有 $f_{i,j}\leftarrow f_{i,j}(x-1)$。
+ 第 $i$ 为填的数恰好为 $x$：
  + 此时前 $i-1$ 位只要合法就可以在后面接上一个 $x$，所以有 $f_{i,j}=g_{i-1}$。

然后考虑转移 $g$ 数组，同样需要分类讨论：

+ 如果 $i$ 位置不会结束任何一个限制区间，则这个位置填 $1\sim x$ 中任意一个数都可以，即 $g_i\leftarrow xg_{i-1}$。
+ 否则，记所有 $i$ 位置结束的限制区间中左端点最大为 $L$，则 $[L,i]$ 中必须至少有一个位置值为 $x$。因此此时 $f_{i,j}$ 状态合法当且仅当 $j\ge L$，需要先执行 $f_{i,k}\leftarrow 0(k<L)$。此时显然有 $g_i=\sum\limits_{j=L}^if_{i,j}$。

直接模拟上述过程转移时间复杂度是 $O(n^2)$ 的（这里认为 $n,m,h$ 同阶），考虑优化。注意到时间复杂度瓶颈在于 $f$ 数组的转移，而 $f$ 数组从 $f_{i-1}$ 转移到 $f_i$ 的过程可以看作是单点修改区间乘区间覆盖为 $0$，$g_i$ 获取 $f_i$ 的信息可以看作是区间求和。因此对 $f_i$ 数组维护线段树，支持单点修改，区间覆盖，区间乘法，区间求和四个操作即可。时间复杂度被优化到 $O(n\log n)$，可以通过该题。

代码实现可以偷懒把区间覆盖看作是区间乘 $0$ 以减少码量，虽然代码比较长但是没有什么细节，整体还是比较好写的。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;
bool beginmem;
constexpr int N = 1000010;
constexpr int mod = 1e9 + 7;
constexpr int inf = 1e18;
using ld = long double;
using i128 = __int128;

int n, m, h;
struct Limit {
    int l, r, x;
} limits[N];

int lim[N];

inline int power(int a, int b, int c) {
    int ans = 1;
    while (b) {
        if (b & 1) ans = ans * a % c;
        a = a * a % c, b >>= 1;
    } return ans;
}

namespace SegTree_1 {
    struct Node {
        int l, r, val, tag;
        inline void init(int p) { l = r = p, val = inf, tag = -1; }
        inline void push(int v) { val = tag = v; }
    } tree[N << 2];
    inline Node operator+(const Node &l, const Node &r) {
        return {l.l, r.r, l.val + r.val, -1};
    }
    inline void pushdown(int rt) {
        if (~tree[rt].tag) {
            tree[rt << 1].push(tree[rt].tag);
            tree[rt << 1 | 1].push(tree[rt].tag);
            tree[rt].tag = -1;
        }
    }
    inline void build(int l, int r, int rt) {
        if (l == r) return tree[rt].init(l);
        int mid = l + r >> 1;
        build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    inline void mdf(int rt, int ll, int rr, int v) {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (ll <= l && r <= rr) return tree[rt].push(v);
        int mid = l + r >> 1; pushdown(rt);
        if (ll <= mid) mdf(rt << 1, ll, rr, v);
        if (mid < rr) mdf(rt << 1 | 1, ll, rr, v);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    inline int qry(int rt, int pos) {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (l == r) return tree[rt].val;
        int mid = l + r >> 1; pushdown(rt);
        return qry((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos);
    }
}

namespace SegTree_2 {
    struct Node {
        int l, r, sum, add, mul;
        inline void init(int p) { l = r = p, sum = add = 0, mul = 1; }
        inline void push(int Add, int Mul) {
            sum = (sum * Mul % mod + Add * (r - l + 1) % mod) % mod;
            mul = mul * Mul % mod, add = (add * Mul % mod + Add) % mod;
        }
    } tree[N << 2];
    inline Node operator+(const Node &l, const Node &r) {
        return {l.l, r.r, (l.sum + r.sum) % mod, 0, 1};
    }
    inline void pushdown(int rt) {
        if (tree[rt].add || tree[rt].mul != 1) {
            tree[rt << 1].push(tree[rt].add, tree[rt].mul);
            tree[rt << 1 | 1].push(tree[rt].add, tree[rt].mul);
            tree[rt].add = 0, tree[rt].mul = 1;
        }
    }
    inline void build(int l, int r, int rt) {
        if (l == r) return tree[rt].init(l);
        int mid = l + r >> 1;
        build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    inline void mdf_pnt(int rt, int pos, int v) {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (l == r) { tree[rt].sum = v; return; }
        int mid = l + r >> 1; pushdown(rt);
        if (pos <= mid) mdf_pnt(rt << 1, pos, v);
        else mdf_pnt(rt << 1 | 1, pos, v);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    inline void mdf_mul(int rt, int ll, int rr, int v) {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (ll <= l && r <= rr) return tree[rt].push(0, v);
        int mid = l + r >> 1; pushdown(rt);
        if (ll <= mid) mdf_mul(rt << 1, ll, rr, v);
        if (mid < rr) mdf_mul(rt << 1 | 1, ll, rr, v);
        tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
    }
    inline int qry(int rt, int ll, int rr) {
        int &l = tree[rt].l, &r = tree[rt].r;
        if (ll <= l && r <= rr) return tree[rt].sum;
        int mid = l + r >> 1, sum = 0;
        pushdown(rt);
        if (ll <= mid) sum = qry(rt << 1, ll, rr);
        if (mid < rr) sum = (sum + qry(rt << 1 | 1, ll, rr)) % mod;
        return sum;
    }
}

inline void init() {
}

vector<int> pos[N];
vector<pair<int, int>> buc[N];
int f[N][20], lg[N], lsh[N], L[N], R[N], maxL[N], g[N];
inline int qry(int l, int r) {
    int lgx = lg[r - l + 1];
    return max(f[l][lgx], f[r - (1 << lgx) + 1][lgx]);
}

inline void sol() {
    cin >> n >> m >> h;
    vector<tuple<int, int, int>> Limits;
    for (int i = 1; i <= m; ++i) {
        cin >> limits[i].l >> limits[i].r >> limits[i].x;
        ++limits[i].x, Limits.emplace_back(limits[i].l, limits[i].r, limits[i].x);
    }
    sort(Limits.begin(), Limits.end(), [&](auto &l, auto &r) {
        return get<2>(l) > get<2>(r);
    });
    SegTree_1::build(1, n, 1);
    int unlimit_cnt = 0;
    for (auto &[l, r, x] : Limits) SegTree_1::mdf(1, l, r, x);
    for (int i = 1; i <= n; ++i) {
        int val = SegTree_1::qry(1, i);
        if (val == inf) ++unlimit_cnt;
        else lim[i] = min(h, val);
    }
    lg[0] = -1;
    for (int i = 1; i <= n; ++i) lg[i] = lg[i >> 1] + 1, f[i][0] = lim[i];
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= n - (1 << i) + 1; ++j)
            f[j][i] = max(f[j][i - 1], f[j + (1 << (i - 1))][i - 1]);
    for (auto &[l, r, x] : Limits)
        if (qry(l, r) != x) { cout << 0 << '\n'; return; }
    for (auto &[l, r, x] : Limits) buc[x].emplace_back(l, r);
    for (int i = 1; i <= n; ++i)
        if (lim[i]) pos[lim[i]].emplace_back(i);
    int res = power(h, unlimit_cnt, mod);
    for (int x = 1; x <= h; ++x) if (buc[x].size()) {
        for (int j = 0; j <= pos[x].size() + 1; ++j) maxL[j] = 0;
        for (auto &[l, r] : buc[x]) {
            int L = lower_bound(pos[x].begin(), pos[x].end(), l) - pos[x].begin() + 1;
            int R = upper_bound(pos[x].begin(), pos[x].end(), r) - pos[x].begin();
            maxL[R] = max(maxL[R], L);
        }
        g[0] = 1;
        SegTree_2::build(0, pos[x].size(), 1);
        SegTree_2::mdf_pnt(1, 0, 1);
        for (int j = 1; j <= pos[x].size(); ++j) {
            SegTree_2::mdf_mul(1, 0, j - 1, x - 1);
            SegTree_2::mdf_pnt(1, j, g[j - 1]);
            if (maxL[j]) SegTree_2::mdf_mul(1, 0, maxL[j] - 1, 0);
            g[j] = SegTree_2::qry(1, maxL[j], j);
        }
        res = res * g[pos[x].size()] % mod;
    }
    cout << res << '\n';
}
bool endmem;

signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int T = 1;
    // cin >> T;
    init();
    while (T--) sol();
    return 0;
}
```

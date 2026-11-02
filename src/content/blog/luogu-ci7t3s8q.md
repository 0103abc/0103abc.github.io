---
title: "CF1131G Most Dangerous Shark 题解"
date: "2025-04-22T15:57:18.000Z"
link: "luogu-ci7t3s8q"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "基础算法", "排序", "数据结构", "线段树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ci7t3s8q)。

这题很厉害啊。首先根据题意有 $O(n^2)$ 的简单 dp：设 $f_i$ 表示当前只考虑第 $i$ 个骨牌，把 $1\sim i$ 的骨牌都推倒的代价。那么要么 $i$ 被向左推倒（很显然向右推倒在当前子状态下一定不会更优），要么被前面的某个 $j$ 所推倒。

容易在线性的时间复杂度内处理出 $l_i,r_i$ 表示 $i$ 最左边 / 最右边可以直接和间接创飞的骨牌，那么很显然若将骨牌按照坐标从小到大排序，那么 $i$ 被创之后可以创的区间一定连续。

因此得到下面的简单转移：$f_i=\min(\min\limits_{j=l_i}^if_{j-1}+a_i,\min\limits_{j\le i\le r_j}f_{j-1}+a_j)$。左右两个部分分别用线段树优化，时间复杂度为 $O(n\log n)$。

但是 $n\le 10^7$，因此必须使用线性或者 $O(n\log\log n)$ 的算法。

发现这个地方 $l_i,r_i$ 的性质十分优美，因此考虑推一下性质：

对于 $i\neq j$，则 $[l_i,i]$ 和 $[l_j,j]$ 要么无交集，要么一个包含于另一个。证明考虑反证。钦定 $i<j$，则两区间有交且互不包含当且仅当 $l_i<l_j<i<j$，但是很显然此时 $j$ 能推倒 $i$ 那么 $j$ 一定能间接推倒 $l_i$，所以该情况一定不合法。$[i,r_i]$ 一类区间也有相同的性质。

因此考虑建立一个（不知道怎么想到的）结构：对于每一个 $i$ 求出其对应区间 $[l_i,i]$，那么 $i$ 为 $j$ 的直接父亲结点，当且仅当 $[l_j,j]\in[l_i,i]$，$r$ 也同样建立这样结构，但是把包含关系倒过来即可。

那么此时该结构形如一个森林，考虑分别在两个森林上 dp。

对于第一个森林，考虑当前转移到 $i$ 点，那么所有能转移到 $i$ 的点全都在 $i$ 的子树中，就直接求子树 $\min$ 即可；第二个森林所有能转移到 $i$ 的点都在 $i$ 的 $k$ 级祖先中，直接求到根节点所在链的 $\min$ 即可。因此本题做完，时间复杂度为 $O(n)$ 可以通过。

代码：

```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/rope>
#define int long long
using namespace std;
// const int N = 500010;
const int inf = 2e18;
using ull = unsigned long long;
template<class _T>
using treap = __gnu_pbds::tree<_T, __gnu_pbds::null_type, less_equal<_T>, __gnu_pbds::rb_tree_tag, __gnu_pbds::tree_order_statistics_node_update>;
using POD = pair<double, double>;
const double pi = acos(-1);
using cauto = complex<double>;
const int N = 10000010, M = 300010;
const int mod = 1e9 + 7;
const ull base = 218105633;
int bg[M], ed[M], a[M], b[M], aa[N], bb[N], f[M], g[M], h[M], up[M], up2[M];
bitset<M> vis;
vector<int> adj[M], adj2[M];
void dfs(int u, int fa) {
    up[u] = fa, vis[u] = 1;
    for (int &v : adj[u])
        if (v != fa) dfs(v, u);
}
void dfs2(int u, int fa) {
    up2[u] = fa, vis[u] = 1;
    for (int &v : adj2[u])
        if (v != fa) dfs2(v, u);
}
signed main() {
    // freopen("count.in", "r", stdin);
    // freopen("count.out", "w", stdout);
    // freopen("debug.err", "w", stderr);
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    srand(time(0));
    int n, m;
    cin >> n >> m;
    int idx = 0;
    for (int i = 1; i <= n; ++i) {
        int x;
        cin >> x;
        bg[i] = idx + 1, ed[i] = idx + x;
        for (int j = 1; j <= x; ++j) cin >> aa[idx + j];
        for (int j = 1; j <= x; ++j) cin >> bb[idx + j];
        idx += x;
    }
    int q;
    cin >> q;
    idx = 0;
    while (q--) {
        int id, mul;
        cin >> id >> mul;
        for (int i = bg[id]; i <= ed[id]; ++i) {
            ++idx;
            a[idx] = aa[i];
            b[idx] = bb[i] * mul;
        }
    }
    stack<int> stk;
    for (int i = 1; i <= m; ++i) {
        while (stk.size() && i - stk.top() < a[i]) {
            int t = stk.top();
            stk.pop();
            adj[i].emplace_back(t);
            adj[t].emplace_back(i);
            up[t] = i;
            // cerr << "ae1 " << i << ' ' << t << '\n';
        }
        stk.emplace(i);
    }
    while (stk.size()) stk.pop();
    for (int i = m; i; --i) {
        while (stk.size() && stk.top() - i < a[i]) {
            int t = stk.top();
            stk.pop();
            adj2[i].emplace_back(t);
            adj2[t].emplace_back(i);
            up2[t] = i;
            // cerr << "ae2 " << i << ' ' << t << '\n';
        }
        stk.emplace(i);
    }
    // for (int i = 1; i <= m; ++i)
    //     if (!vis[i]) dfs(i, 0);
    // vis.reset();
    // for (int i = 1; i <= m; ++i)
    //     if (!vis[i]) dfs2(i, 0);
    g[0] = inf;
    for (int i = 1; i <= m; ++i) {
        f[i] = h[i - 1];
        g[i] = h[i - 1] + b[i];
        for (int &j : adj[i])
            if (j != up[i]) f[i] = min(f[i], f[j]);
        g[i] = min(g[i], g[up2[i]]);
        h[i] = min(f[i] + b[i], g[i]);
    }
    cout << h[m] << '\n';
    return 0;
}
```

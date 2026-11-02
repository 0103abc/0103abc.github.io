---
title: "P3838 [IOI 2017] Toy Train 题解"
date: "2026-10-24T14:56:43.000Z"
link: "luogu-9jsm1a8c"
categories: ["题解"]
tags: ["洛谷", "搜索", "广度优先搜索", "数学", "数论"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/9jsm1a8c)。

有向图博弈问题考虑从外侧不断删除必败状态。设 $W$ 为当前没有确定为必败的状态组成的集合。则考虑对每个点 $u$ 如果其属于 $A$ 集合那么只要存在一条出边通往 $W$ 集合即可；如果其属于 $B$ 集合必须保证其所有出边都能通往 $W$ 集合。设满足这个条件的充电站组成的集合为 $P$（即 $A$ 可以保证从 $P$ 集合开始继续走一定能走到 $W$ 集合中的某个点）。

考虑从 $P$ 集合开始在反向图上跑 BFS 求出集合 $X$ 表示所有能由 $A$ 强制到达合适的充电站且不离开 $W$ 集合的点组成的点集。则此时 $W\backslash X$ 中的点无法保证可以到达合适充电站也就是当前的坏点。把所有已经离开 $W$ 集合的点也看作是坏点，然后用同样的方法求出 $B$ 所对应的集合 $Y$，把 $Y\cap W$ 从 $W$ 集合中删除。重复上述过程直到 $W$ 不再变化，最后 $W$ 集合中剩下的点就是答案。

时间复杂度 $O(nm)$ 可以通过该题。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <cassert>
#include <ext/pb_ds/assoc_container.hpp>
// #define int long long

using namespace std;

bool beginmem;
constexpr int N = 1000010;
constexpr int mod = 998244353;
constexpr int i2 = mod + 1 >> 1;
// constexpr int inf = 2e18;
using ld = long double;
using i64 = long long;
using u16 = unsigned short;
using u32 = unsigned;
using u64 = unsigned long long;
using i128 = __int128;
using u128 = __uint128_t;

inline int power(int a, int b, int c) {
    int res = 1;
    while (b) {
        if (b & 1) res = 1LL * res * a % c;
        a = 1LL * a * a % c, b >>= 1;
    } return res;
}

inline int exgcd(int a, int b, int &x, int &y) {
    if (!b) return x = 1, y = 0, a;
    int xp, yp, f = exgcd(b, a % b, xp, yp);
    return x = yp, y = xp - a / b * yp, f;
}

inline int inversion(int a, int Mod = mod) { return power(a, Mod - 2, Mod); }

inline u64 splitmix64(u64 x) {
    x += 0x9e3779b97f4a7c15ULL;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    return x ^ (x >> 31);
}

inline void addmod(int &x, int v) { x = (x + v) % mod; }
inline void submod(int &x, int v) { x = (x + mod - v) % mod; }

vector<int> adj[N];
int deg[N], w[N], win[N], e[N], rem[N], vis[N], all[N];

vector<int> who_wins(vector<int> a, vector<int> r, vector<int> u, vector<int> v) {
    int n = a.size(), m = u.size();
    for (int i = 0; i < n; ++i) deg[i] = 0, adj[i].clear(), win[i] = w[i] = all[i] = 1;
    for (int i = 0; i < m; ++i) adj[v[i]].emplace_back(u[i]), ++deg[u[i]];
    while (1) {
        vector<int> tow(n, 0), e(n, 0);
        for (int i = 0; i < m; ++i) if (w[v[i]]) ++tow[u[i]];
        for (int i = 0; i < n; ++i) if (w[i] && r[i]) {
            if (a[i] == 1) e[i] = (int)(tow[i] > 0);
            else e[i] = (int)(tow[i] == deg[i]);
        } auto get = [&](int *allow, vector<int> &tar, int o) {
            for (int i = 0; i < n; ++i) vis[i] = 0, rem[i] = deg[i];
            queue<int> q; for (int i = 0; i < n; ++i) if (tar[i] && allow[i]) vis[i] = 1, q.emplace(i);
            while (q.size()) {
                int t = q.front(); q.pop();
                for (int &x : adj[t]) if (allow[x] && !vis[x]) {
                    if (a[x] == o) vis[x] = 1, q.emplace(x);
                    else if (!--rem[x]) vis[x] = 1, q.emplace(x);
                }
            } vector<int> res(n, 0);
            for (int i = 0; i < n; ++i) res[i] = vis[i];
            return res;
        };
        vector<int> X = get(w, e, 1), bad(n, 0);
        for (int i = 0; i < n; ++i) bad[i] = !X[i] || !w[i];
        vector<int> Y = get(all, bad, 0);
        int ok = 0; for (int i = 0; i < n; ++i)
            if (w[i] && Y[i]) w[i] = 0, ok = 1;
        if (!ok) break;
    } vector<int> res(n, 0);
    for (int i = 0; i < n; ++i) res[i] = w[i];
    return res;
}

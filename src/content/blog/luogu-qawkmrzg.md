---
title: "P11073 Game King 题解"
date: "2025-04-24T16:05:32.000Z"
link: "luogu-qawkmrzg"
categories: ["题解"]
tags: ["洛谷", "基础算法", "排序", "图论", "强连通分量"]
draft: false
---

糖丸啦。~~是谁在比赛中获得了 30 分的好成绩来着？~~

首先套路的对图做强连通缩点，得到一个 dag 森林。

考虑什么样的点可以满足题目中给出的那个条件。首先如果 dag 森林在无向环境下不连通那么肯定不可能满足，否则考虑对 dag 森林做拓扑排序，那么 $x$ 点满足条件的充要条件是：

+ $x$ 点可以到达所有拓扑序比 $x$ 大的点。
+ $x$ 点可以被所有拓扑序比 $x$ 小的点到达。

那么什么样的 $x$ 会满足这个条件呢？考虑经典结论：

> 在拓扑排序的任意时刻，队列中任意两点都不可达。

（没见过建议去做 [CF1062F Upgrading Cities](/problem/CF1062F)）。

然后正反建两遍图跑拓扑排序验证上面的结论，然后因为有图不连通等神秘 corner case，还需要两次记录到每一个点的时候，还没有访问过的点的数量是多少，最后再判断一下即可。

时间复杂度为 $O(n)$，但是不知道为什么我跑的很慢（可能写丑了）。

```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/rope>
#define y1 storz
#define int long long
using namespace std;
const int inf = 2e18;
using ull = unsigned long long;
template<class _T>
using treap = __gnu_pbds::tree<_T, __gnu_pbds::null_type, less_equal<_T>, __gnu_pbds::rb_tree_tag, __gnu_pbds::tree_order_statistics_node_update>;
using POD = pair<double, double>;
const double pi = acos(-1);
using cauto = complex<double>;
const int mod = 998244353;
const int N = 1000010;
stack<int> stk;
vector<int> adj[N];
int dfn[N], low[N], bel[N], siz[N], idx, tot, instk[N];
void dfs(int u) { dfn[u] = low[u] = ++idx, instk[u] = 1, stk.emplace(u);
    for (int &v : adj[u]) if (!dfn[v]) dfs(v), low[u] = min(low[u], low[v]);
    else if (instk[v]) low[u] = min(low[u], dfn[v]);
    if (dfn[u] == low[u]) { ++tot;
        while (stk.top() != u) {
            int t = stk.top(); stk.pop();
            bel[t] = tot, instk[t] = 0, ++siz[tot];
        }
        int t = stk.top(); stk.pop();
        bel[t] = tot, instk[t] = 0, ++siz[tot];
    }
}
int deg[N], vis[N], vis2[N], f[N], g[N];
pair<int, int> edge[N * 3];
signed main() {
    // freopen("count.in", "r", stdin);
    // freopen("count.out", "w", stdout);
    // freopen("debug.err", "w", stderr);
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    srand(time(0));
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; ++i) {
        int a, b;
        cin >> a >> b;
        adj[a].emplace_back(b);
        edge[i] = {a, b};
    }
    for (int i = 1; i <= n; ++i)
        if (!dfn[i]) dfs(i);
    for (int i = 1; i <= n; ++i) adj[i].clear();
    // for (int i = 1; i <= n; ++i) bel[i] = i;
    for (int i = 0; i < m; ++i) {
        auto &[a, b] = edge[i];
        if (bel[a] != bel[b]) adj[bel[a]].emplace_back(bel[b]), ++deg[bel[b]];
    }
    queue<int> q;
    for (int i = 1; i <= tot; ++i)
        if (!deg[i]) q.emplace(i), f[i] = siz[i];
    int cnt = n;
    while (q.size()) {
        int t = q.front();
        q.pop();
        if (q.empty()) vis[t] = 1;
        f[t] = cnt;
        cnt -= siz[t];
        for (int &g : adj[t])
            if (!--deg[g]) q.emplace(g);
    }
    for (int i = 1; i <= n; ++i) adj[i].clear(), deg[i] = 0;
    for (int i = 0; i < m; ++i) {
        auto &[a, b] = edge[i];
        if (bel[a] != bel[b]) adj[bel[b]].emplace_back(bel[a]), ++deg[bel[a]];
    }
    for (int i = 1; i <= tot; ++i)
        if (!deg[i]) q.emplace(i), g[i] = siz[i];
    cnt = n;
    while (q.size()) {
        int t = q.front();
        q.pop();
        if (q.empty()) vis2[t] = 1;
        g[t] = cnt;
        cnt -= siz[t];
        for (int &g : adj[t])
            if (!--deg[g]) q.emplace(g);
    }
    for (int i = 1; i <= tot; ++i)
        if (vis[i] && vis2[i] && f[i] + g[i] - siz[i] == n) cnt += siz[i];
    cout << cnt << '\n';
    return 0;
}
```

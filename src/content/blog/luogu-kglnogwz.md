---
title: "CF732F Tourist Reform 题解"
date: "2025-02-15T02:22:55.000Z"
link: "luogu-kglnogwz"
categories: ["题解"]
tags: ["Codeforces", "图论", "强连通分量", "搜索", "深度优先搜索", "树"]
draft: false
---

可以证明每个边双都可以通过给边定向使得点对之间两两可达。因此对图跑边双缩点，那么剩下一个带点权的树。让树根为点数最大的结点，其余点全部指向父亲一定最优。因此做完了。

具体来说：对于新建的缩点后的树，直接从根节点往叶子结点连；对于每一个强连通分量直接在上面 dfs 出一棵树然后剩下的全部连返祖边即可。

代码，但是带一只 $\log$。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
// #define int long long
using namespace std;
const int N = 400010;
const int mod = 1e9 + 7;
vector<pair<int, int>> adj[N];
pair<int, int> id[N<<1];
int dfn[N], low[N], fa[N], bel[N];
int idx; set<pair<int, int>> bri;
void dfs(int u, int idd) {
    dfn[u] = low[u] = ++idx;
    for (auto &[v, w] : adj[u])
        if (!dfn[v]) {
            dfs(v, w);
            low[u] = min(low[u], low[v]);
            if (dfn[u] < low[v]) bri.emplace(id[w]), bri.emplace(id[w^1]);
        } else if (w != (idd^1)) low[u] = min(low[u], dfn[v]);
}
int find(int x) {
    return x == fa[x] ? x : fa[x] = find(fa[x]);
}
void Merge(int x, int y) {
    x = find(x), y = find(y);
    if (x != y) fa[x] = y;
}
int siz[N];
vector<int> adj2[N], adj3[N];
vector<pair<int, int>> eres;
vector<int> scc[N];
int depth[N];
void dfs2(int u, int fa) {
    depth[u] = depth[fa] + 1;
    for (int &v : adj2[u])
        if (v != fa) dfs2(v, u);
}
set<pair<int, int>> use;
int vis[N], dep[N];
void dfs3(int u, int fa = 0) {
    vis[u] = 1;
    dep[u] = dep[fa] + 1;
    for (int &v : adj3[u])
        if (!vis[v]) {
            eres.emplace_back(u, v);
            use.emplace(u, v);
            use.emplace(v, u);
            dfs3(v, u);
        }
}
pair<int, int> rres[N];
map<pair<int, int>, int> back;
int tb[N];
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) {
        int a, b;
        cin >> a >> b;
        adj[a].emplace_back(b, i << 1);
        adj[b].emplace_back(a, i << 1 | 1);
        id[i << 1] = {a, b};
        id[i << 1 | 1] = {b, a};
        back[{a, b}] = back[{b, a}] = i;
    }
    for (int i = 1; i <= n; ++i)
        if (!dfn[i]) dfs(i, 0);
    iota(fa, fa + n + 1, 0);
    for (int i = 2; i <= m + m + 1; ++i) {
        auto [x, y] = id[i];
        if (!bri.count({x, y})) Merge(x, y);
    }
    for (int i = 1; i <= n; ++i) bel[i] = find(i);
    for (int i = 1; i <= n; ++i) tb[i] = bel[i];
    sort(tb + 1, tb + n + 1);
    int index = unique(tb + 1, tb + n + 1) - tb - 1;
    for (int i = 1; i <= n; ++i) bel[i] = lower_bound(tb + 1, tb + index + 1, bel[i]) - tb;
    idx = index;
    for (int i = 1; i <= n; ++i) ++siz[bel[i]];
    int mx = -1, idd = -1;
    for (int i = 1; i <= idx; ++i)
        if (mx < siz[i]) mx = siz[i], idd = i;
    for (int i = 2; i <= m + m + 1; ++i) {
        auto [x, y] = id[i];
        if (bel[x] != bel[y]) adj2[bel[x]].emplace_back(bel[y]);
    }
    cout << siz[idd] << '\n';
    dfs2(idd, 0);
    for (int i = 1; i <= n; ++i) scc[bel[i]].emplace_back(i);
    for (int i = 1; i <= idx; ++i) {
        if (scc[i].empty()) continue;
        for (int &j : scc[i])
            for (auto &[k, o] : adj[j])
                if (bel[j] == bel[k]) adj3[j].emplace_back(k);
        use.clear();
        dfs3(scc[i][0]);
        for (int &j : scc[i])
            for (auto &[k, o] : adj[j])
                if (bel[j] == bel[k])
                    if (!use.count({j, k})) {
                        if (dep[j] <= dep[k]) eres.emplace_back(k, j);
                        else eres.emplace_back(j, k);
                    }
        for (int &j : scc[i]) adj3[j].clear(), vis[j] = 0;
    }
    for (int i = 1; i <= idx; ++i)
        for (int j : adj2[i]) {
            assert(i != j);
            int ti = i;
            if (depth[i] < depth[j]) swap(i, j);
            // i --> j
            for (int &k : scc[i])
                for (auto &[p, o] : adj[k])
                    if (bel[p] == j) {
                        eres.emplace_back(k, p);
                        goto label;
                    }
            label:;
            i = ti;
        }
    sort(eres.begin(), eres.end());
    eres.erase(unique(eres.begin(), eres.end()), eres.end());
    for (auto &[x, y] : eres) {
        int id = back[{x, y}];
        rres[id] = {x, y};
    }
    for (int i = 1; i <= m; ++i) cout << rres[i].first << ' ' << rres[i].second << '\n';
    return 0;
}


```

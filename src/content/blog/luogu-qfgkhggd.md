---
title: "CF830E Perpetual Motion Machine 题解"
date: "2025-05-08T14:01:10.000Z"
link: "luogu-qfgkhggd"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/qfgkhggd)。

我切 $3100$，真的假的？

容易观察到若不考虑 $\exists i,d_i\neq 0$ 的限制，那么 $\forall i\in[1,n]$ 都给 $d_i\leftarrow 0$ 就是一组合法的构造。因此图不连通其实就是个幌子，若有一个连通块可以构造出合法解，那么其他连通块全填 $0$ 就是合法解。因此下面仅讨论图的一个连通块的情况。

从简单的情况入手。

+ 若该连通块中只有一个结点，那么肯定没法构造。
+ 若该连通块中只有一个环，那么可以给环上所有结点都赋值 $1$，此时该环的点权和边权正好都为环的大小，显然这是一组合法的构造。
+ 若该连通块中存在至少一个环，那么给其中一个环上所有点赋值 $1$，其余点全部赋值 $0$。容易发现此时合法的贡献只有这个被选中的环上的结点，点权和边权恰好抵消，是一组合法的构造。
+ 若该连通块中存在一个度数 $\ge 4$ 的点，那么任意选中一个这样的点 $u$，给这个点赋值 $2$，其相邻结点 $v$ 全部赋值为 $1$，连通块内其余结点赋值为 $0$。这是一组合法的构造。
+ 若该连通块中存在至少两个度数为 $3$ 的点，则任选两个不同的点 $u,v$，此时因为连通块不存在环因此必然是一棵树，找到其唯一简单路径并把路径上所有点点权赋值为 $2$，连通块内其余点点权赋值为 $1$ 就是一组合法的解。
+ 若该连通块中恰好存在一个度数为 $3$ 的点 $u$，那么该图必然形如从一点放射出恰好三条链的形状。考虑设三条链的长度分别为 $l_1,l_2,l_3$ 且使 $1\le l_1\le l_2\le l_3$（链长度不包含这个度数为 $3$ 的点），那么考虑找到所有能构造合法解的下界：
  + 若 $l_1=l_2=2$，则下界为 $l_3=2$。此时可以构造 $u$ 点点权为 $3$，三条链上距离 $u$ 点为 $1$ 的点点权为 $2$，距离 $u$ 点为 $2$ 的点点权为 $1$，其余连通块内的点点权为 $0$。容易发现这是一组合法的构造。
  + 若 $l_1=1$，此时若 $l_2=1$ 则手模一下发现无合法构造方案。若 $l_2=2$ 则发现若 $l_3=5$ 则可以构造出解。把 $u$ 点赋值点权为 $6$，第一条链上第一个点点权赋值为 $5$ 后面点点权全部赋值为 $0$，第二条链上前两个点点权赋值为 $4,2$ 后面点点权全部赋值为 $0$，第三条链上前五个点点权赋值为 $5,4,3,2,1$ 后面点点权全部赋值为 $0$。容易发现这是一组合法的构造。
  + 若 $l_2=3$，则此时下界为 $l_3=3$。此时可以构造 $u$ 点点权为 $4$，第一条链上第一个点点权赋值为 $2$ 后面点点权全部赋值为 $0$，另外两条链上前三个点点权赋值为 $3,2,1$ 后面点点权全部赋值为 $0$。容易发现这也是一组合法的构造。
  + 可以打表或者手模证明该子情况下未被上面三种情况所覆盖到的 $l_1,l_2,l_3$ 均不存在合法构造。
+ 若该连通块中最大度数点为 $2$ 也就是形成了一条链，那么容易证明一定不存在合法解。具体的：设点权分别为 $a_1,a_2,a_3,\ldots,a_k$，那么点权和为 $\sum\limits_{i=1}^ka_i^2$，边权和为 $\sum\limits_{i=1}^{k-1}a_ia_{i-1}$，做差之后随便推一下发现差恒大于 $0$，因此证完了。

上述分讨涵盖了所有需要讨论的情况，因此本题完成，若使用 dsu 维护时间复杂度为 $O(\alpha n)$，可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 200010;
vector<int> adj[N], adj2[N], scc[N];
int deg[N], res[N];
struct DSU {
    int fa[N];
    void init(int n) {
        iota(fa + 1, fa + n + 1, 1);
    }
    int find(int x) {
        return x == fa[x] ? x : fa[x] = find(fa[x]);
    }
    int merge(int x, int y) {
        x = find(x), y = find(y);
        if (x != y) return fa[x] = y, 1;
        return 0;
    }
} dsu;
pair<int, int> edge[N];
int up[N], dep[N], up2[N], dep2[N];
void dfs(int u, int fa) {
    up[u] = fa, dep[u] = dep[fa] + 1;
    for (int &v : adj2[u])
        if (v != fa) dfs(v, u);
}
void dfs2(int u, int fa) {
    up2[u] = fa, dep2[u] = dep2[fa] + 1;
    for (int &v : adj[u])
        if (v != fa) dfs2(v, u);
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int T;
    cin >> T;
    int tc = T, ca = 0;
    int nn = -1, mm = -1;
    while (T--) {
        // ++ca;
        int n, m;
        cin >> n >> m;
        for_each(adj + 1, adj + n + 1, [&](auto &o) {
            o.clear();
        });
        for_each(adj2 + 1, adj2 + n + 1, [&](auto &o) {
            o.clear();
        });
        fill(deg + 1, deg + n + 1, 0);
        fill(up + 1, up + n + 1, 0);
        fill(dep + 1, dep + n + 1, 0);
        fill(dep2 + 1, dep2 + n + 1, 0);
        fill(up2 + 1, up2 + n + 1, 0);
        for (int i = 0; i < m; ++i) {
            int a, b;
            cin >> a >> b;
            if (!~nn) nn = a, mm = b;
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
            edge[i] = {a, b};
            ++deg[a], ++deg[b];
        }
        dsu.init(n);
        vector<int> ring;
        for (int i = 0; i < m; ++i) {
            auto [a, b] = edge[i];
            if (!dsu.merge(a, b)) {
                for (int j = 1; j <= n; ++j)
                    if (!dep[j]) dfs(j, 0);
                vector<int> _a, _b;
                while (dep[a] != dep[b]) {
                    if (dep[a] > dep[b]) _a.emplace_back(a), a = up[a];
                    else _b.emplace_back(b), b = up[b];
                }
                while (a != b) {
                    _a.emplace_back(a), a = up[a];
                    _b.emplace_back(b), b = up[b];
                }
                reverse(_b.begin(), _b.end());
                ring.clear();
                for (int &i : _a) ring.emplace_back(i);
                ring.emplace_back(a);
                for (int &i : _b) ring.emplace_back(i);
                break;
            } else adj2[a].emplace_back(b), adj2[b].emplace_back(a);
        }
        dsu.init(n);
        for_each(scc + 1, scc + n + 1, [&](auto &o) {
            o.clear();
        });
        for (int i = 0; i < m; ++i) {
            auto [a, b] = edge[i];
            dsu.merge(a, b);
        }
        for (int i = 1; i <= n; ++i) scc[dsu.find(i)].emplace_back(i);
        fill(res + 1, res + n + 1, 0);
        int ok = 0;
        if (ring.size()) {
            ok = 1;
            for (int &i : ring) res[i] = 1;
        } else {
            for (int i = 1; i <= n; ++i)
                if (scc[i].size()) {
                    int mx = 0;
                    for_each(scc[i].begin(), scc[i].end(), [&](auto &o) {
                        mx = max(mx, deg[o]);
                    });
                    if (mx > 3) {
                        ok = 1;
                        int id = -1;
                        for_each(scc[i].begin(), scc[i].end(), [&](auto &o) {
                            if (deg[o] == mx) id = o;
                        });
                        res[id] = 2;
                        for_each(scc[i].begin(), scc[i].end(), [&](auto &o) {
                            if (o != id) res[o] = 1;
                        });
                        break;
                    } else if (mx == 3) {
                        vector<int> v;
                        for_each(scc[i].begin(), scc[i].end(), [&](auto &o) {
                            if (deg[o] == 3) v.emplace_back(o);
                        });
                        if (v.size() >= 2) {
                            ok = 1;
                            for_each(scc[i].begin(), scc[i].end(), [&](auto &o) {
                                res[o] = 1;
                            });
                            while (v.size() > 2) v.pop_back();
                            dfs2(scc[i][0], 0);
                            int x = v[0], y = v[1];
                            while (dep2[x] != dep2[y]) {
                                if (dep2[x] > dep2[y]) res[x] = 2, x = up2[x];
                                else res[y] = 2, y = up2[y];
                            }
                            while (x != y) {
                                res[x] = res[y] = 2;
                                x = up2[x], y = up2[y];
                            }
                            res[x] = 2;
                            break;
                        } else {
                            assert(v.size());
                            int i = v[0];
                            assert(adj[i].size() == 3);
                            int x[3] = {adj[i][0], adj[i][1], adj[i][2]}, l[3] = {1, 1, 1};
                            vector<int> path[3];
                            for (int _ = 0; _ < 3; ++_) {
                                int up = i, oo = 1;
                                while (1) {
                                    path[_].emplace_back(x[_]);
                                    oo = 1;
                                    for (int &o : adj[x[_]])
                                        if (up != o) {
                                            up = x[_], x[_] = o, oo = 0;
                                            break;
                                        }
                                    if (oo) break;
                                    ++l[_];
                                }
                            }
                            if (l[0] > l[1]) {
                                swap(l[0], l[1]);
                                swap(x[0], x[1]);
                                path[0].swap(path[1]);
                            }
                            if (l[0] > l[2]) {
                                swap(l[0], l[2]);
                                swap(x[0], x[2]);
                                path[0].swap(path[2]);
                            }
                            if (l[1] > l[2]) {
                                swap(l[1], l[2]);
                                swap(x[1], x[2]);
                                path[1].swap(path[2]);
                            }
                            if (l[0] >= 2 && l[1] >= 2 && l[2] >= 2) {
                                res[i] = 3;
                                res[path[0][0]] = 2;
                                res[path[0][1]] = 1;
                                res[path[1][0]] = 2;
                                res[path[1][1]] = 1;
                                res[path[2][0]] = 2;
                                res[path[2][1]] = 1;
                                ok = 1;
                                break;
                            }
                            if (l[0] >= 1 && l[1] >= 2 && l[2] >= 5) {
                                res[i] = 6;
                                res[path[0][0]] = 3;
                                res[path[1][0]] = 4;
                                res[path[1][1]] = 2;
                                res[path[2][0]] = 5;
                                res[path[2][1]] = 4;
                                res[path[2][2]] = 3;
                                res[path[2][3]] = 2;
                                res[path[2][4]] = 1;
                                ok = 1;
                                break;
                            }
                            if (l[0] >= 1 && l[1] >= 3 && l[2] >= 3) {
                                res[i] = 4;
                                res[path[0][0]] = 2;
                                res[path[1][0]] = 3;
                                res[path[1][1]] = 2;
                                res[path[1][2]] = 1;
                                res[path[2][0]] = 3;
                                res[path[2][1]] = 2;
                                res[path[2][2]] = 1;
                                ok = 1;
                                break;
                            }
                        }
                    }
                }
        }
        if (ok) {
            cout << "YES\n";
            for (int i = 1; i <= n; ++i) cout << res[i] << ' ';
            cout << '\n';
        } else cout << "NO\n";
    }
    return 0;
}
```

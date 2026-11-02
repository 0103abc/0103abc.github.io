---
title: "CF2133E I Yearned For The Mines 题解"
date: "2025-08-25T10:57:47.000Z"
link: "luogu-o819cgpu"
categories: ["题解"]
tags: ["Codeforces", "图论", "树", "搜索", "深度优先搜索", "基础算法", "贪心"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/o819cgpu)。

首先考虑树形态为一条链的情况：很显然直接从链的一段往链的另外一段执行 $1$ 操作就行。

扩展到树上可以考虑用最多 $\lfloor\frac n4\rfloor$ 次 $2$ 操作孤立若干个点然后让树形成若干条链。考虑贪心，设 $f_i$ 表示 $i$ 点的状态，这里令 $\text{RED}$ 表示 $i$ 点在链上，$\text{YELLOW}$ 表示 $i$ 点一定在链的顶端（即合并了两条链），$\text{GREEN}$ 表示 $i$ 点必须被封杀。则求 $f$ 数组可以一遍 dfs 解决：假设当前 dfs 到了树上的 $u$ 点，设其儿子集合为 $\text{son}_u$，那么若 $\exists v\in\text{son}_u,f_v=\text{YELLOW}$，则必有 $f_u=\text{GREEN}$，否则令 $\text{cnt}=\sum\limits_{v\in\text{son}_u}[f_v=\text{RED}]$，则若有 $\text{cnt}<2$ 则仍有 $f_v=\text{RED}$，若 $\text{cnt}=2$ 则有 $f_v=\text{YELLOW}$，否则必有 $f_v=\text{GREEN}$。

容易证明上述染色后 $\sum\limits_{i=1}^n[f_i=\text{GREEN}]\le\lfloor\frac n4\rfloor$，此时把所有没有 $\text{GREEN}$ 点的路径和单独的 $\text{GREEN}$ 点分别看做剖出来的链然后做链的染色即可。总时间复杂度为 $O(n)$ 可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;

const int N = 1000010;
const int mod = 998244353;
const int inf = 1e18;
using ull = unsigned long long;

int a[N], col[N], vis[N];
enum COLOR { RED = 1, YELLOW, GREEN } ;
// RED: 当前结点是单链
// YELLOW: 当前结点合并了两条链
// GREEN: 当前结点要被 2 操作销毁
vector<int> adj[N], adj2[N];
inline void color_dfs(int u, int fa)
{
    int cnt = 0;
    for (int &v : adj[u])
        if (v != fa)
        {
            color_dfs(v, u);
            if (col[v] == YELLOW)
                col[u] = GREEN;
            else if (col[v] == RED)
                ++cnt;
        }
    if (col[u] != GREEN)
    {
        if (cnt > 2)
            col[u] = GREEN;
        else if (cnt == 2)
            col[u] = YELLOW;
        else
            col[u] = RED;
    }
}

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    int T, ca = 1;
    cin >> T;
    int tc = T;
    while (T--)
    {
        int n;
        cin >> n;
        for_each(adj + 1, adj + n + 1, [&](auto &o) { o.clear(); });
        for_each(adj2 + 1, adj2 + n + 1, [&](auto &o) { o.clear(); });
        fill(col + 1, col + n + 1, 0);
        for (int i = 1; i < n; ++i)
        {
            int a, b;
            cin >> a >> b;
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
        }
        color_dfs(1, 0);
        // cerr << "col: ";
        // for (int i = 1; i <= n; ++i)
        //     cerr << col[i] << ' ';
        // cerr << '\n';
        vector<pair<int, int>> oper;
        for (int i = 1; i <= n; ++i)
            if (col[i] == GREEN)
            {
                oper.emplace_back(2, i);
                oper.emplace_back(1, i);
            }
        for (int i = 1; i <= n; ++i)
            if (col[i] != GREEN)
                for (int &j : adj[i])
                    if (col[j] != GREEN)
                        adj2[i].emplace_back(j);
        fill(vis + 1, vis + n + 1, 0);
        for (int i = 1; i <= n; ++i)
            if (adj2[i].size() == 0 && col[i] != GREEN)
                oper.emplace_back(1, i);
            else if (adj2[i].size() == 1 && !vis[i])
            {
                vector<int> lnk = {i};
                int st = i;
                vis[i] = 1;
                while (1)
                {
                    int ok = 0;
                    for (int &j : adj2[st])
                        if (!vis[j])
                        {
                            st = j, ok = 1;
                            break;
                        }
                    if (!ok)
                        break;
                    lnk.emplace_back(st);
                    vis[st] = 1;
                }
                for (int &i : lnk)
                    oper.emplace_back(1, i);
            }
        cout << oper.size() << '\n';
        for (auto &[i, j] : oper)
            cout << i << ' ' << j << '\n';
    }
    return 0;
}
```

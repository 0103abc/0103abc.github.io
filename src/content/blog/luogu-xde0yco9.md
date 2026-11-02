---
title: "P6790 [SNOI2020] 生成树 题解"
date: "2025-11-12T16:21:08.000Z"
link: "luogu-xde0yco9"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/xde0yco9)。

选自 [11 月做题笔记](https://www.luogu.com.cn/article/obgeyrgs)。

### 029. [P6790 [SNOI2020] 生成树](https://www.luogu.com.cn/problem/P6790)

前置知识：广义串并联图

核心操作是：

+ **删一度点**：若图上一个点 $u$ 的度数为 $1$，则直接删除该点。
+ **缩二度点**：若图上一个点 $u$ 只和 $v,w$ 两个点相连，则删除 $u$ 点，以及 $u,v$ 边 $u,w$ 边，连接 $v,w$ 边。
+ **叠重边**：若对于两个点 $u,v$，有两条连接 $u,v$ 的边，那么用一条边替换这两条边。
 
然后注意到题目给定的图就是一个广义串并联图，因此考虑使用这个东西来计数。

在图上拓扑排序，队列内记录当前所有度数 $\le 2$ 的点的编号。在每一条边上维护信息 $(f,g)$ 表示当前边在 / 不在生成树上的方案数，每一次取出队首元素：

+ 若该元素度数为 $0$，则直接跳过即可。
+ 若该元素度数为 $1$，则直接把这条边的 $f$ 信息乘到答案里去即可。
+ 若该元素度数为 $2$：考虑找到和其相邻的两个点 $u,v$，则：
  + 若 $u,v$ 之间还没有边，直接缩二度点即可。这条新边在生成树上当且仅当原来的两条边均在生成树上。此时转移为 $f_{u,v}\leftarrow f_{u,x}f_{v,x},g_{u,v}\leftarrow f_{u,x}g_{v,x}+f_{v,x}g_{u,x}$（根据生成树的定义，显然这两条边至少有一条在生成树上）。
  + 若 $u,v$ 之间已经有边，则额外还需要再叠重边。在上面的基础上，只要两条重边有任何一条边在生陈述上，叠出的新边就一定在生成树上。设原来两条边分别为 $e_1,e_2$，则有：$f_{u,v}\leftarrow f_{e_1}g_{e_2}+f_{e_2}g_{e_1},g_{u,v}\leftarrow g_{e_1}g_{e_2}$（根据生成树的定义，显然这两条边不能同时在生成树上）。

因为初始图的性质不光保证了图是广义串并联图，而且还保证了图删掉一条边是仙人掌，因此根据上面的拓扑排序处理法，最终必然会将图上所有的点和所有的边均删除。

总时间复杂度为 $O(n)$ 或 $O(n\log n)$（用 `map` 维护边）。

```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    vector<int> adj[N];
    map<int, int> mp[N];
    int deg[N], f[N], g[N];
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        int n, m, idx = 0;
        cin >> n >> m;
        while (m--)
        {
            int a, b;
            cin >> a >> b;
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
            if (!mp[a][b])
                mp[a][b] = mp[b][a] = ++idx, f[idx] = g[idx] = 1, ++deg[a], ++deg[b];
            else
                ++f[mp[a][b]];
        }
        queue<int> q;
        for (int i = 1; i <= n; ++i)
            if (deg[i] <= 2)
                q.emplace(i);
        int res = 1;
        while (q.size())
        {
            int t = q.front();
            q.pop();
            // cerr << t << ": " << deg[t] << '\n';
            if (!deg[t])
                continue;
            if (deg[t] == 1)
            {
                auto [a, b] = *mp[t].begin();
                res = res * f[b] % mod;
                // cerr << "qwq\n";
                --deg[a], --deg[t];
                mp[a].erase(t), mp[t].erase(a);
                if (deg[a] <= 2)
                    q.emplace(a);
            }
            else
            {
                auto [x, a] = *mp[t].begin();
                auto [y, b] = *mp[t].rbegin();
                mp[x].erase(t), mp[t].erase(x);
                mp[y].erase(t), mp[t].erase(y);
                --deg[x], --deg[t];
                --deg[y], --deg[t];
                int nf = f[a] * f[b] % mod;
                int ng = (f[a] * g[b] + f[b] * g[a]) % mod;
                if (!mp[x][y])
                {
                    mp[x][y] = mp[y][x] = ++idx;
                    ++deg[x], ++deg[y];
                    f[mp[x][y]] = nf, g[mp[x][y]] = ng;
                }
                else
                {
                    f[mp[x][y]] = (f[mp[x][y]] * ng + g[mp[x][y]] * nf) % mod;
                    g[mp[x][y]] = g[mp[x][y]] * ng % mod;
                }
                if (deg[x] <= 2)
                    q.emplace(x);
                if (deg[y] <= 2)
                    q.emplace(y);
            }
        }
        cout << res << '\n';
    }
}
```

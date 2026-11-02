---
title: "CF1444C Team-Building 题解"
date: "2026-03-26T15:13:20.000Z"
link: "luogu-o7e8n1aw"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分", "图论", "二分图匹配", "数据结构", "并查集"]
draft: false
---

真的不是板子吗（）

考虑先判断每个集合是否是二分图，把不是二分图的集合直接去掉，然后把连接同一对二分图集合的边放在一起考虑，若插入这些边之后图不再是二分图，那么就不能同时选这两个集合。

给并查集拆点即可判断图是否为二分图，每次枚举一些加入到集合里的边判断是否是二分图然后用可撤销并查集回滚即可。

```cpp line-numbers
namespace Loyalty
{
    pair<int, int> e[N];
    int c[N], col[N], ok_col, mark[N];
    vector<int> buc[N], adj[N];
    vector<pair<int, int>> ec[N];
    inline void dfs_col(int u, int c)
    {
        col[u] = c;
        for (int &v : adj[u])
            if (!~col[v])
                dfs_col(v, c ^ 1);
            else if (col[u] == col[v])
                ok_col = 0;
    }
    inline void init() {}
    undoDSU dsu;
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n, m, k;
        cin >> n >> m >> k;
        for (int i = 1; i <= n; ++i)
            cin >> c[i], col[i] = -1, mark[i] = 0;
        for (int i = 1; i <= k; ++i)
            buc[i].clear(), ec[i].clear(), adj[i].clear();
        for (int i = 1; i <= n; ++i)
            buc[c[i]].emplace_back(i);
        for (int i = 0; i < m; ++i)
        {
            int a, b;
            cin >> a >> b;
            if (a > b)
                swap(a, b);
            e[i] = {a, b};
            if (c[a] == c[b])
                ec[c[a]].emplace_back(a, b);
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
        }
        int canuse = 0;
        for (int i = 1; i <= k; ++i)
        {
            for (int &j : buc[i])
                adj[j].clear();
            for (auto &[x, y] : ec[i])
            {
                adj[x].emplace_back(y);
                adj[y].emplace_back(x);
            }
            ok_col = 1;
            for (int &j : buc[i])
                if (!~col[j])
                    dfs_col(j, 0);
            if (!ok_col)
                mark[i] = 1;
            else
                ++canuse;
        }
        for (int i = 1; i <= k; ++i)
            if (!mark[i])
                for (auto &[x, y] : ec[i])
                    dsu.merge(x, y + n), dsu.merge(x + n, y);
        map<pair<int, int>, vector<int>> mp;
        for (int i = 0; i < m; ++i)
        {
            auto [a, b] = e[i];
            if (c[a] != c[b] && !mark[c[a]] && !mark[c[b]])
            {
                int v1 = c[a], v2 = c[b];
                if (v1 > v2)
                    swap(v1, v2);
                mp[{v1, v2}].emplace_back(i);
            }
        }
        int res = canuse * (canuse - 1) / 2;
        // cerr << "res = " << res << '\n';
        for (int i = 0; i < m; ++i)
        {
            auto [a, b] = e[i];
            int v1 = c[a], v2 = c[b];
            if (v1 > v2)
                swap(v1, v2);
            if (c[a] != c[b] && !mark[c[a]] && !mark[c[b]] && mp[{v1, v2}].size())
            {
                int now = dsu.top, ok = 1;
                for (auto &i : mp[{v1, v2}])
                {
                    auto [x, y] = e[i];
                    dsu.merge(x, y + n), dsu.merge(x + n, y);
                    if (dsu.find(x) == dsu.find(x + n) || dsu.find(y) == dsu.find(y + n))
                    {
                        ok = 0;
                        break;
                    }
                }
                if (!ok)
                    --res;
                dsu.undo(now);
                mp[{v1, v2}].clear();
            }
        }
        cout << res << '\n';
    }
} // namespace Loyalty
```

---
title: "P10665 [AMPPZ2013] Bytehattan 题解"
date: "2025-11-19T06:00:25.000Z"
link: "luogu-x0vpfcd8"
categories: ["题解"]
tags: ["洛谷", "图论", "并查集"]
draft: false
---

板子题，考虑平面图转对偶图，然后两个点连通的充要条件就是连接这两个点的边两侧在对偶图上对应的两个点不连通，一次断边操作就可以理解为是把这条边左右两侧在对偶图上对应的两个点连通起来，显然可以拿 dsu 简单实现。

一个细节是根据对偶图的定义，所有格点之外的区域也应该被整体单独编号。

总时间复杂度为 $O(\alpha nm)$，可以轻松通过。

```cpp line-numbers
namespace Loyalty
{
    DSU dsu;
    int id[1510][1510];
    inline void init() { }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        int n, k;
        cin >> n >> k;
        int las = 1, idx = 0;
        for (int i = 1; i < n; ++i)
            for (int j = 1; j < n; ++j)
                id[i][j] = ++idx;
        ++idx;
        for (int i = 0; i <= n; ++i)
            for (int j = 0; j <= n; ++j)
                if (!id[i][j])
                    id[i][j] = idx;
        while (k--)
        {
            int x1, y1, x2, y2;
            char o1, o2;
            cin >> x1 >> y1 >> o1 >> x2 >> y2 >> o2;
            if (las == 1)
            {
                if (o1 == 'N')
                {
                    if (!dsu.merge(id[x1][y1], id[x1 - 1][y1]))
                    {
                        cout << "NIE\n";
                        las = 2;
                    }
                    else
                    {
                        cout << "TAK\n";
                        las = 1;
                    }
                }
                else
                {
                    if (!dsu.merge(id[x1][y1], id[x1][y1 - 1]))
                    {
                        cout << "NIE\n";
                        las = 2;
                    }
                    else
                    {
                        cout << "TAK\n";
                        las = 1;
                    }
                }
            }
            else
            {
                if (o2 == 'N')
                {
                    if (!dsu.merge(id[x2][y2], id[x2 - 1][y2]))
                    {
                        cout << "NIE\n";
                        las = 2;
                    }
                    else
                    {
                        cout << "TAK\n";
                        las = 1;
                    }
                }
                else
                {
                    if (!dsu.merge(id[x2][y2], id[x2][y2 - 1]))
                    {
                        cout << "NIE\n";
                        las = 2;
                    }
                    else
                    {
                        cout << "TAK\n";
                        las = 1;
                    }
                }
            }
        }
    }
}
```

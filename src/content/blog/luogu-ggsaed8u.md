---
title: "CF1545C AquaMoon and Permutations 题解"
date: "2026-03-20T01:40:12.000Z"
link: "luogu-ggsaed8u"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分", "图论", "二分图匹配", "数学", "线性代数"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ggsaed8u)。

很神秘的题，首先可以证明必然存在合法解。考虑到若某一列上一个数字只出现了一次，那么为了保证最后得到的矩阵是一个拉丁方，这个位置对应的一行排列必须被选择。此时其余和当前被选中排列有至少一位相同的排列都必须被删除。

因为前 $n$ 行的矩阵恰好构成了一个拉丁方，因此通过上面的方式删除一个位置必然一次至少删除两行的排列。此时每一列上的数字都至少出现了两次，根据鸽巢原理可知每一列的数字都必须恰好出现两次才能满足条件。此时对于剩下的排列（只保留未删除的数字），不论是你选出来的矩阵还是剩下未被选的矩阵都是一个拉丁方。

此时考虑套路的对关系建图，考虑对每一列上出现的两个相同值的行编号连双向边，可以证明得到的图一定是二分图。因为一条边连接的两行不能同时被选择，因此对二分图的每个连通块，选择行的方案数都是 $2$。因此设二分图有 $k$ 个连通块，答案即为 $2^k$。

直接按照上述过程模拟时间复杂度为 $O(n^3)$，感觉应该可以用 ds 优化到 $O(n^2\log n)$ 但是没啥必要（

注意到本题只需要计数二分图内连通块的数量即可求出答案，因此实际写的时候可以不显式建出二分图，直接每次删掉一个排列然后再删掉所有和当前排列有关联的排列即可。

```cpp line-numbers
namespace Loyalty
{
    int vis[510], a[1010][510], buc[510][510];
    inline void init() { }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        for (int i = 1; i <= n + n; ++i)
            vis[i] = 0;
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= n; ++j)
                buc[i][j] = 0;
        for (int i = 1; i <= n + n; ++i)
            for (int j = 1; j <= n; ++j)
                cin >> a[i][j], ++buc[a[i][j]][j];
        int cnt = 0;
        vector<int> choose;
        for (int i = 1; i <= n; ++i)
        {
            int row = -1;
            for (int i = 1; i <= n + n; ++i)
                if (!vis[i])
                {
                    for (int j = 1; j <= n; ++j)
                        if (buc[a[i][j]][j] == 1)
                        {
                            row = i;
                            break;
                        }
                    if (~row)
                        break;
                }
            if (!~row)
            {
                for (row = 1; vis[row]; ++row)
                    ;
                ++cnt;
            }
            vis[row] = 1;
            choose.emplace_back(row);
            for (int i = 1; i <= n; ++i)
                --buc[a[row][i]][i];
            for (int i = 1; i <= n + n; ++i)
                if (!vis[i])
                {
                    for (int j = 1; j <= n; ++j)
                        if (a[i][j] == a[row][j])
                        {
                            vis[i] = 1;
                            for (int k = 1; k <= n; ++k)
                                --buc[a[i][k]][k];
                            break;
                        }
                }
        }
        cout << power(2, cnt, mod) << '\n';
        for (int &i : choose)
            cout << i << ' ';
        cout << '\n';
    }
} // namespace Loyalty
```

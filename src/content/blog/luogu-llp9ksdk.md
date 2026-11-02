---
title: "P14415 [JOISC 2015] 遗产继承 / Inheritance 题解"
date: "2025-11-19T11:18:14.000Z"
link: "luogu-llp9ksdk"
categories: ["题解"]
tags: ["洛谷", "基础算法", "排序", "二分", "数据结构", "并查集"]
draft: false
---

从某个 OJ 上 copy 过来一个简要题意：

> 给一个 $n$ 个节点 $m$ 条边的无向图，有 $k$ 轮操作，每轮操作选择尽量多的边删除。如果有多种方案，那么选择边权和最大的那个，但是要求删除的边中不存在环。
> 
> 对于每条边，输出它在第几次操作被删除，如果这条边最后都没有被删除那么输出 $0$。

注意到 $n,k$ 的值都很小，因此考虑直接模拟每一次操作，容易想到每次操作删掉的边一定是在上一次保留下来的所有边中得到的最大生成森林。直接 Kruskal 暴力求可以做到 $O(\alpha mk)$（最初统一把边按边权排序然后懒惰删除）。

考虑优化。容易想到每条边肯定尽可能被早删除会更好，然后又注意到这个东西满足单调性可以二分，找到第一个加入该边不会成环的并查集。考虑维护 $k$ 个并查集，表示删完前 $i$ 次边之后图的连通情况。对所有边按照边权从大到小排序后，对于一条边 $u,v$ 假设当前二分到的时刻为 $mid$，那么因为将连通性的艾弗森括号看做表达式后这个东西是单调的（显然），所以若 $mid$ 时刻 $u,v$ 两个点连通，那么在 $1\sim mid-1$ 时刻两个点也一定是连通的，那么就向右半段查找，否则向左半段查找。

此时时间复杂度优化到 $O(\alpha m\log k)$，可以通过该题。

```cpp line-numbers
struct DSU
{
    int fa[1010];
    inline DSU() { iota(fa, fa + 1010, 0); }
    inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
    inline int merge(int x, int y) 
    {
        x = find(x), y = find(y);
        if (x != y)
            return fa[x] = y, 1;
        return 0;
    }
} dsu[10010];
int res[N];
struct Edge { int u, v, w, id; } e[N];
signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n, m, k;
    cin >> n >> m >> k;
    for (int i = 0; i < m; ++i)
        cin >> e[i].u >> e[i].v >> e[i].w, e[i].id = i;
    sort(e, e + m, [&](auto &l, auto &r) { return l.w > r.w; });
    for (int i = 0; i < m; ++i)
    {
        auto [u, v, w, _] = e[i];
        int l = 1, r = k, best = 0;
        while (l <= r)
        {
            int mid = l + r >> 1;
            if (dsu[mid].find(u) != dsu[mid].find(v))
                r = mid - 1, best = mid;
            else
                l = mid + 1;
        }
        if (best)
        {
            res[_] = best;
            dsu[best].merge(u, v);
        }
    }
    for (int i = 0; i < m; ++i)
        cout << res[i] << '\n';
    return 0;
}
```

---
title: "P15502 [ICPC 2025 APC] Book Sorting 题解"
date: "2026-03-21T03:46:19.000Z"
link: "luogu-0itq0yzl"
categories: ["题解"]
tags: ["洛谷", "基础算法", "排序", "二分"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/0itq0yzl)。

容易证明一定存在一个最优形态，满足存在两个位置 $1\le l\le r\le n$，使得执行的操作形如：

+ 把 $l-1,l-2,\ldots,1$ 这些书按顺序移动到最左侧。
+ 把 $r+1,r+2,\ldots,n$ 这些书按顺序移动到最右侧。
+ $l\sim r$ 范围内的书全部相邻项交换排序。

因此贡献即为：$n-1-(r-l)+\text{inv}(a_l,a_{l+1},\ldots,a_r)$ 也就是最大化 $(r-l)-\text{inv}(a_l,a_{l+1},\ldots,a_r)$ 的值，其中 $\text{inv}(seq)$ 表示 $seq$ 序列的逆序对的数量。

（注：这里的 $a$ 是 $p$ 的逆排列，即 $a_{p_i}=i$）。

考虑固定右端点 $r$，记 $S_r$ 集合内存储了所有左端点 $l$ 满足 $1\le l\le r$ 且对于所有位置 $j\in(l,r]$，都有 $(r-l)-\text{inv}(a_l,a_{l+1},\ldots,a_r)>(r-j)-\text{inv}(a_j,a_{j+1},\ldots,a_r)$。

此时把 $S_r$ 按照左端点 $l$ 的位置从大到小排序（下标从 $1$ 开始），则有一个关键结论：$(r-S_{r,j})-\text{inv}(a_{S_{r,j}},a_{S_{r,j}+1},\ldots,a_r)=j-1$。为了方便，后面记 $(r-l)-\text{inv}(a_l,a_{l+1},\ldots,a_r)$ 的值为 $f(l,r)$。下面给出该结论的证明：

:::success[证明]
要证明的结论为：$f(S_{r,j},r)=j-1$。

套路的考虑对临项做差，得到 $f(i,r)-f(i+1,r)=1-g_i$，其中 $g_i$ 的值为 $[i+1,r]$ 中比 $a_i$ 小的元素的数量。因为 $g_i\ge 0$ 所以显然有 $f(i,r)\le f(i+1,r)+1$。

因为 $S_{r,*}$ 集合内只有对应 $f$ 值严格变大的位置，因此一定有 $f(S_{r,j},r)=f(S_{r,j-1},r)+1$。而又因为有 $f(S_{r,1}=r,r)=0$，因此 $f(S_{r,j},r)=j-1$，命题得证。
:::

因此最大化 $(r-l)-\text{inv}(a_l,a_{l+1},\ldots a_r)$ 即 $f(l,r)$ 的最大值其实就是 $\max\limits_{1\le r\le n}(|S_r|-1)$，因此只需要对每个右端点 $r$ 求出 $|S_r|$ 的值即可。

直接求 $S_r$ 是困难的，因此可以想到通过 $S_r$ 递推出 $S_{r+1}$。显然此时有 $f(r+1,r+1)=0$。若不考虑逆序对的影响则有 $f(l,r+1)=f(l,r)+1$，但是若有 $a_l>a_{r+1}$ 则 $f(1,r+1),f(2,r+1),\ldots,f(l,r+1)$ 都会受到这组逆序对的影响，导致这些 $f$ 值全部减去 $1$。

考虑维护该事件对 $S_{r+1}$ 的影响。因为在考虑逆序对影响之前有 $f(S_{r,j})=j-1$，现在对左端点 $p\in[1,l]$ 的 $p$ 对应的 $f$ 值减少 $1$，找出最大的位置 $q$ 满足 $q$ 是集合中最大的满足 $S_{r,q}\le l$ 的位置，则此时 $S_{r,1},S_{r,2},\ldots,S_{r,q-1}$ 对应的 $f$ 值不会变化，$S_{r,q},S_{r,q+1},\ldots$ 对应的 $f$ 值都会减少 $1$。因此此时只有 $S_{r,q}$ 一个位置对应的 $f$ 值不再是前缀 $\max$ 位置，在集合中二分出这个位置并将其删除即可。

容易想到用 set 来维护这个结构，每次从 $S_r$ 扩展到 $S_{r+1}$ 只需要先在集合加入 $f(r+1,r+1)$ 的影响，然后再二分出 $q$ 的位置并将 $S_{r,q}$ 从集合中删除。显然该算法流程的时间复杂度为 $O(n\log n)$，可以通过该题。

```cpp line-numbers
namespace Loyalty
{
    int a[N], p[N];
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i)
            cin >> p[i], a[p[i]] = i;
        set<int> se;
        set<pair<int, int>> se2;
        // se2 内存储的是所有将来仍然可能删除元素的位置
        se.emplace(1), se2.emplace(a[1], 1);
        int res = n - 1;
        for (int i = 2; i <= n; ++i)
        {
            se.emplace(i);
            vector<int> v;
            auto it = se2.upper_bound({a[i], n + 1});
            while (it != se2.end())
                v.emplace_back(it->second), ++it;
            vector<int> remov;
            for (int &j : v)
            {
                auto it = se.upper_bound(j);
                if (it == se.begin())
                    remov.emplace_back(j);
                else
                    se.erase(prev(it));
            }
            for (int &j : remov)
                se2.erase({a[j], j});
            se2.emplace(a[i], i);
            res = min(res, n - (int)se.size());
        }
        cout << res << '\n';
    }
} // namespace Loyalty
```

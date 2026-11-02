---
title: "CF1656F Parametric MST 题解"
date: "2026-03-11T14:52:54.000Z"
link: "luogu-bcz5kwiv"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造", "基础算法", "贪心", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/bcz5kwiv)。

不算太难的题，duel 的时候用了 1h 切掉了。

注意到 $a_ia_j+t(a_i+a_j)=(a_i+t)(a_j+t)-t^2$（恭喜你你做完了这个题最难的一步）。最后的 $t^2$ 是容易省去的，于是问题可以转化为：

> 对于给定的 $t$ 值，你可以构造一棵 $n$ 个点的完全图，其中两点 $(i,j)$ 的边权是 $(a_i+t)(a_j+t)$，记 $f(t)$ 为按照上述步骤构造的图的 MST 边权之和，问 $f(t)$ 是否是有上界的。

先考虑对于给定的 $t$ 值怎么快速求出构造出完全图的 MST 大小。把所有点的点权 $a_i$ 按照从小到大的顺序排序，那么显然此时有 $a_1+t\le a_2+t\le\ldots\le a_n+t$。容易想到记 $p$ 是满足 $a_p+t\ge 0$ 的 $p$ 里最小的值，那么直接贪心的把 $a_p,a_{p+1},\ldots,a_n$ 都和 $a_1$ 连边，$a_2,a_3,\ldots,a_{p-1}$ 都和 $a_n$ 连边，容易证明该贪心策略一定可以得到最优解。

把这个式子写出来，即：

$$
\sum\limits_{i=p}^na_1a_i+t\sum\limits_{i=p}^n(a_1+a_i)+\sum\limits_{i=2}^{p-1}a_na_i+t\sum\limits_{i=2}^{p-1}(a_n+a_i)
$$

化简式子：

$$
a_1\sum\limits_{i=1}^na_i+t(n-p+1)a_1+t\sum\limits_{i=p}^na_i+a_n\sum\limits_{i=2}^{p-1}a_i+t(p-2)a_n+t\sum\limits_{i=2}^{p-1}a_i
$$

容易发现这个东西如果对 $t$ 已知 $p$ 那么可以预处理 $a$ 序列前缀和然后做到 $O(1)$ 计算答案。

但是问题是 $t$ 的取值范围是 $t\in\mathbb R$，显然无法枚举所有的实数 $t$ 来计算答案。考虑缩小最优解的 $t$ 的取值集合。这里注意到对 $t\in[a_i,a_{i+1}]$，$p$ 的取值都不会变化，而显然对同一个 $p$ 上面的式子是单峰的答案一定取在两个端点上，因此需要判定的 $t$ 的集合只有 $-a_1,-a_2,\ldots,-a_n$，而此时显然 $p$ 的值也是十分容易求出的。因此该算法时间复杂度优化到 $O(n)$ 可以通过该题。

最后剩下答案为 `INF` 的情况，直接带入 $t=\infin$ 和 $t=-\infin$ 即可简单判定（只需要看此时 $\infin$ 的项的系数是不是 $>0$ 的即可）。

该算法对于单组数据时间复杂度为 $O(n)$，可以轻松通过该题。

```cpp line-numbers
namespace Loyalty
{
    int a[N], pre[N];
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i)
            cin >> a[i];
        sort(a + 1, a + n + 1);
        int v1 = 0, v2 = 0;
        for (int i = 2; i <= n; ++i)
            v1 += a[1] + a[i];
        for (int i = 1; i < n; ++i)
            v2 += a[i] + a[n];
        if (v1 > 0 || v2 < 0)
            cout << "INF\n";
        else
        {
            for (int i = 1; i <= n; ++i)
                pre[i] = pre[i - 1] + a[i];
            int res = -inf;
            for (int i = 1; i <= n; ++i)
            {
                int v1 = a[1] * (pre[n] - pre[i]) + a[n] * (pre[i] - pre[1]);
                int v2 = a[i] * (a[1] * (n - i) + a[n] * (i - 1) + pre[n] - pre[1]);
                res = max(res, v1 - v2);
            }
            cout << res << '\n';
        }
    }
} // namespace Loyalty
```

---
title: "P12074 [OOI 2025] The arithmetic exercise 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p12074"
categories: ["题解"]
tags: ["洛谷", "基础算法", "差分", "动态规划", "二分"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P12074).
:::

:::info[Solution]{open}
题目中给出的操作可以看作是给 $x_i$ 加正负号，考虑符号序列 $c_i\in\lbrace -1,1\rbrace$，则一个符号序列合法当且仅当任意后缀的符号和都在 $[0,n]$ 范围内。因此考虑把 $x$ 翻转，记 $b_i=x_{m-i+1}$，问题变为给 $b_i$ 序列选择正负号要求任意前缀的符号和都在 $[0,n]$ 范围内。

考虑一个暴力的 dp。设 $f_{i,j}$ 表示当前考虑了前 $i$ 个数，符号和为 $j$ 时的最大答案。转移方程显然就是 $f_{i,j}=\max(f_{i-1,j-1}+b_i,f_{i-1,j+1}-b_i)$，最终答案就是 $\max\limits_{j=0}^n f_{m,j}$。时间复杂度为 $O(nm)$ 难以通过。

考虑优化。注意到 $i,j$ 奇偶性相同的时候 $f_{i,j}$ 才存储了信息，因此考虑平移一下然后给所有位置重编号得到一个等价的转移式：$f'_k=-b_i+\max(f_k,f_{k-1}+2b_i)$，维护相邻项差分 $d_i=f_i-f_{i-1}$ 容易发现差分序列是单调不增的，也就是 $f$ 数组的 dp 信息是凸的。

考虑比较转移项 $f_k$ 和 $f_{k-1}+2b_i$ 的大小，做差后可得 $f_k\ge f_{k-1}+2b_i\Longleftrightarrow d_k\ge 2b_i$，因此可以看作是前面斜率 $d_k\ge 2b_i$ 的部分选择 $f_k$，后面斜率 $d_k<2b_i$ 的部分选择 $f_{k-1}+2b_i$。因此新函数的差分序列可以看作是在原有差分序列中插入一个 $2b_i$。因此直接用 `multiset` 维护整个序列的差分，然后支持二分查找和插入元素即可。时间复杂度被优化到 $O(n\log n)$，可以通过该题。

实现稍微有一点细节。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N];

inline void sol() {
    int n, m; cin >> n >> m;
    for (int i = m; i; --i) cin >> a[i];
    multiset<int, greater<>> se;
    int f0 = 0;
    for (int i = 1; i <= m; ++i) {
        se.emplace(2 * a[i]), f0 -= a[i];
        if (i & 1) f0 += *se.begin(), se.erase(se.begin());
        int lim = (i & 1) ? (n + 1) / 2 : (n + 2) / 2;
        while (se.size() >= lim) se.erase(--se.end());
    } int res = f0, pre = f0;
    for (const int &i : se) res = max(res, pre += i);
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：6

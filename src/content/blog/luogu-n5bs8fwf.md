---
title: "AT_agc036_f [AGC036F] Square Constraints 题解"
date: "2026-08-07T14:24:38.000Z"
link: "luogu-n5bs8fwf"
categories: ["题解"]
tags: ["AtCoder", "动态规划", "数学", "组合数学", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/n5bs8fwf)。

题目中给的东西其实就是要求排列对应的坐标点落在大圆和小圆之间求排列的数量。记 $f_i$ 表示满足 $x^2+i^2<n^2$ 的 $x\in[0,2n)\cap\mathbb N$ 的数量，$g_i$ 表示满足 $x^2+i^2\le 4n^2$ 的 $x\in[0,2n)\cap\mathbb N$ 的数量。则排列 $p_i$ 的限制条件就可以看作是 $\forall i,f_i\le p_i<g_i$。

考虑对内圆 $p_i\ge f_i$ 的限制做容斥，钦定排列前 $n$ 个位置中，有 $k$ 个位置是不满足 $p_i\ge f_i$，则记这样的排列的数量为 $F_k$ 则直接容斥可得答案为 $\sum\limits_{k=0}^n(-1)^kF_k$。

考虑算 $F_k$ 的值。先给一个暴力的做法，设 $h_i$ 表示 $i$ 位置的上限，则 $h_i$ 要么为 $f_i$ 要么为 $g_i$。考虑已知 $h_i$ 时合法的排列 $p$ 数量怎么算。有一个结论是，如果把 $h$ 数组内所有值从小到大排序，则满足限制的排列数为 $\prod\limits_{i=0}^{2n-1}(h_i-i)$。证明考虑按照上界从小王大分配数字时，处理第 $j$ 个位置可以使用 $0\sim h_j-1$ 这 $h_j$ 个数字，前面也已经使用了 $j$ 个数字，而这 $j$ 个数字一定在上界范围内，因此共有 $h_j-j$ 种剩余的可用选择。因此直接枚举 $h_i$ 的值，其中恰好有 $k$ 个上界选的是 $f_i$ 然后对排列数求和就得到了一个暴力的做法。

考虑进一步优化时间复杂度。容易想到 dp，套路的把所有的 $f_i$ 和所有满足 $g_i\in[n,2n)$ 的 $g_i$ 按照值从小到大放到一起，然后按值从小到大做扫描线，设 $dp_j$ 表示当前已经选择了 $j$ 个 $f_i$ 时的贡献，则如果当前的是一个 $g_i$ 而在这之前已经出现了 $c$ 个必须选择的 $g_j$（这里说 $g_j$ 必须选择是指 $j\ge n$ 的 $j$ 此时 $f_j$ 的限制不存在）那么当前 $g_i$ 前面留下的数共有 $c+j$ 个，因此 $g_i$ 在最终排序的下标就是 $c+j$，其贡献就是 $g_i-c-j$，因此转移就是 $dp_j\leftarrow dp_j(g_i-c-j)$。

然后考虑如果当前遇到了一个 $f_i$，则需要进一步分类讨论：

如果选 $f_i$ 则她前面已经有 $y+j$ 个被选中的数，所以其的贡献就是 $f_i-y-j$，因此转移就形如 $dp'_{j+1}\leftarrow dp'_{j+1}+dp_j(f_i-y-j)$。

如果不选 $f_i$ 则之后就必须选对应的 $g_i$，考虑贡献提前处理，对应 $g_i$ 的位置已经是确定的了，因此固定最终选 $k$ 个 $f$ 加上 $n$ 个必须选的 $g$，这些大 $g_i$ 前面一定有 $n+k$ 个数，而当前之前已经经过了 $x$ 个 $f$，其中只有 $j$ 个 $f$ 被选，所以共有 $x-j$ 个 $f$ 被放弃了，她们对应的 $g$ 都会排在当前这个 $g_i$ 的前面，因此当前这个 $g_i$ 的最终下标就是 $n+k+x-j$，其贡献就是 $g_i-n-k-x+j$，转移就形如 $dp'_{j+1}\leftarrow dp'_{j+1}+dp_j(g_i-n-k-x+j)$。最后更新 $dp\leftarrow dp'$ 即可。

扫描完之后 $dp_k$ 就是恰好选 $k$ 个 $f_i$ 的总共先，也就是 $F_k$。代入上面的容斥式子直接算答案即可，总时间复杂度为 $O(n^3)$。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int F[N], nF[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, mod; cin >> n >> mod;
    vector<pair<int, int>> a;
    for (int i = 0; i < n; ++i) {
        int l = 0, r = 2 * n - 1;
        while ((l + 1) * (l + 1) + i * i < n * n) ++l;
        while (r * r + i * i > 4 * n * n) --r;
        a.emplace_back(l, r);
    }
    for (int i = n; i < 2 * n; ++i) {
        int r = 2 * n - 1;
        while (r * r + i * i > 4 * n * n) --r;
        a.emplace_back(r, 0);
    }
    sort(a.begin(), a.end());
    function<int(int)> calc = [&](int k) {
        fill(F, F + n + 1, 0), F[0] = 1;
        int c1 = 0, c2 = 0;
        for (auto &[l, r] : a) {
            fill(nF, nF + n + 1, 0);
            if (!r) {
                for (int j = 0; j <= c2; ++j) nF[j] = F[j] * (l - c1 - j + 1) % mod;
                ++c1;
            } else {
                for (int j = 0; j <= c2; ++j) nF[j + 1] = (nF[j + 1] + F[j] * (l - c1 - j + 1) % mod) % mod, nF[j] = (nF[j] + F[j] * (r - (n + c2 - j + k) + 1) % mod) % mod;
                ++c2;
            } copy(nF, nF + n + 1, F);
        } return F[k];
    };
    int res = 0;
    for (int k = 0; k <= n; ++k)
        if (k & 1) res = (res - calc(k) + mod) % mod;
        else res = (res + calc(k)) % mod;
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

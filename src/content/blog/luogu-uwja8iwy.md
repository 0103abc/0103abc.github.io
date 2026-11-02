---
title: "P13153 [GCJ 2018 Finals] Jurisdiction Restrictions 题解"
date: "2026-08-06T13:37:22.000Z"
link: "luogu-uwja8iwy"
categories: ["题解"]
tags: ["洛谷", "图论", "二分图匹配", "基础算法", "二分", "动态规划"]
draft: false
---

警察局 $S$ 的数量很少，因此猜测最终做法的时间复杂度中带一个 $2^S$。记 $cnt_i$ 表示如果 $i$ 集合内的警察局都可以覆盖到的格子的数量（不包含警察局本身所在的格子），然后考虑 dp，设 $f_i$ 表示只能分配给集合 $i$ 中警察局的格子的数量，转移显然就是 $f_i=\sum\limits_{j\subseteq i}cnt_j$，直接 SOS dp 就可以做到 $O(S2^S)$ 时间复杂度解决。

然后考虑求最小的最大任务数。设每个警察局最多分配 $x$ 个格子，则对于任意的非空集合 $U$ 所有覆盖集合完全包含于 $U$ 的格子只能交给 $U$，因此必须满足 $f_u\le x|U|$，由 Hall 定理可知这个也是充分条件。因此最小可能的最大值就是 $\max\limits_{U\neq\varnothing}\lceil\frac{f_U}{|U|}\rceil$。

具体来说，假设当前正则判断能否把所有待分配的格子分配给警察局使得每个警察局最多负责 $x$ 个格子，建立二分图模型，左部点代表一个待分配的格子，右部点代表一个警察局，如果警察局 $i$ 能够覆盖格子 $p$ 就在二者之间连边。每个格子必须匹配且每个警察局最多接受 $x$ 个格子。

回顾一下 Hall 定理：

> 二分图所有左部点都能匹配，当且仅当对于左侧任意一个点集 $A$ 其相邻的右侧点数量至少为 $|A|$。

为了方便处理，容易想到把左侧的每个警察局复制成 $x$ 个相同的点，于是 Hall 定理的条件变成 $|A|\le x|N(A)|$，其中 $N(A)$ 表示左部点集 $A$ 相邻的所有右部点组成的集合。也可以看作是，对任意一批格子，能接收她们的警察局总容量不能少于格子的数量。但是格子太多不能枚举格子集合 $A$，因此考虑枚举警察局的集合 $U$。$U$ 集合中警察局的总容量是 $x|U|$，因此满足 $f_u\le x|U|$ 就是充要条件。

然后考虑求最大的最小任务数。记 $tot$ 为总共需要分配的格子数量，假设每个警察局都至少分配 $x$ 个格子，则集合 $U$ 中的警察局能使用的格子数为 $tot-f_{\bar U}$。因此最小值就是 $\min\limits_{U\neq\varnothing}\lfloor\frac{tot-f_{\bar U}}{|U|}\rfloor$。这个同样是考虑 hall 定理，建立二分图模型，左部点表示警察局，右部点表示待分配的格子，如果警察局 $i$ 能够覆盖格子 $p$ 就在二者之间连边，每个格子最多匹配一次，每个警察局需要匹配 $x$ 个格子。同样是吧每个警察局复制成 $x$ 个相同的点，因此 Hall 定理要求对任意一个警察局集合 $U$ 能够被 $U$ 中至少一个警察局所覆盖的格子数不少于 $x|U|$。显然不能分配给 $U$ 集合中警察局的格子只有只被 $\bar U$ 集合中警察局覆盖的格子，数量就是 $f_{\bar U}$。因此能够分给 $U$ 中警察局的格子数量就是 $tot-f_{\bar U}$，hall 条件为 $tot-f_{\bar U}\ge x|U|$。这个条件要对任意非空集合 $U$ 都成立，因此最大的 $x$ 为 $\min\limits_{u\neq\varnothing}\lfloor\frac{tot-f_{\bar U}}{|U|}\rfloor$。

最后考虑说明这个上界 $mx$ 和下界 $mi$ 能够同时取到。建立带上下界的二分图网络，把每个警察局的任务数限制在区间 $[mi,mx]$ 中，且每个格子必须分配给一个能覆盖她的警察局。其可行的条件是对于任意的警察局集合 $U$ 同时满足 $f_u\le mx|U|$（只能交给 $U$ 集合内警察局的格子不能超过 $U$ 的总上限）和 $tot-f_{\bar U}\ge mi|U|$ 即 $U$ 集合内能管理的格子不能少于 $U$ 的总下限。而此时 $mx$ 和 $mi$ 的定义恰好能保证两组不等式分别全部成立，因此这个带上下界的二分图匹配一定有解，即上下界可以被同时取到。

因此答案就是 $mx-mi$，直接实现的时间复杂度为 $O(S^3+S2^S)$ 可以通过该题。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int cnt[N], r[N], c[N], d[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    cout << "Case #" << __testcase_id << ": ";
    int n, m, S; cin >> n >> m >> S;
    vector<int> x = {0, n}, y = {0, m};
    for (int i = 0; i < S; ++i) {
        cin >> r[i] >> c[i] >> d[i], --r[i], --c[i];
        x.emplace_back(max<int>(0, r[i] - d[i])), x.emplace_back(min(n, r[i] + d[i] + 1));
        y.emplace_back(max<int>(0, c[i] - d[i])), y.emplace_back(min(m, c[i] + d[i] + 1));
    } sort(x.begin(),x.end()), x.erase(unique(x.begin(), x.end()), x.end());
    sort(y.begin(), y.end()), y.erase(unique(y.begin(), y.end()), y.end());
    for (int i = 0; i < (1 << S); ++i) cnt[i] = 0;
    for (int i = 0; i + 1 < x.size(); ++i)
        for (int j = 0; j + 1 < y.size(); ++j) {
            int mask = 0;
            for (int k = 0; k < S; ++k)
                if (abs(x[i] - r[k]) <= d[k] && abs(y[j] - c[k]) <= d[k]) mask |= (1 << k);
            if (mask) cnt[mask] += (x[i + 1] - x[i]) * (y[j + 1] - y[j]);
        }
    for (int i = 0; i < S; ++i) {
        int mask = 0;
        for (int j = 0; j < S; ++j)
            if (abs(r[i] - r[j]) <= d[j] && abs(c[i] - c[j]) <= d[j]) mask |= (1 << j);
        --cnt[mask];
    }
    int tot = accumulate(cnt + 1, cnt + (1 << S), 0ll);
    for (int i = 0; i < S; ++i)
        for (int j = 0; j < (1 << S); ++j)
            if (j >> i & 1) cnt[j] += cnt[j ^ (1 << i)];
    int mx = 0, mi = inf;
    for (int i = 1; i < (1 << S); ++i) {
        int bit = __builtin_popcount(i);
        mx = max(mx, (cnt[i] + bit - 1) / bit), mi = min(mi, (tot - cnt[((1 << S) - 1) ^ i]) / bit);
    } cout << mx - mi << '\n';
}

} // namespace lowspeed_song
```
:::

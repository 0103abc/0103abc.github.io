---
title: "P14388 [JOISC 2017] 长途巴士 / Long Distance Coach 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p14388"
categories: ["题解"]
tags: ["洛谷", "基础算法", "排序", "动态规划", "贪心"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P14388).
:::

:::info[Solution]{open}
考虑把所有乘客按照第一次喝水时间 $D_i$ 从小到大排序，记排序后的喝水时间为 $d_1<d_2<\ldots<d_M$，$c_i$ 为排序后第 $i$ 个人的退款费用。

考虑这样的一个关键性质：

+ 在任意相邻两个补水递减之间，以但水耗尽，之后需要水的乘客会连续下车，在 $d$ 数组中构成一段连续的区间。而且区间一定不会跨过 $D=0$ 的位置。

对某个补水点或者终点位置 $p$，可以将其写作 $p=qT+r$ 的形式。若 $d_i<r<d_{i+1}$，则其可以作为某段连续下车区间的右端点 $i$，且在这段区间内下车的乘客都恰好喝了 $q$ 次水。因为可以记 $g_i$ 表示如果某个下车区间的最右端是乘客 $i$，则区间内每个乘客在下车前最少已经成功喝了 $g_i$ 次水。记录 $D_{M+1}=T$ 则有 $g_i=\min(S=qT+r),r\in(D_i,D_{i+1})$。很显然 $g_i$ 贪心的取 $\min$ 的正确性有保障，因为如果一个人已经确定要下车退费的话，让其少喝水一定比多喝水收益更大。

记 $pre_i$ 为 $c_i$ 数组的前缀和，$f_i$ 表示在不考虑司机的情况下，处理完排序后前 $i$ 个乘客所花费的最小费用是多少。此时需要进一步分类讨论：

+ 乘客 $i$ 一直做到了终点，无需退费：其需要合适u的次数显然就是 $\lfloor\frac{X-d_i-1}T\rfloor+1$，因此转移形如 $f_i=f_{i-1}+Wh_i$。
+ 乘客 $i$ 中途下车，需要退费。记这一轮和 $i$ 一起下车的连续区间乘客是 $[j+1,i]$，则这些人每个人都已经喝了 $g_i$ 次水，则考虑前 $j$ 个人花费的最优费用为 $f_j$，退款所需的费用为 $pre_i-pre_j$，已经喝的水的代价为 $W(i-j)g_i$，因此转移形如 $f_i=f_j+(pre_i-pre_j)+W(i-j)g_i$。

汇总 dp 转移式可得：$f_i=\min(f_{i-1}+Wh_i,f_j+(pre_i-pre_j)+W(i-j)g_i)$。枚举转移点 $j$ 可以做到 $O(n^2)$ 的时间复杂度解决问题。

考虑优化。发现上面这个东西的后半段看着就非常的能优化，改一下形式可得 $f_i=pre_i+W_ig_i+(f_j-pre_j-W_Pjg_i)$，转移是一个一次函数形式，因此用李超线段树优化上述 dp 流程即可做到 $O(n\log n)$ 时间复杂度解决问题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

pair<int, int> a[N];
int pos[N], pre[N], d[N], f[N], g[N], lsh[N];

namespace LiChaoSgt {
    int tree[N << 2], lim;
    pair<int, int> seg[N];
    inline int calc(int id, int x) { return id ? seg[id].first * lsh[x] + seg[id].second : inf; }
    inline void ins(int l, int r, int rt, int id) {
        if (l == r) {
            if (!tree[rt] || calc(id, l) < calc(tree[rt], l)) tree[rt] = id;
            return;
        } int mid = l + r >> 1;
        if (calc(id, mid) < calc(tree[rt], mid)) swap(tree[rt], id);
        if (calc(id, l) < calc(tree[rt], l)) ins(l, mid, rt << 1, id);
        if (calc(id, r) < calc(tree[rt], r)) ins(mid + 1, r, rt << 1 | 1, id);
    }
    inline void ins(int k, int b, int id) { seg[id] = {k, b}, ins(0, lim, 1, id); }
    inline int qry(int l, int r, int rt, int val) {
        if (l == r) return calc(tree[rt], val);
        int mid = l + r >> 1, now = calc(tree[rt], val);
        if (val <= mid) return min(now, qry(l, mid, rt << 1, val));
        return min(now, qry(mid + 1, r, rt << 1 | 1, val));
    }
}

inline void sol() {
    int x, n, m, w, t; cin >> x >> n >> m >> w >> t;
    for (int i = 0; i < n; ++i) cin >> pos[i]; pos[n] = x;
    for (int i = 0; i < m; ++i) cin >> a[i].first >> a[i].second;
    sort(a, a + m), d[m + 1] = t;
    for (int i = 1; i <= m; ++i) d[i] = a[i - 1].first, pre[i] = pre[i - 1] + a[i - 1].second;
    vector<pair<int, int>> e;
    for (int i = 0; i <= n; ++i) e.emplace_back(pos[i] % t, pos[i] / t);
    sort(e.begin(), e.end());
    memset(g, 0x3f, sizeof g);
    for (int i = 1, j = 0; i <= m; ++i) {
        while (j < e.size() && e[j].first < d[i]) ++j;
        while (j < e.size() && e[j].first < d[i + 1]) g[i] = min(g[i], e[j++].second);
    } int idx = 0, idx_ = 1;
    for (int i = 1; i <= m; ++i) if (g[i] < inf / 2) lsh[++idx] = g[i];
    sort(lsh + 1, lsh + idx + 1), idx = unique(lsh + 1, lsh + idx + 1) - lsh - 1;
    LiChaoSgt::lim = idx, LiChaoSgt::ins(0, 0, 1);
    function<int(int)> qry = [&](int v) {
        int id = lower_bound(lsh + 1, lsh + idx + 1, v) - lsh;
        return LiChaoSgt::qry(0, idx, 1, id);
    };
    for (int i = 1; i <= m; ++i) {
        f[i] = f[i - 1] + w * (x / t);
        if (x % t >= d[i]) f[i] += w;
        if (g[i] < inf / 2) f[i] = min(f[i], pre[i] + i * w * g[i] + qry(g[i]));
        LiChaoSgt::ins(-w * i, f[i] - pre[i], ++idx_);
    } cout << f[m] + w * (x / t + 1) << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑

鲜活指数：8

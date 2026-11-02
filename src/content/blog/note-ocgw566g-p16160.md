---
title: "P16160 [ICPC 2016 NAIPC] Jewel Thief 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p16160"
categories: ["题解"]
tags: ["洛谷", "基础算法", "排序", "前缀和"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P16160).
:::

:::info[Solution]{open}
直接暴力 01 背包时间复杂度爆炸了，考虑优化。

注意到背包物品的重量上限只有 $300$，因此考虑从这里做手脚。对相同重量的物品，考虑先将其按照价值从大到小排序，然后记前缀和表示选中该种重量中价值最大的 $i$ 个可以获得的价值是多少。

记 $f_x$ 表示容量不超过 $x$ 时可得到的最大价值是多少。处理重量 $w$ 时可以直接转移 $f'_x\leftarrow\max\limits_t(f_{x-tw}+pre_t)$。因为容量每次只会减少 $w$，所以靠考虑把这些东西按照 $x\bmod w$ 的值分组。固定余数后，转移形如 $g_i=\max\limits_{j\le i}(f_j+pre_{i-j})$ 的形式。因为价值是降序排列的，所以 $s_*$ 每次增加的值越来越小，因此函数是凸的，满足决策单调性。

总时间复杂度为 $O(n\log n+mk\log k)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, k, w, rem, cnt;
vector<int> buc[301], f, g, pre;
inline void cdq(int l, int r, int ll, int rr) {
    if (l > r) return;
    int mid = l + r >> 1, pos = ll, mx = -inf;
    for (int j = ll; j <= min(mid, rr); ++j) {
        int now = f[rem + j * w] + pre[min(mid - j, cnt)];
        if (now > mx) mx = now, pos = j;
    }
    g[rem + mid * w] = mx;
    cdq(l, mid - 1, ll, pos), cdq(mid + 1, r, pos, rr);
}

inline void sol() {
    cin >> n >> k;
    for (int i = 1; i <= n; ++i) {
        int s, v; cin >> s >> v;
        buc[s].emplace_back(v);
    }
    f.assign(k + 1, 0), g.resize(k + 1);
    for (w = 1; w <= 300; ++w) if (buc[w].size()) {
        sort(buc[w].begin(), buc[w].end(), greater<>());
        cnt = min<int>(buc[w].size(), k / w);
        pre.assign(cnt + 1, 0);
        for (int i = 1; i <= cnt; ++i) pre[i] = pre[i - 1] + buc[w][i - 1];
        fill(g.begin(), g.end(), -inf);
        for (rem = 0; rem < w && rem <= k; ++rem) cdq(0, (k - rem) / w, 0, (k - rem) / w);
        f.swap(g);
    } for (int i = 1; i <= k; ++i) cout << f[i] << ' ';
    cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：5

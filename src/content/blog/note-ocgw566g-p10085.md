---
title: "P10085 [GDKOI2024 提高组] 染色 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p10085"
categories: ["题解"]
tags: ["洛谷", "数学", "构造"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P10085).
:::

:::info[Solution]{open}
很有意思的题。考虑对一个点 $(x,y)$ 执行一次操作会翻转 $(x,y),(x+1,y),(x-1,y),(x,y+1),(x,y-1)$ 五个点的权值，然后考虑再对这五个点做一次翻转后发现只有 $(x,y),(x+2,y),(x-2,y),(x,y+2),(x,y-2)$ 五个点发生了实质的翻转。因此得到结论：做 $k$ 次这样的翻转可以翻转在 $\bmod\ 2^n$ 意义下的 $(x,y),(x+2^{k-1},y),(x-2^{k-1},y),(x,y+2^{k-1}),(x,y-2^{k-1})$ 五个点的权值。因此若 $k$ 取 $n-1$ 就可以做到只翻转 $(x,y)$ 一个点权值的要求。

然后直接对每个要翻转的点，倒推出整个翻转过程即可。时间复杂度为 $O(n4^n)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[2048][2048], typ[12][2048][2048];

inline void sol() {
    int n; cin >> n;
    for (int i = 0; i < (1 << n); ++i)
        for (int j = 0; j < (1 << n); ++j) cin >> a[i][j];
    for (int i = 0; i < (1 << n); ++i)
        for (int j = 0; j < (1 << n); ++j) typ[n - 1][i][j] = a[i][j];
    for (int k = n - 1; k; --k)
        for (int i = 0; i < (1 << n); ++i)
            for (int j = 0; j < (1 << n); ++j)
                if (typ[k][i][j]) {
                    typ[k - 1][i][j] ^= 1;
                    typ[k - 1][(i + (1 << (k - 1))) % (1 << n)][j] ^= 1;
                    typ[k - 1][(i + (1 << n) - (1 << (k - 1))) % (1 << n)][j] ^= 1;
                    typ[k - 1][i][(j + (1 << (k - 1))) % (1 << n)] ^= 1;
                    typ[k - 1][i][(j + (1 << n) - (1 << (k - 1))) % (1 << n)] ^= 1;
                }
    vector<pair<int, int>> res;
    for (int i = 0; i < (1 << n); ++i)
        for (int j = 0; j < (1 << n); ++j)
            if (typ[0][i][j]) res.emplace_back(i, j);
    cout << res.size() << '\n';
    for (auto &[i, j] : res) cout << i << ' ' << j << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：8

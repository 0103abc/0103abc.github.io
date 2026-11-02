---
title: "P13552 鱼类考古学 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p13552"
categories: ["题解"]
tags: ["洛谷", "基础算法", "贪心"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P13552).
:::

:::info[Solution]{open}
容易观察到一定是先执行 `&` 操作再执行 `+` 操作。证明可以 exchange argument。

因此问题可以转化成将 $n$ 个数恰好完全划分成 $k$ 个非空集合，问所有集合的按位与值的和最大是多少。

看到按位操作容易想到先拆位，因此先考虑这个问题的弱化版：把 $n$ 个布尔变量恰好完全划分成 $k$ 个非空集合，问所有集合的按位与值的和最大是多少。答案的上界显然是 $k$。做一些简单的观察可以发现一定存在一个最优解满足不存在一个组内同时包含 $0$ 和 $1$。因此该问题的答案就是 $\min(k,\sum\limits_{i=1}^n[\text{Bool}_i=1])$。

回到原问题。容易证明直接按位贪心的拆正确性是对的，因此问题时间复杂度为 $O(n\log n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N];

inline void sol() {
    int n, k; cin >> n >> k;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    int res = 0;
    for (int i = 29; ~i; --i) {
        int cnt = 0;
        for (int j = 1; j <= n; ++j)
            if (a[j] >> i & 1) ++cnt;
        if (cnt >= k) {
            int idx = 0, ok = 1;
            res += (1 << i) * (k - 1);
            for (int j = 1; j <= n; ++j)
                if (a[j] >> i & 1) b[++idx] = a[j] - (1 << i);
                else ok = 0;
            if (!ok) {
                b[++idx] = INT_MAX;
                for (int j = 1; j <= n; ++j)
                    if (~a[j] >> i & 1) b[idx] &= a[j];
            } else res += (1 << i);
            n = idx;
        } else {
            int idx = 0;
            for (int j = 1; j <= n; ++j)
                if (a[j] >> i & 1) --k, res += a[j];
                else b[++idx] = a[j];
            n = idx;
        }
        // if (i < 5) cerr << i << ": " << res << ' ' << n << ' ' << k << '\n';
        for (int j = 1; j <= n; ++j) a[j] = b[j];
    } for (int i = 1; i <= n; ++i) res += b[i];
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：蓝

鲜活指数：7

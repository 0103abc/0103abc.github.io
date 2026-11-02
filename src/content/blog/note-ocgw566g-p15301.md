---
title: "P15301 [ROI 2012 Day 2] army 汗国军队 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p15301"
categories: ["题解"]
tags: ["洛谷", "动态规划", "基础算法", "差分", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P15301).
:::

:::info[Solution]{open}
比较简单的 dp of dp 题。考虑刻画 LIS，记 $d_i$ 表示前 $i$ 个位置的 LIS 的长度，则相邻前缀的 LIS 长度只会增加 $0$ 或者增加 $1$，因此考虑记 $d$ 数组的差分序列然后压缩成二进制存到 dp 状态里，二进制中 $1$ 的数量就是整个排列的 LIS 长度。

考虑插入一个新的最大值，此时她可以成为其插入的位置的前面任意一个上升子序列的末尾，因此从插入位置开始前缀 LIS 的长度会暂时增加 $1$ 直到遇到下一个让其 LIS 长度增长的位置为止。因此二进制状态变化可以看作是在插入为止放一个 $1$ 然后删除其后面的第一个 $1$。

然后考虑 dp。设 $f_{i,j}$ 表示当前 LIS 的差分二进制状态为 $i$，最后一个护卫的位置为 $j$ 的排列的数量。转移把所有值按照从小到大的顺序插入然后直接模拟上述流程转移即可，统计答案也是简单的，这里就不再赘述了。

总时间复杂度为 $O(2^nn^2)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int pos[N], f[2][40000][17];

inline void sol() {
    int n, m; cin >> n >> m;
    for (int i = 1; i <= m; ++i) { int x; cin >> x; pos[x] = i; }
    f[0][0][0] = 1;
    for (int i = 1; i <= n; ++i) {
        memset(f[i & 1], 0, sizeof f[i & 1]);
        for (int j = 0; j < (1 << (i - 1)); ++j)
            for (int k = 0; k < i; ++k) {
                int st = pos[i] ? k + 1 : 1;
                for (int p = st; p <= i; ++p) {
                    int L = j & ((1 << (p - 1)) - 1), R = j >> (p - 1);
                    if (R) R ^= (R &- R);
                    int mask = L | (R << p) | (1 << (p - 1));
                    if (__builtin_popcount(mask) <= m) {
                        int np = pos[i] ? p : k + (int)(p <= k);
                        f[i & 1][mask][np] += f[~i & 1][j][k];
                    }
                }
            }
    }
    int res = 0;
    for (int i = 0; i < (1 << n); ++i)
        if (__builtin_popcount(i) == m)
            for (int j = 0; j <= n; ++j) res += f[n & 1][i][j];
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：6

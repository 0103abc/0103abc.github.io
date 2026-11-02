---
title: "P7985 [USACO21DEC] Paired Up P 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p7985"
categories: ["题解"]
tags: ["洛谷", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P7985).
:::

:::info[Solution]{open}
为什么要二合一（）

#### $T=1$

要求最大化匹配的牛的重量，这个是简单的，考虑直接 dp，设 $f_{i,j}$ 表示前 $i$ 个 G 和前 $j$ 个 H 中匹配的牛的最大重量是多少。转移是简单的不再赘述。时间复杂度为 $O(n^2)$。

#### $T=2$

要求最大化未匹配的牛的重量，无法直接迁移上面的 dp 做法。考虑设 $f_{i,j,0/1}$ 表示处理了前 $i$ 个 G 和前 $j$ 个 H，$0/1$ 表示目前可以留下来的未匹配的牛是 G / H。容易给出下面的转移方案：

+ 在状态 $0$ 下跳过下一头 G，并将其重量加入答案。
+ 在状态 $1$ 下跳过下一头 H，并将其重量加入答案。
+ 如果下一头奶牛和当前已经有的奶牛可以配对，则可以将其配对处理掉，状态不变。

但是还有一种比较困难的转移是切换状态，e.g. 从留下 G 类奶牛变成留下 H 类奶牛。

考虑此时最后未匹配的奶牛是 $G_i$，那么位置不超过 $x_{G_i}+K$ 的所有后续 $H$ 奶牛都不能未匹配，否则必然违反匹配的要求。因此这些 H 必须依次和后面的 G 匹配，以知道遇到第一头距离 $G_i$ 大于 $k$ 的 H 奶牛才能切换状态。

考虑与处理出每头奶牛右边最后一头距离不超过 $K$ 的不同品种的奶牛，以及从 $(i,j)$ 位置开始，连续有多少对 $(G_i,H_j),(G_{i+1},H_{j+1})$ 是可以合法匹配的。这样一来切换状态的情况就可以 $O(1)$ 时间复杂度做转移了。

因此总时间复杂度为 $O(n^2)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int g1[5010], g2[5010], h1[5010], h2[5010], lx[5010][5010], f[5010][5010][2], F[5010][5010], n1[5010], n2[5010];

inline void sol() {
    int t, n, k, i1 = 0, i2 = 0; cin >> t >> n >> k;
    for (int i = 1; i <= n; ++i) {
        char b; int x, y; cin >> b >> x >> y;
        if (b == 'G') g1[++i2] = x, g2[i2] = y;
        else h1[++i1] = x, h2[i1] = y;
    }
    if (t == 1) {
        int res = 0;
        for (int i = 1; i <= i1; ++i) res += h2[i];
        for (int i = 1; i <= i2; ++i) res += g2[i];
        for (int i = 1; i <= i1; ++i) {
            F[i & 1][0] = 0;
            for (int j = 1; j <= i2; ++j) {
                F[i & 1][j] = max(F[~i & 1][j], F[i & 1][j - 1]);
                if (abs(h1[i] - g1[j]) <= k) F[i & 1][j] = max(F[i & 1][j], F[~i & 1][j - 1] + h2[i] + g2[j]);
            }
        } cout << res - F[i1 & 1][i2] << '\n';
    } else {
        n1[0] = n2[0] = 1;
        for (int i = 1, j = 1; i <= i1; ++i) {
            while (j <= i2 && (abs(h1[i] - g1[j]) <= k || g1[j] < h1[i])) ++j;
            n1[i] = j;
        }
        for (int i = 1, j = 1; j <= i2; ++j) {
            while (i <= i1 && (abs(h1[i] - g1[j]) <= k || g1[j] > h1[i])) ++i;
            n2[j] = i;
        }
        for (int i = i1; i; --i)
            for (int j = i2; j; --j)
                if (abs(h1[i] - g1[j]) <= k) lx[i][j] = lx[i + 1][j + 1] + 1;
        memset(f, -0x3f, sizeof f), f[0][0][0] = f[0][0][1] = 0;
        for (int i = 0; i <= i1; ++i)
            for (int j = 0; j <= i2; ++j) {
                int t = max<int>(0, n1[i] - j - 1);
                if (i + t <= i1 && j + t <= i2 && lx[i + 1][j + 1] >= t) f[i + t][j + t][1] = max(f[i + t][j + t][1], f[i][j][0]);
                t = max<int>(0, n2[j] - i - 1);
                if (i + t <= i1 && j + t <= i2 && lx[i + 1][j + 1] >= t) f[i + t][j + t][0] = max(f[i + t][j + t][0], f[i][j][1]);
                if (i < i1) f[i + 1][j][0] = max(f[i + 1][j][0], f[i][j][0] + h2[i + 1]);
                if (j < i2) f[i][j + 1][1] = max(f[i][j + 1][1], f[i][j][1] + g2[j + 1]);
                if (i < i1 && j < i2 && abs(h1[i + 1] - g1[j + 1]) <= k) {
                    f[i + 1][j + 1][0] = max(f[i + 1][j + 1][0], f[i][j][0]);
                    f[i + 1][j + 1][1] = max(f[i + 1][j + 1][1], f[i][j][1]);
                }
            }
        cout << max(f[i1][i2][0], f[i1][i2][1]) << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：7

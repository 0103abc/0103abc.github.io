---
title: "P14347 [JOISC 2019] 灯 / Lamps 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p14347"
categories: ["题解"]
tags: ["洛谷", "动态规划", "线性动态规划"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P14347).
:::

:::info[Solution]{open}
比较无聊的题。观察性质可知一个位置最多被两次不同的操作覆盖，因此考虑直接分类设状态。

具体的，记 $f_{i,0/1/2/3/4/5}$ 表示当前处理了 $1\sim i$ 的位置，第 $i$ 个位置做了下面操作后达成了目标，操作次数最少是多少：

+ 0：没有进行操作
+ 1：取反操作
+ 2：推平为 0 操作
+ 3：推平为 1 操作
+ 4：推平为 0 然后取反
+ 5：推平为 1 然后取反

然后直接分类讨论然后转移即可，时间复杂度为 $O(n)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

char s[N], t[N];
int f[N][6];

inline void sol() {
    scanf("%s%s", s + 1, t + 1);
    int n = strlen(s + 1);
    memset(f, 0x3f, sizeof f);
    f[0][0] = 0;
    f[0][1] = f[0][2] = f[0][3] = 1;
    f[0][4] = f[0][5] = 2;
    for (int i = 1; i <= n; ++i) {
        if (s[i] == t[i]) f[i][0] = min({f[i - 1][0], f[i - 1][1], f[i - 1][2], f[i - 1][3], f[i - 1][4], f[i - 1][5]});
        else f[i][1] = min({f[i - 1][0] + 1, f[i - 1][1], f[i - 1][2] + 1, f[i - 1][3] + 1, f[i - 1][4], f[i - 1][5]});
        if (t[i] == '0') {
            f[i][2] = min({f[i - 1][0] + 1, f[i - 1][1] + 1, f[i - 1][2], f[i - 1][3] + 1, f[i - 1][4], f[i - 1][5] + 1});
            f[i][5] = min({f[i - 1][0] + 2, f[i - 1][1] + 1, f[i - 1][2] + 2, f[i - 1][3] + 1, f[i - 1][4] + 1, f[i - 1][5]});
        } else {
            f[i][3] = min({f[i - 1][0] + 1, f[i - 1][1] + 1, f[i - 1][2] + 1, f[i - 1][3], f[i - 1][4] + 1, f[i - 1][5]});
            f[i][4] = min({f[i - 1][0] + 2, f[i - 1][1] + 1, f[i - 1][2] + 1, f[i - 1][2] + 2, f[i - 1][4], f[i - 1][5] + 1});
        }
    } cout << min({f[n][0], f[n][1], f[n][2], f[n][3], f[n][4], f[n][5]}) << '\n';
}

} // namespace lowspeed_song
```
:::

难度：青

鲜活指数：2

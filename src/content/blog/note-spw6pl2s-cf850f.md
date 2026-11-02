---
title: "CF850F Rainbow Balls 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf850f"
categories: ["题解"]
tags: ["Codeforces", "数学", "概率与期望", "动态规划", "基础算法", "差分"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF850F).
:::

:::info[Solution]{open}
注意到一次操作后每种颜色的球的数量变化情况要么不变要么增加 $1$ 要么减少 $1$，因此可以把这个过程看作是随机游走。具体而言，设当前一共有 $S$ 个球，某种颜色当前有 $x$ 个球，则一次操作后：

+ $x$ 颜色的球数量增加 $1$ 的概率是 $\frac{x(S-x)}{S(S-1)}$。
+ $x$ 颜色的球数量减少 $1$ 的概率是 $\frac{x(S-x)}{S(S-1)}$。
+ 其余情况 $x$ 颜色的球数量不变。

考虑 dp。设 $f_i$ 表示最后所有球的颜色都是 $i$ 时，对总操作次数的期望贡献是多少。答案显然就是 $\sum\limits_{i=1}^nf_{a_i}$。这种颜色的球数量从 $x$ 个球开始，最终获胜的概率就是 $\frac xS$，写出带环的转移可得 $2f_x=f_{x-1}+f_{x+1}+\frac{S-1}{S-x}$，边界情况就是 $f_0=f_S=0$。

维护差分数组 $d_i=f_i-f_{i-1}$，则递推关系式可以变为 $d_{i+1}=d_i-\frac{S-1}{S-i}$。又因为 $f_S-f_0=\sum\limits_{i=1}^Sf_i=0$，可以算出 $d_1=\frac{(S-1)^2}S$。$f,d$ 两个数组一齐递推处理即可 $O(n\log p)$ 时间复杂度求出最终答案。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], f[N];

inline void sol() {
    int n, dlt = 0, s = 0; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i], s = (s + a[i]) % mod;
    f[1] = (s - 1) * (s - 1) % mod * inversion(s) % mod, dlt = (f[1] - 1 + mod) % mod;
    for (int i = 2; i < N; ++i) {
        f[i] = (f[i - 1] + dlt) % mod;
        dlt = (dlt + mod - (s - 1) * inversion(s + mod - i) % mod) % mod;
    } int res = 0;
    for (int i = 1; i <= n; ++i) res = (res + f[a[i]]) % mod;
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：6

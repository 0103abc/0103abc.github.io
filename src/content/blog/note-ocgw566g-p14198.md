---
title: "P14198 [ICPC 2024 Hangzhou R] Let's Go! New Adventure 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p14198"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数学", "线性代数", "基础算法", "前缀和"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P14198).
:::

:::info[Solution]{open}
先考虑最暴力的 dp。设 $f_i$ 表示处理前 $i$ 个位置，收益最大是多少。容易观察到显然如果一个角色被分成了两段那肯定不如合成一段带来的收益大，因此无需考虑互不相同的要求。转移是简单的，枚举转移点 $j$，dp 转移式形如：$f_i=\max\limits_{j=0}^{i-1}(f_j+w(A_i-A_j)-c)$，其中 $w(x)=\max\lbrace k\mid B_k\le x\rbrace$，$A_i,B_i$ 分别是 $a_i,b_i$ 两个数组的前缀和。时间复杂度为 $O(n^2\log m)$。

考虑优化。有个很天才方法是把阶梯函数 $w(i)$ 补充成看上去连续的函数的形式，设 $B_k\le x<B_{k+1}$，则记 $g(x)=k+\frac{x-B_k}{B_{k+1}-B_k}=k+\frac{x-B_k}{b_{k+1}}$，则显然有 $\lfloor g(x)\rfloor=w(x)$。又因为 $f_j,c$ 都是整数，所以 dp 转移可以完全扔掉 $w(x)$，写成 $f_i=\lfloor\max\limits_j(f_j+g(A_i-A_j)-c)\rfloor$ 的形式。

因为 $b_i$ 单调不降，所以 $g$ 函数是凸函数，转移矩阵就是 Monge 矩阵，决策单调性分治处理即可。时间复杂度为 $O(n\log n\log m)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

ld f[N];
int n, m, c;
int a[N], b[N], ts[N];
inline ld calc(int l, int r) {
    int id = upper_bound(b + 1, b + m + 1, a[r] - a[l]) - b - 1;
    return 1.L * (a[r] - a[l] - b[id]) / (b[id + 1] - b[id]) + id - c;
}

inline void cdq(int l, int r) {
    if (l == r) f[l] = (int)floor(f[l]);
    else {
        int mid = l + r >> 1;
        for (int i = ts[l - 1]; i <= ts[r]; ++i)
            if (f[i] + calc(i, mid) > f[mid]) f[mid] = f[i] + calc(i, mid), ts[mid] = i;
        cdq(l, mid);
        for (int i = l; i <= mid; ++i)
            if (f[i] + calc(i, r) > f[r]) f[r] = f[i] + calc(i, r), ts[r] = i;
        cdq(mid + 1, r);
    }
}

inline void sol() {
    cin >> n >> m >> c;
    for (int i = 1; i <= n; ++i) cin >> a[i], a[i] += a[i - 1];
    for (int i = 1; i <= m; ++i) cin >> b[i], b[i] += b[i - 1];
    b[m + 1] = inf;
    for (int i = 1; i <= n; ++i) f[i] = calc(0, i), ts[i] = 0;
    cdq(1, n), cout << (int)f[n] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑

鲜活指数：8

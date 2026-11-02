---
title: "CF1349D Slime and Biscuits 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf1349d"
categories: ["题解"]
tags: ["Codeforces", "数学", "概率与期望", "算法思想", "构造", "基础算法", "前缀和"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1349D).
:::

:::info[Solution]{open}
记 $x_i=m-a_i$ 即 $x_i$ 表示还有多少块饼干不在 $i$ 手里。考虑终止态是什么：显然此时一定是获胜者 $x_i=0$ 其余人均满足 $x_i=m$。

同样考虑鞅与停时定理，构造势能函数 $f(x)$。每一次选中一个人 $i$，则 $x_i$ 的变化情况只有三种，分别是不变，增加 $1$ 和减少 $1$。不变的情况势能不会变化，因此只需要讨论另外两种情况：

$x_i$ 减少 $1$：即先选一个不归属 $i$ 的饼干，然后把这个饼干给 $i$。概率显然就是 $\frac{x_i}{m(n-i)}$。

$x_i$ 增加 $1$：即任选一个归属 $i$ 的饼干即可，概率显然就是 $\frac{m-x_i}m$。

同样希望势能函数每次期望减少 $1$，即 $\frac x{m(n-1)}(f(x-1)-f(x))+\frac{m-x}m(f(x+1)-f(x))=-1$。记势能函数的变化量 $d_i=f(i)-f(i-1)$，因此可得 $-\frac{x}{m(n-1)}d_x+\frac{m-x}md_{x+1}=-1$，通项公式即为 $d_x=\frac{1+\frac{m-x}md_{x+1}}{\frac{x}{m(n-1)}}$，倒推即可求解，初始条件为 $d_m=n-1$。然后做一次前缀和即可求出 $f(i)=\sum\limits_{j=1}^id_j$。

但是因为这里是每个人的势能都平均减少 $1$，因此所有 $n$ 个人的势能加起来就会平均减少 $n$，因此真正的势能变化量转化为期望操作次数时还需要额外除以 $n$。

最后计算终止态势能 $\Phi'=\sum\limits_{i=1}^nf(m-a_i)-(n-1)f(m)$，根据上面的分析可知期望操作次数就是 $\frac{\Phi_\Delta}n$，其中 $\Phi_\Delta$ 是势能的期望变化量，即 $\Phi_\Delta=\Phi-\Phi'$。

时间复杂度为 $O(n\log n)$，瓶颈在于需要求 $n$ 次逆元，可以用科技做到 $O(n+p^{\frac23})$。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

const int i36 = 859599304;

inline void init() {
}

int a[N], f[N];

inline void sol() {
    int n, m = 0; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i], m = (m + a[i]) % mod;
    for (int i = 1; i < N; ++i) f[i + 1] = ((m * (n - 1) % mod * inversion(m - i) % mod + mod + 2 - n) * f[i] % mod + mod - i * (n - 1) % mod * inversion(m - i) % mod * (f[i - 1] + 1) % mod) % mod;
    int res = (mod - f[m]) % mod; for (int i = 1; i <= n; ++i) res = (res + f[a[i]]) % mod;
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：暂无评定

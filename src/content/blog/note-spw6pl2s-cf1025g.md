---
title: "CF1025G Company Acquisitions 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf1025g"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造", "数学", "概率与期望"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1025G).
:::

:::info[Solution]{open}
很典的鞅与停时问题。一个活跃公司有 $x$ 个下属公司可以看作是连通块内有 $x+1$ 个公司。

考虑构造势能函数 $f(x)$。记总势能 $\Phi=\sum f(x_i)$，则考虑若当前选择了两个活跃公司分别有 $x$ 个下属和 $y$ 个下属，则考虑分类讨论来更新总势能量：

+ 第一个公司被第二个公司收购，则出现了 $x$ 个势能为 $f(0)$ 的单点独立公司，第二个公司多了一个下属，因此势能从 $f(x)+f(y)$ 变为了 $xf(0)+f(y+1)$。
+ 第二个公司被第一个公司收购，同理可得势能由 $f(x)+f(y)$ 变为了 $yf(0)+f(x+1)$。

终止状态的势能显然就是 $\Phi'=f(n-1)$，做差可得势能变化量 $\Phi_\Delta=\sum f(x_i)-f(n-1)$，希望 $\Phi_\Delta$ 和期望操作次数呈正比关系，因此这里希望构造势能函数 $f(x)$ 满足每次操作后势能变化量都为固定常数，这里让这个常数的值为 $-1$。

考虑直接解出 $f(x)$ 这个势能函数。为了方便令 $f(0)=0$，则有 $E(\Phi)=\frac12(xf(0)+f(y+1)+yf(0)+f(x+1))=f(x)+f(y)-1$，带入 $x=y$ 可得 $f(x+1)=2f(x)-1$ 即 $f(x)=1-2^x$。因此可以 $O(n)$ 求出 $x_i$ 和 $\Phi_\Delta$ 即变化量，期望操作次数就是 $|\Phi_\Delta|$。因此总时间复杂度为 $O(n)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

const int i36 = 859599304;

inline void init() {
}

int pwr[N], a[N], buc[N];

inline int f(int x) { return (mod + 1 - pwr[x - 1]) % mod; }

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    pwr[0] = 1;
    for (int i = 1; i < N; ++i) pwr[i] = pwr[i - 1] * 2 % mod;
    int res = (mod - f(n)) % mod;
    for (int i = 1; i <= n; ++i)
        if (~a[i]) ++buc[a[i]];
        else ++buc[i];
    for (int i = 1; i <= n; ++i)
        if (buc[i]) res = (res + f(buc[i]) + mod) % mod;
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：暂无评定

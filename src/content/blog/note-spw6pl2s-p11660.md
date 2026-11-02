---
title: "P11660 我终将成为你的倒影 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p11660"
categories: ["题解"]
tags: ["洛谷", "基础算法", "差分"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P11660).
:::

:::info[Solution]{open}
前置知识：经典恒等式 $\lfloor\frac{x+a}b\rfloor=\lfloor\frac xb\rfloor+\lfloor\frac ab\rfloor+[x\bmod b+t\ge b]$。

对相邻元素之间的关系分块。一次询问 $[l,r]$ 可以看作是询问 $[l,r-1]$ 区间内的关系贡献。注意到 $b\le 500$，因此考虑固定 $b$ 的值。记 $t=a\bmod b$，则设相邻两个元素的值分别是 $x,y$，$f(x)$ 和 $f(y)$ 就可以分别写作是 $\lfloor\frac xb\rfloor+\lfloor\frac ab\rfloor+[x\bmod b+t\ge b]$ 和 $\lfloor\frac yb\rfloor+\lfloor\frac ab\rfloor+[y\bmod b+t\ge b]$。比较大小关系只需要比较 $\lfloor\frac xb\rfloor+[x\bmod b+t\ge b]$ 和 $\lfloor\frac yb\rfloor+[y\bmod b+t\ge b]$ 即可。设 $x=q_xb+r_x,y=q_yb+r_y$，则上面两个式子相等必须满足 $|q_x-q_y|\le 1$。

具体分类讨论两式相等时 $t$ 可能的取值范围：

+ $q_x=q_y$：$t\in[0,b-\max(r_x,r_y)]\cup[b-\min(r_x,r_y),b)$。
+ $q_x=q_y+1$，$t\in[b-r_y,b-r_x)$。
+ $q_x+1=q_y$，$t\in[b-r_x,b-r_y)$。

因此考虑对每个 $b$ 值，都建一个关于 $t$ 合法取值范围的差分数组，然后分块，存储每个块内每个 $b$ 值的信息，查询时整块查表散块直接暴力算即可。需要调一下块长。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, m, a[N], tmp[N], L[400], R[400], bel[N], off[505], diff[400][125755];

inline void add(int k, int b, int l, int r) { if (l < r) ++diff[k][off[b] + l], --diff[k][off[b] + r]; }

inline void build() {
    for (int b = 1; b <= 500; ++b) off[b + 1] = off[b] + b + 1;
    const int blk = 256;
    for (int i = 1; i < n; ++i) bel[i] = (i - 1) / blk + 1;
    for (int i = 1; i < n; ++i) R[bel[i]] = i;
    for (int i = n - 1; i; --i) L[bel[i]] = i;
    for (int b = 1; b <= 500; ++b) {
        for (int i = 1; i <= n; ++i) tmp[i] = a[i] - a[i] / b * b;
        for (int k = 1; k <= bel[n - 1]; ++k) {
            for (int i = L[k]; i <= R[k]; ++i) {
                if (a[i] / b == a[i + 1] / b) add(k, b, 0, b - max(tmp[i], tmp[i + 1])), add(k, b, b - min(tmp[i], tmp[i + 1]), b);
                else if (a[i] / b == a[i + 1] / b + 1 && tmp[i + 1] > tmp[i]) add(k, b, b - tmp[i + 1], b - tmp[i]);
                else if (a[i] / b + 1 == a[i + 1] / b && tmp[i] > tmp[i + 1]) add(k, b, b - tmp[i], b - tmp[i + 1]);
            } int sum = 0;
            for (int i = 0; i < b; ++i) sum += diff[k][off[b] + i], diff[k][off[b] + i] = sum;
        }
    }
}

inline int chk(int i, int A, int b) { return (a[i] + A) / b == (a[i + 1] + A) / b; }
inline int qry(int l, int r, int a, int b) {
    int res = 0;
    if (bel[l] == bel[r - 1]) {
        for (int i = l; i < r; ++i) res += chk(i, a, b);
        return res;
    }
    for (int i = l; i <= R[bel[l]]; ++i) res += chk(i, a, b);
    for (int k = bel[l] + 1; k < bel[r - 1]; ++k) res += diff[k][off[b] + a % b];
    for (int i = L[bel[r - 1]]; i < r; ++i) res += chk(i, a, b);
    return res;
}

inline void sol() {
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    build();
    int las = 0;
    while (m--) {
        int l, r, a, b; cin >> l >> r >> a >> b;
        l ^= las, r ^= las, a ^= las, b ^= las;
        cout << (las = qry(l, r, a, b)) << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：6

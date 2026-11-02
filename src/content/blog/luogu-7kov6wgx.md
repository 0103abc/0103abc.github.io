---
title: "P7974 [KSN2021] Delivering Balls 题解"
date: "2025-11-19T10:52:43.000Z"
link: "luogu-7kov6wgx"
categories: ["题解"]
tags: ["洛谷", "数据结构", "区间最值"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/7kov6wgx)。

先交换 $l,r$ 使得 $l\le r$。

此时想要从 $l$ 移动到 $r$，找到区间中最高的位置 $id$，高度为 $h_{id}$，则显然在 $id$ 这个时刻移动到恰好 $h_{id}$ 高度是最优的，而在每个位置往上走的花费都是定值 $4$，因此考虑在最开始就移动到 $h_{id}$ 这个高度，花费的代价就是 $4(\max(h_i-i)-(h_l-l))$，维护 $a_i-i$ 的静态区间最值即可。

对称的有往下走的情况，同样维护一个 $a_i+i$ 的静态区间最值即可。

前面计算的全都是直着上升的部分，还有斜着上升的段，斜着下降的段以及横着走的段，都是容易计算的。把上面所有东西加起来之后化简可以得到答案为：

+ 记 $mx1$ 表示区间内高度的最大值。
+ 记 $mx2$ 表示区间内 $h_i-i$ 的最大值。
+ 记 $mx3$ 表示区间内 $h_i+i$ 的最大值。

最后的答案即为：$mx1+2mx2+2mx3-4h_s-h_t$（注意最后是 $s,t$ 不是 $l,r$）。用三个 ST 表分别维护这三个区间最大值，总时间复杂度为 $O(n\log n+Q)$，可以通过该题。

```cpp
int a[N], f[N][20], g[N][20], h[N][20];
inline int qry_f(int l, int r)
{
    int lgx = __lg(r - l + 1);
    return max(f[l][lgx], f[r - (1 << lgx) + 1][lgx]);
}
inline int qry_g(int l, int r)
{
    int lgx = __lg(r - l + 1);
    return max(g[l][lgx], g[r - (1 << lgx) + 1][lgx]);
}
inline int qry_h(int l, int r)
{
    int lgx = __lg(r - l + 1);
    return max(h[l][lgx], h[r - (1 << lgx) + 1][lgx]);
}
signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n, q;
    cin >> n;
    for (int i = 1; i <= n; ++i)
        cin >> a[i];
    for (int i = 1; i <= n; ++i)
        f[i][0] = a[i], g[i][0] = a[i] - i, h[i][0] = a[i] + i;
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= n - (1 << i) + 1; ++j)
        {
            f[j][i] = max(f[j][i - 1], f[j + (1 << (i - 1))][i - 1]);
            g[j][i] = max(g[j][i - 1], g[j + (1 << (i - 1))][i - 1]);
            h[j][i] = max(h[j][i - 1], h[j + (1 << (i - 1))][i - 1]);
        }
    cin >> q;
    while (q--)
    {
        int l, r;
        cin >> l >> r;
        int m1 = qry_f(min(l, r), max(l, r));
        int m2 = qry_g(min(l, r), max(l, r));
        int m3 = qry_h(min(l, r), max(l, r));
        cout << m1 + 2 * (m2 + m3) - 4 * a[l] - a[r] << '\n';
    }
    return 0;
}
```

## 做题笔记补充

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/obgeyrgs)。

1hr AK 了代码源 B 队选拔赛，感觉很不牛，咋有一堆我做过的原啊？？

先交换 $l,r$ 使得 $l\le r$。

此时想要从 $l$ 移动到 $r$，找到区间中最高的位置 $id$，高度为 $h_{id}$，则显然在 $id$ 这个时刻移动到恰好 $h_{id}$ 高度是最优的，而在每个位置往上走的花费都是定值 $4$，因此考虑在最开始就移动到 $h_{id}$ 这个高度，花费的代价就是 $4(\max(h_i-i)-(h_l-l))$，维护 $a_i-i$ 的静态区间最值即可。

对称的有往下走的情况，同样维护一个 $a_i+i$ 的静态区间最值即可。

前面计算的全都是直着上升的部分，还有斜着上升的段，斜着下降的段以及横着走的段，都是容易计算的。把上面所有东西加起来之后化简可以得到答案为：

+ 记 $mx1$ 表示区间内高度的最大值。
+ 记 $mx2$ 表示区间内 $h_i-i$ 的最大值。
+ 记 $mx3$ 表示区间内 $h_i+i$ 的最大值。

最后的答案即为：$mx1+2mx2+2mx3-4h_s-h_t$（注意最后是 $s,t$ 不是 $l,r$）。用三个 ST 表分别维护这三个区间最大值，总时间复杂度为 $O(n\log n+Q)$，可以通过该题。

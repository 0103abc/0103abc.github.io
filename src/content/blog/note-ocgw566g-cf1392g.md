---
title: "CF1392G Omkar and Pies 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-cf1392g"
categories: ["题解"]
tags: ["Codeforces", "数学", "组合数学", "动态规划"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1392G).
:::

:::info[Solution]{open}
对 $[l,r]$ 区间做操作可以看作是对 $[l,n]$ 区间和 $[r+1,n]$ 区间分别做一次操作，因此后面只需要考虑后缀的操作即可。记 $A_i$ 表示 $a$ 序列交换 $i\sim n$ 之后得到的结果，$B_i$ 表示 $b$ 序列交换 $i\sim n$ 之后得到的结果。因此问题可以被理解为找 $i<j$ 且 $j-i\ge m$ 使得 $A_i$ 和 $B_j$ 两个序列的相同位置尽量多。最终的答案就满足 $l-i,r=j-1$。

记 $A_i$ 序列中 $1$ 的个数为 $c_1$，$B_j$ 序列中 $1$ 的个数为 $c_2$，两个串共同为 $1$ 的位置数量为 $c_3$。显然无论怎么交换相同位置的数量都是共同为 $1$ 的位置数量加上共同为 $0$ 的位置数量。容斥一下可得共同为 $0$ 的位置数量为 $k-c_1-c_2+c_3$，因此总共相同位置的数量就是 $k-c_1-c_2+2c_3$。$k,c_1,c_2$ 都是定值，因此目标就是让操作后 $c_3$ 的值尽可能的大。

考虑枚举集合 $S$ 表示要求这些位置在 $A_i,B_j$ 两个序列中都为 $1$。记 $f_S=\min\lbrace i\mid S\subseteq A_i\rbrace,g_S=\max\lbrace i\mid S\subseteq B_i\rbrace$。若 $g_S-f_S\ge m$ 则可以取 $l=f_S,r=g_S-1$，共同为 $1$ 的位置数量就是 $|S|$。

问题在于如何快速求出 $f,g$ 两个数组的值。这个部分是简单的，直接 SOS-dp 求即可。

总时间复杂度为 $O(n+k2^k)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int x[N], y[N], A[N], B[N], pos[30], f[N], g[N];

inline void sol() {
    int n, m, k; cin >> n >> m >> k;
    string s, t; cin >> s >> t;
    iota(pos, pos + k, 0);
    for (int i = 1; i <= n; ++i) cin >> x[i] >> y[i], --x[i], --y[i];
    int c1 = 0, c2 = 0;
    for (int i = 0; i < k; ++i) {
        if (s[i] == '1') ++c1, A[n + 1] |= (1 << i);
        if (t[i] == '1') ++c2, B[n + 1] |= (1 << i);
    }
    function<void(int&, int, int)> swp = [&](int &mask, int i, int j) -> void {
        if ((mask >> i & 1) != (mask >> j & 1)) mask ^= (1 << i) | (1 << j);
    };
    for (int i = n; i; --i) {
        A[i] = A[i + 1], B[i] = B[i + 1];
        int a = pos[x[i]], b = pos[y[i]];
        swp(A[i], a, b), swp(B[i], a, b);
        swap(pos[x[i]], pos[y[i]]);
    } memset(f, 0x3f, sizeof f);
    for (int i = 1; i <= n + 1; ++i) {
        f[A[i]] = min(f[A[i]], i);
        g[B[i]] = max(g[B[i]], i);
    } int mx = -inf, L = 1, R = m;
    for (int i = (1 << k) - 1; ~i; --i) {
        if (g[i] - f[i] >= m) {
            int c = __builtin_popcount(i);
            if (c > mx) mx = c, L = f[i], R = g[i] - 1;
        } for (int j = 0; j < k; ++j) if (i >> j & 1) {
            f[i ^ (1 << j)] = min(f[i ^ (1 << j)], f[i]);
            g[i ^ (1 << j)] = max(g[i ^ (1 << j)], g[i]);
        }
    } cout << k - c1 - c2 + 2 * mx << '\n' << L << ' ' << R << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：8

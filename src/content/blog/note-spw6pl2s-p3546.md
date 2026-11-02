---
title: "P3546 [POI 2012] PRE-Prefixuffix 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p3546"
categories: ["题解"]
tags: ["洛谷", "动态规划", "字符串", "字符串哈希"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P3546).
:::

:::info[Solution]{open}
~~结论题，但是我好像不知道结论。~~

一个不需要结论的做法。注意到 $s$ 串可以被表示成 $\texttt{ABCBA}$ 的形式，因此考虑 dp，设 $f_i$ 表示确定串 $\tt{A}$ 为 $s[1:i]$ 时，$\tt{B}$ 串长度最大是多少。显然此时有 $f_i\le f_{i+1}+2$，然后直接暴力缩小 $f_i$ 的范围即可。容易用均摊手法证明时间复杂度为 $O(n)$。判断是否合法使用字符串哈希即可。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

char s[N];
const int base = 13331;
int h[N], bit[N], f[N];

inline int get(int l, int r) {
    return (h[r] - h[l - 1] * bit[r - l + 1] % mod + mod) % mod;
}

inline void sol() {
    int n, res = 0; cin >> n;
    scanf("%s", s + 1);
    bit[0] = 1;
    for (int i = 1; i < N; ++i) bit[i] = bit[i - 1] * base % mod;
    for (int i = 1; i <= n; ++i) h[i] = (h[i - 1] * base + s[i]) % mod;
    for (int i = n / 2; i; --i) {
        f[i] = f[i + 1] + 2;
        if (f[i] + i > n / 2) f[i] = n / 2 - i;
        while (f[i] && get(i + 1, i + f[i]) != get(n - i - f[i] + 1, n - i)) --f[i];
    } for (int i = 1; i <= n / 2; ++i)
        if (get(1, i) == get(n - i + 1, n)) res = max(res, f[i] + i);
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：蓝

鲜活指数：5

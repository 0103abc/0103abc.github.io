---
title: "P5770 [JSOI2016] 无界单词 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p5770"
categories: ["题解"]
tags: ["洛谷", "字符串", "动态规划", "算法思想", "构造"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P5770).
:::

:::info[Solution]{open}
无界单词其实就是没有真 border 的字符串。第一问考虑 dp，设 $f_i$ 表示长度为 $i$ 的无界单词的数量，则转移考虑正难则反做，总共有 $2^i$ 个字符串，对每一个有 border 的字符串设其最短 border 的长度为 $j$，则这个长度为 $j$ 的串一定是无界单词，剩下的 $i-2j$ 个字符可以随便填写，转移就是 $f_i=2^i-\sum\limits_{j=1}^{\lfloor\frac i2\rfloor}f_j2^{i-2j}$。直接做就是 $O(n^2)$ 的（可以优化到 $O(n)$）。

upd：第一问可以做到 $O(\log^3n)$。

第二问构造是简单的，直接按位贪心即可。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int n;
char s[N];
u64 f[N], g[N], pwr[N];

inline void init() {
    pwr[0] = 1;
    for (int i = 1; i <= 63; ++i) pwr[i] = pwr[i - 1] * 2;
    for (int i = 1; i <= 64; ++i) {
        f[i] = pwr[i];
        for (int j = 1; j + j <= i; ++j) f[i] -= f[j] * pwr[i - j - j];
    }
}

inline int same(int l1, int r1, int l2) {
    for (int i = 0; i <= r1 - l1; ++i)
        if (s[l1 + i] != s[l2 + i]) return 0;
    return 1;
}

inline int good(int len) {
    for (int i = 1; i <= len / 2; ++i)
        if (same(1, i, len - i + 1)) return 0;
    return 1;
}

inline u64 calc(int len) {
    for (int i = 1; i <= n; ++i) {
        if (i <= len) g[i] = good(i);
        else {
            g[i] = pwr[i - len];
            for (int j = 1; j <= i / 2; ++j)
                if (j <= i - len) g[i] -= g[j] * pwr[i - j - max(len, j)];
                else if (same(1, len - i + j, i - j + 1)) g[i] -= g[j];
        }
    } return g[n];
}

inline void sol() {
    u64 k; cin >> n >> k;
    cout << f[n] << '\n';
    for (int i = 1; i <= n; ++i) {
        s[i] = 'a';
        u64 cnt = calc(i);
        if (cnt < k) k -= cnt, cout.put('b'), s[i] = 'b';
        else cout.put('a'), s[i] = 'a';
    } cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：青

鲜活指数：5

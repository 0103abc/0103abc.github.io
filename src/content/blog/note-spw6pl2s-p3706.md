---
title: "P3706 [SDOI2017] 硬币游戏 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p3706"
categories: ["题解"]
tags: ["洛谷", "数学", "概率与期望", "动态规划", "字符串"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P3706).
:::

:::info[Solution]{open}
考虑 dp。设 $f_i$ 表示第 $i$ 个人获胜的概率，$f_0$ 表示没有人获胜的概率。称一个串是好的，当且仅当这个串的条件下没有人获胜。

容易发现第 $i$ 个人获胜时整个串一定可以被表示为一个好的串加上 $s_i$ 串的形式，此时其概率就是 $\frac{f_0}{2^m}$。但是此时还存在一个问题是在从一个好串加入 $s_i$ 串的字符时可能其他人（$j$）在这个过程中就已经获胜了。思考什么时候会发生这种情况，发现此时若 $s_i$ 的某个前缀和 $s_j$ 的某个后缀相等，然后这个公共前后缀的长度为 $k$，则若 $s_j$ 串除了后 $k$ 个字符以外的部分是总串的后缀，填写 $s_i$ 的前 $k$ 个字符就会导致 $j$ 直接获胜。

记 $pre_{i,j}$ 表示 $s_i$ 串前 $j$ 个字符组成的字符串，$suf_{i,j}$ 表示 $s_i$ 串后 $j$ 个字符组成的字符串。则列出带环的 dp 转移式形如：$f_i+\sum\limits_{j=1}^nf_j\sum\limits_{k=1}^m[pre_{i,k}=suf_{j,k}]\frac1{2^{m-k}}=\frac{f_0}{2^m}$，直接高斯消元即可做到 $O(n^3)$ 解决问题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

char s[310][310];

const u64 base = 13331;
double pwr[N], mp[310][310], res[N];
u64 pre[310][310], suf[310][310], bit[N];

inline void gauss(int n) {
    for (int i = 1; i <= n; ++i) {
        int pos = i;
        for (int j = i; j <= n; ++j)
            if (abs(mp[j][i]) > abs(mp[pos][i])) { pos = j; break; }
        if (pos != i) for (int j = 1; j <= n + 1; ++j) swap(mp[pos][j], mp[i][j]);
        for (int j = i + 1; j <= n; ++j)
            if (mp[j][i] != 0) {
                double p = 1. * mp[j][i] / mp[i][i];
                for (int k = i; k <= n + 1; ++k) mp[j][k] -= mp[i][k] * p;
            }
    }
    for (int i = n; i; --i) {
        for (int j = i + 1; j <= n; ++j) mp[i][n + 1] -= mp[i][j] * res[j];
        res[i] = mp[i][n + 1] / mp[i][i];
    }
}

inline void sol() {
    int n, m; cin >> n >> m;
    pwr[0] = 1; for (int i = 1; i < N; ++i) pwr[i] = pwr[i - 1] * 0.5;
    bit[0] = 1; for (int i = 1; i < N; ++i) bit[i] = bit[i - 1] * base;
    for (int i = 1; i <= n; ++i) scanf("%s", s[i] + 1);
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) pre[i][j] = pre[i][j - 1] * base + s[i][j];
        for (int j = 1; j <= m; ++j) {
            suf[i][j] = 0;
            for (int k = m - j + 1; k <= m; ++k) suf[i][j] = suf[i][j] * base + s[i][k];
        }
    } for (int i = 1; i <= n; ++i) for (int j = 1; j <= n; ++j) for (int k = 1; k <= m; ++k)
        if (pre[i][k] == suf[j][k]) mp[i][j] += pwr[m - k];
    for (int i = 1; i <= n; ++i) mp[n + 1][i] = 1, mp[i][n + 1] -= pwr[m];
    mp[n + 1][n + 2] = 1; gauss(n + 1);
    for (int i = 1; i <= n; ++i) cout << res[i] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：6

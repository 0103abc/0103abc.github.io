---
title: "P9523 [JOIST 2022] 复制粘贴 3 / Copy and Paste 3 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p9523"
categories: ["题解"]
tags: ["洛谷", "字符串", "动态规划", "基础算法", "前缀和"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P9523).
:::

:::info[Solution]{open}
考虑区间 dp。设 $f_{i,j}$ 表示让区间 $[l,r]$ 内的字符串正确所需要花费的最小时间，则初始条件显然为 $f_{i,j}=A(j-i+1)$。转移有下面的几种形式：

+ $f_{i,j}=f_{i+1,j}+A$。
+ $f_{i,j}=f_{i,j-1}+A$。
+ 如果 $[x,y]\subseteq[i,j]$ 且 $[x,y]$ 在 $[i,j]$ 中无交的出现了 $k$ 次，则有转移 $f_{i,j}=f_{x,y}+(j-i+1-k(y-x+1))A+B+kC$。

考虑先优化一下转移的形式。钦定转移时 $j=y$ 且 $[x,y]$ 是满足 $[i,y]$ 出现了 $k$ 次的最大的位置 $i$，则转移最终的答案一定和原来的转移完全相同。此时如果不考虑找位置 $x$ 的时间复杂度，其余转移部分的时间复杂度为 $O(n^2\log n)$。

现在考虑怎么对区间 $[i,j]$ 和出现次数 $k$ 快速找到合法的转移点 $x$。考虑预处理出 $lcp_{i,j}$ 表示从第 $i$ 个位置开始的后缀和从第 $j$ 个位置开始的后缀的最长公共前缀长度是多少，显然可以 $O(n^2)$ 直接转移。然后再设 $pre_{i,len}$ 表示子串 $S[i:i+len-1]$ 在左边最靠右的不相交出现位置是什么，枚举 $p<i$ 令 $v=\min(lcp_{p,i},i-p)$ 表示位置 $p$ 对所有长度不超过 $v$ 的子串都是合法的前一次出现，因此先让 $pre_{i,v}=\max(pre_{i,v},p)$ 然后再对长度从大到小做后缀最大值就可以 $O(1)$ 时间复杂度找到前一次出现位置。

对当前区间 $[i,j]$ 令 $len=j-i+1$，从 $p=i$ 开始不断执行 $p\leftarrow pre_{p,len}$，每跳一次就找到了一个更靠左且不相交的出现位置，假设这个时候一共找到了 $k$ 次那么转移形如 $f_{p,j}\leftarrow\min(f_{p,j},f_{i,j}+B+kC+(j-p+1-klen)A)$。

因此问题解决，总时间复杂度为 $O(n^2\log n)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

char s[N];
int lcp[3010][3010], f[3010][3010], pre[3010][3010];

inline void init() {
}

inline void sol() {
    int n; cin >> n;
    scanf("%s", s + 1);
    int A, B, C; cin >> A >> B >> C;
    for (int i = n; i; --i)
        for (int j = n; j > i; --j)
            if (s[i] == s[j]) lcp[i][j] = lcp[i + 1][j + 1] + 1;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j < i; ++j) pre[i][min(lcp[j][i], i - j)] = max(pre[i][min(lcp[j][i], i - j)], j);
        for (int j = n - 1; j; --j) pre[i][j] = max(pre[i][j], pre[i][j + 1]);
    } 
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= n - i + 1; ++j) f[j][j + i - 1] = A * i;
    for (int len = 1; len <= n; ++len)
        for (int i = 1, j = len; j <= n; ++i, ++j) {
            if (len > 1) f[i][j] = min({f[i][j], f[i][j - 1] + A, f[i + 1][j] + A});
            int pos = i, k = 1;
            while (pre[pos][len]) {
                pos = pre[pos][len], ++k;
                f[pos][j] = min(f[pos][j], f[i][j] + B + C * k + A * (j - pos + 1 - k * len));
            }
        }
    cout << f[1][n] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：10

---
title: "CF1646E Power Board 题解"
date: "2024-12-14T04:34:22.000Z"
link: "luogu-w8aydx2a"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论"]
draft: false
---

简单题，~~但是没想出来~~

考虑对于每一个不为 $1$ 的数 $i$，若其之前没有访问过，则将所有 $i^k$ 全部标记，并将所有底数为 $i^k$ 的数全部列出。可以将底数全部改为 $i$ 然后同样的修改指数的值。问题变为计算有多少本质不同的二元数对 $(i,j)$ 同时满足下列条件：

+ $1\le i\le k$（$k$ 是最大的正整数满足 $i^k\le n$）
+ $1\le j\le m$

这里定义两个二元数对 $(i,j)$ 和 $(i',j')$ 本质不同当且仅当 $ij\neq i'j'$。即计数有多少个不同的整数 $ij$。因为 $j$ 的上界一直都是定值 $m$，而 $i$ 的上界为 $\log n$ 级别约等于 $20$，所以这个直接随便暴力预处理一下即可。

```cpp
int buc[32];
unsigned char mp[20000100], vis[2000100];
void run() {
    int n = read(), m = read();
    int s = 1, tot = 0;
    for (int i = 1; i <= 20; ++i) {
        for (int j = 1; j <= m; ++j) {
            if (!mp[i * j]) ++tot;
            mp[i * j] = 1;
        }
        buc[i] = tot;
    }
    for (int i = 2; i <= n; ++i) {
        if (!vis[i]) {
            int j = i, pw = 0;
            while (j <= n) {
                ++pw;
                vis[j] = 1;
                j *= i;
            }
            s += buc[pw];
        }
    }
    cout << s << '\n';
}
```

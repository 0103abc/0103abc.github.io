---
title: "CF1592F2 Alice and Recoloring 2 题解"
date: "2025-02-22T15:39:03.000Z"
link: "luogu-4do0zh1j"
categories: ["题解"]
tags: ["Codeforces", "数学", "组合数学", "线性代数", "基础算法", "差分"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/4do0zh1j)。

**「感觉能独立想出这题的人，脑子和蛇一样聪明」**

一眼看上去这题十分神秘不可做，因此考虑逐步挖掘其性质。

性质：有用的操作其实只有 $1,4$ 两种。

证明：

对于 $2$ 操作：则可以先用一次 $1$ 操作操作掉整个左侧，然后再把不包含于她的左上角操作。这样花费的代价为 $2$，优于 $1$ 次 $2$ 操作的 $3$ 代价。$4$ 操作同理，用 $1$ 操作操作掉整个上侧然后容斥把不包含于她的左上角操作，花费的代价为 $2$，优于 $1$ 次 $3$ 操作花费的 $4$ 代价。

---

然后发现一次操作操作的是一个矩阵，看上去很麻烦，要将其变为对单点做操作。因此考虑对矩阵做二阶差分。这里重定义颜色之间的按位异或：

+ 相同颜色异或，得到的颜色为 $\texttt{W}$。
+ 不同颜色异或，得到的颜色为 $\texttt{B}$。

考虑将其转化为实际的数字意义，即 $\texttt{W}$ 代表 $0$，$\texttt{B}$ 代表 $1$。此时令这个差分的二维数组为 $a$，则考虑一次操作会对新的二维数组 $a$ 做怎样的修改。

+ 对于一次 $1$ 操作 $(x,y)$，则只有 $(x,y)$ 一个点会取反。
+ 对于一次 $4$ 操作 $(x,y)$，那么 $(x-1,y-1)$，$(x-1,m)$，$(n,y-1)$，$(n,m)$ 四个点都会被取反。

看上去一次 $4$ 操作修改的位置更多，性质或许也会更强一些？于是对其做分析。考虑同时对在同一行上的两个坐标 $(x,y_1)$ 和 $(x,y_2)$ 做一次 $4$ 操作，则此时 $(x,y_1),(n,y_1),(x,y_2),(n,y_2)$ 四个格子被取反了一次，而 $(x,m),(n,m)$ 被取反了两次（等于没变）。一共取反了 $4$ 个格子，和做 $4$ 次 $1$ 操作效果等价，花费均为 $4$。因此其实这种情况可以规避开较为复杂的 $4$ 操作去使用较为简单的 $1$ 操作替代。同一列上的两个坐标 $(x_1,y)$ 和 $(x_2,y)$ 的情况也同理。换句话说：$4$ 操作操作的任意两个位置横纵坐标必须都不相同。

可以通过类似的手段分析，得到另一个性质更为强大的结论：使用 $4$ 操作对 $(x,y)$ 做操作比用 $1$ 操作严格好，当且仅当 $(x,y),(x,m),(n,y)$ 三个格子的值都为 $1$。证明类似于上面一个步骤，如果这三个格子中存在一个格子不为 $1$ 则需要容斥一次翻转操作，即执行两次翻转，花费的代价为 $4$。而若用 $1$ 操作则只需要不超过 $3$ 的代价就可以达成目标。

分析了这么一大通，那么这个题有应该如何解决呢？考虑到（忘了哪个题）的套路，建一张二分图，把横坐标建在图的左侧，纵坐标建在图的右侧。那么做一次可能合法 $4$ 操作 $(x,y)$ 就是把左侧点 $x$ 向右侧点 $y$ 连一条边。用匈牙利算法对该图跑最大匹配，或者建立源汇用 Dinic 算法求解其网络最大流均可。时间复杂度为 $O(n^3)$ 或 $O(n^{2.5})$（$n,m$ 同阶），而且远远跑不满，所以可以通过。

代码：

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/hash_policy.hpp>
#define int long long
using namespace std;
const int N = 500010;
vector<int> adj[N];
char s[1010][1010];
int used[N], mat[N];
int dfs(int u) {
    for (int &v : adj[u])
        if (!used[v]) {
            used[v] = 1;
            if (!mat[v] || dfs(mat[v])) {
                mat[v] = u;
                return 1;
            }
        }
    return 0;
}
char mp[2010][2010];
signed main() {
    // cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j) cin >> s[i][j];
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j) {
            mp[i][j] = (s[i][j] == 'B') ^ (s[i + 1][j] == 'B') ^ (s[i][j + 1] == 'B') ^ (s[i + 1][j + 1] == 'B');
        }
    for (int i = 1; i < n; ++i)
        for (int j = 1; j < m; ++j)
            if (mp[i][j] && mp[i][m] && mp[n][j]) {
                adj[i].emplace_back(j + n);
                adj[j + n].emplace_back(i);
            }
    int cnt = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j <= n + m; ++j) used[j] = 0;
        cnt += dfs(i);
    }
    if (cnt & 1) mp[n][m] ^= 1;
    int all = 0;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j) all += mp[i][j];
    cout << all - cnt << '\n';
    return 0;
}
```

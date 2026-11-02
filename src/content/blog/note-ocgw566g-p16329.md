---
title: "P16329 bloom 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p16329"
categories: ["题解"]
tags: ["洛谷", "动态规划", "基础算法", "前缀和"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P16329).
:::

:::info[Solution]{open}
考虑把匹配过程刻画成括号匹配的形式。对血量为 $a_i$ 的一个人而言，类型 $1$ 可以看作是加入 $a_i$ 个左括号 `(`，类型 $0$ 可以看作是加入 $a_i$ 个右括号 `)`。一次碰撞两个人减少相同的血量可以看作是匹配并删除若干个 `()`。因此所有括号匹配完之后剩下的括号序列部分一定是若干个右括号拼接上若干个左括号的形式。也就是说，左边是若干个存活的类型 $0$，右边是若干个存活的类型 $1$ 的形式。

因为一个人不能同时是 $0$ 和 $1$，因此考虑枚举中间的分界点 $L$，此时 $1\sim L$ 部分最终只能剩下右括号，$L+1\sim n$ 部分最终只能剩下左括号。然后两个部分分别算贡献乘起来即可。

然后考虑 dp。设 $f_{i,j,k}$ 表示当前处理了前 $i$ 个人，已经选择的 $a_i$ 的总和为 $j$，并且还剩下 $k$ 点未匹配的类型 $1$ 血量时所有方案的权值的和是多少。设当前人的血量为 $x$，则考虑分类讨论当前人是 $1$ 还是 $0$：

+ 当前人是 $1$，则其会向右移动然后成为新的攻击量，因此 $k\leftarrow k+x$。因为当前这个人不知道最后是否会存活，因此贡献延迟处理暂时先不乘以 $p_i$。
+ 当前人是 $0$，则可以直接确定其的生死态。其会被前面传递过来的攻击量 $k$ 所消耗。如果 $x\le k$ 则她会死亡，更新 $k\leftarrow k-x$。否则她会存活下来，贡献乘以 $p_i$ 然后挡住所有的攻击，因此更新 $k\leftarrow 0$。

因为根据前面的设定，左半部分不能留下 $1$，因此在处理到第 $L$ 个人的时候必须满足 $k=0$，合法的答案就是 $f_{L,j,0}$。记 $\text{Left}_{L,j}=f_{j,0}$ 表示当前部分的答案。

右半部分的 dp 是对称的，从右往左扫描然后维护当前没有匹配的 $0$ 的血量即可。一个特殊的地方是为了避免算重必须保证分界点是唯一的，即需要满足 $L+1$ 是右半部分第一个真正存活的 $1$，特判一下最后一步转移必须满足 $a_{L+1}>k$ 即可。记右侧的答案 $\text{Right}_{i,j}$ 表示后缀 $i\sim n$ 的血量和为 $j$ 而且 $i$ 是第一个存活的 $1$ 的贡献。此时考虑合并 $\text{Left}$ 和 $\text{Right}$ 的 dp 信息来算答案，最终答案就是 $\text{Left}_{n,m}+\sum\limits_{L=0}^{n-1}\sum\limits_{j=0}^m\text{Left}_{L,j}\text{Right}_{L+1,m-j}$。

直接转移时间复杂度为 $O(nm^3)$，考虑优化。观察转移形式可以发现转移形如加一个等腰直角三角形或者对角线的形式，因此对每一层拿二维前缀和或者给每条对角线求一下前缀和优化一下即可将转移优化到 $O(nm^2)$ 的时间复杂度，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, m, a[N], p[N], f[2][N][N], pre[N][N], Left[N][N], Right[N][N];

inline void add(int &x, int v) { x = (x + v) % mod; }

inline void add_(int id, int now) {
    assert(!now || now == 1);
    memset(f[now], 0, sizeof f[now]);
    if (a[id]) {
        for (int j = 0; j <= m - a[id]; ++j)
            for (int k = 0; k <= j; ++k) {
                add(f[now][j + a[id]][k + a[id]], f[!now][j][k]); // 1
                if (a[id] > k) add(f[now][j + a[id]][0], f[!now][j][k] * p[id] % mod); // 0, 血量充裕
                else add(f[now][j + a[id]][k - a[id]], f[!now][j][k]); // 0, 血量不充裕
            }
    } else {
        // 当前人是 1
        memset(pre, 0, sizeof pre);
        for (int j = 1; j <= m; ++j)
            for (int k = 1; k <= j; ++k)
                f[now][j][k] = pre[j][k] = (pre[j - 1][k - 1] + f[!now][j - 1][k - 1]) % mod;
        // 当前人是 0 而且死亡
        memset(pre, 0, sizeof pre);
        for (int j = 1; j <= m; ++j)
            for (int k = j; ~k; --k) {
                if (k < m) pre[j][k] = (pre[j - 1][k + 1] + f[!now][j - 1][k + 1]) % mod;
                f[now][j][k] = (f[now][j][k] + pre[j][k]) % mod;
            }
        // 当前人是 0 并且存活
        int pre = 0;
        for (int j = 1; j <= m; ++j) {
            for (int k = 0; k < j; ++k) pre = (pre + f[!now][j - k - 1][k]) % mod;
            f[now][j][0] = (f[now][j][0] + pre * p[id]) % mod;
        }
    }
}

inline void sol() {
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) cin >> p[i];
    f[0][0][0] = Left[0][0] = 1;
    for (int i = 1; i <= n; ++i) {
        add_(i, i & 1);
        for (int j = 0; j <= m; ++j) Left[i][j] = f[i & 1][j][0];
    } memset(f, 0, sizeof f), f[0][0][0] = 1;
    for (int i = n, I = 1; i; --i, ++I) {
        if (a[i]) {
            for (int j = 0; j <= m - a[i]; ++j)
                for (int k = 0; k <= j && k < a[i]; ++k) add(Right[i][j + a[i]], f[~I & 1][j][k] * p[i] % mod);
        } else {
            int now = 0;
            for (int j = 1; j <= m; ++j) {
                for (int k = 0; k < j; ++k) add(now, f[~I & 1][j - k - 1][k]);
                add(Right[i][j], p[i] * now % mod);
            }
        } add_(i, I & 1);
    } int res = Left[n][m];
    for (int i = 0; i < n; ++i)
        for (int j = 0; j <= m; ++j) add(res, Left[i][j] * Right[i + 1][m - j] % mod);
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：9

[做题记录 5 / 世间所有路都将与你相逢](https://www.luogu.com.cn/article/1azbcr6a)

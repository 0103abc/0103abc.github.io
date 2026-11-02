---
title: "AT_arc165_e [ARC165E] Random Isolation 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-at_arc165_e"
categories: ["题解"]
tags: ["AtCoder", "图论", "树", "数学", "概率与期望", "动态规划"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/AT_arc165_e).
:::

:::info[Solution]{open}
容易发现一个点一定不会被操作多次。因此考虑套路的把题目转化为：

> 随机一个 $1\sim n$ 的排列 $p_1,p_2,\ldots,p_n$，按顺序对每个 $i=1,2,3,\ldots,n$，若当前 $p_i$ 点所在的连通块大小 $>k$ 则在树上删除 $p_i$ 否则不执行任何操作。问期望执行了多少次操作。

注意到每个大小 $>k$ 的连通块只要出现过就一定会贡献一次操作。考虑对一个连通点集 $S$，什么时候 $S$ 这个点集会作为一个完整的连通块给答案制造 $1$ 的贡献。记 $x=|S|$，$y$ 为不在点集 $S$ 中，且存在一个和其相邻的点在 $S$ 点集中的点的数量，则 $S$ 点集会给答案贡献当且仅当排列中这 $y$ 个边界点出现的位置都要比所有 $x$ 个内部点出现的位置靠前。简单计数一下可知概率即为 $\frac{x!y!}{(x+y)!}=\frac1{\binom{x+y}x}$。

因此此时只需要统计有多少个树上连通点集满足其有 $x$ 个内部点和 $y$ 个边界点。这个部分考虑树上 dp，设 $f_{i,x,y}$ 表示在以 $i$ 点为根的子树中，包含 $i$ 点，且有 $x$ 个内部点和 $y$ 个边界点的连通点集的数量是多少。合并其子结点 $j$ 的 dp 信息时需要分类 $j$ 点是否加入点集 $S$ 中分类转移：

+ 若 $j$ 点没有加入点集 $S$ 中，则 $<i,j>$ 边将会作为 $S$ 点集向点集外连出的一条边，$j$ 点就会成为边界点，即连通块的 $y$ 信息自增 $1$。
+ 若 $j$ 点被加入点集 $S$ 中，则直接将两边的 $x,y$ 两个信息相加转移即可。

特殊的，除了根结点以外的每个结点为根的子树信息中，根结点连向其父亲结点的边也是从 $S$ 点集内向点集外连出的一条边，因此其父亲也是连通块边界上的结点，特殊处理一下即可。

用树上背包的时间复杂度分析可知上述算法的时间复杂度为 $O(n^2k^2)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int fac[N], inv[N], ifac[N];

inline void init() {
    fac[0] = inv[0] = ifac[0] = 1;
    fac[1] = inv[1] = ifac[1] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
}

inline int binom(int a, int b) {
    if (b < 0 || a < b) return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}

int n, k;
vector<int> adj[N];

int f[110][110], g[110][110][110], siz[N];

inline void dfs(int u, int fa) {
    g[u][1][0] = siz[u] = 1;
    for (int &v : adj[u]) if (v != fa) {
        dfs(v, u), memset(f, 0, sizeof f);
        for (int i = 1; i <= min(k, siz[u]); ++i)
            for (int j = 0; i + j <= siz[u]; ++j) {
                f[i][j + 1] = (f[i][j + 1] + g[u][i][j]) % mod;
                for (int a = 1; a <= min(k - i, siz[v]); ++a)
                    for (int b = 0; a + b <= siz[v]; ++b)
                        f[i + a][j + b] = (f[i + a][j + b] + g[v][a][b] * g[u][i][j] % mod) % mod;
            }
        siz[u] += siz[v];
        for (int i = 1; i <= min(k, siz[u]); ++i)
            for (int j = 0; i + j <= siz[u]; ++j) g[u][i][j] = f[i][j];
    }
}

inline void sol() {
    cin >> n >> k;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } dfs(1, 0); 
    int res = n;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= min(k, siz[i]); ++j)
            for (int k = 0; j + k <= siz[i]; ++k) {
                int kk = k; if (i != 1) ++kk;
                res = (res + mod - g[i][j][k] * fac[j] % mod * fac[kk] % mod * ifac[j + kk] % mod) % mod;
            }
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：8

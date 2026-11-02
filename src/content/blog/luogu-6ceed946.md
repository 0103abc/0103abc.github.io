---
title: "CF1691F K-Set Tree 题解"
date: "2026-01-30T16:26:19.000Z"
link: "luogu-6ceed946"
categories: ["题解"]
tags: ["Codeforces", "搜索", "深度优先搜索", "数学", "组合数学", "动态规划"]
draft: false
---

难度：$3/10$。

比较无聊的题。先考虑一个比较暴力的做法。枚举根 $R$，然后再枚举点集 $S$ 的 LCA 所在位置 $i$。可以一遍 dfs 求出 $siz_i$ 数组表示 $i$ 点为根的子树，然后直接组合数统计答案。具体的，固定 $R,i$ 后的答案为：

$$
siz_i\left(\binom{siz_i}k-\sum\limits_{j\in\text{son}(i)}\binom{siz_j}k\right)
$$

但是这样做时间复杂度过于爆炸，考虑逐步优化。枚举 $R,i$ 后内层还有一个对所有子节点的求和，考虑将其拆出，即直接一次性单独统计完每个点对答案的贡献。那么可以发现 $i$ 点的贡献可以分成两个部分：

+ 自己直接贡献的部分 $siz_i\binom{siz_i}k$。
+ 被父亲结点减去贡献的部分 $-siz_{\text{fa}(i)}\binom{siz_i}k$，其中 $\text{fa}(i)$ 表示 $i$ 点的父亲结点。

所以答案也可以被表示为（固定 $R$）：

$$
\sum\limits_{i=1}^n\binom{siz_i}k(siz_i-siz_{\text{fa(i)}})
$$

直接枚举 $R$ 可以做到总时间复杂度 $O(n^2)$ 求解，但是这样显然是不行的。容易想到换根 dp 来维护这个东西。先 $O(n)$ 计算出 $R=1$ 时的答案 $res_1$，然后套路的从 $1$ 结点开始 DFS 遍历整棵树，假设当前求出了 $res_u$ 的值，然后现在枚举 $u$ 的儿子结点 $v$ 要求 $res_v$ 的值，计算其相对于 $res_u$ 的变化量。发现上面那个公式用到的量里面显然只有 $siz$ 数组发生了变化。而考虑经典结论，根结点从 $u$ 变为 $v$ 只会修改 $siz_u,siz_v$ 两个位置的值，因此直接对这两个位置分别讨论计算变化的量即可。

预处理阶乘和阶乘逆可以做到 $O(n)$ 解决整个问题。

```cpp line-numbers
namespace Loyalty
{
    vector<int> adj[N];
    int fac[N], inv[N], ifac[N], n, k;
    inline void init()
    {
        for (int i = 0; i < 2; ++i)
            fac[i] = inv[i] = ifac[i] = 1;
        for (int i = 2; i < N; ++i)
        {
            fac[i] = fac[i - 1] * i % mod;
            inv[i] = mod - inv[mod % i] * (mod / i) % mod;
            ifac[i] = ifac[i - 1] * inv[i] % mod;
        }
    }
    inline int binom(int a, int b)
    {
        if (b < 0 || a < b)
            return 0;
        return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
    }

    int presolve[N], siz[N], res[N], up[N];

    inline void dfs(int u, int fa)
    {
        siz[u] = 1, up[u] = fa;
        for (int &v : adj[u])
            if (v != fa)
                dfs(v, u), siz[u] += siz[v];
    }

    inline void dfs2(int u, int fa)
    {
        if (u != 1)
        {
            int term1 = ((n - siz[u]) % mod) * binom(siz[u], k) % mod;                                       // (n-sz)*C(sz,k)
            int term2 = (siz[u] % mod) * binom(n - siz[u], k) % mod;                                         // sz*C(n-sz,k)
            int term3 = ((presolve[fa] - binom(siz[u], k) + mod) % mod) * (siz[u] % mod) % mod;              // (S_fa - C(sz))*sz
            int term4 = ((presolve[u] - binom(n - siz[u], k) + mod) % mod) * ((n - siz[u]) % mod) % mod;     // (S_u - C(n-sz))*(n-sz)
            res[u] = (res[fa] + term1 - term2 + term3 - term4) % mod;
            if (res[u] < 0)
                res[u] += mod;
        }
        for (int &v : adj[u])
            if (v != fa)
                dfs2(v, u);
    }

    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        cin >> n >> k;
        for_each(adj + 1, adj + n + 1, [&](auto &edges) { edges.clear(); });
        for (int i = 1; i < n; ++i)
        {
            int a, b;
            cin >> a >> b;
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
        }
        dfs(1, 0);
        for (int i = 1; i <= n; ++i)
            res[1] = (res[1] + (siz[i] - siz[up[i]]) * binom(siz[i], k) % mod) % mod;
        for (int i = 1; i <= n; ++i)
        {
            presolve[i] = binom(n - siz[i], k);
            for (int &j : adj[i])
                if (j != up[i])
                    presolve[i] = (presolve[i] + binom(siz[j], k)) % mod;
        }
        dfs2(1, 0);
        cout << (accumulate(res + 1, res + n + 1, 0ll) % mod + mod) % mod << '\n';
    }
}
```

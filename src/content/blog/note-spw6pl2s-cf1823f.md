---
title: "CF1823F Random Walk 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf1823f"
categories: ["题解"]
tags: ["Codeforces", "搜索", "深度优先搜索", "动态规划", "图论", "树"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1823F).
:::

:::info[Solution]{open}
十分套路的题目，所以不写太详细了。列出带环的 dp 转移方程之后可以直接 $O(n^3)$ 高消，树上随机游走问题可以套路的把 $f_u$ 通过移项等手法用 $K_uf_{fa_u}+B_u$ 的形式来表示，先一次 DFS 解出 $K_u,B_u$ 的值，然后再一次 DFS 递推出 $f_i$ 的值即可做到 $O(n\log n)$，用一些科技可以做到 $O(n+p^{\frac23})$。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int deg[N], inv[N];
vector<int> adj[N];

inline void init() {
    inv[0] = inv[1] = 1;
    for (int i = 2; i < N; ++i) inv[i] = mod - inv[mod % i] * (mod / i) % mod;
}

int f[N], K[N], B[N], n, s, t;
inline void dfs(int u, int fa) {
    if (u == s) B[u] = 1;
    for (int &v : adj[u]) if (v != fa) {
        dfs(v, u);
        K[u] = (K[u] + K[v] * inv[deg[v]] % mod) % mod;
        B[u] = (B[u] + B[v] * inv[deg[v]] % mod) % mod;
    } K[u] = (1 - K[u] + mod) % mod, K[u] = inversion(K[u]);
    B[u] = B[u] * K[u] % mod, K[u] = K[u] * inv[deg[fa]] % mod;
}

inline void dfs2(int u, int fa) {
    f[u] = (f[fa] * K[u] % mod + B[u]) % mod;
    for (int &v : adj[u]) if (v != fa) dfs2(v, u);
}

inline void sol() {
    cin >> n >> s >> t;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
        ++deg[a], ++deg[b];
    } dfs(t, 0), dfs2(t, 0), f[t] = 1;
    for (int i = 1; i <= n; ++i) cout << f[i] << ' ';
    cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：3

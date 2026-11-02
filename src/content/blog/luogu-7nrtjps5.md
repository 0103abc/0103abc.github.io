---
title: "CF1260F Colored Tree 题解"
date: "2026-05-19T06:20:24.000Z"
link: "luogu-7nrtjps5"
categories: ["题解"]
tags: ["Codeforces", "图论", "树", "扫描线"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/7nrtjps5)。

发现要求的答案就是把所有贡献拆成每一对点 $(x,y)$ 和颜色 $c$ 对答案贡献的和，因此答案就是：

$$
\prod\limits_{i=1}^n(r_i-l_i+1)\sum\limits_{x<y\land c\in[l_x,r_x]\cap[l_y,r_y]}\frac1{r_x-l_x+1}\times\frac1{r_y-l_y+1}\times\text{dist}(x,y)
$$

把 $c$ 从小到大做扫描线，然后套路的拆 $\text{dist}(x,y)=\text{dep}_x+\text{dep}_y-2\text{dep}_{\text{lca}(x,y)}$ 然后分两个部分分别算答案。点 $x$ 能对颜色 $c$ 做贡献当且仅当 $c\in[l_x,r_x]$ 因此可以考虑在 $l_x$ 的开始时刻将 $x$ 加入到贡献点集合里，$r_x$ 的结束时刻将 $x$ 移除贡献点集合。拆 $\text{dist}(x,y)$ 后分别处理式子两个部分的贡献：

$\sum\limits_{x<y}\frac{1}{r_x-l_x+1}\times\frac{1}{r_y-l_y+1}\times(\text{dep}_x+\text{dep}_y)$ 部分可以维护 $S_0=\sum\limits_x\frac1{r_x-l_x+1},S_1=\sum\limits_x\frac1{r_x-l_x+1}\text{dep}_x,S_2=\sum\limits_x\frac1{(r_x-l_x+1)^2}\text{dep}_x$ 则原式的值可以被表示为 $S_0S_1-S_2$。

$\sum\limits_{x<y}\frac1{r_x-l_x+1}\times\frac1{r_y-l_y+1}\times\text{dep}_{\text{lca}(x,y)}$ 部分加入 / 删除一个点 $u$ 时需要知道 $\sum\limits_v\frac1{r_v-l_v+1}\text{dep}_{\text{lca}(v,u)}$ 的值。考虑 P4211 的套路，$\text{dep}_{\text{lca}(v,u)}$ 的意义是 $v,u$ 两点公共祖先数量，因此把 $\text{dep}$ 的贡献拆到 $1$ 到 $\text{lca}(v,u)$ 的路径上，插入 / 删除就是链加链减，查上面式子的值就是链求和，用重剖套 BIT 维护即可做到小常数 $O(n\log^2n)$ 求解。

```cpp line-numbers
inline void init() {
}

struct BIT {
    int tree[N];
    inline BIT() { memset(tree, 0, sizeof tree); }
    inline void clr(int x) { for (; x < N; x += (x &- x)) tree[x] = 0; }
    inline void add(int x, int v) { for (; x < N; x += (x &- x)) tree[x] += v, tree[x] %= mod; }
    inline int qry(int x) { int s = 0; for (; x; x -= (x &- x)) s += tree[x]; return s % mod; }
    inline int qry(int l, int r) { return (qry(r) - qry(l - 1) + mod) % mod; }
};
struct RangeBIT {
    BIT t1, t2;
    inline RangeBIT() { t1 = BIT(), t2 = BIT(); }
    inline void add(int l, int r, int v) {
        t1.add(l, v), t1.add(r + 1, (mod - v) % mod);
        t2.add(l, v * (l - 1) % mod), t2.add(r + 1, (mod - v * r % mod) % mod);
    }
    inline int qry(int x) {
        if (x <= 0) return 0;
        return (t1.qry(x) * x % mod - t2.qry(x) + mod) % mod;
    }
    inline int qry(int l, int r) {
        return (qry(r) - qry(l - 1) + mod) % mod;
    }
} fwt;

int l[N], r[N];
vector<int> adj[N];
vector<int> Ins[N], Rmv[N];
int dep[N], up[N], siz[N], son[N], dfn[N], bk[N], top[N], idx;
inline void dfs(int u, int fa) {
    dep[u] = dep[fa] + 1, up[u] = fa, siz[u] = 1;
    for (int &v : adj[u]) if (v != fa) {
        dfs(v, u), siz[u] += siz[v];
        if (siz[son[u]] < siz[v]) son[u] = v;
    }
}
inline void dfs2(int u, int Top, int fa) {
    dfn[u] = ++idx, bk[idx] = u, top[u] = Top;
    if (son[u]) dfs2(son[u], Top, u);
    for (int &v : adj[u]) if (v != fa && v != son[u]) dfs2(v, v, u);
}
inline void mdflnk(int x, int val) {
    while (x) {
        fwt.add(dfn[top[x]], dfn[x], val);
        x = up[top[x]];
    }
}
inline int qrylnk(int x) {
    int res = 0;
    while (x) {
        res = (res + fwt.qry(dfn[top[x]], dfn[x]));
        x = up[top[x]];
    } return res;
}
int w[N];
inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) {
        cin >> l[i] >> r[i];
        w[i] = inversion(r[i] - l[i] + 1);
        Ins[l[i]].emplace_back(i);
        Rmv[r[i]].emplace_back(i);
    }
    for (int i = 1; i < n; ++i) {
        int u, v; cin >> u >> v;
        adj[u].emplace_back(v), adj[v].emplace_back(u);
    } dfs(1, 0), dfs2(1, 1, 0);
    int res = 0, B = 0, S0 = 0, S1 = 0, S2 = 0;
    for (int i = 1; i <= 100000; ++i) {
        for (int &j : Ins[i]) {
            S0 = (S0 + w[j]) % mod, S1 = (S1 + w[j] * dep[j] % mod) % mod, S2 = (S2 + w[j] * w[j] % mod * dep[j] % mod) % mod;
            B = (B + w[j] * qrylnk(j) % mod) % mod, mdflnk(j, w[j]);
        } res = (res + S0 * S1 % mod - S2 - 2 * B % mod + mod + mod) % mod;
        for (int &j : Rmv[i]) {
            S0 = (S0 - w[j] + mod) % mod, S1 = (S1 - w[j] * dep[j] % mod + mod) % mod, S2 = (S2 - w[j] * w[j] % mod * dep[j] % mod + mod) % mod;
            mdflnk(j, (mod - w[j]) % mod), B = (B - w[j] * qrylnk(j) % mod + mod) % mod;
        }
    } for (int i = 1; i <= n; ++i) res = res * (r[i] - l[i] + 1) % mod;
    cout << res << '\n';
}
```

---
title: "P3345 [ZJOI2015] 幻想乡战略游戏 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p3345"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "数学", "组合数学"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P3345).
:::

:::info[Solution]{open}
题目等价于多次单点修改 $a_i$ 的值，每次修改完成后找出树上的带权重心 $c$ 并求出 $\sum\limits_{i=1}^na_i\operatorname{dist}(c,i)$ 的值。

直接做肯定没法做。注意到题目保证了每个点的度数不超过 $\red{\boldsymbol{20}}$，因此考虑利用这个性质。先考虑调整法，设当前位置是 $v$，准备移动到相邻结点 $u$，两点之间的边权为 $L$。删除这条边后设 $v$ 点一侧的 $a_i$ 和为 $S$，整个树中 $a_i$ 的和为 $W$，则记 $F(c)=\sum\limits_{i=1}^na_i\operatorname{dist}(c,i)$，则 $F(v)-F(u)=L(W-2S)$。因此若 $2S>W$ 则从 $v$ 移动到 $u$ 一定更优。

进一步调整可得，若删除一个点后，其分出的所有子树所有 $a_i$ 元素的和均不超过 $\frac W2$，则这个点就一定是带权重心之一，且带权重心的数量不会超过 $2$ 个。

套路的建立点分树。对每个原树结点 $x$，存储其在点分树上对应点的所有祖先，以及其到其所有祖先的距离。对每个点分树结点 $c$ 维护下面列信息：

+ $cnt_c$：点分树中 $c$ 点为根的子树内 $a_i$ 的和是多少。
+ $sd_c$：点分树中 $c$ 点为根子树内所有元素 $i$ 的 $a_i\operatorname{dist}(i,c)$ 的和。
+ $cd_v$：记 $v$ 在点分树中是 $c$ 点的儿子结点，则其维护的信息就是点分树中 $v$ 点位根子树内所有元素 $i$ 的 $a_i\operatorname{dist}(i,c)$ 的和。

因为点分树树高是 $O(\log n)$ 级别的，所以每次修改直接暴力沿着点分树上其到根结点路径更新 $cnt,sd,cd$ 三个数组的信息即可。

考虑如何对每个点 $x$ 快速求出 $F(x)$ 的值。对其的某个点分树上的祖先结点 $c$ 而言，其对答案的贡献就是 $sd_c+cnt_c\operatorname{dist}(x,c)$。但是 $c$ 点子树内在 $x$ 点到 $c$ 点路径上的 $c$ 点子结点 $v$ 到 $x$ 的简单路径是不经过 $c$ 点的，因此还需要容斥掉这部分贡献，即还需要减去 $cd_v+cnt_v\operatorname{dist}(x,c)$ 就可以求出 $F(x)$ 的值。

最后考虑在点分树上找出一个带权重心。若某个点分树上的结点 $v$ 满足 $2cnt_v>W$，则答案一定在 $v$ 结点为根的点分树子树对应的原树结点组成的集合中。但是此时还需要考虑 $v$ 点为根子树以外的结点的贡献。记 $g_v$ 表示从点分树上某个点 $u$ 走到其儿子结点 $v$ 所在原树连通块中的第一个原树结点，块外的元素和就是 $W-cnt_v$。对判断当前连通块元素和而言，可以把所有块外的 $a_i$ 信息看作临时放在 $cnt_v$ 上。因此临时沿 $g_v$ 的点分树祖先链加上 $W-cnt_v$ 然后在点分树上继续递归找带权重心，找到答案后再撤销所有对 $g_v$ 做的修改即可。

总时间复杂度为 $O(n\log^2n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

char s[N];

vector<int> son[N];
vector<pair<int, int>> adj[N], up[N];
int used[N], siz[N], best, cen, g[N], dep[N], rt;
inline void getsiz(int u, int fa) {
    siz[u] = 1;
    for (auto &[v, w] : adj[u])
        if (v != fa && !used[v]) getsiz(v, u), siz[u] += siz[v];
}

inline void getcen(int u, int fa, int tot) {
    int mx = tot - siz[u];
    for (auto &[v, w] : adj[u]) if (v != fa && !used[v])
        getcen(v, u, tot), mx = max(mx, siz[v]); 
    if (mx < best) best = mx, cen = u;
}

inline void get(int u, int fa, int d, int c) {
    up[u].emplace_back(c, d);
    for (auto &[v, w] : adj[u]) 
        if (!used[v] && v != fa) get(v, u, d + w, c);
}

inline void build(int u, int fa, int ent) {
    best = inf, getsiz(u, 0), getcen(u, 0, siz[u]);
    dep[cen] = dep[fa] + 1, g[cen] = ent;
    if (fa) son[fa].emplace_back(cen);
    else rt = cen;
    used[cen] = 1, get(cen, 0, 0, cen);
    int c = cen;
    for (auto &[v, w] : adj[c])
        if (!used[v]) build(v, c, v);
}

int tot, cnt[N], sd[N], cd[N];

inline void mdf(int x, int v) {
    tot += v;
    for (int i = 0; i < up[x].size(); ++i) {
        auto [c, d] = up[x][i];
        cnt[c] += v, sd[c] += v * d;
        if (i + 1 < up[x].size()) cd[up[x][i + 1].first] += v * d;
    }
}

inline int find() {
    vector<pair<int, int>> chg;
    int u = rt;
    while (1) {
        int v = 0;
        for (int &x : son[u])
            if (cnt[x] * 2 > tot) { v = x; break; }
        if (!v) break;
        int add = tot - cnt[v];
        for (int i = dep[u] + 1; i < up[g[v]].size(); ++i) {
            cnt[up[g[v]][i].first] += add;
            chg.emplace_back(up[g[v]][i].first, add);
        } u = v;
    }
    for (auto &[c, v] : chg) cnt[c] -= v;
    return u;
}

inline int qry(int x) {
    int res = 0;
    for (int i = 0; i < up[x].size(); ++i) {
        auto [c, d] = up[x][i];
        res += sd[c] + cnt[c] * d;
        if (i + 1 < up[x].size()) res -= cd[up[x][i + 1].first] + cnt[up[x][i + 1].first] * d;
    } return res;
}

inline void sol() {
    int n, q; cin >> n >> q;
    for (int i = 1; i < n; ++i) {
        int a, b, c; cin >> a >> b >> c;
        adj[a].emplace_back(b, c), adj[b].emplace_back(a, c);
    } build(1, 0, 0);
    while (q--) {
        int u, e; cin >> u >> e;
        mdf(u, e), cout << qry(find()) << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：4

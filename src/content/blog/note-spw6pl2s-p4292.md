---
title: "P4292 [WC2010] 重建计划 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p4292"
categories: ["题解"]
tags: ["洛谷", "算法思想", "分治", "基础算法", "二分", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P4292).
:::

:::info[Solution]{open}
考虑先二分答案 $x$，判定是否存在长度在 $[L,U]$ 之间的路径满足将每条边的边权都从 $w$ 修改为 $w-x$ 后，路径的权值和非负。容易证明上述判定信息满足单调性。

然后问题变为树上路径问题，容易想到点分治处理。记当前的分治中心为 $c$，则以 $c$ 为根结点，对所有过点 $c$ 的路径分类讨论：

+ 路径至少一个端点为 $c$。
+ 路径的两个端点分别为 $c$ 的两个不同子树内的两个结点。

考虑 dp 来算贡献。记 $f_i$ 表示以 $i$ 为根的子树，从当前分治中心 $c$ 点出发，深度为 $i$ 的最大**原始**权值和；$g_i$ 表示在**之前所有已经通过记过的儿子子树中**，深度为 $i$ 的最大**新**权值和。

对当前子树中深度为 $d$ 的一条路径而言，需要在此基础上再次拼接一条长度为 $t$ 的路径满足 $L\le d+t\le R$ 即 $t\in[L-d,R-d]$。若区间内最大的 $g_t$ 满足 $f_d-dx+mx_t\ge 0$，则必然存在至少一条合法路径。

考虑从大到小枚举所有 $d$，则此时在 $g$ 数组上查询最值的区间 $[\max(1,L-d),U-d]$ 单调向右移动，因此可以使用单调队列来维护单调区间最值。

一些实现上的细节是对当前的分治中心 $c$ 点而言，其各个儿子子树必须按照其最大深度从小到大处理，否则时间复杂度会退化成平方 $\log$。

总时间复杂度为 $O(n\log^2n)$（这里偷懒认为 $n,V$ 同阶），可以通过该题。
:::

:::success[Code]

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, L, U;

vector<pair<int, int>> adj[N];
int siz[N], used[N], best, rt, up[N], bel[N], q[N];
double g[N];

inline void getsiz(int u, int fa) {
    siz[u] = 1;
    for (auto &[v, w] : adj[u])
        if (v != fa && !used[v]) getsiz(v, u), siz[u] += siz[v];
}

inline void getcen(int u, int fa, int tot) {
    int mx = tot - siz[u];
    for (auto &[v, w] : adj[u]) if (v != fa && !used[v]) getcen(v, u, tot), mx = max(mx, siz[v]);
    if (mx < best) best = mx, rt = u;
}

vector<vector<vector<int>>> F;

inline void getval(int u, int fa, int i, int s, vector<int> &f) {
    if (i > U) return;
    if (f.size() <= i) f.resize(i + 1, -inf);
    f[i] = max(f[i], s);
    for (auto &[v, w] : adj[u])
        if (v != fa && !used[v]) getval(v, u, i + 1, s + w, f);
}

inline void dfs(int x) {
    getsiz(x, 0), best = inf, getcen(x, 0, siz[x]);
    used[rt] = 1;
    vector<vector<int>> a;
    for (auto &[v, w] : adj[rt]) if (!used[v]) {
        vector<int> f(1);
        getval(v, rt, 1, w, f);
        a.emplace_back(f);
    } sort(a.begin(), a.end(), [&](auto &l, auto &r) {
        return l.size() < r.size();
    });
    F.emplace_back(a);
    for (auto &[v, w] : adj[rt]) if (!used[v]) dfs(v);
}

inline int chk(double x) {
    for (auto &a : F) if (a.size()) {
        int lim = a.back().size() - 1;
        fill(g, g + lim + 1, -inf), g[0] = 0;
        int pre = 0;
        for (auto &f : a) {
            int pos = -1, head = 0, tail = 0;
            for (int i = f.size() - 1; i; --i) {
                double w = f[i] - x * i;
                int l = max<int>(0, L - i), r = min(pre, U - i);
                while (pos < r) {
                    ++pos;
                    while (head < tail && g[q[tail - 1]] <= g[pos]) --tail;
                    q[tail++] = pos;
                } while (head < tail && q[head] < l) ++head;
                if (l <= r && head < tail && w + g[q[head]] >= 0) return 1;
            } for (int i = 1; i <= f.size() - 1; ++i) g[i] = max(g[i], f[i] - x * i);
            pre = max<int>(pre, f.size() - 1);
        }
    } return 0;
}

inline void sol() {
    cin >> n >> L >> U;
    for (int i = 1; i < n; ++i) {
        int a, b, c; cin >> a >> b >> c;
        adj[a].emplace_back(b, c), adj[b].emplace_back(a, c);
    } double l = 0, r = 1e9; dfs(1);
    for (int $ = 0; $ < 50; ++$) {
        double mid = (l + r) / 2;
        chk(mid) ? (l = mid) : (r = mid);
    } cout << r << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：6

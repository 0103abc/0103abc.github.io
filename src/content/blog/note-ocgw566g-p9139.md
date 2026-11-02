---
title: "P9139 [THUPC 2023 初赛] 喵了个喵 II 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p9139"
categories: ["题解"]
tags: ["洛谷", "图论", "树"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P9139).
:::

:::info[Solution]{open}
考虑对一个值 $v$，其四次出现的位置分别是 $p_0,p_1,p_2,p_3$。则合法的划分方式只有 $(0,1),(2,3)$，$(0,2),(1,3)$，$(0,3),(1,2)$ 三种。但是 3-Sat 问题是 NP-Hard 的，因此考虑进一步挖掘性质。考虑把每一对位置 $(x,y)$ 看作是一个区间 $[x,y]$（$x<y$），则若存在两个区间 $[x_1,y_1]$，$[x_2,y_2]$ 满足 $x_1<x_2<y_2<y_1$，则两个子序列显然不会完全相等。而此时 $(0,3),(1,2)$ 这种分组方式满足 $0<1<2<3$ 两个区间存在交集，因此可以直接删掉。剩下的两组划分方式只需要注意不要出现上面的情况，枚举两个区间然后建图跑 2-Sat 即可。

但是上述做法图的边数是 $O(n^2)$ 级别的显然没法建出来。注意到图的边形态形如在线的二维偏序关系，因此考虑用主席树优化建图，边的数量降低到 $O(n\log n)$ 级别，可以通过该题。

有不需要主席树的高妙线性空间做法，但是我不会 K 开头神秘算法/ng
:::

:::success[Code]
小心爆空间。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

stack<int> stk;
vector<int> adj[N];
int n, res[N], idx_, idx__;
int tot, dfn[N], low[N], idx, ins[N], bel[N];
int pos[50005][4], pc[50005], ans[N];
int root[N], ls[N], rs[N], in[N], out[N];
struct Info { int id, l, r; } a[N];

inline void ae(int u, int v) { adj[u].emplace_back(v); }

inline void lnk(int u) {
    if (ls[u]) ae(in[u], in[ls[u]]), ae(out[ls[u]], out[u]);
    if (rs[u]) ae(in[u], in[rs[u]]), ae(out[rs[u]], out[u]);
}

inline int mdf(int las, int l, int r, int p, int w) {
    int u = ++idx_;
    ls[u] = ls[las], rs[u] = rs[las];
    in[u] = idx__++, out[u] = idx__++;
    if (l == r) {
        if (las) ae(in[u], in[las]), ae(out[las], out[u]);
        ae(in[u], w), ae(w ^ 1, out[u]);
        return u;
    } int mid = l + r >> 1;
    if (p <= mid) ls[u] = mdf(ls[las], l, mid, p, w);
    else rs[u] = mdf(rs[las], mid + 1, r, p, w);
    lnk(u);
    return u;
}

inline void qry(int rt, int l, int r, int ll, int rr, int w) {
    if (!rt || rr < l || r < ll) return;
    if (ll <= l && r <= rr) {
        ae(w, in[rt]), ae(out[rt], w ^ 1);
        return;
    } int mid = l + r >> 1;
    qry(ls[rt], l, mid, ll, rr, w);
    qry(rs[rt], mid + 1, r, ll, rr, w);
}

inline void dfs(int u) {
    dfn[u] = low[u] = ++idx;
    ins[u] = 1, stk.emplace(u);
    for (int &v : adj[u])
        if (!dfn[v]) dfs(v), low[u] = min(low[u], low[v]);
        else if (ins[v]) low[u] = min(low[u], dfn[v]);
    if (dfn[u] == low[u]) { ++tot;
        while (stk.top() != u) {
            int t = stk.top(); stk.pop();
            ins[t] = 0, bel[t] = tot;
        } int t = stk.top(); stk.pop();
        ins[t] = 0, bel[t] = tot;
    }
}

inline void sol() {
    cin >> n, idx__ = n + n;
    for (int i = 1, x; i <= n * 4; ++i) cin >> x, pos[x][pc[x]++] = i;
    for (int i = 1; i <= n; ++i) {
        int x = 2 * (i - 1), y = x ^ 1;
        a[4 * i - 3] = {x, pos[i][0], pos[i][1]};
        a[4 * i - 2] = {x, pos[i][2], pos[i][3]};
        a[4 * i - 1] = {y, pos[i][0], pos[i][2]};
        a[4 * i] = {y, pos[i][1], pos[i][3]};
    }
    sort(a + 1, a + n * 4 + 1, [&](auto &l, auto &r) { return l.l < r.l || l.l == r.l && l.r > r.r; });
    for (int i = 1; i <= n * 4; ++i) {
        qry(root[i - 1], 1, n * 4, a[i].r, n * 4, a[i].id);
        root[i] = mdf(root[i - 1], 1, n * 4, a[i].r, a[i].id ^ 1);
    }
    for (int i = 0; i < idx__; ++i)
        if (!dfn[i]) dfs(i);
    for (int i = 1; i <= n; ++i) {
        int x = 2 * (i - 1), y = x ^ 1;
        if (bel[x] == bel[y]) { cout << "No\n"; return; }
        if (bel[x] < bel[y]) res[pos[i][0]] = res[pos[i][2]] = 0, res[pos[i][1]] = res[pos[i][3]] = 1;
        else res[pos[i][0]] = res[pos[i][1]] = 0, res[pos[i][2]] = res[pos[i][3]] = 1;
    } cout << "Yes\n";
    for (int i = 1; i <= n * 4; ++i) cout << res[i];
    cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：7

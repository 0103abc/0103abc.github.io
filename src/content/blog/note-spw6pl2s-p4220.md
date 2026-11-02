---
title: "P4220 [WC2018] 通道 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p4220"
categories: ["题解"]
tags: ["洛谷", "算法思想", "分治", "图论", "树", "搜索", "深度优先搜索"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P4220).
:::

:::info[Solution]{open}
考虑将 $T_1$ 三度化后做边分治。记当前的分治边是 $(x,y,w)$，则删除该边后可得到两个连通块 $L,R$。两端都在 $L,R$ 连通块内部的部分可以直接递归处理，因此只需要考虑 $u,v$ 分别在 $L,R$ 两个连通块内的情况。此时 $u,v$ 两个点之间的简单路径必然经过 $(x,y,w)$ 这条边，因此有 $dis_1(u,v)=dis_1(u,x)+dis_1(v,y)+w$。记 $f(u)$ 的值为；

+ $u\in L$：$f(u)=dis_1(u,x)+dep_2(u)$
+ $u\in R$：$f(u)=dis_1(u,y)+w+dep_2(u)$

其中 $dep_2(u)$ 表示 $u$ 点在第二个树上的深度。

此时对二元组 $(u,v)$ 而言，其对答案的贡献就可以被表示为：$f(u)+f(v)+dis_3(u,v)-2dep_2(\operatorname{lca}_2(u,v))$。

然后考虑把 $L,R$ 集合中的所有点对应到第二个树上建虚树，然后套路的在 $\operatorname{lca}$ 位置统计贡献。在虚树结点 $z$ 处把当前已经合并的部分和某个儿子结点为根的子树合并时，这两个集合之间任意点对在第二个树上的 LCA 都恰好为 $z$。因此此时只需要对固定的 $z$，找出两个不属于同一集合的点 $u,v$ 求出 $f(u)+f(v)+dis_3(u,v)$ 的最大值，然后再减去定值 $2dep_2(z)$ 即可。

算 $dis_3(u,v)$ 是简单的。考虑在边分治的过程中对每个集合维护出任意一条直径的两个端点，然后处理完两个集合 $L,R$ 后把两个集合对应的直径直接利用经典结论分四类讨论合并即可。$dis_3(u,v)$ 的最大值即可在这个过程中 $O(1)$ 求出。求树上两点距离是十分简单的，这里不再赘述。

使用 DFS 序可以做到 $O(n\log n)-O(1)$ 求静态 LCA，因此总时间复杂度是 $O(n\log^2n)$ 的，可以通过该题。

点分治也是可以做的，选出重心作为分治中心后把所有子树从小到大排序然后用堆维护每个处理区域的大小，每次从堆中找出大小最小的两个部分然后用和边分治相似的做法合并即可。证明时间复杂度正确的方法和启发式合并相似。
:::

:::success[代码]
~~特别短。~~

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<pair<int, int>> adj[N], adj2[N], adj3[N];
vector<tuple<int, int, int>> adj1[N]; // (v, w, id)

int tot, eidx;
inline void ae(int u, int v, int w) {
    ++eidx;
    adj1[u].emplace_back(v, w, eidx);
    adj1[v].emplace_back(u, w, eidx);
}

// 将 adj 三度化到 adj1 中
int las[N];
inline void build(int u, int fa) {
    for (auto &[v, w] : adj[u]) if (v != fa) {
        ae(las[u], ++tot, 0), ae(tot, v, w);
        las[u] = tot, build(v, u);
    }
}

int lg[N], dfn[N], siz[N], timestamp, dep[N], st[20][N], dis_[N];
inline void dfs2(int u, int fa) {
    dfn[u] = ++timestamp, st[0][dfn[u]] = fa, dep[u] = dep[fa] + 1;
    for (auto &[v, w] : adj2[u]) if (v != fa) dis_[v] = dis_[u] + w, dfs2(v, u);
}

inline int get(int a, int b) {
    return dfn[a] < dfn[b] ? a : b;
}

inline int lca(int a, int b) {
    if (a == b) return a;
    a = dfn[a], b = dfn[b];
    if (a > b) swap(a, b);
    int lgx = lg[b - a++];
    return get(st[lgx][a], st[lgx][b - (1 << lgx) + 1]);
}

inline int dist(int a, int b) {
    return dep[a] + dep[b] - 2 * dep[lca(a, b)];
}

inline int distw(int a, int b) {
    return dis_[a] + dis_[b] - 2 * dis_[lca(a, b)];
}

inline int ancestor(int u, int v) {
    return dfn[u] <= dfn[v] && dfn[v] <= dfn[u] + siz[u] - 1;
}

int dfn3[N], siz3[N], timestamp3, dep3[N], st3[20][N], dis3[N];
inline void dfs3(int u, int fa) {
    dfn3[u] = ++timestamp3, st3[0][dfn3[u]] = fa, dep3[u] = dep3[fa] + 1;
    for (auto &[v, w] : adj3[u]) if (v != fa) dis3[v] = dis3[u] + w, dfs3(v, u);
}

inline int get3(int a, int b) {
    return dfn3[a] < dfn3[b] ? a : b;
}

inline int lca3(int a, int b) {
    if (a == b) return a;
    a = dfn3[a], b = dfn3[b];
    if (a > b) swap(a, b);
    int lgx = lg[b - a++];
    return get3(st3[lgx][a], st3[lgx][b - (1 << lgx) + 1]);
}

inline int dist3(int a, int b) {
    return dep3[a] + dep3[b] - 2 * dep3[lca3(a, b)];
}

inline int distw3(int a, int b) {
    return dis3[a] + dis3[b] - 2 * dis3[lca3(a, b)];
}

inline int ancestor3(int u, int v) {
    return dfn3[u] <= dfn3[v] && dfn3[v] <= dfn3[u] + siz3[u] - 1;
}

int best, eid, ew, px, py, sizz[N], used[N];

inline void getcen(int u, int fa, int all) {
    sizz[u] = 1;
    for (auto &[v, w, id] : adj1[u])
        if (v != fa && !used[id]) {
            getcen(v, u, all), sizz[u] += sizz[v];
            int now = max(sizz[v], all - sizz[v]);
            if (now < best) best = now, px = v, py = u, eid = id, ew = w;
        }
}

inline void getsiz(int u, int fa) {
    siz[u] = 1;
    for (auto &[v, w, id] : adj1[u])
        if (v != fa && !used[id]) getsiz(v, u), siz[u] += siz[v];
}

int col[N], n, val[N];

inline void get(int u, int fa, int d, int c, vector<int> &a) {
    if (u <= n) col[u] = c, val[u] = d + dis_[u], a.emplace_back(u);
    for (auto &[v, w, id] : adj1[u]) if (v != fa && !used[id]) get(v, u, d + w, c, a);
}

int b[N], res;
vector<int> adj4[N];

struct diam { int x = 0, y = 0; };
struct pir { diam d[2]; };
inline int dis(int u, int v) {
    if (!u || !v) return -inf;
    if (u == v) return 0;
    return val[u] + val[v] + distw3(u, v);
}
inline diam merge(diam a, diam b) {
    if (!a.x) return b;
    if (!b.x) return a;
    diam res = a;
    int best = dis(a.x, a.y);
    function<void(int, int)> upd = [&](int x, int y) {
        int now = dis(x, y);
        if (now > best) best = now, res = {x, y};
    };
    upd(a.x, b.x), upd(a.x, b.y);
    upd(a.y, b.x), upd(a.y, b.y);
    upd(b.x, b.y);
    return res;
}

inline int cross(diam a, diam b) {
    if (!a.x || !b.x) return -inf;
    return max({dis(a.x, b.x), dis(a.x, b.y), dis(a.y, b.x), dis(a.y, b.y)});
}

inline pir dfsvt(int u) {
    pir s;
    if (col[u]) s.d[col[u] - 1] = {u, u};
    for (int &v : adj4[u]) {
        pir q = dfsvt(v);
        int now = max(cross(s.d[0], q.d[1]), cross(s.d[1], q.d[0]));
        if (now > -inf / 2) res = max(res, now - 2 * dis_[u]);
        s.d[0] = merge(s.d[0], q.d[0]), s.d[1] = merge(s.d[1], q.d[1]);
    } return s;
}

inline void getvir(vector<int> &a) {
    sort(a.begin(), a.end(), [&](auto &l, auto &r) { return dfn[l] < dfn[r]; });
    int idx = 0;
    for (int i = 0; i + 1 < a.size(); ++i) b[++idx] = a[i], b[++idx] = lca(a[i], a[i + 1]);
    b[++idx] = a.back();
    sort(b + 1, b + idx + 1, [&](auto &l, auto &r) { return dfn[l] < dfn[r]; });
    idx = unique(b + 1, b + idx + 1) - b - 1;
    for (int i = 1; i <= idx; ++i) adj4[b[i]].clear();
    for (int i = 1; i < idx; ++i) adj4[lca(b[i], b[i + 1])].emplace_back(b[i + 1]);
    dfsvt(b[1]);
}

inline void dfs(int u) {
    best = inf, getsiz(u, 0), getcen(u, 0, siz[u]);
    vector<int> a;
    used[eid] = 1;
    get(px, 0, 0, 1, a);
    int mid = a.size();
    get(py, 0, ew, 2, a);
    if (mid && mid < a.size()) {
        // 处理跨分治边的情况
        getvir(a);
    }
    for (int &i : a) col[i] = 0;
    int x = px, y = py, lsz = sizz[x], rsz = sizz[u] - lsz;
    if (lsz > 1) dfs(x);
    if (rsz > 1) dfs(y);
}


inline void sol() {
    cin >> n;
    lg[0] = -1;
    for (int i = 1; i <= n; ++i) lg[i] = lg[i >> 1] + 1;
    for (int i = 1; i < n; ++i) {
        int a, b, c; cin >> a >> b >> c;
        adj[a].emplace_back(b, c), adj[b].emplace_back(a, c);
    }
    for (int i = 1; i < n; ++i) {
        int a, b, c; cin >> a >> b >> c;
        adj2[a].emplace_back(b, c), adj2[b].emplace_back(a, c);
    }
    for (int i = 1; i < n; ++i) {
        int a, b, c; cin >> a >> b >> c;
        adj3[a].emplace_back(b, c), adj3[b].emplace_back(a, c);
    }
    if (n == 1) { cout << 0 << '\n'; return; }
    dfs2(1, 0), dfs3(1, 0);
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j + (1 << i) - 1 <= n; ++j) {
            st[i][j] = get(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);
            st3[i][j] = get3(st3[i - 1][j], st3[i - 1][j + (1 << (i - 1))]);
        }
    iota(las + 1, las + n + 1, 1), tot = n;
    build(1, 0);
    dfs(1);
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：5

---
title: "CF1957F2 Frequency Mismatch (Hard Version) 题解"
date: "2026-08-11T09:27:29Z"
link: "note-he8i0q35-cf1957f2"
categories: ["题解"]
tags: ["Codeforces", "图论", "树", "数据结构", "线段树", "基础算法", "二分"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1957F2).
:::

:::info[Solution]{open}
随机赋权哈希，然后在树上建可持久化线段树，在线段树上继续二分找 XOR hash 的不同点，好像做完了？
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
int a[N], root[N], col[N], st[N][20], idx, dep[N], siz[N];
inline void dfs(int u, int fa) {
    st[u][0] = fa, siz[u] = 1, dep[u] = dep[fa] + 1;
    for (int &v : adj[u]) if (v != fa) dfs(v, u), siz[u] += siz[v];
}
inline int lca(int a, int b) {
    if (dep[a] < dep[b]) swap(a, b);
    for (int i = 19; ~i; --i) if (dep[a] - dep[b] >> i & 1) a = st[a][i];
    if (a == b) return a;
    for (int i = 19; ~i; --i) if (st[a][i] != st[b][i]) a = st[a][i], b = st[b][i];
    return st[a][0];
}
inline int dist(int a, int b) { return dep[a] + dep[b] - 2 * dep[lca(a, b)]; }
struct Node { int l, r; u64 cnt; inline Node() { l = r = cnt = 0; } } tree[N << 6];
inline int mdf(int l, int r, int rt, int val) {
    tree[++idx] = tree[rt], tree[idx].cnt += val;
    if (l == r) return idx;
    int mid = l + r >> 1, ii = idx;
    if (val <= mid) tree[ii].l = mdf(l, mid, tree[rt].l, val);
    else tree[ii].r = mdf(mid + 1, r, tree[rt].r, val);
    return ii;
}
inline void dfs2(int u, int fa) {
    for (int &v : adj[u]) if (v != fa) root[v] = mdf(1, inf, root[u], col[v]), dfs2(v, u);
}
inline void qry(int l, int r, int x1, int x2, int x3, int x4, int y1, int y2, int y3, int y4, int k, vector<int> &res){
    if (l == r) {
        if (res.size() < k) res.emplace_back(l);
        return;
    }
    int mid = l + r >> 1;
    int v1 = tree[tree[x1].l].cnt + tree[tree[x2].l].cnt - tree[tree[x3].l].cnt - tree[tree[x4].l].cnt;
    int v2 = tree[tree[y1].l].cnt + tree[tree[y2].l].cnt - tree[tree[y3].l].cnt - tree[tree[y4].l].cnt;
    if (v1 != v2) qry(l, mid, tree[x1].l, tree[x2].l, tree[x3].l, tree[x4].l, tree[y1].l, tree[y2].l, tree[y3].l, tree[y4].l, k, res);
    if (res.size() >= k) return;
    v1 = tree[tree[x1].r].cnt + tree[tree[x2].r].cnt - tree[tree[x3].r].cnt - tree[tree[x4].r].cnt;
    v2 = tree[tree[y1].r].cnt + tree[tree[y2].r].cnt - tree[tree[y3].r].cnt - tree[tree[y4].r].cnt;
    if (v1 != v2) qry(mid + 1, r, tree[x1].r, tree[x2].r, tree[x3].r, tree[x4].r, tree[y1].r, tree[y2].r, tree[y3].r, tree[y4].r, k, res);
}

inline void sol([[maybe_unused]]int __testcase_id) {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } map<int, int> mp, e;
    mt19937 mt(time(0));
    uniform_int_distribution<int> dist(1, inf);
    for (int i = 1; i <= n; ++i) {
        if (!mp.count(a[i])) mp[a[i]] = dist(mt);
        col[i] = mp[a[i]], e[mp[a[i]]] = a[i];
    } int q; cin >> q;
    root[1] = mdf(1, inf, root[0], col[1]);
    dfs(1, 0), dfs2(1, 0);
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= n; ++j) st[j][i] = st[st[j][i - 1]][i - 1];
    while (q--) {
        int u1, v1, u2, v2, k; cin >> u1 >> v1 >> u2 >> v2 >> k;
        int l1 = lca(u1, v1), l2 = lca(u2, v2);
        vector<int> res;
        qry(1, inf, root[u1], root[v1], root[l1], root[st[l1][0]], root[u2], root[v2], root[l2], root[st[l2][0]], k, res);
        cout << res.size() << ' '; for (int &i : res) cout << e[i] << ' '; cout << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：1

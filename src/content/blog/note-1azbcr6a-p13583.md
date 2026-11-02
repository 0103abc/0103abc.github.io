---
title: "P13583 [NWRRC 2023] Colorful Village 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p13583"
categories: ["题解"]
tags: ["洛谷", "图论", "2-SAT"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P13583)
:::

:::info[Solution]{open}
考虑到颜色为 $1$ 的两个点中必选其中一个，设这个点为 $u$，则考虑以 $u$ 点为根做图论建模跑 2-Sat。具体的，记 $fa_i$ 表示以 $u$ 点为根时 $i$ 点的父亲结点是什么，则因为根结点必选所以如果父亲结点没有选则儿子结点必须不选，如果儿子结点选了那么父亲结点必须不选。然后再考虑同色的关系，设两个同色的位置是 $i,j$，则此时若 $i$ 选了则 $j$ 必须不选，$j$ 选了则 $i$ 必须不选，反之同理。

一个特殊的地方是根结点必须选，所以需要从 $u'$ 向 $u$ 连一条边。

直接做时间复杂度为 $O(n)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

stack<int> stk;
vector<int> adj[N], col[N], adj_[N];
int n, a[N], dfn[N], low[N], bel[N], idx, tot, ins[N];

inline void dfs(int u) {
    dfn[u] = low[u] = ++idx;
    ins[u] = 1, stk.emplace(u);
    for (int &v : adj_[u]) {
        if (!dfn[v]) dfs(v), low[u] = min(low[u], low[v]);
        else if (ins[v]) low[u] = min(low[u], dfn[v]);
    } if (dfn[u] == low[u]) { ++tot;
        while (stk.top() != u) {
            int t = stk.top(); stk.pop();
            ins[t] = 0, bel[t] = tot;
        } int t = stk.top(); stk.pop();
        ins[t] = 0, bel[t] = tot;
    }
}

inline void dfs(int u, int fa) {
    if (fa) adj_[u].emplace_back(fa), adj_[fa + (n << 1)].emplace_back(u + (n << 1));
    for (int &v : adj[u]) if (v != fa) dfs(v, u);
}

inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n;
    for (int i = 1; i <= n + n; ++i) adj[i].clear(), adj_[i].clear(), col[i].clear();
    for (int i = 1; i <= n + n; ++i) cin >> a[i], col[a[i]].emplace_back(i);
    for (int i = 1; i < n + n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    }
    function<bool(int)> gao = [&](int rt) {
        idx = tot = 0;
        for (int i = 1; i <= n + n + n + n; ++i) dfn[i] = low[i] = 0, adj_[i].clear();
        adj_[rt + (n << 1)].emplace_back(rt);
        for (int i = 1; i <= n; ++i) {
            adj_[col[i][0]].emplace_back(col[i][1] + (n << 1));
            adj_[col[i][1]].emplace_back(col[i][0] + (n << 1));
            adj_[col[i][0] + (n << 1)].emplace_back(col[i][1]);
            adj_[col[i][1] + (n << 1)].emplace_back(col[i][0]);
        } dfs(rt, 0);
        for (int i = 1; i <= n + n; ++i)
            if (!dfn[i]) dfs(i);
        for (int i = 1; i <= n + n; ++i)
            if (bel[i] == bel[i + n + n]) return 0;
        return 1;
    };
    if (gao(col[1][0])) {
        for (int i = 1; i <= n + n; ++i)
            if (bel[i] < bel[i + n + n]) cout << i << ' ';
        cout << '\n';
    } else if (gao(col[1][1])) {
        for (int i = 1; i <= n + n; ++i)
            if (bel[i] < bel[i + n + n]) cout << i << ' ';
        cout << '\n';
    } else cout << -1 << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：6

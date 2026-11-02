---
title: "CF1923E Count Paths 题解"
date: "2024-12-26T06:45:04.000Z"
link: "luogu-e7eq2jkr"
categories: ["题解"]
tags: ["Codeforces", "搜索", "深度优先搜索", "图论", "树"]
draft: false
---

首先树上路径计数一类的问题肯定可以上点分，但是有做法可以做到严格 $O(n)$。

考虑对于树上的一个点 $u$，在其子树点集 $S_u$ 中的点 $v$（$v\in S_u$）满足 $c_u=c_v$，则显然 $v$ 只能和 $S_u$ 中除了 $u$ 以外的结点做贡献。于是考虑从根节点 $1$ 开始对树做 dfs。对于当前结点 $u$，枚举儿子结点 $v$ 并把当前 dfs 的结点移动到 $v$。显然此时 $v$ 不会和 $u$ 以上所有颜色同样为 $c_u$ 的结点产生贡献，因此此时记录 $c_u$ 出现的颜色次数为 $1$，dfs 完之后再回溯即可。时间复杂度确实为 $O(n)$。

```cpp
const int N = 1000100;
const int mod = 998244353;
vector<int> adj[N];
int a[N], buc[N], n, s;
void dfs(int u, int fa) {
    int now = buc[a[u]];
    s += now;
    for (auto &v : adj[u])
        if (v != fa) {
            buc[a[u]] = 1;
            dfs(v, u);
        }
    buc[a[u]] = now + 1;
}
signed main() {
    ios_base::sync_with_stdio(0);
    cin.tie(0);
    int T;
    cin >> T;
    while (T--) {
        cin >> n;
        for (int i = 1; i <= n; ++i) cin >> a[i];
        for (int i = 1; i <= n; ++i) adj[i].clear(), buc[i] = 0;
        for (int i = 1; i < n; ++i) {
            int x, y;
            cin >> x >> y;
            adj[x].eb(y), adj[y].eb(x);
        }
        s = 0;
        dfs(1, 0);
        cout << s << '\n';
    }
}
```

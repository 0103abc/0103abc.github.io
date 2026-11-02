---
title: "P11425 [清华集训 2024] 路南柯 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p11425"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造", "搜索", "深度优先搜索", "图论", "树"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P11425).
:::

:::info[Solution]{open}
先考虑一个简单的构造方案：从图上的每个叶子结点开始求一个 DFS 序出来。容易证明构造的合法性。

~~然后我就不会了。~~

然后考虑一个很天才的做法。一个排列 $p_1,p_2,\ldots,p_n$ 是合法的拓扑序，等价于按顺序依次删除结点 $p_1,p_2,\ldots,p_n$ 时，当前删除的点一定是树剩余部分的叶子结点。因此把合法拓扑序列反序可得到一个父亲一定在儿子结点之前出现的序列。

考虑把原树上所有叶子结点都删除，然后可以得到一个新树，并给出一个序列数为新树叶子结点的构造：

对每个新树上的叶子结点 $x$，以 $x$ 为根跑一轮 DFS：将当前点的所有邻居按照原树叶子结点和非叶子结点分为俩类，第一次 DFS 的过程中，原树的所有叶子结点按照正常顺序访问，后面 DFS 过程中把访问顺序反过来。非叶子的邻居结点正常递归访问。把得到的 DFS 序反序输出即可。

可以证明构造的正确性。

然后直接交上去发现 wa 了，和题解拍一下之后发现需要特判菊花图的情况（答案是 $2$，记菊花的中心结点为 $c$，叶子结点为 $a_1,a_2,\ldots,a_{n-1}$ 则可以构造两个序列 $a_1,a_2,\ldots,a_{n-1},c$ 和 $a_{n-1},a_{n-2},\ldots,1,c$），补上就过了。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int deg[N], vis[N];
vector<int> adj[N], ord;
inline void dfs(int u, int fa, int st) {
    ord.emplace_back(u);
    vector<int> leaf;
    for (int &v : adj[u])
        if (v != fa && deg[v] == 1) leaf.emplace_back(v);
    if (vis[u]) reverse(leaf.begin(), leaf.end());
    else vis[u] = 1;
    for (int &i : leaf) ord.emplace_back(i);
    for (int &v : adj[u])
        if (v != fa && deg[v] > 1) dfs(v, u, st);
}

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) adj[i].clear(), deg[i] = vis[i] = 0;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
        ++deg[a], ++deg[b];
    } for (int i = 1; i <= n; ++i) if (deg[i] == n - 1) {
        cout << 2 << '\n';
        vector<int> leaf;
        for (int j = 1; j <= n; ++j)
            if (j != i) leaf.emplace_back(j);
        for (int &i : leaf) cout << i << ' ';
        cout << i << '\n';
        reverse(leaf.begin(), leaf.end());
        for (int &i : leaf) cout << i << ' ';
        cout << '\n';
        return;
    }
    int res = 0;
    for (int i = 1; i <= n; ++i)
        if (deg[i] > 1) {
            int cnt = 0;
            for (int &j : adj[i]) if (deg[j] > 1) ++cnt;
            if (cnt == 1) ++res;
        }
    cout << res << '\n';
    for (int i = 1; i <= n; ++i) if (deg[i] > 1) {
        int cnt = 0;
        for (int &j : adj[i]) if (deg[j] > 1) ++cnt;
        if (cnt == 1) {
            ord.clear(), dfs(i, 0, i);
            reverse(ord.begin(), ord.end());
            for (int &i : ord) cout << i << ' ';
            cout << '\n';
        }
    }
}

} // namespace lowspeed_song
```
:::

难度：黑

鲜活指数：9

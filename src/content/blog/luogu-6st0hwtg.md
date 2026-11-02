---
title: "CF1312G Autocompletion 题解"
date: "2026-07-20T13:49:15.000Z"
link: "luogu-6st0hwtg"
categories: ["题解"]
tags: ["Codeforces", "图论", "树", "动态规划", "字符串"]
draft: false
---

不是很难。容易想到给所有串建一个 Trie 然后在 Trie 上 dp（为了方便，后面记 Trie 上的 $i$ 点是第 $i$ 个串的结尾位置，$0$ 号结点为 Trie 的根结点）。设 $f_i$ 表示到达 Trie 上 $i$ 号点所需要的最小操作次数。则初始条件是 $f_0=0$。容易想到有下面两种转移情况：

+ 直接填当前字符，即直接从父亲结点转移而来，$f_i\leftarrow f_{fa_i}+1$。
+ 从当前点在 Trie 树上的某个祖先结点转移而来，$f_i\leftarrow f_j+(dlt_i-dlt_j)$，其中 $dlt_i$ 的含义是 $i$ 结点是树上字典序第 $dlt_i$ 小的结点。

第二个转移 dsu on tree 或者拿单调栈来维护即可做到 $O(n\log n)$ 或 $O(n)$ 时间复杂度转移。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
    
}

int f[N], idx = 1, Q[N];

struct Node {
    int ne[26], las;
    inline Node() { memset(ne, las = 0, sizeof ne); }
} tree[N];

int dlt;
stack<pair<int, int>> stk;

inline void dfs(int u) {
    if (stk.empty() || f[u] - dlt < stk.top().second) stk.emplace(u, f[u] - dlt);
    dlt += tree[u].las;
    for (int i = 0; i < 26; ++i)
        if (tree[u].ne[i]) {
            f[tree[u].ne[i]] = f[u] + 1;
            if (stk.size() && tree[tree[u].ne[i]].las)
                f[tree[u].ne[i]] = min(f[tree[u].ne[i]], stk.top().second + dlt + 1);
            dfs(tree[u].ne[i]);
        }
    if (stk.size() && stk.top().first == u) stk.pop();
}

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) { int p; char c; cin >> p >> c; tree[p].ne[c - 'a'] = i; }
    int k; cin >> k; for (int i = 1; i <= k; ++i) { int x; cin >> x; ++tree[Q[i] = x].las; }
    dfs(0); for (int i = 1; i <= k; ++i) cout << f[Q[i]] << ' '; cout << '\n';
}

} // namespace lowspeed_song
```

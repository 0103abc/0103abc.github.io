---
title: "CF1042F Leaf Sets 题解"
date: "2025-02-25T04:36:52.000Z"
link: "luogu-gpke5xfy"
categories: ["题解"]
tags: ["Codeforces", "图论", "树", "基础算法", "贪心", "搜索", "深度优先搜索"]
draft: false
---

比较巧妙的树上贪心。考虑在树上做 DFS，若当前结点为叶子结点则不做任何处理，否则，考虑一个非叶子结点 $u$，假设其所有儿子结点 $v_1,v_2,\ldots,v_k$ 全部 DFS 处理过了，那么假设从当前结点到她们的儿子结点的距离分别为 $d_1,d_2,\ldots,d_k$。则将 $d$ 数组升序排序，必然存在一个位置 $p$，使得 $1\sim p$ 中所有子树合并为一个集合，而 $p+1\sim k$ 中所有子树单独成为一个集合并不做任何合并操作。其中 $p$ 是最大的，满足 $1\sim p$ 内子树合并之后仍然满足条件的值，可以一遍扫描求出答案。容易证明这样贪心是正确的。时间复杂度为 $O(n\log n)$。

代码：

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
vector<int> adj[N];
int deg[N], res, n, k;
int dfs(int u, int fa) {
    if (deg[u] == 1) return 0;
    vector<int> now;
    for (int &v : adj[u])
        if (v != fa) now.emplace_back(dfs(v, u) + 1);
    sort(now.begin(), now.end());
    while (now.size() >= 2) {
        if (now.back() + now[now.size() - 2] <= k) break;
        now.pop_back(), ++res;
    }
    return now.back();
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cin >> n >> k;
    for (int i = 1; i < n; ++i) {
        int x, y;
        cin >> x >> y;
        adj[x].emplace_back(y);
        adj[y].emplace_back(x);
        ++deg[x], ++deg[y];
    }
    for (int i = 1; i <= n; ++i)
        if (adj[i].size() > 1) {
            dfs(i, 0);
            cout << res + 1 << '\n';
            return 0;
        }
    cout << "1\n";
    return 0;
}
```

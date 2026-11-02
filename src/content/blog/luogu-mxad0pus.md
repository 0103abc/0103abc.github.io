---
title: "CF812E Sagheer and Apple Tree 题解"
date: "2025-02-24T11:29:45.000Z"
link: "luogu-mxad0pus"
categories: ["题解"]
tags: ["Codeforces", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/mxad0pus)。

简单 $2300$。考虑到树的特殊性质，根节点到所有叶子结点的距离的奇偶性均相同，那么可以考虑把所有结点按照层数分类，问题转化为 Nim 阶梯博弈，只需要判断所有到所属子树内叶子结点距离为偶数的结点的异或值是否为 $0$ 即可。

问题变为如何计数答案。交换奇偶性相同的层对答案不会产生影响，可以单独处理。而若交换的是奇偶性不同的层，则将会把当前的异或值再异或上这两个元素所对应的值，只需要判断这个值是否为 $0$，简单开桶维护即可。时间复杂度为 $O(n)$，但是我没看到数据范围 $a_i\le 10^7$ 所以用了 `map` 维护，时间复杂度变为 $O(n\log n)$，也能过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 500010;
int a[N], dep[N];
vector<int> adj[N];
void dfs(int u) {
    for (int &v : adj[u]) {
        dfs(v);
        dep[u] = dep[v] ^ 1;
    }
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 2; i <= n; ++i) {
        int x; cin >> x;
        adj[x].emplace_back(i);
    }
    dfs(1);
    int now = 0;
    for (int i = 1; i <= n; ++i)
        if (!dep[i]) now ^= a[i];
    map<int, int> mp;
    int cnt = 0, use = 0, use2 = 0;
    for (int i = 1; i <= n; ++i) {
        if (dep[i]) {
            ++mp[a[i]];
            ++use;
        } else ++use2;
    }
    for (int i = 1; i <= n; ++i)
        if (!dep[i]) cnt += mp[a[i] ^ now];
    if (!now) {
        cnt += use * (use - 1) / 2;
        cnt += use2 * (use2 - 1) / 2;
    }
    cout << cnt << '\n';
    return 0;
}
```

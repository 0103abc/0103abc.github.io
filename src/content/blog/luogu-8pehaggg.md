---
title: "P14383 [JOISC 2017] 港口设施 / Port Facility 题解"
date: "2026-08-09T03:13:20.000Z"
link: "luogu-8pehaggg"
categories: ["题解"]
tags: ["洛谷", "数据结构", "并查集", "堆"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/8pehaggg)。

观察样例可得答案要么为 $0$ 要么是 $2$ 的若干次幂的形式。

考虑若存在两个箱子 $i,j$ 满足 $a_i<a_j<b_i<b_j$ 则 $i,j$ 两个箱子不能被放在同一个栈内。一个暴力的方法是直接枚举所有这样的二元组 $(i,j)$，这两个元素不能同属一个栈，因此直接扩展域并查集把 $i,j+n$ 和 $i+n,j$ 合并到一个集合 $S$ 里，最终答案就是 $2^{|S|}$。

直接做时间复杂度是 $O(n^2)$ 的，考虑优化。注意到本质有用的二元组 $(i,j)$ 只有 $O(n)$ 个，因此考虑按照时间扫描，遇到 $A_i$ 把 $i$ 加入到当前集合，遇到 $B_i$ 则所有在 $i$ 后面到达但是还没有离开的箱子 $j$ 都满足 $A_i<A_j<B_i<B_j$ 必须全部和 $i$ 放在不同的栈内，也就是所有满足这个条件的 $j$ 必须都在同一个栈内。直接把这些段合并起来跳过去然后拿小根堆来维护即可把时间复杂度优化到 $O(n\log n)$。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

pair<int, int> a[N];

struct DSU {
    int fa[N];
    inline DSU() { iota(fa, fa + N, 0); }
    inline void init(int maxn) { iota(fa, fa + maxn, 0); }
    inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
    inline int merge(int x, int y) {
        x = find(x), y = find(y);
        if (x != y) return fa[x] = y, 1;
        return 0;
    }
} dsu;

int ne[N], n;

inline int chk(int i, int j) {
    if (dsu.find(i) == dsu.find(j)) return 0;
    return dsu.merge(i, j + n), dsu.merge(j, i + n), 1;
}

inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i].first >> a[i].second;
    sort(a + 1, a + n + 1);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;
    for (int i = 1; i <= n; ++i) {
        auto [l, r] = a[i];
        while (q.size() && q.top().first < l) {
            int x = q.top().second; q.pop();
            if (ne[x]) q.emplace(a[ne[x]].second, ne[x]);
        } vector<int> v;
        while (q.size() && q.top().first < r) v.emplace_back(q.top().second), q.pop();
        for (int &j : v) if (!chk(i, j)) { cout << 0 << '\n'; return; }
        for (int j = 0; j + 1 < v.size(); ++j) ne[v[j]] = v[j + 1];
        if (v.size()) q.emplace(a[v[0]].second, v[0]);
        q.emplace(r, i);
    } int cnt = 0;
    for (int i = 1; i <= n + n; ++i) cnt += (int)(dsu.find(i) == i);
    cout << power(2, cnt >> 1, mod) << '\n';
}

} // namespace lowspeed_song
```
:::

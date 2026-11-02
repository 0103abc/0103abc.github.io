---
title: "CF1450E Capitalism 题解"
date: "2026-06-17T13:26:00.000Z"
link: "luogu-xdl16prx"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "差分", "图论", "最短路", "二分"]
draft: false
---

比较简单的题。$b=1$ 是容易差分约束的，但是 $b=0$ 的条件是 $a_i-a_j\in\lbrace -1,1\rbrace$ 差分约束难以处理。考虑先判无解，容易发现将所有关系点建边后若得到的图不是二分图则必然无解。判掉无解后可以注意到此时若直接把 B 类关系按照 $-1\le a_i-a_j\le 1$ 来建边，此时直接跑 Floyd 或者 $n$ 次 spfa 之后直接拿距离数组当答案就可以取到极差最大的情况，具体原因可以参考差分约束的实现理解。

总时间复杂度为 $O(n^3)$ 可以通过该题。

```cpp line-numbers
int mp[2010][2010];
inline void sol() {
    int n, m; cin >> n >> m;
    memset(mp, 0x3f, sizeof mp);
    for (int i = 1; i <= n; ++i) mp[i][i] = 0;
    while (m--) {
        int a, b, c; cin >> a >> b >> c;
        dsu.merge(a + n, b), dsu.merge(a, b + n);
        if (c == 1) mp[a][b] = 1, mp[b][a] = -1;
        else mp[a][b] = mp[b][a] = 1;
    } for (int i = 1; i <= n; ++i)
        if (dsu.find(i) == dsu.find(i + n)) {
            println("NO");
            return;
        }
    for (int k = 1; k <= n; ++k)
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= n; ++j)
                mp[i][j] = min(mp[i][j], mp[i][k] + mp[k][j]);
    for (int i = 1; i <= n; ++i)
        if (mp[i][i] < 0) { println("NO"); return; }
    int res = -inf, id = -1;
    for (int i = 1; i <= n; ++i) {
        int mx = -n - 1;
        for (int j = 1; j <= n; ++j) mx = max(mx, mp[i][j]);
        if (res < mx) res = mx, id = i;
    } println("YES\n{}", res);
    for (int i = 1; i <= n; ++i) print("{} ", mp[id][i]);
    println("");
}
```

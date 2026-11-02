---
title: "CF869E The Untended Antiquity 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf869e"
categories: ["题解"]
tags: ["Codeforces", "数学", "线性代数"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF869E).
:::

:::info[Solution]{open}
容易发现两个点连通当且仅当两个点处于同一个被围起来的区域。因此想到和哈希，给每个连通块随机赋一个权值，用二维 BIT 来维护矩阵中每个点的权值和，此时两个点处于同一个区域当且仅当两个点的权值相同。

时间复杂度为 $O(n^2\log n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

mt19937_64 mt(time(0));
uniform_int_distribution<u64> dist(0, ULLONG_MAX);

struct BIT {
    u64 tree[2510][2510];
    inline BIT() { memset(tree, 0, sizeof tree); }
    inline void add(int x, int y, u64 v) {
        for (int i = x; i < 2510; i += (i &- i))
            for (int j = y; j < 2510; j += (j &- j))
                tree[i][j] += v;
    }
    inline u64 qry(int x, int y) {
        u64 sum = 0;
        for (int i = x; i; i -= (i &- i))
            for (int j = y; j; j -= (j &- j))
                sum += tree[i][j];
        return sum;
    }
} fwt;

inline void sol() {
    int n, m, q; cin >> n >> m >> q;
    map<tuple<int, int, int, int>, u64> mp;
    while (q--) {
        int o; cin >> o;
        if (o == 1) {
            int x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
            u64 val = dist(mt);
            mp[{x1, y1, x2, y2}] = val;
            fwt.add(x2 + 1, y2 + 1, val), fwt.add(x1, y1, val);
            fwt.add(x1, y2 + 1, -val), fwt.add(x2 + 1, y1, -val);
        } else if (o == 2) {
            int x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
            u64 val = -mp[{x1, y1, x2, y2}];
            fwt.add(x2 + 1, y2 + 1, val), fwt.add(x1, y1, val);
            fwt.add(x1, y2 + 1, -val), fwt.add(x2 + 1, y1, -val);
        } else {
            int x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
            cout << ((fwt.qry(x1, y1) == fwt.qry(x2, y2)) ? "Yes" : "No") << '\n';
        }
    }
}

} // namespace lowspeed_song
```
:::

难度：蓝

鲜活指数：5

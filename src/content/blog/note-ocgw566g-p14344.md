---
title: "P14344 [JOISC 2019] 两道料理 / Two Dishes 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p14344"
categories: ["题解"]
tags: ["洛谷", "动态规划", "基础算法", "差分", "二分"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P14344).
:::

:::info[Solution]{open}
我觉得这个题很难啊（）

考虑如果在盖饭第 $i$ 步前，已经完成了 $j$ 个咖喱步骤，则完成时间显然就是 $a_i+b_j$。考虑对每个 $i$，二分求出最大的 $Y_i$ 满足 $a_I+b_{Y_i}\le S_i$，含义就是第 $i$ 步在路径长度不超过 $Y_i$ 的时候完成才能获得 $P_i$ 的价值。同理对咖喱第 $j$ 步求最大的 $X_j$ 满足 $a_{X_j}+b_j\le T_j$。因此原问题可以变为在网格中选择一条单调路径判断一些带权点位于路径的哪一侧。

然后考虑将贡献统一成路径下方的点券和。咖喱步骤可以放一个带权点 $(X_j,j)$，点位于路径的右下方的时候可以获得贡献。盖饭步骤方向相反，所以考虑将所有权都加入答案，然后再放一个点 $(i-1,Y_i+1)$ 并将其权值取反即可。

此时问题可以变为：选择一条只向右或者向上移动的单调路径，使得路径的右下方以及路径上点权的和最大。容易列出一个 $O(n^2)$ 的暴力 dp 转移式。

考虑优化时间复杂度。具体的，用扫描线维护 dp 的差分信息，将所有带权点以横坐标为第一关键字从大到小，纵坐标为第二关键字从小到大排序。然后考虑在扫描线的过程中 dp，设 $f_i$ 表示当前路径的纵坐标高度为 $i$ 时的最大点权和是多少。考虑在算 dp 信息的过程中用扫描线加点，对一个带权点 $(x,y,w)$ 而言，dp 信息相当于是要让 $f_y,f_{y+1},\ldots,f_m$ 的值都增加 $w$ 即对 dp 数组做一次后缀加 $w$ 操作。然后因为路径还可以随时往上走因此还需要在 dp 过程中不断做前缀最大值操作。

直接维护是困难的考虑维护 dp 的差分信息。设 $d_i=f_i-f_{i-1}$，则因为 dp 过程中要随时做前缀最大值所以必然有 $d_i\ge 0$。考虑只保留 $d_i>0$ 的位置 $i$，则对加入的点 $(x,y,w)$ 而言，不考虑 $w=0$ 的点，若 $w>0$ 则直接维护 $d_y\leftarrow d_y+w$ 即可，若 $w<0$ 则考虑直接暴力的从 $y$ 开始让后面的正差分和 $w$ 权值抵消并删除所有变成 $0$ 的差分值。

上面的做法看上去十分暴力，但是每个差分信息都最多只会被加入一次删除一次，因此开一个 map 维护差分信息，均摊时间复杂度为 $O(n\log n)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], s[N], p[N], b[N], t[N], q[N];
vector<pair<int, int>> buc[N];

inline void sol() {
    int n, m; cin >> n >> m;
    for (int i = 1; i <= n; ++i) cin >> a[i] >> s[i] >> p[i], a[i] += a[i - 1];
    for (int i = 1; i <= m; ++i) cin >> b[i] >> t[i] >> q[i], b[i] += b[i - 1];
    map<int, int> mp;
    int res = 0;
    function<void(int, int, int)> add = [&](int x, int y, int w) {
        if (x <= 0 || x > n + 1 || y > m) return;
        if (x == n + 1 || !y) res += w;
        else buc[x].emplace_back(y, w);
    };
    for (int i = 1; i <= n; ++i) {
        int l = 0, r = m, best = m + 1;
        while (l <= r) {
            int mid = l + r >> 1;
            if (s[i] - a[i] < b[mid]) best = mid, r = mid - 1;
            else l = mid + 1;
        } res += p[i], add(i, best, -p[i]);
    }
    for (int i = 1; i <= m; ++i) {
        int l = 0, r = n, best = n + 1;
        while (l <= r) {
            int mid = l + r >> 1;
            if (t[i] - b[i] < a[mid]) best = mid, r = mid - 1;
            else l = mid + 1;
        } add(best, i, q[i]);
    }
    for (int i = 1; i <= n; ++i) sort(buc[i].begin(), buc[i].end(), greater<>());
    for (int i = 1; i <= n; ++i) {
        for (auto &[y, w] : buc[i]) {
            if (w > 0) mp[y] += w;
            else if (w < 0) {
                w = -w;
                auto it = mp.lower_bound(y);
                while (w > 0 && it != mp.end()) {
                    if (w >= it->second) w -= it->second, it = mp.erase(it);
                    else { it->second -= w; break; }
                }
            }
        }
    }
    for (auto &[x, y] : mp) res += y;
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑

鲜活指数：8

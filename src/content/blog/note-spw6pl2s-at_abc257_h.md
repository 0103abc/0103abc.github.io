---
title: "AT_abc257_h [ABC257Ex] Dice Sum 2 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-at_abc257_h"
categories: ["题解"]
tags: ["AtCoder", "基础算法", "排序"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/AT_abc257_h).
:::

:::info[Solution]{open}
要求的东西其实就是 $\frac1{6^n}\sum\limits_{x_1=1}^6\sum\limits_{x_2=1}^6\ldots\sum\limits_{x_n=1}^6(\sum\limits_{i=1}^na_{i,x_i})^2-\sum\limits_{i=1}^nc_i$。

考虑套路的展开平方项，得到：$(\sum\limits_{i=1}^na_{i,x_i})^2=\sum\limits_{i=1}^na_{i,x_i}^2+2\sum\limits_{1\le i<j\le n}2a_{i,x_I}a_{j,x_j}$。考虑对两项分别统计答案：

**单个骰子的平方项**：简单分析可得该部分的和为 $\frac16\sum\limits_{i=1}^6a_{i,x}^2$。

**两个不同骰子的乘积项**：对固定的 $i<j$，其对答案的贡献可以被表示为 $\frac1{6^n}\sum\limits_{x_1,x_2,\ldots,x_n}a_{i,x_i}a_{j,x_j}$，只有 $x_i,x_j$ 两个变量真正参与了计算，其余 $n-2$ 个变量只参与了增加循环次数的作用，因此该部分的和就是 $\frac1{36}((\sum\limits_{x=1}^6a_{i,x})(\sum\limits_{y=1}^6a_{j,y}))$。

记 $s_i=\sum\limits_{x=1}^6a_{i,x},q_i=\sum\limits_{x=1}^6a_{i,x}^2$，则原式可以被表示为 $\sum\limits_{i=1}^n\frac{q_i}6+2\sum\limits_{i<j}\frac{s_is_j}{36}-\sum\limits_{i=1}^nc_i$，做简单的变形后可得原式值为 $\frac1{36}(\sum\limits_{i=1}^ns_i)^2+\sum\limits_{i=1}^n(\frac{q_i}6-\frac{s_i^2}{36}-c_i)$。为了方便处理这里将式子整体乘 $36$ 得到 $(\sum\limits_{i=1}^ns_i)^2+\sum\limits_{i=1}^n(6q_i-s_i^2-36c_i)$。

记 $X_i=s_i,Y_i=6q_i-s_i^2-36c_i$，问题变为选 $k$ 个骰子最大化 $(\sum X_i)^2+\sum Y_i$ 的值。设最优集合是 $S$，记 $T=\sum\limits_{i\in S}X_i$，则对任意 $i\in S,j\not\in S$，将 $i$ 替换为 $j$ 后不能让贡献变得更优，因此需要有 $(T-X_i+X_j)^2+Y_j-Y_i\le T^2$，展开可得 $2T(X_j-X_i)+(X_j-X_i)^2+Y_j-Y_i\le 0$。因为 $(X_j-X_i)^2\ge 0$ 所以必有 $2TX_j+Y_j\le 2TX_i+Y_i$。因此最优集合 $S$ 一定是按照 $2TX_i+Y_i$ 从大到小排序然后选取最优的 $k$ 个骰子。

再次换元，记 $t=2T$，则对于某个 $t$ 值，最优集合一定是直线 $f_i(t)=X_it+Y_i$ 中函数值最大的 $k$ 条直线。因为两条不重合的直线最多只有一个交点，而直线间大小关系只会在两条直线相交的时候发生变化，因此只需要处理 $O(n^2)$ 个交点 $t$ 即可。两条直线的交点为 $t=\frac{Y_j-Y_i}{X_i-X_j}$，将这些交点排序然后依次扫描，动态维护当前最大的 $k$ 条直线和 $A=\sum X_i,B=\sum Y_i$ 的值，然后用 $A^2+B$ 的值更新答案即可。

总时间复杂度为 $O(n^2\log n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

const int i36 = 859599304;

inline void init() {
}

struct Dice { int x, y; } a[N];
struct Event { int p, q, u, v; };

int used[N], c[N];

inline void sol() {
    int n, k; cin >> n >> k;
    for (int i = 1; i <= n; ++i) cin >> c[i], a[i].y = -36 * c[i];
    for (int i = 1; i <= n; ++i) {
        int sq = 0;
        for (int j = 0; j < 6; ++j) {
            int x; cin >> x;
            a[i].x += x, sq += x * x;
        } a[i].y += 6 * sq - a[i].x * a[i].x;
    } sort(a + 1, a + n + 1, [&](auto &l, auto &r) { return l.x < r.x || l.x == r.x && l.y > r.y; });
    vector<Event> sweep;
    for (int i = 1; i <= n; ++i)
        for (int j = i + 1; j <= n; ++j)
            if (a[i].x != a[j].x) sweep.push_back({a[i].y - a[j].y, a[j].x - a[i].x, i, j});
    sort(sweep.begin(), sweep.end(), [&](auto &l, auto &r) { return (i128)l.p * r.q < (i128)r.p * l.q; });
    int sx = 0, sy = 0;
    for (int i = 1; i <= k; ++i) sx += a[i].x, sy += a[i].y, used[i] = 1;
    int res = sx * sx + sy;
    for (auto &[p, q, u, v] : sweep)
        if (used[u] && !used[v]) {
            used[u] = 0, used[v] = 1;
            sx += a[v].x - a[u].x, sy += a[v].y - a[u].y;
            res = max(res, sx * sx + sy);
        }
    cout << (res % mod + mod) % mod * i36 % mod << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活程度：5

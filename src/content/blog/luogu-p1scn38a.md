---
title: "P11815 [PA 2019 Final] 领地 / Terytoria 题解"
date: "2026-06-19T04:38:14.000Z"
link: "luogu-p1scn38a"
categories: ["题解"]
tags: ["洛谷", "基础算法", "前缀和"]
draft: false
---

对着 $\sum \binom X2$ 这个式子调整可以发现尽量把所有动物都聚集在尽量少的点上一定比分散开得分更大。这个时候可以观察到在题目给定的限制下一定存在一组合法方案（注意不一定是最优方案）使得所有动物都在四个角中的两个角上，且这两个角是对角。

然后进一步调整可以发现存在一个最优解使得最多有三个点有动物，且三个点中存在两个点是对角。证明的话考虑四个点的情况则除了对角的两个点另外两个点必然至少有一个能移动到对角两个点上。更多点的情况同理。

枚举一组对角然后拿二维前缀和统计第三个点放在哪里对答案的贡献最优即可，时间复杂度为 $O(n^2)$ 可以轻松通过该题。

```cpp line-numbers
int s1[2010][2010], s2[2010][2010];
struct Animal { int x1, y1, x2, y2, c; } a[N];
inline void sol() {
    function<int(int)> calc = [&](int v) { return v * (v - 1) / 2; };
    int n, X, Y; cin >> n >> X >> Y; int all = 0;
    for (int i = 1; i <= n; ++i) cin >> a[i].x1 >> a[i].y1 >> a[i].x2 >> a[i].y2 >> a[i].c, all += a[i].c;
    function<int(int, int)> solve = [&](int x, int y) {
        int res = 0;
        memset(s1, 0, sizeof s1), memset(s2, 0, sizeof s2);
        for (int i = 1; i <= n; ++i) {
            s1[a[i].x1][a[i].y1] += a[i].c, s1[a[i].x2 + 1][a[i].y2 + 1] += a[i].c;
            s1[a[i].x2 + 1][a[i].y1] -= a[i].c, s1[a[i].x1][a[i].y2 + 1] -= a[i].c;
            if (a[i].x1 <= x && x <= a[i].x2 && a[i].y1 <= y && y <= a[i].y2) {
                s2[a[i].x1][a[i].y1] += a[i].c, s2[a[i].x2 + 1][a[i].y2 + 1] += a[i].c;
                s2[a[i].x2 + 1][a[i].y1] -= a[i].c, s2[a[i].x1][a[i].y2 + 1] -= a[i].c;
            }
        } for (int i = 1; i <= X; ++i)
            for (int j = 1; j <= Y; ++j) {
                s1[i][j] += s1[i - 1][j] + s1[i][j - 1] - s1[i - 1][j - 1];
                s2[i][j] += s2[i - 1][j] + s2[i][j - 1] - s2[i - 1][j - 1];
                res = max(res, calc(s2[i][j]) + calc(s1[i][j] - s2[i][j]) + calc(all - s1[i][j]));
            }
        return res;
    };
    cout << max({solve(1, 1), solve(1, Y), solve(X, 1), solve(X, Y)}) << '\n';
}
```

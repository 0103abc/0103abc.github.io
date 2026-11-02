---
title: "P16362 [BalticOI 2026] Sort 题解"
date: "2026-05-12T06:39:10.000Z"
link: "luogu-coxj35bg"
categories: ["题解"]
tags: ["洛谷", "数学", "数论", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/coxj35bg)。

$a+b\le n$ 是简单的，两个操作互不影响，因此答案只能为 $0,1,2,-1$ 中的一个，简单讨论即可。

剩下 $a+b>n$，先特判掉 $<2$ 次操作可以排序的情况。注意到连续多次执行同一个操作肯定不优，而交替执行操作就是利用中间一段把最左侧和最右侧的部分先移动到中间然后再移动到两侧。下面对该类情况进行更具体的分析：

记 $p_i$ 表示 $i$ 位置的元素目标移动到的位置，则把问题放到平面直角坐标系上考虑，$i$ 点对应的坐标点就是 $(i,p_i)$。后面为了方便，令 $b\leftarrow n-b$。

记 $A$ 为当前在 $[0,a)$ 但是最终应该在 $[a,n)$ 的元素数量，$B$ 为当前在 $[a,n)$ 最终应该在 $[0,b)$ 的元素数量，$C$ 表示当前在 $[0,b)$ 最终应该在 $[a,n)$ 的元素数量，$D$ 表示当前在 $[b,n)$ 最终应该在 $[0,b)$ 的元素数量。显然上面给出的四个量都可以直接二维数点求出。此时一组操作最多可以搬运 $a-b$ 个错位的元素，算答案可以直接分类先执行的是哪个操作然后算答案，最终答案就是：

$$
\max(2,\min(\max(2\lceil\frac A{len}\rceil,2\lceil\frac B{len}\rceil+1),\max(2\lceil\frac D{len}\rceil,2\lceil\frac C{len}\rceil+1)))
$$

其中 $len=a-b$。离线下来然后用 BIT 维护即可做到单 $\log$ 时间复杂度解决问题。

```cpp line-numbers
pair<int, int> Q[N], srt[N];
int x[N], p[N], res[N][5], st[N][20][2], lg[N], pre[N];

struct BIT {
    int tree[N];
    inline BIT() { memset(tree, 0, sizeof tree); }
    inline void clr(int x) { for (++x; x < N; x += (x & -x)) tree[x] = 0; }
    inline void add(int x, int v) { for (++x; x < N; x += (x & -x)) tree[x] += v; }
    inline int qry(int x) { if (x < 0) return 0; int s = 0; for (++x; x; x -= (x & -x)) s += tree[x]; return s; }
    inline int qry(int l, int r) { return qry(r) - qry(l - 1); }
} fwt;

inline int qmax(int l, int r) {
    int lgx = lg[r - l + 1];
    return max(st[l][lgx][0], st[r - (1 << lgx) + 1][lgx][0]);
}

inline int qmin(int l, int r) {
    int lgx = lg[r - l + 1];
    return min(st[l][lgx][1], st[r - (1 << lgx) + 1][lgx][1]);
}

inline int Ceil(int a, int b) { return (a + b - 1) / b; }
inline void sol() {
    int n, q; cin >> n >> q;
    for (int i = 1; i <= n; ++i) cin >> x[i], srt[i] = {x[i], i};
    for (int i = 0; i < q; ++i) { int a, b; cin >> a >> b, Q[i] = {a, b}; }
    sort(srt + 1, srt + n + 1); for (int i = 1; i <= n; ++i) p[srt[i].second] = i;
    vector<pair<int, int>> points;
    vector<tuple<int, int, int, int>> queries;
    for (int i = 1; i <= n; ++i) points.emplace_back(p[i], i);
    sort(points.begin(), points.end());
    for (int i = 0; i < q; ++i) {
        auto [a, b] = Q[i]; b = n - b;
        queries.emplace_back(a, a, 1, i);
        queries.emplace_back(b, a, 2, i);
        queries.emplace_back(a, b, 3, i);
        queries.emplace_back(b, b, 4, i);
    }
    sort(queries.begin(), queries.end(), [&](auto &l, auto &r) {
        return get<0>(l) < get<0>(r);
    });
    for (int i = 0, j = 0; i < queries.size(); ++i) {
        auto [x, y, coef, id] = queries[i];
        while (j < points.size() && points[j].first <= x) fwt.add(points[j++].second, 1);
        res[id][coef] = fwt.qry(y);
    }
    lg[0] = -1; for (int i = 1; i <= n; ++i) lg[i] = lg[i >> 1] + 1, st[i][0][0] = st[i][0][1] = x[i];
    for (int i = 1; i < 20; ++i) for (int j = 1; j <= n - (1 << i) + 1; ++j) {
        st[j][i][0] = max(st[j][i - 1][0], st[j + (1 << (i - 1))][i - 1][0]);
        st[j][i][1] = min(st[j][i - 1][1], st[j + (1 << (i - 1))][i - 1][1]);
    }
    for (int i = 1; i <= n; ++i) pre[i] = pre[i - 1] + (int)(p[i] != i);
    for (int i = 0; i < q; ++i) {
        auto [a, b] = Q[i]; b = n - b;
        if (!pre[n]) cout << 0 << '\n';
        else if (!pre[b] || pre[n] == pre[a])cout << 1 << '\n';
        else {
            int len = a - b, A = a - res[i][1], B = b - res[i][2], C = b - res[i][3], D = b - res[i][4];
            if (len <= 0) {
                if (pre[a] == pre[b] && !A && !D) cout << 2 << '\n';
                else cout << -1 << '\n';
                continue;
            }
            cout << max(2ll, min(max(2 * Ceil(A, len), 2 * Ceil(B, len) + 1), max(2 * Ceil(C, len) + 1, 2 * Ceil(D, len)))) << '\n';
        }
    }
}
```

---
title: "SP27098 FN16OIL - Oil 题解"
date: "2026-02-06T01:51:37.000Z"
link: "luogu-94daik61"
categories: ["题解"]
tags: ["洛谷", "基础算法", "排序"]
draft: false
---

注意到关键结论：一定存在一条最优直线至少过两个线段的端点。

直接枚举线段的端点计算有多少条线段被直线经过是困难的，考虑换一个方向：枚举直线的一个端点，此时其他线段被经过直线可以取的**斜率的倒数**的范围是一个固定的区间，直接计算所有线段被经过的斜率区间，然后求出被覆盖次数最多的位置的覆盖次数即可。可以排序然后扫描线处理，总时间复杂度为 $O(n^2\log n)$ 可以通过该题。

```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    struct Segment { int x0, x1, y; } seg[N];
    inline double slope(int x0, int y0, int x1, int y1)
    {
        return 1. / (y1 - y0) * (x1 - x0);
    }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i)
            cin >> seg[i].x0 >> seg[i].x1 >> seg[i].y;
        vector<tuple<int, int, int>> point;
        for (int i = 1; i <= n; ++i)
            point.emplace_back(seg[i].x0, seg[i].y, abs(seg[i].x1 - seg[i].x0)), point.emplace_back(seg[i].x1, seg[i].y, abs(seg[i].x1 - seg[i].x0));
        sort(point.begin(), point.end());
        int mx = 0;
        for (auto &[x, y, $] : point)
        {
            vector<pair<double, int>> segm;
            for (int i = 1; i <= n; ++i)
                if (seg[i].y != y)
                {
                    double k1 = slope(seg[i].x0, seg[i].y, x, y);
                    double k2 = slope(seg[i].x1, seg[i].y, x, y);
                    if (k1 > k2)
                        swap(k1, k2);
                    if (seg[i].x0 > seg[i].x1)
                        swap(seg[i].x0, seg[i].x1);
                    segm.emplace_back(k1 - 1e-8, seg[i].x0 - seg[i].x1);
                    segm.emplace_back(k2 + 1e-8, seg[i].x1 - seg[i].x0);
                }
            sort(segm.begin(), segm.end());
            int cnt = 0;
            mx = max(mx, $);
            for (auto &[x, coef] : segm)
                mx = max(mx, (cnt -= coef) + $);
        }
        cout << mx << '\n';
    }
} // namespace Loyalty

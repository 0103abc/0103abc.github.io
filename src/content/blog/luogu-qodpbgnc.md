---
title: "CF1776I Spinach Pizza 题解"
date: "2026-02-04T15:04:57.000Z"
link: "luogu-qodpbgnc"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "模拟"]
draft: false
---

有经典结论: 在一个凸包上, 每次选择最小的三角形并将其顶点从凸包上删除, 得到的所有三角形的面积单调不下降. 证明拿叉积算一下就行。

于是容易证明, 根据这个策略, 若 $n$ 为偶数则先手必胜, 否则先手会多取走一个三角形, 后手必胜。

$n$ 很小, 所以直接暴力模拟该过程, 时间复杂度为 $O(n^2)$ 可以通过。

```cpp line-numbers
namespace Loyalty
{
    struct Point { int x, y; };
    inline int cross(Point x, Point y) { return x.x * y.y - y.x * x.y; }
    inline Point operator-(const Point l, const Point r)
    {
        return {l.x - r.x, l.y - r.y};
    }
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        vector<pair<int, Point>> v;
        for (int i = 1; i <= n; ++i)
        {
            int x, y;
            cin >> x >> y;
            v.emplace_back(i, Point{x, y});
        }
        if (n & 1)
        {
            cout << "Beatrice" << endl;
            int q;
            cin >> q;
            vector<pair<int, Point>> tmp;
            for (auto &[x, p] : v)
                if (x != q)
                    tmp.emplace_back(x, p);
            v.swap(tmp);
        }
        else
            cout << "Alberto" << endl;
        while (v.size() > 2)
        {
            int id = -1, mi = inf;
            for (int j = 0; j < v.size(); ++j)
            {
                int i = (j - 1 + v.size()) % v.size(), k = (j + 1) % v.size();
                int area = cross(v[k].second - v[j].second, v[i].second - v[j].second);
                if (area < mi)
                    mi = area, id = v[j].first;
            }
            assert(~id);
            cout << id << endl;
            vector<pair<int, Point>> tmp;
            for (auto &[x, p] : v)
                if (x != id)
                    tmp.emplace_back(x, p);
            v.swap(tmp);
            int q;
            cin >> q;
            tmp.clear();
            for (auto &[x, p] : v)
                if (x != q)
                    tmp.emplace_back(x, p);
            v.swap(tmp);
        }
    }
}
```

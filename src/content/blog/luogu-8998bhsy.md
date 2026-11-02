---
title: "P13708 [NWERC 2023] Isolated Island 题解"
date: "2026-08-25T01:02:42.000Z"
link: "luogu-8998bhsy"
categories: ["题解"]
tags: ["洛谷", "基础算法", "二分", "图论", "二分图匹配"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/8998bhsy)。

容易想到平面图转对偶图，然后记 $dis_i$ 表示 $i$ 区域到海边所需要经过的最少区域数量，则对相邻两个区域 $u,v$ 必有 $|dis_u-dis_v|\le 1$，证明简单调整即可。

然后考虑什么时候存在点对 $(u,v)$ 满足 $dis_u=dis_v$。正难则反考虑不存在的情况，此时必须满足对任意相邻点对 $(u,v)$ 都有 $dis_u,dis_v$ 的奇偶性不同，也即对偶图必须为二分图。然后又有经典结论，对偶图为二分图当且仅当原图中每个点度数都是偶数，因此问题转化为统计原图中每个点度数的奇偶性。

然后考虑某个篱笆的交点，如果一条线段从这里穿了过去那么会在当前点上增加 $2$ 的度数，奇偶性不变。只有当前交点作为某一个线段的端点的时候奇偶性才会发生变化。因此一个点度数的奇偶性只取决于以该点为端点的线段的数量，这个直接随便统计一下就可以了。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}


inline void sol([[maybe_unused]]int __testcase_id) {
    int n; cin >> n;
    map<pair<int, int>, int> mp;
    for (int i = 1; i <= n; ++i) {
        int x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
        mp[{x1, y1}] ^= 1, mp[{x2, y2}] ^= 1;
    } for (auto &[_, $] : mp) if ($) { cout << "yes\n"; return; }
    cout << "no\n";
}

} // namespace lowspeed_song
```

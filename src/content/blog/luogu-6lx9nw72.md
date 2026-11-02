---
title: "CF1605D Treelabeling 题解"
date: "2025-01-19T12:24:45.000Z"
link: "luogu-6lx9nw72"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分", "图论", "二分图匹配", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/6lx9nw72)。

$u\oplus v\le\min(u,v)$ 十分的别扭，于是考虑转换条件。令 $l$ 表示 $u,v$ 二进制最高的 $1$ 位的最大值，则显然若 $u,v$ 在第 $l$ 位上的值相同，则等式成立，否则等式不成立。

因此可以发现，若 $\exist i,s.t.u,v\in[2^i,2^{i+1})$，则 $u,v$ 两个点满足条件，否则不满足条件。因此给 $[2^i,2^{i+1})$ 段内所有元素定义为 $i$ 色。

因为树是二分图，所以考虑给树黑白染色，要求树上相邻两个结点的色必须不同。这是容易构造的，二进制拆分一下即可。于是做完了。

[代码](https://codeforces.com/contest/1605/submission/301725402)。

---
title: "CF863E Turn Off The TV 题解"
date: "2024-09-13T11:29:33.000Z"
link: "luogu-0r3g2ufd"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "差分", "前缀和", "数据结构", "线段树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/0r3g2ufd)。

先对值域离散化，然后建树记录每一个点被区间覆盖的次数。

枚举每一个区间，若这个区间中每一个点都被至少覆盖了两次那么这个区间就合法。考虑先差分+前缀和求出每一个点被覆盖的次数，然后用线段树维护区间最小值即可。时间复杂度为 $O(n\log n)$。

[代码](https://codeforces.com/contest/863/submission/280974547)

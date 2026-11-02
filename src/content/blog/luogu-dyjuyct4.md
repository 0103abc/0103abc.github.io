---
title: "CF484B Maximum Value 题解"
date: "2025-01-01T13:46:35.000Z"
link: "luogu-dyjuyct4"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分"]
draft: false
---

比较简单的，枚举 $a_i$ 和 $\lfloor\frac{a_i}{a_j}\rfloor$ 的值，显然这是调和级数级别的，然后因为这个东西有单调性，所以对于上面的信息直接二分出最大的 $a_j$ 的值就做完了。时间复杂度 $O(n\log n\log V)$，需要卡常。

upd：对上述显然结论的证明：对于每一个 $a_j$，设 $a_i$ 的上限是 $V$，则 $\lfloor\frac{a_i}{a_j}\rfloor$ 能取到的最大的值是 $\lfloor\frac{V}{a_j}\rfloor$，总量级不超过 $\sum\limits_{i=1}^V\lfloor\frac{V}{i}\rfloor$。又有经典结论 $\sum\limits_{i=1}^V \frac{V}{i}\approx V\log V$，且 $\sum\limits_{i=1}^V\lfloor\frac{V}{i}\rfloor\le \sum\limits_{i=1}^V\frac{V}{i}$，因此 $\sum\limits_{i=1}^V\lfloor\frac{V}{i}\rfloor\approx V\log V$（甚至还要小一点）。因此证毕。

[AC Code](https://codeforces.com/contest/484/submission/299258426)

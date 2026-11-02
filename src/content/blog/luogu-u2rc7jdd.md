---
title: "CF2056D Unique Median 题解"
date: "2025-01-18T01:28:50.000Z"
link: "luogu-u2rc7jdd"
categories: ["题解"]
tags: ["Codeforces", "数学", "计数"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/u2rc7jdd)。

因为值域 $V$ 很小，因此考虑直接枚举值域。正难则反，则答案即为总对数 $\frac{n(n+1)}{2}$ 减去不合法的对数。显然不合法的对数需要满足其长度为偶数，且中位数有两个（即不符合题目给的条件）。于是考虑经典套路。设当前枚举的中位数是 $v$，则定义另一个数组 $b$：若 $a_i\ge v$，则 $b_i=1$，否则 $b_i=-1$。此时数组不合法当且仅当 $\sum\limits_{i=l}^r b_i=0$，可以直接使用 `map` 来统计。

但是这样是错的。若某一个不合法区间，其两个中位数分别为 $x,y$（$x<y$），则其会被重复计数 $y-x$ 遍。于是考虑直接钦定其相对较小的中位数 $x$ 的值必须为 $v$ 再统计答案。具体的说，对于每一个 $v$ 均存储两个指针 $i,j$。每一次扫描到下一个位置的时候，先向右移动 $j$ 使得 $j\leftarrow j+1$，然后若此时 $a_j=v$，则将 $[i,j]$ 段内的答案全部加入 `map` 中，并令 $i\leftarrow j$。这样做可以保证每一个不合法区间都不会被重复统计。总时间复杂度为 $O(nV\log n)$，可以通过。

[代码](https://codeforces.com/contest/2056/submission/301496645)。

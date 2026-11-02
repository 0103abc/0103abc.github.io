---
title: "CF1626F A Random Code Problem 题解"
date: "2026-03-14T04:49:34.000Z"
link: "luogu-6a07qfa2"
categories: ["题解"]
tags: ["Codeforces", "数学", "概率与期望"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/6a07qfa2)。

不算很难的题（？

注意到位置和位置之间是相互独立的，因此考虑对每个位置分别计算其期望值。设 $f_{i,j}$ 表示当前处理的数值为 $i$，进行了 $j$ 次操作的不同方案数。转移形如：

+ $f_{i,j+1}\leftarrow (n-1)f_{i,j}$
+ $f_{i-i\bmod(j+1),j+1}\leftarrow f_{i,j}$

直接转移时间复杂度为 $O(kV)$，考虑进一步优化。注意到用题目中给出的操作，若对 $x$ 进行操作，则 $\frac x{\text{lcm}(1,2,\ldots,k-1)}$ 的值在整个操作过程中一定不会发生变化。因此考虑初始把所有 $a_i$ 都对 $\text{lcm}(1,2,\ldots,k-1)$ 取模，此时值域 $V$ 变为 $\text{lcm}(1,2,\ldots,k-1)$，$O(kV)$ 的时间复杂度（简单卡常后）就可以通过该题。

至于这里为什么是 $k-1$ 而不是 $k$，你会发现最后一次操作（即 $i=k$ 时）$a$ 数组的变化未被统计到 `ans` 内，所以不需要考虑。

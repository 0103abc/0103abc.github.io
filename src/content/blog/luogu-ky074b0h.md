---
title: "CF888D Almost Identity Permutations 题解"
date: "2024-09-13T11:48:47.000Z"
link: "luogu-ky074b0h"
categories: ["题解"]
tags: ["Codeforces", "数学", "组合数学"]
draft: false
---

$k$ 很小，考虑对 $k$ 的值暴力分讨。

计算出 $F_i$ 表示长度为 $i$ 的排列 $p$ 满足 $\forall j\in [1,i],p_i\neq i$ 的不同排列 $p$ 的数量。有 $F_0=1$，$F_1=0$，$F_2=1$，$F_3=2$，$F_4=9$。

然后枚举 $1\sim k$ 中的每一个 $i$ 钦定排列中有 $i$ 个位置的元素满足 $p_j\neq j$ 另外 $n-i$ 个满足 $p_j=j$。此时有 $F_i\binom{n}{i}$ 种不同的排列满足条件。特殊的 $k=1$ 时答案为 $1$。

因此时间复杂度为 $O(n)$ 可以通过。

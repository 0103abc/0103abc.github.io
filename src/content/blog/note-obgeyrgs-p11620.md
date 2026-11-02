---
title: "P11620 [Ynoi Easy Round 2025] TEST_34 题解"
date: "2025-11-08T14:47:04Z"
link: "note-obgeyrgs-p11620"
categories: ["题解"]
tags: ["洛谷", "数学", "线性代数", "数据结构", "线段树", "基础算法", "差分"]
draft: false
---

前置题目：[P4839 P 哥的桶](https://www.luogu.com.cn/problem/P4839)。

首先知道线性基是可以合并的，且具有交换律。因此容易想到线段树维护区间线性基，但是这样无法支持区间异或的操作。此时容易想到分块处理，但是这样时间复杂度变为 $O(n\sqrt n\omega^2)$ 其中 $\omega$ 为位数这里取 $\omega=32$，一看就不是能过得去的样子。

然后观察到一个特别厉害的性质：在线性基中集合 $\lbrace a_l,a_{l+1},\ldots,a_r\rbrace$ 可以通过选取子集异或表示出的数的集合和 $\lbrace a_l,a_l\oplus a_{l+1},\ldots,a_{r-1}\oplus a_r\rbrace$ 表示出的数的集合是等价的。因此维护 $b_i=a_i\oplus a_{i+1}$ 然后在 $b$ 上操作，这样一来修改操作只需要处理 $l$ 和 $r+1$ 两个端点处的值即可。而查询的时候先求区间线性基，然后再把 $a_l$ 的值添加到线性基里最后统一求值即可。而维护 $a_l$ 这种端点值可以先差分然后丢到一个 BIT 里维护。

总时间复杂度为 $O(n\log^2n\omega)$，可以通过该题。

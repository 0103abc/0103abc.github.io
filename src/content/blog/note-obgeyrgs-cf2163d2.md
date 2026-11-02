---
title: "CF2163D2 Diadrash (Hard Version) 题解"
date: "2025-11-08T14:47:04Z"
link: "note-obgeyrgs-cf2163d2"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/obgeyrgs)。

:::success[MEX 的单调性]
$\text{MEX}(a_1,a_2,\ldots,a_{n-1})\le \text{MEX}(a_1,a_2,\ldots,a_n)$。
:::

:::success[排列上 MEX 的性质]
对于一个给定的区间 $[l,r]$，有 $\text{MEX}(l,r)=\min(\text{MEX}(1,r),\text{MEX}(l,n))$。
:::

请先阅读 D1 题解。

考虑利用上面的两个性质解题，使用二分解决这个问题。对于给定的左端点区间范围 $[l,r]$，找出中点位置 $mid=\frac{l+r}2$，两次询问出 $\text{MEX}(l,n)$ 和 $\text{MEX}(1,r)$ 的值，设两个值分别为 $suf$ 和 $pre$。

根据上面的性质，若有 $pre>suf$，则右侧的答案一定不可能比左侧的答案更大，往左二分处理，否则往右二分处理即可。

询问次数为 $2\log V\le 30$，满足题目限制，可以通过该题。

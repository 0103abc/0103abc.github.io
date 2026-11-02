---
title: "CF2242F Summer Vacation 题解"
date: "2026-07-07T01:38:41.000Z"
link: "luogu-ecphq43e"
categories: ["题解"]
tags: ["Codeforces", "数据结构", "平衡树", "基础算法", "模拟", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ecphq43e)。

记第 $i$ 天的答案为 $f_i$，则考虑从小到大扫描 $i$ 维度并维护 $f_i$ 的变化。对每个 $i$ 而言，先更新 $f_i=0$，然后对 $j\in[1,i-1]$，若 $f_j\ge a_i$ 则 $f_j\leftarrow f_j-a_i$ 否则 $f_j\leftarrow f_j+a_i$。

直接模拟时间复杂度是 $O(n^2)$，考虑优化。容易想到用按值排序的 fhq-treap 来维护，对每个 $i$ 先把整个 treap 分裂成 $\ge a_i$ 和 $<a_i$ 的两个子 treap，然后对第一个 treap 全局减 $a_i$ 第二个 treap 全局加 $a_i$ 再合并两个 treap 即可（注意这里不能直接 merge 两个 treap，需要先选一个 treap 的根然后用这个根的 key 去 split 另外一个 treap）。因为最后还需要知道和下标的对应关系所以 treap 内还需要额外维护一个下标。

时间复杂度为 $O(n\log^2 n)$ 可以通过该题。

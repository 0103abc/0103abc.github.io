---
title: "P5395 第二类斯特林数·行 题解"
date: "2025-11-08T14:47:04Z"
link: "note-obgeyrgs-p5395"
categories: ["题解"]
tags: ["洛谷", "数学", "多项式"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/obgeyrgs)。

这个比上个题简单的不是一点半点吧（）

根据第二类斯特林数的经典通项公式可知：

$$\begin{Bmatrix}n\\m\end{Bmatrix}=\sum\limits_{i=0}^m\frac{i^n(-1)^{m-i}}{i!(m-i)!}$$

令 $A_i=\frac{i^n}{i!},B_i=\frac{(-1)^i}{i!}$，则考虑令 $C=A\odot B$ 即 $C$ 为 $A,B$ 两个数组的卷积，此时上面式子的答案就是 $C_m$。

而题目要求的是一行的第二类斯特林数，容易发现求的就是 $C_0,C_1,\ldots,C_n$ 的值，可以一遍 NTT 卷积求得。总时间复杂度为 $O(n\log n)$ 可以通过该题。

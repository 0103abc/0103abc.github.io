---
title: "CF622F The Sum of the k-th Powers 题解"
date: "2025-11-08T14:47:04Z"
link: "note-obgeyrgs-cf622f"
categories: ["题解"]
tags: ["Codeforces", "数学", "多项式"]
draft: false
---

通过作差可以发现答案是一个 $k+1$ 次多项式的形式，因此想到 Lagrange 插值。将 $x_i=i$（$0\le i\le n$）带入，有：

$$
\begin{aligned}
 &\sum\limits_{i=0}^ny_i\prod\limits_{j\neq i}\frac{x-j}{i-j}\\
=&\sum\limits_{i=0}^ny_i(\prod\limits_{j=0}^{i-1}\frac{x-j}{i-j}\prod\limits_{j=i+1}^n\frac{x-j}{i-j})\\
=&\sum\limits_{i=0}^ny_i(\prod\limits_{j=0}^{i-1}(x-j)\prod\limits_{j=i+1}^n(x-j)\prod\limits_{j=0}^{i-1}\frac1{i-j}\prod\limits_{j=i+1}^n\frac1{i-j})\\
=&\sum\limits_{i=0}^ny_i(-1)^{n-i}\frac1{x!}\frac1{(n-x+2)!}\prod\limits_{j=0}^{i+1}(x-j)\prod\limits_{j=i+1}^n(x-j)
\end{aligned}
$$

后面这两个 $\prod$ 一看就很能预处理，而前面的显然可以直接算。时间复杂度为 $O(n\log n)$。注意到 $i^k$ 是积性函数，所以使用线性筛可以将其优化至严格 $O(n)$ 求解。

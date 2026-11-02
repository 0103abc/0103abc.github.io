---
title: "P5408 第一类斯特林数·行 题解"
date: "2025-11-08T14:47:04Z"
link: "note-obgeyrgs-p5408"
categories: ["题解"]
tags: ["洛谷", "数学", "多项式", "算法思想", "分治", "倍增"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/obgeyrgs)。

考虑用第一类斯特林数的生成函数来解这个问题。设 $f_x(n)$ 是第 $n$ 行第一类斯特林数组成的生成函数，则有：$f_x(n)=\sum\limits_{i=0}^n\begin{bmatrix}n\\i\end{bmatrix}x^i=\prod\limits_{i=0}^{n-1}(x+i)$。

现在要求 $f_x(n)$ 的每一项系数，容易想到用分治 NTT 做到 $O(n\log^2n)$，据说卡卡常能过。这里给出一种 $O(n\log n)$ 求多项式系数的解法。

先考虑 $n=2^p$ 的情况。此时容易想到倍增求解，即用 $f_x(n)$ 的多项式系数直接推出 $f_x(2n)$ 的多项式系数。

可以推式子：

$$
\begin{aligned}
f_x(2n)
&=\prod\limits_{i=0}^{2n-1}(x+i)\\
&=\prod\limits_{i=0}^{n-1}(x+i)\times\prod\limits_{i=0}^{n-1}(x+n+i)\\
&=f_x(n)\times f_{x+n}(n)
\end{aligned}
$$

问题在于求 $f_{x+k}(n)$ 的值。考虑用 $f_x$ 来表示出 $f_{x+k}(n)$ 的值：

$$
\begin{aligned}
f_{x+n}(n)
&=\sum\limits_{i=0}^na_i(x+k)^i\\
&=\sum\limits_{i=0}^na_i\sum\limits_{j=0}^i\binom ijx^jk^{i-j}\\
&=\sum\limits_{j=0}^n\sum\limits_{i=j}^na_i\binom ijx^jk^{i-j}\\
&=\sum\limits_{j=0}^nx^j\sum\limits_{i=j}^na_ik^{i-j}\frac{i!}{j!(i-j)!}\\
&=\sum\limits_{j=0}^n\frac{x^j}{j!}\sum\limits_{i=j}^na_ik^{i-j}\frac{i!}{(i-j)!}\\
&=\sum\limits_{j=0}^n\frac{x^j}{j!}\sum\limits_{i=j}^n(i!a_i)\times(\frac{k^{i-j}}{(i-j)!})
\end{aligned}
$$

设 $A_i=i!a_i,B_i=\frac{k^{i-j}}{(i-j)!}$，则后半段和式是等差卷积的形式，可以翻转 $B$ 数组然后令 $C=A\odot B$（即 $C$ 是 $A,B$ 两个数组的卷积），前半部分的 $\frac1{j!}$ 以及 $A$ 内的 $i!$，$B$ 内的 $i!,k^i$ 等部分都可以线性递推。

然后再考虑 $n\neq 2^p$ 的情况。此时考虑类比快速幂的求法：

+ 若 $2\mid n$，则直接按上面的步骤分治。
+ 否则，先求出 $f(n-1)$ 的值（这个时候必有 $2\mid n-1$ 可以分治处理），然后问题是从 $f(n-1)$ 推出 $f(n)$。这个部分是简单的，给多项式乘一个 $x+n$ 即可，时间复杂度是线性。

考虑使用主定理来分析时间复杂度，有：$T(n)=T(\frac n2)+O(n\log n)=O(n\log n)$，显然可以轻松通过该题。

一个要注意的点是模数 $2^{25}\times5+1$ 的原根为 $3$，不是 $5$。

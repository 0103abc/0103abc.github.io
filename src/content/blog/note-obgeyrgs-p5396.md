---
title: "P5396 第二类斯特林数·列 题解"
date: "2025-11-08T14:47:04Z"
link: "note-obgeyrgs-p5396"
categories: ["题解"]
tags: ["洛谷", "数学", "多项式", "算法思想", "分治"]
draft: false
---

题目要求的东西太别扭了（你猜为什么我 wa 了一发），这里改一下变量名的顺序：

> 给定 $n,k$，对 $i=0\ldots k$，求 $\begin{Bmatrix}i\\n\end{Bmatrix}$ 的值。

第二类斯特林数的生成函数形式是：

$$
F(n)=\sum\limits_i\begin{Bmatrix}i\\n\end{Bmatrix}x^i
$$

考虑推一下式子：

$$
\begin{aligned}
F(n)
&=\sum\limits_i\begin{Bmatrix}i\\n\end{Bmatrix}x^i\\
&=\sum\limits_i(n\begin{Bmatrix}i-1\\n\end{Bmatrix}+\begin{Bmatrix}i-1\\n-1\end{Bmatrix})x^i\\
&=n\sum\limits_i\begin{Bmatrix}i-1\\n\end{Bmatrix}x^i+\sum\limits_i\begin{Bmatrix}i-1\\n-1\end{Bmatrix}x^i\\
&=n\sum\limits_i\begin{Bmatrix}i\\n\end{Bmatrix}x^{i+1}+\sum\limits_i\begin{Bmatrix}i\\n-1\end{Bmatrix}x^{i+1}\\
&=x(nF(n)+F(n-1))\\
\end{aligned}
$$

即 $F(n)=xnF(n)+xF(n-1)$，移项可得 $(1-xn)F(n)=xF(n-1)$ 即 $F(n)=\frac{xF(n-1)}{1-xn}$。

这是一个递推式的形式，考虑直接求出其通项。显然有 $F(n)=\dfrac{x^n}{\prod\limits_{i=1}^n(1-ix)}=x^n\times(\prod\limits_{i=1}^n(1-ix))^{-1}$。

前面的 $x^n$ 就是多项式整体平移 $n$ 位，可以先不考虑，因此只剩下后半部分的 $(\prod\limits_{i=1}^n(1-ix))^{-1}$ 要求。而这个东西的内层显然可以分治卷积做到 $O(n\log^2n)$ 求解，外层就套一个多项式求逆即可。总时间复杂度为 $O(n\log^2n)$，可以通过。

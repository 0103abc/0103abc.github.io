---
title: "CF1623D Robot Cleaner Revisit 题解"
date: "2025-01-30T03:30:38.000Z"
link: "luogu-lfvuep31"
categories: ["题解"]
tags: ["Codeforces", "数学", "概率与期望"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/lfvuep31)。

考虑到平面中所有不同合法状态数不超过 $4nm$（当前点横纵坐标 / 当前偏移量），因此可以直接暴力找出从当前点开始机器人会移动的路径，该路径的长度不超过 $4nm$。设该路径 $L$ 中包含的坐标分别为 $(x_1,y_1),(x_2,y_2),\ldots,(x_k,y_k)$。那么对于每一个坐标 $(x_i,y_i)$：

+ 若 $(x_i,y_i)$ 和目标坐标在同一行 / 同一列上，那么有 $\frac{p}{100}$ 的概率完成，$\frac{100-p}{100}$ 的概率完不成。
+ 若 $(x_i,y_i)$ 和目标坐标不在同一行 / 同一列上，那么有 $0$ 的概率完成，$1$ 的概率完不成。

考虑设 $p_i$ 表示 $(x_i,y_i)$ **完不成**目标的概率，那么可以设答案是 $x$，然后列出方程：

$$
x=p_1(1+p_2(1+p_3(\ldots(1+p_k(1+x)))))
$$

但是这个方程中存在环，无法直接转移。因此套路的拆括号，得到：

$$
x=p_1+p_1p_2+p_1p_2p_3+\ldots+p_1p_2p_3\ldots p_k+p_1p_2p_3\ldots p_kx
$$

移项得：

$$
(1-p_1p_2p_3\ldots p_k)x=p_1+p_1p_2+p_1p_2p_3+\ldots+p_1p_2p_3\ldots p_k
$$

把左边这个东西除到右边，得到：

$$
x=\frac{p_1+p_1p_2+p_1p_2p_3+\ldots+p_1p_2p_3\ldots p_k}{1-p_1p_2p_3\ldots p_k}
$$

即：

$$
x=\frac{\sum\limits_{i=1}^n\prod\limits_{j=1}^ip_i}{1-\prod\limits_{i=1}^kp_i}
$$

下面这个东西可以直接算，上面部分直接算是 $O(n^2)$ 的，因此考虑设 $f_i=\prod\limits_{j=1}^i p_j$，那么上面部分变为：

$$
\sum\limits_{i=1}^n f_i
$$

此时上下部分都可以 $O(n)$ 计算答案，因此做完了。

[代码](https://codeforces.com/contest/1623/submission/303594398)。

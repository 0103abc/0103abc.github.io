---
title: "CF850D Tournament Construction 题解"
date: "2026-03-20T05:49:58.000Z"
link: "luogu-n4xalum2"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "算法思想", "构造"]
draft: false
---

感觉知道 Landau 定理之后就很简单（）

#### 前置知识

Landau 定理：一个长度为 $n$ 的序列 $a_1,a_2,\ldots,a_n$ 是竞赛图每点出度从小到大排列的序列，当且仅当下面两个条件同时满足：

+ $\sum\limits_{i=1}^n a_i=\frac{n(n-1)}2$
+ $\sum\limits_{i=1}^j a_i\ge\frac{j(j-1)}2$（$1\le j\le n$）

#### 题解

对 $n$ 个点的竞赛图，记 $\deg_i$ 表示 $i$ 点的出度大小，则图上边的数量即为 $\sum\limits_{i=1}^n\deg_i=\frac{n(n-1)}2$。因为题目的数据范围中保证了图上边的总数量不超过 $30n$，解不等式可得 $n\le 61$ 一定可以满足条件。

因此考虑直接 dp：设 $f_{i,j,k}$ 表示当前处理到了 $i$ 号点，当前点的数量为 $j$，边的数量为 $k$，是否合法。转移直接枚举 $i$ 号点增加的边的数量即可，构造方案在 dp 过程中记录转移路径然后利用 Landau 定理随便构造即可。

总时间复杂度为 $O(n^5)$，但是跑不满所以可以通过。

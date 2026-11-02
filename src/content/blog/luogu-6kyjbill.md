---
title: "CF1884D Counting Rhyme 题解"
date: "2024-10-23T12:46:26.000Z"
link: "luogu-6kyjbill"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论"]
draft: false
---

套路题。考虑设函数 $F(i)$：

+ $F(i)=1$，$\exists j\in[1,n]\cap\mathbb{N_+},a_j\mid i$。
+ $F(i)=0$，$\forall j\in[1,n]\cap\mathbb{N_+},a_j\nmid i$。

然后发现 $(i,j)$ 为 `Good-Pairs` 的充要条件是 $F(\gcd(a_i,a_j))=1$。因此答案为：

$$
\sum\limits_{i=1}^n
\sum\limits_{j=i+1}^n
F(\gcd(a_i,a_j))
$$

考虑套路：

$$\sum\limits_{g=1}^n\sum\limits_{i=1}^n\sum\limits_{j=i+1}^n F(\gcd(a_i,a_j))[\gcd(a_i,a_j)=g]$$

怎么变成了 $O(n^3)$？没关系！

$$\sum\limits_{g=1}^n\sum\limits_{i=1}^n\sum\limits_{j=i+1}^n F(g)[\gcd(a_i,a_j)=g]$$

$$\sum\limits_{g=1}^nF(g)\sum\limits_{i=1}^n\sum\limits_{j=i+1}^n [\gcd(a_i,a_j)=g]$$

令 $G(g)$ 表示 $\sum\limits_{i=1}^n\sum\limits_{j=i+1}^n [\gcd(a_i,a_j)=g]$ 的值。此时答案为：

$$\sum\limits_{g=1}^nF(g)G(g)$$

问题变为求 $G(g)$ 的值。~~[前几天不是刚做了一个一模一样的题吗](https://www.luogu.com.cn/article/thh7fj72)~~？

于是在调和级数时间复杂度内解决问题（$O(n\log n)$）。

---
title: "CF1734F Zeros and Ones 题解"
date: "2026-03-14T03:25:09.000Z"
link: "luogu-ttywbar3"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "数位动态规划"]
draft: false
---

首先有一个[经典结论](https://www.luogu.com.cn/problem/P3949)是 Thue-Morse 序列的第 $i$ 项的值就是 $\operatorname{parity}(i)$。因此题目中给出的询问操作其实就是问 $\sum\limits_{i=0}^{m-1}\operatorname{parity}(i\oplus(i+n))$。

记 $S(m,n)=\sum\limits_{i=0}^{m-1}\text{parity}(i\oplus(i+n))$。考虑到有 $\text{parity}(2x)=1-\text{parity}(2x+1)=\text{parity}(x)$。因此考虑按照 $n,m$ 的奇偶性分别讨论计算答案：

+ $2\mid n$：记 $n=2k,m=2q+r$（$r\in\lbrace0,1\rbrace$），则有 $S(m,2k)=2S(q,k)+r\text{parity}(q\oplus(q+k))$。
+ $2\nmid n$：记 $n=2k+1,m=2q+r$（$r\in\lbrace 0,1\rbrace$），则有 $S(m,2k+1)=2q-S(q,k)-S(q,k+1)+r(1-\text{parity}(q\oplus(q+k)))$。

边界条件是 $S(0,n)=S(m,0)=0$，记忆化搜索就可以做到 $O(\log^2n)$ 处理单组数据。

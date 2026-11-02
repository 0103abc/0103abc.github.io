---
title: "P6130 随机红包 题解"
date: "2025-11-08T14:47:04Z"
link: "note-obgeyrgs-p6130"
categories: ["题解"]
tags: ["洛谷", "基础算法", "前缀和"]
draft: false
---

~~积分我哪会啊，已严肃背过结论~~

答案是 $\large\frac1n\sum\limits_{i=n-k+1}^i\frac1i$，线性递推出逆元然后用前缀和就可以做到 $O(n)-O(1)$。

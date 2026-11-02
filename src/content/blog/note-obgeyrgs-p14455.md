---
title: "P14455 [ICPC 2025 Xi'an R] Imagined Holly 题解"
date: "2025-11-08T14:47:04Z"
link: "note-obgeyrgs-p14455"
categories: ["题解"]
tags: ["洛谷", "数学", "概率与期望"]
draft: false
---

挺有意思的题。**注意到两个点 $u,v$ 相邻时，必然满足对于任意一个点 $x$，都有 $\text{dist}(u,v)=\text{dist}(u,x)\oplus\text{dist}(v,x)$**。

然后随便咋做就都能过了（比如说随机一个排列 $p$ 然后按照 $p$ 的顺序给每个点对暴力判一下，期望对不合法边判 $O(1)$ 次，对合法边判 $O(n)$ 次，总时间复杂度即为 $O(n^2)$）。

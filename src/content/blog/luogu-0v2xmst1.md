---
title: "CF1553F Pairwise Modulo 题解"
date: "2025-01-12T02:34:40.000Z"
link: "luogu-0v2xmst1"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论"]
draft: false
---

考虑推式子。有转移：

$$
p_i=p_{i-1}+(\red{\sum\limits_{j=1}^{i-1}p_i\bmod p_j})+(\green{\sum\limits_{j=1}^{i-1}p_j\bmod p_i})
$$

其中：

+ 绿色部分经典转化：

$$
\begin{aligned}
 &\sum\limits_{j=1}^{i-1}p_j\bmod p_i
\end{aligned}
$$

可以考虑枚举 $p_j\in[kp_i,(k+1)p_i)$ 区间，求个和然后计数答案，因为 $p_i$ 互不相同，所以要枚举的数的数目最多是调和级数级别的，所以维护两个单点加区间求和的 ds 如 BIT 做就行了。

+ 红色部分经典转化：

$$
\begin{aligned}
 & \sum\limits_{j=1}^{i-1}p_i\bmod p_j\\
=& \sum\limits_{j=1}^{i-1}(p_i-\lfloor\frac{p_i}{p_j}\rfloor\times p_j)\\
=& (\blue{\sum\limits_{j=1}^{i-1}p_i})-(\orange{\sum\limits_{j=1}^{i-1}\lfloor\frac{p_i}{p_j}\rfloor\times p_j})
\end{aligned}
$$

其中蓝色部分 $\sum\limits_{j=1}^{i-1}p_i$ 直接算就行，而橙色部分左侧的 $\lfloor\frac{p_i}{p_j}\rfloor$ 只有不超过 $\lfloor\frac{p_i}{p_j}\rfloor$ 个不同取值，又因为 $p_1,p_2,p_3,\ldots,p_n$ 的值两两不同，因此总不同取值数量是调和级数级别的。此时直接按坐标的值暴力处理，然后要求一段区间内已经被加入的元素的和。单点加区间求和考虑 BIT 维护，于是做完了，时间复杂度为 $O(n\log^2n)$ 可以通过。

[代码](https://codeforces.com/contest/1553/submission/300577218)。

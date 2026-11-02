---
title: "CF2163D1 Diadrash (Easy Version) 题解"
date: "2025-11-08T14:47:04Z"
link: "note-obgeyrgs-cf2163d1"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "分治"]
draft: false
---

如果你不会做这个题，请注意题目询问的限制条件求的是 $\max$ 而不是 $\min$（）我绷不住了

$\text{mex}$ 运算有一些比较有用的性质，例如：在任意一个给定的序列 $a$ 中，$\text{mex}(l:r)\le \text{mex}(l:r+1)$ 必然成立。而在本题中，因为给出的 $a$ 是一个 $0\sim n-1$ 的排列，所以必然只存在一个值为 $0$ 的位置。

$Q$ 次询问求答案是简单的。先考虑如何优化到 $n$ 次询问求解：

:::success[使用 $n$ 次询问求答案]
根据上面的第一条性质，因为要求的是 $\text{mex}$ 值最大的区间，所以对于同一个 $l$ 而言，只需要保留这些区间中 $r$ 最大的区间即可。这样一来剩余 $n$ 个区间，直接全部询问一遍即可。
:::

然后考虑利用第二个性质继续优化。

:::success[使用 $\lceil\frac n2\rceil+1$ 次操作求答案]
假设目前已经确定了序列中 $0$ 的位置是 $p$，那么这个时候若一个询问区间 $[l,r]$ 满足 $p\not\in[l,r]$，那么该区间的 $\text{mex}$ 值一定为 $0$，不再需要询问。在只保留 $n$ 个区间时：

+ 若 $p\le\lfloor\frac n2\rfloor$，则此时左端点在 $p$ 左侧的区间不超过 $\lfloor\frac n2\rfloor$ 个。
+ 若 $p>\lfloor\frac n2\rfloor$，则此时右端点在 $p$ 右侧的区间不超过 $\lfloor\frac n2\rfloor$ 个。

问题在于如何确定 $p$。直接分治需要问 $O(\log n)$ 次，但是容易发现其实不需要知道 $p$ 的具体位置，只需要知道 $p$ 是在序列的左半边还是在序列的右半边即可，因此只需要询问区间 $[1,\lfloor\frac n2\rfloor]$ 判断该区间的 $\text{mex}$ 值是否为 $0$ 即可。总询问次数为 $\lceil\frac n2\rceil+1$，可以通过该题。
:::

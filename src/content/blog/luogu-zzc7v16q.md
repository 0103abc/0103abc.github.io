---
title: "CF2081D MST in Modulo Graph 题解"
date: "2025-03-20T11:51:59.000Z"
link: "luogu-zzc7v16q"
categories: ["题解"]
tags: ["Codeforces", "图论", "最小生成树"]
draft: false
---

感觉这场题质量很高的说，但是 unr 了（

考虑对于三个数 $x,y,z$，若其满足 $x\le y\le z<2x$，且现在需要组合这三个点，则此时组合 $(x,y),(y,z)$ 一定不会比组合 $(x,y),(x,z)$ 差。

因此这个题就做完了。对于每一个 $i$ 枚举其 $j$ 倍然后找到所有在 $[a_ij,a_i(j+1))$ 之间的点中最小的值和其连边，此时边数是调和级数的。直接暴力建图跑 Kruskal 时间复杂度为 $O(n\log^2n)$ 可以通过。

[代码](https://codeforces.com/contest/2081/submission/311525872)。

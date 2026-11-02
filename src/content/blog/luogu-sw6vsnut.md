---
title: "CF1470D Strange Housing 题解"
date: "2025-01-01T12:58:49.000Z"
link: "luogu-sw6vsnut"
categories: ["题解"]
tags: ["Codeforces", "搜索", "深度优先搜索", "基础算法", "贪心", "图论", "树"]
draft: false
---

图不连通肯定不满足条件。下面的分析均基于“图连通”这一条件。

考虑在图中任意选择一棵生成树 $T$，并对其在满足 $1$ 条件的情况下，按照 dfs 顺序贪心的让当前访问到的结点尽可能的上色。此时只需要想办法让其满足 $2$ 条件。然后可以惊喜的发现此时这个生成树上不存在一条边 $u\Leftrightarrow v$，使得 $u,v$ 均未上色。也就是说删除之后生成树 $T$ 仍然不会发生变化。此时图一定仍然连通。于是做完了，时间复杂度 $O(n)$。

[AC Code](https://codeforces.com/contest/1470/submission/299255533)。

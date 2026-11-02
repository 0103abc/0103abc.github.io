---
title: "CF1045C Hyperspace Highways 题解"
date: "2025-03-19T11:36:01.000Z"
link: "luogu-fbolcpb6"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "倍增"]
draft: false
---

#### 007. Hyperspace Highways

简单的。图为 semi-仙人掌，即把仙人掌中的环变为了连通子图。但是做法仍然是相似的。还是建立圆方树，这里把一个连通子图建立一个方点作为辅助，然后该子图中所有的点向这个方点连一条边权为 $1$ 的边，两个圆点之间连边权为 $2$ 的边。

此时得到了一个带权树，对于每一组询问 $a,b$，可以提前处理倍增数组然后直接倍增处理两点之间唯一路径的长度，将这个长度除以 $2$ 即为答案。时间复杂度为 $O(n\log n)$，可以通过。

[CF 题就直接放提交记录啦！](https://codeforces.com/contest/1045/submission/311356629)

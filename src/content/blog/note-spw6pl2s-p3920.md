---
title: "P3920 [WC2014] 紫荆花之恋 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p3920"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "数据结构", "平衡树"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P3920).
:::

:::info[Solution]{open}
问题可以被转化为：多次在线加入叶子结点，查询有多少对 $(u,v)$ 满足 $\operatorname{dist}(u,v)\le r_u+r_v$。

直接暴力是 $O(n^3)$ 的。容易发现加入新的叶子结点后，原有结点之间的关系不会发生变化。因此只需要统计新叶子结点和已有叶子结点之间的关系，时间复杂度可以被优化到 $O(n^2)$。

先考虑如果没有加入叶子操作怎么做。套路的建点分树。对点分树上的一个结点 $x$ 记其在点分树子树中所有子结点集合为 $S_x$（点分树太有性质了）。设 $u,v$ 两个点在点分树上的 LCA 为 $c$ 点，则根据点分树的性质，原树上 $u,v$ 的路径一定经过 $c$ 点。因此必有 $\operatorname{dist}(u,v)=\operatorname{dist}(u,c)+\operatorname{dist}(v,c)$。因此 $u,v$ 两个点被统计入答案的条件可以被看作是 $\operatorname{dist}(u,c)+\operatorname{dist}(v,c)\le r_u+r_v$，分离 $u,v$ 信息可得 $\operatorname{dist}(v,c)-r_v\le r_u-\operatorname{dist}(u,c)$。

若 $u$ 点和其在点分树上的祖先结点 $c$ 点均已确定，则不等式右侧的 $r_u-\operatorname{dist}(u,c)$ 必然是定值。因此只需要在 $c$ 处维护所有旧点 $v$ 的值 $\operatorname{dist}(v,c)-r_v$，然后查询其中有多少个值不超过 $r_u-\operatorname{dist}(u,c)$ 即可。为了方便，后面记 $all_i=\lbrace\operatorname{dist}(v,c)-r_v\mid v\in S_c\rbrace$，上述的查询可以把 $all_i$ 看作一个黑盒数据结构然后做查询。

但是这样答案会算重。假设当前从 $u$ 点向上走，当前到达的点是 $c$，上一个到达的点是 $x$，则 $x$ 的点分树子树和 $u$ 位于 $c$ 的同一个分支，在 $c$ 这一层再次统计会被算重。因此考虑再维护 $sub_i=\lbrace \operatorname{dist}(v,cfa_i)-r_v\rbrace$，其中 $cfa_i$ 表示 $i$ 点在点分树上的父结点。

其中 $v$ 点会遍历 $i$ 点在点分树中以其为根子树内所有结点。查询到 $c$ 时，先加上 $all_c$ 的答案，再减去 $sub_c$ 的答案，这样每个旧点恰好在她和 $u$ 的点分树 LCA 位置被统计一次。

现在考虑加叶子操作怎么处理。很明显没法加入一个叶子结点就重新建一次点分树。考虑操作分块，每次加入一个新叶子 $u$ 时临时的令 $cfa_u=p$（其中 $p$ 是 $u$ 点在原树上的父结点），然后每 $B$ 次加叶子就重构一次点分树。但是时间复杂度过高，难以接受。

考虑类比替罪羊树的结构，记 $\alpha$ 为定期重构阈值，若点分树上某个点 $x$ 连向其父亲结点 $f$ 的边满足 $\frac{siz_x}{siz_f}\ge \alpha$，则说明 $f$ 点为根的点分数子树失衡。考虑动态维护这个失衡关系，每次加入叶子结点后，直接暴力在点分树上向上跳找到路径上最高的失衡结点，然后把以该结点为根的点分树子树暴力重构即可。这里 $\alpha$ 取 $0.75$。

前面所提到的黑盒数据结构很显然可以使用平衡树来维护。为了方便实现，代码中使用了 pbds 中的平衡树。

可以和证明替罪羊树时间复杂度一样，证明上述算法的时间复杂度为 $O(n\log^2n)$。
:::

难度：黑

鲜活指数：8

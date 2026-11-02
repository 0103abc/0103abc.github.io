---
title: "P15653 [省选联考 2026] 星图 题解"
date: "2026-03-13T03:06:55.000Z"
link: "luogu-sv1whz4s"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/sv1whz4s)。

建议先完成 [ARC205B](https://www.luogu.com.cn/problem/AT_arc205_b)，[P9841](https://www.luogu.com.cn/problem/P9841)（比较重要）和 [P14025](https://www.luogu.com.cn/problem/P14025)。

其实也可以算是一类造计算机题？

直接在原图上维护操作是困难的，套路的考虑在图的反图上执行操作，这样问题转化为要求执行操作使得最终图上边的数量最少。


## 光轨数量的最大值

为了方便计算，该部分的讨论都将在原图的补图上进行。

考虑从奇偶性的方向入手。注意到若一次恰好可以选择 $k$ 个点并对其执行操作，则 $k=2$ 需要单独讨论。当 $k>2$ 时：

+ $k\equiv 0\pmod 4$，此时点的度数的奇偶性不会发生变化，但边的数量的奇偶性会发生变化，因此此时最少剩下的边的数量即为 $[2\nmid m]$。
+ $k\equiv 1\pmod 4$，此时点的度数的奇偶性会发生变化，且边的数量的奇偶性也会发生变化。此时需要进一步分类讨论：
  + 若 $[2\mid m]=[2\mid\frac{\sum\limits_{i=1}^n[2\nmid\deg_i]}2]$，则此时显然可以在不改变奇偶性的前提下把边数删到答案下界 $\frac{\sum\limits_{i=1}^n[2\nmid\deg_i]}2$。
  + 否则：
    + 若图上所有点的度数都为偶数，则此时最小可以达到的答案是 $3$。
    + 若图上存在点的度数是奇数，则此时最小可以达到的答案为 $\frac{\sum\limits_{i=1}^n[2\nmid\deg_i]}2+1$。
+ $k\equiv 2\pmod 4$，此时点的度数的奇偶性不会发生变化，且边的数量的奇偶性也不会发生变化，因此此时最少剩下的边的数量即为 $0$。
+ $k\equiv 3\pmod 4$，此时点的度数的奇偶性会发生变化，但边的数量的奇偶性不会发生变化。最后剩下的边一定是若干个奇数度数的点两两匹配，答案即为 $\frac{\sum\limits_{i=1}^n[2\nmid\deg_i]}2$。

而 $k=2$ 显然是简单的，必然可以在补图上删空所有的边。

最后用总数 $\frac{n(n-1)}2$ 减去上面得到的答案就可以得到最终结果。

## 构造流程

考虑先从特殊情况入手：

### 0x01 $k=2$

显然每次操作一条被连起来的边就可以删除该边。

### 0x02 $k=3$

此时操作形如每次反转一个三元环。容易想到先简单消去图上所有的环，得到一个森林。

然后对于森林上每一个非单独结点组成的树结构，均可以通过下面的操作让该树最终剩下恰好一条边：

+ 选择三个点 $u,v,w$ 满足当前树上存在一条 $u\leftrightarrow v\leftrightarrow w$ 的链。
+ 对 $u,v,w$ 三个点做一次操作，此时 $v$ 点脱离树结构成为单独点，$u,w$ 两点之间连了一条边。

容易发现这样恰好可以取到前面分析 $k=2$ 部分的答案下界，因此该构造方案可以证明为最优解。

---

剩下 $k>3$ 的情况。此时考虑先讨论如何构造出简单结构的操作：

### 0x11 长度为 $4$ 的环

考虑类比 [P9841](https://www.luogu.com.cn/article/gn3ssr8u) 的套路，通过调用若干次操作得到一个比较简单的操作形式。

考虑执行下面的 $4$ 次操作：

+ Step $1$：$x_1,x_2,\ldots,x_{k-2},i,j$
+ Step $2$：$x_1,x_2,\ldots,x_{k-2},j,k$
+ Step $3$：$x_1,x_2,\ldots,x_{k-2},k,p$
+ Step $4$：$x_1,x_2,\ldots,x_{k-2},p,i$

执行上面的 $4$ 次操作后，$x_1,x_2,\ldots,x_{k-2}$ 每个点都和 $x$ 内其余点边的关系发生了 $4$ 次反转（即没有发生变化），和 $i,j,k,p$ 四个点的边的关系发生了 $2$ 次反转（即没有发生变化）。而 $i\leftrightarrow j,j\leftrightarrow k,k\leftrightarrow p,p\leftrightarrow i$ 四条边则恰好被反转了一次（即发生了变化）。

### 0x12 长度为 $n$ 个点的环（$2\mid n$）

这里为了简化操作，定义一个长度为 $n$ 的点的环形如：

+ 对于任意整数 $i$ 满足 $1\le i<n$，$i,i+1$ 两点之间都有一条边。
+ $1,n$ 两点间有一条边。

考虑分类讨论，考虑下面的策略：

+ 选择 $1,2,3,4$ 四个点执行 $K_4$ 的操作，这样 $2,3$ 两个点可以单独脱离环，然后 $1,4$ 两个点会多出一条连边，得到形如 $1-4-5-6-\ldots-n-1$ 的环。这个操作可以每次从环上单独分离出两个点。
+ 重复执行上述操作直到环上点数量 $\le 4$ 为止。

此时因为 $2\mid n$ 所以最终会获得一个长度为 $4$ 的环，直接执行一次上面给出的操作就可以把所有点全部分离，最终剩余 $0$ 条边。

### 0x13 $u\leftrightarrow v\leftrightarrow w$ 的链（$2\mid k$）

目标是在图中反转 $u\leftrightarrow v,v\leftrightarrow w$ 两条边。考虑先执行下面的操作：

+ Step $1$：$x_1,x_2,\ldots,x_{k-2},u,v$
+ Step $2$：$x_1,x_2,\ldots,x_{k-2},v,w$

此时 $u\leftrightarrow v,v\leftrightarrow w$ 两条边都被反转了，但是此时还额外反转了 $u\leftrightarrow x_i,v\leftrightarrow x_i$（$1\le i\le k-2$）这两类边。问题转为再反转一次 $u\leftrightarrow x_i,v\leftrightarrow x_i$ 的边。

此时通过 $2\mid k$ 可以推导出 $2\mid k-2$。因此考虑把 $k-2$ 个点分成 $\frac k2-1$ 组，第 $i$ 组点是 $(x_{2i-1},x_{2i})$。然后考虑使用一开始的“长度为 $4$ 的环”操作，第 $i$ 次操作反转 $(u,x_{2i}-1,v,x_{2i})$ 四个点组成的四元环，这样每条多余的边都恰好被反转了一次。最终被反转的边就是 $u\leftrightarrow v$ 和 $v\leftrightarrow w$。

### 0x14 $(u,v),(u,w),(v,w),(i,j),(i,k),(j,k)$ 六条边（两个 $K_3$）

考虑执行下面的操作：

+ Step $1$：$x_1,x_2,\ldots,x_{k-2},u,v$
+ Step $2$：$x_1,x_2,\ldots,x_{k-2},u,w$
+ Step $3$：$x_1,x_2,\ldots,x_{k-2},v,w$

此时 $u\leftrightarrow v,v\leftrightarrow w,u\leftrightarrow w$ 三条边均被反转。但是同时 $x_i\leftrightarrow x_j$（$1\le i<j\le n$）这条边也被反转了。但是注意到现在想要构造的操作其实可以看作是两个 $K_3$ 拼凑起来，现在 $u\leftrightarrow v,v\leftrightarrow w,u\leftrightarrow w$ 这三条边已经得到了一个 $K_3$，而反转具有自反性，因此可以考虑再将上面的操作执行一次得到第二个 $K_3$ 并消去所有额外的边：

+ Step $4$：$x_1,x_2,\ldots,x_{k-2},i,j$
+ Step $5$：$x_1,x_2,\ldots,x_{k-2},i,k$
+ Step $6$：$x_1,x_2,\ldots,x_{k-2},j,k$

此时所有 $x_i\leftrightarrow x_j$（$1\le i<j\le n$）都又一次被反转了，因此两个反转操作被抵消掉。而此时 $i\leftrightarrow j,i\leftrightarrow k,j\leftrightarrow k$ 三条边则同样被反转一次。因此最后 $u\leftrightarrow v,v\leftrightarrow w,u\leftrightarrow w,i\leftrightarrow j,i\leftrightarrow k,j\leftrightarrow k$ 这六条边恰好分别被反转一次，其余边均未被反转，也就是反转了两个 $K_3$ 形态的子图。

注意到此时有 $k-2$ 个辅助点，加上 $6$ 个需要反转操作的点一共需要使用 $k-2+4=k+4$ 个点，因此只有 $k+4\le n$ 即 $k\le n-4$ 时才可以使用该操作。

### 0x15 $(u,v),(u,w),(v,w),(w,i),(w,j),(i,j)$ 六条边

~~和 0x14 部分本质相同，此时只需要 $k\le n-3$ 就可以执行该操作。~~

其实这个地方是可以和 $k$ 的取值无关的！其实利用 0x11 中给出的反转四元环操作就可以生成出该操作：

+ Step $1$：用 0x11 给出的操作反转 $u,v,i,j$ 四个点组成的四元环。
+ Step $2$：用 0x11 给出的操作反转 $u,w,v,i$ 四个点组成的四元环。

容易发现此时恰好反转了 $u\leftrightarrow v,v\leftrightarrow w,u\leftrightarrow w,w\leftrightarrow i,w\leftrightarrow j,i\leftrightarrow j$ 六条边。

该结构的最大优势是处理 $2\nmid k$ 的情况。

## 解决原问题

### 0x21 把原图化为特殊形态

前面已经特判掉了 $k\le 3$ 的情况，因此本部分只需要解决 $k>3$ 即可。

此时考虑先从图中找出三个关键点 $i,j,k$，并对图进行一些操作，使得图上所有二元组 $(x,y)$ 若满足不存在 $x\leftrightarrow y$ 的边，则这样的二元组 $(x,y)$ 必然还满足下面两条之一：

+ $x=i,y=j$ 或 $x=j,y=i$
+ $x=k$ 或 $y=k$

下面考虑如何执行操作可以得到这种图。考虑执行下面的操作：

+ 对于每两个点 $x,y$ 满足 $x\neq i,x\neq j,y\neq i,y\neq j,x\neq y$，若图上当前没有连接 $x,y$ 两个点的边，则考虑继续分类讨论（$1$）：
  + 若图上存在点 $z$ 满足 $z\neq a,z\neq b,z\neq x,z\neq y$ 且 $x$ 和 $z$ 之间不存在边相连，则反转 $z,x,y,i$ 四个点组成的四元环。
  + 否则，若图上存在点 $z$ 满足 $z\neq a,z\neq b,z\neq x,z\neq y$ 且 $y$ 和 $z$ 不存在边相连，则反转 $x,y,z,i$ 四个点组成的四元环。
  + 否则，直接反转 $x,y,i,j$ 四个点组成的四元环。
+ 对于每个点 $x$ 满足 $x\neq i,x\neq j,x\neq k$，考虑分类讨论 $x$ 和 $i,j$ 两点的连边关系（$2$）：
  + 若 $x$ 和 $i,j$ 两点都连了边，则不进行任何处理。
  + 否则，若 $x$ 和 $i,j$ 两点都没有连边，则对 $i,x,j,k$ 四个点执行一次 0x11 给出的操作即可。
  + 否则，若 $x$ 和 $i$ 没有连边，则对 $i,x,k,j$ 四个点执行一次 0x11 给出的操作即可。
  + 否则（即只有 $x$ 和 $j$ 没有连边），则对 $j,x,k,i$ 四个点执行一次 0x11 给出的操作即可。

现在理性的分析一下上面给出的流程都干了什么事。这里为了方便描述，将上述流程分为 $1,2$ 两个部分分别处理。

对于流程 $1$ 而言：每一次都把端点不为 $x,y$ 的不存在的边连接，并删除了对应的以 $x,y$ 为端点的边。在该流程结束后对于所有不存在连边的 $x,y$ 都有 $i=x$ 或 $i=y$ 或 $j=x$ 或 $j=y$。

对于流程 $2$ 而言：对于原来可能存在的不存在的边 $(x,i),(x,j)$ 进行一次包含其的四元环操作后，$(x,i),(x,j)$ 之间的边会被连上，而被删除的边一定形如 $(x,k),(i,j),(i,k),(j,k)$ 中的一类。

此时显然可以达成该部分想要达成的目标。

---

考虑回到问题的开始。在这片题解的最初通过对 $k\bmod 4$ 的值分类讨论得到了答案的上界，下面考虑继续对 $k\bmod 4$ 的值分类讨论并给出最终的构造方案（顺便也证明可以取到答案上界）。

### 0x22 $k\equiv 2\pmod 4$

从最简单的情况入手讨论。

此时既没有边数量奇偶性的约束条件，也没有点度数的奇偶性约束条件。

这里先考虑没有被连的边的数量是偶数的情况。

考虑在 0x21 部分中找出三个关键点 $i,j,k$ 后，先将 $i,j$ 两个点连起来（直接用 0x13 操作反转 $i\leftrightarrow j,j\leftrightarrow k$ 两条边即可）。

此时所有二元组 $(x,y)$ 满足 $x,y$ 之间没有边相连当且仅当 $x=k$ 或 $y=k$。因为此时没有连的边的数量是偶数所以直接给所有没有连的边另一端点两两分组匹配然后用 0x13 操作反转两条边即可。

而如果没有被连的边的数量是奇数，则在 0x21 修改图的形态之前，直接随便选 $k$ 个点执行一次操作即可（容易发现 0x21 部分不会修改边的数量的奇偶性）。

### 0x23 $k\equiv 0\pmod 4$

其实和 0x22 没有本质区别？

把 0x22 里第一步调整没有被连的边的奇偶性那一步删掉，后面的部分完全是一样的。

### 0x24 $k\equiv 3\pmod 4$

这里先考虑没有被连的边的数量是偶数的情况。

考虑在 0x21 部分中找出三个关键点 $i,j,k$ 后，先将 $i,j$ 两个点连起来（直接用 0x13 操作反转 $i\leftrightarrow j,j\leftrightarrow k$ 两条边即可）。

此时所有二元组 $(x,y)$ 满足 $x,y$ 之间没有边相连当且仅当 $x=k$ 或 $y=k$。因为此时没有连的边的数量是偶数所以直接给所有没有连的边另一端点两两分组匹配然后用 0x13 操作反转两条边即可。

但是此时仍然没有达到答案的下界，需要进一步进行操作：

+ 若存在四个点 $x,y,z,w$ 满足 $x\leftrightarrow k,y\leftrightarrow k,z\leftrightarrow k,w\leftrightarrow k$ 四条边都不在图中存在，那么用前面 0x15 的操作反转 $k\leftrightarrow x,k\leftrightarrow y,k\leftrightarrow z,k\leftrightarrow w,x\leftrightarrow y,z\leftrightarrow w$ 这六条边。
+ 此时，若 $x,y$ 两点还满足 $x\leftrightarrow k,y\leftrightarrow k$ 两条边都不存在，且 $i,j,k$ 三个点得到的三条边只有不超过一条边存在，那么用前面 0x15 的操作反转 $k\leftrightarrow i,k\leftrightarrow j,k\leftrightarrow x,k\leftrightarrow y,i\leftrightarrow j,x\leftrightarrow y$ 这六条边即可。

这一步操作可以尽可能的减少图上任意一点 $x$ 和选出的关键点 $k$ 之间不存在边的 $x$ 的数目。但是此时出现了两端点都不是 $k$ 的边不存在的情况，因此还需要再打一次补丁。考虑观察此时图的性质，容易发现此时图上边的数量一定为偶数条，且用上述方法两端点都不为 $k$ 的不存在的边的数量一定是偶数。因此考虑再执行下面的操作：

+ 若对于图上的结点 $x$，$i\leftrightarrow j,i\leftrightarrow k,j\leftrightarrow k,x\leftrightarrow k$ 四条边都没有连，那么考虑找出 $x,i,j,k$ 之外的任意一点 $y$。
+ 此时考虑用操作 0x15 来反转 $i\leftrightarrow j,i\leftrightarrow k,j\leftrightarrow k,k\leftrightarrow x,k\leftrightarrow y,x\leftrightarrow y$ 六条边（即补齐 $i,j,k$ 三角形上的边以及一条 $k$ 连向外部的边）。
+ 若此时 $i\leftrightarrow j,i\leftrightarrow k,j\leftrightarrow k,x\leftrightarrow y$ 四条边都没有连，则用操作 0x15 来反转 $i\leftrightarrow j,i\leftrightarrow k,j\leftrightarrow k,k\leftrightarrow x,k\leftrightarrow y,x\leftrightarrow y$ 六条边（即补齐 $i,j,k$ 三角形上的边以及一条在 $i,j,k$ 以外的边）。
+ 此时再找出点 $w$ 满足 $w\neq i,w\neq j,w\neq k,w\neq x,w\neq y$，则若此时 $i\leftrightarrow k,x\leftrightarrow k,y\leftrightarrow k,z\leftrightarrow k$ 四条边都没有连，则用操作 0x15 来反转 $i\leftrightarrow k,i\leftrightarrow x,k\leftrightarrow x,k\leftrightarrow y,k\leftrightarrow z,y\leftrightarrow z$ 六条边（即补齐 $i,k$ 两点之间的边以及 $k$ 外面挂着的三条缺失的边）。
+ 若此时 $j\leftrightarrow k,x\leftrightarrow k,y\leftrightarrow k,z\leftrightarrow k$ 四条边都没有连，则用操作 0x15 来反转 $j\leftrightarrow k,j\leftrightarrow x,k\leftrightarrow x,k\leftrightarrow y,k\leftrightarrow z,y\leftrightarrow z$ 六条边（即补齐 $j,k$ 两点之间的边以及 $k$ 外面挂着的三条缺失的边）。

此时图上只有 $i\leftrightarrow j$ 的边，以及 $k$ 点连向除了 $i,j,k$ 以外的若干点 $x$ 的边不存在。因此考虑再打第三层补丁：

+ 如果 $i\leftrightarrow j,j\leftrightarrow k,k\leftrightarrow v$ 都缺边，那么直接反转 $i,j,k,v$ 组成的四元环即可。
+ 如果 $i\leftrightarrow j,i\leftrightarrow k,k\leftrightarrow v$ 都缺边，那么直接反转 $j,i,k,v$ 组成的四元环即可。

可以证明此时图的边数一定达到了上界。

---

而对于奇数的情况，同样的，考虑在 0x21 部分中找出三个关键点 $i,j,k$ 后，先将 $i,j$ 两个点连起来（直接用 0x13 操作反转 $i\leftrightarrow j,j\leftrightarrow k$ 两条边即可）。

### 0x25 $k\equiv 1\pmod 4$

其实和 $k\equiv 3\pmod 4$ 的情况也差不多，同样也是少了一个选前 $k$ 个点反转的操作。这里就不展开讨论了。

## 代码实现

~~有一万个 corner case，还没调出来/ll~~

代码长度 12.19K，写了整整一夜~~最后还是对着题解调出来的~~，所以就不放代码了，没有代码能力是这样的/ll/ll/ll

## Reference

分类讨论中 $2\nmid k$ 的部分（即 0x24，0x25）参考了 [Bingxiu2 大神的题解](https://www.luogu.com.cn/article/oyjeg8gj)。

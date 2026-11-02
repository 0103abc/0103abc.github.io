---
title: "AT_abc450_g [ABC450G] Random Subtraction 题解"
date: "2026-03-22T02:23:49.000Z"
link: "luogu-dyzedpdv"
categories: ["题解"]
tags: ["AtCoder", "数学", "概率与期望", "基础算法", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/dyzedpdv)。

可以证明，$n>2$ 时答案一定只和 $\sum\limits_{i=1}^na_i,\sum\limits_{i=1}^na_i^2$ 有关。下面给出上述结论的证明：

::::success[证明]{open}

:::success[结论]{open}
$E[x^2]$ 一定是关于 $a_1,a_2,\ldots,a_n$ 的二次式。
:::

:::success[证明]
操作形如选择两个数 $a,b$，把这两个数删除然后再加入 $a-b$ 这个元素。因为这是一个线性操作，因此 $x$ 一定是 $a_1,a_2,\ldots,a_n$ 的一个线性组合。

因此 $x^2$ 是关于 $a_1,a_2,\ldots,a_n$ 的二次式，根据期望的线性性可知 $E[x^2]$ 同样也是二次式。
:::

因此考虑把 $E[x^2]$ 用二次式的形式表示出来，即 $\sum\limits_{i=1}^n\alpha_iA_i^2+\sum\limits_{i=1}^n\sum\limits_{j=1}^n[i\neq j]\beta_{i,j}A_iA_j$。

但是注意到 $E[x^2]$ 的值不能因为交换 $A$ 数组中的两个位置就导致其值发生变化，因此必须有：$\alpha_1=\alpha_2=\ldots=\alpha_n,\beta_{1,2}=\beta_{1,3}=\beta_{1,4}=\ldots=\beta_{n,n-1}$。也即 $E[x^2]$ 可以表示为 $\alpha\sum\limits_{i=1}^nA_i^2+\beta\sum\limits_{i=1}^n\sum\limits_{j=1}^n[i\neq j]A_iA_j$。

此时记 $s_1=\sum\limits_{i=1}^nA_i,s_2=\sum\limits_{i=1}^nA_i^2$
，把上式所有含 $A$ 的项都用 $s_1,s_2$ 表示，得到：$E[x^2]=\alpha s_2+\beta(s_1^2-s_2)$。
::::

此时可以直接写个暴力然后把 $\alpha,\beta$ 的值打表求出来，下面给出一个正常推导的做法。

先给数组 $A$ 代入特值，令 $A_1=A_2=\ldots=A_{n-1}=0,A_n=t$，则显然有 $E[x^2]=t^2,s_1=t,s_2=t^2$，代入前面给出的式子得到 $E[x^2]=t^2=\alpha t^2$，因此必然有 $\alpha=1$。

考虑记 $b_i$ 表示 $n=i$ 时上式 $\beta$ 的值，则 $E[x^2]=s_2+b_n(s_1^2-s_2)$。此时考虑若在某次操作中选择了 $i,j$ 两个位置，$s_2$ 的值会**减少** $2A_iA_j$。因为 $E[A_iA_j]=\frac{s_1^2-s_2}{n(n-1)}$，所以有 $E[s_2]=s_2-\frac{2(s_1^2-s_2)}{n(n-1)}$。

$s_1^2-s_2$ 的值会**增加** $2A_iA_j+4A_j^2-4A_js_1$，对其每项分别计算期望，得到：$E[A_j]=\frac{s_1}n,E[A_j^2]=\frac{s_2}n,E[A_iA_j]=\frac{s_1^2-s_2}{n(n-1)}$，因此有 $E[s_1^2-s_2]=s_1^2-s_2-4s_1\times\frac{s_1}n+4\times\frac{s_2}n+\frac{2(s_1^2-s_2)}{n(n-1)}$，化简可得 $E[s_1^2-s_2]=\frac{(n-2)(n-3)(s_1^2-s_2)}{n(n-1)}$。

记 $f_n(A)$ 为长度为 $n$ 的 $A$ 序列最后得到 $x^2$ 的期望值，则有 $f_1(A)=A_1^2,f_2(A)=(A_1-A_2)^2,f_n(A)=E[f_{n-1}(A')]$，其中 $A'$ 是 $A$ 序列进行一次操作后得到的序列，把 $E[x^2]$ 代入上式可得 $f_n(A)=E[s_2+b_{n-1}(s_1^2-s_2)]=s_2-\frac{2(s_1^2-s_2)}{n(n-1)}+b_{n-1}\frac{(n-2)(n-3)(s_1^2-s_2)}{n(n-1)}$。又因为 $f_n(A)=s_2+b_n(s_1^2-s_2)$，联立两个 $f_n(A)$ 的关系式可得 $b_n=-\frac2{n(n-1)}+\frac{(n-2)(n-3)b_{n-1}}{n(n-1)}$。线性求出前缀的逆元然后模拟上述过程可以做到 $O(n)$ 求解答案。

:::success[能不能 $O(1)$ 求出 $b_n$ 的值？]
先观察样例可以发现答案形如 $\frac23$ 加上一个数，然后再结合暴力打表，可以猜想 $n\ge 3$ 时有 $b_n=-\frac2{3(n-1)}$，然后简单数学归纳证明即可。
:::

:::warning[注意]
特判 $n\le 2$ 的时候一定要记得给答案平方！！！
:::

[代码实现](https://atcoder.jp/contests/abc450/submissions/74285225)。

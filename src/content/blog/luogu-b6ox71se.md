---
title: "P15235 「CROI · R3」浣熊的小游戏 题解"
date: "2026-02-09T03:27:56.000Z"
link: "luogu-b6ox71se"
categories: ["题解"]
tags: ["洛谷", "数学", "线性代数", "基础算法", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/b6ox71se)。

首先可以把原问题转化为下面的问题：

> 给定值域区间 $[l,r]$，有集合 $S=\lbrace x\mid \exist i\in[l,r)\cap\mathbb{N},x=i\oplus(i+1)\rbrace$，求 $|\lbrace x\mid \exist T\in S\land T\neq\varnothing,x=\bigoplus\limits_{i\in T}i \rbrace|$。

证明用异或的自反性，$a\oplus b=(a\oplus (a+1))\oplus((a+1)\oplus (a+2))\oplus\ldots\oplus((b-1)\oplus b)$（$a<b$）即可简单证明。

然后有关键结论：对于任意整数 $x$，都有 $x\oplus (x+1)=2^k-1$（$k\in\mathbb N$），也就是 $|S|\sim O(\log n)$。此时直接用线性基维护可以做到 $O(q\log^2n)$ 解决问题。

考虑继续优化时间复杂度。注意到 $\forall i\in S,i=2^k-1(k\in\mathbb N)$，所以考虑模拟线性基：注意到此时线性基插入的所有数都会被成功插入（每个数都不能用其他数的异或来表示），所以答案即为 $2^{|S|}-1$。而计算 $|S|$ 是简单的，可以 $O(\log n)$ 处理。因此总时间复杂度为 $O(q\log n)$ 可以通过该题。

```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int l, r;
        cin >> l >> r;
        int cnt = 0;
        for (int i = 0; i < 60; ++i)
            if ((r >> i) - (l >> i) != (r >> (i + 1)) - (l >> (i + 1)))
                ++cnt;
        cout << (1ll << cnt) - 1 << '\n';
    }
} // namespace Loyalty
```

---
title: "P2998 [USACO10NOV] Candy S 题解"
date: "2024-09-20T13:45:47.000Z"
link: "luogu-w7yjzctx"
categories: ["题解"]
tags: ["洛谷", "搜索", "记忆化"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/w7yjzctx)。

十分简单一题。考虑记忆化搜索。设当前有 $x$ 个糖果，那么枚举其每一个可以转移到的糖果数并继续搜索。若当前搜索到了一个之前已经搜索过的元素，那么代表出现了环，此时说明 Bessie 可以无限吃糖果，输出 $-1$ 即可。

具体见 [代码](https://www.luogu.com.cn/paste/wb8hcpxh)。

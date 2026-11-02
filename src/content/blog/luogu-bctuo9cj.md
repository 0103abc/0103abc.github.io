---
title: "CF1238E Keyboard Purchase 题解"
date: "2025-01-13T07:07:08.000Z"
link: "luogu-bctuo9cj"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/bctuo9cj)。

很典的。理论上这东西可以模拟退火，但是 CF 就算了（设 $f_i$ 表示使用了 $i$ 集合内所有字母，最少需要花费多少时间，但是不太好直接转移。

于是考虑转化。若第 $i$ 个被插入的和第 $j$ 个被插入的字符相邻，则贡献 $|j-i|$ 可以被理解为选入集合的时间戳的绝对值。设当前枚举到 $i$ 集合，想要加入 $j$ 元素，则对答案造成的贡献就是所有不在集合内的元素和所有在集合内的元素相邻的元素对数（那个贡献其实就是每一次都 $+1$）。

直接转移时间复杂度明显超标。考虑费用提前计算，再设 $g_i$ 表示 $i$ 集合对答案的贡献，这个东西随便算一算就行了。然后再转移 $f_i$ 数组，时间复杂度为 $O(n+2^mm^2)$，可以通过。[代码](https://codeforces.com/contest/1238/submission/300802169)。

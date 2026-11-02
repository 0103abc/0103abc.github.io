---
title: "CF2030B Minimise Oneness 题解"
date: "2024-10-22T09:02:32.000Z"
link: "luogu-w2u7byj7"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造"]
draft: false
---

upd：添加代码。

首先所有非空子序列的数目为 $2^n-1$ 是奇数，因此两数的差也只能为奇数，最小值最小为 $1$。因此考虑构造串 $000\ldots01$，此时两数的差为 $1$。根据上面的分析发现差的绝对值必然是奇数，因此无更优构造。

单组数据时间复杂度为 $O(n)$。

```python
T = int(input())
for _ in range(T):
  n = int(input())
  for i in range(n - 1) : print('0', end='')
  print('1', end='')
```

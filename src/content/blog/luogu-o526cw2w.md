---
title: "CF1619E MEX and Increments 题解"
date: "2024-09-14T14:04:40.000Z"
link: "luogu-o526cw2w"
categories: ["题解"]
tags: ["Codeforces", "数据结构", "栈"]
draft: false
---

要让原数组的 $\text{mex}$ 值为 $i$ 则需要让 $0\sim i-1$ 中每一个数至少出现一次且 $i$ 一次也不出现。

因此考虑对于每一个没有出现过的数，在其之前找到一个出现了至少两次的数并将其的一个数改为这个数。若找不到则无解。最后将答案加上 $i$ 出现的次数即将所有 $i$ 元素修改为 $i+1$ 的代价。具体可以使用一个栈来维护上述信息。

时间复杂度为 $O(n)$，可以通过。

[代码](https://codeforces.com/contest/1619/submission/281132046)。

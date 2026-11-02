---
title: "P15108 白井黑子 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p15108"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "搜索", "深度优先搜索"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P15108).
:::

:::info[Solution]{open}
一般树是比较困难的，考虑先弱化一下树的结构。

如果树退化成一条链，则显然是容易做的。

然后考虑树是二叉树的情况。考虑到若让二叉树的每个结点都只有一个子结点，则二叉树会退化成链，然后可以用链的方法来直接搞。考虑消去二叉树的右子树，对每个结点 $u$，若其为叶子结点，或其只有一个子结点，则无需处理，否则沿着左子树一路往右跳，找到左子树中 DFS 序最后的结点（显然这个结点是叶子结点），把右子树接到叶子结点作为该结点的左子树即可。

最后考虑普通树，直接三度化成二叉树即可。
:::

:::success[Code]
```cpp line-numbers
void dfs(int n,Array &f,Array &a) {
    for (int i = 2; i <= n; ++i) {
        int u = f[i];
        f.set(i, a[u]), a.set(u, i);
    } int u = 1;
    while (u) {
        if (!a[u]) a.set(u, f[u]), f.set(u, 0);
        else {
            int lc = a[u], rc = f[u];
            while (f[lc]) lc = f[lc];
            f.set(lc, rc), f.set(u, 0);
        } u = a[u];
    }
    for (int i = 1; i <= n; ++i) f.set(i, a[i]);
    u = 1;
    for (int i = 1; i <= n; ++i) a.set(i, u), u = f[u];
}
```
:::

难度：紫+

鲜活指数：8

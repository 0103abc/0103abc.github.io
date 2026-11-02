---
title: "P12587 「KTSC 2019 R2」外星仙人掌 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p12587"
categories: ["题解"]
tags: ["洛谷", "数据结构", "单调栈", "算法思想", "倍增"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P12587).
:::

:::info[Solution]{open}
对一个区间 $[l,r]$ 而言，套路的找到区间中最高的位置 $pos$ 然后把区间分成 $[l,pos)$ 和 $(pos,r]$ 两个部分分别考虑。对左半部分而言考虑建单调栈 $S$，对单调栈相邻的两个位置 $i,j$ 而言这中间的积水深度就是 $\sum\limits_{k=i+1}^{j-1}(S_i-S_k)$。另一侧的贡献也是类似的。把所有贡献部分加起来即可 $O(n)$ 求出每组询问的值。

直接做是 $O(nq)$ 的，考虑优化。静态问题容易想到倍增优化。具体的：设 $r_i$ 表示 $i$ 右边第一个高度不低于她自己的位置。则对于区间左端点 $l$ 可能出现在单调栈中的柱子必然就是 $l,r_l,r_{r_l},\ldots$。因此直接对 $r$ 数组做两个倍增，分别表示从 $i$ 位置跳 $2^k$ 步能到达的位置以及所需要花费的代价即可。另一侧也同理，这里不再赘述。

因此总时间复杂度被优化到 $O(n\log n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
int pre[N];
pair<int, int> L[N][20], R[N][20];

#undef int
void init(vector<int> H) {
#define int long long
    int n = H.size();
    for (int i = 1; i <= n; ++i) pre[i] = pre[i - 1] + H[i - 1];
    for (int i = 0; i < 20; ++i) R[n + 1][i] = {n + 1, 0};
    stack<int> stk;
    for (int i = n; i; --i) {
        while (stk.size() && H[stk.top() - 1] < H[i - 1]) stk.pop();
        if (stk.empty()) R[i][0] = {n + 1, 0};
        else R[i][0] = {stk.top(), (stk.top() - i - 1) * H[i - 1] - (pre[stk.top() - 1] - pre[i])};
        stk.emplace(i);
    } while (stk.size()) stk.pop();
    for (int i = 1; i <= n; ++i) {
        while (stk.size() && H[stk.top() - 1] < H[i - 1]) stk.pop();
        if (stk.empty()) L[i][0] = {0, 0};
        else L[i][0] = {stk.top(), (i - stk.top()) * H[i - 1] - (pre[i] - pre[stk.top()])};
        stk.emplace(i);
    }
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= n; ++j) {
            R[j][i].first = R[R[j][i - 1].first][i - 1].first;
            L[j][i].first = L[L[j][i - 1].first][i - 1].first;
            R[j][i].second = R[j][i - 1].second + R[R[j][i - 1].first][i - 1].second;
            L[j][i].second = L[j][i - 1].second + L[L[j][i - 1].first][i - 1].second;
        }
}

#undef int
long long query(int S, int E) {
#define int long long
    int res = 0, pos = S;
    for (int i = 19; ~i; --i)
        if (R[pos][i].first <= E) res += R[pos][i].second, pos = R[pos][i].first;
    S = pos, pos = E;
    for (int i = 19; ~i; --i)
        if (L[pos][i].first >= S) res += L[pos][i].second, pos = L[pos][i].first;
    return res;
}


#undef int
```
:::

难度：紫-

鲜活指数：5

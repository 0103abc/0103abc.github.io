---
title: "P13540 [IOI 2025] 羊驼的坎坷之旅（obstacles） 题解"
date: "2026-07-29T06:54:27.000Z"
link: "luogu-6cjvlhof"
categories: ["题解"]
tags: ["洛谷", "算法思想", "倍增"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/6cjvlhof)。

很困难的题目。对每一列 $i$，记 $d_i$ 表示这一列从第 $0$ 行开始，连续可以通行的行数，也就是 $d_i=\min\limits_x\lbrace x\mid T_x\le H_i\rbrace$。

然后再维护 $P_i=\max\limits_{0\le j<i}T_j$。在第 $x$ 行横穿 $[i,j]$ 需要满足 $T_x>\max\limits_{k=i}^jH_k$。因此两列 $i,j$ 之间可以直接连边当且仅当 $P_{\min(d_i,d_j)}>\max\limits_{i\le k\le j}H_k$。

此时边的数目是 $O(n^2)$ 级别的，考虑只保留少量有用的边。具体的，对 $H$ 数组建立笛卡尔树，对每个位置 $i$ 维护 $L_i$ 表示左边第一个湿度比 $i$ 更小的位置，$R_i$ 表示右边第一个湿度比 $i$ 更小的位置。则此时只需要保留 $i\to L_i$ 和 $i\to R_i$ 两条边即可走到所有可达的位置。此时对每组查询 $[L,R]$ 可以线性时间复杂度回答询问，时间复杂度为 $O(nQ)$。到这一步为止都是比较容易的。

考虑进一步优化。把笛卡尔树倒过来看，$L_i$ 和 $R_i$ 两个结点都是 $i$ 结点的祖先结点。考虑从 $L_i,R_i$ 中选出一个结点当 $i$ 结点的直接父亲：

+ 如果 $L_i,R_i$ 中只有一个点是有效的，则直接父亲就是这个点。
+ 否则，选择 $H_i$ 更小的那个点充当 $i$ 点的直接父亲。

记 $i$ 点的直接父亲为 $fa_i$。

直接沿着 $fa_i$ 往上跳肯定是不行的，因为需要保证不能移动出 $[L,R]$ 范围。考虑更换跳父亲的流程：

+ 先沿着 $fa$ 数组一路往上跳，直到下一步要跳出 $[L,R]$ 范围为止。
+ 然后沿着 $L$ 数组一路往上跳，直到下一步要跳出 $[L,R]$ 范围为止。
+ 然后沿着 $R$ 数组一路往上跳，直到下一步要跳出 $[L,R]$ 范围为止。
+ 重复执行上述流程，直到跳到区间内的根结点为止。

上述算法流程显然可以通过倍增来加速处理。特殊的，因为 $fa$ 链不满足单调性，所以还需要额外在 $fa$ 链上维护经过的编号最小结点和编号最大结点的倍增信息。

上述算法可以对一组 $(l,r,s)$，求出 $[l,r]$ 区间内，$s$ 点所在连通块的深度最浅的祖先结点编号。此时对一组询问 $(l,r,s,d)$，只需要分别求出 $(l,r,s)$ 和 $(l,r,d)$ 的深度最浅祖先结点编号，然后判断两个编号是否相等即可求出两点之间是否连通。

因此算法的时间复杂度被优化到 $O(n\log n)$（这里认为 $n,m,q$ 同阶），可以通过该题。

:::success[Code]
```cpp line-numbers
const int N = 200010;
int fa[N][20], Mi[N][20], Mx[N][20], L[N][20], R[N][20];
int lg[N], st[N][20], pre[N], d[N], h[N], rr[N], ll[N], rk[N], rc[N], lc[N];

inline int qry(int l, int r) {
    int lgx = lg[r - l + 1];
    return max(st[l][lgx], st[r - (1 << lgx) + 1][lgx]);
}
inline int chk(int x, int y) {
    return pre[min(d[x], d[y])] > qry(x, y);
}

void initialize(std::vector<int> T, std::vector<int> H) {
    int n = T.size(), m = H.size();
    for (int i = 1; i <= n; ++i) pre[i] = max(pre[i - 1], T[i - 1]);
    for (int i = 1; i < n; ++i) T[i] = min(T[i], T[i - 1]);
    for (int i = 1; i <= m; ++i) h[i] = st[i][0] = H[i - 1];
    lg[0] = -1; for (int i = 1; i <= m; ++i) lg[i] = lg[i >> 1] + 1;
    for (int i = 1; i <= m; ++i) d[i] = lower_bound(T.begin(), T.end(), h[i], greater<>()) - T.begin();
    for (int i = 1; i < 20; ++i) for (int j = 1; j <= m - (1 << i) + 1; ++j)
        st[j][i] = max(st[j][i - 1], st[j + (1 << (i - 1))][i - 1]);
    for (int i = 0; i <= m + 1; ++i) R[i][0] = rr[i] = m + 1, L[i][0] = ll[i] = 0;
    vector<pair<int, int>> ord;
    for (int i = 1; i <= m; ++i)
        if (d[i]) ord.emplace_back(h[i], i);
    sort(ord.begin(), ord.end());
    for (int i = 0; i < ord.size(); ++i) rk[ord[i].second] = i + 1;
    stack<int> stk;
    for (int i = 1; i <= m; ++i) if (d[i]) {
        while (stk.size() && rk[stk.top()] > rk[i]) rr[stk.top()] = i, stk.pop();
        if (stk.size()) ll[i] = stk.top();
        stk.emplace(i);
    } for (int i = 1; i <= m; ++i) if (d[i]) {
        if (ll[i] && (lc[i] = chk(ll[i], i))) L[i][0] = ll[i];
        if (rr[i] <= m && (rc[i] = chk(i, rr[i]))) R[i][0] = rr[i];
    }
    for (int i = (int)ord.size() - 1; ~i; --i) {
        int x = ord[i].second;
        if (!lc[x] && !rc[x]) fa[x][0] = 0;
        else if (!lc[x]) fa[x][0] = rr[x];
        else if (!rc[x]) fa[x][0] = ll[x];
        else {
            if (rk[ll[x]] < rk[rr[x]]) fa[x][0] = ll[x];
            else fa[x][0] = rr[x];
        } Mi[x][0] = Mx[x][0] = fa[x][0];
    }
    for (int i = 1; i < 20; ++i)
        for (int j = 0; j <= m + 1; ++j) {
            fa[j][i] = fa[fa[j][i - 1]][i - 1];
            L[j][i] = L[L[j][i - 1]][i - 1], R[j][i] = R[R[j][i - 1]][i - 1];
            Mx[j][i] = max(Mx[j][i - 1], Mx[fa[j][i - 1]][i - 1]), Mi[j][i] = min(Mi[j][i - 1], Mi[fa[j][i - 1]][i - 1]);
        }
}

inline int find(int l, int r, int x) {
    while (l <= L[x][0] || R[x][0] <= r) {
        for (int i = 19; ~i; --i)
            if (l <= Mi[x][i] && Mx[x][i] <= r) x = fa[x][i];
        for (int i = 19; ~i; --i)
            if (L[x][i] >= l) x = L[x][i];
        for (int i = 19; ~i; --i)
            if (R[x][i] <= r) x = R[x][i];
    } return x;
}

bool can_reach(int L, int R, int S, int D) {
    return find(L + 1, R + 1, S + 1) == find(L + 1, R + 1, D + 1);
}
```
:::

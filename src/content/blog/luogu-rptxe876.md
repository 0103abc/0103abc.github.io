---
title: "P6766 [APIO2020] 有趣的旅途 题解"
date: "2026-04-13T03:31:45.000Z"
link: "luogu-rptxe876"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "算法思想", "构造", "基础算法", "排序"]
draft: false
---

## Description

这是一道交互题。

交互库有一个隐藏的 $n$ 个点的树，你需要构造一个长度为 $n$ 的 $0\sim n-1$ 的排列 $a$，满足 $\forall i\in(0,n-1)\cap\mathbb N_+,\text{Dist}(a_i,a_{i+1})\le\text{Dist}(a_{i-1},a_i)$。保证 $n\le 10^5$。**特殊的，保证树上任意一个结点的度数都不超过 $\bf\red3$。**

你可以向交互库询问不超过 $4\times 10^5$ 个问题，每个问题形如：

+ `hoursRequired(X, Y)`：查询树上 $X$ 到 $Y$ 的简单路径需要经过的边的数量。后面记该操作为 $A$ 操作。
+ `attractionsBehind(X, Y)`：查询有多少个点 $Z$ 满足 $X$ 到 $Z$ 的唯一简单路径要经过点 $Y$。后面记该操作为 $B$ 操作。

## Solution

先考虑如果已经知道树的形态，如何找出一个符合条件的排列 $a$。

考虑随便钦定一个结点 $rt$ 为树的根结点，然后把 $rt$ 从树上删除，可以得到不超过 $3$ 个子树，这里记 $k=\deg(rt)$，则可以得到 $k$ 个子树。将这 $k$ 个子树内的结点分别按照其深度从大到小排序，得到 $k$ 个不同的集合 $S_1,\ldots,S_k$。

此时显然可以得到结论：对于任意两个整数 $i,j$ 满足 $1\le i<j\le k$，均满足 $\forall x\in S_i,y\in S_j$，$\text{Dist}(x,y)=\text{Depth}(x)+\text{Depth}(y)$，其中 $\text{Depth}(x)$ 表示 $x$ 到根结点简单路径上边的数量，即 $x$ 点在树上的深度。

若此时有 $k\in\lbrace 2,3\rbrace$，则容易想到贪心的让相邻两个点属于不同的 $S_*$ 集合里，每次取出和上一个点不属于同一个 $S_*$ 集合里的点里深度最深的点。在所有集合内点均被放入序列后，将当前的根节点 $rt$ 插入到序列的末尾。记这 $k$ 个集合内点的数量分别为 $L_1,\ldots,L_k$（$L_1\le\ldots\le L_k$），则当且仅当 $L_k+1\le\sum\limits_{i=1}^{k-1}L_i$ 时，上述构造可以给出合法的序列。下面考虑证明该结论：

+ 若 $L_k+1>\sum\limits_{i=1}^{k-1}L_i$，则无法满足“相邻两点属于不同的 $S_*$ 集合”这一条件。
+ 否则，在每个 $S_*$ 集合里深度更深的点一定比深度更浅的点在序列中的位置更靠前，因此对于相邻的三个位置 $i,i+1,i+2$，一定可以满足 $\text{Depth}(a_{i+2})\le\text{Depth}(a_i)\Rightarrow\text{dist}(a_i,a_{i+1})\ge\text{dist}(a_{i+1},a_{i+2})$。

特判掉 $n=2$ 的情况，当 $n>2$ 时一定可以找出一个点 $rt$ 使得其得到的 $(k,(L_1,\ldots,L_k))$ 满足 $k\in\lbrace 2,3\rbrace$ 且 $L_k+1\le\sum\limits_{i=1}^{k-1}L_i$。具体的，让 $rt$ 为树的重心结点即可。当 $n>2$ 时一定有 $\deg(rt)>1\Rightarrow k>1$，且根据重心的性质可知其不存在一个子树的大小超过 $\frac n2$，可以满足条件 $L_k+1\le\sum\limits_{i=1}^{k-1}L_i$。

此时考虑需要在交互过程中询问哪些信息可以实现上面给出的算法。容易发现，上述算法需要利用到的信息有：

+ 树的任意一个重心。
+ 树上点到重心的距离。
+ 树上每个点分别属于重心哪个儿子的子树。

### 1. 找出树的任意一个重心

注意到 $B(x,y)$ 询问得出的结果其实就是树钦定根结点为 $x$ 时，$y$ 所在子树的结点数量。因此考虑下面的交互策略：

+ 对每个 $i\neq 0$，询问 $s_i=B(0,i)$ 即以 $0$ 为根时，$i$ 结点所在子树的结点数量。
+ 若不存在 $i$ 使得 $s_i>\frac n2$，则 $0$ 号结点就是树的重心。
+ 否则，在所有满足 $s_i>\frac n2$ 的位置 $i$ 里，最小的 $s_i$ 对应的结点 $i$ 必然是树的一个重心。

下面考虑证明该策略正确：

+ 若不存在 $i$ 使得 $s_i>\frac n2$，则每个非 $0$ 号结点往父亲方向的连通块大小都超过了 $\frac n2$，不能成为树的重心结点，因此 $0$ 号结点一定是树的重心。
+ 考虑对于两个点 $u,v$ 而言，她们的子树要么是包含挂关系，要么没有交。
+ 因此若两个点的子树大小都超过了 $\frac n2$，则这两个点的子树一定是呈包含关系，因此所有满足 $s_i>\frac n2$ 的 $i$ 在树上必然是一条从根结点出发向下的链。找到最深的结点（即 $s_i$ 最小的）满足 $s_i>\frac n2$，则 $i$ 点所有儿子结点的子树大小一定都不超过 $\frac n2$，$i$ 点向父亲方向的连通块大小也不超过 $\frac n2$，因此 $i$ 一定是树的一个重心。
+ 因此该策略被证明为正确。

### 2. 树上点到重心的距离

记 $rt$ 为树的一个重心，则直接对每个 $i\neq rt$，询问 $A(rt,i)$ 就可以得到 $\text{Depth}(i)$ 也就是 $i$ 到重心的距离了。

### 3. 树上每个点分别属于重心哪个儿子的子树

如果此时可以找到 $k$ 个点 $x_1,\ldots,x_k$ 满足 $x_1,\ldots,x_k$ 分别处于 $rt$ 结点全部 $k$ 个不同的子树中，则对于其余的结点 $i$，判定 $i$ 结点位于 $k$ 个子树中的哪一个，只需要判定是否有 $A(i,x_j)=\text{Depth}(i)+\text{Depth}(x_j)$ 即可。

而找出这 $k$ 个代表点的一个简单方法就是直接取所有 $\text{Depth}(i)=1$ 的结点 $i$。容易证明这些点移动属于不同的子树。

### 4. 处理答案

直接按照前面给出的步骤处理答案即可。容易证明该算法符合操作次数限制。

## Code

~~一直 wa 两个点实在调不出来了最后参考了第一篇题解的实现~~。

```cpp
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
const int mod = 998244353;
constexpr inline void add(int &x, int v) { x = (x + v) % mod; }
constexpr inline void sub(int &x, int v) { x = (x + mod - v) % mod; }
int s[N], bel[N], dep[N];
#undef int
int hoursRequired(int, int);
int attractionsBehind(int, int);
vector<int> createFunTour(int n, [[maybe_unused]] int Q) {
#define int long long
#define A hoursRequired
#define B attractionsBehind
    if (n == 2) return vector<signed>{0, 1};
    int rt = 0, mi = n + 1;
    s[0] = n;
    for (int i = 1; i < n; ++i) s[i] = B(0, i);
    for (int i = 0; i < n; ++i)
        if (s[i] > n / 2 && s[i] < mi) mi = s[i], rt = i;
    for (int i = 0; i < n; ++i) bel[i] = dep[i] = 0;
    for (int i = 0; i < n; ++i)
        if (i != rt) dep[i] = A(rt, i);
    vector<int> vk;
    for (int i = 0; i < n; ++i)
        if (dep[i] == 1) vk.emplace_back(i);
    assert(1 < vk.size() && vk.size() < 4);
    for (int i = 0; i < n; ++i) bel[i] = -1;
    for (int i = 0; i < vk.size(); ++i) bel[vk[i]] = i;
    for (int i = 0; i < n; ++i) if (dep[i] > 1) for (int j = 0; j < vk.size(); ++j)
        if (j + 1 == vk.size() || dep[i] + dep[vk[j]] != A(i, vk[j])) {
            bel[i] = j;
            break;
        }
    for (int i = 0; i < vk.size(); ++i) bel[vk[i]] = i;
    vector<pair<int, int>> buc[3];
    for (int i = 0; i < n; ++i)
        if (i != rt) buc[bel[i]].push_back({dep[i], i});
    for (int i = 0; i < vk.size(); ++i) sort(buc[i].begin(), buc[i].end());
    vector<signed> res;
    auto merge = [&]() {
        while (buc[2].size())
            buc[1].push_back(buc[2].back()), buc[2].pop_back();
        sort(buc[1].begin(), buc[1].end());
    };
    function<void()> solve_2 = [&]() {
        while (buc[0].size() || buc[1].size()) {
            auto now = buc[0].back();
            buc[0].pop_back();
            res.emplace_back(now.second);
            buc[0].swap(buc[1]);
        } res.emplace_back(rt);
    };
    auto C = [&](int a, int b, int c) -> int {
        return a + b + c - max({a, b, c});
    };
    function<void()> solve_3 = [&]() {
        if (buc[0].size() == n / 2) {
            merge();
            if (buc[0].size() < buc[1].size()) buc[0].swap(buc[1]);
            solve_2();
            return;
        }
        int ok = 0;
        while (1) {
            int ne = -1;
            for (int i = ok; i < 3; ++i) {
                if (buc[i].empty()) continue;
                if (ne == -1 || buc[i].back() >= buc[ne].back()) ne = i;
            } ok = 1;
            res.emplace_back(buc[ne].back().second);
            auto tmp = buc[ne].back();
            buc[0].swap(buc[ne]), buc[0].pop_back();
            if (max({buc[0].size(), buc[1].size(), buc[2].size()}) == C(buc[0].size(), buc[1].size(), buc[2].size())) {
                int now = 0;
                if (buc[0].size() < buc[1].size()) buc[0].swap(buc[1]), now = 1;
                if (buc[0].size() < buc[2].size()) buc[0].swap(buc[2]), now = (!now ? 2 : now);
                if (now && !buc[((now - 1) ^ 1) + 1].empty() && tmp < buc[((now - 1) ^ 1) + 1].back())
                    res.emplace_back(buc[((now - 1) ^ 1) + 1].back().second), buc[((now - 1) ^ 1) + 1].pop_back();
                merge(); if (!now) buc[0].swap(buc[1]); solve_2();
                return;
            }
        }
    };
    if (vk.size() == 2) {
        if (buc[0].size() < buc[1].size()) buc[0].swap(buc[1]);
        solve_2();
    } else {
        if (buc[0].size() < buc[1].size()) buc[0].swap(buc[1]);
        if (buc[0].size() < buc[2].size()) buc[0].swap(buc[2]);
        solve_3();
    } return res;
}
```

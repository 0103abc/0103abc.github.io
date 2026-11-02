---
title: "P11604 [PA 2016] 卡牌 / Gra w karty 题解"
date: "2025-02-24T13:17:28.000Z"
link: "luogu-vr31jrc2"
categories: ["题解"]
tags: ["洛谷", "基础算法", "二分", "图论", "二分图匹配", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/vr31jrc2)。

好难。

遇事不决考虑先打表猜结论，手玩若干组小数据后可以发现下面的结论：

+ 考虑建一张二分图。把 Alice 的点放在左边，Bob 的点放在右边，那么 Alice 必胜，当且仅当存在一个 Bob 的点，使得其和 Alice 所有的点都有连边，即其的度数为 $n$。

这个结论感觉很哇塞，于是考虑证明之。

**I. 证明该情况下 Alice 必胜**

这个还是很显然的。考虑到只要 Bob 的这张牌还留着，Alice 不管留下哪张牌，都是必胜状态。而 Bob 留下哪一张牌是由 Alice 决定的。因此该情况证毕。

**II. 证明若非该情况，则 Alice 一定不会必胜**

考虑建上述二分图的二分补图，即求出原图的补图，然后将该图在同一侧的边全部移出。此时该二分补图所有右侧点的度数均 $\ge 1$。然后可以发现若某个右侧点的度数 $\ge 2$ 那么这个点不论 Alice 最后留下哪一个点都一定合法。此时若不存在度数为 $1$ 的点那么 Alice 一定不能胜，否则 Alice 一定会保留恰好一张 Bob 的牌使得其在二分图中右侧所对应的点的度数为 $1$。此时若至少删去了一个点，则右侧点数量一定严格小于左侧点数量，每一个右侧点最多让一个左侧点不能被删除，而且可能会对应到重复的关系，所以此时 Alice 必然不会获胜。否则补图中必然恰好是一一对应的关系。很显然只要 $n>1$ 那么 Bob 必然有一种可以获胜的方法，即每一次删去 Alice 所要删除的点所唯一对应的点。而 $n=1$ Alice 必胜，但是该情况满足条件。因此该部分证毕。

----

现在判定完 Alice 必胜的情况。在 Alice 无法获胜的情况下，考虑 Bob 什么时候必胜。很显然，若存在一个右侧点 $i$ 使得该点不能战胜任何一个左侧点，那么 Alice 只需要一直不删除 $i$ 这个点，就可以做到 Bob 无法获胜。否则很显然，不存在一个右侧点使得该右侧点无法战胜 Alice 的任何一个左侧点。容易证明，假设 Alice 删除了 Bob 的右侧点 $i$，那么假设本来 $i$ 可以战胜点 $x$，那么若 $x$ 本身已经被删除了，那么根据抽屉原理可知：

+ 此时必然有一个 Alice 的左侧点，使得 Bob 不论选择哪一个结点都无法获胜。
+ Bob 存在一个结点，使得当前这个结点仍然可以战胜至少两个当前 Alice 侧没有被删除的结点。

对于情况 $1$ Bob 删除这个 Alice 的左侧点就是最优情况，对于情况 $2$ Bob 删除这个顶点集合中任意一个结点都可以，都是最优情况。因此执行 $n-1$ 次操作之后，剩下的两个结点必然满足 Bob 的可以击杀 Alice 的结点。

于是该题被做完了。结论为：

+ 建立一张二分图，把所有 Alice 的 $n$ 个点放在图的左侧，Bob 的 $n$ 个点放在图的右侧。
+ 若把所有 Alice 必胜的边连起来，存在 Bob 的一个点 $i$ 使得 $\deg(i)=n$，则 Alice 必胜。
+ 若把所有 Bob 必胜的边连起来，对于任意一个 Bob 的结点 $i$ 都有 $\deg(i)\neq 0$，则 Bob 必胜。
+ 否则 Alice 和 Bob 使用最优策略，必然导致平局。

直接按照上述策略模拟即可，时间复杂度为 $O(n)$，可以通过。

代码：

```cpp
// #pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 100010;
int buc[N];
struct Oper {
    int x;
    char o;
    int y;
} oper[N << 1];
signed main() {
    cout << fixed << setprecision(15);
    cin.tie(0)->sync_with_stdio(false);
    int T;
    cin >> T;
    while (T--) {
        int n, m;
        cin >> n >> m;
        for (int i = 1; i <= m; ++i) {
            int x, y;
            char o;
            cin >> x >> o >> y;
            oper[i] = {x, o, y};
        }
        fill(buc + 1, buc + n + 1, 0ll);
        for (int i = 1; i <= m; ++i)
            if (oper[i].o == '>')
                ++buc[oper[i].y];
        if (count(buc + 1, buc + n + 1, n) >= 1) cout << "WYGRANA\n";
        else {
            fill(buc + 1, buc + n + 1, 0ll);
            for (int i = 1; i <= m; ++i)
                if (oper[i].o == '<')
                    ++buc[oper[i].y];
            if (!count(buc + 1, buc + n + 1, 0)) cout << "PRZEGRANA\n";
            else cout << "REMIS\n";
        }
    }
    return 0;
}
```

---
title: "AT_arc193_a [ARC193A] Complement Interval Graph 题解"
date: "2025-02-24T14:23:20.000Z"
link: "luogu-7hrk7ruv"
categories: ["题解"]
tags: ["AtCoder", "图论", "最短路", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/7hrk7ruv)。

有一个很粤台晋的做法就是说直接暴力 $O(n^2)$ 建图，然后 $O(n^3)$ 跑 Floyd 求答案。看得出来没有什么前途。

考虑更聪明一些的做法。发现图十分特殊，$i,j$ 两个点有边当且仅当 $[l_i,r_i]\cap[l_j,r_j]=\emptyset$。因此大力猜测若两点连通，则最短路径经过的点数一定很少。

对于 $Q$ 次询问中的每一个 $(s,t)$，若：

+ $[l_s,r_s]\cap[l_t,r_t]=\emptyset$，则显然直接从 $s$ 走到 $t$ 必为最优解，花费的代价为 $W_s+W_t$。
+ 否则，若存在一个 $o$，使得 $[l_s,r_s]\cap[l_o,r_o]=\emptyset$ 且 $[l_o,r_o]\cap[l_t,r_t]=\emptyset$，则该花费为 $W_s+W_t+W_o$。枚举所有的 $o$ 求最小值即可。
+ 若存在两个 $o_1,o_2$ 使得 $[l_s,r_s]\cap[l_{o_1},r_{o_1}]=\emptyset$，$[l_{o_1},r_{o_1}]\cap[l_{o_2},r_{o_2}]=\emptyset$ 且 $[l_{o_2},r_{o_2}]=\emptyset$，则该花费为 $W_s+W_t+(W_{o_1}+W_{o_2})$，枚举所有的 $o_1,o_2$ 取最小值即可。

然后可以证明，只存在下面两种合法的情况：

+ 最优解存在于上面三种情况中。
+ $s$ 根本走不到 $t$。

下面给出结论的证明：（在存在一条路径的前提下）考虑反证。则即为证下面条件恒不成立：

+ 对于给定的 $s,t$，同时满足下面三个条件：
  + $[l_s,r_s]\cap[l_t,r_t]\neq\emptyset$。
  + $\forall o,[l_s,r_s]\cap[l_o,r_o]\neq\emptyset$ 或 $[l_o,r_o]\cap[l_t,r_t]\neq\emptyset$。
  + $\forall o_1,o_2,[l_s,r_s]\cap[l_{o_1}, r_{o_1}]\neq\emptyset$ 或 $[l_{o_1},r_{o_1}]\cap[l_{o_2},r_{o_2}]\neq\emptyset$ 或 $[l_{o_2},r_{o_2}]\cap[l_t,r_t]\neq\emptyset$。

这里钦定 $l_s<l_t$。若 $l_s>l_t$ 则交换 $s,t$ 可以得到和上面一样的结果。

+ 对于上述的条件 $1$，若 $[l_t,r_t]\subseteq[l_s,r_s]$，则此时所有和 $[l_s,r_s]$ 无交的区间，其必然都和 $[l_t,r_t]$ 区间无交。那么其必然能满足上述的条件 $2$。因此想要让上述条件成立，当且仅当 $r_s<r_t$。此时四个点由 $l_s,l_t,r_s,r_t$ 的形式排列。
+ 然后来考虑条件 $2$。若要满足之，则必须对于所有和 $[l_s,r_s]$ 无交的区间 $[l_o,r_o]$，都有 $[l_t,r_t]$ 和 $[l_o,r_o]$ 有交。因此可以推断出 $\forall o,l_o>r_s$。同理，对于所有和 $[l_t,r_t]$ 无交的区间 $[l_o,r_o]$，都有 $[l_s,r_s]$ 和 $[l_o,r_o]$ 有交。因此可以推断出 $\forall o,r_o<l_t$。
+ 考虑令 $u$ 为上述第一个 $o$，$v$ 为上述第二个 $o$。则此时必有逻辑关系 $l_v\le r_v<l_t\le r_s<l_u\le l_v$ 成立。很容易推断出 $[l_v,r_v]$ 和 $[l_u,r_u]$ 无交，$[l_u,r_u]$ 和 $[l_s,r_s]$ 无交，$[l_v,r_v]$ 和 $[l_t,r_t]$ 无交。因此此时条件 $3$ 不成立，和假设矛盾。因此该结论得证。

---

此时考虑对 $Q$ 次询问 $s,t$，每一次都暴力枚举三种情况的答案。对于每一组询问，三类问题的时间复杂度分别为 $O(1)$，$O(n)$ 和 $O(n^2)$，加上 $Q$ 组数据后最劣时间复杂度为 $O(Qn^2)$，显然无法通过问题（甚至和一开始没有分析的时候时间复杂度相同）。因此考虑优化问题，分别处理三种情况的答案。

对于第一种情况，本身时间复杂度就是 $O(1)$ 的了，无需进行进一步的优化。

对于第二种情况，单次询问时间复杂度为 $O(n)$，需要优化：考虑到寻找的区间 $[l_o,r_o]$ 需要同时和 $[l_s,r_s]$ 以及 $[l_t,r_t]$ 无交，但是此时必然有 $[l_s,r_s]$ 和 $[l_t,r_t]$ 有交（否则第一种情况一定为最优解），因此只需要考虑两种情况，即 $r_o<l_s$ 和 $r_t<l_o$ 即可。可以对点离线排序然后线性对 $r$ 维护前缀 $w$ 权最小值和 $l$ 维护后缀 $w$ 权最小值，对上述两个值取 $\min$ 即可，预处理时间复杂度为 $O(n\log n)$，单次查询时间复杂度为 $O(1)$。

对于第三种情况，单次询问时间复杂度为 $O(n^2)$，需要优化：考虑到需要寻找两个区间 $[l_{o_1},r_{o_1}]$ 和 $[l_{o_2},r_{o_2}]$，且需要满足 $[l_s,r_s]$ 和 $[l_{o_1},r_{o_1}]$ 无交，$[l_{o_1},r_{o_1}]$ 和 $[l_{o_2},r_{o_2}]$ 无交，$[l_{o_2},r_{o_2}]$ 和 $[l_t,r_t]$ 无交。但是此时必然有 $[l_s,r_s]$ 和 $[l_t,r_t]$ 有交，因此此时 $[l_{o_1},r_{o_1}]$ 必然在 $[l_t,r_t]$ 区间的右侧，即 $l_{o_1}>r_t$，且 $[l_{o_2},r_{o_2}]$ 必然在 $[l_s,r_s]$ 区间的左侧，即 $r_{o_2}<l_s$。发现这两个东西互相独立，因此可以根据上一种情况处理的前后缀 $w$ 权最小值，分别在 $[1,l_s)$ 中取前缀 $w$ 权 $\min$ 值，$(r_t,n]$ 中取后缀 $w$ 权 $\min$ 值，对这两个值求和就是最小的答案。（注：该情况计算的时候，务必保证 $[l_s,r_s]$ 和 $[l_t,r_t]$ 两个区间之间不存在任何包含关系，否则后果自负）。

若上述三种情况均未找到合法的解，则根据上面的结论可知，此时 $s$ 到 $t$ 必然不存在通路，输出 $-1$ 即可。

此时总时间复杂度为 $O(n\log n+Q)$，可不可以优化掉 $n$ 上的 $\log$？显然是可以的，其实不需要对所有点对应区间排序，直接在对应数组中取 $\min$，然后分别做前后缀 $\min$ 即可。此时总时间复杂度为 $O(n+Q)$ 即线性，可以随便通过。

代码，理解了上面的步骤（或者猜出结论）之后还是很简单的。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
int w[N], l[N], r[N], pre[N], suf[N];
signed main() {
    cout << fixed << setprecision(15);
    cin.tie(0)->sync_with_stdio(false);
    int n, q;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> w[i];
    for (int i = 1; i <= n; ++i) cin >> l[i] >> r[i];
    memset(pre, 0x3f, sizeof pre);
    memset(suf, 0x3f, sizeof suf);
    for (int i = 1; i <= n; ++i) {
        pre[r[i]] = min(pre[r[i]], w[i]);
        suf[l[i]] = min(suf[l[i]], w[i]);
    }
    for (int i = 1; i <= n + n; ++i) pre[i] = min(pre[i], pre[i - 1]);
    for (int i = n + n; i; --i) suf[i] = min(suf[i], suf[i + 1]);
    cin >> q;
    while (q--) {
        int s, t;
        cin >> s >> t;
        if (r[s] < l[t] || r[t] < l[s]) cout << w[s] + w[t] << '\n';
        else {
            int res = min(pre[min(l[s], l[t]) - 1], suf[max(r[s], r[t]) + 1]);
            if (r[s] <= r[t] && l[s] <= l[t]) res = min(res, pre[max(l[s], l[t]) - 1] + suf[min(r[s], r[t]) + 1]);
            else if (r[s] > r[t] && l[s] > l[t]) res = min(res, pre[max(l[s], l[t]) - 1] + suf[min(r[s], r[t]) + 1]);
            if (res > 1e18) res = -1;
            else res += w[s] + w[t];
            cout << res << '\n';
        }
    }
    return 0;
}
```

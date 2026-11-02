---
title: "P13184 [GCJ 2017 Finals] Teleporters 题解"
date: "2026-10-15T13:05:11.000Z"
link: "luogu-q3v9u748"
categories: ["题解"]
tags: ["洛谷", "数学", "线性代数", "动态规划", "算法思想", "构造"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/q3v9u748)。

这里记 $d(A,B)$ 为 $A,B$ 两个点在三维空间中的曼哈顿距离。

先特判掉一些 corner case：

+ $n=1$ 是容易解决的。
+ 如果有一个传送器 $A_i$ 满足 $d(P,A_i)=d(Q,A_i)$，则答案为 $1$。
+ 否则，若存在两个传送器满足其中一个距离 $P$ 更近，另外一个距离 $Q$ 更近，则建系一下可知此时必然存在一组答案为 $2$ 的构造。

处理完上面的 corner 后必然可以通过交换 $P,Q$ 使得对每个传送器 $A_i$ 都满足 $d(P,A_i)<d(Q,A_i)$。考虑 dp，设 $f_{i,k}$ 表示经过 $k-1$ 次传送后所有可达位置到 $A_i$ 的最大距离是多少。初始条件为 $f_{i,1}=d(P,A_i)$，转移可以直接枚举下一个移动的位置，即 $f_{i,k+1}=\max\limits_j(f_{j,k}+d(A_i,A_j))$。然后考虑到可达区域在三维空间中是一个连续的光滑部分，因此若可以移动到的最远距离为 $dist$，则一定可以移动到 $0\sim dist$ 中的任意实数距离，也就是说只要 $f_{i,k}\ge d(Q,A_i)$ 就可以在第 $k$ 次传送到达 $Q$ 点。

直接暴力 dp 时间复杂度肯定爆炸了，考虑经典套路拆曼哈顿距离，$d(x,y)=\max\limits_{i\in\lbrace-1,1\rbrace^3}i(x-y)$。因为三个 $i$ 的不同取值只有 $8$ 种，因此考虑记 $g_{s,k}=\max\limits_i(f_{i,k}-sA_i)$。额外记 $e_{s,t}=\max\limits_i((t-s)A_i)$ 后代入可以得到转移式 $g_{s,k+1}=\max\limits_t(e_{s,t}+g_{t,k})$，这可以看作是一个 $8\times 8$ 的 $(\max,+)$ 矩阵乘法的形式。再预处理出 $h_s=\max\limits_i(sA_i-d(Q,A_i))$，则判定 $h_k$ 对应的状态能否在第 $k+1$ 次传送中到达终点只需要判定 $\max\limits_i(g_{i,k}+h_i)\ge 0$ 是否成立即可。具体实现可以对 $(\max,+)$ 矩阵作倍增处理，时间复杂度为 $O(w^2n+w^3\log V)$，其中 $V$ 是坐标的范围，$w$ 是矩阵的边长，在本题中取 $w=8$。

描述的可能不太清楚，建议对着题解代码理解。~~我还是不懂这个题为什么单个测试点时间限制 $110s$，我的代码跑了 $10ms$ 就跑过了。~~

```cpp line-numbers
namespace lowspeed_song {

mt19937_64 mt(time(0));

inline void init() {
}

struct Point { int x, y, z; } a[N];
inline int dist(Point a, Point b) {
    return abs(a.x - b.x) + abs(a.y - b.y) + abs(a.z - b.z);
}

const i128 inf = (i128)1 << 120;

i128 e[45][8][8], g[8], h[8], tmp[8], d[160][8];

inline void in(Point &p) { cin >> p.x >> p.y >> p.z; }

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n; cin >> n;
    Point p, q; in(p), in(q);
    for (int i = 0; i < n; ++i) in(a[i]);
    cout << "Case #" << __testcase_id << ": ";
    int o1 = 0, o2 = 0, o3 = 0;
    for (int i = 0; i < n; ++i) {
        int d1 = dist(p, a[i]), d2 = dist(q, a[i]);
        o1 |= (d1 < d2), o2 |= (d1 > d2), o3 |= (d1 == d2);
    } if (o3) { cout << 1 << '\n'; return; }
    if (n == 1) { cout << "IMPOSSIBLE\n"; return; }
    if (o1 && o2) { cout << 2 << '\n'; return; }
    if (o2) swap(p, q);
    for (int i = 0; i < 8; ++i) g[i] = h[i] = -inf;
    for (int i = 0; i < n; ++i) for (int j = 0; j < 8; ++j) {
        d[i][j] = 0;
        d[i][j] += (j & 1) ? a[i].x : -a[i].x;
        d[i][j] += (j & 2) ? a[i].y : -a[i].y;
        d[i][j] += (j & 4) ? a[i].z : -a[i].z;
        g[j] = max(g[j], (i128)dist(p, a[i]) - d[i][j]);
        h[j] = max(h[j], (i128)d[i][j] - dist(q, a[i]));
    } auto chk = [&](i128 *f) {
        for (int i = 0; i < 8; ++i) if (f[i] + h[i] >= 0) return 1;
        return 0;
    }; if (chk(g)) { cout << 2 << '\n'; return; }
    for (int i = 0; i < 8; ++i) for (int j = 0; j < 8; ++j) {
        e[0][i][j] = -inf; for (int k = 0; k < n; ++k)
            e[0][i][j] = max(e[0][i][j], d[k][j] - d[k][i]);
    } for (int k = 1; k < 45; ++k) for (int i = 0; i < 8; ++i) for (int j = 0; j < 8; ++j) {
        e[k][i][j] = -inf; for (int p = 0; p < 8; ++p)
            e[k][i][j] = max(e[k][i][j], e[k - 1][i][p] + e[k - 1][p][j]);
    } int res = 0; for (int i = 44; ~i; --i) {
        for (int j = 0; j < 8; ++j) {
            tmp[j] = -inf;
            for (int k = 0; k < 8; ++k) tmp[j] = max(tmp[j], g[k] + e[i][j][k]);
        } if (!chk(tmp)) copy(tmp, tmp + 8, g), res |= (1ll << i);
    } cout << res + 3 << '\n';
}

} // namespace lowspeed_song
```

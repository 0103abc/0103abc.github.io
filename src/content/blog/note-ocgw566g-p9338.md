---
title: "P9338 [JOIST 2023] 合唱 / Chorus 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p9338"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数学", "线性代数", "基础算法", "二分"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P9338).
:::

:::info[Solution]{open}
题目要求把第 $l\sim r$ 个 A 和第 $l\sim r$ 个 B 分到同一首歌曲了，因此可以看作是把 $1\sim n$ 划分成恰好 $k$ 个连续段。记 $w(l,r)$ 表示把 $[l,r]$ 区间划分为完整的一段的最小操作数是多少，则考虑记 $c_i$ 表示第 $i$ 个 A 的前面有多少个 B。为了让这一段合法，对每个 $i\in[l,r]$ 都需要让第 $i$ 个 A 跨过 $c_i-l+1$ 个 B。因此得出结论 $w(l,r)=\sum\limits_{i=l}^r\max(c_i-l+1,0)$。

考虑一个暴力的 dp。设 $f_{i,j}$ 表示考虑前 $j$ 个位置，划分恰好 $i$ 段所需要的最小交换次数。直接转移可以枚举决策点 $k$，转移式形如 $f_{i,j}=\min\limits_{k=1}^j(f_{i-1,k-1}+w(k,j))$ 的形式。

观察 $w(l,r)$ 可以发现 $w$ 函数构成的矩阵是 Monge 矩阵，因此 dp 数组关于划分的段的数量 $i$ 是凸的，外层可以用 wqs 二分优化去掉段数 $i$ 这个维度，$f_i=\min\limits_{j=1}^i(f_{j-1}+w(j,i)+x)$。因为 $c_i$ 单调不下降，因此考虑维护 $p_i$ 表示 $i$ 后面第一个满足 $c_{p_j}\le j$ 的位置，$S_i$ 为 $c_i$ 的前缀和信息，则显然有 $w(j,i)=S_i-S_{p_j-1}-j(i-p_j-1)$，代入 dp 转移式后可得 $f_i=S_i+x+\min\limits_j(f_j-S_{p_j-1}+j(p_j-1)-ij)$，用李超线段树优化 dp 转移即可做到 $O(n\log^2n)$ 求解问题。

~~但是 $2\log$ 看着就不是什么人类，因此被迫学习了斜率优化 dp 的线性做法。~~ ~~斜率优化太难了，还是写 2log 了。~~ 最后还是写的单 $\log$ 做法。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, k;
char s[N];
int a[N], cnt, idx, pre[N], p[N], f[N], g[N], q[N];
inline int calc(int x) { return g[x] - pre[p[x] - 1] + x * (p[x] - 1); }
inline pair<int, int> chk(int x) {
    int head = 0, tail = 0;
    for (int i = 1; i <= n; ++i) {
        while (head < tail && calc(q[head + 1]) - calc(q[head]) < (q[head + 1] - q[head]) * i) ++head;
        f[i] = f[q[head]] + 1;
        g[i] = g[q[head]] + pre[i] - pre[p[q[head]] - 1] - q[head] * (i - p[q[head]] + 1) + x;
        while (head < tail && (calc(q[tail]) - calc(q[tail - 1])) * (i - q[tail]) > (calc(i) - calc(q[tail])) * (q[tail] - q[tail - 1])) --tail;
        q[++tail] = i;
    } return {f[n], g[n]};
}

inline void sol() {
    cin >> n >> k;
    scanf("%s", s + 1);
    for (int i = 1; i <= n + n; ++i) {
        if (s[i] == 'A') a[++idx] = cnt, pre[idx] = pre[idx - 1] + a[idx];
        else ++cnt;
    }
    for (int i = 1; i <= n; ++i) p[i] = max<int>(lower_bound(a + 1, a + n + 1, i) - a, i + 1);
    int l = 0, r = 1e12, best = r + 1;
    while (l <= r) {
        int mid = l + r >> 1;
        chk(mid).first <= k ? (best = mid, r = mid - 1) : (l = mid + 1);
    } cout << chk(best).second - k * best << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：8

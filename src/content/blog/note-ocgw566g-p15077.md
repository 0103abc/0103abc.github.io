---
title: "P15077 [ICPC 2024 Chengdu R] Double 11 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p15077"
categories: ["题解"]
tags: ["洛谷", "基础算法", "排序", "数学", "线性代数", "动态规划"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P15077).
:::

::::info[Solution]{open}
将所有物品按照 $s_i$ 从小到大排序后，同一个组内的物品一定是排序后的一个连续段。

现在假设把排序后 $l\sim r$ 的物品分成了一组，则把这些组平移到 $1,2,3,\ldots,m$，记 $q_i$ 是第 $i$ 组的商品数量，$S_i$ 是第 $i$ 组销售量的和，$k_i$ 是第 $i$ 组的补货参数，则原问题可以变为是求 $\min\sum\limits_{i=1}^m\frac{q_i}{k_i}$ 且需满足 $\sum\limits_{i=1}^m S_ik_i\le 1$，取最值时显然让 $\sum\limits_{i=1}^m S_ik_i=1$ 一定不会更差，由 Cauchy 不等式可知 $\sum\limits_{i=1}^m\frac{q_i}{k_i}=(\sum\limits_{i=1}^m\frac{q_i}{k_i})(\sum\limits_{i=1}^mS_ik_i)\ge(\sum\limits_{i=1}^m\sqrt{q_iS_i})^2$，且下界可以取到。因此有 $\min\limits_{i=1}^m\frac{q_i}{k_i}=(\sum\limits_{i=1}^m\sqrt{q_iS_i})^2$。

因此记 $w(l,r)$ 表示把 $l\sim r$ 的物品放到一组所需要花费的最小代价，则显然有 $w(l,r)=\sqrt{(r-l+1)\sum\limits_{i=l}^rs_i}$。因此可以列出暴力 dp 式子：$f_{t,i}$ 表示处理了前 $i$ 个物品，且第 $i$ 个物品是第 $t$ 段物品段的末尾物品，所需要花费的最小代价是多少。可以直接列出朴素 dp 转移式为 $f_{t,i}=\min\limits_{j<i}(f_{t-1,j}+w(j+1,i))$。直接转移的时间复杂度为 $O(n^2m)$，用决策单调性优化内层转移可以做到 $O(mn\log n)$ 时间复杂度，仍需优化。

考虑证明 $w$ 函数组成的矩阵是 Monge 矩阵，即对于 $a\le b\le c\le d$ 有 $w(a,c)+w(b,d)\le w(a,d)+w(b,c)$。另一篇题解使用了非人的偏导数证明，这里给出一个纯代数的增量证明方法：

:::success[证明]
记 $H(L,S)=\sqrt{LS}$。如果总和增加 $\Delta$，则有 $H(L,S+\Delta)-H(L,S)=\sqrt{L(S+\Delta)}-\sqrt{LS}=\frac{\Delta}{\sqrt{(S+\Delta)/L}+\sqrt{S/L}}$。

因此一段的平均值 $S/L$ 越大，给她增加相同的总和 $\Delta$，$H$ 增加的部分就会越少。

考虑把 $[a,d]$ 区间段分成三段：

+ $A=[a,b-1]$，长度为 $p$，总和为 $x$。
+ $B=[b,c]$，长度为 $q$，总和为 $y$。
+ $C=[c+1,d]$，长度为 $r$，总和为 $z$。

因为 $s$ 序列已经排序，因此三段的平均值单调，即满足 $\frac xp\le \frac yq\le \frac zr$。要证明 Monge 的差值式即为 $F=H(p+q+r,x+y+z)+H(q,y)-H(p+q,x+y)-H(q+r,y+z)$。

考虑先增大 $x$ 的值，将 $x$ 逐渐增加到 $x=\frac{py}q$ 也就是让 $A$ 段的平均值和 $B$ 段相同。在这个过程中，$A+B$ 的平均值一定不会超过 $C$，因此有 $\operatorname{avg}(A+B+C)\ge \operatorname{avg}(A+B)$。因此给 $x$ 增加相同的 $\Delta$ 时 $H(A+B+C)$ 的增量不会超过 $H(A+B)$ 的增量，因此在该过程中 $F$ 的值不会增大。

然后再减小 $z$ 的值。将 $z$ 逐渐减小到 $z=\frac{ry}q$ 也就是让 $C$ 的平均值和 $B$ 段相同。在这个过程中，考虑反过来看，因为 $A$ 的平均值一定不超过 $B+C$，因此有 $\operatorname{avg}(A+B+C)\le \operatorname{avg}(B+C)$。因此给 $z$ 增加相同的 $\Delta$ 时，$H(A+B+C)$ 的增量必然不小于 $H(B+C)$ 的增量。因此 $F$ 随着 $z$ 的增大不会减小。

因此 $F$ 的最小值必然在 $\frac xp=\frac yq=\frac zr$ 时取得。此时设公共平均值为 $v$，则必有 $H(L,Lv)=L\sqrt v$，代入可得 $F_{\min}=(p+q+r+q-p-q-q-r)\sqrt v=0\sqrt v=0$。因此在任何时刻都必然有 $F\ge 0$ 即 $w(a,c)+w(b,d)\le w(a,d)+w(b,c)$。

因此 $w$ 函数组成的矩阵是 Monge 矩阵。
:::

因此最优决策是单调的。

后面的部分比较套路，考虑 wqs 二分，给每一段增加一个惩罚值 $x$，记录 $f_i$ 表示把排序后的前 $i$ 个物品任意分组时候，原代价加上每组物品的惩罚值的和最小是多少，转移显然形如 $f_i=\min\limits_{j=0}^{i-1}(f_j+w(j+1,i)+x)$，然后内层 dp 用在线分治决策单调性优化即可。总时间复杂度为 $O(n\log n\log V)$，可以通过该题。
::::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

ld lambda, f[N];
int n, m, s[N], pre[N], cnt[N], pos[N];

inline ld calc(int l, int r) { return sqrtl((r - l) * (pre[r] - pre[l])); }
inline void relax(int j, int i) {
    ld val = f[j] + calc(j, i) + lambda;
    if (val < f[i] || val == f[i] && cnt[j] + 1 > cnt[i]) f[i] = val, cnt[i] = cnt[j] + 1, pos[i] = j;
}
inline void cdq(int l, int r) {
    if (l == r) return;
    int mid = l + r >> 1;
    for (int i = pos[l - 1]; i <= min(mid - 1, pos[r]); ++i) relax(i, mid);
    cdq(l, mid); for (int i = l; i <= mid; ++i) relax(i, r); cdq(mid + 1, r);
}
inline pair<ld, int> chk(ld x) {
    lambda = x, f[0] = cnt[0] = pos[0] = 0;
    for (int i = 1; i <= n; ++i) pos[i] = 0, cnt[i] = 1, f[i] = calc(0, i) + x;
    return cdq(1, n), pair<ld, int>{f[n], cnt[n]};
}

inline void sol() {
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) cin >> s[i];
    sort(s + 1, s + n + 1);
    for (int i = 1; i <= n; ++i) pre[i] = pre[i - 1] + s[i];
    ld l = 0, r = 1e9;
    for (int i = 0; i < 100; ++i) {
        ld mid = (l + r) / 2;
        chk(mid).second > m ? l = mid : r = mid;
    } cout << chk(r).first - r * m << '\n';
}

} // namespace lowspeed_song
```
:::

难度：**黑+**

鲜活指数：7

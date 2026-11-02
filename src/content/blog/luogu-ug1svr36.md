---
title: "P15479 [CERC2012] Non-boring sequences 题解"
date: "2026-05-26T08:23:47.000Z"
link: "luogu-ug1svr36"
categories: ["题解"]
tags: ["洛谷", "算法思想", "分治"]
draft: false
---

题解怎么没有分治 / semi-启发式合并做法（）

根据 Master Theorem 可以得到下面的结论：

+ $T(n)=T(x)+T(n-x)+O(x)$ 可以得出 $T(n)=O(n^2)$
+ $T(n)=T(x)+T(n-x)+O(\frac n2)$ 可以得出 $T(n)=O(n\log n)$

考虑先胡一个 $T(n)=T(x)+T(n-x)+O(n)$ 的做法：记 $\text{pre}_i$ 表示 $i$ 位置之前第一个值为 $a_i$ 的数的位置，$\text{nxt}_i$ 表示 $i$ 位置之后第一个值为 $a_i$ 的数的位置，则注意到一段区间 $[l,r]$ **可能**合法，当且仅当区间内存在位置 $p\in[l,r]$，使得 $\text{pre}_i<l$ 且 $\text{suf}_i>r$。递归处理子区间 $[l,p)$ 和 $(p,r]$ 即可。

但是现在这个做法的最坏时间复杂度连 $O(n^2)$ 都不是，因为最坏情况下可能对每层分治的区间 $[l,r]$，都存在多个可能合法的 $p$ 需要进一步递归处理。下面给出结论的证明：

+ 对于当前分治区间 $[l,r]$ 和枚举到的可能合法的分界点 $p$，分治区间的所有子区间 $[L,R]\subseteq[l,r]$ 存在下面三种情况需要讨论：
  + $p\in[L,R]$：此时 $[L,R]$ 子区间一定不是 boring 序列，因此无需继续处理。
  + $p<R$：此时递归处理子区间 $[l,p-1]$ 即可。
  + $p>L$：此时递归处理子区间 $[p+1,r]$ 即可。
+ 容易发现找到一个 $p$ 就已经正确的处理了所有子区间。

按照上述流程设计算法最坏时间复杂度是 $O(n^2)$ 的，考虑类比笛卡尔树分治进一步优化：维护两个指针 $\mathcal L,\mathcal R$，初始令 $\mathcal L\leftarrow l,\mathcal R\leftarrow r$，然后每次执行下面给出的算法流程：

+ 令 $p\leftarrow\mathcal L$，然后检查 $p$ 是否是一个合法的划分点。直接递归分治处理即可。
+ 令 $p\leftarrow\mathcal R$，然后检查 $p$ 是否是一个合法的划分点。直接递归分治处理即可。
+ 移动指针 $\mathcal L\leftarrow\mathcal L+1,\mathcal R\leftarrow\mathcal R-1$。
+ 若检测到 $\mathcal L>\mathcal R$，则终止算法。

此时可以证明优化过的算法时间复杂度是 $O(n\log n)$ 的。下面给出一个简要好理解（但是可能不太严谨）的证明：

记枚举到合法的划分点 $p$ 的时候，左侧分治区间长度 $L=p-l$，右侧分治区间长度 $R=r-p$。则显然有递归代价 $T(l,r)\le T(l,p-1)+T(p+1,r)+O(\min(l,r)+1)$。此时把在当前层扫描 $p$ 的代价 $O(\min(L,R)+1)$ 记录在两个分治区间中长度较小的区间上（即：若 $L\le R$ 则 $O(\min(L,R)+1)$ 的时间复杂度记在左侧递归区间上，否则记在右侧递归区间上）注意到被计入代价的递归区间长度相比原递归区间至少减半，因此新递归区间继续递归左右区间的时候新层扫描的代价最多是原来代价的一半。

因此每个元素最多只会被额外记贡献 $O(\log n)$ 次，总时间复杂度即为 $O(n\log n)$。

---

upd，来自 [tokitsukaze](/user/236937) 大神的证明时间复杂度方法：一个更容易理解的时间复杂度单 $\log$ 证明方法是说，把 solve 函数递归分治的过程倒过来看，每次就是把小的往大的里合并，可以看作是启发式合并，因此其时间复杂度和启发式合并的时间复杂度相同，均为 $O(n\log n)$。

```cpp line-numbers
inline void init() {
}

int a[N], pre[N], nxt[N], lsh[N], buc[N];
inline int solve(int l, int r) {
    if (l >= r) return 1;
    int L = l, R = r;
    while (L <= R) {
        if (pre[L] < l && nxt[L] > r) return solve(l, L - 1) && solve(L + 1, r);
        if (pre[R] < l && nxt[R] > r) return solve(l, R - 1) && solve(R + 1, r);
        ++L, --R;
    } return 0;
}
inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i], lsh[i] = a[i], pre[i] = 0, nxt[i] = n + 1;
    sort(lsh + 1, lsh + n + 1); int idx = unique(lsh + 1, lsh + n + 1) - lsh - 1;
    for (int i = 1; i <= n; ++i) a[i] = lower_bound(lsh + 1, lsh + idx + 1, a[i]) - lsh;
    for (int i = 1; i <= idx; ++i) buc[i] = 0;
    for (int i = 1; i <= n; ++i) pre[i] = buc[a[i]], buc[a[i]] = i;
    for (int i = 1; i <= idx; ++i) buc[i] = n + 1;
    for (int i = n; i; --i) nxt[i] = buc[a[i]], buc[a[i]] = i;
    cout << (solve(1, n) ? "non-boring" : "boring") << '\n';
}
```

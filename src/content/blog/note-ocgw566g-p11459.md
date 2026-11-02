---
title: "P11459 [USACO24DEC] It's Mooin' Time P 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p11459"
categories: ["题解"]
tags: ["洛谷", "数学", "多项式", "算法思想", "分治", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/ocgw566g)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P11459).
:::

:::info[Solution]{open}
好像是第一次见这个套路？

预处理 $w_i$ 表示从 $i$ 位置开始的长度为 $L$ 的修改成 `MOOO...OO` 所需要的最小修改代价，这个显然是容易线性处理的。

然后问题可以被转化为，从 $w_0,w_1,\ldots,w_{n-L}$ 中选择至少 $k$ 个位置满足任意两个位置之间距离至少为 $L$，使得代价的和最小。

很显然因为 $w_i\ge 0$，所以可以将至少为 $L$ 转化为恰好为 $L$。

考虑用**分治**来优化 dp。对原串区间 $[l,r)$，记 $[x^k]f_{i,j}$ 表示当前删除区间左边 $i$ 个字符和右边 $j$ 个字符后，选择 $k$ 个互不相交的 `MOO...OO` 所花费的最小代价。后面记两个多项式的复合为多项式的 $(\min,+)$ 卷积形式。

记区间的中点位置为 $m$，则考虑合并左右两个区间时会有两种情况：

没有 `MOO...OO` 跨中点 $m$：显然直接对左子区间和右子区间得到的两个多项式复合即可。

有 `MOO...OO` 跨中点 $m$：此时假设这个串从 $m-p$ 位置开始，且 $p\in [1,L)$，则必有 $f_{i,j}=w_{m-p}+f_{i,p}^L\odot F_{L-p,y}^R$，其中 $\odot$ 为多项式复合的二元运算符。

因为 $f$ 序列在任意时刻都是凸的，因此复合两个多项式可以直接用闵可夫斯基和来合并。算法的时间复杂度为 $O(L^2n\log n)$，可以通过该题。
:::

:::success[Code]
太难了，这辈子也不做了

看不到未来.jpg

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

char s[N];
int L, n, c[N], w[N];

struct Info { vector<int> a[3][3]; };

// 怎么调试这么变态啊,有没有大神看到了教一下怎么快速写对的/ng

inline void push(vector<int> &a, vector<int> b) {
    while (a.size() < b.size()) a.emplace_back(inf);
    for (int i = 0; i < b.size(); ++i) a[i] = min(a[i], b[i]);
}

inline vector<int> mincowski(vector<int> a, vector<int> b) {
    for (int i = a.size() - 1; i; --i) a[i] -= a[i - 1];
    for (int i = b.size() - 1; i; --i) b[i] -= b[i - 1];
    vector<int> c(a.size() + b.size() - 1);
    merge(a.begin() + 1, a.end(), b.begin() + 1, b.end(), c.begin() + 1);
    c[0] = a[0] + b[0];
    for (int i = 1; i < c.size(); ++i) c[i] += c[i - 1];
    return c;
}

inline Info cdq(int l, int r) {
    Info res;
    if (r - l == 1 && L == 1) { res.a[0][0] = {0, w[l]}; return res; }
    if (r - l < L) {
        for (int i = 0; i < L; ++i)
            for (int j = 0; j < L; ++j)
                if (i + j <= r - l) res.a[i][j] = {0};
        return res;
    } int mid = l + r >> 1;
    Info Left = cdq(l, mid), Right = cdq(mid, r);
    for (int i = 0; i < L; ++i)
        for (int j = 0; j < L; ++j)
            if (i + j <= r - l) {
                if (i >= mid - l) { res.a[i][j] = Right.a[i - mid + l][j]; continue; }
                if (j >= r - mid) { res.a[i][j] = Left.a[i][j - (r - mid)]; continue; }
                res.a[i][j] = mincowski(Left.a[i][0], Right.a[0][j]);
                for (int k = 1; k < L; ++k)
                    if (mid - l >= i + k && r - mid >= j + L - k) {
                        vector<int> tmp = mincowski(Left.a[i][k], Right.a[L - k][j]);
                        while (tmp.size() + 1 > res.a[i][j].size()) res.a[i][j].emplace_back(inf);
                        for (int p = 0; p < tmp.size(); ++p)
                            res.a[i][j][p + 1] = min(res.a[i][j][p + 1], tmp[p] + w[mid - k]);
                    }
            }
    return res;
}

inline void sol() {
    cin >> L >> n;
    scanf("%s", s + 1);
    for (int i = 1; i <= n; ++i) cin >> c[i];
    for (int i = 1; i <= n - L + 1; ++i) {
        w[i] = 0;
        if (s[i] != 'M') w[i] += c[i];
        for (int j = 1; j < L; ++j)
            if (s[i + j] != 'O') w[i] += c[i + j];
    } vector<int> f = cdq(1, n + 1).a[0][0];
    for (int i = 1; i <= n / L; ++i) cout << f[i] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：6

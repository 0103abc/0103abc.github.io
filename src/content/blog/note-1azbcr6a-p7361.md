---
title: "P7361 「JZOI-1」拜神 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p7361"
categories: ["题解"]
tags: ["洛谷", "基础算法", "二分", "字符串", "后缀数组"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P7361).
:::

:::info[Solution]{open}
回顾一下后缀数组的一些定义和性质：

+ $rk_i$：后缀 $i$ 的排名。
+ $sa_i$：排名为 $i$ 的后缀的编号（即开始位置）。
+ $height_i=\operatorname{lcp}(sa_i,sa_{i-1})$ 即第 $i$ 名的后缀和其前一名的后缀的最长公共前缀。
+ $height_{rk_i}\ge height_{rk_{i-1}}-1$
+ $\operatorname{lcp}(sa_i,sa_j)=\min\limits_{k=i+1}^jheight_k$
+ 序列中不同子串的数量为 $\frac{n(n+1)}2-\sum\limits_{i=2}^nheight_i$。

---

问题可以被转化为每次询问区间 $[l,r]$ 中出现至少两次的最长子串长度是多少。容易想到二分答案，设当前二分的答案为 $L$，则因为一个长度为 $L$ 的子串必须完全位于 $[l,r]$ 区间中，因此其起点只能在 $[l,r-L+1]$ 范围中。设 $R=r-L+1$ 那么 $L$ 合法当且仅存在两个不同的位置 $p,q\in[l,R]$ 满足 $\operatorname{lcp}(s[p:r],s[q:r])\ge L$。

套路的求出后缀数组 $rk,sa$ 和高度数组 $height$，对当前二分到的 $L$ 把所有满足 $height_i\ge L$ 的相邻后缀 $sa_{i-1},sa_i$ 连一条边（此时这两个后缀的 lcp 长度至少为 $L$）。

对原串的每个位置 $i$ 记录 $nxt_i$ 表示最小的位置 $j$ 满足 $j>i$ 且 $i,j$ 在前面建出的图中属于同一个连通块。那么区间 $[l,R]$ 中存在两个属于同一块的位置当且仅当 $\min\limits_{k=l}^{R-1}nxt_k\le R$。

考虑用数据结构来维护这个结构。对 $L$ 做扫描线，先从大到小扫描所有 $L$，将所有 $height_i=L$ 的变加入并查集，每个连通块用 `set` 维护其中的原串位置，每次合并直接启发式合并两个 `set` 更新其中受影响位置的 $nxt$，修改的位置直接用可持久化线段树新开一个版本来存储即可。

最后二分 $L$ 的时候查询可以直接在线段树版本 $root_L$ 上查询。

总时间复杂度为 $O((n+q)\log^2)$，有点不好的是空间复杂度也是 $2\log$ 的。单 $\log$ 做法太难了我不会。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

char s[N];

int root[N];
int lc[M], rc[M], tot;
u16 mi[M];

namespace Suffix_Array {
    int sa[N], rk[N], buc[N], height[N], n, idx;
    struct Node {
        int x[2], buc;
        inline Node() { x[0] = x[1] = buc = 0; }
        inline Node(int a, int b, int c) { x[0] = b, x[1] = a, buc = c; }
    } a[N], b[N];
    inline void sort(int up) {
        for (int i : {0, 1}) {
            memset(buc, 0, sizeof buc);
            for (int j = 1; j <= n; ++j) ++buc[a[j].x[i]];
            for (int j = 1; j <= up; ++j) buc[j] += buc[j - 1];
            for (int j = n; j; --j) b[buc[a[j].x[i]]--] = a[j];
            for (int j = 1; j <= n; ++j) a[j] = b[j];
        }
        int idx = 1;
        rk[a[1].buc] = 1;
        for (int i = 2; i <= n; ++i)
            if (a[i].x[0] == a[i - 1].x[0] && a[i].x[1] == a[i - 1].x[1]) rk[a[i].buc] = idx;
            else rk[a[i].buc] = ++idx;
    }
    inline void build() {
        for (int i = 1; i <= n; ++i) a[i] = Node(s[i], 1, i);
        sort(128);
        for (int i = 1; i < n; i <<= 1) {
            for (int j = 1; j <= n; ++j) a[j] = Node(rk[j], (i + j <= n) ? rk[i + j] : 0, j);
            sort(n);
        } for (int i = 1; i <= n; ++i) sa[rk[i]] = i;
        for (int i = 1; i <= n; ++i)
            if (rk[i] == 1) height[rk[i]] = 0;
            else {
                int p = sa[rk[i] - 1], l = max<int>(0, height[rk[i - 1]] - 1);
                while (s[i + l] == s[p + l]) ++l;
                height[rk[i]] = l;
            }
    }
} using namespace Suffix_Array;

vector<int> e[N];

inline int mdf(int rt, int l, int r, int pos, int val) {
    int nw = ++tot;
    lc[nw] = lc[rt], rc[nw] = rc[rt], mi[nw] = mi[rt];
    if (l == r) return mi[nw] = val, nw;
    int mid = l + r >> 1;
    if (pos <= mid) lc[nw] = mdf(lc[rt], l, mid, pos, val);
    else rc[nw] = mdf(rc[rt], mid + 1, r, pos, val);
    mi[nw] = min(mi[lc[nw]], mi[rc[nw]]);
    return nw;
}

inline int qry(int rt, int l, int r, int ll, int rr) {
    if (!rt) return inf;
    if (ll <= l && r <= rr) return mi[rt];
    int mid = l + r >> 1, res = inf;
    if (ll <= mid) res = qry(lc[rt], l, mid, ll, rr);
    if (mid < rr) res = min(res, qry(rc[rt], mid + 1, r, ll, rr));
    return res;
}

int fa[N];
set<int> se[N];
inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
int tag_idx, tag[N], cp[N];
inline void chg(int pos, int v) {
    if (!tag[pos]) cp[++tag_idx] = pos;
    tag[pos] = v;
}
inline void merge(int x, int y) {
    x = find(x), y = find(y);
    if (x == y) return;
    if (se[x].size() < se[y].size()) swap(x, y);
    fa[y] = x;
    for (const int &p : se[y]) {
        auto it = se[x].lower_bound(p);
        if (it != se[x].end()) chg(p, *it);
        if (it != se[x].begin()) chg(*prev(it), p);
        se[x].emplace(p);
    } se[y].clear();
}

inline void sol() {
    int q; cin >> n >> q;
    scanf("%s", s + 1);
    build();
    mi[0] = 64000;
    for (int i = 2; i <= n; ++i)
        if (height[i]) e[height[i]].emplace_back(i);
    for (int i = 1; i <= n; ++i) fa[i] = i, se[i].emplace(i);
    for (int len = n - 1; len; --len) {
        tag_idx = 0;
        for (int &i : e[len]) merge(sa[i - 1], sa[i]);
        root[len] = root[len + 1];
        for (int i = 1; i <= tag_idx; ++i) {
            root[len] = mdf(root[len], 1, n, cp[i], tag[cp[i]]);
            tag[cp[i]] = 0;
        }
    }
    while (q--) {
        int l, r; cin >> l >> r;
        int L = 1, R = r - l + 1, best = 0;
        while (L <= R) {
            int mid = L + R >> 1;
            if (qry(root[mid], 1, n, l, r - mid + 1) <= r - mid + 1) best = mid, L = mid + 1;
            else R = mid - 1;
        } cout << best << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：7

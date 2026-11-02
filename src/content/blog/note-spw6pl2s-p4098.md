---
title: "P4098 [HEOI2013] ALO 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p4098"
categories: ["题解"]
tags: ["洛谷", "基础算法", "二分", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P4098).
:::

:::info[Solution]{open}
~~你知道我看到这个 50000 多想写一个平方暴力吗~~

套路题。考虑若要求的信息不是次大值而是最大值，则考虑直接对每个位置 $i$ 求出可以让其为最大值的区间 $L_i,R_i$，然后用可持久化 01 Trie 来求一段区间中异或一个值最大的值是多少即可。

然后考虑次大值。做法也是类似的，同样可以得到两个区间 $[L,R]$ 和 $[L',R']$ 满足 $i$ 在这些位置中是次大值，同样用可持久化 01 Trie 维护即可。

直接做需要 ST 表加二分，但是更简单的做法是离线下来从小到大排序然后用链表来维护，这样链表的 $L_i,R_i$ 就和上面维护的 $L_i,R_i$ 信息是相同的，直接做即可。

时间复杂度为 $O(n\log V)$，瓶颈在按位置处理 01-Trie 上。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], pre[N], nxt[N], root[N], idx = 0;

struct Node {
    int ne[2], cnt;
    inline Node() { ne[0] = ne[1] = cnt = 0; }
} tree[N * 32];

inline void ins(int now, int las, int k) {
    for (int i = 29; ~i; --i) {
        tree[now].cnt = tree[las].cnt + 1;
        if (!tree[now].ne[k >> i & 1]) tree[now].ne[k >> i & 1] = ++idx;
        tree[now].ne[~k >> i & 1] = tree[las].ne[~k >> i & 1];
        now = tree[now].ne[k >> i & 1], las = tree[las].ne[k >> i & 1];
    } tree[now].cnt = tree[las].cnt + 1;
}

inline int qry(int rtl, int rtr, int val) {
    int res = 0;
    for (int i = 29; ~i; --i) {
        if (tree[tree[rtl].ne[~val >> i & 1]].cnt != tree[tree[rtr].ne[~val >> i & 1]].cnt)
            res |= (1 << i), rtl = tree[rtl].ne[~val >> i & 1], rtr = tree[rtr].ne[~val >> i & 1];
        else
            rtl = tree[rtl].ne[val >> i & 1], rtr = tree[rtr].ne[val >> i & 1];
    }
    return res;
}

int id[N];

inline void sol() {
    int n, res = 0; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) pre[i] = i - 1, nxt[i] = i + 1, id[i] = i;
    sort(id + 1, id + n + 1, [&](auto &l, auto &r) { return a[l] < a[r]; });
    for (int i = 1; i <= n; ++i) root[i] = ++idx, ins(root[i], root[i - 1], a[i]);
    for (int i = 1; i <= n; ++i) {
        int l = pre[id[i]], r = nxt[id[i]];
        if (l) res = max(res, qry(root[pre[l]], root[r - 1], a[id[i]]));
        if (r <= n) res = max(res, qry(root[l], root[nxt[r] - 1], a[id[i]]));
        nxt[l] = r, pre[r] = l;
    } cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：2

---
title: "CF1919F2 Wine Factory (Hard Version) 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf1919f2"
categories: ["题解"]
tags: ["Codeforces", "图论", "网络流", "数据结构", "线段树", "树"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1919F2).
:::

:::info[Solution]{open}
容易想到对每组询问建立一个最大流模型：

+ $S\to i$ 的边流量为 $a_i$。
+ $i\to T$ 的边流量为 $b_i$。
+ $i\to i+1$ 的边流量为 $c_i$。

答案就是上述图的最大流。

然后套路的考虑模拟最大流来优化。套用最大流最小割定理将最大流变为最小割，然后考虑对每个点 $i$，最小割只需要在下面两种边中二选一割掉即可：

+ 割掉 $S\to i$ 的边，代价为 $a_i$。记这样的点 $i$ 为 $0$ 类点。
+ 割掉 $i\to T$ 的边，代价为 $b_i$。记这样的点 $i$ 为 $1$ 类点。

但是这样还不够，注意到若 $i$ 点为 $1$ 类点，$i+1$ 点为 $0$ 类点，则 $S\to i\to i+1\to T$ 形成了一条合法路径，因此此时还必须割掉 $i\to i+1$ 的边，花费 $c_i$ 代价。

然后发现这个过程可以用一个线性 dp 来表示，然后扔到线段树上维护。具体的，在线段树的每个区间上维护 $f_{x,y}$ 表示区间最左端状态为 $x$，最右端状态为 $y$ 时的最小代价，则对叶子结点 $i$ 而言显然有 $[i,i]$ 区间对应的线段树信息 $f_{0,0}=a_i,f_{1,1}=b_i$，然后直接拿一个类似 $(\min,+)$ 卷积的东西来维护即可。

时间复杂度为 $O(n\log n)$ 带一个矩阵乘法的大常数，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N], c[N];

struct Node {
    int l, r, f[2][2];
    inline Node() { l = r = f[0][0] = f[0][1] = f[1][0] = f[1][1] = 0; }
    inline void init(int p) {
        l = r = p;
        f[0][0] = a[p], f[1][1] = b[p];
        f[0][1] = f[1][0] = inf;
    }
} tree[N << 2];

inline void pushup(int rt, int w) {
    tree[rt].l = tree[rt << 1].l;
    tree[rt].r = tree[rt << 1 | 1].r;
    memset(tree[rt].f, 0x3f, sizeof tree[rt].f);
    for (int i = 0; i < 2; ++i)
        for (int j = 0; j < 2; ++j)
            for (int k = 0; k < 2; ++k)
                for (int p = 0; p < 2; ++p) {
                    int v = tree[rt << 1].f[i][k] + tree[rt << 1 | 1].f[p][j];
                    if (k == 1 && !p) v += w;
                    tree[rt].f[i][j] = min(tree[rt].f[i][j], v);
                }
}

inline void build(int l, int r, int rt) {
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
    pushup(rt, c[mid]);
}

inline void mdf(int rt, int pos) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    mdf((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos);
    pushup(rt, c[mid]);
}

inline void sol() {
    int n, q; cin >> n >> q;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) cin >> b[i];
    for (int i = 1; i < n; ++i) cin >> c[i];
    build(1, n, 1);
    while (q--) {
        int p, x, y, z; cin >> p >> x >> y >> z;
        a[p] = x, b[p] = y, c[p] = (p < n) ? z : 0;
        mdf(1, p);
        cout << min({tree[1].f[0][0], tree[1].f[0][1], tree[1].f[1][0], tree[1].f[1][1]}) << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：6

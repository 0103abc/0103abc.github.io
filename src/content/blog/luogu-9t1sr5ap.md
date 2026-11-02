---
title: "CF1633F Perfect Matching 题解"
date: "2026-08-11T15:25:50.000Z"
link: "luogu-9t1sr5ap"
categories: ["题解"]
tags: ["Codeforces", "图论", "树", "数据结构", "线段树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/9t1sr5ap)。

~~我说这个题很难有没有懂的。~~

难点在于不把完美匹配看成求最大匹配大小。

考虑什么时候会形成完美匹配。因为 $1$ 号结点一开始就满足条件，因此考虑以 $1$ 号结点作为根结点建树。对每个点 $u$ 记 $cnt_u$ 表示 $u$ 结点为根的子树中被激活的点的奇偶性。很显然若 $cnt_u\bmod2=1$ 则 $u$ 子树中的所有点为了形成完美匹配必须在内部两两配对，$<u,fa_u>$ 这条边一定不能被选，否则 $u$ 点一定没法在子树内部配对，$<u,fa_u>$ 这条边必须被选。

总结一下，当前时刻应该被选的边就是所有满足 $u\neq 1\land cnt_u\bmod 2=1$ 的边 $<u,fa_u>$。

然后考虑如何快速判断这些边是否真的能形成完美匹配。设当前激活点数量为 $C$，满足 $cnt_i\bmod 2=1$ 的点 $i$ 数量为 $Cnt$，则此时当且仅当 $2Cnt=C$ 时可以满足条件。证明可以考虑所有满足 $cnt_i\bmod 2=1$ 的点 $i$ 都必须恰好向上匹配到其父亲结点连一条边。

然后对每个 $u\neq 1$ 若 $cnt_u\bmod 2=1$ 则选择父亲边 $<u,fa_u>$。设这些边组成的边集为 $E$ 则当总激活结点数量 $C$ 为偶数时根的 $cnt_1=0$ 因此 $|E|=Cnt$。然后考虑任意一个激活点 $v$ 她在 $E$ 集合中的度数为 $\deg(v)=[cnt_v=1]+\sum\limits_{u\in\text{son}_v}[cnt_u=1]$，又因为激活点始终连通，所以 $u$ 本身必然也已经激活，子树内奇偶性满足 $cnt_v\equiv 1+\sum\limits_{u\in\text{son}_v}cnt_v\pmod 2$，因此此时必有 $\deg(v)\equiv 1\pmod 2$。然后此时一共有 $C$ 个激活点，每个点的度数至少为 $1$，所以必然有 $2Cnt\ge C$。

然后此时每个激活点在 $E$ 集合中度数恰好为 $1$ 当且仅当 $E$ 是当前图的一个完美匹配，因此此时每个点度数恰都为 $1$，此时取到 $2Cnt=C$。

然后考虑当前激活一个点 $v$。则所有 $v$ 到根节点路径上的 $u$ 其子树的激活结点数量都恰好增加 $1$，也就是 $cnt_i$ 的值发生反转。因此问题被转化为：

+ 树上一条从根结点出发的路径所有元素值反转。
+ 查询全局有多少个 $cnt_i=1$ 的激活结点 $i$。
+ 维护所有 $cnt_i=1$ 的激活结点 $i$ 连向其父亲的边的编号的和。

这个东西是好维护的，直接 HLD 然后用线段树维护即可做到 $O(n\log^2n)$ 时间复杂度解决。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
int e[N], siz[N], dep[N], up[N], son[N], dfn[N], top[N], bk[N], idx;
inline void dfs(int u, int fa) {
    siz[u] = 1, dep[u] = dep[fa] + 1, up[u] = fa;
    for (int &v : adj[u]) if (v != fa) {
        dfs(v, u), siz[u] += siz[v];
        if (siz[son[u]] < siz[v]) son[u] = v;
    }
}
inline void dfs2(int u, int Top, int fa) {
    top[u] = Top, dfn[u] = ++idx, bk[idx] = u;
    if (son[u]) dfs2(son[u], Top, u);
    for (int &v : adj[u]) if (v != fa && v != son[u]) dfs2(v, v, u);
}

struct Node {
    int l, r, cnt, sum, all, tag;
    inline void init(int p) { l = r = p, cnt = (bk[p] == 1), sum = 0, all = e[bk[p]], tag = 0; }
    inline void push() { tag ^= 1, sum = all - sum, cnt = r - l + 1 - cnt; }
} tree[N << 2];

inline Node operator+(const Node &l, const Node &r) {
    return {l.l, r.r, l.cnt + r.cnt, l.sum + r.sum, l.all + r.all, 0};
}

inline void build(int l, int r, int rt) {
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline void pushdown(int rt) {
    if (tree[rt].tag) {
        tree[rt << 1].push();
        tree[rt << 1 | 1].push();
        tree[rt].tag = 0;
    }
}

inline void mdf(int rt, int ll, int rr) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt].push();
    int mid = l + r >> 1; pushdown(rt);
    if (ll <= mid) mdf(rt << 1, ll, rr);
    if (mid < rr) mdf(rt << 1 | 1, ll, rr);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline void mdf_path(int v) {
    while (top[v] != top[1]) mdf(1, dfn[top[v]], dfn[v]), v = up[top[v]];
    mdf(1, dfn[1], dfn[v]);
}

inline void collect(int rt, vector<int> &vec) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (!tree[rt].cnt) return;
    if (l == r) {
        if (bk[l] != 1) vec.emplace_back(e[bk[l]]);
        return;
    } int mid = l + r >> 1; pushdown(rt);
    collect(rt << 1, vec), collect(rt << 1 | 1, vec);
}

pair<int, int> e_[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n; cin >> n;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        e_[i] = {a, b};
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } dfs(1, 0), dfs2(1, 1, 0);
    for (int i = 1; i < n; ++i) {
        auto [a, b] = e_[i];
        if (dep[a] > dep[b]) e[a] = i;
        else e[b] = i;
    } build(1, n, 1);
    int o, C = 1;
    while (cin >> o, o != 3) {
        if (o == 1) {
            int v; cin >> v;
            ++C, mdf_path(v);
            if (tree[1].cnt * 2 == C) cout << tree[1].sum << endl;
            else cout << 0 << endl;
        } else {
            if (tree[1].cnt * 2 == C) {
                vector<int> vec;
                collect(1, vec);
                sort(vec.begin(), vec.end());
                cout << vec.size() << ' ';
                for (int &i : vec) cout << i << ' ';
                cout << endl;
            } else cout << 0 << endl;
        }
    }
}

} // namespace lowspeed_song
```
:::

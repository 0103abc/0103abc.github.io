---
title: "P6018 [Ynoi2010] Fusion tree 题解"
date: "2026-08-11T09:27:29Z"
link: "note-he8i0q35-p6018"
categories: ["题解"]
tags: ["洛谷", "数据结构", "字典树"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/he8i0q35)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P6018).
:::

:::info[Solution]{open}
建 $n$ 个低位在前高位在后的 01 trie，第 $i$ 个 01 trie 维护 $i$ 结点所有儿子的信息（父亲结点最多一个因此单独维护即可），然后考虑对 trie 上的每个结点维护 $cnt$ 表示子树中有多少个数，$xor$ 表示这些数去掉已经处理过的低位之后的异或结果。

考虑整体 $+1$ 的时候，当前位原来为 $0$ 的数会变为 $1$ 并不用产生进位，原来为 $1$ 的数会变为 $0$ 并向下一位继续产生进位。因此在当前 Trie 结点只需要交换 $0$ 儿子和 $1$ 儿子，然后对交换后的 $0$ 儿子继续执行整体 $+1$ 操作即可。

考虑怎么合并子树信息，记 $l$ 为当前的左子树根编号，$r$ 为当前的右子树根编号，则 $cnt$ 是容易维护的，直接左中右加起来即可，$xor$ 也不困难，先把左右子树 xor 起来然后左移一位，根据 $cnt$ 的奇偶性判断当前最低位的二进制是 $0$ 还是 $1$ 即可。

然后再维护一个标记 $tag_x$ 表示因为对 $x$ 执行操作 $1$ 其所有儿子已经整体增加了多少。因此对非根结点 $u$ 其真正权值表示为 $a_u+tag_{fa_u}$ 其中 $fa_u$ 表示 $u$ 的父亲结点是什么。这样 $x$ 的所有儿子结点整体 $+1$ 的时候不修改每个儿子的 $a$ 值只需要对 $x$ 的 trie 做一次整体 $+1$ 操作然后更新 $tag_x\leftarrow tag_x+1$ 即可。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
int root[N], idx;

struct Node {
    int ne[2], cnt, xr;
    inline Node() { ne[0] = ne[1] = cnt = xr = 0; }
} tree[M];
int up[N], a[N], tag[N];
inline void dfs(int u, int fa) {
    up[u] = fa;
    for (int &v : adj[u]) if (v != fa) dfs(v, u);
}
inline void pushup(int rt) {
    tree[rt].cnt = tree[tree[rt].ne[0]].cnt + tree[tree[rt].ne[1]].cnt;
    tree[rt].xr = (tree[tree[rt].ne[0]].xr << 1) ^ (tree[tree[rt].ne[1]].xr << 1) ^ (tree[tree[rt].ne[1]].cnt & 1);
}
inline void ins(int &rt, int x, int dep) {
    if (!rt) rt = ++idx;
    if (dep == 20) { ++tree[rt].cnt; return; }
    ins(tree[rt].ne[x >> dep & 1], x, dep + 1);
    pushup(rt);
}
inline void del(int &rt, int x, int dep) {
    if (dep == 20) { --tree[rt].cnt; return; }
    del(tree[rt].ne[x >> dep & 1], x, dep + 1);
    pushup(rt);
}
inline void add(int u, int dep) {
    if (!u || dep == 20) return;
    swap(tree[u].ne[0], tree[u].ne[1]), add(tree[u].ne[0], dep + 1);
    pushup(u);
}

inline int qry(int x) { return a[x] + tag[up[x]]; }
inline void chg(int u, int val) {
    int old = qry(u);
    if (up[u]) del(root[up[u]], old, 0);
    a[u] += val;
    if (up[u]) ins(root[up[u]], old + val, 0);
}

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m; cin >> n >> m;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } for (int i = 1; i <= n; ++i) cin >> a[i];
    dfs(1, 0);
    for (int i = 2; i <= n; ++i) ins(root[up[i]], a[i], 0);
    while (m--) {
        int o; cin >> o;
        if (o == 1) {
            int x; cin >> x;
            if (up[x]) chg(up[x], 1);
            add(root[x], 0), ++tag[x];
        } else if (o == 2) {
            int x, v; cin >> x >> v;
            chg(x, -v);
        } else {
            int x; cin >> x;
            int res = tree[root[x]].xr;
            if (up[x]) res ^= qry(up[x]);
            cout << res << '\n';
        }
    }
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：6

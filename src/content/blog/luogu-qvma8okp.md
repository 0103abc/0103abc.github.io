---
title: "P5904 [POI 2014] HOT-Hotels 加强版 题解"
date: "2026-05-18T10:36:33.000Z"
link: "luogu-qvma8okp"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "搜索", "深度优先搜索"]
draft: false
---

**这是一个不使用长剖的做法。**

注意到一组三元点对 $(i,j,k)$ 是合法的，当且仅当树上存在中心点 $p$，使得 $\text{Dist}(i,j)=\text{Dist}(i,k)=\text{Dist}(j,k)$。

考虑使用递归处理子树 - 合并子树信息的结构来解决问题。设当前 DFS 处理的结点是 $u$ 点，已经递归处理了 $u$ 的所有子结点的信息。记 $f_i$ 表示当前已经被合并过的部分里，距离 $u$ 为 $d$ 的点的数量，$g_i$ 表示当前已经被合并过的部分里，有多少个点对 $(x,y)$ 满足她们需要一个距离 $u$ 点 $d$ 的点就能组成合法三元点对。

现在假设需要将 $u$ 点的子结点 $v$ 子树的信息合并到 $u$ 中，则转移和统计答案需要分类讨论：

1. $v$ 子树中出两个结点，和距离 $u$ 为 $d$ 的，当前在 $u$ 结点存储信息内的第三点形成一个合法三元点对，方案数为 $f_{u,d}g_{v,d}$。
2. $u$ 当前信息中出两个结点，和距离 $u$ 为 $d$ 的，当前在 $v$ 结点存储信息内的第三点形成一个合法三元点对，方案数为 $f_{v,d}g_{u,d}$。
3. $u$ 当前信息中出一个结点，$v$ 子树中出一个结点，形成一组新的等待匹配的点对，转移形如 $g_{u,d}\leftarrow f_{u,d}f_{v,d}$。

但是注意到当前的中心点从 $v$ 移动到 $u$ 的时候 $f,g$ 数组都会整体平移一个单位，因此对每个结点的 $f,g$ 数组分别额外记录一个偏移量信息即可。

直接转移时间复杂度是 $O(n^2)$ 的，考虑优化。注意到上述的三类情况都可以枚举 $v$ 子树内的信息，然后直接查出 $u$ 内已经处理好的对应的信息，反过来也同样可以处理。而将信息从 $u$ 合并到 $v$ 需要做 $siz_v$ 次信息合并，从 $v$ 合并到 $u$ 需要做 $siz_u$ 次信息合并，因此考虑 dsu-on-tree，每次把 $siz$ 更小的结点合并到 $siz$ 更大的结点即可。（注意这里的 $siz_i$ 是 $i$ 结点的 $f,g$ 数组内合法转移点数量，而并非子树大小）。

对树上每个结点都开一个长度为 $n$ 的数组显然会 MLE，需要优化内存。注意到所有结点使用的转移点数量的和是 $O(n)$ 级别的，因此可以考虑对每个点都开一个 `map` 维护其所对应的 $f,g$ 数组，可以做到 $O(n\log^2n)$，用哈希表或者指针来维护可以将时间复杂度优化至 $O(n\log n)$。代码使用了哈希表维护 $f,g$ 数组。

```cpp line-numbers
vector<int> adj[N];
int dep[N], siz[N], res;
struct Info {
    unordered_map<int, int> f, g;
    int off_f, off_g;
    inline Info() { off_f = off_g = 0; }
} bag[N];
inline int get_f(int id, int d) {
    int key = d + bag[id].off_f;
    if (bag[id].f.find(key) != bag[id].f.end()) return bag[id].f.find(key)->second;
    return 0;
}
inline int get_g(int id, int d) {
    int key = d + bag[id].off_g;
    if (bag[id].g.find(key) != bag[id].g.end()) return bag[id].g.find(key)->second;
    return 0;
}
inline void add_f(int id, int d, int val) { bag[id].f[d + bag[id].off_f] += val; }
inline void add_g(int id, int d, int val) { bag[id].g[d + bag[id].off_g] += val; }
inline int real_f(int id, int key) { return key - bag[id].off_f; }
inline int real_g(int id, int key) { return key - bag[id].off_g; }
inline void chg_cen(int u) { bag[u].g.erase(bag[u].off_g), --bag[u].off_f, ++bag[u].off_g; }
// merge b into a
inline void merge(int a, int b) {
    for (auto &[key, cnt] : bag[b].g)
        if (real_g(b, key) >= 0) res += cnt * get_f(a, real_g(b, key));
    for (auto &[key, cnt] : bag[b].f)
        if (real_f(b, key) >= 0) res += cnt * get_g(a, real_f(b, key));
    for (auto &[key, cnt] : bag[b].f)
        if (real_f(b, key) >= 0) add_g(a, real_f(b, key), cnt * get_f(a, real_f(b, key)));
    for (auto &[key, cnt] : bag[b].f) add_f(a, real_f(b, key), cnt);
    for (auto &[key, cnt] : bag[b].g) add_g(a, real_g(b, key), cnt);
    bag[b].f.clear(), bag[b].g.clear(), bag[b].off_f = bag[b].off_g = 0;
}
inline int dfs(int u, int fa) {
    bag[u].f.clear(), bag[u].g.clear(), bag[u].off_f = bag[u].off_g = 0;
    add_f(u, 0, 1); int now = u;
    for (int &v : adj[u]) if (v != fa) {
        int son = dfs(v, u);
        chg_cen(son);
        if (bag[now].f.size() + bag[now].g.size() < bag[son].f.size() + bag[son].g.size()) swap(now, son);
        merge(now, son);
    } return now;
}
inline void sol() {
    int n; cin >> n;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } dfs(1, 0), cout << res << '\n';
}
```

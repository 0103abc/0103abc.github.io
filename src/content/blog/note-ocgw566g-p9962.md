---
title: "P9962 [THUPC 2024 初赛] 一棵树 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p9962"
categories: ["题解"]
tags: ["洛谷", "基础算法", "差分", "动态规划", "图论", "树"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P9962).
:::

:::info[Solution]{open}
记 $1$ 号结点为树的根结点，然后考虑 dp。设 $f_{i,j}$ 表示在 $i$ 为根结点的子树里，选择了 $j$ 个黑点，则子树内部边代价的和的最小值是多少。

初始条件显然就是 $f_{i,0}=f_{i,1}=0$。

考虑对一个结点 $u$，合并其子结点 $v$ 的 dp 信息。枚举其儿子结点内部选择了 $x$ 个黑点，然后算上 $<u,v>$ 边对答案的贡献即可。dp 转移可以看作是 $f_{u,i+x}\leftarrow f_{u,i}+f_{v,x}+|2x-k|$。用树形背包的方法来优化一下转移时间复杂度可做到 $O(nk^2)$ 解决问题。

考虑进一步优化。**注意到 $f_u$ 在任何时刻都是下凸的**，因此如果不考虑 $|2x-k|$ 这个东西的话，直接用闵可夫斯基和合并即可。而显然 $|2x-k|$ 这个函数也是凸的，因此考虑维护 $f_u$ 的差分变化量。记 $d_i=f_{u,i}-f_{u,i-1}$，则加入该函数后，前 $\lfloor\frac k2\rfloor$ 个差分会减去 $2$，若 $k$ 为奇数则第 $\lfloor\frac k2\rfloor+1$ 个差分的值不变，其余的差分会增加 $2$。

考虑对每个子树维护两个优先队列分别存储最小的 $\lfloor\frac k2$ 个差分信息和其余差分信息，然后再给两个优先队列分别维护整体加法标记。合并子树信息的时候直接 dsu on tree 可以做到 $O(n\log^2n)$ 的时间复杂度解决问题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];

struct Info {
    priority_queue<int> a;
    priority_queue<int, vector<int>, greater<int>> b;
    int tag_a, tag_b;
    inline Info() { tag_a = tag_b = 0; }
} f[N];

int n, k;

inline void shrink(int u) {
    while (f[u].a.size() > k / 2) {
        f[u].b.emplace(f[u].a.top() + f[u].tag_a - f[u].tag_b);
        f[u].a.pop();
    }
}

// 加凸函数 |2x-k|
inline void add_2x_k(int u) {
    f[u].tag_a -= 2;
    if ((k & 1) && f[u].b.size()) {
        int x = f[u].b.top() + f[u].tag_b;
        f[u].b.pop(), f[u].tag_b += 2, f[u].b.emplace(x - f[u].tag_b);
    } else f[u].tag_b += 2;
}

// merge v into u
inline void merge(int u, int v) {
    while (f[v].a.size()) {
        int x = f[v].a.top() + f[v].tag_a;
        f[v].a.pop(), f[u].a.emplace(x - f[u].tag_a);
    } while (f[v].b.size()) {
        int x = f[v].b.top() + f[v].tag_b;
        f[v].b.pop(), f[u].b.emplace(x - f[u].tag_b);
    } shrink(u);
}

int siz[N];
inline void dfs(int u, int fa) {
    siz[u] = 1;
    for (int &v : adj[u]) if (v != fa)
        dfs(v, u), siz[u] += siz[v], add_2x_k(v);
    int son = 0;
    for (int &v : adj[u])
        if (v != fa && siz[son] < siz[v]) son = v;
    if (son) {
        f[u].a.swap(f[son].a), f[u].b.swap(f[son].b);
        swap(f[u].tag_a, f[son].tag_a), swap(f[u].tag_b, f[son].tag_b);
    } for (int &v : adj[u]) if (v != fa && v != son) merge(u, v);
    f[u].a.emplace(-f[u].tag_a), shrink(u);
}

inline void sol() {
    cin >> n >> k;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } dfs(1, 0);
    int res = k * (n - 1);
    while (f[1].a.size()) res += f[1].a.top() + f[1].tag_a, f[1].a.pop();
    for (int i = 0; i < k - k / 2; ++i) res += f[1].b.top() + f[1].tag_b, f[1].b.pop();
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：6

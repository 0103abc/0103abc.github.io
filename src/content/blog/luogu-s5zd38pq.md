---
title: "CF1266F Almost Same Distance 题解"
date: "2026-08-11T22:27:40.000Z"
link: "luogu-s5zd38pq"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "排序"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/s5zd38pq)。

:::info[Solution]{open}
这个合法集合的限制看着就非常的紧，然后观察一下可以发现结论：

+ 当距离为偶数 $k=2d$ 时，只有两种合法的情况：
  + 选择一个中心点 $u$，然后集合中的每个点都可以放在距离 $u$ 为 $d$ 的不同方向上，记 $cnt_{u,i}$ 表示 $u$ 结点有多少个方向的深度至少为 $i$，则最多可以选 $cnt_{u,d}$ 个结点。
  + 选择一条中心边 $<u,v>$，然后在 $u$ 除了 $v$ 以外的不同方向上选距离为 $d$ 的点，$v$ 除了 $u$ 以外的方向上选距离为 $d$ 的点。此时同侧点的距离为 $k$，非同侧的点的距离为 $k+1$。
+ 当距离为奇数 $k=2d+1$ 时，只有一种合法的情况：
  + 选择一个中心点 $u$，则此时先选所有距离 $u$ 为不同方向上距离为 $d$ 的点，此时如果存在深度恰好为 $d-1$ 的子树那么可以恰好选一个该子树内深度为 $d-1$ 的点。
 
先单独计算 $res_1=\max\limits_i(\deg_i+1)$。然年后考虑先以 $1$ 号结点为根，求出 $down_u$ 表示从 $u$ 往子树内最多走多远，转移是容易的，对每个 $u$ 点的儿子 $v$ 点更新 $down_u=\max(down_u,down_v+1)$ 即可。然后再求出 $up_u$ 表示从 $u$ 开始往父亲的方向最多走多少，这个同样也是容易维护的，记 $u$ 是 $v$ 的父亲，则有 $up_v=1+\max(up_u,\max\limits_{w\in\text{son}_u}(down_w+1))$，对每个结点维护一下信息的最大值和次大值以及来源就可以 $O(n)$ 求出整个数组的值。

然后考虑按照每个点的深度倒序扫描，设当前扫描到的深度为 $d$，则记 $cnt_u$ 表示深度至少为 $d$ 的方向数量。则此时点中心可以直接 $\max cnt_u$ 求出，边的中心考虑维护 $maxson_u$ 表示 $u$ 结点所有儿子的 $cnt_u$ 的最大值，则所有边中心的答案就是 $\max\limits_u(cnt_u+maxson_u-2)$。每次增加 $cnt_u$ 的时候只需要更新 $u$ 本身和其父亲结点 $fa_u$ 的 $maxson_u$ 信息即可。

奇数答案直接枚举深度恰好为 $d-1$ 的集合，如果前期总出现点 $u$ 则说明 $u$ 存在一个方向深度恰好为 $d-1$，直接用 $cnt_u+1$ 更新答案即可。排序用桶排序即可做到线性时间复杂度解决问题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N], buc[N];
int res[N], cnt[N], up[N], maxcnt[N], down[N];
inline void dfs(int u, int fa) {
    up[u] = fa;
    for (int &v : adj[u]) if (v != fa) dfs(v, u), down[u] = max(down[u], down[v] + 1);
}
inline void dfs2(int u, int fa, int up) {
    int m1 = up, m2 = 0;
    if (fa) buc[up].emplace_back(u);
    for (int &v : adj[u]) if (v != fa) {
        buc[down[v] + 1].emplace_back(u);
        if (down[v] + 1 > m1) m2 = m1, m1 = down[v] + 1;
        else if (down[v] + 1 > m2) m2 = down[v] + 1;
    } for (int &v : adj[u]) if (v != fa) dfs2(v, u, 1 + ((down[v] + 1 == m1) ? m2 : m1));
}
inline void sol([[maybe_unused]]int __testcase_id) {
    int n; cin >> n;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } dfs(1, 0), dfs2(1, 0, 0);
    for (int i = 1; i <= n; ++i) res[i] = 1;
    int v1 = 0, v2 = 0;
    for (int d = n; d; --d) {
        for (int &i : buc[d]) {
            ++cnt[i], v1 = max(v1, cnt[i]), v2 = max(v2, cnt[i] + maxcnt[i] - 2);
            if (up[i] && cnt[i] > maxcnt[up[i]]) maxcnt[up[i]] = cnt[i], v2 = max(v2, cnt[up[i]] + maxcnt[up[i]] - 2);
        }
        if (d + d <= n) res[d + d] = max<int>({1, v1, v2});
        if (d + d - 1 <= n) {
            res[d + d - 1] = max<int>(1, v1);
            if (d == 1) res[d + d - 1] = max(res[d + d - 1], v1 + 1);
            else for (int &i : buc[d - 1]) res[d + d - 1] = max(res[d + d - 1], cnt[i] + 1);
        }
    } for (int i = 1; i <= n; ++i) cout << res[i] << ' '; cout << '\n';
}

} // namespace lowspeed_song
```
:::

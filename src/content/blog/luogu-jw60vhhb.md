---
title: "P17797 [CXOI R7-B1] 晴涵梦（Easy Version） 题解"
date: "2026-10-25T13:35:13.000Z"
link: "luogu-jw60vhhb"
categories: ["题解"]
tags: ["洛谷", "数学", "概率与期望", "动态规划", "搜索", "深度优先搜索"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/jw60vhhb)。

Official Solution.

设 $f_{i,0/1}$ 表示当前处理完了以 $i$ 为根的子树，且 $i$ 号结点通关，当前不在 / 在 $i$ 号点放存档，最小期望通关代价是多少。

显然对于通关概率为 $\frac1{p_i}$ 的 $i$ 结点而言，期望需要花费 $p_i$ 次才可以通关该结点。

那么考虑转移。假设当前已经处理完了 $u$ 子树内的所有点的 dp 值，现在要更新 $f_{u,0/1}$ 的值，则套路的，考虑枚举 $u$ 子树中的所有结点 $v$，则考虑每个 $v$ 对 $u$ 的 dp 值贡献。注意到有 $f_{u,1}=f_{u,0}+a_u$，所以你只需要处理 $f_{u,0}$：

+ $v$ 点无存档，那么此时你下一次挑战 $u$ 结点就需要先把 $v$ 整个子树重新通关一次，即代价为 $f_{v,0}p_u$。
+ $v$ 点有存档，那么此时你下一次挑战 $u$ 结点就只需要重新通关 $v$ 结点，即代价为 $f_{v,1}+c_vp_v(p_u-1)$。

把整个 dp 状态结合起来，可得：$f_{u,0}=c_up_u+\sum\limits_{v\in\text{son}(u)}\min(p_uf_{v,0},f_{v,1}+(p_u-1)c_vp_v),f_{u,1}=f_{u,0}+a_u$。直接对树做一次 dfs 遍历，总时间复杂度为 $O(n)$ 可以通过……吗？

### 为什么全程使用 `__int128` 计算不会导致答案溢出？

考虑这样一个策略：

> 每次通关树上一个点之后，立即放一个存档。

下面考虑计算这个策略的答案。考虑对于任意一个结点 $u\neq 1$：在其父亲结点 $fa_u$ 没有被存档之前，$fa_u$ 的挑战每失败一次，$u$ 就会变为未通关一次。但是 $u$ 有存档，所以此时其余结点的通关情况不会受到影响。因为父亲通关的期望尝试次数为 $p_{fa_u}$，所以 $u$ 需要重新通关的期望次数也为 $p_{fa_u}$。

因此该策略的总期望花费是：$\sum\limits_{i=1}^na_i+c_1p_1+\sum\limits_{i=2}^n(c_ip_i(p_{fa_i}-1))$，最优值显然不会比这个更大。而对于题面中给出的数据范围，对于 $a_i,c_i,p_i\le 10^8,n\le 10^5$ 的部分，加上上面转移过程中 $f_{v,0}$ 还需要乘以一个 $p_u$（虽然这种情况不会更新答案）也就是说上面给出的式子的最大值在 $10^{38}$ 左右。而又有 $10^{38}<2^{127}$，因此在本题的数据范围下 `__int128` 可以存储 dp 数组。

而对于 $a_i,c_i,p_i\le 10^9$ 的部分，$f_{v,0}$ 的最大值大约在 $10^{32}$ 左右，而因为转移过程中需要乘一个 $p_u$，这样一来两数相乘可以达到 $10^{41}$ 级别，进而导致出现 `__int128` overflow。一个做法是写一个高精度，但是这十分的不优美。注意到 $f_{v,0}$ 的值肯定不会比 $10^{32}$ 大超过一个数量级，因此考虑直接计算 $f_{v,0}$ 和 $p_u$ 的数位数，如果两数在十进制下数位数之和 $\ge 36$，那么这样肯定是会远大于 $f_{v,0}$ 上界的，无需更新答案。否则两数乘积一定不会超过 `__int128` 范围，两种情况取 `min` 更新答案即可。此时因为要统计一个数的位数，时间复杂度变为 $O(n\log n)$ 但是仍可以通过该题。

其实是很容易修改到 $O(n)$ 的，直接用 $10^{36}$ 去除另外一个数就可以了，~~但是我懒得改了（）~~ 修掉了。

:::success[$O(n\log n)$ 代码实现]
```cpp line-numbers
namespace Loyalty
{
    vector<int> adj[N];
    i128 f[N][2];
    int a[N], c[N], p[N];
    inline int count_bit(i128 val)
    {
        int cnt = 0;
        do
            ++cnt, val /= 10;
        while (val);
        return cnt;
    }
    inline void dfs(int u, int fa)
    {
        f[u][0] = c[u] * p[u];
        for (int &v : adj[u])
            if (v != fa)
            {
                dfs(v, u);
                if (count_bit(p[u]) + count_bit(f[v][0]) > 36)
                    f[u][0] += f[v][1] + (i128)(p[u] - 1) * c[v] * p[v];
                else
                {
                    i128 m1 = p[u] * f[v][0];
                    i128 m2 = f[v][1] + (i128)(p[u] - 1) * c[v] * p[v];
                    f[u][0] += min(m1, m2);
                }
            }
        f[u][1] = f[u][0] + a[u];
    }
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i)
            adj[i].clear();
        for (int i = 1; i < n; ++i)
        {
            int a, b;
            cin >> a >> b;
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
        }
        for (int i = 1; i <= n; ++i)
            cin >> a[i] >> c[i] >> p[i];
        for (int i = 1; i <= n; ++i)
            f[i][0] = f[i][1] = 0;
        dfs(1, 0);
        cout << (int)(f[1][0] % mod) << '\n';
    }
} // namespace Loyalty
```
:::

:::success[$O(n)$ 代码实现]
```cpp line-numbers
namespace lowspeed_song {

mt19937_64 mt(time(0));

inline void init() {
}

vector<int> adj[N];
i128 f[N][2];
int a[N], c[N], p[N];

constexpr i128 iinf = 3e36;

inline void dfs(int u, int fa) {
    f[u][0] = c[u] * p[u];
    for (int &v : adj[u]) if (v != fa) {
        dfs(v, u);
        if (iinf / p[u] < f[v][0]) f[u][0] += f[v][1] + (i128)(p[u] - 1) * c[v] * p[v];
        else f[u][0] += min<i128>(p[u] * f[v][0], f[v][1] + (i128)(p[u] - 1) * c[v] * p[v]);
    } f[u][1] = f[u][0] + a[u];
}

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) adj[i].clear(), f[i][0] = f[i][1] = 0;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } for (int i = 1; i <= n; ++i) cin >> a[i] >> c[i] >> p[i];
    dfs(1, 0), cout << (int)(f[1][0] % mod) << '\n';
}

} // namespace lowspeed_song
```
:::

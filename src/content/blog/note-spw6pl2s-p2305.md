---
title: "P2305 [NOI2014] 购票 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p2305"
categories: ["题解"]
tags: ["洛谷", "数据结构", "单调栈", "图论", "树", "基础算法", "贪心"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P2305).
:::

:::info[Solution]{open}
（可能是第一次写斜率优化）

记 $f_i$ 表示从 $i$ 号点移动到 $1$ 号点所需花费的最小代价是多少。容易得到重要贪心结论：$u$ 点移动过程中一定只会一直沿着从其出发到根结点的路径移动。因此容易想到维护 $dis_i$ 表示从 $i$ 号点到 $1$ 号点的简单路径的长度是多少，则此时对于有祖孙关系的 $u,v$ 两个点，其在树上的简单路径距离就是 $|dis_u-dis_v|$。容易列出 $O(n^2)$ 时间复杂度的 dp 转移方程：

$$
f_i=\min\limits_{j是i的祖先\land dis_i-dis_j\le l_i}(f_j+(dis_i-dis_j)p_i+q_i)
$$

简单变形后可得：

$$
f_i=b_i+\min\limits_{j是i的祖先\land dis_i-dis_j\le l_i}(f_j-dis_jp_i)
$$

这个式子看上去就非常能斜率优化。对相邻的两个满足条件的转移点 $j,k$ 比较从其转移而来可得的贡献：$f_j-dis_jp_i\ge f_k-dis_kp_i\Leftrightarrow f_k-f_j\ge(dis_k-dis_j)p_i$。因为所有合法转移点都必然是从 $i$ 开始到 $1$ 号结点的简单路径上的一段前缀，因此这里认为 $j$ 在树上是 $k$ 结点的祖先，即 $dis_j+1=dis_k$，后面只需要利用 $dis_j<dis_k$ 性质即可。此时把 $dis_i$ 看作是 $x$ 轴坐标，$f_i$ 看作是 $y$ 轴坐标，则决策 $j$ 优于决策 $k$ 当且仅当 $\frac{f_k-f_j}{dis_k-dis_j}>p_i$ 即 $(dis_j,f_j)$ 和 $(dis_k,f_k)$ 两个点之间组成的线段斜率严格大于 $p_i$。

此时考虑套路的用单调栈来维护一个下凸壳作为合法转移点，此时对每个 $p_i$ 在下凸壳上二分即可单 $\log$ 时间复杂度找出合适的决策点。

然而此时并不能直接这样维护单调栈，因为在栈中弹出的决策点还有可能在其他点被弹栈时再次成为合法且可能最优的决策点。因此考虑用树状数组通过维护若干个区间内单调栈的信息来得出某一个后缀内单调栈的信息做到 $O(n\log^2n)$ 时间复杂度解决问题。特殊的，因为单调栈需要在树上动态维护，因此在支持插入操作的过程中还需要支持回溯（即回滚上一次入栈）操作，而直接暴力回滚时间复杂度可能会退化到单次 $O(n)$。考虑维护之前每一次操作前栈顶指针的位置和操作后栈顶位置在操作前的值，其余弹栈的位置的信息看作冗余信息即可做到 $O(1)$ 撤销入栈操作。

该算法总时间复杂度为 $O(n\log^2n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int dep[N], w[N], p[N], q[N], lim[N], dis[N], pd[N], n, ty, f[N];

struct Convex_Hull {
    vector<pair<int, int>> stk;
    vector<int> a;
    int top = 0;
    inline int bad(int x, int y, int z) { return (i128)(f[y] - f[x]) * (dis[z] - dis[y]) >= (i128)(f[z] - f[y]) * (dis[y] - dis[x]); }
    inline void push(int x) {
        int old = top, pos = top, l = 1, r = top - 1;
        while (l <= r) {
            int mid = l + r >> 1;
            if (bad(a[mid - 1], a[mid], x)) pos = mid, r = mid - 1;
            else l = mid + 1;
        } stk.emplace_back(old, (pos < a.size()) ? a[pos] : 0);
        if (pos == a.size()) a.emplace_back(x);
        else a[pos] = x;
        top = pos + 1;
    }
    inline void pop() {
        auto [oldtop, oldval] = stk.back(); stk.pop_back();
        a[top - 1] = oldval, top = oldtop;
    }
    inline int qry(int x) {
        if (!top) return inf;
        int l = 0, r = top - 2, best = 0;
        while (l <= r) {
            int mid = l + r >> 1;
            if ((i128)(f[a[mid + 1]] - f[a[mid]]) <= (i128)x * (dis[a[mid + 1]] - dis[a[mid]])) l = mid + 1, best = mid + 1;
            else r = mid - 1;
        } return f[a[best]] - dis[a[best]] * x;
    }
};

struct BIT {
    Convex_Hull tree[N];
    inline void add(int x, int v) { for (x = n - x; x <= n; x += (x &- x)) tree[x].push(v); }
    inline void del(int x) { for (x = n - x; x <= n; x += (x &- x)) tree[x].pop(); }
    inline int qry(int x, int v) {
        int res = inf;
        for (x = n - x; x; x -= (x &- x)) res = min(res, tree[x].qry(v));
        return res;
    }
} fwt;

vector<int> adj[N];

inline void sol() {
    cin >> n >> ty;
    for (int i = 2; i <= n; ++i) {
        int fa; cin >> fa;
        cin >> w[i] >> p[i] >> q[i] >> lim[i];
        adj[fa].emplace_back(i);
    } fwt.add(0, 1);
    vector<pair<int, int>> stk = {{1, 0}};
    while (stk.size()) {
        int u = stk.back().first, &i = stk.back().second;
        if (i == adj[u].size()) {
            if (u != 1) fwt.del(dep[u]);
            stk.pop_back();
        } else {
            int v = adj[u][i++];
            dep[v] = dep[u] + 1, dis[v] = dis[u] + w[v], pd[dep[v]] = dis[v];
            f[v] = dis[v] * p[v] + q[v] + fwt.qry(lower_bound(pd, pd + dep[v], dis[v] - lim[v]) - pd, p[v]);
            fwt.add(dep[v], v), stk.emplace_back(v, 0);
        }
    } for (int i = 2; i <= n; ++i) cout << f[i] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：7

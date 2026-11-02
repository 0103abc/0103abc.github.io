---
title: "AT_arc086_c [ARC086E] Smuggling Marbles 题解"
date: "2026-08-30T14:59:08.000Z"
link: "luogu-d31mos9w"
categories: ["题解"]
tags: ["AtCoder", "动态规划", "数学", "概率与期望"]
draft: false
---

> 又一遍又一遍那天相见  
又一遍又一遍思绪万千   
在夏日尽头的你能否回忆起最初时的誓约  
临走前你最后露出笑脸  
我们的夏日在这里完结  

暑假结束了/ll

有一个显然的观察是：深度不同的弹珠永远也不会相遇。

考虑计数转概率，记 $f_{u,i}$ 表示 $u$ 为根的子树中，距离 $u$ 点恰好为 $i$ 的点，弹珠一路向上走到 $i$ 点时恰好剩下一个弹珠的概率。则显然有边界条件 $f_{u,0}=\frac12$。然后到 $u$ 点时剩下恰好一个弹珠等价于是说其所有儿子结点中，恰有一个儿子送来了弹珠。枚举是哪个儿子送来的，转移就是 $f_{u,i}=\sum\limits_{v\in\text{son}(u)}f_{v,i-1}\prod\limits_{w\neq v}(1-f_{w,i-1})$，写个前后缀优化可以做到平方时间复杂度转移。

然后可以发现 dp 信息的第二维是向下深度的信息，因此容易想到用长剖优化，直接继承长儿子的 dp 信息，然后其他儿子的信息直接暴力合并，容易分析时间复杂度为 $\mathcal O(n)$。

震撼的发现我不会写长剖优化 dp，请输入文本。代码中包含少量辅助理解长剖优化 dp 的注释。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
int high[N], son[N], tot, e[N], f[N], g[N];

inline void dfs(int u, int fa) {
    high[u] = 1, son[u] = -1;
    for (int &v : adj[u]) if (v != fa) {
        dfs(v, u);
        if (high[u] < high[v] + 1) high[u] = high[v] + 1, son[u] = v;
    }
}

inline void dfs2(int u, int fa) {
    // 长儿子直接复用父亲结点 dp 数组的下一格
    if (~son[u]) e[son[u]] = e[u] + 1, dfs2(son[u], u);
    // 其他儿子新开一段 dp 空间
    for (int &v : adj[u]) if (v != fa && v != son[u])
        e[v] = tot, tot += high[v], dfs2(v, u);
    // ============================================
    f[e[u]] = i2;
    int mx = 0;
    for (int &v : adj[u]) if (v != fa && v != son[u]) {
        for (int i = mx + 1; i <= high[v]; ++i) g[e[u] + i] = (1 - f[e[u] + i] + mod) % mod;
        mx = max(mx, high[v]);
        for (int i = 1; i <= high[v]; ++i) {
            f[e[u] + i] = (f[e[u] + i] * (1 - f[e[v] + i - 1] + mod) % mod + g[e[u] + i] * f[e[v] + i - 1] % mod) % mod;
            g[e[u] + i] = g[e[u] + i] * (1 - f[e[v] + i - 1] + mod) % mod;
        }
    }
}

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n, res = 0; cin >> n;
    for (int i = 1; i <= n; ++i) {
        int x; cin >> x;
        adj[x].emplace_back(i), adj[i].emplace_back(x);
    } dfs(0, -1), tot = high[0], dfs2(0, -1);
    for (int i = 0; i < high[0]; ++i) res = (res + f[e[0] + i]) % mod;
    cout << res * power(2, n + 1, mod) % mod << '\n';
}

} // namespace lowspeed_song
```
:::

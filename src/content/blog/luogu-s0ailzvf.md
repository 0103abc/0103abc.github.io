---
title: "P17798 [CXOI R7-B2] 晴涵梦（Hard Version） 题解"
date: "2026-10-25T13:36:10.000Z"
link: "luogu-s0ailzvf"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数学", "概率与期望", "基础算法", "差分"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/s0ailzvf)。

Official Solution.

同样考虑 dp。设 $f_{i,j}$ 表示因为其祖先结点不断失败，导致结点 $i$ 总共需要被重新通关 $j$ 次时，完成 $i$ 为根子树这一部分所需要的最小期望代价是多少。考虑如果 $i$ 需要成功 $j$ 次，因为单次成功的概率是 $\frac 1{p_i}$ 因此期望一共挑战 $jp_i$ 次，即 $i$ 结点自身期望花费 $jp_ic_i$ 的代价。

考虑如果最终要在 $i$ 结点存档，则显然第一次成功后直接存档要比之后存档更优。因此实际需要考虑的只有两种决策：

+ $i$ 结点一直没有存档，则此时每次挑战 $i$ 结点失败都会继续重置儿子结点信息，因此儿子一共需要承担 $jp_i$ 次。
+ $i$ 结点在第一次成功通关后立即存档。第一次成功前期望挑战次数仍然是 $p_i$ 因此儿子只需要承担最开始的这 $p_i$ 次，后续 $i$ 结点的失败将不会影响子树内其余结点。

因此 dp 的转移形如：$f_{i,j}=jp_ic_i+\min(\sum\limits_kf_{k,jp_i},a_i+\sum\limits_kf_{k,p_i})$。但是 dp 信息的第二维可以特别大，因此显然无法直接转移。

考虑对这个 dp 做一点小小的转化。记 $g_{i,j}=f_{i,j}-jp_ic_i-\sum\limits_kf_{k,p_i}$，则 $g$ 数组的转移方程形如 $g_{i,j}=\min(a_i,\sum\limits_kp_i(j-1)p_kc_k+g_{k,jp_i}-g_{k,p_i})$。

此时可以证明 $g_{i,*}$ 是一个凸函数。具体考虑归纳，注意到转移中后半部分的 $p_i(j-1)p_kc_k+g_{k,jp_i}-g_{k,p_i}$ 在 $g_{k,*}$ 已经被确定是凸函数时是一个凸函数加上一个线性函数的形式，再对一个常数取 $\min$ 后仍然是凸函数。而对叶子结点而言显然有 $g_{i,j}=0$ 满足凸性。因此 $g_{i,*}$ 确实是凸函数。同时还可以用类似的方法证明 $g_{i,*}$ 是单调不降的函数。

进一步简单观察 $g_{i,*}$ 的性质后可以发现必有 $0\le g_{i,j}\le a_i$ 和 $g_{i,1}=0$。对凸函数套路的做差分后记 $d_j=g_{i,j+1}-g_{i,j}$。因为 $g_i$ 是凸函数因此 $d_j$ 必然是非负而且单调不增的整数。一旦有某个位置 $d_j=0$ 则 $j$ 之后的所有位置 $k$ 都必然满足 $d_k=0$。

因此此时 dp 数组的第二维只需要考虑到 $a_i+1$。如果此时 $g_{i,a_i+1}=a_i$ 则 dp 数组的值已经取到了上界，之后所有值都是完全相同的。否则根据抽屉原理可知前 $a_i$ 个位置中至少有一个位置的差分值为 $0$，因此后面所有位置的值同样必然保持不变。因此可以得到结论：$g_{i,j}=g_{i,\min(j,a_i+1)}$。

考虑进一步优化，观察对固定的 $i$ 而言有效的 $j$ 有哪些取值。容易发现根结点一定只有 $j=1$ 的状态有效。而如果当前结点 $i$，$j$ 状态是有效的，则其子结点 $k$ 必然只会查询到 $p_i,jp_i$ 这两个状态。因此每个状态 $j$ 本质都可以看作是沿着祖先路径不断乘以某个 $p_*$ 然后对 $a_i+1$ 取 $\min$ 得到的。对结点 $i$ 而言记真正需要计算的 $j$ 状态组成的集合为 $S_i$ 则考虑直接从根往子树内生成，初始显然有 $S_1=\lbrace 1\rbrace$。而对 $i$ 的每个子结点 $k$ 都有 $S_k=\lbrace1\rbrace\cup\lbrace\min(a_k+1,p_ix)\mid x\in S_i\rbrace$。对每个 $i$ 只处理 $j\in S_i$ 的转移信息即可。

考虑这个时间复杂度为什么是对的。对每个 $S_i$ 状态去重后，接下来的每一次转移若 $p_i=1$ 则状态不会发生变化，而若 $p_i>1$ 则每次产生一个新的状态值至少会翻倍，而因为还有 $a_i$ 的上界所以最多翻 $30$ 次倍状态的值就不会继续增长了。因此每个结点 $i$ 最多只有 $O(\log V)\approx 31$ 个不同的合法状态 $j$ 需要处理，直接对这个东西进行 $g$ 数组的 dp，然后在 dp 过程中顺便维护 $h_i=\sum\limits_kf_{k,p_i}=\sum\limits_k(p_ip_kc_k+g_{k,p_i}+h_k)$，最后的答案 $f_1=p_1c_1+h_1$ 就可以被直接计算出。总时间复杂度为 $O(n\log V)$，如果实现不优美的话可能会退化到 $O(n\log n\log V)$ 或者 $O(n\log^2V)$。实现上有一些细节，比如说 $g$ 数组不能一边算一边取模而需要到最后 dp 完之后在取模算答案，视实现情况可能需要用 `__int128` 来存 dp 信息。

:::success[代码实现]
```cpp line-numbers
namespace ChatGPT_6_Astra_Ultra_Fast {

mt19937_64 mt(time(0));

inline void Estradiol() {
}

vector<int> adj[N], S[N], g[N];
int a[N], c[N], p[N], h[N];

inline int cap(int u, i128 x) { return min<i128>(x, a[u] + 1); }
inline int get(int u, int x) {
    x = min(x, a[u] + 1);
    return g[u][lower_bound(S[u].begin(), S[u].end(), x) - S[u].begin()];
}
inline void dfs(int u, int fa) {
    for (int &v : adj[u]) if (v != fa) {
        S[v] = {1};
        for (int &x : S[u]) {
            int y = cap(v, (i128)x * p[u]);
            if (y != S[v].back()) S[v].emplace_back(y);
        } dfs(v, u);
    }
}
inline void dfs2(int u, int fa) {
    for (int &v : adj[u]) if (v != fa) dfs2(v, u);
    g[u].clear(), g[u].resize(S[u].size(), 0);
    for (int k = 0; k < S[u].size(); ++k) if (S[u][k] > 1) {
        i128 sum = 0;
        for (int &v : adj[u]) if (v != fa) {
            int y = cap(v, (i128)S[u][k] * p[u]);
            sum += (i128)p[u] * (S[u][k] - 1) * p[v] * c[v] + get(v, y) - get(v, p[u]);
            if (sum >= a[u]) { sum = a[u]; break; }
        } g[u][k] = sum;
    } h[u] = 0;
    for (int &v : adj[u]) if (v != fa)
        h[u] = (h[u] + p[u] % mod * (p[v] % mod) % mod * (c[v] % mod) % mod + h[v] + get(v, p[u]) % mod) % mod;
}

inline void Spironolactone([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) adj[i].clear(), S[i].clear(), g[i].clear(), h[i] = 0;
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    } for (int i = 1; i <= n; ++i) cin >> a[i] >> c[i] >> p[i];
    S[1] = {1}, dfs(1, 0), dfs2(1, 0), cout << ((p[1] % mod) * (c[1] % mod) + h[1]) % mod << '\n';
}

} // namespace ChatGPT_6_Astra_Ultra_Fast
```
:::

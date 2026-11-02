---
title: "P3412 仓鼠找sugar II 题解"
date: "2025-04-27T06:02:44.000Z"
link: "luogu-x39eepjy"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数学", "概率与期望", "搜索", "深度优先搜索"]
draft: false
---

显然是 dp 题。

先考虑 $O(n^2)$ 的暴力解法。枚举当前出发点为 $x$，设 $f_i$ 表示 $i$ 子树内所有点走到 $x$ 结点的期望步数的和。直接转移是困难的，因此套路的考虑列辅助 dp：设 $g_i$ 表示当前出发点为 $x$，从 $i$ 点走到其父亲结点所需要的期望步数。那么此时有两种转移：

+ 直接走到父亲结点。
+ 进入若干个儿子结点然后再到父亲结点。

因此显然可以列出转移：

$g_i=\dfrac{1}{\deg_i}+\dfrac{1}{\deg_i}{\large\sum\limits_{j\text{ is i's son}}}(1+g_i+g_j)$

感性理解，加号前面的部分是直接走到父亲结点（这里我们认为此时树的根节点为 $x$）的概率，加号后面的部分是枚举走到的哪一个儿子然后从儿子结点走到当前结点再从当前结点走到父亲结点所需的期望步数。

但是很显然这个转移带环。可以想到高消但是时间复杂度起飞了，因此使用另一种套路：

$$
\begin{aligned}
&g_i=\frac{1}{\deg_i}+\frac{1}{\deg_i}{\sum\limits_{j\text{ is i's son}}}(1+g_i+g_j)\\
&g_i=\frac{1}{\deg_i}({1+\sum\limits_{j\text{ is i's son}}}(1+g_i+g_j))\\
&g_i=\frac{1}{\deg_i}(\deg_i+\sum\limits_{j\text{ is i's son}}(g_i+g_j))\\
&g_i=1+\frac{1}{\deg_i}\sum\limits_{j\text{ is i's son}}(g_i+g_j)\\
&g_i=1+\frac{1}{\deg_i}((\deg_i-1)g_i+\sum\limits_{j\text{ is i's son}}g_j)\\
&\deg_ig_i=\deg_i+(\deg_i-1)g_i+\sum\limits_{j\text{ is i's son}}g_j\\
&g_i=\deg_i+\sum\limits_{j\text{ is i's son}}g_j
\end{aligned}
$$

此时转移结构形成 DAG，因此可以一次 dfs 在 $O(n)$ 的时间复杂度内求出 $g$ 数组。问题变为计算 $f$。

这个部分是容易的。考虑再做一次辅助 dp：设 $h_i$ 表示当前以 $x$ 结点为根结点的情况下，$i$ 为根的子树内结点的数量。转移十分平凡。因此可以简单列出 $f$ 的 dp 式：$f_i=\sum\limits_{j\text{ is i's son}}(f_j+g_jh_j)$，同样可以一次 dfs 求出答案。

于是得到了 $O(n^2)$ 的暴力 dp，需要继续优化：

对于需要计算多个根结点的 dp，考虑套路的换根优化。具体的，先对 $1$ 为根的情况暴力求出 $f,g,h$ 三个数组，然后设 $F_i$ 表示以 $i$ 结点为根答案是多少。那么 $F_1$ 可以直接计算，而 $F_i$ 则可以直接计算从其父亲到 $i$ 贡献会如何变化。设其父亲结点为 $j$，那么转移式为：

$$
F_i=F_j-g_ih_i+(n-h_i)(g_1-g_i)
$$

同样可以一次 dfs 在 $O(n)$ 的时间复杂度内求出答案，总时间复杂度为 $O(n)$ 可以通过该题。

```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/rope>
#define int long long
using namespace std;
const int inf = 2e18;
using ull = unsigned long long;
template<class _T>
using treap = __gnu_pbds::tree<_T, __gnu_pbds::null_type, less_equal<_T>, __gnu_pbds::rb_tree_tag, __gnu_pbds::tree_order_statistics_node_update>;
using POD = pair<double, double>;
const int N = 200010;
const int mod = 998244353;
int power(int a, int b, int c) {
    int ans = 1;
    while (b) {
        if (b & 1) ans = ans * a % c;
        a = a * a % c, b >>= 1;
    }
    return ans;
}
inline int inversion(int x) {
    return power(x, mod - 2, mod);
}
vector<int> adj[N];
int f[N], g[N], h[N], F[N], deg[N], n;
void dfs(int u, int fa) {
    h[u] = 1;
    for (int &v : adj[u])
        if (v != fa) {
            dfs(v, u);
            h[u] += h[v];
        }
}
void dfs2(int u, int fa) {
    g[u] = deg[u];
    for (int &v : adj[u])
        if (v != fa) {
            dfs2(v, u);
            g[u] += g[v];
            g[u] %= mod;
        }
}
void dfs3(int u, int fa) {
    f[u] = 0;
    for (int &v : adj[u])
        if (v != fa) {
            dfs3(v, u);
            f[u] = (f[u] + f[v] + g[v] * h[v] % mod) % mod;
        }
}
void dfs4(int u, int fa) {
    for (int &v : adj[u])
        if (v != fa) {
            F[v] = (F[u] - g[v] * h[v] % mod + (n - h[v]) * (g[1] - g[v]) % mod + mod * 2) % mod;
            dfs4(v, u);
        }
}
signed main() {
    // freopen("count.in", "r", stdin);
    // freopen("count.out", "w", stdout);
    // freopen("debug.err", "w", stderr);
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    srand(time(0));
    cin >> n;
    for (int i = 1; i < n; ++i) {
        int a, b;
        cin >> a >> b;
        adj[a].emplace_back(b);
        adj[b].emplace_back(a);
        ++deg[a], ++deg[b];
    }
    dfs(1, 0);
    dfs2(1, 0);
    dfs3(1, 0);
    F[1] = f[1];
    // cout << F[1] << '\n';
    dfs4(1, 0);
    int s = accumulate(F + 1, F + n + 1, 0ll) % mod;
    // for (int i = 1; i <= n; ++i) cout << g[i] << ' ';
    // cout << '\n';
    // cout << s << '\n';
    int all = n * n % mod;
    cout << s * inversion(all) % mod << '\n';
    return 0;
}

/*

5
2 1
3 1
4 3
5 3

*/

```

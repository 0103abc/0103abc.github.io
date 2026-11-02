---
title: "CF1967C Fenwick Tree 题解"
date: "2025-02-11T05:45:03.000Z"
link: "luogu-g9za29go"
categories: ["题解"]
tags: ["Codeforces", "数据结构", "树状数组", "基础算法", "前缀和", "数学", "组合数学"]
draft: false
---

为什么大家都会做这题啊呜呜呜/dk/dk/dk

题目名叫 Fenwick Tree 那就提示我们这题和 Fenwick Tree 有关。可以发现题目中给出的 $s_i$ 和 $a$ 中的关系正好就是树状数组中根节点和子树内结点的关系。而每一次操作，就是对于每一个结点，将其子树内所有结点的权值添加到她身上。

直接计算每一个点的贡献是困难的，考虑计算每一个点对其他结点产生的贡献。显然一个点 $x$ 对另一个点 $y$ 产生了至少 $1$ 的贡献，当且仅当 $x$ 在 $y$ 的子树内，同 $y$ 为 $x$ 的直属祖先结点。又因为 Fenwick Tree 中时间复杂度为 $O(\log n)$，所以树中所有结点 $x$ 都只有 $O(\log n)$ 个会因其产生贡献的结点。

现在问题变为：一个结点 $x$ 会对其直属祖先结点 $y$ 产生多少的贡献。这里设 $\text{depth}(x)$ 表示 $x$ 点在树中的深度，那么 $x,y$ 之间会有 $\text{depth}(x)-\text{depth}(y)$ 个结点来帮助传递 $x$ 到 $y$ 两个结点的贡献。可以发现路径上每一次产生贡献都是从 $x$ 向 $y$ 做一次链上前缀和，而题目中给定了 $k$ 则说明要做 $k$ 次链上前缀和。考虑将其移出链中，转移到数组上，并取出原有权值对答案的影响，那么问题变为：

+ 现在有一个长度为 $d$ 的数组 $a$，初始只有 $a_1=1$。对其做 $k$ 次前缀和，问 $a_d$ 的值是多少。

这个问题是十分经典的组合问题，容易证明答案为：$\binom{d+k-1}{d}$。又因为 Fenwick Tree 优秀的性质，树高为 $\log$ 级别，所以每一个点 $x$ 直接暴力往上跳祖先更新答案即可，无需使用各种高级 ds。另一个问题是虽然 $d\sim O(\log n)$，但是 $k\to10^9$。考虑计算组合数 $\binom{a}{b}$ 中，若 $a\to 10^9$ 而 $b\to 20$，则完全可以直接暴力的根据组合数展开 $O(\log n)$ 计算答案。因此问题得以解决，时间复杂度为 $O(n\log^2n)$。

有一种可爱的优化方法是每一组数据的 $k$ 均为常数，因此直接暴力打出 $d\sim O(\log n)$ 以内的所有组合数表，可以优化到 $O(n\log n)$ 求解，感觉真的不太能再优化了。

写的奇奇怪怪的代码：

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 200010;
const int mod = 998244353;
int a[N], depth[N], up[N];
vector<int> adj[N], radj[N];
void dfs(int u, int fa) {
    up[u] = fa;
    depth[u] = depth[fa] + 1;
    for (int &v : radj[u])
        if (v != fa) dfs(v, u);
}
int power(int a, int b, int c) {
    int ans = 1;
    while (b) {
        if (b & 1) ans = ans * a % c;
        a = a * a % c, b >>= 1;
    }
    return ans;
}
int inversion(int x, int mod) {
    return power(x, mod - 2, mod);
}
int binom(int x, int y) {
    int sum = 1;
    for (int i = 1; i <= y; ++i) sum = sum * (x - i + 1) % mod;
    for (int i = 1; i <= y; ++i) sum = sum * inversion(i, mod) % mod;
    return sum;
}
int table[50], res[N];
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int T;
    cin >> T;
    while (T--) {
        int n, k;
        cin >> n >> k;
        for (int i = 1; i <= n; ++i) cin >> a[i], depth[i] = up[i] = 0;
        for (int i = 1; i <= n; ++i) adj[i].clear(), radj[i].clear();
        for (int i = 1; i <= n; ++i) res[i] = a[i];
        for (int i = 1; i <= n; ++i) {
            int x = i + (i &- i);
            if (x <= n) {
                adj[i].emplace_back(x);
                radj[x].emplace_back(i);
            }
        }
        for (int i = 1; i <= n; ++i)
            if (!depth[i]) dfs(i, 0);
        for (int i = 1; i < 50; ++i) table[i] = binom(i + k - 1, i);
        for (int i = 1; i <= n; ++i) {
            vector<int> parent;
            int j = i;
            while (j) {
                j = up[j];
                if (j) parent.emplace_back(j);
            }
            for (int j = 0; j < parent.size(); ++j) {
                res[parent[j]] = (res[parent[j]] + mod - res[i] * table[j + 1] % mod) % mod;
                // cout << i << ' ' << parent[j] << ' ' << res[parent[j]] << ' ' << a[i] << ' ' << table[j + 1] << '\n';
            }
        }
        for (int i = 1; i <= n; ++i) cout << res[i] << ' ';
        cout << '\n';
    }
    return 0;
}
```

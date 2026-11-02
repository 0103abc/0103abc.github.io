---
title: "AT_tdpc_tree 木 题解"
date: "2024-12-13T04:02:57.000Z"
link: "luogu-blgp2xcb"
categories: ["题解"]
tags: ["AtCoder", "图论", "树", "搜索", "深度优先搜索", "数学", "组合数学"]
draft: false
---

首先套路的，枚举第一条加入的边 $u\to v$，并将其缩为一个点。此时问题变为给定一个有根树，每一次只能从上往下加边，问有多少种不同的加边方法。

然后肯定就是在树上 dfs 遍历每一个结点，然后合并该结点的所有子树信息。设 $f_u$ 表示 $u$ 为根的子树中有多少种不同的加边方法。考虑从简单的情况开始入手：

+ 当前结点 $u$ 没有儿子结点。显然只有一种加边方法。
+ 当前结点 $u$ 恰有一个儿子结点 $v$。显然只能先加 $u\to v$ 这一条边，$f_u=f_v$。
+ 当前结点 $u$ 恰有两个儿子结点 $v_1,v_2$。考虑合并两个儿子结点的信息。首先把 $u$ 和 $v_1$ 为根子树的信息合并，方案数显然为 $f_{v_1}$。然后再将其和 $v_2$ 为根子树合并时：我们设 $g_i$ 表示当前以 $i$ 为根的子树中边的数目，则当前的子问题就和下面的问题相同：
  + 给定两个序列，长度分别为 $g_{v_1}$ 和 $g_{v_2}$。现在需要将两个序列合并为一个长度为 $g_{v_1}+g_{v_2}$ 的序列，且满足在新的序列中原来两个序列中元素的大小关系相对不变。问有多少种不同的新序列。
  + 可以肯定这个转化掉的问题的答案和序列内的值无关。也就是说只需要维护 $f$ 和 $g$ 两个数组的信息。
  + 考虑将第二个序列内的元素按照顺序插入到第一个序列中。则考虑组合计数。最终得到的新序列中有 $g_{v_1}+g_{v_2}$ 的元素，其中有 $g_{v_2}$ 个元素来源于第二个序列，这 $g_{v_2}$ 个元素的顺序已经固定。因此问题的答案为 $\binom{g_{v_1}+g_{v_2}}{g_{v_2}}$。
+ 回到这里讨论的问题。除了上述的 $\binom{g_{v_1}+g_{v_2}}{g_{v_2}}$ 种不同的合并方法外，还有 $v_1$、$v_2$ 为根的子树内对答案的贡献。因此总的合并方案数为：$\binom{g_{v_1}+g_{v_2}}{g_{v_2}}\times f_{v_1}\times f_{v_2}$。
+ 当前结点 $u$ 恰有 $k$ 个儿子结点 $v_1,v_2,\ldots,v_k$。则只需要将这 $k$ 个儿子结点按照顺序依次两两合并即可。

可以通过线性求逆元预处理出组合数，时间复杂度为 $O(n^2)$，可以通过。

```cpp
int n;
vector<int> z[N];
pair<int, int> edge[N];
int f[N], g[N];
int fac[N], inv[N], ifac[N];
int binom(int x, int y) {
    return fac[x] * ifac[y] % mod * ifac[x - y] % mod;
}
void dfs(int u, int fa) {
    g[u] = f[u] = 1;
    for (auto &v : z[u])
        if (v != fa) {
            dfs(v, u);
            g[u] += g[v];
            f[u] = f[u] * f[v] % mod * binom(g[u] - 1, g[v]) % mod;
        }
}
void run() {
    int n = read();
    for (int i = 0; i < 2; ++i)
        fac[i] = inv[i] = ifac[i] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    }
    for (int i = 1; i < n; ++i) {
        int x = read(), y = read();
        edge[i] = {x, y};
    }
    int s = 0;
    for (int i = 1; i < n; ++i) {
        auto [X, Y] = edge[i];
        for (int i = 1; i <= n; ++i) z[i].clear();
        for (int j = 1; j < n; ++j) {
            auto [x, y] = edge[j];
            if (i != j)
                z[x].eb(y), z[y].eb(x);
        }
        fill(f + 1, f + n + 1, 0ll);
        fill(g + 1, g + n + 1, 0ll);
        dfs(X, Y);
        int fx = f[X], gx = g[X];
        fill(f + 1, f + n + 1, 0ll);
        fill(g + 1, g + n + 1, 0ll);
        dfs(Y, X);
        int fy = f[Y], gy = g[Y];
        s = (s + fx * fy % mod * binom(n - 2, gx - 1) % mod) % mod;
    }
    cout << s << '\n';
}
```

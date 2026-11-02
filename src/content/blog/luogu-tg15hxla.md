---
title: "CF178F3 Representative Sampling 题解"
date: "2025-01-26T16:06:52.000Z"
link: "luogu-tg15hxla"
categories: ["题解"]
tags: ["Codeforces", "字符串", "动态规划", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/tg15hxla)。

一道很恶心的题。

[![pEEXXTS.png](https://s21.ax1x.com/2025/01/26/pEEXXTS.png)](https://imgse.com/i/pEEXXTS)

（不过至少算是独立切了对吧）

### F1

Data Range: $n\le 20,|s|\le 500$。

和 F2，F3 的关系不大。考虑设 $f_{i}$ 表示选择了 $i$ 集合内的字符串，这些字符串两两 lcp 的值最大是多少。那么显然有转移：

$$f_{i\text{ with }j}\leftarrow f_i+\sum\limits_{k\text{ in }i}\text{lcp}(s_k,s_j)$$

暴力预处理出后面的字符串两两 lcp，时间复杂度为 $O(2^nn^2)$，极限卡常后应该可以过。代码没写。

### F2

Data Range: $n\le 100,|s|\le 500$。

看上去必须用时间复杂度在多项式级别的做法来搞了。考虑对所有字符串建一棵 Trie 树，那么假设一条边在 $k$ 个叶子结点到根节点的简单路径上，那么这条边对答案产生了 $\dfrac{k(k-1)}{2}$ 的贡献。

于是考虑在 Trie 上搞一个树上背包。设 $f_{i,j}$ 表示 $i$ 为根的子树内，最少选择多少个结点。那么显然有下面的转移：

+ 对于一个结点 $p$，若 $p$ 是某一个串的结尾。那么若 $p$ 点处有 $x$ 个字符串结尾，则 $f_{p,i}=0$ 当且仅当 $0\le i\le x$。为了方便处理可以在 $p$ 后面连一个虚点并在这个虚点上处理 dp 信息。
+ 对于一个非叶子结点 $p$，根据上面的处理方式不需要处理某一个串结尾的情况。于是设 $S$ 集合为 $p$ 所有儿子结点组成的点集，那么依次对每个 $x\in S$，设 $siz_x$ 表示 $x$ 的子树内有多少个字符串的结尾（这个部分可以一遍 dfs 求出），则枚举 $x$ 之前选择了多少个串，在 $x$ 的子树中选择了多少个串，合并信息即可。为了避免重复计算答案，这个地方可以开两个数组 $f,g$，用 $g$ 来合并，最后再将信息 copy 回 $f$ 中。

显然答案就是 $f_{1,m}$。此时可以通过 F2。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 110, M = N * 510;
using ull = unsigned long long;
int a[N];
int n, m;
struct Node {
    signed child[26], cnt;
    Node() {
        memset(child, 0, sizeof child);
        cnt = 0;
    }
} tree[M];
int idx = 1;
void ins(string s) {
    int p = 1;
    for (auto &i : s) {
        int j = i - 'a';
        if (!tree[p].child[j]) tree[p].child[j] = ++idx;
        p = tree[p].child[j];
    }
    ++tree[p].cnt;
}
vector<int> adj[M];
int f[M][110], g[110];
signed siz[M];
int vis[M];
// f[i][j]: i 子树内选择 j 个结点，贡献最大是多少
void dfs(int u, int fa) {
    siz[u] = vis[u];
    for (int &v : adj[u])
        if (v != fa) dfs(v, u), siz[u] += siz[v];
}
int pidx;
void dfs2(int u, int fa) {
    int now = vis[u], son = 0;
    for (int j = 0; j <= vis[u]; ++j) f[u][j] = 0;
    for (int &v : adj[u])
        if (v != fa) {
            ++son;
            dfs2(v, u);
            now += siz[v];
            for (int bk = 0; bk <= min(m, now - siz[v]); ++bk) {
                for (int nw = 1; nw <= min(m, (int)siz[v]) && bk + nw <= m; ++nw) {
                    int val = nw * (nw - 1) / 2 + f[v][nw];
                    if (v <= pidx)
                        g[bk + nw] = max({g[bk + nw], f[u][bk + nw], f[u][bk] + val});
                    else
                        g[bk + nw] = max({g[bk + nw], f[u][bk + nw], f[u][bk]});
                }
            }
            for (int i = 0; i <= m; ++i) f[u][i] = max(f[u][i], g[i]);
            for (int i = 0; i <= m; ++i) g[i] = -1e18;
        }
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) {
        string s;
        cin >> s;
        ins(s);
    }
    pidx = idx;
    for (int i = 1; i <= idx; ++i) {
        for (int j = 0; j < 26; ++j)
            if (tree[i].child[j]) {
                int k = tree[i].child[j];
                adj[i].emplace_back(k);
                adj[k].emplace_back(i);
            }
        if (tree[i].cnt) {
            int key = ++idx;
            vis[key] = tree[i].cnt;
            adj[i].emplace_back(key);
            adj[key].emplace_back(i);
        }
    }
    memset(f, -0x3f, sizeof f);
    memset(g, -0x3f, sizeof g);
    dfs(1, 0);
    dfs2(1, 0);
    cout << f[1][m] << '\n';
    return 0;
}
```

### F3

考虑到 Trie 树中结点的数量是 $O(n\times |s_i|)$ 级别的，而在 F3 中 $n$ 可以取到 $2000$，$|s_i|$ 可以取到 $500$，乘起来是 $10^6$ 个结点。而 dp 的时候又需要枚举到 $m$ 个选中的串，时间复杂度为 $O(nm|s_i|)$ 过不去。考虑优化。可以发现 Trie 树中大部分结点都不是串的结尾，而且只有一个儿子结点合并信息。显然每一次计算它的信息很浪费，因此考虑用虚树的思想，建立一个新的树，在这个新树中将每一条链合并为一条边，此时需要对每一条边记录边权表示这条边其实是由多少条边合并而成的。此时结点的数目大大减少，只需要对点、边的编号离散化减少 dp 的信息量即可。

需要计算信息的上界并卡一下空间。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
bool beginmem;
const int N = 2004, M = N * 502;
using ull = unsigned long long;
int a[N];
int n, m;
struct Node {
    signed child[27], cnt;
    Node() {
        memset(child, 0, sizeof child);
        cnt = 0;
    }
} tree[M];
int idx = 1;
void ins(string s) {
    int p = 1;
    for (auto &i : s) {
        int j = i - 'a';
        if (!tree[p].child[j]) tree[p].child[j] = ++idx;
        p = tree[p].child[j];
    }
    ++tree[p].cnt;
}
vector<pair<int, int>> adj[N * 5];
signed f[16190][2010], g[2010];
signed siz[M], vis[M];
// f[i][j]: i 子树内选择 j 个结点，贡献最大是多少
void dfs(int u, int fa) {
    siz[u] = vis[u];
    for (auto &[v, w] : adj[u])
        if (v != fa) dfs(v, u), siz[u] += siz[v];
}
int pidx;
void dfs2(int u, int fa) {
    int now = vis[u], son = 0;
    for (int j = 0; j <= vis[u]; ++j) f[u][j] = 0;
    for (auto &[v, w] : adj[u])
        if (v != fa) {
            ++son;
            dfs2(v, u);
            now += siz[v];
            for (int bk = 0; bk <= min(m, now - siz[v]); ++bk) {
                for (int nw = 1; nw <= min(m, (int)siz[v]) && bk + nw <= m; ++nw) {
                    int val = nw * (nw - 1) / 2 * w + f[v][nw];
                    if (v <= pidx)
                        g[bk + nw] = max({g[bk + nw], f[u][bk + nw], f[u][bk] + (signed)val});
                    else
                        g[bk + nw] = max({g[bk + nw], f[u][bk + nw], f[u][bk]});
                }
            }
            for (int i = 0; i <= m; ++i) f[u][i] = max(f[u][i], g[i]);
            for (int i = 0; i <= m; ++i) g[i] = -1e18;
        }
}
signed to[M + N * 5];
void dfs3(int u, int len, int last) {
    int ch_cnt = 0;
    for (int i = 0; i < 26; ++i)
        if (tree[u].child[i]) ++ch_cnt;
    if (ch_cnt > 1 || u == 1 || tree[u].child[26] || tree[u].cnt) {
        if (u != last) adj[to[last]].emplace_back(to[u], len - 1);
        for (int i = 0; i < 26; ++i)
            if (tree[u].child[i]) {
                adj[to[u]].emplace_back(to[tree[u].child[i]], 1);
                dfs3(tree[u].child[i], 1, tree[u].child[i]);
            }
    } else if (ch_cnt == 1) {
        for (int i = 0; i < 26; ++i)
            if (tree[u].child[i])
                dfs3(tree[u].child[i], len + 1, last);
    } else {
        if (u != last) adj[to[last]].emplace_back(to[u], len - 1);
    }
}
vector<signed> useful;
void dfs4(int u, int len, int last) {
    int ch_cnt = 0;
    for (int i = 0; i < 26; ++i)
        if (tree[u].child[i]) ++ch_cnt;
    if (ch_cnt > 1 || u == 1 || tree[u].cnt) {
        if (u != last) {
            if (last) useful.emplace_back(last);
            useful.emplace_back(u);
        }
        for (int i = 0; i < 26; ++i)
            if (tree[u].child[i]) {
                useful.emplace_back(u);
                useful.emplace_back(tree[u].child[i]);
                dfs4(tree[u].child[i], 1, tree[u].child[i]);
            }
    } else if (ch_cnt == 1) {
        for (int i = 0; i < 26; ++i)
            if (tree[u].child[i])
                dfs4(tree[u].child[i], len + 1, last);
    } else {
        if (u != last) {
            if (last) useful.emplace_back(last);
            useful.emplace_back(u);
        }
    }
}
bool endmem;
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) {
        string s;
        cin >> s;
        ins(s);
    }
    dfs4(1, 1, 0);
    for (int i = 1; i <= idx; ++i)
        if (tree[i].cnt) useful.emplace_back(i);
    sort(useful.begin(), useful.end());
    useful.erase(unique(useful.begin(), useful.end()), useful.end());
    int index = 0;
    for (signed &i : useful) to[i] = ++index;
    pidx = index;
    for (int i = 1; i <= idx; ++i) {
        if (tree[i].cnt) {
            int key = ++index;
            vis[key] = tree[i].cnt;
            adj[to[i]].emplace_back(key, 1ll);
            assert(key);
            tree[i].child[26] = 1;
        }
    }
    dfs3(1, 1, 0);
    memset(f, -0x3f, sizeof f);
    memset(g, -0x3f, sizeof g);
    dfs(1, 0);
    dfs2(1, 0);
    cout << f[1][m] << '\n';
    cerr << "Memory used " << (&beginmem - &endmem) / 1048576. << '\n';
    return 0;
}
```

---
title: "AT_agc017_e [AGC017E] Jigsaw 题解"
date: "2025-07-12T11:25:34.000Z"
link: "luogu-jb8vixuz"
categories: ["题解"]
tags: ["AtCoder", "算法思想", "构造", "基础算法", "贪心", "动态规划"]
draft: false
---

这题真的有黑吗？？？？？？？？？？？？？

贪心或者 dp 都是困难的，因此考虑一些奇奇怪怪的建图。考虑到一个拼图的作用其实是连接左右两个拼图，然后发现中间部分的作用是连接左侧和右侧两个部分，因此左侧和右侧也可以单独考虑，也就是说让一个拼图的右侧和另一个拼图的左侧匹配即可，这样拼图就只用分为靠下和不靠下两类。然后发现两个靠下的拼图可以拼接但是会导致左右两侧的子问题独立，因此可以认为这两个不能拼接，然后问题变为分为若干组重排然后每组的拼图可以依次拼接且每一组第一个是左侧靠下的最后一个是右侧靠下的拼图问是否可行。

经典套路边点互换，把拼图看做是连接左右拼图的边，而左右拼图的连接处则被看做点。每一个拼图的左右两侧分靠不靠下两类建两类点，若其靠下则因为另一个也靠下的情况被讨论掉了，所以另外一个拼图必须是靠上的，而若其靠上则另一个拼图必须靠下。因此对于每一个拼图只有唯一的底长可以和她匹配。具体来说：

+ 对于左侧靠下拼图 $i$，给其赋编号为 $a_i$（另一个拼图必须靠上且和她能匹配）
+ 对于左侧不靠下拼图 $i$，给其赋编号为 $c_i+H$（另一个拼图的下面必须能插到左侧拼图 $i$ 内才能匹配）
+ 对于右侧靠下拼图 $i$，给其赋编号 $b_i+H$
+ 对于右侧不靠下拼图 $i$，给其赋编号为 $b_i$

可以发现上面的赋编号方法，恰好可以使得编号相同的拼图是可以匹配的，且编号不相同的拼图一定不能匹配。因此问题变为在这张图上找若干条路径使得路径上第一个点编号 $\le H$ 最后一个点编号 $>H$ 且能不重不漏的覆盖所有的边。连通块之间互不影响所以下面只讨论一个连通块的情况。可以观察到若某一个连通块内有边且每一个点的入度和出度均相等，那么经典结论图中只存在回路不存在路径。继续瞪眼观察可以发现若一个点的编号 $i\le H$ 且在新图中入度还大于出度，那么因为这个点不能作为路径的结尾位置但是可以作为开头位置所以从这个点出去的路径数一定不少于到这个点结束的路径数，所以这样无法构造出合法解。同理若一个点编号 $i>H$ 且在新图中出度大于入度那么也无解。容易证明其余情况均存在合法构造。

简要总结一下：对于新图中每一个连通块，若其同时不满足下面三条，则该连通块上的边可以被若干条路径不重不漏的覆盖：

+ 连通块中有边且连通块内所有点的入度均等于出度
+ 存在点 $i\le H$ 使得其出度大于入度
+ 存在点 $i>H$ 使得其入度大于出度

维护连通块是简单的，dfs 或者并查集均可做。因此总时间复杂度为 $O(n+H)$ 即 $O(n)$ 可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;

const int N = 200010;
const int inf = 1e18;
const int mod = 998244353;

int a[N], b[N], c[N], d[N];
vector<int> adj[N], pnt[N];
int ideg[N], odeg[N];

struct DSU
{
    int fa[N];
    inline void init(int maxn) { iota(fa + 1, fa + maxn + 1, 1); }
    inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
    inline void merge(int x, int y) { x = find(x), y = find(y); if (x != y) fa[x] = y; }
} dsu;

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i)
        cin >> a[i] >> b[i] >> c[i] >> d[i];
    dsu.init(m + m);
    for (int i = 1; i <= n; ++i)
    {
        if (c[i] && d[i])
        {
            adj[c[i] + m].emplace_back(d[i]);
            ++ideg[d[i]], ++odeg[c[i] + m];
            dsu.merge(c[i] + m, d[i]);
        }
        else if (c[i] && !d[i])
        {
            adj[c[i] + m].emplace_back(b[i] + m);
            ++ideg[b[i] + m], ++odeg[c[i] + m];
            dsu.merge(c[i] + m, b[i] + m);
        }
        else if (!c[i] && d[i])
        {
            adj[a[i]].emplace_back(d[i]);
            ++ideg[d[i]], ++odeg[a[i]];
            dsu.merge(a[i], d[i]);
        }
        else
        {
            adj[a[i]].emplace_back(b[i] + m);
            ++ideg[b[i] + m], ++odeg[a[i]];
            dsu.merge(a[i], b[i] + m);
        }
    }
    for (int i = 1; i <= m + m; ++i)
        pnt[dsu.find(i)].emplace_back(i);
    for (int i = 1; i <= m + m; ++i)
        if (i <= m && ideg[i] > odeg[i])
        {
            cout << "NO\n";
            return 0;
        }
        else if (i > m && ideg[i] < odeg[i])
        {
            cout << "NO\n";
            return 0;
        }
    for (int i = 1; i <= m + m; ++i)
        if (dsu.fa[i] == i)
        {
            int ok = 0;
            for (int &j : pnt[i])
                if (ideg[j] != odeg[j] || !ideg[j])
                {
                    ok = 1;
                    break;
                }
            if (!ok)
            {
                cout << "NO\n";
                return 0;
            }
        }
    cout << "YES\n";
    return 0;
}
```

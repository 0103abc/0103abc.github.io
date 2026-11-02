---
title: "P15419 「yrOI R1」冬日永恒 题解"
date: "2026-06-03T06:27:12.000Z"
link: "luogu-19461ioj"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造", "图论", "树", "搜索", "广度优先搜索"]
draft: false
---

写在前面：这个题出题人题解写的怎么这么简略还不给 std，是不是根本就不想让人写这个题（）

## 1. $k=2$

题目中给出的操作实在是太太太太太太奇怪了，考虑先构造一些看上去更简单的操作：

**操作 $1$**：选择两个点 $a,b$ 满足 $a,b$ 间有一条路径相连，然后对 $a,b$ 两个点做一次操作，则此时会形成形如 $a\rightsquigarrow b\to n'\to a$ 的环，直接删除整个环即可。**因此该操作可以看作是选择两个点并删除连接这两个点的简单路径上所有边。**

**操作 $2$**：选择两个点 $a,b$ 满足 $a,b$ 两个点属于不同的连通块。则此时会添加一个新点 $n'$ 和两条双向边 $a\leftrightarrow n',b\leftrightarrow n'$。**因此该操作可以看作是连接了 $a,b$ 两个点所属的连通块。**

考虑先处理 $S$ 是菊花的 Corner Case：注意到若树 $S$ 是一个菊花图，则 $k=2$ 时 $S$ 无法变成任何菊花图以外的结构。证明显然。因此若 $T$ 不是菊花图，则一定无解。而又因为此时 $S$ 内结点的数量不能变大，因此 $S$ 可以通过操作得到 $T$ 当且仅当 $S$ 可以通过删除多余的叶子得到 $T$，直接构造即可做到线性时间复杂度。

然后再处理 $n_2=2$ 的 Corner Case：这个是简单的，直接一直删除树的叶子，直到树上只有两个结点即可。

最后处理剩下的情况：先从 $S$ 中找出一条长度为 $3$ 的链作为初始结构，这个结构和 $T$ 中另一条长度为 $3$ 的链在最终的构造中一一对应，然后按 $T$ 树的 BFS 序来逐个补点。假设当前要加入的点是 $x$，其父亲结点为 $fa_x$，在当前树上 $fa_x$ 对应的结点为 $p$，则随便找一个没有对应到 $T$ 树中的点 $q$，其父亲结点为 $fa_q$。则此时如果选择 $p,q$ 然后加入点 $n'$，则会得到新边 $p\leftrightarrow n',n'\leftrightarrow q$。然后删掉路径 $n'\leftrightarrow q\leftrightarrow fa_q$ 的一部分把 $q$ 点从这一通里面移出去，就可以完成让新点 $n'$ 保留下来成为 $p$ 的儿子结点。

## 2. $k=3$

此时仍然需要进一步分类讨论：

### 2.1 $n_1\ge n_2$

大体思路是先把 $S$ 压缩到只有 $n_2$ 个点，然后调整 $S$ 的结构，让 $S$ 和 $T$ 同构即可。

具体的，考虑先构造下面两个操作：

**操作 $1$**：如果有两个叶子 $a,b$ 的父亲结点均为同一个结点 $c$，则选择 $a,b,c$ 三个点执行一次操作，此时会加入新点 $n'$。这样一来会得到一个新环 $a\leftrightarrow c\leftrightarrow b\leftrightarrow n'\leftrightarrow a$。此时再删除边 $a\leftrightarrow c,b\leftrightarrow c,a\leftrightarrow n',b\leftrightarrow n'$ 即可。更具体的说，这个操作可以删掉原有的两个叶子结点 $a,b$，然后把新的儿子结点 $n'$ 接到 $c$ 点的儿子中。

**操作 $2$**：如果存在一个度数为 $2$ 的结点 $b$，使得其连向的两个结点分别为 $a,r$，且 $a$ 为叶子结点，则此时可以找一个额外点 $c$，选择点 $a,r,c$ 执行一次操作，此时会加入新点 $n'$。这样一来会得到一个新环 $a\leftrightarrow b\leftrightarrow r\leftrightarrow n'\leftrightarrow a$。此时再删除边 $a\leftrightarrow b,r\leftrightarrow b,r\leftrightarrow n',a\leftrightarrow n'$ 即可。更具体的说，若存在这样的一个点 $b$，则找到 $a,r$ 两个结点后，可以删除 $a,b$ 两个结点，然后把新的儿子结点 $n'$ 接到 $c$ 点的儿子中。

注意到上述两个操作都是每执行一次就可以让 $S$ 中少一个结点，因此执行 $|S|-|T|$ 次操作后即可让 $S,T$ 内包含结点数相等。

这里再给出另一个操作：

**操作 $3$**：现在 $b$ 点有一个子结点 $a$ 是叶子结点，希望把 $a$ 结点从 $b$ 的儿子集合中移动到另一个点 $c$ 的儿子集合中。则只需要选择三个点 $a,b,c$ 并执行一次操作，加入新点 $n'$，然后删除环 $a\leftrightarrow b\leftrightarrow n'\leftrightarrow a$ 上的所有边，最终剩下了 $n'\leftrightarrow c$ 这一条边。此时 $a$ 结点被删除，平移到 $n'$ 的位置，成为 $c$ 的子结点。

然后考虑这样的一个构造流程：

+ 任意选当前树上任意一个点作为 $T$ 个根结点。
+ 按照 $T$ 的 BFS 序来处理每个点。
+ 每次从当前树上找到一个没有对应上最终得到树的点。如果当前这个点已经连在了对应的目标父亲结点上，则直接连上去即可，否则用 **操作 $3$** 把这个叶子结点移动到目标父亲的儿子集合中即可。

容易发现上述构造流程确实可以很好的适配上面的构造过程。

### 2.2 $n_1<n_2$

特判掉 $n_1\le 4$ 的 corner case。后面的构造将只考虑 $5\le n_1<n_2$ 的情况。

考虑倒着操作，先从目标树 $T$ 上删叶子，最终保留一个大小为 $n_1-3$ 的树 $T'$。然后把当前的树 $S$ 结构修改为 $S'$，$S'$ 中存在一个大小为 $n_1-3$ 的导出子图和 $T'$ 树通过，剩余的三个点 $a,b,c$ 满足 $a$ 结点为叶子结点，存在 $a\leftrightarrow b,b\leftrightarrow c$ 两条边，且 $c$ 点除了 $b$ 点以外也只存在一个点 $d$ 和 $c$ 有边相连。点 $d$ 则在这个大小为 $n_1-3$ 的导出子图上。

此时再给出三个操作以处理 $S'\to T'$ 的构造：

**操作 $4$**：假设当前要在目标父亲结点 $p$ 下面加一个儿子结点，则考虑找两个不在结构上的点 $t_1,t_2$，然后对 $p,t_1,t_2$ 三个点执行一次操作，容易发现此时无需执行删环操作。这样新得到的 $n'$ 结点就变成了 $p$ 结点。

**操作 $5$**：注意到之前操作 $4$ 会让本应成为叶子结点的 $n'$ 多出两个叶子结点 $t_1,t_2$ 作为其儿子结点，并再造一个儿子结点。记上一次要删掉的点 $t_1,t_2$ 所连的应成为叶子结点的点编号为 $r$，现在要在新的目标父亲 $q$ 的儿子中加一个叶子。此时再次选择 $q,t_1,t_2$ 三个点执行一次操作，则此时会得到一个环 $t_1\leftrightarrow r\leftrightarrow t_2\leftrightarrow n'\leftrightarrow t_1$，删除这个环后 $r$ 点连向 $t_1,t_2$ 点的边就被删除了，而 $q$ 点也多出了新的儿子结点 $n'$。

**操作 $6$**：对于两个需要新添加儿子结点的点 $p,q$，按顺序对 $p,q$ 执行操作 $4$ 和操作 $5$ 即可。

把上面弄出来的长度为 $3$ 的链当 $t_1,t_2$ 结点用，得到树 $T'$ 后再操作一次消除这两个结点即可。

## 3. $k=4$

先特判掉 $S,T$ 两个树本身已经同构的情况。

然后因为该情况的 corner case 太多了，所以 $n\le 5$ 需要特判，这个地方手动判掉所有情况或者写个 DFS 都是可以的。

类似 $k=2$，还需要特判掉 $S$ 本身是一个菊花的情况。具体的：

同样可以发现 $S$ 如果是菊花图，则其无论怎么操作都只能得到菊花图，且结点数量也无法增加。因此 $T$ 不为菊花图或 $n_1<n_2$ 则一定无解。

考虑若要将 $n_1$ 个点的菊花变成 $n_2$ 个点的菊花需要删除 $n_1-n_2$ 个叶子结点。同样考虑构造出删叶子点的操作：

**操作 $1$**：选择结点 $c$ 和其的三个儿子结点 $a,b,d$，满足 $a,b,d$ 三个点都是叶子结点。则此时选择 $c,a,b,d$ 四个点，得到新的结点 $n'$，然后删除得到的两个环 $a\leftrightarrow c\leftrightarrow b\leftrightarrow n'\leftrightarrow a$ 和 $c\leftrightarrow d\leftrightarrow n'\leftrightarrow c$ 即可。此时 $a,b,d$ 三个点和 $c$ 点之间连的边被删除，也就是删除了菊花的三个叶子结点。

**操作 $2$**：选择四个叶子结点 $a,b,d,e$，则此时选择这四个点可以得到新的结点 $n'$，然后删除得到的两个环 $a\leftrightarrow c\leftrightarrow b\leftrightarrow n'\leftrightarrow a$ 和 $d\leftrightarrow c\leftrightarrow e\leftrightarrow n'\leftrightarrow d$ 即可删除四个叶子结点 $a,b,d,e$ 和其父结点 $c$ 之间的连边，也就是删除了菊花的四个叶子结点。

也就是说，操作可以删除 $k$ 个结点当且仅当不定方程 $3x+4y=k$ 存在非负整数解 $(x,y)$，简单计算可知当且仅当 $k\ge 6$ 或 $k\in\lbrace 0,3,4\rbrace$ 时存在这样的解 $(x,y)$，此时直接按照上面给出的两个操作删叶子即可，否则必然无解。

然后考虑更一般的情况即 $S$ 不是菊花的情况。此时考虑在 $S$ 上找到一条四点链 $a\leftrightarrow b\leftrightarrow x\leftrightarrow r$ 满足下面两个条件之一：

+ $a,b,x,r$ 是树的某条直径上连续四个点。
+ $a,b$，$b,x$，$x,r$ 间均有边直接相连，且 $a,r$ 两个点都为树的叶子结点。

此时删除树 $S$ 上 $a,b,x,r$ 以外的所有点和边，考虑从这四个点开始扩展出树 $T$。具体的，先考虑怎么删除 $S$ 中除了这个四点链以外的所有点和边。

考虑这样一个经典结论：

+ 对于任意一个森林，其边都可以分解成若干条简单路径，使得每条边在所有路径中均恰好出现一次，且路径的端点度数均为奇数。

构造这样的路径集合是简单的，直接对森林做 DFS 即可。

考虑找出了这些路径后怎么删除。这里再给出一个新的操作：

**操作 $3$**：考虑两条端点互不相同的路径 $P,Q$，则考虑选择 $P,Q$ 两个路径上的四个端点做一次操作，则两条路径首尾相连形成了一个 $8$ 字环的结构，直接删除所有的环即可清空 $P,Q$ 两条链和执行操作时生成的新点 $n'$。

如果 DFS 处理出来得到了偶数条路径，则直接两两配对（需要满足配对的路径中四个端点互不相同）然后执行操作 $3$ 即可。否则把最后一条链和最终要保留的四点链合并处理得到一个新的四点链，剩下偶数条链再做两两配对即可。

问题变为如何从一个四点链生成出目标树 $T$。这里先特殊处理一下第一次加点，选择四个点 $a,b,x,r$ 执行一次操作，则会得到一个新点 $n'$ 并删除环 $b\leftrightarrow x\leftrightarrow n'\leftrightarrow b$，最终保留长度为 $3$ 的链 $n'\leftrightarrow r'\leftrightarrow x$。

在这之后考虑始终维护一条链 $r\leftrightarrow x\leftrightarrow y$ 满足 $y$ 是叶子结点，$x$ 点的度数为 $2$，则若要在目标父亲结点 $p$ 的儿子中新增一个叶子结点 $n'$，则选择结点 $p,r,x,y$ 加入新结点 $n'$ 然后删除环 $r\leftrightarrow x\leftrightarrow n'\leftrightarrow r$，则此时会保留 $p\leftrightarrow n'\leftrightarrow y$ 的链，此时 $p$ 获得了新的儿子结点 $n'$，且此时仍然保留了一个长度为 $3$ 的链，可以继续支持更新。

上述构造全部执行完之后还会剩下一个长度为 $3$ 的尾巴链和若干杂七杂八没用的边，这个因为不需要继续维护后续结构了，所以随便写个算法删掉即可。

细节十分多，建议在程序最后写一个 check 判断一下执行完操作后 $S,T$ 两个树是否真的同构了。然后这个题除了上面讨论的大的 corner case 以外还有各种小的 corner case，每个 case 都需要写很恶心的处理，~~所以代码有一半是 ChatGPT 帮我写的，毕竟也没人想写（而且我自己也写不出来）这么大份的代码。~~

Fun fact：代码需要压行才能提交，最初我把 $k=2,k=3,k=4$ 三种情况分别写成三个 namespace 用三个程序提交后三分代码的代码长度总和接近 100K（这还是我在写的过程中就做了少量压行后得到的结果，感觉如果完全按我自己的代码风格然后调试信息不删除只注释的话最终版代码可以轻松突破 100K）

Fun fact 2：将代码复制到文章中后继续编辑内容，内存 32G 的电脑出现了明显的卡顿现象（）

我找不回原来没压行的代码了，所以只能放一个 vscode 格式化最终提交代码的版本了/kel

:::success[代码]
```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
// #define int long long
using namespace std;
bool beginmem;
constexpr int N = 600010;
constexpr int mod = 998244353;
// constexpr int inf = 1e18;
using ld = long double;
using ull = unsigned long long;
using i128 = __int128;

inline int power(int a, int b, int c)
{
    if (b < 0)
        return 0;
    int ans = 1;
    while (b)
    {
        if (b & 1)
            ans = ans * a % c;
        a = a * a % c, b >>= 1;
    }
    return ans;
}

inline int inversion(int x, int Mod = mod) { return power(x, Mod - 2, Mod); }

inline void init()
{
}

namespace K_4
{

    struct Info
    {
        vector<int> up, ord, type;
        vector<vector<int>> child;
    };

    struct Solver_large
    {
        int n1, n2, N, lim, ok = 1;
        vector<vector<int>> S, T;
        vector<set<int>> g;
        vector<char> alive;
        set<int> ase, free;
        vector<int> mp;
        struct Op
        {
            int s[4], z;
            vector<vector<int>> cyc;
        };
        vector<Op> ops;
        int A = 0, B = 0, R = 0, X = 0, Y = 0;
        inline Solver_large(int _n1, int _n2, const vector<vector<int>> &_S, const vector<vector<int>> &_T) : n1(_n1), n2(_n2), S(_S), T(_T)
        {
            N = max(n1, n2);
            lim = N + 5;
            g.assign(lim + 1, {});
            alive.assign(lim + 1, 0);
            mp.assign(n2 + 1, 0);
        }

        inline void reset()
        {
            g.assign(lim + 1, {});
            alive.assign(lim + 1, 0);
            ase.clear(), free.clear(), ops.clear();
            fill(mp.begin(), mp.end(), 0);
            ok = 1, A = B = R = X = Y = 0;
        }

        inline int getid()
        {
            if (free.empty())
                ok = 0;
            return ok ? *free.begin() : 0;
        }

        inline int newid()
        {
            if (free.empty())
                return ok = 0;
            int z = *free.begin();
            free.erase(free.begin());
            alive[z] = 1, g[z].clear(), ase.emplace(z);
            return z;
        }

        inline void adde(int u, int v) { g[u].emplace(v), g[v].emplace(u); }

        inline void dele(int u, int v)
        {
            if (!g[u].count(v))
            {
                ok = 0;
                return;
            }
            g[u].erase(v), g[v].erase(u);
        }

        inline void eraseiso(int x)
        {
            if (!alive[x] || g[x].size())
                return;
            alive[x] = 0, ase.erase(x), free.emplace(x);
        }

        inline void initg()
        {
            for (int i = 1; i <= n1; ++i)
                alive[i] = 1, ase.emplace(i);
            for (int i = n1 + 1; i <= lim; ++i)
                free.emplace(i);
            for (int u = 1; u <= n1; ++u)
                for (int v : S[u])
                    if (u < v)
                        adde(u, v);
        }

        inline int is_star(const vector<vector<int>> &G, int n)
        {
            if (n < 3)
                return 1;
            int mx = 0;
            for (int i = 1; i <= n; ++i)
                mx = max<int>(mx, G[i].size());
            return mx == n - 1;
        }
        inline int starcen(const vector<vector<int>> &G, int n)
        {
            int c = 1;
            for (int i = 1; i <= n; ++i)
                if (G[i].size() > G[c].size())
                    c = i;
            return c;
        }

        inline int stareduce(int d)
        {
            if (d == 0)
                return 1;
            if (d < 3)
                return 0;
            if (d == 5)
                return 0;
            return 1;
        }

        inline int eok(const vector<int> &p, const vector<int> &q)
        {
            if (p.size() < 2 || q.size() < 2)
                return 0;
            set<int> s = {p.front(), p.back(), q.front(), q.back()};
            return s.size() == 4;
        }

        inline void cutstar3(int c, int a, int b, int d)
        {
            int z = getid();
            if (!ok)
                return;
            Op op;
            op.s[0] = c, op.s[1] = a, op.s[2] = b, op.s[3] = d, op.z = z;
            op.cyc.push_back({a, c, b, z}), op.cyc.push_back({c, d, z});
            ops.emplace_back(op);
            dele(c, a), dele(c, b), dele(c, d);
            eraseiso(a), eraseiso(b), eraseiso(d);
        }

        inline void cutstar4(int c, int a, int b, int d, int e)
        {
            int z = getid();
            if (!ok)
                return;
            Op op;
            op.s[0] = a, op.s[1] = b, op.s[2] = d, op.s[3] = e, op.z = z;
            op.cyc.push_back({a, c, b, z}), op.cyc.push_back({d, c, e, z});
            ops.emplace_back(op);
            dele(c, a), dele(c, b), dele(c, d), dele(c, e);
            eraseiso(a), eraseiso(b), eraseiso(d), eraseiso(e);
        }

        inline int solvestar()
        {
            if (!is_star(S, n1))
                return 0;
            if (!is_star(T, n2))
                return 0;
            int d = n1 - n2;
            if (!stareduce(d))
                return 0;
            initg();
            int cs = starcen(S, n1), ct = starcen(T, n2);
            vector<int> leaves;
            for (int i = 1; i <= n1; ++i)
                if (i != cs)
                    leaves.emplace_back(i);
            int p = 0;
            while (d > 0)
            {
                if (d % 4 == 0)
                {
                    cutstar4(cs, leaves[p], leaves[p + 1], leaves[p + 2], leaves[p + 3]);
                    p += 4, d -= 4;
                }
                else
                {
                    cutstar3(cs, leaves[p], leaves[p + 1], leaves[p + 2]);
                    p += 3, d -= 3;
                }
                if (!ok)
                    return 0;
            }
            mp[ct] = cs;
            vector<int> rest;
            for (int x : leaves)
                if (alive[x])
                    rest.emplace_back(x);
            int pos = 0;
            for (int i = 1; i <= n2; ++i)
            {
                if (i == ct)
                    continue;
                if (pos >= rest.size())
                    return 0;
                mp[i] = rest[pos++];
            }
            return finalchk();
        }

        inline vector<int> diampath(const vector<vector<int>> &G, int n)
        {
            vector<int> up(n + 1), dep(n + 1);
            auto bfs = [&](int stk)
            {
                fill(up.begin(), up.end(), 0);
                fill(dep.begin(), dep.end(), -1);
                queue<int> q;
                q.emplace(stk);
                dep[stk] = 0, up[stk] = -1;
                int far = stk;
                while (q.size())
                {
                    int u = q.front();
                    q.pop();
                    if (dep[u] > dep[far])
                        far = u;
                    for (int v : G[u])
                        if (!~dep[v])
                            dep[v] = dep[u] + 1, up[v] = u, q.emplace(v);
                }
                return far;
            };
            int a = bfs(1), b = bfs(a);
            vector<int> path;
            for (int x = b; ~x; x = up[x])
                path.emplace_back(x);
            reverse(path.begin(), path.end());
            return path;
        }

        inline vector<int> treecen(const vector<vector<int>> &G, int n)
        {
            vector<int> deg(n + 1);
            queue<int> q;
            for (int i = 1; i <= n; ++i)
            {
                deg[i] = G[i].size();
                if (deg[i] < 2)
                    q.emplace(i);
            }
            int rem = n;
            while (rem > 2)
            {
                int sz = q.size();
                rem -= sz;
                while (sz--)
                {
                    int u = q.front();
                    q.pop();
                    for (const int v : G[u])
                        if (--deg[v] == 1)
                            q.emplace(v);
                }
            }
            vector<int> c;
            while (q.size())
                c.emplace_back(q.front()), q.pop();
            return c;
        }

        inline Info rotyp(const vector<vector<int>> &G, int n, int root, map<vector<int>, int> &id)
        {
            Info info;
            info.up.assign(n + 1, 0);
            info.type.assign(n + 1, 0);
            info.child.assign(n + 1, {});
            queue<int> q;
            q.emplace(root), info.up[root] = -1;
            while (q.size())
            {
                int u = q.front();
                q.pop();
                info.ord.emplace_back(u);
                for (const int v : G[u])
                    if (v != info.up[u])
                        info.up[v] = u, info.child[u].emplace_back(v), q.emplace(v);
            }
            for (int i = n - 1; ~i; --i)
            {
                int u = info.ord[i];
                vector<int> vec;
                for (int v : info.child[u])
                    vec.emplace_back(info.type[v]);
                sort(vec.begin(), vec.end());
                auto it = id.find(vec);
                if (it == id.end())
                {
                    int nid = id.size() + 1;
                    id[vec] = nid, info.type[u] = nid;
                }
                else
                    info.type[u] = it->second;
            }
            return info;
        }

        inline int buildisom(int sRoot, int tRoot, vector<int> &ans)
        {
            map<vector<int>, int> id;
            Info Ainfo = rotyp(S, n1, sRoot, id);
            Info Binfo = rotyp(T, n2, tRoot, id);
            if (Ainfo.type[sRoot] != Binfo.type[tRoot])
                return 0;
            ans.assign(n2 + 1, 0);
            queue<pair<int, int>> q;
            q.emplace(tRoot, sRoot);
            ans[tRoot] = sRoot;
            while (q.size())
            {
                auto [tu, su] = q.front();
                q.pop();
                unordered_map<int, vector<int>> buc;
                for (int &sv : Ainfo.child[su])
                    buc[Ainfo.type[sv]].emplace_back(sv);
                for (int &tv : Binfo.child[tu])
                {
                    int tp = Binfo.type[tv];
                    if (buc[tp].empty())
                        return 0;
                    int sv = buc[tp].back();
                    buc[tp].pop_back(), ans[tv] = sv, q.emplace(tv, sv);
                }
            }
            return 1;
        }

        inline int solve0iso()
        {
            if (n1 != n2)
                return 0;
            auto cs = treecen(S, n1), ct = treecen(T, n2);
            for (int tr : ct)
                for (int sr : cs)
                {
                    vector<int> cand;
                    if (buildisom(sr, tr, cand))
                        return mp = cand, 1;
                }
            return 0;
        }

        inline vector<int> mergepath(vector<int> p, vector<int> q)
        {
            vector<int> res = move(p);
            for (int i = q.size() - 2; ~i; --i)
                res.emplace_back(q[i]);
            return res;
        }

        inline void decforest(const vector<vector<int>> &D, vector<vector<int>> &paths)
        {
            int n = n1;
            vector<int> deg(n + 1), up(n + 1), seen(n + 1, 0);
            vector<vector<int>> pending(n + 1);
            for (int i = 1; i <= n; ++i)
                deg[i] = D[i].size();
            auto combine = [&](vector<int> a, vector<int> b)
            {
                if (a.size() == 1)
                    return b;
                if (b.size() == 1)
                    return a;
                vector<int> res = move(a);
                for (int i = b.size() - 2; ~i; --i)
                    res.emplace_back(b[i]);
                return res;
            };

            for (int i = 1; i <= n; ++i)
            {
                if (seen[i] || D[i].empty())
                    continue;
                vector<int> ord;
                stack<int> stk;
                stk.emplace(i), seen[i] = 1, up[i] = -1;
                while (!stk.empty())
                {
                    int u = stk.top();
                    stk.pop(), ord.emplace_back(u);
                    for (int v : D[u])
                        if (v != up[u] && !seen[v])
                            seen[v] = 1, up[v] = u, stk.emplace(v);
                }
                for (int i = ord.size() - 1; ~i; --i)
                {
                    int u = ord[i];
                    vector<vector<int>> cur;
                    for (int v : D[u])
                        if (up[v] == u && pending[v].size())
                            pending[v].emplace_back(u), cur.emplace_back(move(pending[v]));
                    if (deg[u] & 1)
                        cur.emplace_back(vector<int>{u});
                    while (cur.size() > 1)
                    {
                        auto a = move(cur.back());
                        cur.pop_back();
                        auto b = move(cur.back());
                        cur.pop_back();
                        auto p = combine(move(a), move(b));
                        if (p.size() > 1)
                            paths.emplace_back(move(p));
                    }
                    if (cur.size())
                        pending[u] = move(cur.back());
                }
            }
        }
        inline int parindex(const vector<vector<int>> &paths, int skip, vector<pair<int, int>> &pairs)
        {
            vector<int> ids;
            for (int i = 0; i < paths.size(); ++i)
                if (i != skip)
                    ids.emplace_back(i);
            if (ids.size() & 1)
                return 0;
            vector<int> used(ids.size(), 0);
            for (int ii = 0; ii < ids.size(); ++ii)
            {
                if (used[ii])
                    continue;
                int found = -1;
                for (int jj = ii + 1; jj < ids.size(); ++jj)
                {
                    if (used[jj])
                        continue;
                    if (eok(paths[ids[ii]], paths[ids[jj]]))
                    {
                        found = jj;
                        break;
                    }
                }
                if (!~found)
                    return 0;
                used[ii] = used[found] = 1;
                pairs.push_back({ids[ii], ids[found]});
            }
            return 1;
        }

        inline int buildpthchain(const vector<int> &ch, vector<vector<int>> &paths)
        {
            if (ch.size() != 4)
                return 0;
            set<int> chk(ch.begin(), ch.end());
            if (chk.size() != 4)
                return 0;
            auto has_edge_S = [&](int u, int v)
            {
                for (int x : S[u])
                    if (x == v)
                        return 1;
                return 0;
            };
            if (!has_edge_S(ch[0], ch[1]))
                return 0;
            if (!has_edge_S(ch[1], ch[2]))
                return 0;
            if (!has_edge_S(ch[2], ch[3]))
                return 0;
            auto is_keep_edge = [&](int u, int v)
            {
                auto same = [&](int a, int b)
                { return (u == a && v == b) || (u == b && v == a); };
                return same(ch[0], ch[1]) || same(ch[1], ch[2]) || same(ch[2], ch[3]);
            };
            vector<vector<int>> F(n1 + 1);
            for (int u = 1; u <= n1; ++u)
                for (int v : S[u])
                    if (u < v && !is_keep_edge(u, v))
                        F[u].emplace_back(v), F[v].emplace_back(u);
            paths.clear(), decforest(F, paths);
            return 1;
        }

        inline void opdel2path(const vector<int> &p, const vector<int> &q)
        {
            if (!eok(p, q))
            {
                ok = 0;
                return;
            }
            int z = getid();
            if (!ok)
                return;
            Op op;
            op.s[0] = p.front(), op.s[1] = p.back(), op.s[2] = q.front(), op.s[3] = q.back(), op.z = z;
            vector<int> c1 = p, c2 = q;
            c1.emplace_back(z), c2.emplace_back(z);
            op.cyc.emplace_back(c1);
            op.cyc.emplace_back(c2);
            ops.emplace_back(op);
            auto cut = [&](const vector<int> &path)
            {
                for (int i = 0; i + 1 < path.size(); ++i)
                    dele(path[i], path[i + 1]);
                for (int x : path)
                    eraseiso(x);
            };
            cut(p), cut(q);
        }

        inline vector<vector<int>> gencan()
        {
            vector<vector<int>> vec;
            vector<int> P = diampath(S, n1);
            for (int l = 0; l + 3 < P.size(); ++l)
                vec.push_back({P[l], P[l + 1], P[l + 2], P[l + 3]}), vec.push_back({P[l + 3], P[l + 2], P[l + 1], P[l]});
            for (int u = 1; u <= n1; ++u)
                for (int v : S[u])
                {
                    if (u > v)
                        continue;
                    if (S[u].size() < 2 || S[v].size() < 2)
                        continue;
                    vector<int> lu, lv;
                    for (int x : S[u])
                        if (x != v && S[x].size() == 1)
                            lu.emplace_back(x);
                    for (int x : S[v])
                        if (x != u && S[x].size() == 1)
                            lv.emplace_back(x);
                    int cu = min<int>(lu.size(), 4), cv = min<int>(lv.size(), 4);
                    for (int i = 0; i < cu; ++i)
                        for (int j = 0; j < cv; ++j)
                            vec.push_back({lu[i], u, v, lv[j]}), vec.push_back({lv[j], v, u, lu[i]});
                }
            return vec;
        }

        inline int abrpath(const vector<int> &ch, const vector<int> &path, int useLeft, vector<int> &out)
        {
            int a = ch[0], b = ch[1], c = ch[2], d = ch[3], z1 = newid();
            if (!ok)
                return 0;
            do
            {
                Op op;
                op.s[0] = a;
                op.s[1] = b, op.s[2] = c, op.s[3] = d, op.z = z1;
                op.cyc.push_back({b, c, z1});
                ops.emplace_back(op);
                dele(b, c), adde(z1, a), adde(z1, d);
            } while (0);
            int u = path.front(), v = path.back(), z2 = getid();
            if (!ok)
                return 0;
            Op op2;
            vector<int> cyc = path;
            cyc.emplace_back(z2);
            if (useLeft)
            {
                set<int> se = {b, a, u, v};
                if (se.size() != 4)
                    return 0;
                op2.s[0] = b, op2.s[1] = a, op2.s[2] = u, op2.s[3] = v, op2.z = z2;
                op2.cyc.push_back({b, a, z2});
                op2.cyc.emplace_back(cyc);
                ops.emplace_back(op2);
                dele(b, a);
                for (int i = 0; i + 1 < path.size(); ++i)
                    dele(path[i], path[i + 1]);
                for (const int x : path)
                    eraseiso(x);
                eraseiso(b);
                out = {a, z1, d, c};
            }
            else
            {
                set<int> se = {d, c, u, v};
                if (se.size() != 4)
                    return 0;
                op2.s[0] = d, op2.s[1] = c, op2.s[2] = u, op2.s[3] = v, op2.z = z2;
                op2.cyc.push_back({d, c, z2});
                op2.cyc.emplace_back(cyc);
                ops.emplace_back(op2);
                dele(d, c);
                for (int i = 0; i + 1 < path.size(); ++i)
                    dele(path[i], path[i + 1]);
                for (const int x : path)
                    eraseiso(x);
                eraseiso(c);
                out = {b, a, z1, d};
            }
            return ok;
        }

        inline int prepchain(const vector<int> &ch)
        {
            vector<vector<int>> paths;
            if (!buildpthchain(ch, paths))
                return 0;
            vector<int> finalChain = ch;
            int rem = -1, useLeft = 1;
            if (paths.size() & 1)
            {
                for (int i = 0; i < paths.size(); ++i)
                {
                    int u = paths[i].front(), v = paths[i].back();
                    int leftOK = (u != ch[0] && u != ch[1] && v != ch[0] && v != ch[1]);
                    int rightOK = (u != ch[2] && u != ch[3] && v != ch[2] && v != ch[3]);
                    vector<pair<int, int>> pairs;
                    if (leftOK && parindex(paths, i, pairs))
                    {
                        rem = i, useLeft = 1;
                        break;
                    }
                    pairs.clear();
                    if (rightOK && parindex(paths, i, pairs))
                    {
                        rem = i, useLeft = 0;
                        break;
                    }
                }
                if (rem == -1)
                    return 0;
            }
            vector<pair<int, int>> pairs;
            if (!parindex(paths, rem, pairs))
                return 0;
            for (auto [i, j] : pairs)
            {
                opdel2path(paths[i], paths[j]);
                if (!ok)
                    return 0;
            }
            if (~rem)
                if (!abrpath(ch, paths[rem], useLeft, finalChain))
                    return 0;
            A = finalChain[0], B = finalChain[1], X = finalChain[2], R = finalChain[3], Y = 0;
            if (!alive[A] || !alive[B] || !alive[X] || !alive[R])
                return 0;
            if (!g[A].count(B))
                return 0;
            if (!g[B].count(X))
                return 0;
            if (!g[X].count(R))
                return 0;
            return 1;
        }

        inline void buildT(int root, vector<int> &up, vector<vector<int>> &child, vector<int> &height)
        {
            up.assign(n2 + 1, 0);
            child.assign(n2 + 1, {});
            height.assign(n2 + 1, 0);
            vector<int> ord;
            queue<int> q;
            q.emplace(root), up[root] = -1;
            while (q.size())
            {
                int u = q.front();
                q.pop(), ord.emplace_back(u);
                for (int v : T[u])
                    if (v != up[u])
                        up[v] = u, child[u].emplace_back(v), q.emplace(v);
            }
            for (int i = n2 - 1; ~i; --i)
            {
                int u = ord[i];
                height[u] = 0;
                for (int v : child[u])
                    height[u] = max(height[u], height[v] + 1);
            }
        }

        struct Cand
        {
            int h, v;
            inline bool operator<(const Cand &r) const { return h < r.h || h == r.h && v < r.v; }
        };
        inline int make(int root, vector<int> &up, vector<vector<int>> &child, vector<int> &ord, int &spec)
        {
            vector<int> height;
            buildT(root, up, child, height);
            priority_queue<Cand> q;
            for (int v : child[root])
                q.emplace(height[v], v);
            int las = 0;
            spec = 0, ord.clear();
            while (q.size())
            {
                vector<Cand> tmp;
                int take = 0;
                while (q.size())
                {
                    auto c = q.top();
                    q.pop();
                    if (up[c.v] != las)
                    {
                        take = c.v;
                        break;
                    }
                    tmp.emplace_back(c);
                }
                for (auto &c : tmp)
                    q.emplace(c);
                if (!take)
                {
                    vector<int> rem;
                    while (q.size())
                        rem.emplace_back(q.top().v), q.pop();
                    if (rem.size() == 1 && up[rem[0]] == las && child[rem[0]].empty())
                        return spec = rem[0], 1;
                    return 0;
                }
                ord.emplace_back(take);
                las = take;
                for (int &s : child[take])
                    q.emplace(height[s], s);
            }

            return 1;
        }

        inline int chbuildord(int &root, vector<int> &up, vector<vector<int>> &child, vector<int> &ord, int &spec)
        {
            vector<int> cen = treecen(T, n2);
            for (int &r : cen)
            {
                vector<vector<int>> ch;
                vector<int> ordd, p;
                int sp = 0;
                if (!make(r, p, ch, ordd, sp))
                    continue;
                root = r, up = move(p), child = move(ch), ord = move(ordd), spec = sp;
                return 1;
            }
            return 0;
        }

        inline int firael(int p)
        {
            if (p != A)
                return ok = 0;
            if (!alive[A] || !alive[B] || !alive[X] || !alive[R])
                return ok = 0;
            if (!g[A].count(B) || !g[B].count(X) || !g[X].count(R))
                return ok = 0;
            int z = newid();
            if (!ok)
                return 0;
            Op op;
            op.s[0] = A, op.s[1] = B, op.s[2] = X, op.s[3] = R, op.z = z;
            op.cyc.push_back({B, X, z});
            ops.emplace_back(op);
            dele(B, X), adde(z, A), adde(z, R);
            R = z, X = op.s[3], Y = op.s[2];
            return z;
        }

        inline int ael(int p)
        {
            set<int> se = {p, R, X, Y};
            if (se.size() != 4)
                return ok = 0;
            if (!alive[p] || !alive[R] || !alive[X] || !alive[Y])
                return ok = 0;
            if (!g[R].count(X) || !g[X].count(Y))
                return ok = 0;
            int z = newid();
            if (!ok)
                return 0;
            Op op;
            op.s[0] = p, op.s[1] = R, op.s[2] = X, op.s[3] = Y, op.z = z;
            op.cyc.push_back({R, X, z});
            ops.emplace_back(op);
            dele(R, X), adde(z, p), adde(z, Y);
            eraseiso(R);
            int oldX = X, oldY = Y;
            R = z, X = oldY, Y = oldX;
            return z;
        }

        inline int finish()
        {
            set<int> se = {A, B, R, Y};
            if (se.size() != 4)
                return 0;
            if (!alive[A] || !alive[B] || !alive[R] || !alive[X] || !alive[Y])
                return 0;
            if (!g[A].count(B))
                return 0;
            if (!g[R].count(X))
                return 0;
            if (!g[X].count(Y))
                return 0;
            int z = getid();
            if (!ok)
                return 0;
            Op op;
            op.s[0] = A, op.s[1] = B, op.s[2] = R, op.s[3] = Y, op.z = z;
            op.cyc.push_back({A, B, z});
            op.cyc.push_back({R, X, Y, z});
            ops.emplace_back(op);
            dele(A, B), dele(R, X), dele(X, Y);
            eraseiso(B), eraseiso(X), eraseiso(Y);
            return ok;
        }

        inline int finishchild1()
        {
            set<int> se = {A, B, X, Y};
            if (se.size() != 4)
                return 0;
            if (!alive[A] || !alive[B] || !alive[R] || !alive[X] || !alive[Y])
                return 0;
            if (!g[A].count(B))
                return 0;
            if (!g[R].count(X))
                return 0;
            if (!g[X].count(Y))
                return 0;
            int z = getid();
            if (!ok)
                return 0;
            Op op;
            op.s[0] = A, op.s[1] = B, op.s[2] = X, op.s[3] = Y, op.z = z;
            op.cyc.push_back({A, B, z});
            op.cyc.push_back({X, Y, z});
            ops.emplace_back(op);
            dele(A, B), dele(X, Y);
            eraseiso(B), eraseiso(Y);
            return ok;
        }

        inline int buildtar()
        {
            int root;
            vector<int> up;
            vector<vector<int>> child;
            vector<int> ord;
            int spec = 0;
            if (!chbuildord(root, up, child, ord, spec))
                return 0;
            if (ord.empty())
                return 0;
            mp[root] = A;
            int first = 1;
            for (int v : ord)
            {
                int p = mp[up[v]];
                if (!p)
                    return 0;
                int z;
                if (first)
                    z = firael(p), first = 0;
                else
                    z = ael(p);
                if (!ok)
                    return 0;
                mp[v] = z;
            }
            if (spec)
            {
                if (mp[up[spec]] != R)
                    return 0;
                mp[spec] = X;
                return finishchild1();
            }
            return finish();
        }
        inline int finalchk()
        {
            if (!ok)
                return 0;
            vector<int> used(lim + 1, 0);
            for (int i = 1; i <= n2; ++i)
            {
                if (!mp[i])
                    return 0;
                if (mp[i] < 1 || mp[i] > lim)
                    return 0;
                if (!alive[mp[i]])
                    return 0;
                if (used[mp[i]])
                    return 0;
                used[mp[i]] = 1;
            }
            int cnt = 0;
            for (int x : ase)
            {
                if (!alive[x])
                    continue;
                ++cnt;
                if (!used[x])
                    return 0;
            }
            if (cnt != n2)
                return 0;
            set<pair<int, int>> need, have;
            for (int u = 1; u <= n2; ++u)
                for (int v : T[u])
                    if (u < v)
                    {
                        int a = mp[u], b = mp[v];
                        if (a > b)
                            swap(a, b);
                        need.emplace(a, b);
                    }
            for (int u : ase)
            {
                if (!alive[u])
                    continue;
                for (int v : g[u])
                    if (u < v)
                        have.emplace(u, v);
            }
            return need == have;
        }

        inline int solveoth()
        {
            auto vec = gencan();
            for (auto ch : vec)
            {
                reset(), initg();
                if (!prepchain(ch))
                    continue;
                if (!buildtar())
                    continue;
                if (finalchk())
                    return 1;
            }
            return 0;
        }

        inline int solve()
        {
            if (solve0iso())
                return 1;
            if (is_star(S, n1))
                return solvestar();
            return solveoth();
        }
    };

    struct SmallK4
    {
        int n1, n2, lim;
        vector<vector<int>> S, T;
        struct Op
        {
            array<int, 4> s;
            int z;
            vector<vector<int>> cyc;
        };
        struct Plan
        {
            vector<Op> ops;
            vector<int> mp;
        };
        vector<Op> ops;
        vector<int> mp;
        inline SmallK4(int _n1, int _n2, vector<vector<int>> _S, vector<vector<int>> _T) : n1(_n1), n2(_n2), S(move(_S)), T(move(_T))
        {
            lim = max(n1, n2) + 5, mp.assign(n2 + 1, 0);
        }

        inline vector<int> pthord(const vector<vector<int>> &G, int n)
        {
            int stk = 1;
            for (int i = 1; i <= n; ++i)
                if (G[i].size() < 2)
                {
                    stk = i;
                    break;
                }
            vector<int> p;
            int pre = 0, u = stk;
            while (u)
            {
                p.emplace_back(u);
                int ne = 0;
                for (int v : G[u])
                    if (v != pre)
                    {
                        ne = v;
                        break;
                    }
                pre = u, u = ne;
            }
            return p;
        }

        inline int get(const vector<vector<int>> &G, int n)
        {
            if (n == 2)
                return 20;
            if (n == 3)
                return 30;
            vector<int> d;
            for (int i = 1; i <= n; ++i)
                d.emplace_back(G[i].size());
            sort(d.rbegin(), d.rend());
            if (n == 4)
            {
                if (d == vector<int>{2, 2, 1, 1})
                    return 40;
                if (d == vector<int>{3, 1, 1, 1})
                    return 42;
            }
            if (n == 5)
            {
                if (d == vector<int>{2, 2, 2, 1, 1})
                    return 50;
                if (d == vector<int>{3, 2, 1, 1, 1})
                    return 51;
                if (d == vector<int>{4, 1, 1, 1, 1})
                    return 52;
            }
            return -1;
        }

        inline vector<int> cmap(const vector<vector<int>> &G, int n, int tp)
        {
            vector<int> c2a(11, 0);
            if (tp == 20 || tp == 30 || tp == 40 || tp == 50)
            {
                auto p = pthord(G, n);
                for (int i = 0; i < n; ++i)
                    c2a[i + 1] = p[i];
                return c2a;
            }
            if (tp == 42 || tp == 52)
            {
                int c = 1;
                for (int i = 1; i <= n; ++i)
                    if (G[i].size() > G[c].size())
                        c = i;
                c2a[1] = c;
                vector<int> leaves;
                for (int i = 1; i <= n; ++i)
                    if (i != c)
                        leaves.emplace_back(i);
                sort(leaves.begin(), leaves.end());
                for (int i = 0; i < leaves.size(); ++i)
                    c2a[i + 2] = leaves[i];
                return c2a;
            }
            if (tp == 51)
            {
                int cen = 1, deg2 = 1, ldeg2 = 1;
                vector<int> vec;
                for (int i = 1; i <= 5; ++i)
                    if (G[i].size() == 3)
                        cen = i;
                for (int v : G[cen])
                    if (G[v].size() == 2)
                        deg2 = v;
                    else
                        vec.emplace_back(v);
                sort(vec.begin(), vec.end());
                for (int v : G[deg2])
                    if (v != cen)
                        ldeg2 = v;
                c2a[1] = vec[0], c2a[2] = cen, c2a[3] = vec[1], c2a[4] = deg2, c2a[5] = ldeg2;
                return c2a;
            }
            return c2a;
        }
        inline map<pair<int, int>, Plan> buildtable()
        {
            map<pair<int, int>, Plan> tab;
            auto ae = [&](int s, int t, vector<Op> ops, vector<int> mp)
            {
                tab[{s, t}] = Plan{move(ops), move(mp)};
            };
            ae(40, 20, {Op{{1, 2, 3, 4}, 5, {{5, 1, 2}, {5, 3, 4}}}}, {0, 2, 3});
            ae(40, 30, {Op{{1, 2, 3, 4}, 5, {{5, 1, 2, 3, 4}}}}, {0, 2, 5, 3});
            ae(40, 42, {Op{{1, 2, 3, 4}, 5, {{5, 2, 3}}}, Op{{1, 2, 3, 5}, 6, {{6, 1, 5}}}, Op{{1, 2, 3, 6}, 7, {{7, 1, 2, 6}}}, Op{{2, 4, 5, 7}, 1, {{1, 2, 7}, {1, 4, 5}}}}, {0, 3, 4, 6, 7});
            ae(40, 50, {Op{{1, 2, 3, 4}, 5, {{5, 2, 3}}}}, {0, 2, 1, 5, 4, 3});
            ae(40, 51, {Op{{1, 2, 3, 4}, 5, {{5, 2, 3}}}, Op{{1, 2, 4, 5}, 6, {{6, 2, 1, 5}}}}, {0, 3, 4, 5, 6, 1});
            ae(40, 52, {Op{{1, 2, 3, 4}, 5, {{5, 2, 3}}}, Op{{1, 2, 3, 5}, 6, {{6, 1, 5}}}, Op{{1, 2, 3, 6}, 7, {{7, 2, 6}}}, Op{{1, 2, 3, 7}, 8, {{8, 1, 7}}}, Op{{1, 4, 5, 8}, 9, {{9, 8, 2, 1}, {9, 4, 5}}}}, {0, 3, 4, 6, 7, 8});
            ae(50, 20, {Op{{1, 2, 3, 5}, 6, {{6, 1, 2}, {6, 3, 4, 5}}}}, {0, 2, 3});
            ae(50, 30, {Op{{1, 2, 3, 5}, 6, {{6, 1, 2, 3, 4, 5}}}}, {0, 2, 6, 3});
            ae(50, 40, {Op{{1, 2, 3, 5}, 6, {{6, 2, 3, 4, 5}}}}, {0, 2, 1, 6, 3});
            ae(50, 42, {Op{{1, 2, 3, 4}, 6, {{6, 2, 3}}}, Op{{1, 2, 4, 6}, 7, {{7, 1, 6}}}, Op{{1, 3, 4, 7}, 8, {{8, 1, 2, 7}, {8, 3, 4}}}}, {0, 4, 5, 6, 7});
            ae(50, 51, {Op{{1, 2, 3, 4}, 6, {{6, 1, 2, 3}}}}, {0, 3, 4, 5, 6, 2});
            ae(50, 52, {Op{{1, 2, 3, 4}, 6, {{6, 2, 3}}}, Op{{1, 2, 3, 6}, 7, {{7, 1, 6}}}, Op{{1, 2, 4, 7}, 8, {{8, 1, 2, 7}}}, Op{{2, 3, 7, 8}, 1, {{1, 8, 2}, {1, 3, 7}}}}, {0, 4, 3, 5, 6, 8});
            ae(51, 20, {Op{{1, 2, 3, 4}, 6, {{6, 1, 2}, {6, 3, 2, 4}}}}, {0, 4, 5});
            ae(51, 30, {Op{{1, 2, 4, 5}, 6, {{6, 1, 2}, {6, 4, 5}}}}, {0, 3, 2, 4});
            ae(51, 40, {Op{{1, 2, 4, 5}, 6, {{6, 1, 2, 4, 5}}}}, {0, 3, 2, 6, 4});
            ae(51, 42, {Op{{1, 2, 4, 5}, 6, {{6, 2, 4}}}, Op{{1, 2, 3, 5}, 7, {{7, 1, 2}}}, Op{{1, 2, 6, 7}, 8, {{8, 1, 6}, {8, 2, 3, 7}}}}, {0, 5, 4, 6, 7});
            ae(51, 50, {Op{{1, 2, 4, 5}, 6, {{6, 1, 2, 4}}}}, {0, 3, 2, 6, 5, 4});
            ae(51, 52, {Op{{1, 2, 4, 5}, 6, {{6, 2, 4}}}, Op{{1, 2, 3, 5}, 7, {{7, 1, 2}}}, Op{{2, 3, 5, 7}, 8, {{8, 2, 3, 7}}}, Op{{1, 3, 6, 8}, 2, {{2, 8, 3}, {2, 1, 6}}}}, {0, 5, 4, 6, 7, 8});
            ae(52, 20, {Op{{1, 2, 3, 4}, 6, {{6, 1, 2}, {6, 3, 1, 4}}}}, {0, 1, 5});
            return tab;
        }
        inline int solve()
        {
            int ts = get(S, n1);
            int tt = get(T, n2);
            if (ts == -1 || tt == -1)
                return 0;
            vector<int> src = cmap(S, n1, ts), tgt = cmap(T, n2, tt);
            auto trans = [&](int x) -> int
            {
                if (x >= 1 && x <= n1)
                    return src[x];
                return x;
            };
            if (n1 == n2 && ts == tt)
            {
                for (int c = 1; c <= n2; ++c)
                    mp[tgt[c]] = trans(c);
                return 1;
            }
            auto tab = buildtable();
            auto it = tab.find({ts, tt});
            if (it == tab.end())
                return 0;
            ops.clear();
            for (auto op : it->second.ops)
            {
                Op real;
                for (int i = 0; i < 4; ++i)
                    real.s[i] = trans(op.s[i]);
                real.z = trans(op.z);
                for (auto cy : op.cyc)
                {
                    vector<int> rcy;
                    for (int x : cy)
                        rcy.emplace_back(trans(x));
                    real.cyc.emplace_back(move(rcy));
                }
                ops.emplace_back(move(real));
            }
            mp.assign(n2 + 1, 0);
            for (int c = 1; c <= n2; ++c)
                mp[tgt[c]] = trans(it->second.mp[c]);
            return 1;
        }
    };

}

namespace K_3
{

    struct Op
    {
        int s[3], z;
        vector<vector<int>> cyc;
    };

    struct Solver
    {
        int n1, n2, k, M, lim, acnt = 0;
        vector<vector<int>> S, T;
        vector<set<int>> g, ve;
        vector<char> alive, ileaf, prot;
        set<int> ase, free;
        queue<int> q1, q2;
        vector<Op> ops;

        inline Solver(int _n1, int _n2, int _k, const vector<vector<int>> &_S, const vector<vector<int>> &_T)
            : n1(_n1), n2(_n2), k(_k), S(_S), T(_T)
        {
            M = max(n1, n2);
            lim = M + 5;
            g.assign(lim + 1, {});
            ve.assign(lim + 1, {});
            alive.assign(lim + 1, 0);
            ileaf.assign(lim + 1, 0);
            prot.assign(lim + 1, 0);
        }

        inline void push(int x)
        {
            if (x >= 1 && x <= lim && alive[x])
            {
                if (ve[x].size() > 1)
                    q1.emplace(x);
                if (ileaf[x])
                    q2.emplace(x);
                if (g[x].size() == 2)
                {
                    for (int y : ve[x])
                        q2.emplace(y);
                }
            }
        }

        inline void clrleaf(int x)
        {
            if (x < 1 || x > lim || !ileaf[x])
                return;
            for (int y : g[x])
                ve[y].erase(x);
            ileaf[x] = 0;
        }

        inline void refresh(int x)
        {
            if (x < 1 || x > lim)
                return;
            int now = alive[x] && g[x].size() == 1;
            if (now && !ileaf[x])
            {
                ileaf[x] = 1;
                for (int y : g[x])
                {
                    ve[y].emplace(x);
                    if (ve[y].size() > 1)
                        q1.emplace(y);
                }
                q2.emplace(x);
            }
            else if (!now && ileaf[x])
                clrleaf(x);
            push(x);
        }

        inline void rebuild()
        {
            for (int i = 1; i <= lim; ++i)
                ve[i].clear(), ileaf[i] = 0;
            while (q1.size())
                q1.pop();
            while (!q2.empty())
                q2.pop();
            for (int x : ase)
                if (g[x].size() == 1)
                    ileaf[x] = 1;
            for (int x : ase)
                if (ileaf[x])
                {
                    int y = *g[x].begin();
                    ve[y].emplace(x);
                }
            for (int x : ase)
            {
                if (ve[x].size() > 1)
                    q1.emplace(x);
                if (ileaf[x])
                    q2.emplace(x);
            }
        }

        inline void initg()
        {
            for (int i = 1; i <= n1; ++i)
                alive[i] = 1, ase.emplace(i), ++acnt;
            for (int i = n1 + 1; i <= lim; ++i)
                free.emplace(i);
            for (int u = 1; u <= n1; ++u)
                for (int v : S[u])
                    if (u < v)
                        g[u].emplace(v), g[v].emplace(u);
            rebuild();
        }

        inline void adde(int u, int v)
        {
            clrleaf(u), clrleaf(v);
            g[u].emplace(v), g[v].emplace(u);
            refresh(u), refresh(v);
        }

        inline void dele(int u, int v)
        {
            clrleaf(u), clrleaf(v);
            g[u].erase(v), g[v].erase(u);
            refresh(u), refresh(v);
        }

        inline int newid()
        {
            int z = *free.begin();
            free.erase(free.begin());
            alive[z] = 1, ase.emplace(z), ++acnt;
            g[z].clear(), ve[z].clear(), ileaf[z] = 0, prot[z] = 0;
            return z;
        }

        inline void eraseiso(int x)
        {
            clrleaf(x);
            for (int y : vector<int>(g[x].begin(), g[x].end()))
                dele(x, y);
            alive[x] = 0, prot[x] = 0, ase.erase(x), --acnt;
            free.emplace(x);
            ve[x].clear(), ileaf[x] = 0;
        }

        inline void add_op(array<int, 3> s, int z, vector<vector<int>> cyc)
        {
            Op op;
            op.s[0] = s[0], op.s[1] = s[1], op.s[2] = s[2], op.z = z;
            op.cyc = move(cyc);
            ops.emplace_back(move(op));
        }

        inline int moveleaf(int a, int b, int c)
        {
            int z = newid();
            add_op({a, b, c}, z, {{a, b, z}});
            dele(a, b);
            eraseiso(a);
            adde(z, c);
            return z;
        }

        inline int reducechry(int a, int b, int c)
        {
            int z = newid();
            add_op({a, b, c}, z, {{a, c, b, z}});
            dele(a, c), dele(b, c);
            eraseiso(a), eraseiso(b);
            adde(z, c);
            return z;
        }

        inline int reducechain(int a, int b, int r, int c)
        {
            int z = newid();
            add_op({a, r, c}, z, {{a, b, r, z}});
            dele(a, b), dele(b, r);
            eraseiso(a), eraseiso(b);
            adde(z, c);
            return z;
        }

        inline int splitail(int b, int c, int d)
        {
            int z = newid();
            add_op({b, c, d}, z, {{b, c, d, z}});
            dele(b, c), dele(c, d);
            adde(c, z);
            return z;
        }

        inline int growD(int p, int t1, int t2)
        {
            int z = newid();
            add_op({p, t1, t2}, z, {});
            adde(z, p), adde(z, t1), adde(z, t2);
            return z;
        }

        inline int growA(int q, int r, int t1, int t2)
        {
            int z = newid();
            add_op({q, t1, t2}, z, {{t1, r, t2, z}});
            dele(r, t1), dele(r, t2);
            adde(z, q);
            return z;
        }

        inline int cone(int t, int l, int c)
        {
            int z = newid();
            add_op({t, l, c}, z, {{t, l, z}});
            dele(t, l);
            eraseiso(t), eraseiso(l);
            adde(z, c);
            return z;
        }

        inline int cleanhalf(int l1, int t1, int r, int t2, int c)
        {
            int z = newid();
            add_op({l1, t2, c}, z, {{l1, t1, r, t2, z}});
            dele(l1, t1), dele(t1, r), dele(r, t2);
            eraseiso(l1), eraseiso(t1);
            adde(z, c);
            return z;
        }

        inline int getchrycen()
        {
            while (q1.size())
            {
                int c = q1.front();
                q1.pop();
                if (alive[c] && ve[c].size() > 1)
                    return c;
            }
            return 0;
        }

        inline int reduceonce()
        {
            int c = getchrycen();
            if (c)
            {
                int a = *ve[c].begin(), b = *next(ve[c].begin());
                reducechry(a, b, c);
                return 1;
            }
            while (!q2.empty())
            {
                int a = q2.front();
                q2.pop();
                if (!alive[a] || !ileaf[a] || g[a].empty())
                    continue;
                int b = *g[a].begin();
                if (!alive[b] || g[b].size() != 2)
                    continue;
                int r = 0;
                for (int x : g[b])
                    if (x != a)
                    {
                        r = x;
                        break;
                    }
                int c = 0;
                for (int x : ase)
                    if (x != a && x != b && x != r)
                    {
                        c = x;
                        break;
                    }
                if (!c)
                    continue;
                reducechain(a, b, r, c);
                return 1;
            }
            return 0;
        }

        inline int reduceto(int siz)
        {
            while (acnt > siz)
                if (!reduceonce())
                    return 0;
            return 1;
        }

        inline vector<int> trans(const vector<vector<int>> &G, int m)
        {
            vector<int> tar1(m + 1, 0), tar2(lim + 1, 0);
            fill(prot.begin(), prot.end(), 0);
            if (acnt != m)
                return {};
            int rcur = ase.empty() ? 0 : *ase.begin();
            if (!rcur)
                return {};
            vector<int> up(m + 1, 0), ord;
            queue<int> q;
            q.emplace(1), up[1] = -1;
            while (q.size())
            {
                int u = q.front();
                q.pop();
                ord.emplace_back(u);
                for (int v : G[u])
                    if (v != up[u])
                        up[v] = u, q.emplace(v);
            }
            if (ord.size() != m)
                return {};
            auto protect = [&](int node, int tv)
            {
                prot[node] = 1, tar2[node] = tv, tar1[tv] = node;
            };
            protect(rcur, 1);
            queue<int> leaf;
            for (int x : ase)
                if (g[x].size() == 1)
                    leaf.emplace(x);
            auto push_leaf = [&](int x)
            {
                if (x >= 1 && x <= lim && alive[x] && !prot[x] && g[x].size() == 1)
                    leaf.emplace(x);
            };
            auto get_leaf = [&]() -> int
            {
                while (!leaf.empty())
                {
                    int x = leaf.front();
                    leaf.pop();
                    if (alive[x] && !prot[x] && g[x].size() == 1)
                        return x;
                }
                return 0;
            };
            for (int i = 1; i < m; ++i)
            {
                int tv = ord[i], cp = tar1[up[tv]];
                int a = get_leaf();
                if (!a)
                    return {};
                int b = *g[a].begin();
                if (b == cp)
                    protect(a, tv);
                else
                {
                    int z = moveleaf(a, b, cp);
                    protect(z, tv);
                    push_leaf(b), push_leaf(z);
                }
            }
            return tar1;
        }

        inline int solve1(vector<int> &mp)
        {
            if (!reduceto(n2))
                return 0;
            vector<vector<int>> G(n2 + 1);
            for (int u = 1; u <= n2; ++u)
                for (int v : T[u])
                    G[u].emplace_back(v);
            mp = trans(G, n2);
            return !mp.empty();
        }

        inline int pick_seed(int s, vector<char> &insd, vector<int> &up, vector<int> &aord)
        {
            insd.assign(n2 + 1, 1);
            up.assign(n2 + 1, 0);
            vector<int> deg(n2 + 1);
            queue<int> q;
            for (int i = 1; i <= n2; ++i)
            {
                deg[i] = T[i].size();
                if (deg[i] < 2)
                    q.emplace(i);
            }
            int cnt = n2;
            vector<int> rem;
            while (cnt > s)
            {
                int v = 0;
                while (q.size())
                {
                    int x = q.front();
                    q.pop();
                    if (insd[x] && deg[x] < 2)
                    {
                        v = x;
                        break;
                    }
                }
                if (!v)
                    return 0;
                int p = 0;
                for (int y : T[v])
                    if (insd[y])
                    {
                        p = y;
                        break;
                    }
                if (!p)
                    return 0;
                insd[v] = 0, --cnt, rem.emplace_back(v), up[v] = p, --deg[p];
                if (deg[p] < 2)
                    q.emplace(p);
            }
            aord.assign(rem.rbegin(), rem.rend());
            return 1;
        }

        inline int solve2(vector<int> &fmap)
        {
            if (n1 <= 4)
                return 0;
            int s = n1 - 3;
            vector<char> insd;
            vector<int> up, aord;
            if (!pick_seed(s, insd, up, aord))
                return 0;
            if (aord.size() != n2 - s)
                return 0;
            vector<int> seli, trs1(n2 + 1, 0), trs2(n1 + 1, 0);
            for (int i = 1; i <= n2; ++i)
                if (insd[i])
                {
                    int id = seli.size() + 1;
                    seli.emplace_back(i);
                    trs1[i] = id, trs2[id] = i;
                }
            if (seli.size() != s)
                return 0;
            vector<vector<int>> C(n1 + 1);
            auto addC = [&](int u, int v)
            {
                C[u].emplace_back(v), C[v].emplace_back(u);
            };
            for (int u = 1; u <= n2; ++u)
                for (int v : T[u])
                    if (u < v && insd[u] && insd[v])
                        addC(trs1[u], trs1[v]);
            int a = s + 1, b = s + 2, c = s + 3, d = 1;
            addC(a, b), addC(b, c), addC(c, d);
            auto cmap = trans(C, n1);
            if (cmap.empty())
                return 0;
            fmap.assign(n2 + 1, 0);
            for (int tv : seli)
                fmap[tv] = cmap[trs1[tv]];
            int A = cmap[a], B = cmap[b], Cc = cmap[c], D = cmap[d], ztool = splitail(B, Cc, D);
            struct Tool
            {
                int top, bottom;
            };
            Tool tool1{B, A}, tool2{Cc, ztool};
            int stateA = 0, pending = 0, need = n2 - n1 + 1;
            if (need < 0 || aord.size() != need + 2)
                return 0;
            for (int i = 0; i < need; ++i)
            {
                int tv = aord[i], p = up[tv], pnode = fmap[p];
                if (!pnode)
                    return 0;
                if (!stateA)
                {
                    int r = growD(pnode, tool1.top, tool2.top);
                    fmap[tv] = r, pending = r, stateA = 1;
                }
                else
                {
                    int x = growA(pnode, pending, tool1.top, tool2.top);
                    fmap[tv] = x, pending = 0, stateA = 0;
                }
            }
            int tv1 = aord[need], tv2 = aord[need + 1], p1 = fmap[up[tv1]], p2 = fmap[up[tv2]];
            if (!p1 || !p2)
                return 0;
            if (!stateA)
            {
                int x1 = cone(tool1.top, tool1.bottom, p1);
                fmap[tv1] = x1;
                int x2 = cone(tool2.top, tool2.bottom, p2);
                fmap[tv2] = x2;
            }
            else
            {
                int x1 = cleanhalf(tool1.bottom, tool1.top, pending, tool2.top, p1);
                fmap[tv1] = x1;
                int x2 = cone(tool2.top, tool2.bottom, p2);
                fmap[tv2] = x2;
            }
            return 1;
        }

        inline int solve(vector<int> &mp)
        {
            if (k != 3)
                return 0;
            initg();
            if (n1 >= n2)
                return solve1(mp);
            return solve2(mp);
        }
    };

}

namespace K_2
{

    struct Op
    {
        int u, v, z;
        vector<vector<int>> cyc;
    };

    struct Solver
    {
        int n1, n2, M, lim;
        vector<vector<int>> S, T;
        vector<set<int>> g;
        vector<char> alive, built;
        set<int> free, ase;
        queue<int> q;
        vector<Op> ops;
        vector<int> mp;
        int ok = 111;

        inline Solver(int _n1, int _n2, const vector<vector<int>> &_S, const vector<vector<int>> &_T) : n1(_n1), n2(_n2), S(_S), T(_T)
        {
            M = max(n1, n2);
            lim = M + 5;
            g.assign(lim + 1, {});
            alive.assign(lim + 1, 0);
            built.assign(lim + 1, 0);
            mp.assign(n2 + 1, 0);
        }

        inline void push_leaf(int x)
        {
            if (x >= 1 && x <= lim && alive[x] && g[x].size() == 1)
                q.emplace(x);
        }

        inline void initg()
        {
            for (int i = 1; i <= n1; ++i)
                alive[i] = 1, ase.emplace(i);
            for (int i = n1 + 1; i <= lim; ++i)
                free.emplace(i);
            for (int u = 1; u <= n1; ++u)
                for (int v : S[u])
                    if (u < v)
                        g[u].emplace(v), g[v].emplace(u);
            for (int i = 1; i <= n1; ++i)
                push_leaf(i);
        }

        inline int alloc_real()
        {
            if (free.empty())
                return ok = 0, 0;
            int x = *free.begin();
            free.erase(free.begin());
            alive[x] = 1, built[x] = 0, g[x].clear(), ase.emplace(x);
            push_leaf(x);
            return x;
        }

        inline int alloc_temp()
        {
            if (free.empty())
                return ok = 0, 0;
            return *free.begin();
        }

        inline void delete_if_isolated(int x)
        {
            if (!alive[x] || !g[x].empty())
                return;
            if (built[x])
            {
                ok = 0;
                return;
            }
            alive[x] = 0, built[x] = 0, ase.erase(x), free.emplace(x);
        }

        inline void addee(int u, int v)
        {
            g[u].emplace(v), g[v].emplace(u);
            push_leaf(u), push_leaf(v);
        }

        inline void dele(int u, int v)
        {
            if (!g[u].count(v))
            {
                ok = 0;
                return;
            }
            g[u].erase(v), g[v].erase(u);
            push_leaf(u), push_leaf(v);
        }
        inline int op_join(int u, int v)
        {
            int z = alloc_real();
            if (!ok)
                return 0;
            ops.push_back({u, v, z, {}});
            addee(z, u), addee(z, v);
            return z;
        }
        inline void cutpath(const vector<int> &path)
        {
            if (!ok || path.size() < 2)
            {
                ok = 0;
                return;
            }
            for (int i = 0; i + 1 < path.size(); ++i)
                if (!alive[path[i]] || !alive[path[i + 1]] || !g[path[i]].count(path[i + 1]))
                {
                    ok = 0;
                    return;
                }
            int z = alloc_temp();
            if (!ok)
                return;
            vector<int> cy = path;
            cy.emplace_back(z);
            ops.push_back({path.front(), path.back(), z, {cy}});
            for (int i = 0; i + 1 < path.size(); ++i)
                dele(path[i], path[i + 1]);
            for (int x : path)
                delete_if_isolated(x);
        }

        inline int chkstar(const vector<vector<int>> &G, int n)
        {
            if (n == 2)
                return 111;
            int mx = 0;
            for (int i = 1; i <= n; ++i)
                mx = max<int>(mx, G[i].size());
            return mx == n - 1;
        }

        inline int starcen(const vector<vector<int>> &G, int n)
        {
            if (n == 2)
                return 1;
            int c = 1;
            for (int i = 1; i <= n; ++i)
                if (G[i].size() > G[c].size())
                    c = i;
            return c;
        }

        inline int solvestar()
        {
            if (!chkstar(S, n1))
                return 0;
            if (!chkstar(T, n2) || n1 < n2)
                return ok = 0, 111;
            initg();
            int cs = starcen(S, n1), ct = starcen(T, n2);
            vector<int> leaves;
            for (int i = 1; i <= n1; ++i)
                if (i != cs)
                    leaves.emplace_back(i);
            int need = n2 - 1, del = leaves.size() - need;
            for (int i = 0; i < del; ++i)
                cutpath({cs, leaves[i]});
            vector<int> rest;
            for (int i = del; i < leaves.size(); ++i)
                if (alive[leaves[i]])
                    rest.emplace_back(leaves[i]);
            mp[ct] = cs;
            int pos = 0;
            for (int i = 1; i <= n2; ++i)
                if (i != ct)
                    mp[i] = rest[pos++];
            return 111;
        }

        inline pair<int, int> pickaleaf()
        {
            while (!q.empty())
            {
                int x = q.front();
                q.pop();
                if (!alive[x] || g[x].size() != 1)
                    continue;
                return {x, *g[x].begin()};
            }
            return {0, 0};
        }

        inline pair<int, int> pickleafe()
        {
            while (!q.empty())
            {
                int x = q.front();
                q.pop();
                if (!alive[x] || built[x] || g[x].size() != 1)
                    continue;
                int y = *g[x].begin();
                if (built[y])
                    continue;
                return {x, y};
            }
            return {0, 0};
        }

        inline int residual()
        {
            int e = 0;
            for (int u : ase)
            {
                if (!alive[u])
                    continue;
                for (int v : g[u])
                    if (u < v)
                    {
                        if (!built[u] && !built[v])
                            ++e;
                        else if (built[u] != built[v])
                            ok = 0;
                    }
            }
            return e;
        }

        inline vector<int> compf(int s)
        {
            vector<int> comp;
            queue<int> q;
            unordered_set<int> vis;
            q.emplace(s), vis.emplace(s);
            while (q.size())
            {
                int u = q.front();
                q.pop();
                comp.emplace_back(u);
                for (int v : g[u])
                    if (!vis.count(v))
                        vis.emplace(v), q.emplace(v);
            }
            return comp;
        }

        inline int pleafcomp(const vector<int> &comp)
        {
            for (int x : comp)
                if (alive[x] && g[x].size() == 1)
                    return x;
            return 0;
        }

        inline pair<int, int> findspe()
        {
            vector<int> up(n1 + 1, 0), ord;
            queue<int> q;
            q.emplace(1), up[1] = -1;
            while (q.size())
            {
                int u = q.front();
                q.pop();
                ord.emplace_back(u);
                for (int v : S[u])
                    if (v != up[u])
                        up[v] = u, q.emplace(v);
            }
            vector<int> sz(n1 + 1, 1);
            for (int i = n1 - 1; ~i; --i)
            {
                int u = ord[i];
                for (int v : S[u])
                    if (up[v] == u)
                        sz[u] += sz[v];
            }
            for (int v = 2; v <= n1; ++v)
            {
                int s = sz[v];
                if (s > 1 && s < n1 - 1)
                    return {up[v], v};
            }
            return {0, 0};
        }

        inline pair<int, int> tare()
        {
            for (int i = 1; i <= n2; ++i)
                if (T[i].size())
                    return {i, T[i][0]};
            return {0, 0};
        }

        inline tuple<int, int, int> tar3()
        {
            for (int i = 1; i <= n2; ++i)
                if (T[i].size() >= 2)
                    return {i, T[i][0], T[i][1]};
            return {0, 0, 0};
        }

        inline vector<int> build(const vector<int> &seed, vector<int> &up)
        {
            vector<int> ord;
            vector<char> vis(n2 + 1, 0);
            queue<int> q;
            up.assign(n2 + 1, 0);
            for (int x : seed)
                vis[x] = 1, q.emplace(x);
            while (q.size())
            {
                int u = q.front();
                q.pop();
                for (int v : T[u])
                    if (!vis[v])
                    {
                        vis[v] = 1, up[v] = u;
                        ord.emplace_back(v), q.emplace(v);
                    }
            }
            return ord;
        }

        inline void make(int x, int tx)
        {
            if (!alive[x] || built[x] || mp[tx])
            {
                ok = 0;
                return;
            }
            built[x] = 1, mp[tx] = x;
        }

        inline void adde(int par, int tar)
        {
            auto [a, b] = pickleafe();
            if (!a)
            {
                ok = 0;
                return;
            }
            int x = op_join(par, a);
            cutpath({x, a});
            make(x, tar);
        }

        inline void addf(int par, int tar)
        {
            auto [a, b] = pickleafe();
            if (!a)
            {
                ok = 0;
                return;
            }
            int x = op_join(par, a);
            cutpath({x, a, b});
            make(x, tar);
        }

        inline void dele()
        {
            auto [a, b] = pickleafe();
            if (!a)
            {
                ok = 0;
                return;
            }
            cutpath({a, b});
        }

        inline void process(const vector<int> &ord, const vector<int> &up)
        {
            int R = ord.size(), E = residual(), idx = 0;
            if (!ok)
                return;

            if (R > E)
            {
                int keep = R - E;
                for (int i = 0; i < keep; ++i)
                {
                    int tv = ord[idx++], p = mp[up[tv]];
                    adde(p, tv);
                    if (!ok)
                        return;
                }
            }

            while (idx < R)
            {
                int tv = ord[idx++], p = mp[up[tv]];
                addf(p, tv);
                --E;
                if (!ok)
                    return;
            }

            while (E > 0)
            {
                dele();
                --E;
                if (!ok)
                    return;
            }
        }

        inline void reduce()
        {
            while (ok && ase.size() > 2)
            {
                auto [a, b] = pickaleaf();
                if (!a)
                {
                    ok = 0;
                    return;
                }
                cutpath({a, b});
            }
            vector<int> rem;
            for (int x : ase)
                if (alive[x])
                    rem.emplace_back(x);
            if (rem.size() != 2 || !g[rem[0]].count(rem[1]))
            {
                ok = 0;
                return;
            }
            mp[1] = rem[0], mp[2] = rem[1];
        }

        inline void solvepath4seed()
        {
            auto [u, v] = findspe();
            if (!u)
            {
                ok = 0;
                return;
            }

            cutpath({u, v});

            vector<vector<int>> comps;
            unordered_set<int> vis;
            for (int x : ase)
            {
                if (!alive[x] || vis.count(x))
                    continue;
                vector<int> comp;
                queue<int> q;
                q.emplace(x), vis.emplace(x);
                while (q.size())
                {
                    int y = q.front();
                    q.pop();
                    comp.emplace_back(y);
                    for (int z : g[y])
                        if (!vis.count(z))
                            vis.emplace(z), q.emplace(z);
                }
                comps.emplace_back(move(comp));
            }

            if (comps.size() != 2 || comps[0].size() != 2)
            {
                ok = 0;
                return;
            }

            auto [t0, t1] = tare();
            if (!t0)
            {
                ok = 0;
                return;
            }

            int a = comps[0][0], b = comps[0][1];
            if (!g[a].count(b))
            {
                ok = 0;
                return;
            }

            make(a, t0), make(b, t1);
            vector<int> up;
            vector<int> ord = build({t0, t1}, up);
            process(ord, up);
        }

        inline void solvegennostar()
        {
            if (n2 == 2)
                return reduce();
            if (n1 == 4)
                return solvepath4seed();

            auto [u, v] = findspe();
            if (!u)
            {
                ok = 0;
                return;
            }

            cutpath({u, v});

            vector<int> cu = compf(u), cv = compf(v);
            int a = pleafcomp(cu), b = pleafcomp(cv);
            if (!a || !b || g[a].empty() || g[b].empty())
            {
                ok = 0;
                return;
            }

            int pa = *g[a].begin(), pb = *g[b].begin();
            int mid = op_join(a, b);
            cutpath({a, pa});
            cutpath({b, pb});

            auto [tc, tl, tr] = tar3();
            if (!tc)
            {
                ok = 0;
                return;
            }

            make(mid, tc);
            make(a, tl);
            make(b, tr);

            vector<int> up;
            vector<int> ord = build({tc, tl, tr}, up);
            process(ord, up);
        }

        inline int final_check()
        {
            if (!ok)
                return 0;
            if (ase.size() != n2)
                return 0;

            vector<char> used(lim + 1, 0);
            for (int i = 1; i <= n2; ++i)
            {
                if (!mp[i] || !alive[mp[i]] || used[mp[i]])
                    return 0;
                used[mp[i]] = 1;
            }
            for (int x : ase)
                if (!used[x])
                    return 0;
            return 111;
        }

        inline int solve()
        {
            if (solvestar())
                return ok && final_check();
            initg(), solvegennostar();
            return ok && final_check();
        }
    };

}

inline void sol()
{
    int n1, n2, k;
    cin >> n1 >> n2 >> k;
    vector<vector<int>> S(n1 + 1), T(n2 + 1);
    for (int i = 1; i < n1; ++i)
    {
        int u, v;
        cin >> u >> v;
        S[u].emplace_back(v);
        S[v].emplace_back(u);
    }
    for (int i = 1; i < n2; ++i)
    {
        int u, v;
        cin >> u >> v;
        T[u].emplace_back(v);
        T[v].emplace_back(u);
    }
    if (k == 2)
    {
        K_2::Solver solver(n1, n2, S, T);
        if (solver.solve())
        {
            cout << "Yes\n";
            cout << solver.ops.size() << '\n';
            for (auto &op : solver.ops)
            {
                cout << op.u << ' ' << op.v << ' ' << op.z << '\n';
                cout << op.cyc.size() << '\n';
                for (auto &cy : op.cyc)
                {
                    cout << cy.size();
                    for (int x : cy)
                        cout << ' ' << x;
                    cout << '\n';
                }
            }
            for (int i = 1; i <= n2; ++i)
                cout << solver.mp[i] << ' ';
            cout << '\n';
        }
        else
            cout << "No\n";
    }
    else if (k == 3)
    {
        K_3::Solver solver(n1, n2, k, S, T);
        vector<int> mp;
        if (solver.solve(mp))
        {
            cout << "Yes\n";
            cout << solver.ops.size() << '\n';
            for (auto &op : solver.ops)
            {
                cout << op.s[0] << ' ' << op.s[1] << ' ' << op.s[2] << ' ' << op.z << '\n';
                cout << op.cyc.size() << '\n';
                for (auto &cy : op.cyc)
                {
                    cout << cy.size();
                    for (int x : cy)
                        cout << ' ' << x;
                    cout << '\n';
                }
            }
            for (int i = 1; i <= n2; ++i)
                cout << mp[i] << ' ';
            cout << '\n';
        }
        else
            cout << "No\n";
    }
    else
    {
        if (max(n1, n2) <= 5)
        {
            K_4::SmallK4 small(n1, n2, S, T);
            if (small.solve())
            {
                cout << "Yes\n";
                cout << small.ops.size() << '\n';
                for (auto &op : small.ops)
                {
                    cout << op.s[0] << ' ' << op.s[1] << ' ' << op.s[2] << ' ' << op.s[3] << ' ' << op.z << '\n';
                    cout << op.cyc.size() << '\n';
                    for (auto &cy : op.cyc)
                    {
                        cout << cy.size();
                        for (int x : cy)
                            cout << ' ' << x;
                        cout << '\n';
                    }
                }
                for (int i = 1; i <= n2; ++i)
                    cout << small.mp[i] << ' ';
                cout << '\n';
            }
            else
                cout << "No\n";
            return;
        }
        K_4::Solver_large sol(n1, n2, S, T);
        if (sol.solve())
        {
            cout << "Yes\n";
            cout << sol.ops.size() << '\n';
            for (auto &op : sol.ops)
            {
                cout << op.s[0] << ' ' << op.s[1] << ' ' << op.s[2] << ' ' << op.s[3] << ' ' << op.z << '\n';
                cout << op.cyc.size() << '\n';
                for (auto &cy : op.cyc)
                {
                    cout << cy.size();
                    for (int x : cy)
                        cout << ' ' << x;
                    cout << '\n';
                }
            }
            for (int i = 1; i <= n2; ++i)
                cout << sol.mp[i] << ' ';
            cout << '\n';
        }
        else
            cout << "No\n";
    }
}

bool endmem;

signed main()
{
    srand(time(0));
    cin.tie(0)->sync_with_stdio(0);
    cout << fixed << setprecision(15);
    cerr << fixed << setprecision(5);
    int c, T = 1;
    cin >> c >> T;
    init();
    while (T--)
        sol();
    cerr << "Memory Used " << abs(&beginmem - &endmem) / 1048576. << " MB.\n";
    return 0;
}
```
:::

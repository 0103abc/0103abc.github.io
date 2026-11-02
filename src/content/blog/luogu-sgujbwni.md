---
title: "CF1508E Tree Calendar 题解"
date: "2026-04-23T13:35:31.000Z"
link: "luogu-sgujbwni"
categories: ["题解"]
tags: ["Codeforces", "搜索", "深度优先搜索", "图论", "树"]
draft: false
---

::::info[性质 $1$]{open}
不论怎么进行操作，$u$ 结点的儿子 $a$ 值的大小关系不会发生变化。

:::success[证明]
记 $u$ 结点的所有儿子结点分别为 $v_1,v_2,\ldots,v_k$（满足 $a{v_1}<a_{v_2}<\ldots<a_{v_k}$）则假设交换的是 $u$ 和 $v_i$ 结点的 $a$ 值，则很显然 $a_{v_i}$ 的值在交换后不可能比 $a_{v_{i+1}}$ 大，而又因为交换的一定是符合条件的数里最小的，所以 $a_{v_i}$ 的值又不可能比 $a_{v_{i-1}}$ 小。因此得证。
:::
::::

::::info[性质 $2$]{open}
进行完父结点为 $1\ldots k$ 的所有交换操作后，根结点的 $a$ 值是 $k+1$。
::::

::::info[性质 $3$]{open}
进行完父结点为 $1\ldots k$ 的所有交换操作后，$a$ 值为 $k+1\ldots n$ 的点按照 DFS 序从小到大排列。
::::

根据性质 $1$ 可以直接唯一确定原树的 DFS 序，利用性质 $2,3$ 判断树是否可以通过操作得出即可。具体的，需要先找出一个分界点 $p$，满足 $1\ldots p-1$ 编号的点的操作已经执行完，而 $p+1\ldots n$ 编号的点还没有执行操作。然后逆向操作把 $p$ 转回根结点然后分别判断两侧是否满足条件即可。

天数即执行的操作数是容易求的，根据上面给出的性质可知答案就是 $\sum\limits_{i=1}^p\text{dep}(e_i)$，其中 $e_i$ 满足 $a_{e_i}=i$。具体细节见代码。

```cpp line-numbers
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;

const int N = 300010;
const int inf = 1e18;
const int mod = 998244353;

vector<int> adj[N];
int a[N], e[N], dfn[N], odfn[N], idx, idx2, dep[N], up[N], pdf[N], siz[N];

inline void dfs(int u, int fa) {
    dfn[u] = ++idx, dep[u] = dep[fa] + 1, up[u] = fa, siz[u] = 1;
    for (int &v : adj[u]) if (v != fa) dfs(v, u), siz[u] += siz[v];
    odfn[u] = ++idx2, pdf[idx2] = u;
}

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i < n; ++i) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), adj[b].emplace_back(a);
    }
    for (int i = 1; i <= n; ++i)
        sort(adj[i].begin(), adj[i].end(), [&](auto &l, auto &r) { return a[l] < a[r]; });
    function<bool(int)> chk_leaf = [&](int u) {
        return u != 1 && adj[u].size() == 1;
    };
    function<bool(int, int)> chk_ance = [&](int u, int v) {
        return dfn[u] <= dfn[v] && dfn[v] < dfn[u] + siz[u];
    };
    dep[0] = -1, dfs(1, 0);
    for (int i = 1; i <= n; ++i) e[a[i]] = i;
    int id = a[1] - 1;
    if (a[1] == 1) {
        for (int i = 1; i <= n; ++i)
            if (a[i] != dfn[i]) { cout << "NO\n"; return; }
        cout << "YES\n0\n";
        for (int i = 1; i <= n; ++i) cout << a[i] << ' ';
        cout << '\n';
    } else {
        for (int i = 1; i <= n; ++i)
            if (a[i] < id && a[i] != odfn[i]) { cout << "NO\n"; return; }
        if (!chk_ance(e[id], pdf[id])) { cout << "NO\n"; return; }
        int cnt = 0;
        for (int i = 1; i <= n; ++i)
            if (a[i] < id) cnt += dep[i];
        int tmp = -1;
        for (int i = 1; i <= n; ++i) if (a[i] == id) { tmp = i; break; }
        while (tmp > 1) ++cnt, swap(a[tmp], a[up[tmp]]), tmp = up[tmp];
        for (int i = 2; i <= n; ++i)
            if (a[i] >= id && a[up[i]] > a[i]) { cout << "NO\n"; return; }
        cout << "YES\n";
        cout << cnt << '\n';
        for (int i = 1; i <= n; ++i) cout << dfn[i] << ' ';
        cout << '\n';
    }
}

signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    sol();
    // int T; cin >> T; while (T--) sol();
    return 0;
}

```

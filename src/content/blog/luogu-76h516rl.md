---
title: "P17002 [NWERC 2019] 无用交换机 / Disposable Switches 题解"
date: "2026-06-29T15:12:25.000Z"
link: "luogu-76h516rl"
categories: ["题解"]
tags: ["洛谷", "图论", "最短路", "动态规划"]
draft: false
---

将所有边的边权都整体乘以 $v$，则边权可以被表示为 $l_i+cv$ 的形式。

然后考虑把已知量 $l_i$ 和未知量 $cv$ 分离处理，换元 $x=cv$，则对一条路径而言，若其经过了 $k$ 条边，路径上 $l_i$ 的和为 $L$，该路径的传输时间就是 $kx+L$。

考虑枚举经过的边的数量 $k$，对每个 $k$ 求出 $L$ 的最小值。记 $M_i$ 表示 $k=i$ 时 $L$ 的最小值，则这个显然可以 dp 算，设 $f_{i,j}$ 表示当前经过了 $i$ 条边，当前位于点 $j$，路径的 $l_i$ 的和最小为多少。转移枚举 $j$ 的所有出边即可。

因此对每个 $k$ 有用的部分就是 $y=kx+M_k$ 这条直线。求出全部 $n$ 条直线组成的下凸壳就可以知道哪些 $k$ 可能成为最终的答案。然后找哪些点可能在答案中出现可以考虑把前面算 $f_{i,j}$ 的 dp 再倒过来递归算一遍，所有递归过程中被访问的点就是可能出现在答案中的点。

时间复杂度为 $O(nm)$，可以通过该题。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int f[2010][2010], stk[N];
vector<pair<int, int>> adj[N];
struct Edge { int a, b, l; } e[N];

#define x first
#define y second
using POD = pair<int, int>;
inline POD operator-(const POD &l, const POD &r) { return {l.x - r.x, l.y - r.y}; }
inline i128 cross(POD a, POD b) { return (i128)a.x * b.y - (i128)a.y * b.x; }
inline int dist(POD a, POD b) { return sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)); }
inline i128 area(POD a, POD b, POD c) { return cross(b - a, c - a); }

int n, m, vis[2010][2010];
inline void dfs(int dep, int u) {
    vis[dep][u] = 1;
    if (!dep) return;
    for (auto &[v, w] : adj[u])
        if (f[dep - 1][v] + w == f[dep][u] && !vis[dep - 1][v]) dfs(dep - 1, v);
}

inline void sol() {
    cin >> n >> m;
    for (int i = 1; i <= m; ++i) cin >> e[i].a >> e[i].b >> e[i].l;
    for (int i = 1; i <= m; ++i) {
        auto [a, b, l] = e[i];
        adj[a].emplace_back(b, l);
        adj[b].emplace_back(a, l);
    }
    memset(f, 0x3f, sizeof f);
    f[0][1] = 0;
    for (int i = 1; i < n; ++i)
        for (int j = 1; j <= n; ++j)
            for (auto &[k, w] : adj[j])
                f[i][k] = min(f[i][k], f[i - 1][j] + w);
    int top = 0;
    for (int i = n - 1; i; --i) {
        while (top >= 2 && area({stk[top - 1], f[stk[top - 1]][n]}, {stk[top], f[stk[top]][n]}, {i, f[i][n]}) > 0) --top;
        if (top == 1 && f[stk[top]][n] > f[i][n]) --top;
        stk[++top] = i;
    }
    // cout << "in stack: ";
    for (int i = 1; i <= top; ++i) dfs(stk[i], n);//, cout << stk[i] << ' ';
    // cout << '\n';
    vector<int> res;
    for (int i = 1; i <= n; ++i) {
        res.emplace_back(i);
        for (int j = 0; j < n; ++j)
            if (vis[j][i]) {
                res.pop_back();
                break;
            }
    }
    cout << res.size() << '\n';
    for (int &i : res) cout << i << ' ';
    cout << '\n';
}

} // namespace lowspeed_song
```

---
title: "CF1943C Tree Compass 题解"
date: "2025-02-26T02:14:44.000Z"
link: "luogu-ne558q9l"
categories: ["题解"]
tags: ["Codeforces", "图论", "树"]
draft: false
---

首先考虑一条长度为 $n$ 的链上的情况。

对于 $2\nmid n$ 的情况：链上存在编号为 $\frac{n+1}2$ 的中点，直接以这个点为中心，向两边扩展长度染色即可，需要耗费 $\frac {n+1}2$ 次操作。

对于 $2\mid n$ 的情况：此时链上没有中点，因此需要继续分类讨论：

+ 若 $4\nmid n$ ，则最优解只能是找到“中边”连接的两个编号分别为 $\frac n2$ 和 $\frac n2+1$ 的点，然后以其中任意一个点为中心向左右两侧扩展，需要花费 $\frac n2+1$ 次操作。
+ 若 $4\mid n$ ，则找到“中边”连接的两个编号分别为 $\frac n2$ 和 $\frac n2+1$ 的点，然后以这两个点为中心，分别向序列两边扩展奇数长度的结点，需要花费 $\frac n2$ 次操作。将序列奇偶染色可以证明必然能够用这个方法染色所有序列上的点。

然后考虑将其扩展到树上。考虑下面一个结论：

+ 对于树 $T$ 的任意一条直径 $u\leftrightarrow v$ ，树上任意一点 $i$ 都不存在距离比 $i$ 到 $u$ 或者 $i$ 到 $v$ 更远的结点。

因此只需要在树上任意找出一条直径，然后对直径做上述对链的染色操作即可解决问题，时间复杂度为 $O(n)$ 。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 2010;
vector<int> adj[N];
int dis[N], depth[N], parent[N];
void dfs(int u, int fa) {
    depth[u] = depth[fa] + 1;
    parent[u] = fa;
    for (int &v : adj[u])
        if (v != fa) {
            dfs(v, u);
            depth[u] = depth[fa] + 1;
        }
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    cerr << fixed << setprecision(5);
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        if (n == 1) cout << "1\n1 0\n";
        else {
            for (int i = 1; i <= n; ++i) adj[i].clear();
            for (int i = 1; i < n; ++i) {
                int x, y;
                cin >> x >> y;
                adj[x].emplace_back(y);
                adj[y].emplace_back(x);
            }
            for (int i = 1; i <= n; ++i) dis[i] = 1e18;
            dis[1] = 0;
            queue<int> q;
            q.emplace(1);
            while (q.size()) {
                int t = q.front();
                q.pop();
                for (int &g : adj[t]) {
                    if (dis[g] > dis[t] + 1) {
                        dis[g] = dis[t] + 1;
                        q.emplace(g);
                    }
                }
            }
            int id = 1;
            for (int i = 2; i <= n; ++i)
                if (dis[id] < dis[i]) id = i;
            for (int i = 1; i <= n; ++i) dis[i] = 1e18;
            dis[id] = 0;
            q.emplace(id);
            while (q.size()) {
                int t = q.front();
                q.pop();
                for (int &g : adj[t]) {
                    if (dis[g] > dis[t] + 1) {
                        dis[g] = dis[t] + 1;
                        q.emplace(g);
                    }
                }
            }
            int id2 = 1;
            for (int i = 2; i <= n; ++i)
                if (dis[id2] < dis[i]) id2 = i;
            // diameter: id <--> id2
            dfs(1, 0);
            vector<int> jmp1, jmp2, lnk;
            while (depth[id] > depth[id2]) {
                jmp1.emplace_back(id);
                id = parent[id];
            }
            while (depth[id] < depth[id2]) {
                jmp2.emplace_back(id2);
                id2 = parent[id2];
            }
            while (id != id2) {
                jmp1.emplace_back(id);
                jmp2.emplace_back(id2);
                id = parent[id];
                id2 = parent[id2];
            }
            for (int &i : jmp1) lnk.emplace_back(i);
            lnk.emplace_back(id);
            reverse(jmp2.begin(), jmp2.end());
            for (int &i : jmp2) lnk.emplace_back(i);
            if (lnk.size() & 1) {
                vector<pair<int, int>> op;
                int mid = lnk.size() / 2;
                for (int i = 0; i <= mid; ++i) op.emplace_back(lnk[mid], i);
                cout << op.size() << '\n';
                for (auto &[i, j] : op) cout << i << ' ' << j << '\n';
            } else {
                if (lnk.size() & 3) {
                    vector<pair<int, int>> op;
                    int mid = lnk.size() / 2;
                    for (int i = 0; i <= mid; ++i) op.emplace_back(lnk[mid], i);
                    cout << op.size() << '\n';
                    for (auto &[i, j] : op) cout << i << ' ' << j << '\n';
                } else {
                    vector<pair<int, int>> op;
                    int m1 = lnk.size() / 2 - 1, m2 = lnk.size() / 2;
                    for (int i = 0; i < m2 / 2; ++i) {
                        op.emplace_back(lnk[m1], i << 1 | 1);
                        op.emplace_back(lnk[m2], i << 1 | 1);
                    }
                    cout << op.size() << '\n';
                    for (auto &[i, j] : op) cout << i << ' ' << j << '\n';
                }
            }
        }
    }
    return 0;
}
```

---
title: "AT_arc149_c [ARC149C] Avoid Prime Sum 题解"
date: "2025-02-25T14:35:54.000Z"
link: "luogu-qs3lur11"
categories: ["题解"]
tags: ["AtCoder", "算法思想", "构造", "数学", "数论", "搜索", "深度优先搜索"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/qs3lur11)。

考虑对 $n$ 的奇偶性分类讨论答案。

**I. $n$ 是偶数**

此时把上面的 $\frac n2$ 行构造奇数，下面的 $\frac n2$ 行构造偶数。可以证明此时上 $\frac n2$ 行和下 $\frac n2$ 行各自内部相邻两个数的和一定不为质数（都是不为 $2$ 的偶数）。因此只需要考虑第 $\frac n2$ 行和第 $\frac n2+1$ 行之间上下相邻两个格子之间的关系。容易想到构造让她们之间的和都为 $3$ 的倍数，那么直接把所有 $3$ 的倍数的数拿出来分奇偶放入两个数组中，先填写这两行，然后用剩下的元素填写剩下的 $n-2$ 行即可。

特殊的，$n$ 很小的时候该构造显然不对，需要单独 DFS 搜索出答案。

**II. $n$ 是奇数**

也是类似的。特殊的地方在于此时边界线分为三段，由左下 - 右上排列。也是类似的方法构造 $3$ 的倍数即可。

代码，比较复杂，但是除了奇数情况的边界条件以外没有什么容易出错的点。

```cpp
#pragma GCC optimize(3, "Ofast", "inline") 
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int mod = 1e9 + 7;
const int N = 2000010;
int n;
int pr[N], isp[N], idx, vis[N];
int mp[2010][2010];
void sieve() {
    for (int i = 2; i < N; ++i) {
        if (!isp[i]) pr[++idx] = i;
        for (int j = 1; j <= idx && i * pr[j] < N; ++j) {
            isp[i * pr[j]] = 1;
            if (i % pr[j] == 0) break;
        }
    }
}
int ok = 0;
int Visit[N];
void dfs(int x, int y) {
    if (ok) return;
    if (x == n + 1) {
        ok = 1;
        return;
    }
    for (int i = 1; i <= n * n; ++i)
        if (!Visit[i]) {
            Visit[i] = 1;
            mp[x][y] = i;
            int wrong = 0;
            if (x != 1) {
                int now = mp[x][y] + mp[x - 1][y];
                if (!isp[now]) wrong = 1;
            }
            if (y != 1) {
                int now = mp[x][y] + mp[x][y - 1];
                if (!isp[now]) wrong = 1;
            }
            if (!wrong) {
                int nx = x, ny = y + 1;
                if (ny > n) ny -= n, ++nx;
                dfs(nx, ny);
                if (ok) return;
            }
            Visit[i] = 0;
        }
}
int solve() {
    cin >> n;
    vector<int> div3[2];
    for (int i = 3; i <= n * n; i += 3)
        div3[i & 1].emplace_back(i);
    if (n % 2 == 0) {
        if (min(div3[0].size(), div3[1].size()) >= n) {
            for (int i = 1; i <= n; ++i) {
                int key = div3[0].back();
                div3[0].pop_back();
                vis[key] = 1;
                mp[n / 2][i] = key;
            }
            for (int i = 1; i <= n; ++i) {
                int key = div3[1].back();
                div3[1].pop_back();
                vis[key] = 1;
                mp[n / 2 + 1][i] = key;
            }
            vector<int> v;
            int now = 2, fail = 0;
            for (int i = 1; i <= n / 2 - 1; ++i)
                for (int j = 1; j <= n; ++j) {
                    while (vis[now]) now += 2;
                    if (now > n * n) {
                        fail = 1;
                        break;
                    }
                    mp[i][j] = now;
                    now += 2;
                }
            now = 1;
            for (int i = n / 2 + 2; i <= n; ++i)
                for (int j = 1; j <= n; ++j) {
                    while (vis[now]) now += 2;
                    if (now > n * n) {
                        fail = 1;
                        break;
                    }
                    mp[i][j] = now;
                    now += 2;
                }
            if (fail) {
                dfs(1, 1);
                for (int i = 1; i <= n; ++i, cout << '\n')
                    for (int j = 1; j <= n; ++j)
                        cout << mp[i][j] << ' ';
            } else {
                for (int i = 1; i <= n; ++i, cout << '\n')
                    for (int j = 1; j <= n; ++j)
                        cout << mp[i][j] << ' ';
            }
        } else {
            dfs(1, 1); assert(ok);
            for (int i = 1; i <= n; ++i, cout << '\n')
                for (int j = 1; j <= n; ++j)
                    cout << mp[i][j] << ' ';
        }
    } else {
        if (min(div3[0].size(), div3[1].size()) >= n) {
            int x = n / 2 + 1, y = 1, now = (x - 1) * n + 1;
            while (now < n * n / 2 + 1)
                ++now, ++y;
            assert(y <= n);
            for (int i = 1; i < y; ++i) {
                mp[n / 2 + 1][i] = div3[0].back();
                vis[div3[0].back()] = 1;
                div3[0].pop_back();
                mp[n / 2 + 2][i] = div3[1].back();
                vis[div3[1].back()] = 1;
                div3[1].pop_back();
            }
            for (int i = y; i <= n; ++i) {
                mp[n / 2][i] = div3[0].back();
                vis[div3[0].back()] = 1;
                div3[0].pop_back();
                mp[n / 2 + 1][i] = div3[1].back();
                vis[div3[1].back()] = 1;
                div3[1].pop_back();
            }
            { int now = 2, fail = 0;
            for (int i = 1; i < n / 2; ++i)
                for (int j = 1; j <= n; ++j) {
                    while (vis[now]) now += 2;
                    mp[i][j] = now;
                    if (now > n * n) {
                        fail = 1;
                        break;
                    }
                    now += 2;
                }
            for (int i = 1; i < y; ++i) {
                while (vis[now]) now += 2;
                mp[n / 2][i] = now;
                if (now > n * n) {
                    fail = 1;
                    break;
                }
                now += 2;
            }
            now = 1;
            for (int i = n / 2 + 3; i <= n; ++i)
                for (int j = 1; j <= n; ++j) {
                    while (vis[now]) now += 2;
                    mp[i][j] = now;
                    if (now > n * n) {
                        fail = 1;
                        break;
                    }
                    now += 2;
                }
            for (int i = y; i <= n; ++i) {
                while (vis[now]) now += 2;
                mp[n / 2 + 2][i] = now;
                if (now > n * n) {
                    fail = 1;
                    break;
                }
                now += 2;
            }
            if (fail) {
                dfs(1, 1);
                for (int i = 1; i <= n; ++i, cout << '\n')
                    for (int j = 1; j <= n; ++j)
                        cout << mp[i][j] << ' ';
            } else {
                for (int i = 1; i <= n; ++i, cout << '\n')
                    for (int j = 1; j <= n; ++j)
                        cout << mp[i][j] << ' ';
            } }
        } else {
            dfs(1, 1);
            for (int i = 1; i <= n; ++i, cout << '\n')
                for (int j = 1; j <= n; ++j)
                    cout << mp[i][j] << ' ';
        }
    }
    return 0;
}
signed main() {
    srand(time(0));
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    sieve();
    return solve();
}
```

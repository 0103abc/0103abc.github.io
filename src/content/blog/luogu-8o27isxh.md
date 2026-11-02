---
title: "P3272 [SCOI2011] 地板 题解"
date: "2025-04-16T00:51:13.000Z"
link: "luogu-8o27isxh"
categories: ["题解"]
tags: ["洛谷", "动态规划", "状态压缩"]
draft: false
---

插头 dp 入门题，（建议先做这题然后再做 ~~5066~~ 5056）。仍然是套路的搞一个轮廓线然后按照顺序处理每一个轮廓线打折的地方。假设当前枚举到 $(i,j)$ 格子，左插头为 $p$，上插头为 $q$。

这里定义插头 $x$ 的状态：

+ $x=0$，表示该方向无插头。
+ $x=1$，表示该方向插头还没有打折。
+ $x=2$，表示该方向插头已经打折了。

那么开始分类讨论（第 $i$ 条需要满足其自身成立且 $j\in [1,i)$ 使得第 $j$ 条不成立才会执行）：

+ $(i,j)$ 位置为障碍，则该位置不能被覆盖，必须满足 $x=0,y=0$ 才可转移，转移保留原来的状态即可。
+ $x=0,y=0$，则可以 $(i,j)$ 单独向右延申，单独向下延申，以当前结点为支点同时向右下两个方向延申三种转移，分类在轮廓线上更新即可。
+ $x=0,y=1$，则其上面已经有一个没有打折过的转移了，可以继续往下面转移，也可以打一下折往右边转移，同样在轮廓线上更新即可。
+ $x=0,y=2$，则其上面已经有一个打过折的转移了，可以在 $(i,j)$ 点直接停下，也可以继续往下延申，同样在轮廓线上更新即可。
+ $x=1,y=0$，则其左面已经有一个没有打过折的转移了，可以继续往右面转移，也可以打一下折往下面转移，同样在轮廓线上更新即可。
+ $x=1,y=1$，则其上面和左面同时都有一个未打过折的转移，那么其在 $(i,j)$ 相遇直接合并状态以 $(i,j)$ 为支点形成一个满血的 L，在轮廓线上删去这两个插头即可。
+ $x=1,y=2$，十分不合法。
+ $x=2,y=0$，则其左面已经有一个打过折的转移了，可以在 $(i,j)$ 点直接停下，也可以继续往左延申，同样在轮廓线上更新即可。
+ $x=2,y=1$，十分不合法。
+ $x=2,y=2$，十分不合法。

直接暴力分讨上面所有的转移情况即可。

```cpp
// #pragma GCC optimize(3,"Ofast","inline","unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/rope>
#define int long long
using namespace std;
const int N = 400010;
const int inf = 2e9;
const int mod = 20110520;
using ull = unsigned long long;
template<class _T>
using treap = __gnu_pbds::tree<_T, __gnu_pbds::null_type, less_equal<_T>, __gnu_pbds::rb_tree_tag, __gnu_pbds::tree_order_statistics_node_update>;
using POD = pair<double, double>;
template<const signed _N, const signed _M>
struct HashTable {
    int idx, ID[_M], sum[_M], h[_N], ne[_M];
    void Mahiro() {
        idx = 0, memset(h, -1, sizeof h);
    }
    void ins(int x, int val) {
        int id = x % _N;
        for (int i = h[id]; ~i; i = ne[i])
            if (ID[i] == x) {(sum[i] += val) %= mod; return;}
        ne[++idx] = h[id], h[id] = idx, ID[idx] = x, sum[idx] = val;
    }
    int query(int x) {
        int id = x % _N;
        for (int i = h[id]; ~i; i = ne[i])
            if (ID[i] == x) return sum[i];
        return 0;
    }
};
template<const signed _N, const signed _M>
void swp(HashTable<_N, _M> &a, HashTable<_N, _M> &b) {
    swap(a.idx, b.idx);
    for (int i = 0; i < _M; ++i)
        swap(a.ID[i], b.ID[i]), swap(a.sum[i], b.sum[i]), swap(a.ne[i], b.ne[i]);
}
inline int getpos(int i, int j) {
    return i >> (j + j - 2) & 3;
}
inline int modpos(int i, int j, int k) {
    return i ^ (getpos(i, j) << (j + j - 2)) ^ (k << (j + j - 2));
}
HashTable<289063, N*2> ht[2];
inline int getl(int i, int j, int m) {
    int cnt = 0;
    for (int k = j; k; --k) {
        int o = getpos(i, k);
        if (o == 1) --cnt;
        else if (o == 2) ++cnt;
        if (!cnt) return k;
    } return -1;
}
inline int getr(int i, int j, int m) {
    int cnt = 0;
    for (int k = j; k <= m + 1; ++k) {
        int o = getpos(i, k);
        if (o == 1) ++cnt;
        else if (o == 2) --cnt;
        if (!cnt) return k;
    } return -1;
}
char s[150][150], t[150][150];
signed main() {
    // freopen("debug.err", "w", stderr);
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    srand(time(0));
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j) cin >> s[i][j];
    if (n < m) {
        for (int i = 1; i <= n; ++i)
            for (int j = 1; j <= m; ++j) t[i][j] = s[i][j];
        for (int i = 1; i <= m; ++i)
            for (int j = 1; j <= n; ++j) s[i][j] = t[j][i];
        n ^= m ^= n ^= m;
    }
    int tx = 0, ty = 0;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j)
            if (s[i][j] != '*') tx = i, ty = j;
    // cout << "End " << tx << ' ' << ty << '\n';
    if (!tx && !ty) {
        cout << "1\n";
        return 0;
    }
    for (int o = 0; o < 2; ++o) ht[o].Mahiro();
    ht[0].ins(0, 1);
    int pre = 0, nxt = 1, sum = 0;
    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            for (int k = 1; k <= ht[pre].idx; ++k) {
                const int state = ht[pre].ID[k], dp = ht[pre].sum[k];
                int p = getpos(state, j), q = getpos(state, j + 1);
                // cerr << "Wa " << i << ' ' << j << ' ' << k << ' ' << p << ' ' << q << ' ' << dp << '\n';
                if (s[i][j] == '*') {
                    if (!p && !q) ht[nxt].ins(state, dp);
                } else {
                    if (!p && !q) {
                        if (j < m && s[i][j + 1] != '*') ht[nxt].ins(modpos(state, j + 1, 1), dp);
                        if (i < n && s[i + 1][j] != '*') ht[nxt].ins(modpos(state, j, 1), dp);
                        if (i < n && j < m && s[i + 1][j] != '*' && s[i][j + 1] != '*') ht[nxt].ins(modpos(modpos(state, j, 2), j + 1, 2), dp);
                    } else if (!p && q == 1) {
                        if (j < m && s[i][j + 1] != '*') ht[nxt].ins(modpos(state, j + 1, 2), dp);
                        if (i < n && s[i + 1][j] != '*') ht[nxt].ins(modpos(modpos(state, j, 1), j + 1, 0), dp);
                    } else if (!p && q == 2) {
                        if (i == tx && j == ty) sum = (sum + dp) % mod;
                        else if (i < n && s[i + 1][j] != '*') ht[nxt].ins(modpos(modpos(state, j, 2), j + 1, 0), dp);
                        ht[nxt].ins(modpos(state, j + 1, 0), dp);
                    } else if (p == 1 && !q) {
                        if (i < n && s[i + 1][j] != '*') ht[nxt].ins(modpos(state, j, 2), dp);
                        if (j < m && s[i][j + 1] != '*') ht[nxt].ins(modpos(modpos(state, j, 0), j + 1, 1), dp);
                    } else if (p == 1 && q == 1) {
                        if (i == tx && j == ty) sum = (sum + dp) % mod;
                        ht[nxt].ins(modpos(modpos(state, j, 0), j + 1, 0), dp);
                    } else if (p == 2 && !q) {
                        if (i == tx && j == ty) sum = (sum + dp) % mod;
                        else if (j < m && s[i][j + 1] != '*') ht[nxt].ins(modpos(modpos(state, j + 1, 2), j, 0), dp);
                        ht[nxt].ins(modpos(state, j, 0), dp);
                    }
                }
            }
            ht[pre].Mahiro();
            pre ^= nxt ^= pre ^= nxt;
        }
        for (int k = 1; k <= ht[pre].idx; ++k) {
            int state = ht[pre].ID[k], dp = ht[pre].sum[k];
            if (!getpos(state, m + 1)) ht[nxt].ins(state << 2, dp);
        }
        ht[pre].Mahiro();
        pre ^= nxt ^= pre ^= nxt;
    }
    cout << sum << '\n';
    return 0;
}
// 喵喵

```

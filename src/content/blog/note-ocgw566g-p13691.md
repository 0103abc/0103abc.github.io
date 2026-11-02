---
title: "P13691 [CEOI 2025] highest 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p13691"
categories: ["题解"]
tags: ["洛谷", "算法思想", "倍增"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P13691).
:::

:::info[Solution]{open}
感觉是比较套路的题。考虑用两个倍增数组维护答案，设 $f_{i,j}$ 表示从 $i$ 位置出发，花费 $2^j$ 代价能到达的最远位置，$g_{i,j}$ 表示从 $i$ 位置出发，花费 $2^j-1$ 代价能到达的最远位置。初始条件显然是 $f_{i,0}=\min(n-1,i+v_i),g_{i,0}=i$。倍增过程需要讨论一下是否经过了代价为 $2^{j-1}$ 的时刻，而且复合倍增状态的过程需要做一点简单的讨论。

询问的时候直接倍增然后同样复合状态即可。

总时间复杂度为 $O(n\log n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
#include <bits/stdc++.h>

using namespace std;

constexpr int N = 500010;
int lg[N], a[N], b[N], st[N][20], st2[N][20], id[N][20], id2[N][20];

inline int qry(int l, int r) {
    int lgx = lg[r - l + 1];
    if (a[id[l][lgx]] > a[id[r - (1 << lgx) + 1][lgx]]) return id[l][lgx];
    return id[r - (1 << lgx) + 1][lgx];
}

inline int qry2(int l, int r) {
    int lgx = lg[r - l + 1];
    if (b[id2[l][lgx]] > b[id2[r - (1 << lgx) + 1][lgx]]) return id2[l][lgx];
    return id2[r - (1 << lgx) + 1][lgx];
}

inline int Qry(int l, int r, int k) {
    return max(st[qry(l, r)][k], st[qry2(l, r)][k]);
}

inline int Qry2(int l, int r, int k) {
    return max({r, st2[qry(l, r)][k], st2[qry2(l, r)][k]});
}

std::vector<int> solve(std::vector<int> &v, std::vector<int> &w, std::vector<std::pair<int,int>> &queries) {
    int n = v.size();
    for (int i = 1; i <= n; ++i) a[i] = min(n, v[i - 1] + i), b[i] = min(n, w[i - 1] + i);
    for (int i = 1; i <= n; ++i) st[i][0] = a[i], st2[i][0] = b[i], id[i][0] = id2[i][0] = i;
    lg[0] = -1; for (int i = 1; i <= n; ++i) lg[i] = lg[i >> 1] + 1;
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= n - (1 << i) + 1; ++j) {
            if (a[id[j][i - 1]] > a[id[j + (1 << (i - 1))][i - 1]]) id[j][i] = id[j][i - 1];
            else id[j][i] = id[j + (1 << (i - 1))][i - 1];
            if (b[id2[j][i - 1]] > b[id2[j + (1 << (i - 1))][i - 1]]) id2[j][i] = id2[j][i - 1];
            else id2[j][i] = id2[j + (1 << (i - 1))][i - 1];
        }
    for (int i = 1; i <= n; ++i) st[i][0] = a[i], st2[i][0] = i, st[i][1] = max(b[i], a[qry(i, a[i])]), st2[i][1] = a[i];
    for (int i = 2; i < 20; ++i)
        for (int j = 1; j <= n; ++j) {
            st[j][i] = max(Qry(j, st[j][i - 1], i - 1), Qry2(j, b[qry2(j, st2[j][i - 1])], i - 1));
            st2[j][i] = max(Qry(j, st2[j][i - 1], i - 1), Qry2(j, st[j][i - 1], i - 1));
        }
    vector<int> result;
    for (auto &[l, r] : queries) {
        ++l, ++r;
        if (r <= a[l]) {
            if (l == r) result.emplace_back(0);
            else result.emplace_back(1);
        } else {
            int cnt = 1, u = a[l], v = l;
            for (int i = 19; ~i; --i) {
                int pos = max(Qry(l, u, i), Qry2(l, b[qry2(l, v)], i));
                if (pos < r) cnt += (1 << i), v = max(Qry(l, v, i), Qry2(l, u, i)), u = pos;
            }
            result.emplace_back(cnt + 1);
        }
    }
    return result;
}

// signed main() {
//     vector<int> result = solve({2, 3, 1, 1, 1, 1, 2}, {3, 4, 1, 2, 1, 2, 2}, {{0, 4}, {0, 5}, {0, 6}});
//     cout << "out: ";
//     for (int &i : result) cout << i << ' ';
//     cout << '\n';
// }
```
:::

难度：紫-

鲜活指数：6

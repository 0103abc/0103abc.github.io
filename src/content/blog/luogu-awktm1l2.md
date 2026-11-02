---
title: "CF97D Robot in Basement 题解"
date: "2025-02-25T04:12:13.000Z"
link: "luogu-awktm1l2"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "模拟"]
draft: false
---

直接暴力模拟时间复杂度为 $O(nml)$，显然过不去。因此考虑优化。发现若两个机器人移动到同一个位置，那么她们之后移动的状态也必然完全相同，可以合并，即只需要记录某一个位置是否存在机器人即可，不需要计数。因此考虑到用 bitset 优化，记录终止状态即只有 `E` 位置有机器人，所有机器人可在的位置集合 `rob`，当前所有机器人所在位置集合 `nrb`，机器人不能走到的位置集合 `blk`。循环枚举每一个操作，若某一个时刻第一次发现 `nrb == E` 表达式成立，则直接输出当前执行的操作数作为前缀的长度即可。否则，分类讨论四个方向，用 bitset 暴力模拟机器人会移动到的位置即可。时间复杂度为 $O(\frac{nml}\omega)$，具体参见代码。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
// #define int long long
using namespace std;
const int N = 155;
const int mod = 1e9 + 7;
char s[N][N];
int id[N][N], idx;
bitset<N * N> block, rob;
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int n, m, l, ex = -1, ey = -1;
    cin >> n >> m >> l;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j) id[i][j] = ++idx;
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j) {
            cin >> s[i][j];
            if (s[i][j] == '#') block[id[i][j]] = 1;
            else rob[id[i][j]] = 1;
            if (s[i][j] == 'E') ex = i, ey = j;
        }
    bitset<N * N> Final; Final[id[ex][ey]] = 1;
    string op; cin >> op;
    auto nrb = rob;
    for (int i = 0; i < op.size(); ++i) {
        if (nrb == Final) {
            cout << i << '\n';
            return 0;
        }
        if (op[i] == 'L') {
            nrb = ((nrb >> 1) & rob) | (nrb & (block << 1));
        } else if (op[i] == 'R') {
            nrb = ((nrb << 1) & rob) | (nrb & (block >> 1));
        } else if (op[i] == 'U') {
            nrb = ((nrb >> m) & rob) | (nrb & (block << m));
        } else {
            nrb = ((nrb << m) & rob) | (nrb & (block >> m));
        }
    }
    if (nrb == Final) {
        cout << op.size() << '\n';
    } else {
        cout << "-1\n";
    }
    return 0;
}
```

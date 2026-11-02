---
title: "CF1796D Maximum Subarray 题解"
date: "2024-10-22T11:39:25.000Z"
link: "luogu-f8r7f7yk"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "线性动态规划"]
draft: false
---

简单题，考虑简单 dp。发现 $k$ 很小，因此设 $f_{i,j,0/1}$ 表示前 $i$ 个元素，修改了 $j$ 个位置，当前位置不选 / 必选，最大子段和的值。转移类似于普通的 1-D 最大子段和。具体见代码。

```cpp
#pragma GCC optimize(3)
#include <bits/stdc++.h>
#define eb emplace_back
#define int long long
using namespace std;
const int N = 200100;
int f[N][22][2], a[N];
signed main() {
    int T;
    cin >> T;
    while (T--) {
        int n, k, x;
        cin >> n >> k >> x;
        for (int i = 1; i <= n; ++i) {
            cin >> a[i];
            a[i] -= x;
        }
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j <= min(i, k); ++j) {
                f[i][j][0] = f[i][j][1] = 0;
            }
        }
        x <<= 1;
        int mx = 0;
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j <= min(i, k); ++j) {
                if (i != j) {
                    f[i][j][0] = max({a[i], f[i - 1][j][0] + a[i], f[i - 1][j][1] + a[i]});
                }
                if (j) {
                    f[i][j][1] = max({a[i] + x, f[i - 1][j - 1][0] + a[i] + x, f[i - 1][j - 1][1] + a[i] + x});
                }
                if (k - j <= n - i) {
                    mx = max({mx, f[i][j][0], f[i][j][1]});
                }
            }
        }
        cout << mx << '\n';
    }
    return 0;
}

/*



*/
```

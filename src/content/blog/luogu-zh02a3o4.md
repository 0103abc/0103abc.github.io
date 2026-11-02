---
title: "CF1839E Decreasing Game 题解"
date: "2025-02-22T11:57:52.000Z"
link: "luogu-zh02a3o4"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "博弈"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/zh02a3o4)。

容易观察得出后手必胜的充要条件是 $a$ 序列存在一个子序列 $b$ 使得 $2\sum b_i=\sum a_i$。这个部分可以直接 $O(n^3)$ 暴力求解。

证明的话：如果可以划分出这样的一个子序列 $b$ 那么后手可以和先手对称选取，因为两组中减去的数的和相同，而两组的和也相同，所以最终两组的和必然一起被减到 $0$。此时后手必胜。

否则用同样的思想可以得到，若不满足条件则最终序列必然只剩下一个数（不可能最后所有的数被消除），此时先手必胜。而若初始不满足条件则执行多少次操作都不会满足条件，所以这样的情况必然是先手获胜。因此结论得证。

那么分类讨论，若先（后）手必胜，则她们的策略分别是什么。

I. 若先手必胜。

此时先手随便选就行了。总有一步后手会无路可走然后先手获胜。

II. 若后手必胜

在 $O(n^3)$ 背包的时候记录一下每一个数在哪一组，然后若先手选了一组中的数，后手在另一组中任意选取非 $0$ 数即可。

代码，十分容易实现。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
int f[310 * 310], a[310], pre[310 * 310], bel[310];
signed main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    f[0] = 1;
    int all = accumulate(a + 1, a + n + 1, 0ll);
    for (int i = 1; i <= n; ++i)
        for (int j = all; j >= a[i]; --j)
            if (f[j - a[i]] && !f[j]) f[j] = 1, pre[j] = i;
    if (all % 2 == 1 || !f[all / 2]) {
        cout << "First" << endl;
        int cnt = n;
        while (1) {
            for (int i = 1; i <= n; ++i)
                if (a[i] > 0) {
                    cout << i << endl;
                    int o; cin >> o;
                    if (!o) return 0;
                    int v = min(a[i], a[o]);
                    a[i] -= v, a[o] -= v;
                    break;
                }
        }
    } else {
        cout << "Second" << endl;
        int now = all / 2;
        while (now) {
            int key = pre[now];
            now -= a[key];
            bel[key] = 1;
        }
        while (1) {
            int o; cin >> o;
            if (!o) return 0;
            if (bel[o] == 1) {
                for (int i = 1; i <= n; ++i)
                    if (bel[i] != 1 && a[i]) {
                        cout << i << endl;
                        int v = min(a[i], a[o]);
                        a[i] -= v, a[o] -= v;
                        break;
                    }
            } else {
                for (int i = 1; i <= n; ++i)
                    if (bel[i] != 0 && a[i]) {
                        cout << i << endl;
                        int v = min(a[i], a[o]);
                        a[i] -= v, a[o] -= v;
                        break;
                    }
            }
        }
    }
    return 0;
}
```

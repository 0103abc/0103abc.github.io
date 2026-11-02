---
title: "CF1617D1 Too Many Impostors (easy version) 题解"
date: "2024-10-23T10:59:54.000Z"
link: "luogu-f38mlh4p"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "交互"]
draft: false
---

考虑对于四个人 $a$，$b$，$c$，$d$。两次询问分别询问 $a,b,c$ 和 $b,c,d$。若两次询问的结果不一样，则说明 $b$ 和 $c$ 一定不同类别。找出这样的一组 $b$ 和 $c$ 之后将其和所有其他人做询问，就可以得到其他人的类别。最后任选一个已经确定的好人和一个已经确定的坏人，就可以询问出 $b$ 的类别，那么 $c$ 的类别也就确定了。具体见代码。

```cpp
#include <bits/stdc++.h>
#define eb emplace_back
#define int long long
using namespace std;
const int N = 1000100, mod = 998244353;
int a[N], res[N];
signed main() {
    int T;
    cin >> T;
    while (T--) {
        int n;
        cin >> n;
        for (int i = 1; i <= n - 2; ++i) {
            cout << "? " << i << ' ' << i + 1 << ' ' << i + 2 << endl;
            int o ; cin >> o ; 
            res[i] = o;
        }
        int id = -1;
        for (int i = 1; i < n - 2; ++i) {
            if (res[i] != res[i + 1]) {
                id = i;
                break;
            }
        }
        // id + 1, id + 2
        vector<int> good, bad;
        for (int i = 1; i <= n; ++i) {
            if (i != id + 1 && i != id + 2) {
                cout << "? " << i << ' ' << id + 1 << ' ' << id + 2 << endl;
                int o ; cin >> o ; 
                if (o == 1) {
                    good.eb(i);
                } else {
                    bad.eb(i);
                }
            }
        }
        cout << "? " << good[0] << ' ' << bad[0] << ' ' << id + 1 << endl;
        int o ; cin >> o;
        if (o == 1) {
            good.eb(id + 1);
            bad.eb(id + 2); 
        } else {
            good.eb(id + 2);
            bad.eb(id + 1); 
        }
        cout << "! " << bad.size() << ' ' ;
        for (auto &x : bad) {
            cout << x << ' ';
        }
        cout << endl;
    }
    return 0;
}

/*



*/

```

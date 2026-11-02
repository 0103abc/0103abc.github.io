---
title: "CF1780D Bit Guessing Game 题解"
date: "2024-10-23T10:44:14.000Z"
link: "luogu-wbdo1v8y"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "交互"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/wbdo1v8y)。

入门交互。考虑每一次询问出每一个位的值。从低位到高位考虑，若此时当前位的 $1$ 的数量减少 $1$，则说明这一位的值为 $1$，否则直接暴力推算出其下一个 $1$ 的位置。

交互次数为 $\log$ 级别，可以通过。

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
        int cnt, A = 0;
        cin >> cnt;
        int i = 0;
        while (1) {
            cout << "- " << (1ll << i) << endl;
            int x;
            cin >> x;
            for (int j = 0; j < x - cnt + 1; ++j) {
                ++i;
            }
            A |= (1ll << i);
            if (x == i) {
                break;
            }
            cnt = x;
        }
        cout << "! " << A << endl;
    }
    return 0;
}

/*



*/
 
```

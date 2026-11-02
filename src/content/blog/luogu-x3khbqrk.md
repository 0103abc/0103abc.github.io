---
title: "P11856 [CSP-J 2022 山东] 吟诗 题解"
date: "2025-03-05T14:20:13.000Z"
link: "luogu-x3khbqrk"
categories: ["题解"]
tags: ["洛谷", "动态规划", "基础算法", "前缀和"]
draft: false
---

直接硬嗯是困难的，因此考虑正难则反计算有多少组不合法的方案数，然后用总方案数减去之。总方案数是容易计算的，显然就是 $10^n$。

考虑 dp 计算出不合法方案数。看到 $x+y+z\le 17$ 想到状压。设 $f_{i,j}$ 表示当前考虑了前 $i$ 个数，以第 $i$ 个数为结尾的所有后缀可以表示出的值的状态为 $j$ 不合法组数的方案数。这样做的正确性在于合法状态不能在后缀部分添加一段数使得其再次变得不合法。

直接做第二维很爆炸，但是 $x+y+z\le 17$ 因此只需要记录 $17$ 以内的数是否可以存储出即可。此时状态的空间复杂度正确。考虑转移。

对于一个状态 $f_{i-1,j}$，考虑枚举 $a_i=k$，那么 $j$ 集合内所有可以表示的元素的值都会增加 $k$，只需要把 $j$ 整体左移 $k$ 位，然后单独添加出只包含 $i$ 元素的后缀和 $k$ 即可。设这个状态为 $S$，则转移即为：$f_{i,S}\leftarrow f_{i-1,j}$。

答案计算就是 $10^n-\sum\limits_jf_{n,j}$，这个部分比较显然。总时间复杂度为 $O(n2^{x+y+z}\omega)$，其中 $\omega$ 为 $a$ 序列中元素的值域即 $10$，可以通过。

```cpp
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 500010;
const int mod = 998244353;
int f[44][1 << 18];
inline void add(int &x, int v) {
    x = (x + v) % mod;
}
signed main() {
    int n, x, y, z;
    cin >> n >> x >> y >> z;
    f[0][0] = 1;
    for (int i = 1; i <= n; ++i)
        for (int j = 0; j < (1 << (x + y + z)); ++j)
            for (int k = 1; k <= 10; ++k) {
                int state = ((j << k) | (1 << (k - 1))) & ((1 << (x + y + z)) - 1);
                if ((~state >> (z - 1) & 1) || (~state >> (y + z - 1) & 1) || (~state >> (x + y + z - 1) & 1)) add(f[i][state], f[i - 1][j]);
            }
    int cnt = 1;
    for (int i = 0; i < n; ++i) cnt = cnt * 10 % mod;
    for (int i = 0; i < (1 << (x + y + z)); ++i) cnt = (cnt + mod - f[n][i]) % mod;
    cout << cnt << '\n';
    return 0;
}
```

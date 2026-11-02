---
title: "CF126D Fibonacci Sums 题解"
date: "2025-02-14T15:54:05.000Z"
link: "luogu-74gbaehz"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "动态规划"]
draft: false
---

首先要知道 [Zeckendorf's Theorem](https://en.wikipedia.org/wiki/Zeckendorf%27s_theorem)，即任何一个正整数都可以被表示为若干个不连续的斐波那契数的和。更确切的来说，任意正整数 $n$，都可以找到至少一个单调递增的序列 $a_1,a_2,\ldots,a_k$ 使得 $\forall i\in[1,k),a_{i+1}-a_i\ge 2$，且 $\sum\limits_{i=1}^k F_{a_i}=n$，其中 $F_i$ 为 Fibonacci 数的第 $i$ 项。

然后可以直接贪心的分解 Fibonacci 数，得到一个 Fibonacci 生成序列，设这个序列的元素从小到大分别为 $a_1,a_2,\ldots,a_k$，则可以知道，其实只有下面三种情况是合法的转移：

+ 选择当前数
+ 选择当前数的前一个
+ 选择当前数的前一个的前一个

可以证明如果当前连续三个数都不选，那么剩下的数一定无法凑出剩余的 $n$ 的部分。证明显然，直接套用 Fibonacci 数的基础性质即可。

然后考虑一个简单的 dp：设 $f_{i,0/1}$ 表示前 $i$ 项中，第 $i$ 项不选 / 选，方案数是多少。那么显然若选择第 $i$ 项，则上一项选择 / 不选择无所谓，即 $f_{i,1}\leftarrow f_{i-1,1}+f_{i-1,0}$，如果不选第 $i$ 项，则若上一个不选，则上上个就必须选。同样的套路分两类讨论答案即可。可以线性转移，具体见代码。时间复杂度为 $O(n)$，可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 300010;
int a[N], F[N], f[N][2];
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int T;
    cin >> T;
    F[1] = 1, F[2] = 2;
    for (int i = 3; i <= 90; ++i) F[i] = F[i - 1] + F[i - 2];
    while (T--) {
        int n, idx = 0;
        cin >> n;
        for (int i = 90; i; --i)
            if (n >= F[i]) n -= F[i], a[++idx] = i;
        sort(a + 1, a + idx + 1);
        f[1][1] = 1, f[1][0] = (a[1] - 1) / 2;
        for (int i = 2; i <= idx; ++i) {
            f[i][1] = f[i - 1][0] + f[i - 1][1];
            f[i][0] = f[i - 1][0] * ((a[i] - a[i - 1]) / 2) + f[i - 1][1] * ((a[i] - a[i - 1] - 1) / 2);
        }
        cout << f[idx][0] + f[idx][1] << '\n';
    }
    return 0;
}


```

---
title: "AT_agc029_b [AGC029B] Powers of two 题解"
date: "2025-10-04T13:15:48.000Z"
link: "luogu-z9kqu9wk"
categories: ["题解"]
tags: ["AtCoder", "基础算法", "贪心", "排序", "模拟"]
draft: false
---

tags：贪心

首先将数组升序排序。然后考虑对于每个位置 $i$，对于所有比其靠前的位置 $j$，最多存在一个 $j$ 使得 $a_i+a_j$ 是 $2$ 的幂次。证明显然。

然后再从大到小考虑，对每个数 $a_i$ 而言，若其可以和 $a_j$ 匹配（$j<i$），则若其放弃了匹配机会，则其再也无法和其他数进行匹配。而放弃这个匹配机会后 $a_j$ 最多能贡献 $1$ 的答案，不如和 $a_i$ 匹配以确保贡献 $1$ 的答案。因此直接贪心的正确性有保障。

直接模拟时间复杂度为 $O(n^2)$，考虑优化：容易观察到在值域范围内 $2$ 的幂次只有 $O(\log V)$ 个，因此想到直接从大到小暴力枚举所有 $2$ 的幂次，然后用双指针扫描贪心的选出尽可能多的组合，时间复杂度为 $O(n\log V)$ 可以通过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
const int inf = 1e18;
const int mod = 998244353;

inline int power(int a, int b, int c)
{
    int ans = 1;
    while (b)
    {
        if (b & 1)
            ans = ans * a % c;
        a = a * a % c, b >>= 1;
    }
    return ans;
}
inline int inversion(int x) { return power(x, mod - 2, mod); }

int res[N], a[N];

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    int n, cnt = 0;
    cin >> n;
    for (int i = 1; i <= n; ++i)
        cin >> a[i];
    sort(a + 1, a + n + 1);
    for (int i = 30; i; --i)
    {
        int l = 1, r = n;
        while (l <= n && a[l] == -1)
            ++l;
        while (r >= 1 && a[r] == -1)
            --r;
        if (!r)
            break;
        while (l < r)
        {
            while (l < r && a[l] == -1)
                ++l;
            while (l < r && a[r] == -1)
                --r;
            if (l >= r)
                break;
            if (a[l] + a[r] == (1 << i))
                ++cnt, a[l] = a[r] = -1, ++l, --r;
            else if (a[l] + a[r] < (1 << i))
                ++l;
            else
                --r;
        }
    }
    cout << cnt << '\n';
    return 0;
}
```

---
title: "CF1789F Serval and Brain Power 题解"
date: "2025-08-20T05:44:25.000Z"
link: "luogu-omo4pkhp"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "算法思想", "分治"]
draft: false
---

对重复次数 $k$ 的值做数据分治。若 $k\ge 5$ 则可以根据鸽巢原理好的公共子序列必然是将序列划分为若干个长度为 $n/k$ 的连续段后某一个连续段的子序列，可以暴力枚举。若 $k\le 3$ 则可以暴力 dp，这里以 $k=3$ 为例：枚举分界点 $p,q$ 然后可以将序列 $a$ 分为 $x,y,z$ 三个序列，那么设 dp 状态为 $f_{i,j,k}$ 表示当前三个序列分别匹配到了 $i,j,k$ 位置，转移就是若 $x_i=y_j=z_k$ 则有转移 $f_{i,j,k}\leftarrow f_{i-1,j-1,k-1}+1$，同时也有转移 $f_{i,j,k}\leftarrow f_{i-1,j,k},f_{i,j-1,k},f_{i,j,k-1}$，时间复杂度为 $O(n^5)$ 但是显然跑不满可以通过。剩下 $k=4$ 的情况，容易发现 $k=4$ 的情况被包含在 $k=2$ 的情况中，因此无需考虑。实现直接把上述两类情况分别实现即可。

代码比较长，但是并不难写。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;

const int N = 100010;
const int inf = 1e18;
const int mod = 1e9 + 7;

int n;
char s[N];

namespace solve_2
{
    int f[85][85];
    char a[85], b[85];
    inline int solve()
    {
        if (n < 2)
            return 0;
        int mx = 0;
        for (int i = 1; i <= n; ++i)
        {
            memset(f, 0, sizeof f);
            int i1 = 0, i2 = 0;
            for (int j = 1; j <= n; ++j)
                ((j <= i) ? a[++i1] : b[++i2]) = s[j];
            for (int i = 1; i <= i1; ++i)
                for (int j = 1; j <= i2; ++j)
                    f[i][j] = (a[i] == b[j]) ? (f[i - 1][j - 1] + 1) : max(f[i - 1][j], f[i][j - 1]);
            mx = max(mx, f[i1][i2]);
        }
        return mx * 2;
    }
}

namespace solve_3
{
    int f[85][85][85];
    char a[85], b[85], c[85];
    inline int solve()
    {
        if (n < 3)
            return 0;
        int mx = 0;
        for (int i = 1; i < n; ++i)
            for (int j = i + 1; j <= n; ++j)
            {
                int i1 = 0, i2 = 0, i3 = 0;
                for (int k = 1; k <= n; ++k)
                    if (k <= i)
                        a[++i1] = s[k];
                    else if (k <= j)
                        b[++i2] = s[k];
                    else
                        c[++i3] = s[k];
                for (int i = 0; i <= i1 + 1; ++i)
                    for (int j = 0; j <= i2 + 1; ++j)
                        for (int k = 0; k <= i3 + 1; ++k)
                            f[i][j][k] = 0;
                for (int i = 1; i <= i1; ++i)
                    for (int j = 1; j <= i2; ++j)
                        for (int k = 1; k <= i3; ++k)
                            if (a[i] == b[j] && b[j] == c[k])
                                f[i][j][k] = f[i - 1][j - 1][k - 1] + 1;
                            else
                                f[i][j][k] = max({f[i - 1][j][k], f[i][j - 1][k], f[i][j][k - 1]});
                mx = max(mx, f[i1][i2][i3]);
            }
        return mx * 3;
    }
}

namespace solve_big
{
    int a[N];
    inline int solve()
    {
        if (n < 5)
            return 0;
        int mx = 0;
        for (int i = 0; i < (1 << (n / 5)); ++i)
        {
            int len = __builtin_popcount(i);
            do
            {
                int idx = 0;
                for (int j = 0; j < n / 5; ++j)
                    if (i >> j & 1)
                        a[++idx] = s[j + 1];
                int cnt = 0, pos = 0;
                for (int j = 1; j <= n; ++j)
                {
                    if (s[j] == a[pos + 1])
                    {
                        ++pos;
                        if (pos == idx)
                            ++cnt, pos = 0;
                    }
                }
                if (cnt > 1)
                    mx = max(mx, cnt * len);
            } while (0);
            do
            {
                int idx = 0;
                for (int j = 0; j < n / 5; ++j)
                    if (i >> j & 1)
                        a[++idx] = s[j + 1 + n / 5];
                int cnt = 0, pos = 0;
                for (int j = 1; j <= n; ++j)
                {
                    if (s[j] == a[pos + 1])
                    {
                        ++pos;
                        if (pos == idx)
                            ++cnt, pos = 0;
                    }
                }
                if (cnt > 1)
                    mx = max(mx, cnt * len);
            } while (0);
            do
            {
                int idx = 0;
                for (int j = 0; j < n / 5; ++j)
                    if (i >> j & 1)
                        a[++idx] = s[j + 1 + n / 5];
                int cnt = 0, pos = 0;
                for (int j = 1; j <= n; ++j)
                {
                    if (s[j] == a[pos + 1])
                    {
                        ++pos;
                        if (pos == idx)
                            ++cnt, pos = 0;
                    }
                }
                if (cnt > 1)
                    mx = max(mx, cnt * len);
            } while (0);
            do
            {
                int idx = 0;
                for (int j = 0; j < n / 5; ++j)
                    if (i >> j & 1)
                        a[++idx] = s[j + 1 + n / 5];
                int cnt = 0, pos = 0;
                for (int j = 1; j <= n; ++j)
                {
                    if (s[j] == a[pos + 1])
                    {
                        ++pos;
                        if (pos == idx)
                            ++cnt, pos = 0;
                    }
                }
                if (cnt > 1)
                    mx = max(mx, cnt * len);
            } while (0);
            do
            {
                int idx = 0;
                for (int j = 0; j < n / 5; ++j)
                    if (i >> j & 1)
                        a[++idx] = s[j + 1 + n / 5];
                int cnt = 0, pos = 0;
                for (int j = 1; j <= n; ++j)
                {
                    if (s[j] == a[pos + 1])
                    {
                        ++pos;
                        if (pos == idx)
                            ++cnt, pos = 0;
                    }
                }
                if (cnt > 1)
                    mx = max(mx, cnt * len);
            } while (0);
            do
            {
                int idx = 0;
                for (int j = 0; j < n / 5; ++j)
                    if (i >> j & 1)
                        a[++idx] = s[n - j];
                reverse(a + 1, a + idx + 1);
                int cnt = 0, pos = 0;
                for (int j = 1; j <= n; ++j)
                {
                    if (s[j] == a[pos + 1])
                    {
                        ++pos;
                        if (pos == idx)
                            ++cnt, pos = 0;
                    }
                }
                if (cnt > 1)
                    mx = max(mx, cnt * len);
            } while (0);
        }
        // cout << "mx = " << mx << '\n';
        return mx;
    }
}

signed main()
{
    // cin.tie(0)->sync_with_stdio(false);
    scanf("%s", s + 1);
    n = strlen(s + 1);
    int buc[26] = {0};
    for (int i = 1; i <= n; ++i)
        ++buc[s[i] - 'a'];
    if (*max_element(buc, buc + 26) == 1)
        cout << 0 << '\n';
    else
        cout << max({*max_element(buc, buc + 26), solve_2::solve(), solve_3::solve(), solve_big::solve()}) << '\n';
    return 0;
}
```

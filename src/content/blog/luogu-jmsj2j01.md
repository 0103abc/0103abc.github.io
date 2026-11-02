---
title: "P10741 [SEERC 2020] Fence Job 题解"
date: "2026-02-08T13:34:49.000Z"
link: "luogu-jmsj2j01"
categories: ["题解"]
tags: ["洛谷", "动态规划", "线性动态规划"]
draft: false
---

笑点解析：不会做

记 $i$ 位置最大可覆盖到的区间范围是 $[l_i,r_i]$。考虑 dp。设 $f_{i,j}$ 表示当前用前 $i$ 个数确定了最后序列前 $j$ 个数的值。转移分为第 $i$ 个数不覆盖 / 用第 $j$ 个数覆盖两种情况，也就是不覆盖：$f_{i,j}\leftarrow f_{i-1,j}$；覆盖：$f_{i,j}\leftarrow f_{i,j-1}$。总时间复杂度为 $O(n^2)$ 可以通过该题。

```cpp line-numbers
namespace Loyalty
{
    int n, f[N][N], L[N], R[N], a[N];
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        cin >> n;
        for_each(a + 1, a + n + 1, [&](auto &input) { cin >> input; });
        for (int i = 1; i <= n; ++i)
            for (L[i] = i; L[i] >= 1 && a[L[i]] >= a[i]; --L[i])
                ;
        for (int i = 1; i <= n; ++i)
            for (R[i] = i; R[i] <= n && a[R[i]] >= a[i]; ++R[i])
                ;
        // cerr << "debug:\n";
        // for (int i = 1; i <= n; ++i)
        //     cerr << i << ": " << L[i] << ' ' << R[i] << '\n';
        f[0][0] = 1;
        for (int i = 1; i <= n; ++i)
            for (int j = 0; j <= n; ++j)
            {
                f[i][j] = f[i - 1][j];
                if (j > L[i] && j < R[i])
                    f[i][j] = (f[i][j] + f[i][j - 1]) % mod;
            }
        cout << f[n][n] << '\n';
    }
} // namespace Loyalty
```

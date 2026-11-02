---
title: "CF1144G Two Merged Sequences 题解"
date: "2026-02-03T08:50:53.000Z"
link: "luogu-trau57mg"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "线性动态规划"]
draft: false
---

难度：$2.5/10$

简单 dp。容易想到设 $f_{i,0/1}$ 表示当前处理了前 $i$ 个数：

+ $0$：当前元素处于递增序列中，递减序列最后一个元素的最大值。
+ $1$：当前元素处于递减序列中，递增序列最后一个元素的最小值。

转移是容易的，分四类讨论当前元素和上一个元素分别位于递增序列 / 递减序列中即可。总时间复杂度为 $O(n)$。

```cpp line-numbers
namespace Loyalty
{
    int a[N];
    struct BIT
    {
        int tree[N];
        inline BIT() { memset(tree, 0, sizeof tree); }
        inline void clr(int x) { for (; x < N; x += (x &- x)) tree[x] = 0; }
        inline void add(int x, int v) { for (; x < N; x += (x &- x)) tree[x] += v; }
        inline int qry(int x) { int s = 0; for (; x; x -= (x &- x)) s += tree[x]; return s; }
        inline int qry(int l, int r) { return qry(r) - qry(l - 1); }
    } fwt;
    int f[N][2], g[N][2], res[N];
    // 0: 单调递增序列 递减序列最后一个元素最大值
    // 1: 单调递减序列 递增序列最后一个元素最小值
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        for_each(a + 1, a + n + 1, [&](auto &input) { cin >> input; });
        f[1][0] = inf, f[1][1] = -inf;
        if (n == 1)
        {
            cout << "Yes\n1\n";
            return;
        }
        int low = *min_element(a + 1, a + n + 1), high = *max_element(a + 1, a + n + 1);
        for (int i = 2; i <= n; ++i)
        {
            f[i][0] = -inf, f[i][1] = inf;
            // 1. 当前元素递增 上一个元素递增
            if (a[i] > a[i - 1])
                f[i][0] = f[i - 1][0], g[i][0] = 0;
            // 2. 当前元素递增 上一个元素递减
            if (a[i] > f[i - 1][1] && f[i][0] < a[i - 1])
                f[i][0] = a[i - 1], g[i][0] = 1;
            // 3. 当前元素递减 上一个元素递减
            if (a[i] < a[i - 1])
                f[i][1] = f[i - 1][1], g[i][1] = 1;
            // 4. 当前元素递减 上一个元素递增
            if (a[i] < f[i - 1][0] && f[i][1] > a[i - 1])
                f[i][1] = a[i - 1], g[i][1] = 0;
        }
        // for (int i = 1; i <= n; ++i)
        //     cerr << "debug: " << f[i][0] << ' ' << f[i][1] << '\n';
        if (f[n][0] >= low && f[n][0] <= high || f[n][1] >= low && f[n][1] <= high)
        {
            cout << "YES\n";
            if (f[n][0] >= low && f[n][0] <= high)
            {
                int x = n, y = 0;
                while (x)
                    res[x] = y, y = g[x--][y];
            }
            else
            {
                int x = n, y = 1;
                while (x)
                    res[x] = y, y = g[x--][y];
            }
            for_each(res + 1, res + n + 1, [&](auto &output) { cout << output << ' '; });
            cout << '\n';
        }
        else
            cout << "NO\n";
    }
}

```

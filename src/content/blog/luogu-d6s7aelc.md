---
title: "CF1582G Kuzya and Homework 题解"
date: "2026-03-16T00:12:12.000Z"
link: "luogu-d6s7aelc"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/d6s7aelc)。

考虑把每个数都分解质因数来统计。枚举右端点 $r$，然后维护一个栈 $stk$ 表示当前有哪些左端点是合法的，$S_i$ 表示若只考虑质因数为 $i$ 的部分有哪些左端点是合法的。则此时若 $i$ 位置对应的字符是 `*`，直接把 $i$ 加入 $S_j$ 和 $stk$ 中即可，否则在 $S_j$ 和 $stk$ 中把 $i$ 对应的质因数抵消掉。统计结束后栈 $stk$ 内的元素数量即为右端点为 $r$ 的合法区间数量。

线性筛出 $\text{spf}_i$ 表示 $i$ 的最小质因数可以做到 $O(n\log V)$ 时间复杂度解决问题。

```cpp line-numbers
namespace Loyalty
{
    int a[N];
    char s[N];
    vector<int> S[N];
    int isp[N], pr[N], idx, minp[N];
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        isp[1] = minp[1] = 1;
        for (int i = 2; i < N; ++i)
        {
            if (!isp[i])
                pr[++idx] = minp[i] = i;
            for (int j = 1; j <= idx && i * pr[j] < N; ++j)
            {
                minp[i * pr[j]] = pr[j], isp[i * pr[j]] = 1;
                if (i % pr[j] == 0)
                    break;
            }
        }
        // cerr << "minp: ";
        // for (int i = 2; i <= 25; ++i)
        //     cout << minp[i] << ' ';
        // cout << '\n';
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i)
            cin >> a[i];
        scanf("%s", s + 1);
        long long res = 0;
        stack<int> stk;
        for (int i = 1; i <= n; ++i)
        {
            stk.emplace(i);
            if (s[i] == '*')
            {
                for (int j = a[i]; j > 1; j /= minp[j])
                    S[minp[j]].emplace_back(i);
            }
            else
            {
                for (int j = a[i]; j > 1; j /= minp[j])
                {
                    while (stk.size() && (S[minp[j]].empty() || stk.top() > S[minp[j]].back()))
                        stk.pop();
                    if (S[minp[j]].size())
                        S[minp[j]].pop_back();
                }
            }
            res += stk.size();
        }
        cout << res << '\n';
    }
} // namespace Loyalty
```

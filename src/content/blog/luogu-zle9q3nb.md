---
title: "P13509 [OOI 2024] Almost Certainly 题解"
date: "2025-10-05T03:23:47.000Z"
link: "luogu-zle9q3nb"
categories: ["题解"]
tags: ["洛谷", "基础算法", "贪心", "排序", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/zle9q3nb)。

注意到题目给出性质 **保证答案必然存在** 以及 $\forall i\in[1,n],b_i\le a_i$，因此考虑利用该性质解题。

考虑到对于所有满足 $a_i=b_i$ 的位置 $i$，不如直接将其匹配掉。此时只会剩下若干个满足 $a_i<b_i$ 的位置。

特判掉此时不存在 $a_i<b_i$ 的位置 $i$ 的情况，然后按 $a_i$ 的值从小到大对二元组 $(a_i,b_i)$ 排序。假设此时选择了 $a_i$ 和 $b_j$ 并将其消去，假设此时可以匹配成功，那么总代价将会减少 $a_i-b_j$。为了让最后的代价和最小，肯定希望让减去的这个代价 $a_i-b_j$ 的值尽量大。因此此时肯定会贪心的让 $i\ge j$。

然后考虑什么时候可以把 $a_i$ 和 $b_j$ 消去然后剩下的匹配。容易想到贪心策略是直接按顺序两两匹配，此时需要满足条件 $b_{j+1}\le a_j,b_{j+2}\le a_{j+1},\ldots,b_i\le a_{i-1}$。于是想到经典套路：把每一个二元组 $(a_i,b_i)$ 看做是一个区间 $[b_i,a_i]$。此时前面给出的条件可以看作是**第 $j$ 个区间到第 $i$ 个区间组成了一个连续段**，而此时 $a_i-b_j$ 的值就是**这个连续段的长度**。为了让这个长度最大，显然只需要找出所有连续段中最长的那一段 $[j,i]$，从序列中删除 $a_i$ 和 $b_j$，剩下的部分按顺序两两匹配为最优解。

此时答案即为 $\sum\limits_{i=1}^m(a_i-b_i)$ 减去最长连续段的长度，直接模拟这个过程可以做到 $O(n^2)$ 求解。

考虑到题目按顺序依次询问了所有的前缀，而从长度为 $i-1$ 的前缀扩展到长度为 $i$ 的前缀，只会增加一个区间 $[b_i,a_i]$，而维护的信息则是连续段。因此想到用类似颜色段均摊的方法维护当前所有的连续段，然后再开一个 `map` 维护当前所有连续段的长度，总时间复杂度为 $O(n\log n)$ 可以通过该题。

代码，应该还是很可读的 >_<

```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
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

int a[N], b[N];

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    int T;
    cin >> T;
    while (T--)
    {
        int n;
        cin >> n;
        for (int i = 1; i <= n; ++i)
            cin >> a[i];
        for (int i = 1; i <= n; ++i)
            cin >> b[i];
        set<pair<int, int>> odt;
        cout << 0 << ' ';
        odt.emplace(b[1], a[1]);
        map<int, int> yhb;
        yhb[a[1] - b[1]] = 1;
        int all = a[1] - b[1];
        for (int i = 2; i <= n; ++i)
        {
            all += a[i] - b[i];
            auto it = odt.lower_bound({b[i], 0});
            int l = b[i], r = a[i];
            while (it != odt.end() && it->first <= a[i] && it->second >= b[i])
                l = min(l, it->first), r = max(r, it->second), ++it;
            it = odt.lower_bound({b[i], 0});
            if (it != odt.begin())
            {
                it = prev(it);
                int ok = 0;
                while (it->first <= a[i] && it->second >= b[i])
                {
                    l = min(l, it->first), r = max(r, it->second);
                    if (it == odt.begin())
                    {
                        ok = 1;
                        break;
                    }
                    --it;
                }
                if (!ok)
                    ++it;
                while (it != odt.end() && it->first <= a[i] && it->second >= b[i])
                {
                    int _l = it->first, _r = it->second;
                    if (!--yhb[_r - _l])
                        yhb.erase(yhb.find(_r - _l));
                    it = odt.erase(it);
                }
            }
            else
            {
                while (it != odt.end() && it->first <= a[i] && it->second >= b[i])
                {
                    int _l = it->first, _r = it->second;
                    if (!--yhb[_r - _l])
                        yhb.erase(yhb.find(_r - _l));
                    it = odt.erase(it);
                }
            }
            ++yhb[r - l];
            odt.emplace(l, r);
            cout << all - yhb.rbegin()->first << ' ';
        }
        cout << '\n';
    }
    return 0;
}
```

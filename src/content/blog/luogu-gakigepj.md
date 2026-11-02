---
title: "CF317B Ants 题解"
date: "2025-08-20T05:50:40.000Z"
link: "luogu-gakigepj"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "枚举"]
draft: false
---

duel 到的，直接切了。观察到对于一个初始的给定位置，其可以扩散到的有蚂蚁的位置数量衰减速度很快，因此考虑直接暴力处理出所有有蚂蚁的位置并存储到一个数组中，然后每一次查询明显在范围之外的直接输出 $0$，可能在范围之内的查表即可。

```cpp
#pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
const int mod = 1e9 + 7;

int mp[4010][4010];

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n, qwq;
    cin >> n >> qwq;
    mp[2000][2000] = n;
    queue<pair<int, int>> q;
    q.emplace(0, 0);
    while (q.size())
    {
        auto [x, y] = q.front();
        q.pop();
        // cerr<<x<<' '<<y<<'\n';
        if (mp[x+2000][y+2000] >= 4)
        {
            int k = mp[x+2000][y+2000] >> 2;
            mp[x-1+2000][y+2000] += k;
            mp[x+1+2000][y+2000] += k;
            mp[x+2000][y-1+2000] += k;
            mp[x+2000][y+1+2000] += k;
            mp[x+2000][y+2000] &= 3;
            q.emplace(x, y - 1);
            q.emplace(x, y + 1);
            q.emplace(x + 1, y);
            q.emplace(x - 1, y);
        }
    }
    while (qwq--)
    {
        int x, y;
        cin >> x >> y;
        if (x >= 2000 || y >= 2000 || x <= -2000 || y <= -2000)
        {
            cout << 0 << '\n';
            continue;
        }
        cout << mp[x+2000][y+2000] << '\n';
    }
    return 0;
}
```

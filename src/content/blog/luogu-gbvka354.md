---
title: "CF1600F Party Organization 题解"
date: "2026-02-02T09:40:08.000Z"
link: "luogu-gbvka354"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/gbvka354)。

知道 Ramsey 数就很简单，注意到 $R(6,3)\le 46$，所以对于 $n\ge 46$ 的情况必然可以构造出一组合法的解，因此直接把 $n$ 对 $50$ 取 $\min$ 然后暴力枚举即可。

```cpp line-numbers
namespace Loyalty
{
    int mp[64][64];
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n, m;
        cin >> n >> m;
        while (m--)
        {
            int a, b;
            cin >> a >> b;
            if (a <= 50 && b <= 50)
                mp[a][b] = mp[b][a] = 1;
        }
        n = min(n, 50ll);
        for (int i = 1; i <= n; ++i)
            for (int j = i + 1; j <= n; ++j)
                for (int k = j + 1; k <= n; ++k)
                    for (int p = k + 1; p <= n; ++p)
                        for (int o = p + 1; o <= n; ++o)
                        {
                            int cnt = mp[i][j] + mp[i][k] + mp[i][p] + mp[i][o] + mp[j][k] + mp[j][p] + mp[j][o] + mp[k][p] + mp[k][o] + mp[p][o];
                            if (cnt == 10 || !cnt)
                            {
                                cout << i << ' ' << j << ' ' << k << ' ' << p << ' ' << o << '\n';
                                return;
                            }
                        }
        cout << -1 << '\n';
    }
}
```

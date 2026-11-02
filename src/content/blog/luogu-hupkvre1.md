---
title: "CF1679F Formalism for Formalism 题解"
date: "2026-03-14T09:28:35.000Z"
link: "luogu-hupkvre1"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "状态压缩"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/hupkvre1)。

题意可以转化为：有多少个数不能通过题目中给出的操作使得自己的值变得比最开始更小。

然后考虑如果前一位填了 $x$，而且前面部分全都是合法的，那么后一位可以填哪些数字。假设这里填写了数字 $y$，则：

+ 如果 $x,y$ 之间不能互相交换，那么很显然可以填写 $y$。
+ 如果 $x,y$ 之间可以互相交换，且 $x>y$，那么很显然不能填写 $y$。
+ 否则考虑交换 $x,y$ 两个位置后，$y$ 可能可以和 $x$ 之前的数继续发生交换，因此 $y$ 能填写当且仅当在 $x$ 的位置填写 $y$ 合法。

然后就可以 dp 了。设 $f_{i,j}$ 表示当前考虑了 $i$ 集合，上一次可以填写的数的集合是 $j$，有多少个合法的前缀数。转移直接枚举下一个位置填的是什么数字即可。最终时间复杂度为 $O(n\omega2^\omega)$，其中 $\omega=10$。

```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    int mp[10][10], f[50010][1024], mark[10], mark2[10];
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n, m;
        cin >> n >> m;
        while (m--)
        {
            int a, b;
            cin >> a >> b;
            mp[a][b] = mp[b][a] = 1;
        }
        f[0][0] = 1;
        for (int i = 0; i < 10; ++i)
            for (int j = 0; j < 10; ++j)
                if (mp[i][j])
                    mark[i] |= (1 << j);
        for (int i = 0; i < 10; ++i)
            for (int j = i + 1; j < 10; ++j)
                if (mp[i][j])
                    mark2[i] |= (1 << j);
        for (int i = 1; i <= n; ++i)
            for (int j = 0; j < 1024; ++j)
                for (int k = 0; k < 10; ++k)
                    if (~j >> k & 1)
                        add(f[i][j & mark[k] | mark2[k]], f[i - 1][j]);
        int s = 0;
        for (int i = 0; i < 1024; ++i)
            add(s, f[n][i]);
        cout << s << '\n';
    }
} // namespace Loyalty
```

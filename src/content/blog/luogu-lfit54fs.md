---
title: "CF1730D Prefixes and Suffixes 题解"
date: "2026-02-04T09:24:03.000Z"
link: "luogu-lfit54fs"
categories: ["题解"]
tags: ["Codeforces", "字符串", "构造"]
draft: false
---

难度：$4/10$

考虑下面的几个性质（这也太难了）：

+ 对于给定的两个串 $s_1,s_2$，其中任意一个位置 $i$ 均满足 $s1_i$ 和 $s2_{n-i+1}$ 相对位置不会改变。
+ 对于任意一个位置 $i$，字符对 $(s1_i,s2_{n-i+1})$ 可以被整体移动到任何一个位置（但是她们自己不能被拆分）。

然后问题就变得比较简单了。考虑记录每个字符对 $(i,j)$ 在串 $s_1,s_2$ 中出现的次数。为了让两个串 $s_1,s_2$ 经过操作后相等，必须满足：

+ 对于字符对 $(i,j)$（$i\neq j$），其必须出现偶数次。
+ 对于字符对 $(i,i)$，若 $2\mid n$ 则其必须出现偶数次，否则必须有最多一对出现奇数次，其余对均出现偶数次。

开桶维护字符对，时间复杂度为 $O(n+\omega^2)$ 其中 $\omega$ 为字符集大小，在本题中取 $\omega=26$。

```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        string s1, s2;
        cin >> s1 >> s2;
        int mp[26][26] = {0};
        for (int i = 0; i < n; ++i)
        {
            if (s1[i] < s2[n - i - 1])
                swap(s1[i], s2[n - i - 1]);
            ++mp[s1[i] - 'a'][s2[n - i - 1] - 'a'];
        }
        if (n & 1)
        {
            int cnt = 0, ok = 1;
            for (int i = 0; i < 26; ++i)
                for (int j = 0; j < 26; ++j)
                    if (i == j)
                        cnt += mp[i][j] & 1;
                    else
                        ok &= (~mp[i][j] & 1);
            ok &= (cnt <= 1);
            cout << (ok ? "YES" : "NO") << '\n';
        }
        else
        {
            int ok = 1;
            for (int i = 0; i < 26; ++i)
                for (int j = 0; j < 26; ++j)
                    ok &= (~mp[i][j] & 1);
            cout << (ok ? "YES" : "NO") << '\n';
        }
    }
}
```

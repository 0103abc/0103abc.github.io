---
title: "P4347 [CERC2015] Book Borders 题解"
date: "2025-10-04T13:01:35.000Z"
link: "luogu-ha848p14"
categories: ["题解"]
tags: ["洛谷", "基础算法", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ha848p14)。

考虑到经典结论：$\sum\limits_{i=1}^n\frac1i=O(n\log n)$。于是你可以发现，处理出每个位置所在的单词开头位置的下标后，直接暴力对每个长度模拟往后跳的过程，时间复杂度就是 $O(n\log n)$ 的，于是就做完了。

```cpp
signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    string s;
    getline(cin, s);
    int a, b;
    cin >> a >> b;
    int n = s.size();
    memset(st, -1, sizeof st);
    for (int i = 0, j = 0; i < n; ++i)
    {
        if (s[i] == ' ')
            j = i + 1;
        st[i] = j;
        if (i >= j)
            ++len[j];
    }
    for (int i = a; i <= b; ++i)
    {
        int res = 0;
        for (int j = 0; ~j; j = st[j + i])
            res += len[j] + 1;
        cout << res - 1 << '\n';
    }
    return 0;
}
```

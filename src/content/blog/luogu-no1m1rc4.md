---
title: "CF1732D1 Balance (Easy version) 题解"
date: "2025-02-20T14:49:08.000Z"
link: "luogu-no1m1rc4"
categories: ["题解"]
tags: ["Codeforces", "数据结构", "集合"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/no1m1rc4)。

好简单一题。考虑到弱化版只有添加和查询没有删除，因此对于每一个相同的 $k$ 随时间推移答案肯定单调不降。所以直接用 `set` 维护当前所有出现过的数，然后用 `map` 暴力维护每一个 $k$ 当前的答案即可。更新的时候无需维护，只需要在查询的时候直接暴力往上跳答案即可。没有什么手法。

```cpp
namespace ttq012 {
    const int N = 500100;
    void run() {
        set<int> se;
        map<int, int> mp;
        int q;
        cin >> q;
        while (q--) {
            char o;
            int v;
            cin >> o >> v;
            if (o == '+') {
                se.emplace(v);
            } else {
                if (!mp.count(v)) mp[v] = v;
                while (se.count(mp[v])) mp[v] += v;
                cout << mp[v] << '\n';
            }
        }
    }
}
```

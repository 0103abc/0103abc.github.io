---
title: "CF1623E Middle Duplication 题解"
date: "2026-03-14T10:14:54.000Z"
link: "luogu-5a8op5d8"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "字符串", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/5a8op5d8)。

因为字典序比较遵循贪心原则，所以考虑直接按中序遍历来贪心处理，即一个点被复制后优先处理其左子树。

此时容易想到下面的贪心流程：

+ 对于当前访问到的结点 $u$：
  + 递归访问其左子树 $l_u$。
  + 若 $l_u$ 需要被复制，则 $u$ 也同样需要被复制。
  + 否则，若 $u$ 复制后可以让答案更优，则 $u$ 同样需要被复制。
  + 若 $u$ 被复制，则递归访访问其右子树 $r_u$。

容易证明该算法的正确性。直接模拟上述流程可做到时间复杂度 $O(n)$ 解决问题。

```cpp line-numbers
namespace Loyalty
{
    int n, k, idx;
    char s[N], t[N];
    int l[N], r[N];
    vector<int> ord;
    inline void dfs(int u)
    {
        if (!u)
            return;
        dfs(l[u]);
        ord.emplace_back(u);
        t[++idx] = s[u];
        dfs(r[u]);
    }
    int cost = 1, dup[N], chk[N], rest;
    inline void dfs2(int u)
    {
        if (!u || cost > rest)
            return;
        int now = cost, old = cost;
        cost = now + 1, dfs2(l[u]), cost = old;
        if (dup[l[u]])
            dup[u] = 1;
        else if (chk[u])
            dup[u] = 1, rest -= now;
        if (dup[u])
            old = cost, cost = 1, dfs2(r[u]), cost = old;
    }
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        cin >> n >> k;
        scanf("%s", s + 1);
        rest = k;
        for (int i = 1; i <= n; ++i)
            cin >> l[i] >> r[i];
        dfs(1);
        char las = s[ord.back()];
        for (int i = n - 2; ~i; --i)
        {
            if (s[ord[i]] != s[ord[i + 1]])
                las = s[ord[i + 1]];
            if (s[ord[i]] < las)
                chk[ord[i]] = 1;
        }
        dfs2(1);
        for (int &i : ord)
            if (!dup[i])
                cout << s[i];
            else
                cout << s[i] << s[i];
        cout << '\n';
    }
} // namespace Loyalty
```

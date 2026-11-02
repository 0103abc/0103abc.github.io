---
title: "P6009 [USACO20JAN] Non-Decreasing Subsequences P 题解"
date: "2026-03-23T12:19:49.000Z"
link: "luogu-8taahd6r"
categories: ["题解"]
tags: ["洛谷", "算法思想", "分治", "动态规划"]
draft: false
---

【模板】猫树分治。对于当前的分治区间 $[l,r]$ 而言：

+ 若 $l=r$，则直接处理即可。
+ 否则，记区间的中点为 $M$，则先分别递归处理 $[l,M]$ 和 $[M+1,r]$ 两个区间内的答案，然后套路的记 $f_{i,j}$ 表示 $[i,M]$ 区间内最后一个元素是 $j$ 的不下降子序列的数量，$g_{i,p}$ 表示 $[M+1,i]$ 区间内第一个元素是 $p$ 的不下降子序列的数量，转移直接枚举 $j,p$ 然后合并 $f,g$ 两个数组的 dp 信息即可。

总时间复杂度为 $O(nk^2\log n)$，卡常后可以通过该题。

```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    struct Query { int l, r, id; } Q[N];
    int n, k, q, a[N], res[N], f[50010][22], g[50010][22], dp[22][22];
    inline void catdiv(int l, int r, vector<Query> &Q)
    {
        if (l == r)
        {
            for (auto &[ql, qr, id] : Q)
                res[id] = 2;
            return;
        }
        if (Q.empty())
            return;
        memset(f, 0, sizeof f);
        memset(g, 0, sizeof g);
        memset(dp, 0, sizeof dp);
        int mid = l + r >> 1;
        for (int i = mid; i >= l; --i)
        {
            for (int j = a[i]; j <= k; ++j)
                for (int p = j; p <= k; ++p)
                    add(dp[a[i]][p], dp[j][p]);
            add(dp[a[i]][a[i]], 1);
            for (int j = 1; j <= k; ++j)
                for (int p = j; p <= k; ++p)
                    add(f[i][p], dp[j][p]);
        }
        memset(dp, 0, sizeof dp);
        for (int i = mid + 1; i <= r; ++i)
        {
            for (int j = 1; j <= a[i]; ++j)
                for (int p = a[i]; p >= j; --p)
                    add(dp[j][a[i]], dp[j][p]);
            add(dp[a[i]][a[i]], 1);
            for (int j = 1; j <= k; ++j)
                for (int p = j; p <= k; ++p)
                    add(g[i][j], dp[j][p]);
        }
        for (auto &[ql, qr, id] : Q)
            if (ql <= mid && mid < qr)
            {
                res[id] = 1;
                for (int i = 1; i <= k; ++i)
                    add(res[id], (f[ql][i] + g[qr][i]) % mod);
                for (int i = 1; i <= k; ++i)
                    for (int j = i; j <= k; ++j)
                        add(res[id], 1ll * f[ql][i] * g[qr][j] % mod);
            }
        vector<Query> q1, q2;
        for (auto &[ql, qr, id] : Q)
        {
            if (qr <= mid)
                q1.push_back({ql, qr, id});
            if (ql > mid)
                q2.push_back({ql, qr, id});
        }
        catdiv(l, mid, q1), catdiv(mid + 1, r, q2);
    }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        cin >> n >> k;
        for (int i = 1; i <= n; ++i)
            cin >> a[i];
        cin >> q;
        for (int i = 1; i <= q; ++i)
            cin >> Q[i].l >> Q[i].r, Q[i].id = i;
        vector<Query> query;
        for (int i = 1; i <= q; ++i)
            query.emplace_back(Q[i]);
        catdiv(1, n, query);
        for (int i = 1; i <= q; ++i)
            cout << res[i] << '\n';
    }
} // namespace Loyalty
```

## 做题笔记补充

【模板】猫树分治。对于当前的分治区间 $[l,r]$ 而言：

+ 若 $l=r$，则直接处理即可。
+ 否则，记区间的中点为 $M$，则先分别递归处理 $[l,M]$ 和 $[M+1,r]$ 两个区间内的答案，然后套路的记 $f_{i,j}$ 表示 $[i,M]$ 区间内最后一个元素是 $j$ 的不下降子序列的数量，$g_{i,p}$ 表示 $[M+1,i]$ 区间内第一个元素是 $p$ 的不下降子序列的数量，转移直接枚举 $j,p$ 然后合并 $f,g$ 两个数组的 dp 信息即可。

总时间复杂度为 $O(nk^2\log n)$，可以通过该题。

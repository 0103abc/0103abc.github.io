---
title: "CF1613F Tree Coloring 题解"
date: "2026-03-18T01:18:54.000Z"
link: "luogu-uafenvbx"
categories: ["题解"]
tags: ["Codeforces", "数学", "多项式", "组合数学", "算法思想", "分治"]
draft: false
---

考虑直接容斥计算。记有至少 $i$ 个点不满足条件的答案为 $f_i$，则容斥可得最后的答案即为 $\sum\limits_{i=0}^n(-1)^if_i$。而因为点和点的权值互不相同，因此一个点最多只有一个儿子可以不合法。此时套路的把每个点写成一个多项式的形式那么就可以得到 $f_i=[x^i](|\text{son}_i|x+1)(n-i)!$（可以看作是，先钦定 $i$ 个点一定不合法，剩下的 $n-i$ 个点的值随便填），分治 NTT 把多项式乘起来即可做到 $O(n\log^2n)$ 求解答案。

```cpp line-numbers
namespace Loyalty
{
    int son[N], fac[N];
    vector<int> adj[N];
    inline vector<int> cdq(int l, int r)
    {
        if (l == r)
            return vector<int>{1, son[l]};
        int mid = l + r >> 1;
        return PolyFast::convolution(cdq(l, mid), cdq(mid + 1, r));
    }
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        fac[0] = 1;
        for (int i = 1; i <= n; ++i)
            fac[i] = fac[i - 1] * i % mod;
        for (int i = 1; i < n; ++i)
        {
            int a, b;
            cin >> a >> b;
            adj[a].emplace_back(b);
            adj[b].emplace_back(a);
        }
        for (int i = 1; i <= n; ++i)
            if (i > 1)
                son[i] = adj[i].size() - 1;
            else
                son[i] = adj[i].size();
        vector<int> poly = cdq(1, n);
        // cerr << "poly: ";
        // for (int &i : poly)
        //     cerr << i << ' ';
        // cerr << '\n';
        auto coef = [&](int &x) { return (x & 1) ? (mod - 1) : 1; };
        int sum = 0;
        for (int i = 0; i < poly.size(); ++i)
            sum = (sum + poly[i] * coef(i) % mod * fac[poly.size() - i - 1] % mod) % mod;
        cout << sum << '\n';
    }
} // namespace Loyalty
```

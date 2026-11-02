---
title: "CF1622F Quadratic Set 题解"
date: "2026-03-17T11:45:53.000Z"
link: "luogu-mj48fg8k"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论", "算法思想", "构造"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/mj48fg8k)。

感觉没啥难度（？

考虑先随便构造出一个比较大的二次集。

众所周知阶乘可以被拆成若干个数的乘法的形式，因此考虑对每个数拆贡献，得到 $\prod\limits_{i=1}^ni!=\prod\limits_{i=1}^ni^{n-i+1}$。此时考虑对每个 $i$ 把平方项都拆掉。注意到 $n$ 的奇偶性会影响剩下的 $i$ 的取值，因此考虑对 $n$ 的奇偶性分类讨论：

若 $2\mid n$：此时 $\prod\limits_{i=1}^ni^{n-i+1}=2^{\frac n2}\frac n2![\prod\limits_{i=1}^{\frac n2}(2i-1)!]^2$。此时若 $4\mid n$ 则在集合中删去 $\frac n2$ 元素即可，否则（即 $n\equiv 2\pmod 4$）则在集合中删去 $2,\frac n2$ 两个元素即可。

$2\nmid n$ 时阶乘的前缀积没有这么好的性质，但是注意到此时并不需要要求删除的元素数量尽量少只需要随便找一个比较紧的下界，因此考虑直接把 $n$ 从集合中删去，此时转化为 $2\mid n$ 的情况。

于是可以得到关键结论：最优的删除策略一定不会删除超过 $3$ 个元素。

因此考虑枚举删除的元素的数量。容易发现删除 $0,1$ 个元素是容易判断的，因此此时只需要处理删除两个元素是否可行。

注意到平方这个操作看上去十分像异或，即两个质因数可以相互抵消。因此容易想到经典 trick XOR Hash，给每个质因子赋一个权值，然后预处理出 $h_i$ 表示 $i$ 的所有质因子的权值的 XOR 值。此时一个集合 $S$ 是合法的当且仅当 $\bigoplus\limits_{i\in S}h(i)=0$，因此直接把所有的 $h(i)$ 扔到 map 里然后随便维护就可以 $O(n\log n)$ 判断是否存在合法解。

```cpp line-numbers
namespace Loyalty
{
    ull rnd[N], h[N];
    int isp[N], pr[N], idx, spf[N];
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        mt19937_64 mt(time(0));
        uniform_int_distribution<ull> dist(0, ULLONG_MAX);
        int n;
        cin >> n;
        isp[1] = 1;
        for (int i = 2; i <= n; ++i)
        {
            if (!isp[i])
                pr[++idx] = i, spf[i] = i;
            for (int j = 1; j <= idx && i * pr[j] <= n; ++j)
            {
                isp[i * pr[j]] = 1;
                spf[i * pr[j]] = pr[j];
                if (i % pr[j] == 0)
                    break;
            }
        }
        for (int i = 2; i <= n; ++i)
            if (!isp[i])
                rnd[i] = dist(mt);
        for (int i = 1; i <= n; ++i)
        {
            ull val = 0;
            int j = i;
            while (j > 1)
            {
                val ^= rnd[spf[j]];
                j /= spf[j];
            }
            h[i] = val ^ h[i - 1];
        }
        int Xor = 0;
        for (int i = 1; i <= n; ++i)
            Xor ^= h[i];
        if (!Xor)
        {
            cout << n << '\n';
            for (int i = 1; i <= n; ++i)
                cout << i << ' ';
            cout << '\n';
        }
        else
        {
            for (int i = 1; i <= n; ++i)
                if (Xor == h[i])
                {
                    cout << n - 1 << '\n';
                    for (int j = 1; j <= n; ++j)
                        if (i != j)
                            cout << j << ' ';
                    cout << '\n';
                    return;
                }
            map<ull, int> mp;
            for (int i = 1; i <= n; ++i)
            {
                if (mp.count(Xor ^ h[i]))
                {
                    cout << n - 2 << '\n';
                    int id = mp[Xor ^ h[i]];
                    for (int j = 1; j <= n; ++j)
                        if (i != j && id != j)
                            cout << j << ' ';
                    cout << '\n';
                    return;
                }
                mp[h[i]] = i;
            }
            cout << n - 3 << '\n';
            for (int i = 1; i < n; ++i)
                if (i != 2 && i != n / 2)
                    cout << i << ' ';
            cout << '\n';
        }
    }
} // namespace Loyalty
```

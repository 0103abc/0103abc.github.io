---
title: "P9849 [ICPC 2021 Nanjing R] Xingqiu's Joke 题解"
date: "2025-10-05T15:16:41.000Z"
link: "luogu-4j4fbuag"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数学"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/4j4fbuag)。

观察到 $|a-b|$ 的值不会变大，且每一次操作后要么值不变，要么值变为上一个数的因子。然后猜测不同的合法状态数很少，于是想到记忆化，设 $f_{a,\text{diff}}$ 表示当前两个数的值分别为 $a$ 和 $a+\text{diff}$ 最少需要的操作步骤，然后直接枚举到除公共质因子的部分，可以处理出 $|a-b|$ 的所有质因子然后一个个带入，判断是否可行，然后更新当前的 dp 状态即可。

一些边界条件是：

+ $a=1$ 或 $b=1$：返回 $0$
+ $|a-b|=1$：返回 $\min(a,b)-1$
+ dp 时存在边界 $\min(a,b)-1$（即一直 $-1$）

一个注意事项是如果你用了 `__gnu_pbds::gp_hash_table`，那么因为这个东西底层实现是对 $65536$ 取模，所以一定不要偷懒不写自定义哈希函数（）

```cpp
inline int makehash(int i, int j) { return i * INT_MAX + j; }
struct myhash
{
    static uint64_t rand(uint64_t x)
    {
        x ^= x << 13;
        x ^= x >> 7;
        return x ^= x << 17;
    }
    size_t operator()(size_t x) const
    {
        static const uint64_t f_rand = chrono::steady_clock::now().time_since_epoch().count();
        return rand(x + f_rand);
    }
};
__gnu_pbds::gp_hash_table<int, int, myhash> mp;
vector<int> divs;
inline int dfs(int a, int diff)
{
    // cerr << "a = " << a << " and b = " << a + diff << '\n';
    int b = a + diff;
    if (a == 1 || b == 1)
        return 0;
    if (diff == 1)
        return a - 1;
    if (a > b)
        swap(a, b);
    if (mp.find(makehash(a, diff)) != mp.end())
        return mp[makehash(a, diff)];
    int res = a - 1;
    for (int &i : divs)
        if (diff % i == 0)
            res = min({res,
                        a % i + 1 + dfs(a / i, diff / i),
                        i - a % i + 1 + dfs(a / i + 1, diff / i)});
    return mp[makehash(a, diff)] = res;
}

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    int T;
    cin >> T;
    // sieve();
    // for (int i = 1; i <= 50; ++i)
    //     cout << mmp[i] << ' ';
    // cout << '\n';
    while (T--)
    {
        int a, b;
        cin >> a >> b;
        if (a > b)
            swap(a, b);
        divs.clear();
        int diff = b - a;
        int tmp = diff;
        for (int i = 2; i * i <= tmp ; ++i)
            if (tmp % i == 0)
            {
                divs.emplace_back(i);
                while (tmp % i == 0)
                    tmp /= i;
            }
        if (tmp > 1)
            divs.emplace_back(tmp);
        // cout << "divs: " << diff << " with ";
        // for (int &i : divs)
        //     cout << i << ' ';
        // cout << '\n';
        cout << dfs(a, b - a) << '\n';
    }
    return 0;
}
```

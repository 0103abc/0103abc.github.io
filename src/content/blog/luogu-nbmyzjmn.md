---
title: "AT_agc049_d [AGC049D] Convex Sequence 题解"
date: "2026-07-20T10:10:26.000Z"
link: "luogu-nbmyzjmn"
categories: ["题解"]
tags: ["AtCoder", "数学", "组合数学"]
draft: false
---

容易发现序列必须是单谷序列，否则必然不满足性质。

考虑枚举谷的位置为 $p$，则有这样一个经典的刻画单谷序列的方式：

+ 执行若干次下面的操作：
  + 把序列 $a$ 中所有元素的值都增加 $1$。
  + 选择一个位置 $i\neq p$：
    + 若 $i<p$，则将 $a_i,a_{i-1},a_{i-2},\ldots,a_1$ 的值分别增加 $1,2,3,\ldots,i$。
    + 若 $i>p$，则将 $a_i,a_{i+1},a_{i+2},\ldots,a_n$ 的值分别增加 $1,2,3,\ldots,n-i+1$。
 
容易证明上述刻画方式和全部单谷序列组成了双射关系。

考虑固定 $p$ 的值，则问题可以被转化成 $O(\sqrt m)$ 个数跑计数的完全背包求方案数。直接背包时间复杂度是 $O(n^2\sqrt m)$ 的肯定不可行。注意到从左往右扫描 $p$ 端点时，完全背包元素的变化量很小，因此容易想到使用回滚背包将时间复杂度优化到 $O(n+m\sqrt m)$。

:::success[代码实现]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
    
}

int f[N];

inline void sol() {
    int n, m; cin >> n >> m;
    f[0] = 1;
    for (int i = 1; i < n && i * (i + 1) / 2 <= m; ++i)
        for (int j = i * (i + 1) / 2; j <= m; ++j) f[j] = (f[j] + f[j - i * (i + 1) / 2]) % mod;
    for (int j = n; j <= m; ++j) f[j] = (f[j] + f[j - n]) % mod;
    int res = 0;
    for (int i = 1; i <= n; ++i) {
        if (i * (i - 1) / 2 <= m) res = (res + f[m - i * (i - 1) / 2]) % mod;
        if ((n - i) * (n - i + 1) / 2 <= m) {
            for (int j = m; j >= (n - i) * (n - i + 1) / 2; --j) f[j] = (f[j] + mod - f[j - (n - i) * (n - i + 1) / 2]) % mod;
        } if (i * (i + 1) / 2 <= m) {
            for (int j = i * (i + 1) / 2; j <= m; ++j) f[j] = (f[j] + f[j - i * (i + 1) / 2]) % mod;
        }
    } cout << res << '\n';
}

} // namespace lowspeed_song
```

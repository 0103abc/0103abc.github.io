---
title: "CF300E Empire Strikes Back 题解"
date: "2025-02-14T05:51:55.000Z"
link: "luogu-ub4e6vn2"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论", "基础算法", "二分", "差分"]
draft: false
---

很明显答案具有单调性，于是考虑怎么二分。首先筛法筛出 $10^7$ 以内的全部质数，然后对于二分到的数 $x$，计算 $x!$ 内有多少个质因数 $p$，比较其和原式中质因数 $p$ 的个数即可。

问题变为如何计算 $\prod\limits_{i=1}^k a_i!$ 中所有质因子 $p$ 的出现个数。首先可以发现一个质因子 $p'$ 会被 $a_i$ 计数当且仅当 $p'\le a_i$，进一步的可以发现一个数 $a_i$ 只会对 $p\in\text{prime}\cap[1,a_i]$ 集合内所有的整数产生贡献。因此可以差分然后前缀和维护每一个质因子出现的次数。然后枚举每一个质因子 $p$，枚举幂次 $k$，只需要计算出现了多少个 $p^k$ 即可。因此问题解决，卡卡常就能过。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 10000010;
int diff[N], a[N];
bitset<N> isp;
int idx, pr[N / 5];
void sieve() {
    isp[1] = 1;
    for (int i = 2; i < N; ++i) {
        if (!isp[i]) pr[++idx] = i;
        for (int j = 1; j <= idx; ++j) {
            int k = i * pr[j];
            if (k >= N) break;
            isp[k] = 1;
            if (i % pr[j] == 0) break;
        }
    }
}
int n, buc[N];
int chk(int x) {
    for (int i = 1; i <= idx; ++i) {
        int sum = 0;
        for (__int128 j = pr[i]; j <= x; j *= pr[i]) sum += x / j;
        if (sum < buc[i]) return 0;
    }
    return 1;
}
signed main() {
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) ++diff[1], --diff[a[i] + 1];
    for (int i = 1; i < N; ++i) diff[i] += diff[i - 1];
    sieve();
    for (int i = 1; i <= idx; ++i)
        for (int j = pr[i]; j < N; j *= pr[i])
            for (int k = j; k < N; k += j)
                buc[i] += diff[k];
    int l = 1, r = 1e16, best = -1;
    while (l <= r) {
        int mid = l + r >> 1;
        if (chk(mid)) best = mid, r = mid - 1;
        else l = mid + 1;
    }
    cout << best << '\n';
    return 0;
}
```

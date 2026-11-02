---
title: "P15672 [ICPC 2024 Jakarta R] Narrower Passageway 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p15672"
categories: ["题解"]
tags: ["洛谷", "数据结构", "单调栈"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P15672).
:::

:::info[Solution]{open}
题目要算的东西看着就非常奇怪，考虑做一步转化，题目中给出的强度可以看作是 $m1+m2-[\max(m1,m2)=m1]m1-[\max(m1,m2)=m2]m2$。然后考虑用单调栈对两个数组分别求出每个元素 $a_i$ 为最大值的极大区间 $[L_i,R_i]$，然后做一点简单的讨论来算最终的答案即可。这个过程十分无聊所以这里就不再赘述了。

时间复杂度为 $O(n)$，写的不好可能会退化成 $O(n\log n)$。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[2][N], L[N], R[N], pwr[N], n;

inline int pw(int x) { return (x < 0) ? 0 : pwr[x]; }

inline int calc(int l, int pos, int r) {
    if (l > pos || pos > r) return 0;
    return (pw(pos - 1) - pw(l - 2) + mod) * (pw(n - pos) - pw(n - r - 1) + mod) % mod;
}

inline void sol() {
    cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[0][i];
    for (int i = 1; i <= n; ++i) cin >> a[1][i];
    pwr[0] = 1; for (int i = 1; i < N; ++i) pwr[i] = pwr[i - 1] * 2 % mod;
    function<int()> solve = [&]() {
        stack<int> stk;
        for (int i = 1; i <= n; ++i) L[i] = 1, R[i] = n;
        for (int i = n; i; --i) {
            while (stk.size() && a[0][i] > a[0][stk.top()]) L[stk.top()] = i + 1, stk.pop();
            stk.emplace(i);
        } while (stk.size()) stk.pop();
        for (int i = 1; i <= n; ++i) {
            while (stk.size() && a[0][i] >= a[0][stk.top()]) R[stk.top()] = i - 1, stk.pop();
            stk.emplace(i);
        } while (stk.size()) stk.pop();
        int res = 0;
        for (int i = 1; i <= n; ++i) res = (res + a[0][i] * calc(L[i], i, R[i]) % mod) % mod;
        for (int i = 1; i <= n; ++i) L[i] = 1, R[i] = n;
        for (int i = n; i; --i) {
            while (stk.size() && (a[1][i] > a[0][stk.top()] || a[0][i] > a[0][stk.top()])) L[stk.top()] = i + 1, stk.pop();
            if (a[0][i] >= a[1][i]) stk.emplace(i);
            else L[i] = i + 1;
        } while (stk.size()) stk.pop();
        for (int i = 1; i <= n; ++i) {
            while (stk.size() && (a[1][i] > a[0][stk.top()] || a[0][i] >= a[0][stk.top()])) R[stk.top()] = i - 1, stk.pop();
            if (a[0][i] >= a[1][i]) stk.emplace(i);
            else R[i] = i - 1;
        }
        for (int i = 1; i <= n; ++i) res = (res + mod - a[0][i] * calc(L[i], i, R[i]) % mod) % mod;
        return res;
    };
    int res1 = solve();
    for (int i = 1; i <= n; ++i) swap(a[0][i], a[1][i]);
    int res2 = solve();
    int ipwr = 1;
    for (int i = 1; i <= n; ++i) ipwr = ipwr * i2 % mod;
    cout << (res1 + res2) * ipwr % mod << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：5

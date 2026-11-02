---
title: "P17571 「FAOI-R(-2)」数列计数 2024 题解"
date: "2026-10-15T11:25:50.000Z"
link: "luogu-ocb97llx"
categories: ["题解"]
tags: ["洛谷", "基础算法", "前缀和", "算法思想", "倍增", "二分"]
draft: false
---

不需要线代和 GF 的 $2\log$ 做法，感觉应该不太能继续优化时间复杂度了。

先考虑一个线性的暴力做法。设 $f(n)$ 为答案，则初始条件为 $f(1)=f(2)=1$，转移方程为 $f(n)=\sum\limits_{i=\lceil\frac n2\rceil}^{n-1}f(i)$，拿前缀和优化一下可以做到线性。

考虑进一步优化。如果你做过 [QOJ 20020](https://qoj.ac/problem/20020) 的话可以很轻松的想到倍增同时维护相邻两项 $f(2k),f(2k+1)$ 的值然后相互转移。具体的，有：

+ $f(2k)=2f(2k-1)$（$k>1$）
+ $f(2k+1)=2f(2k)-f(k)$（$k\ge1$）

直接把这个倍增型的递推暴力转开，可得 $f(n)=2^{n-2}-\sum\limits_{i=1}^{\lfloor\frac{n-1}2\rfloor}2^{n-2i-1}f(i)$ 即 $f(n)=2^{n-2}(1-2\sum\limits_{i=1}^{\lfloor\frac{n-1}2\rfloor}\frac{f(i)}{4^i})$，问题在于如何快速的求出这个带幂次系数的前缀和。记 $g_0=\frac14,g_{i+1}=g_i^2,h_j(n)=\sum\limits_{i=1}^nf(i)g_j^i$ 则上面的转移可以被表示为 $f(n)=2^{n-2}(1-2h_0(\lfloor\frac{n-1}2\rfloor))$。然后考虑递推 $h_*(n)$，对上面的式子做一些简单的变化可得转移 $h_j(n)=\frac{g_j-g_j^2-g_js_{j+1}(\lfloor\frac{n-1}2\rfloor)-2f(n)g_j^{n+1}}{1-2g_j}$，初始条件为 $h_j(0)=0,h_j(1)=g_j$。

考虑直接暴力递归下取处理，可以发现求 $f(n)$ 时只需要求 $h_0(\lfloor\frac{n-1}2)\rfloor$，而求 $h_j(n)$ 只需要求 $f(n)$ 和 $h_{j+1}(\lfloor\frac{n-1}2\rfloor)$ 的值，即每一轮递归下标都会折半。而每一层需要维护的不同 $j$ 的值是 $O(\log n)$ 级别的，因此直接暴力算时间复杂度就是 $O(\log^2n)$ 的，可以非常轻松通过该题。

```cpp line-numbers
namespace lowspeed_song {

mt19937_64 mt(time(0));

inline void init() {
}

inline vector<int> conv(vector<int> a, vector<int> b) {
    vector<int> c(a.size() + b.size() - 1, 0);
    for (int i = 0; i < a.size(); ++i) for (int j = 0; j < b.size(); ++j)
        addmod(c[i + j], a[i] * b[j] % mod);
    return c;
}

inline vector<int> neg(vector<int> a) {
    for (int i = 1; i < a.size(); i += 2) a[i] = (mod - a[i]) % mod;
    return a;
}

inline vector<int> get(vector<int> a, int b) {
    vector<int> c;
    for (int i = b; i < a.size(); i += 2) c.emplace_back(a[i]);
    if (c.empty()) c.emplace_back(0);
    return c;
}

inline int solve(int n) {
    vector<int> c = {0}, d = {1}, e = {1};
    while (n) {
        vector<int> a = conv(e, {1, mod - 2}), b = neg(a);
        vector<int> A = conv(c, {1, mod - 2}), B = conv(d, {0, 1, mod - 1});
        A.resize(max(A.size(), B.size()));
        for (int i = 0; i < B.size(); ++i) addmod(A[i], B[i]);
        B = conv(d, {0, mod - 1}), c = get(conv(A, b), n & 1), d = get(conv(B, b), n & 1), e = get(conv(a, b), 0), n >>= 1;
    } return c[0];
}

int cnt[N], S[N];

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n; cin >> n;
    cout << solve(n) << '\n';
}

} // namespace lowspeed_song
```

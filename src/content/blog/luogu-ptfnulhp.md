---
title: "P16433 [APIO 2026 中国赛区] 上升 题解"
date: "2026-05-09T16:25:47.000Z"
link: "luogu-ptfnulhp"
categories: ["题解"]
tags: ["洛谷", "动态规划", "基础算法", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ptfnulhp)。

upd 05/13/2026：修改了若干笔误。

### $O(2^nn^2)$ 

直接状压 dp 即可。

### $O(n^4)$

这个看着就不太好计数，因此做一个经典（此处存疑）的转化：

> 钦定集合 $S$ 内所有位都为上升位，则可以看作这个集合内所有位置对答案的贡献为 $w_i-1$，将所有这样的贡献求和即可得到题目中给定式子的答案。

后面的过程就比较套路了。

记 $\text{last\_val}$ 表示 $i$ 之前最后一个满足 $p_i\neq 0$ 的 $p_i$ 值，$\text{last\_pos}$ 表示 $i$ 之前最后一个满足 $p_i\neq 0$ 的 $i$ 值，再记 $f_{i,j}$ 表示当前处理了前 $i$ 个位置，当前填写的数中有 $j$ 个不超过 $\text{last\_val}$，前缀的幸运值的和。后面 dp 部分只处理值不超过 $\text{last\_val}$ 的值，值超过 $\text{last\_val}$ 的部分可以贡献延后处理。

转移考虑分 $p_i=0$ 和 $p_i\neq 0$ 两类处理：

#### 1. $p_i=0$

枚举当前以 $i$ 结尾的，最后一个最长的被钦定的上升段为 $[l,i]$，则记该段的长度 $\text{len}=i-l+1$。此时需要进一步分类讨论：

##### 1.1 $l>\text{last\_pos}$

枚举该段中共有 $x$ 个数的值不超过 $\text{last\_val}$，则因为该段内元素严格递增所以这 $x$ 个元素一定就是上升段的前 $x$ 个元素。则该上升段对答案的贡献可以被写为下面的转移式：

$$
f_{i,j+x}\leftarrow f_{l-1,j}\prod\limits_{k=l}^{i-1}(w_k-1)\binom{\text{last\_val}-j}x\binom{l-j-1+\text{len}-x}{\text{len}-x}
$$

转移式的每一部分分别表示：

+ $\prod\limits_{k=l}^{i-1}(w_k-1)$：钦定的强制上升位对答案的贡献。
+ $\binom{\text{last\_val}-j}x$：选择值不超过 $\text{last\_val}$ 的数。
+ $\binom{l-j-1+\text{len}-x}{\text{len}-x}$：把段内值超过 $\text{last\_val}$ 的数插入到比这个值大的数组成的序列中。

##### 1.2 $l=\text{last\_pos}$

若 $l\ge1$，还要考虑钦定上升段从上一个确定位置开始，即 $[l,i]$。此时 $p_l=v$ 已确定，后面的 $i-l$ 个位置都必须大于 $v$，因此不会新增 $\le v$ 的数。转移形如：

$$
f_{i,j}\leftarrow
f_{l,j}
\prod_{k=l}^{i-1}a_k
\binom{i-j}{i-l}
$$

#### 2. $p_i\neq 0$

为了方便，后面记 $v$ 表示上一个确定的值 $\text{last\_val}$，$V$ 表示当前位置的值 $p_i$。此时需要把之前一部分值大于 $v$ 的数确定范围在 $(v,V)$ 之间。

同样还是枚举转移点 $l$，最长的被钦定的上升段为 $[l,i]$。这里的转移需要进一步分类讨论：

##### 2.1 $l>\text{last\_pos}$

此时考虑枚举之前的大数中有恰好 $r$ 个数的值落在了 $(v,V)$ 区间里，而当前上升区间 $[l,i]$ 中除 $i$ 位置的值确定外，其余位置的值都不能超过 $V$。因此转移式形如：

$$
f_{i,j+r+i-l+1}\leftarrow f_{l-1,j}\prod\limits_{k=l}^{i-1}(w_k-1)\binom{V-v-1}r\binom{V-1-j-r}{i-l}
$$

##### 2.2 $l=\text{last\_pos}$

此时区间 $(\text{last\_pos},i)$ 内的所有数的值都必须在 $(v,V)$ 区间内。同样枚举之前有 $r$ 个大数的值落在了 $(v,V)$ 区间里，则转移时形如：

$$
f_{i,j+r+i-\text{last\_pos}}\leftarrow f_{\text{last\_pos},j}\prod\limits_{k=\text{last\_pos}}^{i-1}a_k\binom{V-v-1}{i-\text{last\_pos}-1}\binom{V-v-1-i+\text{last\_pos}+1}r
$$

直接模拟上述转移过程可以做到 $O(n^4)$ 时间复杂度内解决问题。

```cpp line-numbers
// #include "ascend.h"
#include <bits/stdc++.h>
using namespace std;
constexpr inline void add(long long &x, long long v, long long mod) { x += v; if (x >= mod) x -= mod; }
const int N = 510;
long long p[N], w[N], a[N], prod[N][N], f[N][N], g[N], C[N][N];
int ascend(int c, int n, int mod, vector<int> P, vector<int> W) {
#define int long long
    for (int i = 1; i <= n; ++i) p[i] = P[i - 1];
    for (int i = 1; i < n; ++i) w[i] = W[i - 1], a[i] = (w[i] + mod - 1) % mod;
    for (int i = 0; i <= n; ++i) {
        C[i][0] = 1;
        for (int j = 1; j <= i; ++j) C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % mod;
    }
    function<int(int, int)> binom = [&](int a, int b) -> int {
        if (b < 0 || a < b) return 0ll;
        return C[a][b];
    };
    for (int i = 1; i <= n; ++i) {
        prod[i][i] = a[i], prod[i][i - 1] = 1;
        for (int j = i + 1; j <= n; ++j) prod[i][j] = prod[i][j - 1] * a[j] % mod;
    } memset(f, 0, sizeof f), f[0][0] = 1;
    int las_pos = 0, las_val = 0;
    for (int i = 1; i <= n; ++i) {
        memset(g, 0, sizeof g);
        if (!p[i]) {
            for (int l = las_pos + 1; l <= i; ++l) {
                int len = i - l + 1;
                for (int j = 0; j < l; ++j) if (f[l - 1][j]) for (int x = 0; x <= min(len, las_val - j); ++x)
                    add(g[j + x], f[l - 1][j] * prod[l][i - 1] % mod * binom(las_val - j, x) % mod * binom(l - j - 1 + len - x, len - x) % mod, mod);
            }
            if (las_pos >= 1) for (int j = 0; j <= las_pos; ++j) if (f[las_pos][j])
                add(g[j], 1ll * f[las_pos][j] * prod[las_pos][i - 1] % mod * binom(las_pos - j + i - las_pos, i - las_pos) % mod, mod);
            for (int j = 0; j <= n; ++j) f[i][j] = g[j];
        } else {
            for (int l = las_pos + 1; l <= i; ++l) for (int j = 0; j <= l - 1; ++j) if (f[l - 1][j]) for (int r = 0; r <= l - j - 1 && r <= p[i] - las_val - 1; ++r)
                add(g[j + r + i - l + 1], f[l - 1][j] * prod[l][i - 1] % mod * binom(p[i] - las_val - 1, r) % mod * binom(p[i] - 1 - j - r, i - l) % mod, mod);
            if (las_pos >= 1) if (p[i] - las_val - 1 >= i - las_pos - 1) for (int j = 0; j <= las_pos; ++j) if (f[las_pos][j]) for (int r = 0; r <= las_pos - j && r <= p[i] - las_val - 1 - (i - las_pos - 1); ++r)
                add(g[j + r + i - las_pos - 1 + 1], f[las_pos][j] * prod[las_pos][i - 1] % mod * binom(p[i] - las_val - 1, i - las_pos - 1) % mod * binom(p[i] - las_val - 1 - (i - las_pos - 1), r) % mod, mod);
            for (int j = 0; j <= n; ++j) f[i][j] = g[j];
            las_pos = i, las_val = p[i];
        }
    } return f[n][las_val];
}
```

该代码使用 Barrett 约减等技巧后可通过该题。

```cpp line-numbers
// #include "ascend.h"
#include <bits/stdc++.h>
using namespace std;
constexpr inline void add(long long &x, long long v, long long mod) { x += v; if (x >= mod) x -= mod; }
struct Barrett {
    unsigned int m;
    unsigned long long im;
    inline void init(unsigned int _m) {
        m = _m;
        im = (unsigned long long)(-1) / m + 1;
    }
    inline unsigned int mul(unsigned int a, unsigned int b) const {
        unsigned long long z = 1ull * a * b;
        unsigned long long x = (unsigned long long)((__uint128_t)z * im >> 64);
        unsigned int v = (unsigned int)(z - x * m);
        if (v >= m) v += m;
        if (v >= m) v -= m;
        return v;
    }
} bt;
const int N = 510;
long long p[N], w[N], a[N], prod[N][N], f[N][N], g[N], C[N][N];
inline long long mul(long long x, long long y) {
    return bt.mul((unsigned int)x, (unsigned int)y);
}
inline long long binom(int a, int b) {
    if (b < 0 || a < b) return 0;
    return C[a][b];
}
int ascend(int c, int n, int mod, vector<int> P, vector<int> W) {
#define int long long
    bt.init(mod);
    for (int i = 1; i <= n; ++i) p[i] = P[i - 1];
    for (int i = 1; i < n; ++i) w[i] = W[i - 1], a[i] = (w[i] + mod - 1) % mod;
    for (int i = 0; i <= n; ++i) {
        C[i][0] = 1;
        for (int j = 1; j <= i; ++j) C[i][j] = C[i - 1][j - 1] + C[i - 1][j], C[i][j] %= mod;
    }
    for (int i = 1; i <= n; ++i) {
        prod[i][i] = a[i], prod[i][i - 1] = 1;
        for (int j = i + 1; j <= n; ++j) prod[i][j] = mul(prod[i][j - 1], a[j]);
    }
    memset(f, 0, sizeof f), f[0][0] = 1;
    int las_pos = 0, las_val = 0;
    for (int i = 1; i <= n; ++i) {
        memset(g, 0, sizeof g);
        if (!p[i]) {
            for (int l = las_pos + 1; l <= i; ++l) {
                int len = i - l + 1, jlim = min(l - 1, las_val);
                for (int j = 0; j <= jlim; ++j) if (f[l - 1][j]) {
                    int base = mul(f[l - 1][j], prod[l][i - 1]), xlim = min(len, las_val - j);
                    for (int x = 0; x <= xlim; ++x) {
                        val = mul(base, C[las_val - j][x]);
                        val = mul(val, C[l - j - 1 + len - x][len - x]);
                        add(g[j + x], val, mod);
                    }
                }
            }
            if (las_pos >= 1) {
                for (int j = 0; j <= las_pos; ++j) if (f[las_pos][j]) {
                    int val = mul(f[las_pos][j], prod[las_pos][i - 1]);
                    val = mul(val, C[las_pos - j + i - las_pos][i - las_pos]);
                    add(g[j], val, mod);
                }
            }
            for (int j = 0; j <= n; ++j) f[i][j] = g[j];
        } else {
            for (int l = las_pos + 1; l <= i; ++l) {
                int len = i - l + 1, need = i - l;
                int jlim = min(l - 1, p[i] - 1 - need);
                for (int j = 0; j <= jlim; ++j) if (f[l - 1][j]) {
                    int base = mul(f[l - 1][j], prod[l][i - 1]);
                    int rlim = min({l - j - 1, p[i] - las_val - 1, p[i] - 1 - j - need});
                    for (int r = 0; r <= rlim; ++r) {
                        int val = mul(base, C[p[i] - las_val - 1][r]);
                        val = mul(val, C[p[i] - 1 - j - r][i - l]);
                        add(g[j + r + i - l + 1], val, mod);
                    }
                }
            }
            if (las_pos >= 1) {
                int need = i - las_pos - 1;
                if (p[i] - las_val - 1 >= need) {
                    for (int j = 0; j <= las_pos; ++j) if (f[las_pos][j]) {
                        int base = mul(f[las_pos][j], prod[las_pos][i - 1]);
                        base = mul(base, C[p[i] - las_val - 1][need]);
                        rlim = min(las_pos - j, p[i] - las_val - 1 - need);
                        for (int r = 0; r <= rlim; ++r) add(g[j + r + i - las_pos], mul(base, C[p[i] - las_val - 1 - need][r]), mod);
                    }
                }
            }
            for (int j = 0; j <= n; ++j) f[i][j] = g[j];
            las_pos = i, las_val = p[i];
        }
    }
    return f[n][las_val];
}
```

### $O(n^3)$

注意到上述做法中只有 $p_i=0$ 时的 dp 是 $O(n^4)$ 时间复杂度以外，其余部分的时间复杂度均已经为 $O(n^3)$，因此只需要优化这个部分即可。

注意到上升段中值不超过 $\text{last\_val}$ 的部分一定在值超过 $\text{last\_val}$ 的部分的后面，因此前面枚举不超过 $\text{last\_val}$ 的数的个数 $x$，等同于是枚举值的分界点 $k$，满足上升段在 $k$ 之前的数值都不超过 $\text{last\_val}$，在这之后的数值都超过 $\text{last\_val}$，因此考虑先处理出 $h_{k,s}$ 表示值不超过 $\text{last\_val}$ 的数在 $k$ 位置结尾，且到目前为止一共用了 $s$ 个值不超过 $\text{last\_val}$ 的数，幸运值的和是多少。此时再转移即可做到 $O(n^3)$ 的时间复杂度。

```cpp line-numbers
// #include "ascend.h"
#include <bits/stdc++.h>
using namespace std;
constexpr inline void add(long long &x, long long v, long long mod) { x += v; if (x >= mod) x -= mod; }
const int N = 510;
long long p[N], w[N], a[N], prod[N][N], f[N][N], g[N], C[N][N], h[N][N];
int ascend(int c, int n, int mod, vector<int> P, vector<int> W) {
#define int long long
    for (int i = 1; i <= n; ++i) p[i] = P[i - 1];
    for (int i = 1; i < n; ++i) w[i] = W[i - 1], a[i] = (w[i] + mod - 1) % mod;
    memset(C, 0, sizeof C);
    for (int i = 0; i <= n; ++i) {
        C[i][0] = C[i][i] = 1 % mod;
        for (int j = 1; j < i; ++j) C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % mod;
    }
    function<int(int, int)> binom = [&](int a, int b) -> int {
        if (b < 0 || a < b) return 0ll;
        return C[a][b];
    };
    memset(prod, 0, sizeof prod);
    for (int i = 1; i <= n; ++i) {
        prod[i][i - 1] = 1, prod[i][i] = a[i];
        for (int j = i + 1; j <= n; ++j) prod[i][j] = prod[i][j - 1] * a[j] % mod;
    }
    memset(f, 0, sizeof f), memset(h, 0, sizeof h), f[0][0] = 1;
    int las_pos = 0, las_val = 0;
    for (int i = 1; i <= n; ++i) {
        memset(g, 0, sizeof g);
        if (!p[i]) {
            for (int j = 0; j <= n; ++j) h[i][j] = 0;
            for (int l = las_pos + 1; l <= i; ++l) {
                int x = i - l + 1;
                for (int j = 0; j < l; ++j) if (f[l - 1][j])
                    add(h[i][j + x], f[l - 1][j] * prod[l][i - 1] % mod * binom(las_val - j, x) % mod, mod);
            }
            for (int k = las_pos; k < i; ++k) for (int j = 0; j <= k; ++j) if (f[k][j])
                add(g[j], f[k][j] * prod[k + 1][i - 1] % mod * binom(i - j, i - k) % mod, mod);
            for (int k = las_pos + 1; k <= i; ++k) for (int j = 0; j <= min(k, las_val); ++j) if (h[k][j])
                add(g[j], h[k][j] * prod[k][i - 1] % mod * binom(i - j, i - k) % mod, mod);
            if (las_pos >= 1) for (int j = 0; j <= las_pos; ++j) if (f[las_pos][j])
                add(g[j], f[las_pos][j] * prod[las_pos][i - 1] % mod * binom(las_pos - j + i - las_pos, i - las_pos) % mod, mod);
            for (int j = 0; j <= n; ++j) f[i][j] = g[j];
        } else {
            for (int l = las_pos + 1; l <= i; ++l) for (int j = 0; j <= l - 1; ++j) if (f[l - 1][j]) for (int r = 0; r <= l - j - 1 && r <= p[i] - las_val - 1; ++r)
                add(g[j + r + i - l + 1], f[l - 1][j] * prod[l][i - 1] % mod * binom(p[i] - las_val - 1, r) % mod * binom(p[i] - 1 - j - r, i - l) % mod, mod);
            if (las_pos >= 1) if (p[i] - las_val - 1 >= i - las_pos - 1) for (int j = 0; j <= las_pos; ++j) if (f[las_pos][j]) for (int r = 0; r <= las_pos - j && r <= p[i] - las_val - 1 - (i - las_pos - 1); ++r)
                add(g[j + r + i - las_pos], f[las_pos][j] * prod[las_pos][i - 1] % mod * binom(p[i] - las_val - 1, i - las_pos - 1) % mod * binom(p[i] - las_val - 1 - (i - las_pos - 1), r) % mod, mod);
            for (int j = 0; j <= n; ++j) f[i][j] = g[j]; las_pos = i, las_val = p[i];
        }
    } return f[n][las_val];
}
```

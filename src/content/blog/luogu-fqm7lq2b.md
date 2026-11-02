---
title: "CF2245F Familiar? 题解"
date: "2026-07-24T12:45:53.000Z"
link: "luogu-fqm7lq2b"
categories: ["题解"]
tags: ["Codeforces", "数据结构", "单调栈", "算法思想", "分治", "数学", "数论"]
draft: false
---

看到单调栈容易想到笛卡尔树分治。设区间 $[l,r]$ 中的最小值位于 $k$ 位置，则：

+ 处理到 $k$ 位置时，前面 $[l,k-1]$ 部分在栈中的元素都会被弹出，因此 $b_k$ 就等于扫描左半段后单调栈内元素数量。
+ 最小值入栈后，右半段 $[k+1,r]$ 部分的入栈情况和左半段之间互相独立。

因此考虑 dp：设 $f_{l,r,k}$ 表示 $[l,r]$ 区间中满足条件且处理完后单调栈内恰好存在 $c$ 个元素的排列数量；$g_{l,r}$ 表示 $[l,r]$ 这一段内满足条件的所有排列数量。初始条件显然是 $g_{i,i-1}=f_{i,i-1,0}=1$。

然后考虑转移。最小值左侧的贡献比较恶心暂且记作 $w(l,k)$，则因为 $k$ 是区间内最小值，剩下的 $r-l$ 个数中需要恰好选取 $k-l$ 个数放在最小值左侧，方案数就是 $\binom{r-l}{k-l}$。因此就有转移 $g_{l,r}=\sum\limits_{k=l}^r\binom{r-l}{k-l}w(l,k)g_{k+1,r},f_{l,r,c}=\sum\limits_{k-l}^r\binom{r-l}{k-l}w(l,k)f_{k+1,r,c-1}$。

然后考虑 $w(l,k)$ 的值怎么算。这个部分可以直接分类讨论出来：

+ 若 $k=l$ 且 $a_k>0$，则有 $w(l,k)=0$。
+ 若 $k=l$ 且 $a_k\in\lbrace -1,0\rbrace$，则有 $w(l,k)=1$。
+ 若有 $k\neq l$ 且 $a_k=-1$，则有 $w(l,k)=g_{l,k-1}$。
+ 若有 $k\neq l$ 且 $a_k\neq -1$，则有 $w(l,k)=f_{l,k-1,a_k}$。

直接模拟上述流程转移即可做到 $O(n^3)$ 时间复杂度解决问题。因为空间限制很紧所以需要精细实现。

```cpp line-numbers
namespace lowspeed_song {

int C[510][510];

inline void init() {
    C[0][0] = 1;
    for (int i = 1; i < 510; ++i) {
        C[i][0] = 1;
        for (int j = 1; j <= i; ++j) C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % mod;
    }
}

vector<signed> f;
int a[N], g[510][510], id[510][510];
signed ZERO;
inline signed &F(int i, int j, int c) { ZERO = 0; if (c < 0 || c > j - i) return ZERO; return f[id[i][j] + c]; }

inline void sol() {
    int n, sum = 0, ok = 0, tot = 0; cin >> n;
    for (int i = 0; i < n; ++i) cin >> a[i];
    for (int len = 0; len <= n; ++len)
        for (int i = 0, j = len; j <= n; ++i, ++j) id[i][j] = tot, tot += len + 1;
    memset(g, 0, sizeof g), f.assign(tot, 0);
    for (int i = 0; i < n; ++i) if (~a[i]) {
        sum += a[i];
        if (a[i] > i) { ok = 1; break; }
    } if (ok || sum >= n) { cout << 0 << '\n'; return; }
    for (int i = 0; i <= n; ++i) g[i][i] = F(i, i, 0) = 1;
    function<int(int, int)> get = [&](int i, int k) -> int {
        if (!~a[k]) return g[i][k];
        if (a[k] > k - i) return 0;
        return F(i, k, a[k]);
    };
    for (int j = 1; j <= n; ++j) {
        for (int i = j - 1; ~i; --i)
            for (int k = i; k < j; ++k) g[i][j] = (g[i][j] + C[j - i - 1][k - i] * get(i, k) % mod * g[k + 1][j]) % mod;
        if (j == n || !~a[j]) continue;
        for (int c = 1; c <= a[j]; ++c)
            for (int i = j - 1; ~i; --i)
                for (int k = i; k <= j - c; ++k) F(i, j, c) = (F(i, j, c) + C[j - i - 1][k - i] * get(i, k) % mod * F(k + 1, j, c - 1)) % mod;
    }
    cout << g[0][n] << '\n';
}

} // namespace lowspeed_song
```

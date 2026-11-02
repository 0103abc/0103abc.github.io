---
title: "CF1129C Morse Code 题解"
date: "2026-05-18T12:37:51.000Z"
link: "luogu-wauuunbq"
categories: ["题解"]
tags: ["Codeforces", "字符串", "哈希", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/wauuunbq)。

简单题。注意到两个字符串 $s_1,s_2$ 都能产生同一个 Morse Code $x$ 当且仅当 $s_1=s_2$，因此只需要把所有不同的子串可以产生的不同 Morse Code 数量求和就是答案。设 $f_{l,r}$ 表示 $l\sim r$ 一段可以产生多少个不同的 Morse Code，转移枚举上一个转移点 $k$ 表示上一个完整的单词是 $k\sim r$ 然后判断是否可行即可。

本题卡常 / 空，`__gnu_pbds::gp_hash_table` 和 `umap` 均无法通过，需要手写哈希表。时间复杂度为 $O(n^2)$ 可以通过。

```cpp line-numbers
int a[N], f[3010][3010];
// f[i][j]: [i,j] 段内可以划分出多少个本质不同的，之前从未出现过的合法字母串
// 哎是不是不同的字符串一定不会得到相同的摩码（?
ull h[N], bit[N];
const ull base = 13331;
inline ull get(int l, int r) { return h[r] - h[l - 1] * bit[r - l + 1]; }
inline int chk(int l, int r) {
    int len = r - l + 1;
    if (len < 4) return 1;
    if (a[l] == 0 && a[l + 1] == 0 && a[l + 2] == 1 && a[l + 3] == 1) return 0;
    if (a[l] == 0 && a[l + 1] == 1 && a[l + 2] == 0 && a[l + 3] == 1) return 0;
    if (a[l] == 1 && a[l + 1] == 1 && a[l + 2] == 1 && a[l + 3] == 0) return 0;
    if (a[l] == 1 && a[l + 1] == 1 && a[l + 2] == 1 && a[l + 3] == 1) return 0;
    return 1;
}
struct Hasher {
    const int mod = 1000007;
    vector<ull> Hash[1000007];
    inline void ins(ull x) {
        Hash[x % mod].emplace_back(x);
    }
    inline int qry(ull x) {
        for (ull &i : Hash[x % mod])
            if (i == x) return 1;
        return 0;
    }
} se;
inline void sol() {
    bit[0] = 1;
    for (int i = 1; i < N; ++i) bit[i] = bit[i - 1] * base;
    int m, res = 0; cin >> m;
    for (int i = 1; i <= m; ++i) {
        int x; cin >> x, a[i] = x;
        f[i][i - 1] = 1, h[i] = h[i - 1] * base + x + 1;
        for (int j = 1; j <= i; ++j) {
            for (int k = 0; k < 4; ++k)
                if (i >= j + k && chk(i - k, i)) f[j][i] = (f[j][i] + f[j][i - k - 1]) % mod;
            if (!se.qry(get(j, i))) res = (res + f[j][i]) % mod, se.ins(get(j, i));
        } cout << res << '\n';
    }
}
```

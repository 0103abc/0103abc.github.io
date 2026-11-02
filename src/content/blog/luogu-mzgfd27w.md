---
title: "CF1943B Non-Palindromic Substring 题解"
date: "2025-02-23T14:01:18.000Z"
link: "luogu-mzgfd27w"
categories: ["题解"]
tags: ["Codeforces", "字符串", "基础算法", "前缀和"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/mzgfd27w)。

还是想介绍一下我的巨大哈希做法。

题目本身是比较简单的，就是直接分类讨论：

+ $k=1$，此时任何串都是回文的，一定不是 good。
+ $k=r-l+1$，此时若整串回文，则不是 good，否则是 good。可以用三哈希处理。
+ $2\mid k$，此时若字符串内所有字符全都相同，则所有偶数长度均非 good，否则均为 good。
+ $2\nmid k$，此时若字符串内所有奇数位置和偶数位置的字符分别全都相同，则所有奇数长度均非 good，否则均为 good。

对于 $k=r-l+1$ 的情况，可以写 $6$ 个哈希，其中三个为正哈希，三个为反哈希，来判断串是否回文。对于 $2\mid k$ 的情况，可以使用前缀和处理然后暴力统计区间内出现了多少个字符，时间复杂度为 $O(\omega)$ 其中 $\omega$ 取字符集大小即 $26$。对于 $2\nmid k$ 的情况，考虑对原串分别维护奇数位置的哈希和偶数位置的哈希，然后再维护 $26$ 个哈希分别表示长度为 $i$ 字符全为 $j$ 的串的哈希值。查询的时候直接 $O(\omega)$ 暴力判断答案是否可行即可。

写起来十分痛苦。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 200010;
int n, q;
char s[N], s1[N], s2[N];
const int base1 = 131, base2 = 1331, base3 = 13331;
const int mod1 = 998244353, mod2 = 1e9 + 7, mod3 = 218105633;
int b1[N], b2[N], b3[N], h1[N], h2[N], h3[N], h4[N], h5[N], h6[N], pre[N][26];
int h7[N], h8[N], h9[N], h10[N], h11[N], h12[N];
int h13[N][26], h14[N][26], h15[N][26];
int get(int *h, int *b, int m, int l, int r) {
    return (h[r] - h[l - 1] * b[r - l + 1] % m + m) % m;
}
int chk(int l, int r) {
    return get(h1, b1, mod1, l, r) == get(h4, b1, mod1, n - r + 1, n - l + 1) &&
           get(h2, b2, mod2, l, r) == get(h5, b2, mod2, n - r + 1, n - l + 1) &&
           get(h3, b3, mod3, l, r) == get(h6, b3, mod3, n - r + 1, n - l + 1);
}
signed main() {
    cout << fixed << setprecision(15);
    // cin.tie(0)->sync_with_stdio(false);
    int T, tc;
    cin >> T;
    tc = T;
    int ca = 1;
    b1[0] = b2[0] = b3[0] = 1;
    for (int i = 1; i < N; ++i) {
        b1[i] = b1[i - 1] * base1 % mod1;
        b2[i] = b2[i - 1] * base2 % mod2;
        b3[i] = b3[i - 1] * base3 % mod3;
    }
    for (int i = 0; i < 26; ++i)
        for (int j = 1; j < N; ++j) {
            h13[j][i] = (h13[j - 1][i] * base1 + (i + 'a')) % mod1;
            h14[j][i] = (h14[j - 1][i] * base2 + (i + 'a')) % mod2;
            h15[j][i] = (h15[j - 1][i] * base3 + (i + 'a')) % mod3;
        }
    while (T--) {
        cin >> n >> q;
        scanf("%s", s + 1);
        for (int i = 1; i <= n; ++i) {
            for (int j = 0; j < 26; ++j) pre[i][j] = pre[i - 1][j];
            ++pre[i][s[i] - 'a'];
        }
        for (int i = 1; i <= n; ++i) {
            h1[i] = (h1[i - 1] * base1 % mod1 + s[i]) % mod1;
            h2[i] = (h2[i - 1] * base2 % mod2 + s[i]) % mod2;
            h3[i] = (h3[i - 1] * base3 % mod3 + s[i]) % mod3;
        }
        for (int i = 1; i <= n; ++i) {
            h4[i] = (h4[i - 1] * base1 % mod1 + s[n-i+1]) % mod1;
            h5[i] = (h5[i - 1] * base2 % mod2 + s[n-i+1]) % mod2;
            h6[i] = (h6[i - 1] * base3 % mod3 + s[n-i+1]) % mod3;
        }
        int i1 = 0, i2 = 0;
        for (int i = 1; i <= n; ++i) {
            if (i & 1) {
                s1[++i1] = s[i];
            } else {
                s2[++i2] = s[i];
            }
        }
        for (int i = 1; i <= i1; ++i) {
            h7[i] = (h7[i - 1] * base1 % mod1 + s1[i]) % mod1;
            h8[i] = (h8[i - 1] * base2 % mod2 + s1[i]) % mod2;
            h9[i] = (h9[i - 1] * base3 % mod3 + s1[i]) % mod3;
        }
        for (int i = 1; i <= i2; ++i) {
            h10[i] = (h10[i - 1] * base1 % mod1 + s2[i]) % mod1;
            h11[i] = (h11[i - 1] * base2 % mod2 + s2[i]) % mod2;
            h12[i] = (h12[i - 1] * base3 % mod3 + s2[i]) % mod3;
        }
        while (q--) {
            int l, r;
            cin >> l >> r;
            if (l == r) cout << "0\n";
            else {
                int len = r - l + 1;
                if (chk(l, r)) {
                    int cnt = 0;
                    for (int i = 0; i < 26; ++i)
                        if (pre[r][i] != pre[l - 1][i]) ++cnt;
                    if (cnt == 1) cout << "0\n";
                    else if (cnt == 2) {
                        int ok1 = 0, ok2 = 0;
                        int lp = l / 2 + 1, rp = (r + 1) / 2;
                        int _len = rp - lp + 1;
                        for (int i = 0; i < 26; ++i) {
                            if (h13[_len][i] == get(h7, b1, mod1, lp, rp) && h14[_len][i] == get(h8, b2, mod2, lp, rp) && h15[_len][i] == get(h9, b3, mod3, lp, rp)) {
                                ok1 = 1;
                                break;
                            }
                        }
                        lp = (l + 1) / 2, rp = r / 2;
                        _len = rp - lp + 1;
                        for (int i = 0; i < 26; ++i) {
                            if (h13[_len][i] == get(h10, b1, mod1, lp, rp) && h14[_len][i] == get(h11, b2, mod2, lp, rp) && h15[_len][i] == get(h12, b3, mod3, lp, rp)) {
                                ok2 = 1;
                                break;
                            }
                        }
                        int ok = ok1 && ok2;
                        if (!ok) {
                            cout << (len - 1) * len / 2 - 1 << '\n';
                            continue;
                        }
                        int tlen = len / 2;
                        int res = (1 + tlen) * tlen;
                        if (len % 2 == 0) res -= len;
                        cout << res << '\n';
                    } else cout << (len - 1) * len / 2 - 1 << '\n';
                } else {
                    int cnt = 0;
                    for (int i = 0; i < 26; ++i)
                        if (pre[r][i] != pre[l - 1][i]) ++cnt;
                    if (cnt == 1) cout << "0\n";
                    else if (cnt == 2) {
                        int ok1 = 0, ok2 = 0;
                        int lp = l / 2 + 1, rp = (r + 1) / 2;
                        int _len = rp - lp + 1;
                        for (int i = 0; i < 26; ++i) {
                            if (h13[_len][i] == get(h7, b1, mod1, lp, rp) && h14[_len][i] == get(h8, b2, mod2, lp, rp) && h15[_len][i] == get(h9, b3, mod3, lp, rp)) {
                                ok1 = 1;
                                break;
                            }
                        }
                        lp = (l + 1) / 2, rp = r / 2;
                        _len = rp - lp + 1;
                        for (int i = 0; i < 26; ++i) {
                            if (h13[_len][i] == get(h10, b1, mod1, lp, rp) && h14[_len][i] == get(h11, b2, mod2, lp, rp) && h15[_len][i] == get(h12, b3, mod3, lp, rp)) {
                                ok2 = 1;
                                break;
                            }
                        }
                        int ok = ok1 && ok2;
                        if (!ok) {
                            cout << (len + 1) * len / 2 - 1 << '\n';
                            continue;
                        }
                        int tlen = len / 2;
                        cout << (1 + tlen) * tlen << '\n';
                    } else cout << (len + 1) * len / 2 - 1 << '\n';
                }
            }
        }
    }
    return 0;
}
```

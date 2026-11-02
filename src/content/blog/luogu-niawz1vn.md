---
title: "CF1951E No Palindromes 题解"
date: "2025-02-27T12:08:48.000Z"
link: "luogu-niawz1vn"
categories: ["题解"]
tags: ["Codeforces", "字符串", "回文"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/niawz1vn)。

被 $2400$ 击败了，写点水题提提信心（

考虑什么时候是不合法的。显然，此时 $S$ 串必须为回文串，且必须满足下面三个条件之一：

+ $S$ 串内所有元素均相同。
+ $S$ 串内只有两个不同的字符，$2\nmid |S|$ 且所有奇数位，偶数位的字符分别相同。
+ $S$ 串内只有两个不同的字符，$2\nmid |S|$ 且除 $S$ 的第 $\frac{|S|+1}2$ 位以外所有字符均相同。

可以证明，上述情况均不存在合法的划分。

证明：

+ 对于情况 $1$，显然无论怎么划出其任意子串，该子串所有字符均相同，必为回文串。因此无法划分。
+ 对于情况 $2$，显然若要划出一个前缀，则该前缀的长度必须为偶数才能满足条件，此时剩余部分仍为一个前缀，因此可以划分的部分的长度一定为偶数。而串的总长度为奇数，因此无法划分。
+ 对于情况 $3$，显然若要划出一个前缀，必包含 $S$ 串的第 $\frac{|S|+1}2$ 位字符，而剩下的部分为情况 $1$，因此无法划分。

对于剩下的情况，若串本身不为回文串，则答案可以为 $1$，即整串。

还剩下若干种情况，容易发现，此时同时不满足上面所有情况的串，必然存在 $2\le t\le n$ 使得 $S_{[1,t-1]}$ 和 $S_{[t,n]}$ 都为非回文串。因此做完了，判断串是否回文可以用正反哈希维护。

```cpp
#pragma GCC optimize(3, "Ofast", "inline") 
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 1000010;
const int ba1 = 131, ba2 = 13331, m1 = 998244353, m2 = 1e9 + 9;
char s[N];
int h1[N], h2[N], h3[N], h4[N], b1[N], b2[N], pre[N][26], n;
int get(int *h, int *b, int m, int l, int r) {
    return (h[r] - h[l - 1] * b[r - l + 1] % m + m) % m;
}
int chk(int l, int r) {
    return get(h1, b1, m1, l, r) == get(h3, b1, m1, n - r + 1, n - l + 1) &&
           get(h2, b2, m2, l, r) == get(h4, b2, m2, n - r + 1, n - l + 1);
}
signed main() {
    int T;
    cin >> T;
    b1[0] = b2[0] = 1;
    for (int i = 1; i < N; ++i) {
        b1[i] = b1[i - 1] * ba1 % m1;
        b2[i] = b2[i - 1] * ba2 % m2;
    }
    while (T--) {
        scanf("%s", s + 1);
        n = strlen(s + 1);
        for (int i = 1; i <= n; ++i) {
            h1[i] = (h1[i - 1] * ba1 + s[i]) % m1;
            h2[i] = (h2[i - 1] * ba2 + s[i]) % m2;
            h3[i] = (h3[i - 1] * ba1 + s[n - i + 1]) % m1;
            h4[i] = (h4[i - 1] * ba2 + s[n - i + 1]) % m2;
        }
        if (!chk(1, n)) {
            cout << "YES\n1\n";
            puts(s + 1);
        }
        else {
            for (int i = 1; i <= n; ++i) {
                for (int j = 0; j < 26; ++j) pre[i][j] = pre[i - 1][j];
                ++pre[i][s[i] - 'a'];
            }
            int mx = 0;
            for (int i = 1; i <= 26; ++i)
                mx = max(mx, pre[n][i - 1]);
            if (mx == n) cout << "NO\n";
            else {
                int cnt = 0;
                for (int i = 1; i <= 26; ++i)
                    if (pre[n][i - 1]) ++cnt;
                if (cnt == 2) {
                    int ok = 1;
                    for (int i = 1; i <= n; ++i) {
                        int o = 2 - (i & 1);
                        if (s[o] != s[i]) {
                            ok = 0;
                            break;
                        }
                    }
                    if (ok) cout << "NO\n";
                    else {
                        if (n & 1) {
                            int mid = n / 2 + 1;
                            if (pre[n][s[mid] - 'a'] == 1) {
                                cout << "NO\n";
                                continue;
                            }
                        }
                        cout << "YES\n";
                        for (int i = 2; i <= n; ++i)
                            if (!chk(1, i - 1) && !chk(i, n)) {
                                cout << "2\n";
                                for (int j = 1; j < i; ++j) cout << s[j];
                                cout << ' ';
                                for (int j = i; j <= n; ++j) cout << s[j];
                                cout << '\n';
                                break;
                            }
                    }
                } else {
                    cout << "YES\n";
                    for (int i = 2; i <= n; ++i)
                        if (!chk(1, i - 1) && !chk(i, n)) {
                            cout << "2\n";
                            for (int j = 1; j < i; ++j) cout << s[j];
                            cout << ' ';
                            for (int j = i; j <= n; ++j) cout << s[j];
                            cout << '\n';
                            break;
                        }
                }
            }
        }
    }
}
```

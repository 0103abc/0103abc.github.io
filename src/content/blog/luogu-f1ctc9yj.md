---
title: "CF1886D Monocarp and the Set 题解"
date: "2024-10-23T12:16:24.000Z"
link: "luogu-f1ctc9yj"
categories: ["题解"]
tags: ["Codeforces", "数学", "组合数学"]
draft: false
---

简单题。考虑维护每一个字符对答案的贡献：`<` 和 `>` 只能为当前的最大值，贡献为 $1$，而 `?` 可以为其他所有值，贡献为 $i-2$（$i$ 表示当前是第 $i$ 个字符）。

然后直接统计出来，修改的时候乘逆元即可。时间复杂度为 $O(n\log n)$。如果线性预处理逆元则可以做到 $O(n)$。

```cpp
#pragma GCC optimize(3) 
#include <bits/stdc++.h>
#define eb emplace_back
#define int long long
using namespace std;
const int N = 2000100, mod = 998244353;
char s[N];
int ksm(int a, int b, int c) {
    int ans = 1;
    while (b) {
        if (b & 1) {
            ans = ans * a % c;
        }
        a = a * a % c;
        b >>= 1;
    }
    return ans;
}
signed main() {
    int n, m;
    scanf("%lld%lld%s", &n, &m, s + 1);
    int now = 1;
    for (int i = 3; i <= n; ++i) {
        if (s[i - 1] == '?') {
            now = now * (i - 2) % mod;
        }
    }
    if (s[1] != '?') {
    cout << now << '\n';
    } else {
        cout << "0\n";
    }
    while (m--) {
        int o; char x;
        cin >> o >> x;
        if (o > 1) {
        if (s[o] == '?') {
            now = now * ksm(o - 1, mod - 2, mod) % mod;
        }
        if ((s[o] = x) == '?') {
            now = now * (o - 1) % mod;
        }
        } else {
            s[o] = x;
        }
        if (s[1] != '?') {
            cout << now << '\n';
        } else {
            cout << "0\n";
        }
    }
    return 0;
}

/*



*/
```

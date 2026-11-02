---
title: "CF40E Number Table 题解"
date: "2025-02-15T13:30:13.000Z"
link: "luogu-pe1vk1hf"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造"]
draft: false
---

首先特殊判断某一行或某一列的数全部填完，且这行或这列所有数乘积不为 $-1$ 的情况，该情况无解。同样还有若 $n\not\equiv m\pmod 2$，则奇偶性分析后可知显然也无解。

先考虑一个简单一些的子问题：若 $k<\min(n,m)$，那么应该如何解决？很显然，此时至少存在一行和一列使得这一行和一列没有被填任何一个数。把这一行一列删去，剩下的数任意填写，最后用这一行一列的唯一填法把答案补充完整即可。

现在考虑 $k<\max(n,m)$ 的母问题。此时仍然存在一行**或**一列使得这一行**或**一列没有被填任何一个数。删除这一行**或**一列，那么剩下的每一行**或**每一列都可以任意填写答案，用最后这个行**或**列的唯一填法把答案补充完整。因此问题做完，通过预处理 $2$ 的幂次可以做到 $O(n+m)$ 解决问题。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
const int N = 500010;
int bin[N], a[N], buc[N];
inline void add(int &x, int v) {
    x += v;
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int n, m, k, p;
    cin >> n >> m >> k;
    if ((n + m) & 1) cout << "0\n";
    else {
        int ok = 0;
        if (n < m) swap(n, m), ok = 1;
        fill(a + 1, a + n + 1, 1);
        for (int i = 0; i < k; ++i) {
            int x, y, z;
            cin >> x >> y >> z;
            if (ok) swap(x, y);
            ++buc[x], a[x] *= z;
        }
        for (int i = 1; i < n; ++i)
            if (!buc[i]) {
                swap(buc[i], buc[n]);
                swap(a[i], a[n]);
                break;
            }
        cin >> p;
        bin[0] = 1 % p;
        for (int i = 1; i < N; ++i) bin[i] = bin[i - 1] * 2 % p;
        int res = 1;
        for (int i = 1; i < n; ++i)
            if (buc[i] == m) {
                if (a[i] != -1) {
                    cout << "0\n";
                    return 0;
                }
            } else res = res * bin[m - buc[i] - 1] % p;
        cout << res << '\n';
    }
    return 0;
}
```

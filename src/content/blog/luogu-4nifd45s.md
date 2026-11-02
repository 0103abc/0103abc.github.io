---
title: "P16357 [BalticOI 2026] Blocks 题解"
date: "2026-04-29T06:59:10.000Z"
link: "luogu-4nifd45s"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造", "基础算法", "模拟"]
draft: false
---

注意到平均值在 $n\equiv 1\pmod 2$ 时是整数，$n\equiv 0\pmod 2$ 时是小数，因此容易想到利用这点性质进行分类讨论：

### $n\equiv 0\pmod 2$

此时平均值一定形如 $X+0.5$ 的形式。此时若一个值出现了奇数次，则其平均数一定不能被表示为 $X+0.5$ 的形式。此时剩下所有数均出现偶数次的情况，直接从两边往中间对称填数即可。

### $n\equiv 1\pmod 2$

比较复杂的情况。此时若一个数出现了一次，则该数必须在是序列的正中间位置才能满足条件，因此若存在多个数出现了一次则一定不存在合法解。

为了简化问题，若不存在出现一次的数，则找一个出现奇数次的数并将该数填在序列中间的位置让其变为出现偶数次。之后的讨论将不考虑中间位置的数的填写。

此时剩下的所有出现过的数都出现了超过一次。考虑先把出现 $2k+3$ 次的数归纳处理到到数字出现 $3$ 次的情况（归纳过程可以看作是把前 $2k$ 次出现直接看作偶数次出现然后直接匹配处理），而最后三个位置记为 $i,j,k$ 满足 $i<j<k$，则必须满足 $i+j+k=3mid$，其中 $mid$ 是序列中间的位置即 $\frac{n+1}2$。

考虑构造尽量多组这样的 $(i,j,k)$ 满足其恰好覆盖了区间 $[mid-x,mid)\cup(mid,mid+x]$ 内的所有下标。对出题人脑电波可以给出下面的构造：

+ **I 类三元组**：$(mid+i,mid+i+\frac k2,mid-2i-\frac k2)$
+ **II 类三元组**：$(mid-i,mid+2i-3\frac k2=1,mid-i+3\frac k2+1)$

可以构造恰好 $2k$ 个三元组。容易证明需要构造的三元组的数量必然是偶数个。简单分析可以发现该构造能够取满上界，因此是构造条件的充要条件，可以保证算法的正确性。

直接模拟上述算法可以做到时间复杂度 $O(n)$ 解决问题。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;

#define umap unordered_map
// #define umap __gnu_pbds::gp_hash_table

using ld = long double ;
using ull = unsigned long long;
using i128 = __int128;
constexpr int N = 1000010;
constexpr int infi = 1e9;
constexpr long long infll = 3e18;
constexpr int mod = 998244353;

inline void chkmax(int &x, int v) noexcept { if (x < v) x = v; }
inline void chkmin(int &x, int v) noexcept { if (x > v) x = v; }

int a[N], buc[N], res[N];

inline void sol() {
    int n, k; cin >> n >> k;
    for (int i = 1; i <= n; ++i) buc[i] = 0;
    for (int i = 1; i <= n; ++i) cin >> a[i], ++buc[a[i]];
    if (n % 2 == 0) {
        int ok = 1;
        for (int i = 1; i <= n; ++i)
            ok &= (buc[i] % 2 == 0);
        if (ok) {
            cout << "YES\n";
            int p1 = 0, p2 = n + 1;
            for (int i = 1; i <= n; ++i)
                for (int j = 0; j < buc[i]; j += 2)
                    res[++p1] = res[--p2] = i;
            for (int i = 1; i <= n; ++i) cout << res[i] << ' ';
            cout << '\n';
        } else cout << "NO\n";
    } else {
        int cnt_1 = 0;
        for (int i = 1; i <= n; ++i)
            if (buc[i] == 1) ++cnt_1;
        if (cnt_1 > 1) cout << "NO\n";
        else {
            int cnt = 0;
            for (int i = 1; i <= n; ++i)
                if (buc[i] & 1) ++cnt;
            if ((cnt & 1) && cnt - 1 <= n / 3) {
                cout << "YES\n";
                int id = -1;
                for (int i = 1; i <= n; ++i)
                    if (buc[i] == 1) { id = i; break; }
                if (!~id) for (int i = 1; i <= n; ++i)
                    if (buc[i] & 1) { id = i; break; }
                --buc[id], res[n / 2 + 1] = id;
                vector<int> odd;
                for (int i = 1; i <= n; ++i)
                    if (buc[i] & 1) odd.emplace_back(i);
                vector<tuple<int, int, int>> vec;
                for (int i = 1; i <= odd.size() / 2; ++i) {
                    vec.emplace_back(n / 2 + 1 + i, n / 2 + 1 + i + odd.size() / 2, n / 2 + 1 - 2 * i - odd.size() / 2);
                    vec.emplace_back(n / 2 + 1 - i, n / 2 - 3 * odd.size() / 2 + 2 * i, n / 2 + 3 * odd.size() / 2 - i + 2);
                }
                int pos = 0;
                for (auto &[x, y, z] : vec)
                    res[x] = res[y] = res[z] = odd[pos], buc[odd[pos++]] -= 3;
                int p1 = 0, p2 = n + 1;
                for (int i = 1; i <= n; ++i)
                    for (int j = 0; j < buc[i]; j += 2)
                        res[++p1] = res[--p2] = i;
                for (int i = 1; i <= n; ++i) cout << res[i] << ' ';
                cout << '\n';
            } else cout << "NO\n";
        }
    }
}

signed main() {
    std::cin.tie(0)->sync_with_stdio(false);
    int T; std::cin >> T;
    // int T = 1;
    while (T--) sol();
    std::cerr << "Time = " << clock() << '\n';
    return 0;
}

```

---
title: "P2145 [JSOI2007] 祖玛 题解"
date: "2026-07-24T14:16:54.000Z"
link: "luogu-9cwssnhg"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数学", "多项式"]
draft: false
---

> 管理员备注：本题可能是错题。
> 
> 2025.1.27 update：现在本题存在多项式解，但仍然无法在原数据范围下通过（UOJ941）。

$O(n^3)$ 做法，但是过了所有数据而且还过拍了，不知道对不对（疑似是对的），先写一下，欢迎来 hack。

考虑在某个位置射入一个珠子引发的连锁反应：她所在的同色珠子段因为射入珠子长度达到了 $\ge 3$ 会直接消失，之后其左右两端的两个同色珠子段会靠在一起，如果此时左右两侧的珠子颜色也相同而且长度的和 $\ge 3$ 则也会被消除，然后更靠外的同色珠子组又会靠在一起……以此类推。

一个准备参与上述连锁反应的同色珠子段只需要记录长度为 $1,2,\ge 3$ 三种情况即可（判断是否可以发生连锁反应只需要知道两侧航都的和是否至少为 $3$），而且稳定存在的长度 $\ge 3$ 的同色珠子段必须是原序列中本来就连续的同色珠子。因为长度为 $2$ 的珠子加入一个同色的珠子就会立即消失，而且两个同色珠子段合并后长度 $\ge 3$ 也同样会立即消失。

然后考虑开始区间 dp。设 $f_{l,r}$ 表示区间内完全消除 $[l,r]$ 区间内所有珠子，最少需要的操作数。但是只设这一个状态显然是无法抓你有的，因此考虑再多设几个状态：

+ $tl_{l,r}$：清空 $[l,r]$ 的最小总代价，并且存在一种操作顺序，使得最后一次触发的连锁反应，其最外层消失珠组的颜色为 $a_l$。
+ $tr_{l,r}$：清空 $[l,r]$ 的最小总代价，并且存在一种操作顺序，使得最后一次触发的连锁反应，其最外层消失珠组的颜色为 $a_r$。
+ $L_{t,l,r}$：消除 $[l,r]$ 中除某个左侧珠组外的所有原珠，最后留下一个包含原珠 $a_l$，颜色为 $a_l$，长度类型为 $t$ 的珠组所需要的最小代价，$t=1,2$ 表示长度为 $1,2$，$t=3$ 表示长度 $\ge 3$。
+ $R_{t,l,r}$：消除 $[l,r]$ 中除某个右侧珠组外的所有原珠，最后留下一个包含原珠 $a_r$，颜色为 $a_r$，长度类型为 $t$ 的珠组所需要的最小代价。$t$ 的含义和上面相同。

然后考虑 dp 转移：

+ 只留下区间 $[l,r]$ 内最左侧的一个珠子，消除其余部分的珠子：$L_{1,l,r}\leftarrow f_{l+1,r}$。
+ 只留下区间 $[l,r]$ 内包含 $a_l$ 的一个长度为 $2$ 的同色珠组，消除其余部分的珠子：
  + 在 $a_l$ 的旁边插入一个和 $a_l$ 颜色相同的珠子：$L_{2,l,r}\leftarrow f_{l+1,r}+1$。
  + 保留 $a_l$ 之后的某个和其同色的珠子 $a_i$，消除区间内其余所有珠子：$L_{2,l,r}\leftarrow f_{l+1,i-1}+f_{i+1,r}$。
+ 在区间 $[l,r]$ 左侧留下 $\ge 3$ 个珠子：这个情况只能来自原序列连续的同色前缀。如果 $a_l=a_{l+1}=a_{l+2}$ 则可以保留左侧连续的前三个珠子（或者更多），可以写一个简单的 dp 来转移：$L_{3,l,r}\leftarrow\min(L_{3,l+1,r},f_{l+3,r})$。

$R$ 数组这部分的转移和 $L$ 数组完全对称，因此不再赘述。

上面的转移情况显然是不够的，因为没有处理连锁反应的情况。考虑再继续维护更多的 dp 数组；

+ $\text{diff}_{c,l,r}$：清空 $[l,r]$ 的最小代价，并且可以安排操作顺序，使得最后一次所触发连锁的最外层颜色不等于 $c$。
  + 如果 $a_l\neq c$，则可以直接用 $tl_{l,r}$ 转移而来。
  + 如果 $a_r\neq c$，则可以直接用 $tr_{l,r}$ 转移而来。
  + 因为题目中可以插入任意颜色的珠子，因此还可以任意选择一个全新的颜色，在任意一个连锁反应段的外面加入三个这种颜色的珠子（例如：左边加入一个，右边加入两个），内部消失后这三个珠子同色因此合并后也会消失，也就似乎相当的与在外面套了一个全新的颜色。因此还可以从 $\min(tl_{l,r},tr_{l,r})+3$ 转移而来。
+ $A_{t,l,r}$：在区间 $[l,r]$ 中完成如下准备所需的最小代价：存在分界点 $k$，先把 $[l,k]$ 处理成一个包含 $a_l$、颜色为 $a_l$、长度类型为 $t$ 的珠组；然后由最后一次连锁反应使 $[k+1,r]$ 发生一个非空连锁，其最外层颜色不为 $a_l$。该内层连锁结束后，左侧珠组仍然保留，准备与更右侧的同色珠组构成下一层连锁。转移考虑枚举分界点 $k$，$A_{t,l,r}\leftarrow L_{t,l,k}+\text{diff}_{a_l,k+1,r}$。
+ $D_{t,l,r}$：和 $A$ 的定义对称，在区间 $[l,r]$ 中完成如下准备所需的最小代价：存在分界点 $k$，先把 $[k+1,r]$ 处理成一个包含 $a_r$、颜色为 $a_r$、长度类型为 $t$ 的珠组；然后由最后一次连锁反应使 $[l,k]$ 发生一个非空连锁，其最外层颜色不为 $a_r$。该内层连锁结束后，右侧珠组仍然保留，准备与更左侧的同色珠组构成下一层连锁。转移同样考虑枚举分界点 $k$，$D_{t,l,r}\leftarrow\text{diff}_{a_r,l,k}+R_{t,k+1,r}$。
+ $B_{t,l,r}$：某次最终连锁准备其左半部分的最小代价。最终一枪发生时，区间内先有一个非空内层结构消失；在它左侧保留一个颜色为 $a_l$、长度类型为 $t$ 的珠组。该珠组可以包含原珠 $a_l$，也可以完全由新插入的珠子组成。
  + 很显然 $B_{3,l,r}$ 只能直接继承 $A_{3,l,r}$ 的 dp 信息。
  + $B_{1,l,r}=\min(A_{1,l,r},f_{l,p-1}+\text{diff}_{a_l,p,r}+1)$。
  + $B_{2,l,r}=\min(A_{2,l,r},f_{l,p-1}+\text{diff}_{a_l,p,r}+2)$。
  + 对所有 $p$ 取最小值即可。

现在考虑转移 $tl$ 数组的 dp 信息。同样还是需要分类讨论：

先讨论一些比较简单的情况：

+ 区间内只有一个珠子：此时需要再插入两个同色的珠子，即 $tl_{l,r}=2$。
+ 区间两端珠子的颜色相同，即 $a_l=a_r$：可以先清空中间部分，然后再射入一个颜色相同的珠子，转移形如：$tl_{l,r}\leftarrow f_{l+1,r-1}+1$。
+ 整个区间本来就是连续的至少三个同色珠子组成的：显然有 $tl_{l,r}\leftarrow 1$。

然后讨论比较复杂的情况：

+ 右侧珠组完全由新增的珠子组成。先枚举转移点 $k$：
  + 左侧珠组长度为 $1$，则右侧至少需要两个珠子，贡献为 $A_{1,l,k}+2$。
  + 左侧珠组长度至少为 $2$，则右侧至少需要一个珠子，贡献为 $\min(A_{2,l,k},A_{3,l,k})+1$。
  + 剩下的 $[k+1,r]$ 不参与这段连锁反应过程，需要单独消除，贡献还需要增加 $f_{k+1,r}$。
+ 左右两侧都留下了珠组，需要保证左右两侧颜色相同即 $a_l=a_r$：
  + 左侧珠组长度为 $1$，贡献就是 $B_{1,l,k}+\min(R_{2,k+1,r},R_{3,k+1,r})$。
  + 左侧珠组长度至少为 $2$，贡献就是 $\min(B_{2,l,k},B_{3,l,k})+\min(R_{1,k+1,r},R_{2,k+1,r},R_{3,k+1,r})$。

$tr$ 数组的 dp 信息转移也是类似的，这里不再赘述。

最后考虑转移 $f$ 数组的 dp 信息：同样还是枚举转移点 $k$，先处理 $[l,k]$ 部分再处理 $[k+1,r]$ 部分信息，转移就是 $f_{l,r}=\min\limits_k(\min(tl_{l,k},tr_{l,k})+f_{k+1,r})$。最终的答案就是 $f_{1,n}$。

总时间复杂度为 $O(n^3)$，常数稍微有点大（我的实现有可能需要靠评测机波动通过）。实现起来细节特别特别特别多，感谢 gpt 姐姐愿意帮我调代码。

代码中 $\operatorname{calc}$ 函数实现了 $\operatorname{diff}$ 的功能，因此空间复杂度是 $O(n^2)$ 的。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <cassert>
#include <ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;

int beginmem;
constexpr int N = 1000010;
constexpr int mod = 998244353;
constexpr int i2 = mod + 1 >> 1;
constexpr int inf = 1e18;
using ld = long double;
using u32 = unsigned;
using u64 = unsigned long long;
using i128 = __int128;

inline int power(int a, int b, int c) {
    int sum = 1;
    while (b) {
        if (b & 1) sum = sum * a % c;
        a = a * a % c, b >>= 1;
    }
    return sum;
}

inline int exgcd(int a, int b, int &x, int &y) {
    if (!b) return x = 1, y = 0, a;
    int xp, yp, f = exgcd(b, a % b, xp, yp);
    return x = yp, y = xp - a / b * yp, f;
}

inline int inversion(int a, int Mod = mod) { return power(a, Mod - 2, Mod); }

inline u64 splitmix64(u64 x) {
    x += 0x9e3779b97f4a7c15ULL;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    return x ^ (x >> 31);
}

// 月が綺麗ねと言われたい

namespace lowspeed_song {

inline void init() {
}

int a[N], las[N];
int f[510][510], tl[510][510], tr[510][510], L[4][510][510], R[4][510][510], A[4][510][510], B[4][510][510], D[4][510][510];

inline int F(int l, int r) {
    if (l > r) return 0;
    return f[l][r];
}

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = n; i; --i)
        if (i < n && a[i] == a[i + 1]) las[i] = las[i + 1];
        else las[i] = i;
    memset(f, 0x3f, sizeof f);
    memset(tl, 0x3f, sizeof tl);
    memset(tr, 0x3f, sizeof tr);
    memset(L, 0x3f, sizeof L);
    memset(R, 0x3f, sizeof R);
    memset(A, 0x3f, sizeof A);
    memset(B, 0x3f, sizeof B);
    memset(D, 0x3f, sizeof D);
    function<int(int, int, int)> calc = [&](int c, int l, int r) {
        if (l > r) return inf;
        int res = min(tl[l][r], tr[l][r]) + 3;
        if (a[l] != c) res = min(res, tl[l][r]);
        if (a[r] != c) res = min(res, tr[l][r]);
        return res;
    };
    for (int len = 1; len <= n; ++len) {
        for (int l = 1, r = len; r <= n; ++l, ++r) {
            for (int k = l; k < r; ++k) for (int t = 1; t <= 3; ++t) A[t][l][r] = min(A[t][l][r], L[t][l][k] + calc(a[l], k + 1, r));
            for (int k = l; k < r; ++k)
                for (int t = 1; t <= 3; ++t) D[t][l][r] = min(D[t][l][r], calc(a[r], l, k) + R[t][k + 1][r]);
        }
        for (int l = 1, r = len; r <= n; ++l, ++r) {
            int x = inf, y = inf;
            if (len == 1) x = y = 2;
            else if (a[l] == a[r]) {
                x = y = F(l + 1, r - 1) + 1;
                if (len >= 3 && las[l] >= r) x = y = 1;
            }
            for (int k = l; k <= r; ++k) x = min(x, min(A[1][l][k] + 2, min(A[2][l][k], A[3][l][k]) + 1) + F(k + 1, r));
            if (a[l] == a[r]) {
                for (int k = l; k < r; ++k) {
                    int val = min(R[2][k + 1][r], R[3][k + 1][r]);
                    x = min(x, min(B[1][l][k] + val, min(B[2][l][k], B[3][l][k]) + min(R[1][k + 1][r], val)));
                }
                y = x;
            } else {
                for (int p = l; p <= r; ++p) y = min(y, F(l, p - 1) + min(D[1][p][r] + 2, min(D[2][p][r], D[3][p][r]) + 1));
            } tl[l][r] = x, tr[l][r] = y;
        }
        for (int l = 1, r = len; r <= n; ++l, ++r)
            for (int k = l; k <= r; ++k) f[l][r] = min(f[l][r], min(tl[l][k], tr[l][k]) + F(k + 1, r));
        for (int l = 1, r = len; r <= n; ++l, ++r) {
            L[1][l][r] = F(l + 1, r), L[2][l][r] = F(l + 1, r) + 1;
            for (int i = l + 1; i <= r; ++i)
                if (a[i] == a[l]) L[2][l][r] = min(L[2][l][r], F(l + 1, i - 1) + F(i + 1, r));
            if (len >= 3 && a[l] == a[l + 1] && a[l] == a[l + 2]) L[3][l][r] = min(F(l + 3, r), L[3][l + 1][r]);
            R[1][l][r] = F(l, r - 1), R[2][l][r] = F(l, r - 1) + 1;
            for (int i = l; i < r; ++i)
                if (a[i] == a[r]) R[2][l][r] = min(R[2][l][r], F(l, i - 1) + F(i + 1, r - 1));
            if (len >= 3 && a[r] == a[r - 1] && a[r] == a[r - 2]) R[3][l][r] = min(F(l, r - 3), R[3][l][r - 1]);
        }
        for (int l = 1, r = len; r <= n; ++l, ++r) {
            for (int t = 1; t <= 3; ++t) B[t][l][r] = A[t][l][r];
            for (int p = l; p <= r; ++p) {
                int val = F(l, p - 1) + calc(a[l], p, r);
                B[1][l][r] = min(B[1][l][r], val + 1), B[2][l][r] = min(B[2][l][r], val + 2);
            }
        }
    }
    cout << f[1][n] << '\n';
}

} // namespace lowspeed_song

int endmem;

signed main() {
    // freopen("toy.in", "r", stdin);
    // freopen("toy.out", "w", stdout);
    srand(time(0));
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    cerr << fixed << setprecision(5);
    // int c; cin >> c;
    int T = 1;
    // cin >> T;
    lowspeed_song::init();
    for (int ca = 1; ca <= T; ++ca) lowspeed_song::sol();
    cerr << "Memory Used " << abs(&beginmem - &endmem) / 1048576. << " MB.\n";
    return 0;
}

```

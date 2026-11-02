---
title: "CF1239B The World Is Just a Programming Task (Hard Version) 题解"
date: "2026-07-21T01:23:26.000Z"
link: "luogu-ylhu0yw9"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "前缀和", "字符串", "二分"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ylhu0yw9)。

特判掉序列中左括号和右括号出现次数不同的情况。

套路的把左括号 `(` 看作 $1$，右括号 `)` 看作 $-1$。因为处理的信息是字符串的所有循环移位，因此考虑把字符串旋转成从前缀和最小值处开始的循环移位。

如果不交换字符的话答案就是前缀和数组中最小值出现次数的数量。现在考虑交换两个字符对答案的影响。设交换的两个位置下标分别为 $i,j$（$i\le j$），则需要分类讨论其对前缀和数组的影响：

+ $s_i$ 和 $s_j$ 括号类别相同：不会对答案产生任何影响。
+ $s_i$ 是左括号，$s_j$ 是右括号：交换后可以让 $[i,j)$ 范围内所有元素的前缀和值都减 $2$。此时需要对新的序列的最小值进一步分类讨论：
  + 若 $[i,j)$ 范围内所有元素的前缀和值原来都 $\ge 2$，则操作结束后新的序列的前缀和最小值仍然为 $0$，答案就可以被表示为原来前缀和序列中 $0$ 的数量加上 $[i,j)$ 范围内前缀和序列中 $2$ 的数量。
  + 若 $[i,j)$ 范围中所有元素的前缀和最小值为 $1$，则操作结束后新的序列的前缀和最小值变为 $-1$，答案就可以表示为 $[i,j)$ 范围内前缀和序列中 $1$ 的数量。
  + 若 $[i,j)$ 范围中所有元素的前缀和最小值为 $0$，则操作结束后新的序列的前缀和最小值变为 $-2$，答案就可以表示为 $[i,j)$ 范围内前缀和序列中 $0$ 的数量。容易发现该情况一定是不优的，无需考虑。
+ $s_i$ 是右括号，$s_j$ 是左括号：交换后可以让 $[i,j)$ 范围内所有元素的前缀和值都加 $2$，前缀和序列的最小值不会变化仍然为 $0$。此时 $0$ 的个数一定不会增加（但是有可能会减少），因此该情况一定不优，无需处理。

通过上面的分析可知，除了不操作以外，操作的 $i,j$ 两个位置一定满足 $i$ 是左括号，$j$ 是右括号，且 $[i,j)$ 范围内的前缀和元素的值都 $>0$。此时直接枚举这两个位置可以做到 $O(n^2)$ 时间复杂度解决问题，需要进一步优化。

考虑再次对 $[i,j)$ 范围内前缀和最小值分类讨论。

+ 若 $[i,j)$ 范围内前缀和最小值为 $1$，则此时答案就是该区间内前缀和中 $1$ 出现的次数。枚举左端点 $i$，找到最大的右端点 $j$ 满足 $s_j$ 是右括号且 $[i,j)$ 区间内前缀和的最小值恰好为 $1$ 即可，这个部分可以用 ST 表维护一下静态区间前缀和最小值然后二分 $j$ 得到。
+ 若 $[i,j)$ 范围内前缀和最小值 $\ge 2$，则此时因为 $[i,j)$ 范围内没有元素的前缀和值为 $0$，因此答案还可以被表示为原序列中前缀和值为 $0$ 的元素加上区间内前缀和值为 $2$ 的元素个数。同样枚举左端点 $i$ 而分出右端点 $j$ 即可。

总时间复杂度为 $O(n\log n)$，可以通过该题。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
    
}

char s[N], b[N];
int pre[N], f[N][20], lg[N];
int pre0[N], pre1[N], pre2[N];
inline int qry(int l, int r) {
    int lgx = lg[r - l + 1];
    return min(f[l][lgx], f[r - (1 << lgx) + 1][lgx]);
}

inline void sol() {
    int n, idx = 0; cin >> n;
    scanf("%s", s + 1);
    for (int i = 1; i <= n; ++i) {
        if (s[i] == '(') pre[i] = pre[i - 1] + 1;
        else pre[i] = pre[i - 1] - 1;
    } if (pre[n]) { cout << "0\n1 1\n"; return; }
    int id = min_element(pre, pre + n) - pre + 1;
    for (int i = id; i <= n; ++i) b[++idx] = s[i];
    for (int i = 1; i < id; ++i) b[++idx] = s[i];
    for (int i = 1; i <= n; ++i) s[i] = b[i];
    // cout << "debug: "; puts(s + 1);
    for (int i = 1; i <= n; ++i)
        if (s[i] == '(') pre[i] = pre[i - 1] + 1;
        else pre[i] = pre[i - 1] - 1;
    lg[0] = -1; for (int i = 1; i <= n + 1; ++i) lg[i] = lg[i >> 1] + 1;
    for (int i = 0; i <= n; ++i) f[i][0] = pre[i];
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= n - (1 << i) + 1; ++j)
            f[j][i] = min(f[j][i - 1], f[j + (1 << (i - 1))][i - 1]);
    for (int i = 1; i <= n; ++i) {
        pre0[i] = pre0[i - 1], pre1[i] = pre1[i - 1], pre2[i] = pre2[i - 1];
        if (pre[i] == 0) ++pre0[i];
        else if (pre[i] == 1) ++pre1[i];
        else if (pre[i] == 2) ++pre2[i];
    } int lasR = n, res = pre0[n], ll = 1, rr = 1;
    while (s[lasR] == '(') --lasR;
    for (int i = 1; i < lasR; ++i)
        if (s[i] == '(') {
            if (pre[i] >= 2) {
                int l = i + 1, r = lasR, best = -1;
                while (l <= r) {
                    int mid = l + r >> 1;
                    if (qry(i, mid - 1) >= 2) best = mid, l = mid + 1;
                    else r = mid - 1;
                } if (~best) {
                    assert(s[best] == ')');
                    int val = pre0[n] + pre2[best - 1] - pre2[i - 1];
                    if (val > res) res = val, ll = best, rr = i;
                }
            }
            if (pre[i] >= 1) {
                int l = i + 1, r = lasR, best = -1;
                while (l <= r) {
                    int mid = l + r >> 1;
                    if (qry(i, mid - 1) >= 1) best = mid, l = mid + 1;
                    else r = mid - 1;
                } if (~best) {
                    assert(s[best] == ')');
                    int val = pre1[best - 1] - pre1[i - 1];
                    if (val > res) res = val, ll = best, rr = i;
                }
            }
        }
    ll += id - 1, rr += id - 1;
    if (ll > n) ll -= n;
    if (rr > n) rr -= n;
    if (ll <= 0) ll += n;
    if (rr <= 0) rr += n;
    cout << res << '\n' << ll << ' ' << rr << '\n';
}

} // namespace lowspeed_song
```
:::

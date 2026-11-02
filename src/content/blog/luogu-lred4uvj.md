---
title: "CF2089D Conditional Operators 题解"
date: "2025-04-22T14:43:27.000Z"
link: "luogu-lred4uvj"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造", "字符串"]
draft: false
---

upd：我觉得我题解格式没问题的啊（

**请务必注意 本题解中下标从 $0$ 开始。**

首先 $n$ 很小的情况会有一叠的 conner case 让人头疼，因此这个时候~~直接暴搜即可。~~ 有个更简单的做法是直接特殊情况全都判掉（搜太难写的/kk）。

### 当所有字符均为 $0$ 时：

很显然无解。

### 当前两个字符为 $11$ 时：

直接按照顺序构造三目运算符，形如：`a[0]?a[1]:(a[2]?a[3]:a[4])`。容易发现设从 $a_2$ 开始到 $a_{2n}$ 一段表达式的值为 $x$，则此时表达式形如：`1?1:x`，很显然这个表达式的值为 $1$，因此得到合法解。

### 当第一个字符为 $1$ 时：

此时字符串前两个位置必须为 $10$。继续分类讨论结尾字符的情况：

#### 当最后一个字符为 $1$ 时：

把前三个字符构造三目运算符即 `a[0]?a[1]:a[2]` 即 `1?0:a[2]`，很显然这个表达式的值为 $0$。此时得到一个长度奇数，$0$ 开头 $1$ 结尾的字符串。

考虑对这样的字符串进行构造：把除了第一个和最后一个位置以外的位置按照顺序构造三目运算符。显然这个值不可控，设这个值为 $x$，那么最终状态形如 `a[0]=0,a[1]=x,a[2]=1`，构造三目运算符得到 `0?x:1`，很显然这个值为 $1$，因此构造完成。

#### 当最后一个字符为 $0$ 时：

看上去没有前面那么好处理了，考虑继续分类讨论：

+ 存在位置 $i$ 满足 $2\nmid i$，满足 `a[i]=1`，那么把最前面的一个位置保留，从 `a[1]` 开始处理到 `a[i-1]` 构造三目运算符。执行完这个操作之后前两个字符必然形如 $11$，这个情况前面讨论过了。
+ 否则，容易证明必然不存在合法解。

### 当第一个字符为 $0$ 时：

还是得分讨啊/生气了！

#### 当最后一个字符为 $1$ 时：

终于又回到了简单情况！

考虑把除了第一个和最后一个位置以外的位置按照顺序构造三目运算符。显然这个值不可控，设这个值为 $x$，那么最终状态形如 `a[0]=0,a[1]=x,a[2]=1`，构造三目运算符得到 `0?x:1`，很显然这个值为 $1$，因此构造完成。

#### 当最后一个字符为 $0$ 时：

发现这个时候没有什么容易的性质，因此用搜玩了若干组数据之后发现：

+ 若此时存在一个下标 $i$ 使得 $2\mid i$ 使得 `a[i]=1`，且继续存在一个下标 $j$ 使得 $2\nmid j,j>i$ 且 `a[j]=1`，那么合法，否则一定不合法！
+ 更清晰的说，存在偶数下标 $i$ 使得其后面存在奇数下标 $j$ 满足 `a[i]=1` 且 `a[j]=1` 则合法，否则不合法。

那么对于合法的情况考虑构造出一个解。容易找出第一个合法的 $i$ 和 $i$ 后面第一个合法的 $j$，那么就直接按照顺序分别对 $0\sim i$ 和 $i+1\sim j$ 两个部分构造出 $1$（这个上面已经讨论过了），这样前两个字符变为 $11$，这个情况也讨论过了。于是这个题做完了，后面就是可♂爱♀的 implementation 时间啦！

```cpp
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/rope>
#define int long long
using namespace std;
// const int N = 500010;
const int inf = 2e18;
using ull = unsigned long long;
template<class _T>
using treap = __gnu_pbds::tree<_T, __gnu_pbds::null_type, less_equal<_T>, __gnu_pbds::rb_tree_tag, __gnu_pbds::tree_order_statistics_node_update>;
using POD = pair<double, double>;
const double pi = acos(-1);
using cauto = complex<double>;
const int N = 1000010;
const int mod = 1e9 + 7;
const ull base = 218105633;
char s[N];
signed main() {
    // freopen("count.in", "r", stdin);
    // freopen("count.out", "w", stdout);
    // freopen("debug.err", "w", stderr);
    // cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    srand(time(0));
    int T = 1;
    cin >> T;
    int tc = T, ca = 1;
    while (T--) {
        int n;
        cin >> n;
        scanf("%s", s);
        // if (tc > 100 && ca++ == 77) {
        //     puts(s);
        //     return 0;
        // } else if (tc > 100) continue;
        if (count(s, s + n + n + 1, '0') == n + n + 1) {
            cout << "No\n";
        } else {
            if (n == 1) {
                if (s[0] == '1' && s[1] == '1' && s[2] == '0') {
                    cout << "Yes\n";
                    cout << "1?1:0\n";
                    continue;
                } else if (s[0] == '1' && s[1] == '1' && s[2] == '1') {
                    cout << "Yes\n";
                    cout << "1?1:1\n";
                    continue;
                } else if (s[0] == '1' && s[1] == '0' && s[2] == '1') {
                    cout << "No\n";
                    continue;
                }
            }
            if (s[0] == '1') {
                if (s[1] == '1') {
                    cout << "Yes\n";
                    int idx = 0;
                    for (int i = 0; i < n + n; i += 2) cout << s[i] << "?" << s[i + 1] << ":(", ++idx;
                    cout << s[n + n];
                    for (int i = 0; i < idx; ++i) cout << ")";
                    cout << '\n';
                } else {
                    if (s[n + n] == '1') {
                        cout << "Yes\n";
                        cout << "(" << s[0] << "?" << s[1] << ":" << s[2] << ")?(";
                        for (int i = 3; i < n + n - 1; i += 2) cout << s[i] << "?" << s[i + 1] << ":";
                        cout << s[n + n - 1] << "):" << s[n + n] << '\n';
                    } else {
                        int pos = -1;
                        for (int i = 1; i <= n + n; i += 2)
                            if (s[i] == '1') {
                                pos = i;
                                break;
                            }
                        if (~pos) {
                            cout << "Yes\n";
                            int idx = 1;
                            cout << s[0] << "?(";
                            for (int i = 1; i < pos; i += 2) cout << s[i] << "?" << s[i + 1] << ":(", ++idx;
                            cout << s[pos];
                            for (int i = 0; i < idx; ++i) cout << ")";
                            cout << ":(";
                            idx = 1;
                            for (int i = pos + 1; i < n + n; i += 2) cout << s[i] << "?" << s[i + 1] << ":(", ++idx;
                            cout << s[n + n];
                            for (int i = 0; i < idx; ++i) cout << ")";
                            cout << '\n';
                        } else {
                            cout << "No\n";
                        }
                    }
                }
            } else {
                if (s[n + n] == '1') {
                    cout << "Yes\n";
                    cout << s[0] << "?(";
                    for (int i = 1; i < n + n - 1; i += 2) cout << s[i] << "?" << s[i + 1] << ":";
                    cout << s[n + n - 1] << "):" << s[n + n] << '\n';
                } else {
                    int ii = -1, jj = -1;
                    vector<int> v;
                    for (int i = 2; i < n + n; ++i)
                        if (s[i] == '1') v.emplace_back(i);
                    if (v.size() < 2) {
                        cout << "No\n";
                    } else {
                        int ok = 0;
                        for (int &i : v) {
                            if (ok == 2) break;
                            if (!ok) {
                                if (i % 2 == 0) {
                                    ii = i;
                                    ok = 1;
                                }
                            } else {
                                if (i % 2 == 1) {
                                    jj = i;
                                    ok = 2;
                                }
                            }
                        }
                        // cout << ii << ' ' << jj << '\n';
                        if (ok != 2) {
                            cout << "No\n";
                            continue;
                        }
                        cout << "Yes\n";
                        cout << "(";
                        if (ii) {
                            for (int i = 0; i < ii; i += 2) cout << s[i] << "?" << s[i + 1] << ":";
                            cout << s[ii] << ")?";
                        } else cout << s[ii] << ")?";
                        if (jj - ii > 1) {
                            cout << "(";
                            for (int i = ii + 1; i < jj; i += 2) cout << s[i] << "?" << s[i + 1] << ":";
                            cout << s[ii] << "):(";
                        } else cout << s[jj] << ":(";
                        for (int i = jj + 1; i < n + n; i += 2) cout << s[i] << "?" << s[i + 1] << ":";
                        cout << s[n + n];
                        cout << ")\n";
                    }
                }
            }
        }
    }
    return 0;
}
```

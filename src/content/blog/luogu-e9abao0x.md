---
title: "CF837E Vasya's Function 题解"
date: "2025-02-26T02:13:53.000Z"
link: "luogu-e9abao0x"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论", "基础算法", "模拟"]
draft: false
---

可以证明下面的等式成立：

$$
f(a,b)=f(a/\gcd(a,b),b/\gcd(a,b))
$$

于是问题就变得简单了。首先先对 $a,b$ 进行操作直到 $\text{gcd}(a,b)=1$ ，然后分类讨论：

+ 若此时 $b=0$，则无需进行任何操作，返回 $0$ 。
+ 若此时 $b=1$，则只需要进行一次操作，返回 $1$ 。
+ 否则，需要一直执行 $b$ 减少 $1$ 的操作，直到第一次 $\text{gcd}(a,b)\neq 1$ 。找到第一个这样的 $b$ 是容易的。只需要对 $a$ 分解质因数，枚举 $a$ 的每一个质因子，并计算至少需要减少多少次，才可以使得 $b$ 是这个质因子的倍数。将上述所有答案取 $\min$ 就是该部分的答案。

可以证明，每一次操作结束后， $a,b$ 两数都要同时除以 $\text{gcd}(a,b)$ ，而操作完后 $\gcd(a,b)$ 至少为 $2$，也就是说最多执行 $O(\text{gcd}\max(a,b))$ 次操作， $b$ 元素的值就会 $\le 1$ 。直接暴力模拟就可以通过该问题。

```cpp
#pragma GCC optimize(3, "Ofast", "inline")
#include <bits/stdc++.h>
#define int long long
using namespace std;
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    cerr << fixed << setprecision(5);
    int x, y;
    cin >> x >> y;
    if (!y) cout << "0\n";
    else if (y == 1) cout << "1\n";
    else if (x == 1) cout << y << '\n';
    else {
        int g = __gcd(x, y);
        x /= g, y /= g;
        if (y == 1) cout << "1\n";
        else {
            int cnt = 0;
            while (y > 1) {
                vector<int> div;
                int xx = x;
                for (int i = 2; i * i <= xx; ++i)
                    if (xx % i == 0) {
                        while (xx % i == 0) xx /= i;
                        div.emplace_back(i);
                    }
                if (xx > 1) div.emplace_back(xx);
                int res = 1e18;
                for (int &i : div) res = min(res, y % i);
                cnt += res;
                y -= res;
                int g = __gcd(x, y);
                x /= g, y /= g;
                if (x == 1) {
                    cnt += y;
                    y = 2;
                    break;
                }
            }
            if (y == 1) ++cnt;
            cout << cnt << '\n';
        }
    }
    return 0;
}
```

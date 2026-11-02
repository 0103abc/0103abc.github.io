---
title: "CF1712E1 LCM Sum (easy version) 题解"
date: "2024-12-14T16:27:46.000Z"
link: "luogu-75trwr3m"
categories: ["题解"]
tags: ["Codeforces", "数学", "组合数学", "基础算法", "二分"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/75trwr3m)。

简单容斥题。考虑到 $\text{lcm}(i,j,k)\ge i+j+k$ 不好做，于是可以求 $\text{lcm}(i,j,k)<i+j+k$ 的不同方案数。因为 $i<j<k$ 所以枚举 $k$，必有 $i+j+k<k+k+k=3k$。也就是说有且仅有下面的两种合法情况：

+ $\text{lcm}(i,j,k)=k$
+ $\text{lcm}(i,j,k)=2k$

考虑分别计算其对答案的贡献。先考虑第一类情况：显然可以枚举 $k$，然后询问有多少组 $(i,j)$ 满足 $l\le i<j<k$ 且 $i\mid k,j\mid k$。因为 $k$ 的因数个数很少，所以直接暴力算出因数个数 $c$，那么不同的合法 $(i,j)$ 组数就是 $\binom{c}{2}$。

~~让我们来偷一张图：~~

![](https://cdn.luogu.com.cn/upload/image_hosting/kjxzlo2c.png)

然后考虑第二类情况。这个看起来很困难，但是容易猜到合法的 $(i,j,k)$ 组数很少。于是写一个 $O(n^3)$ 暴力可以发现当且仅当 $i:j:k=3:4:6$ 或 $i:j:k=6:10:15$ 时合法。所以直接写一个二分即可通过该问题。

upd：我糖了，我忘记了世界上有个东西叫做除法.jpg

```cpp
int b3(int x) {
    return x * (x-1) * (x-2) / 6;
}
int b2(int x) {
    return x * (x-1) / 2;
}
void run() {
    int T = read();
    while (T--) {
        int l = read(), r = read();
        int len = r - l + 1;
        int all = b3(len);
        int c1 = 0, c2 = 0;
        // 3:4:6
        int L = 1, R = r, best = -1;
        while (L <= R) {
            int mid = L + R >> 1;
            if (3 * mid >= l && 4 * mid >= l && 6 * mid >= l)
                best = mid, R = mid - 1;
            else
                L = mid + 1;
        }
        if (best != -1) {
            int tl = best;
            L = 1, R = r, best = -1;
            while (L <= R) {
                int mid = L + R >> 1;
                if (3 * mid <= r && 4 * mid <= r && 6 * mid <= r)
                    best = mid, L = mid + 1;
                else
                    R = mid - 1;
            }
            if (best != -1) {
                int tr = best;
                c1 += max(0ll, tr - tl + 1);
            }
        }
        // 6:10:15
        L = 1, R = r, best = -1;
        while (L <= R) {
            int mid = L + R >> 1;
            if (6 * mid >= l && 10 * mid >= l && 15 * mid >= l)
                best = mid, R = mid - 1;
            else
                L = mid + 1;
        }
        if (best != -1) {
            int tl = best;
            L = 1, R = r, best = -1;
            while (L <= R) {
                int mid = L + R >> 1;
                if (6 * mid <= r && 10 * mid <= r && 15 * mid <= r)
                    best = mid, L = mid + 1;
                else
                    R = mid - 1;
            }
            if (best != -1) {
                int tr = best;
                c1 += max(0ll, tr - tl + 1);
            }
        }
        for (int i = l + 2; i <= r; ++i) {
            int divs = 0;
            for (int j = 1; j * j <= i; ++j)
                if (i % j == 0) {
                    if (j >= l && j < i) ++divs;
                    if (j * j != i && i / j != i && i / j >= l && i / j < i) ++divs;
                }
            c2 += b2(divs);
        }
        cout << all - c1 - c2 << '\n';
    }
} 
```

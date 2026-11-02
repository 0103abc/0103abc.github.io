---
title: "CF2036G Library of Magic 题解"
date: "2024-11-03T07:03:29.000Z"
link: "luogu-8ypwwbtq"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分", "贪心"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/8ypwwbtq)。

XorForces。每日被 Hack。

首先考虑异或的性质：

**壹** 若 $x\oplus y=0$，则 $x=y$。

**壹.证明** 若 $x\oplus y=0$，则 $x$ 和 $y$ 二进制表示下每一位的值都相同，显然只有两个数完全相同时才能有这样的性质。因此得证。

**贰** 若 $x\oplus y\neq0$，则 $x\neq y$。

**贰.证明** 若 $x\oplus y\neq 0$，则令 $z=x\oplus y$ 且 $z$ 的第 $i$ 位的值不为 $0$。此时 $x$ 的第 $i$ 位的值和 $y$ 的第 $i$ 位的值不同。因此 $x$ 和 $y$ 的值不能相等。因此得证。

**叁** 若 $x\oplus y\oplus z=0$ 且 $x,y,z$ 互不相同，则钦定 $x<y<z$，设 $\text{High}(x)$ 表示 $x$ 二进制表示下最高的为 $1$ 位是第几位。则必有 $\text{High}(x)<\text{High}(y)=\text{High}(z)$。

**叁.证明**

首先 $\text{High}(x)$ 函数在 $x\in\mathbb{N}$ 上单调不递减。证明显然。

若 $\text{High}(y)<\text{High}(z)$，则 $\text{High}(z)$ 位上必然只有一个 $1$，异或完后这一位的值还是 $1$，无法清零。若 $\text{High}(x)=\text{High}(y)=\text{High}(z)$ 则 $\text{High}(z)$ 位上必然有 $3$ 个 $1$，无法清零。因此当且仅当 $\text{High}(x)<\text{High}(y)=\text{High}(z)$ 时 $\text{High}(z)$ 位有 $2$ 个 $1$ 可以清零，**有可能**满足 $x\oplus y\oplus z=0$ 的条件。

------

考虑开始做这个题。令三个只有一次出现的数的值分别为 $A,B,C$ 并满足 $A<B<C$。则：

+ $\text{xor}(1,n)\neq 0$ 即 $A\oplus B\oplus C\neq0$。则此时在给定集合 $S=\lbrace A,B,C\rbrace$ 中任选子集 $S'\sube S$ 且 $S'\neq\emptyset$，均满足 $S'_0\oplus S'_1\oplus\ldots\oplus S'_{k-1}\neq 0$（$k=|S'|$）。因此直接在值域上先后以前缀 / 后缀二分答案，可以在 $2\log V$ 次询问内得出结果。然后询问 $[A+1,C-1]$ 这个值域区间，即可以得到 $B$ 的值。
+ $\text{xor}(1,n)=0$ 即 $A\oplus B\oplus C=0$。则此时上面的贪心二分做法显然可以被 hack 掉。根据上面的**结论叁**可以得知若 $A\oplus B\oplus C=0$ 且 $A<B<C$ 则 $\text{High}(A)<\text{High}(B)=\text{High}(C)$。因此考虑 $\log V$ 次询问按位枚举得到 $A$ 的最高位。此时该前缀值域内有且仅有 $A$ 一个元素。然后一次询问得到 $A$ 的值。剩下的后缀值域区间内有 $B$，$C$ 两个不相同的元素且满足 $B<C$。因此直接在后缀值域的前缀上贪心二分 $\log V$ 次询问找出 $B$ 的值，随后对剩余的后缀值域一次询问得出 $C$ 的值即可。

总询问次数为 $2\log V\approx 120$ 级别，附带常数不超过 $2$，总询问次数最多为 $120+2=122<150$ 次，可以通过问题。

代码：

```cpp
namespace ttq012 {

int op(int x) {
    if (x % 4 == 0) {
        return x;
    } else if (x % 4 == 1) {
        return 1;
    } else if (x % 4 == 2) {
        return x + 1;
    } else {
        return 0;
    }
}
int calc(int l, int r) {
    return op(l - 1) ^ op(r);
}
mt19937_64 mt(time(0));
int n;
void run() {
    int T = read();
    while (T--) {
        n = read();
        cout << "xor 1 " << n << endl;
        int o ; cin >> o;
        vector<int> result;
        if (o != 0) {
            int l = 1, r = n, best = -1;
            while (l <= r) {
                int mid = l + r >> 1;
                cout << "xor 1 " << mid << endl;
                int o ; cin >> o;
                if (!o) {
                    l = mid + 1;
                } else {
                    r = mid - 1, best = mid;
                }
            }
            assert(~best);
            result.eb(best);
            l = 1, r = n, best = -1;
            while (l <= r) {
                int mid = l + r >> 1;
                cout << "xor " << mid << ' ' << n << endl;
                int o ; cin >> o;
                if (!o) {
                    r = mid - 1;
                } else {
                    l = mid + 1, best = mid;
                }
            }
            assert(~best);
            result.eb(best);
            cout << "xor " << result[0] + 1 << ' ' << result[1] - 1 << endl;
            int o ; cin >> o;
            result.eb(o);
        } else {
            int now = 0;
            for (int i = 60; ~i; --i) {
                if (now + (1ll << i) - 1 <= n) {
                    cout << "xor 1 " << now + (1ll << i) - 1 << endl;
                    int o ; cin >> o;
                    if (o) {
                        now = 1ll << i;
                        break;
                    }
                }
            }
            --now;
            cout << "xor " << 1 << ' ' << now << endl;
            cin >> now;
            result.eb(now);
            int l = now + 1, r = n, best = -1;
            while (l <= r) {
                int mid = l + r >> 1;
                cout << "xor " << now + 1 << ' ' << mid << endl;
                int o ; cin >> o;
                if (!o) {
                    l = mid + 1;
                } else {
                    r = mid - 1, best = mid;
                }
            }
            result.eb(best);
            cout << "xor " << result[1] + 1 << ' ' << n << endl;
            int o ; cin >> o;
            result.eb(o);
        }
        cout << "ans ";
        sort(result.begin(), result.end());
        for (auto &x : result) {
            cout << x << ' ';
        }
        cout << endl;
    }
}

}


signed main() {
    ttq012::run();
    return 0;
}

/*



*/
```

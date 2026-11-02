---
title: "P9920 「RiOI-3」变换，反演 题解"
date: "2025-11-18T15:46:25.000Z"
link: "luogu-5ktdnuwk"
categories: ["题解"]
tags: ["洛谷", "数学", "数论", "多项式", "算法思想", "构造"]
draft: false
---

选自 [11 月做题笔记](https://www.luogu.com.cn/article/obgeyrgs)。

~~NTT 练的不少了，换点反演练（）~~ 事实上可能不太算反演（）

#### Subtask 1

注意到 $g(n)=d(n)$，此时有 $f(n)=\sum\limits_{d\mid n}\mu(d)d(\frac nd)=1$。

考虑证明该结论。上面这个东西是 $\mu$ 函数和 $d$ 函数的狄利克雷卷积，众所周知 $\mu$ 和 $d$ 都是积性函数，所以 $f(n)=\mu * d$ 也同样是积性函数。根据经典套路可知，积性函数只需要求出 $f(p)$（$p$ 是质数）的值就可以直接推出其他所有值（例题：CBC013E，给定 $k$ 求所有 $i^k$ 的值，$f(x)=x^k$ 是完全积性函数，可以通过筛出质数位置的值然后递推出来）

而 $f(p)$ 的值是容易计算的。显然有 $f(p)=\mu(1)d(p)+\mu(p)d(1)=2-1=1$，$f(1)=1$，然后容易递推出 $f(p^k)=1$ 进一步得出 $f(p_1^{\alpha_1}p_2^{\alpha_2}\ldots p_k^{\alpha_k})=1$。因此直接输出 $1$ 即可。

#### Subtask 2

注意到 $g(1)=0$，根据定义可以计算出 $f(1)=0$，又因为 $f$ 是积性函数，所以有 $f(k)=f(1)f(k)=0$，输出 $0$ 即可。

#### Subtask 0

注意到 $g(n)=\epsilon(n)=[n=1]$，此时有经典结论，$\sum\limits_{d\mid n}\mu(d)\epsilon(\frac nd)=\mu(n)$，直接暴力算 $\mu(n)$ 即可。

#### Subtask 3

注意到 $n$ 的范围只有 $10^5$，然后题目还把 $g(n)$ 的前 $10^5$ 项的值全部给出了，因此想到直接上 Mobius 反演，得到 $f(n)=\sum\limits_{d\mid n}\mu(\frac nd)g(d)$ 可以线性筛出 $\mu$ 然后直接调和计数暴力算，做到 $O(n\log n)$ 求解。

#### Subtask 5

把给出的 $g$ 项暴力反演之后，注意到有 $f(p^k)=p^{2k-1}$，所以直接暴力分解 $n$ 的质因数，然后对每一项分别算答案即可。

#### Subtask 8

什么叫只给了 $g(2)=2,g(3)=1,g(4)=3,g(7)=2$（）

先反演一下，可以得到 $f(2)=1,f(3)=0,f(4)=1,f(6)=0,f(7)=1$，然后根据定义可以得到 $f(1)=1$。

直接大胆猜测 $f(n)=n^2\bmod 3$，交上去发现过了。

其实可以构造出其他满足条件的 $f$ 的，这里给出一个例子：

+ $f(1)=1$
+ $f(2^k)=1$
+ $f(7^k)=1$
+ $f(p^k)=0$（$p\in\text{prime}\land p\neq 2\land p\neq 7$）

#### Subtask 6

注意到此时有 $g(n)=n^2$，也就是有 $f(n)=\sum\limits_{d\mid n}\mu(d)(\frac nd)^2=n^2\sum\limits_{d\mid n}\mu(d)\frac1{d^2}$。

因为 $\mu$ 和 $h(n)=\frac1{n^2}$ 都是积性函数，因此 $\mu$ 和 $h$ 的狄利克雷卷积 $f(n)$ 也同样是积性函数，此时只需要计算出 $f(p)$ 的值即可。

考虑从 $g$ 入手推出 $f$ 的式子，此时有 $g(p^k)=(p^k)^2=p^{2k}=\sum\limits_{i=0}^kf(p^i)$，移项可得 $f(p^i)=p^{2k}-\sum\limits_{i=0}^{k-1}f(p^i)=p^{2k}-g(p^{k-1})=p^{2k}-p^{2k-2}$。

根据积性函数的性质可知 $f(p_1^{\alpha_1}p_2^{\alpha_2}\ldots p_k^{\alpha_k})=f(p_1^{\alpha_1})f(p_2^{\alpha_2})\ldots f(p_k^{\alpha_k})=(p^{2\alpha_1}-p^{2\alpha_1-2})(p^{2\alpha_2}-p^{2\alpha_2-2})\ldots(p^{2\alpha_k}-p^{2\alpha_k-2})$，使用 Pollard-rho 分解质因数然后直接算即可，时间复杂度为 $O(Tn^{\frac14})$。

#### Subtask 4

反演一次什么信息也得不到，于是考虑二次反演。注意到此时二次反演得到的函数 $h(x)$ 满足 $h(x)=\varphi(x)^2$，于是考虑反演倒推出 $f$，有：$f(x)=\sum\limits_{d\mid n}h(d)=\sum\limits_{d\mid n}\varphi^2(d)$。

#### Subtask 7

注意到题目上给出的提示叫 Poly，因此大胆猜想 $f(p^k)$ 是一个多项式函数。把 $f(p^k)$ 项全部反演解出来，可以直接 Gauss 消元直接解出 $f(p^k)$ 对应的多项式。

最终可以解出 $f(p^k)=114(p^k)^3+514(p^k)^2+1919(p^k)+810$，然后利用 $f$ 的积性可以推出任意一项 $f(x)$ 的值。

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#define int long long

using namespace std;
const int N = 500010;
const int mod = 998244353;
const int inf = 1e18;

using ui = unsigned;
using ld = long double;
using ull = unsigned long long;
using i128 = __int128;
const ull base = 13331;

namespace Luminescent
{
    const double pi = acos(-1);
    const ld pi_l = acosl(-1);
    struct DSU
    {
        int fa[N], siz[N];
        inline DSU() { iota(fa, fa + N, 0), fill(siz, siz + N, 1); }
        inline void init(int maxn) { iota(fa, fa + maxn + 1, 0), fill(siz, siz + maxn + 1, 1); }
        inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
        inline int merge(int x, int y)
        {
            x = find(x), y = find(y);
            if (siz[x] > siz[y])
                x ^= y ^= x ^= y;
            if (x != y)
                return fa[x] = y, siz[y] += siz[x], 1;
            return 0;
        }
    };
    inline void add(int &x, int a) { x = (x + a) % mod; }
    inline void sub(int &x, int a) { x = (x - a + mod) % mod; }
    inline int power(int a, int b, int c)
    {
        int sum = 1;
        while (b)
        {
            if (b & 1)
                sum = 1ll * sum * a % c;
            a = 1ll * a * a % c, b >>= 1;
        }
        return sum;
    }
    inline int inversion(int x) { return power(x, mod - 2, mod); }
    inline int inversion(int x, int mod) { return power(x, mod - 2, mod); }
    inline int varphi(int x)
    {
        int phi = 1;
        for (int i = 2; i * i <= x; ++i)
            if (x % i == 0)
            {
                phi *= (i - 1);
                x /= i;
                while (x % i == 0)
                    phi *= i, x /= i;
            }
        if (x > 1)
            phi *= (x - 1);
        return phi;
    }
    inline int gunmu(int x)
    {
        int res = 1;
        for (int i = 2; i * i <= x; ++i)
            if (x % i == 0)
            {
                x /= i;
                if (x % i == 0)
                    res = 0;
                else
                    res = -res;
            }
        if (x > 1)
            res = -res;
        return res;
    }
}
using namespace Luminescent;

namespace MATH
{
    mt19937 rnd(time(0));
    inline int optimize(const int &a, const int &b, const int &c)
    {
        register int ans = a * b - (long long)((long double)a * b / c + 0.5) * c;
        return ans < 0 ? ans + c : ans;
    }
    int ggcd(int a, int b)
    {
        register int _a = __builtin_ctzll(a), _b = __builtin_ctzll(b);
        register int c = min(_a, _b);
        b >>= _b;
        while (a)
        {
            a >>= _a;
            register int diff = a - b;
            _a = __builtin_ctzll(diff);
            b = min(a, b);
            a = abs(diff);
        }
        return b << c;
    }
    int prime_list[8] = {2, 3, 5, 7, 11, 17, 37, 89};
    int ksm(int a, int b, const int &c)
    {
        register int s;
        for (s = 1; b; b >>= 1)
        {
            if (b & 1)
                s = optimize(s, a, c);
            a = optimize(a, a, c);
        }
        return s;
    }
    bool miller_rabin(const int &n, int &a)
    {
        register int d = n - 1, r = 0;
        while (~d & 1)
            d >>= 1, ++r;
        register int x = ksm(a, d, n);
        if (x == 1)
            return true;
        for (register int i = 0; i < r; ++i)
        {
            if (x == n - 1)
                return true;
            x = optimize(x, x, n);
        }
        return false;
    }
    bool isprime(const int &n)
    {
        if (n < 4)
            return n > 1;
        if (n == prime_list[0] || n == prime_list[1] || n == prime_list[2] || n == prime_list[3] || n == prime_list[4] || n == prime_list[5] || n == prime_list[6] || n == prime_list[7])
            return true;
        for (int i = 0; i < 8; ++i)
            if (n % prime_list[i] == 0 || !miller_rabin(n, prime_list[i]))
                return false;
        return true;
    }
    int seed, step;
    inline int steps(int a, int mod)
    {
        return (optimize(a, a, mod) + seed) % mod;
    }
    int floyd(const int &n)
    {
        register int fast, slow, res = 1;
        seed = rnd() % n;
        fast = slow = rnd() % n;
        fast = steps(fast, n);
        for (register int i = 0; fast != slow; ++i)
        {
            res = optimize(res, fast + n - slow, n);
            if (!res)
                res = fast - slow + n;
            if (i % step == 0)
            {
                int g = ggcd(res, n);
                if (g != 1)
                    return g;
                res = 1;
            }
            fast = steps(steps(fast, n), n), slow = steps(slow, n);
        }
        return ggcd(res, n);
    }
    int pollardrho(int n)
    {
        if (n == 1)
            return 0;
        else if (isprime(n))
            return n;
        else
        {
            register int k = 1;
            step = (int)log(n);
            step = step << 1 | 1;
            while (k == 1)
                k = floyd(n);
            return max(pollardrho(k), pollardrho(n / k));
        }
    }
}

namespace Loyalty
{
    int d[N], gd[N], f[N], g[N], mu[N], isp[N], pr[N], idx;
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
        int k;
        cin >> k;
        for (int i = 1; i <= k; ++i)
            cin >> d[i] >> gd[i];
        int t, id;
        cin >> t >> id;
        if (id == 0)
        {
            while (t--)
            {
                int x;
                cin >> x;
                cout << (gunmu(x) + mod) % mod << '\n';
            }
        }
        else if (id == 1)
        {
            while (t--)
            {
                int x;
                cin >> x;
                cout << 1 << '\n';
            }
        }
        else if (id == 2)
        {
            while (t--)
            {
                int x;
                cin >> x;
                cout << 0 << '\n';
            }
        }
        else if (id == 3)
        {
            for (int i = 1; i <= 100000; ++i)
                g[i] = gd[i];
            isp[1] = 1, mu[1] = 1;
            for (int i = 2; i < N; ++i)
            {
                if (!isp[i])
                    pr[++idx] = i, mu[i] = -1;
                for (int j = 1; j <= idx && i * pr[j] < N; ++j)
                {
                    isp[i * pr[j]] = 1;
                    if (i % pr[j] == 0)
                        break;
                    mu[i * pr[j]] = -mu[i];
                }
            }
            for (int i = 1; i <= 100000; ++i)
                for (int j = i; j <= 100000; j += i)
                    f[j] = (f[j] + mu[j / i] * g[i] % mod) % mod;
            while (t--)
            {
                int n;
                cin >> n;
                cout << (f[n] + mod) % mod << '\n';
            }
        }
        else if (id == 5)
        {
            while (t--)
            {
                int n, res = 1;
                cin >> n;
                for (int i = 2; i * i <= n; ++i)
                    if (n % i == 0)
                    {
                        int cnt = 0;
                        while (n % i == 0)
                            ++cnt, n /= i;
                        res = res * power(i, cnt + cnt - 1, mod) % mod;
                    }
                if (n > 1)
                    res = res * n % mod;
                cout << res << '\n';
            }
        }
        else if (id == 8)
        {
            while (t--)
            {
                int n;
                cin >> n;
                cout << n * n % 3 << '\n';
            }
        }
        else if (id == 6)
        {
            while (t--)
            {
                int n;
                cin >> n;
                map<int, int> mp;
                while (n > 1)
                {
                    int t = MATH::pollardrho(n);
                    ++mp[t], n /= t;
                }
                int res = 1;
                for (auto &[x, y] : mp)
                    res = (res * (power(x % mod, y + y, mod) - power(x % mod, y + y - 2, mod) + mod) % mod) % mod;
                cout << res << '\n';
            }
        }
        else if (id == 4)
        {
            while (t--)
            {
                int n, res = 0;
                cin >> n;
                for (int i = 1; i * i <= n; ++i)
                    if (n % i == 0)
                    {
                        res = res + varphi(i) % mod * varphi(i) % mod;
                        if (i * i != n)
                            res = res + varphi(n / i) % mod * varphi(n / i) % mod;
                        res %= mod;
                    }
                cout << res << '\n';
            }
        }
        else
        {
            auto solve = [&](int x)
            {
                return (114 * x % mod * x % mod * x % mod + 514 * x % mod * x % mod + 1919 * x % mod + 810) % mod;
            };
            while (t--)
            {
                int n, res = 1;
                cin >> n;
                for (int i = 2; i * i <= n; ++i)
                    if (n % i == 0)
                    {
                        int cnt = 1;
                        while (n % i == 0)
                            n /= i, cnt *= i;
                        res = res * solve(cnt % mod) % mod;
                    }
                if (n > 1)
                    res = res * solve(n) % mod;
                cout << res << '\n';
            }
        }
    }
}

signed main()
{
    cin.tie(0)->sync_with_stdio(false);
    cout << fixed << setprecision(15);
    int T = 1;
    // cin >> T;
    Loyalty::init();
    for (int ca = 1; ca <= T; ++ca)
        Loyalty::main(ca, T);
    return 0;
}
```

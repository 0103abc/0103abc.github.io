---
title: "P16637 春季限定独立集问题 题解"
date: "2026-05-27T07:46:56.000Z"
link: "luogu-gfow9oyw"
categories: ["题解"]
tags: ["洛谷", "数学", "数论", "动态规划", "搜索", "深度优先搜索"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/gfow9oyw)。

~~P16637 春季限定独立集问题 完全不是数据结构，拉完了~~

先考虑 $O(n)$ 怎么做。容易想到设 $f_i/g_i$ 分别表示当前以 $i$ 点为根，独立集中选 / 不选 $i$ 点，独立集大小最大是多少。转移直接显式建树然后 DFS 合并儿子结点的 dp 信息即可。

具体的，有：

+ $f_u=1+\sum\limits_{v\in\text{son}_u}g_v$
+ $g_u=1+\sum\limits_{v\in\text{son}_u}\max(f_u,f_v)$

如果你做过 [P8352](https://www.luogu.com.cn/problem/P8352) 的话就会想到 $f,g$ 两个状态中只保留一个状态，然后再新开一个 dp 数组维护 $f,g$ 对应状态的差值。具体的，设 $d_u=f_u-g_u$，则 $d_u$ 的转移形如：

$$
d_u=1-\sum\limits_{v\in\text{son}_u}\max(d_v,0)
$$

很显然有结论 $d_u\le 1$。因此以 $u$ 为根的子树取 $f$ 作为其 dp 状态严格优于取 $g$ 作为其 dp 状态，当且仅当 $d_u=1$，而 $d_u=1$ 当且仅当 $\forall v\in\text{son}_u,d_v\le 0$。考虑记 $h_i=[d_i=1]$，则有 $h_u=1$ 当且仅当 $\forall v\in\text{son}_u,h_v=0$。

此时还可以发现：

$$
\max(f_u,g_u)=\sum\limits_{v\in\text{son}_u}\max(f_v,g_v)+h_u
$$

记 $M_i=\max(f_i,g_i)$，则转移式可以被写作：

$$
M_u=\left(\sum\limits_{v\in\text{son}_u}M_v\right)+h_u
$$

最终的答案即为 $M_1$。简单分析可知 $M_1=\sum\limits_{i=1}^nh_i$，即树的最大独立集大小为满足 $h_i=1$ 的 $i$ 的数量。

此时考虑对于一个点 $u$，其儿子结点 $v$ 与其的关系。显然有 $u\mid v$。继续挖掘性质后还可以发现记 $v=ku$，则必有 $k$ 为质数且 $1\le k\le \text{spf}(u)$，其中 $\text{spf}(u)$ 表示 $u$ 的最小质因数。当然还必须满足 $v\le n$，因此记 $q(u)$ 表示剩余倍率上限为 $u$ 时最小的能走到一个满足 $h_v=1$ 的 $v$ 的质数的值。特殊的，若不存在这样的一个质数，则记 $q(u)=+\infin$。

则此时 $u$ 点满足 $h_u=1$ 当且仅当 $\text{spf}(u)<q(\lfloor\frac nu\rfloor)$。证明可以考虑 $u$ 一直乘正整数，$\text{spf}(u)$ 在过程中是单调不增的。

因此最终问题的答案可以被表示为：$\sum\limits_{i=1}^n\text{spf}(i)<q(\lfloor\frac ni\rfloor)$。

考虑处理出 $q(u)$ 的值。显然有 $q(1)=+\infin$，对 $u\le 2$ 有 $q(u)=\min\lbrace p\mid p\in\text{prime},p\le u,p<q(\lfloor\frac up\rfloor)\rbrace$。进一步优化可以发现，若 $p\le\sqrt u$ 部分没有找到满足条件的 $p$，则只需要判断比 $\frac u2$ 要大的最小的质数是否满足条件即可。证明考虑若 $\sqrt u<p\le\frac x2$ 则必有 $\lfloor\frac up\rfloor\ge 2$，从而可以推出 $q(\lfloor\frac up\rfloor)\le\lfloor\frac up\rfloor<p$，显然不可能有 $p<q(\lfloor\frac up\rfloor)$。

此时考虑从 $u$ 点走到其某个儿子结点 $v$，若 $v=ku$，则新的倍率上限变为 $\lfloor\frac{B(u)}k\rfloor$。根据下取整的一些性质可知不同的倍率上限只有 $O(\sqrt n)$ 个，因此考虑先处理所有可能得到的倍率上限然后从小到大递推这些 $q(u)$ 的值即可。

考虑固定整数 $k$，每一轮处理所有满足 $\lfloor\frac nu\rfloor=k$ 的 $u$ 对答案的贡献。显然对答案有贡献的 $k$ 的数量是 $O(\sqrt n)$ 级别的，且可能对答案有贡献的 $u$ 所在的区间为 $[\lfloor\frac n{k+1}\rfloor+1,\lfloor\frac nk\rfloor]$，每一次只需要在这个区间内统计有多少个 $u$ 满足 $\text{spf}(u)<q(k)$ 即可。此时 $q(k)$ 的值也是固定的，因此问题变为在给定区间内求有多少 $u$ 的 $\text{spf}(u)$ 严格小于某定值 $q(k)$。

记 $C(u,q)$ 表示 $1\sim u$ 的所有正整数 $i$ 中，有多少个 $i$ 满足 $\text{spf}(i)<q$。换句话说，若严格小于 $q$ 的质数有 $x_1,x_2,\ldots,x_k$，则 $C(u,q)$ 的值即为有多少个 $1\sim u$ 的正整数 $i$ 满足 $i$ 至少被这些质数中的一个整除。同理记 $D(u,k)$ 为 $C(u,q)$ 在 $[1,u]\cap\mathbb N$ 上的补集，即 $D(u,k)$ 表示 $1\sim u$ 的所有正整数 $i$ 中，有多少个 $i$ 满足 $i$ 不能被前 $k$ 小的质数中的任何一个整除。则 $C(u,q)$ 和 $D(u,\pi(q-1))$ 之间显然有等量关系 $C(u,q)+D(u,\pi(q-1))=u$。其中 $\pi(x)$ 表示 $1\sim x$ 中质数的数量。

假设目前已经处理出了 $C(u,q)$ 的值，则固定整数 $k$ 对答案的贡献就可以表示为 $C(\lfloor\frac nk\rfloor,q(k))-C(\lfloor\frac n{k+1}\rfloor,q(k))$。把所有这样的贡献累加即可得到最终答案。

问题在于快速计算 $C(u,q)$ 的值。$C(u,q)$ 是难以计算的，考虑通过其补集 $D(u,k)$ 来辅助计算。这里我们有递推公式：

$$
D(u,k)=D(u,k-1)-D(\lfloor\frac u{x_k}\rfloor,k-1)
$$

其中 $x_k$ 为第 $k$ 小的质数。边界条件显然为 $D(u,0)=u$。

大体解释一下上面的递推公式：在 $1\sim u$ 的整数里先数出来不能被前 $k-1$ 小的质数整除的数的数量，然后再额外减掉不能被 $x_k$ 整除但是能被前 $k-1$ 小的质数整除的数的数量。这些数都可以表示为 $tx_k$ 的形式（$t\in\mathbb N_+$），而因为质数两两互质所以 $t$ 也同样不能被前 $k-1$ 小的质数整除，这样的数的数量即为 $D(\lfloor\frac u{x_k}\rfloor,k-1)$。

直接模拟上述流程单次递归计算 $D(u,k)$ 的时间复杂度接近 $O(2^k)$，考虑对该部分优化。若递归处理到某一层时，其满足 $x_k^2>u$ 则此时可以直接计算 $D(u,k)=\pi(u)+1-k$（满足条件的数只有 $1$ 和严格大于 $x_k$ 的质数）。直接计算然后返回即可。此时单次计算 $D(u,k)$ 的时间复杂度上界为 $O(2^{\min(k,\pi(\sqrt u))})$，再做一些杂七杂八的剪枝后可以通过。

```cpp line-numbers
inline int power(int a, int b, int c) {
    a %= c;
    int res = 1;
    while (b) {
        if (b & 1) res = (u128)res * a % c;
        a = (u128)a * a % c, b >>= 1;
    } return res;
}

inline int inversion(int x, int Mod = mod) { return power(x, Mod - 2, Mod); }

int pr[N], pi_pre[N], isp[N], idx;
inline void sieve(int lim) {
    for (int i = 2; i <= lim; ++i) {
        if (!isp[i]) pr[++idx] = i;
        for (int j = 1; j <= idx && i * pr[j] <= lim; ++j) {
            isp[i * pr[j]] = 1;
            if (i % pr[j] == 0) break;
        }
    }
    for (int i = 0; i <= lim; ++i) {
        if (i) pi_pre[i] = pi_pre[i - 1];
        if (i >= 2 && !isp[i]) ++pi_pre[i];
    }
}

const int prime_list[] = {2, 7, 61};
inline bool miller_rabin(const int n, int a) {
    register int d = n - 1, r = 0;
    while (~d & 1) d >>= 1, ++r;
    register int x = power(a, d, n);
    if (x == 1) return 1;
    for (register int i = 0; i < r; ++i) {
        if (x == n - 1) return 1;
        x = (u128)x * x % n;
    } return 0;
}
inline bool isprime(const int n) {
    if (n < 4) return n > 1;
    if (n == prime_list[0] || n == prime_list[1] || n == prime_list[2]) return 1;
    for (int i = 0; i < 3; ++i) if (n % prime_list[i] == 0 || !miller_rabin(n, prime_list[i])) return 0;
    return 1;
}

inline int getnext(int x) {
    int y = x / 2 + 1;
    if (y < 3) return 2;
    if (~y & 1) ++y;
    while (!isprime(y)) y += 2;
    return y;
}

inline int isqrt(int x) {
    int r = sqrt(x);
    while ((r + 1) * (u128)(r + 1) <= (u128)x) ++r;
    while ((u128)r * r > (u128)x) --r;
    return r;
}

inline int icbrt(int x) {
    int r = cbrt(x);
    while ((r + 1) * (u128)(r + 1) * (r + 1) <= (u128)x) ++r;
    while ((u128)r * r * r > (u128)x) --r;
    return r;
}

inline int issqrt(int x) {
    int r = sqrt(sqrt(x));
    while ((r + 1) * (u128)(r + 1) * (r + 1) * (r + 1) <= (u128)x) ++r;
    while ((u128)r * r * r * r > (u128)x) --r;
    return r;
}

int prephi[30031];
inline int phi_base(int u) { return u / 30030 * prephi[30030] + prephi[u % 30030]; }
inline int phi_small(int u, int k) {
    if (!k) return u;
    if (k == 6) return phi_base(u);
    return phi_small(u, k - 1) - phi_small(u / pr[k], k - 1);
}

struct myhash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }
    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
};

unordered_map<ull, int, myhash> pi_;

inline int prime_pi(int);

inline int Phi(int u, int k) {
    if (u < 1) return 0;
    if (k <= 6) return phi_small(u, k);
    if (pr[k] * pr[k] > u) return prime_pi(u) - k + 1;
    return Phi(u, k - 1) - Phi(u / pr[k], k - 1);
}

inline int prime_pi(int u) {
    if (u <= 1000000) return pi_pre[u];
    auto it = pi_.find(u);
    if (it != pi_.end()) return it->second;
    int a = prime_pi(issqrt(u)), b = prime_pi(isqrt(u)), c = prime_pi(icbrt(u));
    int res = Phi(u, a) + (b - a + 1) * (b + a - 2) / 2;
    for (int i = a + 1; i <= b; ++i) {
        res -= prime_pi(u / pr[i]);
        if (i <= c) {
            int lim = prime_pi(isqrt(u / pr[i]));
            for (int j = i; j <= lim; ++j) res -= prime_pi(u / pr[i] / pr[j]) - (j - 1);
        }
    } return pi_[u] = res;
}

inline int spf_count(int x, int q) {
    if (x < 1 || q < 3) return 0;
    if (q >= inf / 2) return x;
    if (q > x) return x - 1;
    int a = prime_pi(q - 1);
    if ((u128)q * q > x) return x - prime_pi(x) - 1 + a;
    return x - Phi(x, a);
}

inline void init() {
}

int q[N];
inline void sol() {
    int n; cin >> n;
    if (n == 1) { cout << 1 << '\n'; return; }
    sieve(1000000);
    for (int i = 1; i <= 30030; ++i) {
        int ok = 1;
        for (int j = 1; j <= 6; ++j)
            if (i % pr[j] == 0) { ok = 0; break; }
        prephi[i] = prephi[i - 1] + ok;
    }
    vector<int> vec;
    for (int l = 1, r; l <= n; l = r + 1)
        r = n / (n / l), vec.push_back(n / l);
    reverse(vec.begin(), vec.end());
    unordered_map<int, int, myhash> id;
    for (int i = 0; i < vec.size(); ++i) id[vec[i]] = i;
    memset(q, 0x3f, sizeof q);
    q[0] = inf;
    for (int i = 1; i < vec.size(); ++i) {
        int lim = isqrt(vec[i]), ans = inf;
        for (int j = 1; j <= idx && pr[j] <= lim; ++j)
            if (pr[j] < q[id[vec[i] / pr[j]]]) { ans = pr[j]; break; }
        if (ans == inf) ans = getnext(vec[i]);
        q[i] = ans;
    }
    int res = 0;
    for (int i = 0; i < vec.size(); ++i)
        res += spf_count(n / vec[i], q[i]) - spf_count(n / (vec[i] + 1), q[i]);
    cout << res << '\n';
}
```

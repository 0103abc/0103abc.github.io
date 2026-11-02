---
title: "P17802 [CXOI2026] 想要变成鹰的鱼 题解"
date: "2026-10-28T01:14:10.000Z"
link: "luogu-2phnszxe"
categories: ["题解"]
tags: ["洛谷", "数学", "数论", "算法思想", "倍增", "基础算法", "排序"]
draft: false
---

~~题目名居然过审了，好神奇~~

Fibonacci 数列有经典结论 $\gcd(f_a,f_b)=f_{\gcd(a,b)}$，因此考虑 gcd-lcm 反演，$\operatorname{lcm}(f_{a_1},f_{a_2},\ldots,f_{a_n})=\prod\limits_{\varnothing\neq I\subseteq\lbrace 1,2,3,\ldots,n\rbrace}(\gcd\limits_{i\in I}f_{a_i})^{(-1)^{|I|+1}}=\prod\limits_{\varnothing\neq I\subseteq\lbrace 1,2,3,\ldots,n\rbrace}f_{\gcd\limits_{i\in I}a_i}^{(-1)^{|I|+1}}$。然后再对指数部分做反演，定义 $g_d=\prod\limits_{e\mid d}f_e^{\mu(d/e)}$ 则有 $f_i=\prod\limits_{d\mid i}g_d$，代入上面反演的式子可得 $\operatorname{lcm}(f_{a_1},f_{a_2},\ldots,f_{a_n})=\prod\limits_{\varnothing\neq I\subseteq\lbrace1,2,3,\ldots,n\rbrace}(\prod\limits_{d\mid (\gcd\limits_{j\in I}a_j)}g_d)^{(-1)^{|I|+1}}=\prod\limits_{\varnothing\neq I\subseteq\lbrace1,2,3,\ldots,n\rbrace}(\prod\limits_{d\mid(\gcd\limits_{j\in I}a_j)}g_d^{(-1)^{|I|+1}})=\prod\limits_{d\ge 1}g_d^{\sum\limits_{\varnothing\neq I\subseteq\lbrace1,2,3,\ldots,n\rbrace,d\mid(\gcd\limits_{j\in I}a_j)}(-1)^{|I|+1}}$。为了方便，后面记指数部分 $E_d=\sum\limits_{\varnothing\neq I\subseteq\lbrace1,2,3,\ldots,n\rbrace,d\mid(\gcd\limits_{j\in I}a_j)}(-1)^{|I|+1}=\sum\limits_{\varnothing\neq I\subseteq\lbrace1,2,3,\ldots,n\rbrace,d\mid a_i,\forall i\in I}(-1)^{|I|+1}$。

记 $S_d=\lbrace i:d\mid a_i\rbrace$，则有 $E_d=\sum\limits_{\varnothing\neq I\subseteq S_d}(-1)^{|I|+1}$。容易发现如果 $S_d=\varnothing$ 则 $E_d=0$，否则有 $E_d=1$。因此最终可以得到 $\operatorname{lcm}(f_{a_1},f_{a_2},\ldots,f_{a_n})=\prod\limits_{d\ge 1,\exists i,d\mid a_i}g_d$。记 $D=\bigcup\limits_{i=1}^n\lbrace d:d\mid a_i\rbrace$ 则上面的式子又可以被简记为 $\prod\limits_{d\in D}g_d$ 的形式。

然后考虑如何求出所有前缀的答案。记 $D_i=\bigcup\limits_{j=1}^i\lbrace d:d\mid a_j\rbrace$，则根据上面的结论可以得到 $L_i=\operatorname{lcm}(f_{a_1},f_{a_2},\ldots,f_{a_i})=\prod\limits_{d\in D_i}g_d$。注意到 $D_i$ 随着 $i$ 的增加只会加入新的元素，因此考虑记录每个约数 $d$ 第一次出现的位置 $t_d=\min\lbrace i:d\mid a_i\rbrace$，则有 $L_i=L_{i-1}\prod\limits_{t_d=i}g_d$，其中 $L_0=1$。因此问题被转化为预处理所有的 $g_d$，然后按照第一次出现的位置进行累乘。

接下来考虑如何快速计算 $g_d$。根据前面的定义有 $g_d=\prod\limits_{e\mid d}f_e^{\mu(d/e)}$，注意到 $D$ 集合对取约数是封闭的，因此考虑直接在乘法意义下进行莫比乌斯反演。先初始化所有 $g_d=f_d$，然后对所有在 $D$ 中出现过的质数 $p$ 执行 $g_d\leftarrow g_d/g_{d/p}$（$p\mid d$），对同一个质数 $p$ 按照 $v_p(d)$ 的值从大到小处理，这样可以保证右侧的 $g_{d/p}$ 还没有被当前质数对应的变换修改。这一步的正确性从 Mobius 函数的定义上就可以得到。下标很大的问题扔到哈希表中即可解决。

由于这里的除法需要在模 $998244353$ 意义下进行，直接求逆元的时间复杂度有点小炸，因此考虑同时维护 $h_d=g_d^{-1}$，那么每次变换就相当于 $g_d\leftarrow g_dh_{d/p},h_d\leftarrow h_dg_{d/p}$，其中右侧均使用修改前的值。初始时 $h_d=f_d^{-1}$，这个东西可以利用前缀积和一次快速幂批量求逆，时间复杂度为 $O(|D|+\log \text{MOD})$。由于每个 $d$ 对每个不同质因子只需要处理一次，因此整个莫比乌斯反演的时间复杂度为 $O(\sum\limits_{d\in D}\omega(d))$。

然后考虑批量计算 $x_1<x_2<\ldots<x_k$ 项的 Fibonacci 值，其中 $x_1,x_2,\ldots,x_k$ 为 $D$ 中的所有元素。这个东西考虑倍增求，设当前求出了 $(f_m,f_{m+1})=(a,b)$ 则记 $\Delta=x_i-m$ 倍增求出 $(f_{\Delta},f_{\Delta+1})=(u,v)$，然后根据 Fibonacci 序列的经典结论可知 $f_{m+\Delta}=a(v-u)+bu,f_{m+\Delta+1}=au+bv$，这样依次转移的时间复杂度为 $O(\log(\Delta+1))$。因为所有下标的差值和不超过 $A=\max a_i$，因此放缩一下可得 $\sum\limits_{i=1}^k\log(\Delta_i+1)\le k\log(1+\frac Ak)$，因此上面批量计算 $k$ 个 Fibonacci 值的时间复杂度被优化到 $O(k\log(1+\frac Ak))$。对 $x$ 数组排序用基数排序即可做到理论线性时间复杂度（不过我偷懒没写）。

最后考虑怎么算所有前缀的答案。前面已经预处理出了每个 $d\in D$ 对应的 $g_d$ 和第一次出现的位置 $t_d$，因此考虑按照 $t_d$ 的值分类计算，记 $B_i=\prod\limits_{t_d=i}g_d$，则 $L_i=\prod\limits_{j=1}^iB_j$。这个东西只需要按照 $i$ 从小到大扫描然后维护前缀乘积即可，时间复杂度为 $O(|D|+n)$。

然后有一个问题是模数 $998244353$ 可能会整除某些 $f_x$。打表可得最小的满足 $f_x\equiv0\pmod{998244353}$ 的正整数 $x$ 为 $499122177$，然后根据 Fibonacci 序列的性质可知 $f_x\equiv0\pmod{998244353}$ 当且仅当 $499122177\mid x$。因此只需要找到第一个满足 $499122177\mid a_i$ 的位置，从这个位置开始所有前缀答案都为 $0$，只需要处理它之前的部分即可。这样也就保证了前面所有需要求逆的 Fibonacci 数都不为 $0$。

代码实现偷懒写了 `__gnu_pbds::gp_hash_table`，如果手写哈希表的话应该会跑的更快一些（）

```cpp line-numbers
namespace lowspeed_song {

mt19937_64 mt(time(0));

inline pair<int, int> fibonacci(int n) {
    if (!n) return {0, 1};
    i64 a = 0, b = 1;
    for (int i = 31 - __builtin_clz(n); ~i; --i) {
        i64 c = a * ((2 * b - a + mod) % mod) % mod, d = (a * a + b * b) % mod;
        if (n >> i & 1) a = d, b = (c + d) % mod;
        else a = c, b = d;
    } return {a, b};
}

struct myhash {
    inline size_t operator()(u64 x) const {
        return splitmix64(x);
    }
};

vector<int> dv, fir;
__gnu_pbds::gp_hash_table<int, int, myhash> id;
unordered_map<int, vector<u32>> buc;

int e[N];
vector<pair<int, int>> fac;

int pos;

inline void dfs(int dep, int d) {
    if (dep == fac.size()) {
        if (!id.insert({d, (int)dv.size()}).second) return;
        int t = dv.size(); dv.emplace_back(d), fir.emplace_back(pos);
        for (int i = 0; i < fac.size(); ++i) if (e[i])
            buc[fac[i].first].emplace_back((u32(t) << 5) | e[i]);
        return;
    } int pwr = 1;
    for (int i = 0; i <= fac[dep].second; ++i) {
        e[dep] = i, dfs(dep + 1, d * pwr);
        if (i < fac[dep].second) pwr *= fac[dep].first;
    }
}

int isp[N], pr[N], idx;

inline void init() {
    isp[1] = 1;
    for (int i = 2; i < 200010; ++i) {
        if (!isp[i]) pr[++idx] = i;
        for (int j = 1; j <= idx && i * pr[j] < 200010; ++j) {
            isp[i * pr[j]] = 1;
            if (i % pr[j] == 0) break;
        }
    }
}

vector<int> bc[32];
int a[N], f[N], g[N], pre[N], inv[N];

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    int lasp = n; for (int i = 1; i <= n; ++i)
        if (a[i] % 499122177 == 0) { lasp = i - 1; break; }
    if (!lasp) {
        for (int i = 0 ;i < n; ++i) cout << 0 << ' ';
        cout << '\n';
    } else {
        for (int i = 1; i <= lasp; ++i) {
            if (id.find(a[i]) != id.end()) continue;
            fac.clear(), pos = i;
            int tmp = a[i];
            for (int j = 1; j <= idx && pr[j] * pr[j] <= tmp; ++j) if (tmp % pr[j] == 0) {
                int cnt = 0;
                while (tmp % pr[j] == 0) tmp /= pr[j], ++cnt;
                fac.emplace_back(pr[j], cnt);
            } if (tmp > 1) fac.emplace_back(tmp, 1);
            for (int i = 0; i <= fac.size(); ++i) e[i] = 0;
            dfs(0, 1);
        } vector<int> ord(dv.size(), 0);
        ranges::iota(ord, 0), ranges::sort(ord, [&](auto &l, auto &r) {
            return dv[l] < dv[r];
        });
        int las = 0, f0 = 0, f1 = 1;
        pre[0] = 1;
        for (int i = 0; i < dv.size(); ++i) {
            auto [u, v] = fibonacci(dv[ord[i]] - las);
            int nf0 = (1ll * f0 * (v - u + mod) + 1ll * f1 * u) % mod;
            int nf1 = (1ll * f0 * u + 1ll * f1 * v) % mod;
            f0 = nf0, f1 = nf1, las = dv[ord[i]], g[ord[i]] = f0;
            pre[i + 1] = 1ll * pre[i] * f0 % mod;
        } int I = inversion(pre[dv.size()]);
        for (int i = (int)dv.size() - 1; ~i; --i) {
            inv[ord[i]] = 1ll * pre[i] * I % mod;
            I = 1ll * I * g[ord[i]] % mod;
        } vector<int>().swap(ord);
        for (auto &[p, v] : buc) {
            int lim = 0;
            for (u32 &o : v) lim = max<int>(lim, o & 31);
            for (int i = 0; i <= lim; ++i) bc[i].clear();
            for (u32 &o : v) bc[o & 31].emplace_back(o >> 5);
            for (int i = lim; i; --i) for (int j : bc[i]) {
                int k = id.find(dv[j] / p)->second;
                g[j] = 1ll * g[j] * inv[k] % mod, inv[j] = 1ll * inv[j] * g[k] % mod;
            }
        } for (int i = 0; i <= n; ++i) f[i] = 1;
        for (int i = 0; i < dv.size(); ++i) f[fir[i]] = 1ll * f[fir[i]] * g[i] % mod;
        int res = 1; for (int i = 1; i <= n; ++i) {
            if (i > lasp) res = 0;
            else res = 1ll * res * f[i] % mod;
            cout << res << ' ';
        } cout << '\n';
    }
}

} // namespace lowspeed_song
```

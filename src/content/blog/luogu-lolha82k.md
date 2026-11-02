---
title: "P15992 [PA 2026] 原题加强 2 / Wersja dla profesjonalistów 2 题解"
date: "2026-09-02T07:37:03.000Z"
link: "luogu-lolha82k"
categories: ["题解"]
tags: ["洛谷", "数学", "数论", "算法思想", "构造"]
draft: false
---

先把题意转化为对一个给定的集合 $S$，选取一个模数 $m$ 和余数 $r$ 使得集合 $S$ 中 $\bmod\ m = r$ 的数尽量多。很明显 $m$ 取质数一定不会更差，因为若 $m$ 取了一个合数，则取 $m$ 的任何一个质因数都不会比取 $m$ 本身选出来的数少。因此问题可以被转化为动态维护一个集合，每次插入删除一个数，求某个质数 $p$ 下最大的同余类大小。

然后考虑先取 $p=2$，此时根据抽屉原理可知，奇偶两类中一定有一类至少有 $\frac{|S|}2$ 个数，因此真正取到答案的质数 $p$ 一定存在一个同余类 $T$ 满足 $|T|\ge \frac{|S|}2$。问题在于如何快速找到这个很大的同余类对应的 $p$。

（然后我就不会做了，感谢 gpt 教我做这题）

考虑分块重构，设某一块开始的时候集合大小为 $n$，则接下来只处理大约 $\frac n4$ 次修改，然后重新构造一次候选质数。这 $\frac n4$ 次修改内设某个时刻的最优质数是 $p$，最优同余类是 $T$，因为当前 $T$ 至少占当前集合的一半，因此即使考虑上这个期间增加删除的元素，当前的最优同余类中也至少有 $\frac n3$ 个元素来自块开始时的集合。也就是说，之后在这一整块中，真正的最优 $p$ 在块开始的集合里已经有至少 $\frac{3n}8\ge\frac n3$ 个数对 $p$ 取模值是相等的。

然后考虑把块开始时的 $n$ 个数随便每 $6$ 个数分成一组，则设那 $\frac n3$ 个模 $p$ 意义下相同的数，在第 $i$ 组中有 $c_i$ 个，那么必然有 $\sum c_i\ge\frac n3$。考虑经典结论，若两个数模 $p$ 的值相同，则这两个数的差必然是 $p$ 的倍数。因此考虑每组数内两两作差。然后又因为有 $\sum\limits_i\binom{c_i}2\ge\frac n6$，因此真正的 $p$ 至少会在 $\frac n6$ 个组内的差值作为质因数出现。

然后可以证明候选数量很少，不超过 $10^7$ 的数最多只有 $w=8$ 个不同质因数，因此所有组内差值的质因数出现总次数只有 $O(nw)$ 级别，而一个候选必须出现 $O(n)$ IC，因此候选质数只有 $O(w)$ 级别。找到这些候选后对每个数 $p$ 维护其每个余数的出现次数，然后一次修改位置 $x$ 只会改变 $O(w)$ 个候选，因此直接暴力修改即可。

每次重构的时间复杂度为 $O(|S|w)$，而每一块内有 $O(|S|)$ 次操作，因此均摊下来时间复杂度为 $O(n+wq)$，可以通过该题。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

constexpr int M = 10000010;

bitset<M> isp;
int pr[M / 10], idx, spf[M];

inline void init() {
    isp[1] = spf[1] = 1;
    for (int i : views::iota(2, M)) {
        if (!isp[i]) pr[++idx] = spf[i] = i;
        for (int j = 1; j <= idx && i * pr[j] < M; ++j) {
            isp[i * pr[j]] = 1, spf[i * pr[j]] = pr[j];
            if (i % pr[j] == 0) break;
        }
    }
}

int a[N], res[N];
int on[M], sgn[M], pos[M], buc[N], hit[M], rem[M];

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n, q; cin >> n >> q;
    for (int i : views::iota(0, q)) cin >> a[i];
    for (int i : views::iota(0, q))
        if (on[a[i]]) sgn[i] = -1, on[a[i]] = 0;
        else sgn[i] = 1, on[a[i]] = 1;
    vector<int> vec, now;
    for (int L = 0; L < q; ) {
        // cerr << "!!!\n";
        int len = max<int>(1, now.size() >> 2), R = min(q, L + len);
        int lim = max<int>(1, now.size() / 6);
        vector<int> bs = now; vec.clear();
        for (int l = 0; l < now.size(); l += 6) {
            int r = min<int>(now.size(), l + 6);
            for (int i : views::iota(l, r))
                for (int j : views::iota(l, i)) {
                    int dlt = abs(bs[i] - bs[j]);
                    while (dlt > 1) {
                        int p = spf[dlt];
                        if (!hit[p]++) vec.emplace_back(p);
                        while (dlt % p == 0) dlt /= p;
                    }
                }
        } for (int &p : vec) if (hit[p] >= lim) {
            int mx = 0; buc[0] = p;
            function<void(int, int)> add = [&](int r, int d) {
                --buc[rem[r]], ++buc[rem[r] += d];
                mx = max(mx, rem[r]);
                while (mx && !buc[mx]) --mx;
            };
            for (int &i : bs) add(i % p, 1);
            for (int i : views::iota(L, R)) add(a[i] % p, sgn[i]), res[i] = max(res[i], mx);
            for (int &i : bs) buc[rem[i % p]] = 0, rem[i % p] = 0;
            for (int i : views::iota(L, R)) buc[rem[a[i] % p]] = 0, rem[a[i] % p] = 0;
        } for (int &i : vec) hit[i] = 0;
        // cerr << "@@@\n";
        for (int i : views::iota(L, R)) {
            // cerr << i << " to " << R - 1 << ' ' << now.size() << ' ' << pos[a[i]] << ' ' << sgn[i] << '\n';
            if (sgn[i] == 1) now.emplace_back(a[i]), pos[a[i]] = now.size();
            else now[pos[a[i]] - 1] = now.back(), pos[now.back()] = pos[a[i]], now.pop_back(), pos[a[i]] = 0;
            if (now.size() < 2) res[i] = now.size();
            else if (now.size() == 2) res[i] = abs(now[0] - now[1]) > 1 ? 2 : 1;
            else if (now.size() == 3) {
                int g = gcd(abs(now[0] - now[1]), abs(now[1] - now[2]));
                res[i] = (g > 1) ? 3 : 2;
            } else res[i] = max<int>(res[i], (now.size() + 1) / 2);
        } L = R;
    } for (int i : views::iota(0, q)) cout << res[i] << '\n';
}

} // namespace lowspeed_song
```
:::

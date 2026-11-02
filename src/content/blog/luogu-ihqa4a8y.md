---
title: "CF1418F Equal Product 题解"
date: "2026-05-13T09:04:03.000Z"
link: "luogu-ihqa4a8y"
categories: ["题解"]
tags: ["Codeforces", "数学", "数论", "算法思想", "构造", "基础算法", "贪心"]
draft: false
---

注意（不）到有这样一个结论：

:::info[结论]{open}
对于任意一组满足题目给出条件的等式 $x_1y_1=x_2y_2$，都必然存在正整数 $a<b$ 满足 $x_2=x_1\times\frac ba,y_2=y_1\times \frac ab$。

构造 $a=\frac{x_1}{\gcd(x_1,x_2)},b=\frac{x_2}{\gcd(y_1,y_2)}$ 即可满足条件。
:::

固定 $x_1$ 的值，对当前的 $x_1$ 枚举所有可能取到的 $a$ 的值（容易证明需要枚举的 $a$ 的数量均摊不超过 $O(\log n)$）。此时考虑快速判定对当前确定的 $x_1,a$，是否可以找到一组 $y_1,b$ 满足上述的所有条件，列出不等关系后可以发现需要同时满足下列条件：

+ $a<b$
+ $x_1\times\frac ba\le n$（$\frac{x_1}a\times b\le n$）
+ $\lceil\frac{l}{x_1}\rceil\le y_1\le \min(m,\lfloor\frac{r}{x_2}\rfloor)$

前两个条件可以直接贪心的在候选集合中找出最小的满足 $a<b$ 的 $b$，最后一个限制维护指针 $[pl,pr]$ 表示当前 $y_1$ 的取值范围即可。候选集合可以拿 set 或者别的 ds 维护，时间复杂度是 $O(n\log^2n)$ 的。

```cpp line-numbers
int buc[N];
vector<int> divs_[N];
inline void sol() {
    int n, m, l, r; cin >> n >> m >> l >> r;
    for (int i = 1; i <= max(n, m); ++i)
        for (int j = i; j <= max(n, m); j += i) divs_[j].emplace_back(i);
    int pl = m + 1, pr = m;
    set<int> se;
    for (int i = 1; i <= n; ++i) {
        while (pl > (l - 1) / i + 1) {
            --pl;
            for (int &j : divs_[pl]) if (!buc[j]++) se.emplace(j);
        } while (pr > r / i) {
            for (int &j : divs_[pr]) if (!--buc[j]) se.erase(j);
            --pr;
        } for (int &j : divs_[i]) {
            auto it = se.upper_bound(j);
            if (it != se.end() && i / j * *it <= n) {
                cout << i << ' ' << pr / *it * *it << ' ' << i / j * *it << ' ' << pr / *it * j << '\n';
                goto label;
            }
        } cout << -1 << '\n'; label:;
    }
}
```

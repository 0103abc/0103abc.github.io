---
title: "P2235 [HNOI2002] Kathy函数 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p2235"
categories: ["题解"]
tags: ["洛谷", "动态规划", "基础算法", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/spw6pl2s)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P2235).
:::

:::info[Solution]{open}
~~未检测到题目。~~

打个表可以发现 $f(x)$ 的值就是把 $x$ 在二进制意义下翻转得到的值。因此直接数位 dp 求 $1\sim m$ 中有多少个数在二进制意义下是回文数即可。这个甚至都不需要数位 dp，直接按位模拟即可。

需要写高精度。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N], ne[N];

inline void sol() {
    bigint m; cin >> m;
    bigint x = m, ans = 0, cnt = 1, p = 0;
    vector<int> s;
    while (!x.isZero()) {
        auto [q, r] = bigint::divmod(x, 2);
        s.emplace_back(r == 1), x = q;
    }
    reverse(s.begin(), s.end());
    int n = s.size();
    for (int len = 1; len < n; len++) {
        ans += cnt;
        if (~len & 1) cnt = cnt.mulInt(2);
    }
    for (int i = 0; i < (n + 1) / 2; i++) p = p.mulInt(2) + s[i];
    ans += p - cnt;
    vector<int> t = s;
    for (int i = 0; i < n / 2; i++) t[n - i - 1] = t[i];
    if (t <= s) ans += 1;
    cout << ans << '\n';
}

} // namespace lowspeed_song
```
:::

难度：青

鲜活指数：-20

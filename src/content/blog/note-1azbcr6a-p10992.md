---
title: "P10992 [蓝桥杯 2023 国 Python A] 最长同类子串 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p10992"
categories: ["题解"]
tags: ["洛谷", "基础算法", "二分", "数学", "多项式"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P10992).
:::

:::info[Solution]{open}
感觉比较套路。考虑二分答案，设当前二分的答案长度为 $x$，则先考虑怎么判断两个串是否是相似的。容易想到集合哈希，维护串内相邻两个字符之间间隔的距离，判断这两个东西组成的集合哈希值是否相等即可（这个部分用集合哈希或者多项式哈希都是可以的）。快速维护直接滑动窗口即可。

总时间复杂度为 $O(n\log n)$，细节有点多。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

constexpr u64 base = 1333331;

u64 pwr[N];
char s[N], t[N];
int n, m, ne[N], ne2[N], pre[N], pre2[N], buc[N];

inline void init() {
    pwr[0] = 1;
    for (int i = 1; i < N; ++i) pwr[i] = pwr[i - 1] * base;
}

inline int chk(int x) {
    set<u64> se;
    u64 Hash = 0;
    for (int i = 1; i <= x; ++i)
        if (pre[i]) Hash += (i - pre[i]) * pwr[x - i];
    se.emplace(Hash);
    // cerr << "awa " << Hash << ' ' << x << '\n';
    for (int l = 2, r = x + 1; r <= n; ++l, ++r) {
        if (ne[l - 1] <= r - 1) Hash -= (ne[l - 1] - l + 1) * pwr[r - ne[l - 1] - 1];
        Hash = Hash * base;
        if (pre[r] >= l) Hash += r - pre[r];
        se.emplace(Hash);
        // cerr << "qwq " << l << ' ' << r << " : " << Hash << '\n';
    }
    Hash = 0;
    for (int i = 1; i <= x; ++i)
        if (pre2[i]) Hash += (i - pre2[i]) * pwr[x - i];
    // cerr << "Hash = " << Hash << ' ' << x << '\n';
    if (se.count(Hash)) return 1;
    for (int l = 2, r = x + 1; r <= m; ++l, ++r) {
        if (ne2[l - 1] <= r - 1) Hash -= (ne2[l - 1] - l + 1) * pwr[r - ne2[l - 1] - 1];
        Hash *= base;
        if (pre2[r] >= l) Hash += r - pre2[r];
        if (se.count(Hash)) return 1;
    } return 0;
}

inline void sol() {
    scanf("%s%s", s + 1, t + 1);
    n = strlen(s + 1), m = strlen(t + 1);
    for (int i = 1; i <= n; ++i) pre[i] = buc[s[i] - 'a'], buc[s[i] - 'a'] = i;
    memset(buc, 0, sizeof buc);
    for (int i = n; i; --i) ne[i] = buc[s[i] - 'a'], buc[s[i] - 'a'] = i;
    memset(buc, 0, sizeof buc);
    for (int i = 1; i <= m; ++i) pre2[i] = buc[t[i] - 'a'], buc[t[i] - 'a'] = i;
    memset(buc, 0, sizeof buc);
    for (int i = m; i; --i) ne2[i] = buc[t[i] - 'a'], buc[t[i] - 'a'] = i;
    for (int i = 1; i <= n; ++i)
        if (!ne[i]) ne[i] = n + 1;
    for (int i = 1; i <= m; ++i)
        if (!ne2[i]) ne2[i] = m + 1;
    int l = 1, r = min(n, m), best = 0;
    while (l <= r) {
        int mid = l + r >> 1;
        chk(mid) ? (best = mid, l = mid + 1) : (r = mid - 1);
    } cout << best << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：4

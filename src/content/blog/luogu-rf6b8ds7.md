---
title: "P10803 [CEOI 2024] 文本编辑器 题解"
date: "2026-07-20T15:04:22.000Z"
link: "luogu-rf6b8ds7"
categories: ["题解"]
tags: ["洛谷", "基础算法", "模拟"]
draft: false
---

有点 boring 的题。很显然有答案上界 $|sl-el|+|sc-ec|$。

如果在某一行最左侧不能按左键，在某一行最右侧不能按右键，那么问题是十分简单的，容易发现此时直接从 $(sl,sc)$ 位置开始，先一直按上键 / 下键直到和 $(el,ec)$ 处于同一行，然后再按左键 / 右键移动过去即可。

然后考虑加上上面这个特殊移动方式。观察这个东西的性质可以发现如果在移动过程中存在两次在某一行最左侧向左移动的操作到达某一行最右侧的位置，则一定不如不执行第一次想做移动的操作优。向右移动的操作也同理。

因此移动过程中最多存在一次在最左侧向左移动的特殊移动方式和一次在最右侧向右移动的特殊移动方式。考虑维护 $L_i$ 表示从 $(sl,sc)$ 位置出发，移动到第 $i$ 行最左侧位置所需的最少移动次数，$R_i$ 表示从 $(sl,sc)$ 位置出发，移动到第 $i$ 行最右侧位置所需的最少移动次数。这两个东西都是可以 $O(n)$ 简单处理的。具体的：先求出不存在特殊移动方式时的最小代价，然后因为最多存在两次特殊移动所以模拟两次特殊移动方式更新 $L_i,R_i$ 的值即可。最后统计答案是简单的。

时间复杂度为 $O(n\log n)$，瓶颈在于统计答案时需要维护行长度的区间最小值。理论可以做到严格线性。

:::success[代码实现]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
    
}

int a[N], lg[N], f[N][20], L[N], R[N];
inline int qry(int l, int r) {
    if (l > r) swap(l, r);
    int lgx = lg[r - l + 1];
    return min(f[l][lgx], f[r - (1 << lgx) + 1][lgx]);
}

inline void sol() {
    int n, sl, sc, el, ec; cin >> n >> sl >> sc >> el >> ec;
    for (int i = 1; i <= n; ++i) cin >> a[i], f[i][0] = ++a[i];
    lg[0] = -1; for (int i = 1; i < N; ++i) lg[i] = lg[i >> 1] + 1;
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= n - (1 << i) + 1; ++j) f[j][i] = min(f[j][i - 1], f[j + (1 << (i - 1))][i - 1]);
    for (int i = sl, j = sc; i; --i, j = min(j, a[i])) L[i] = sl - i + j - 1, R[i] = sl - i + a[i] - j;
    for (int i = sl, j = sc; i <= n; ++i, j = min(j, a[i])) L[i] = i - sl + j - 1, R[i] = i - sl + a[i] - j;
    for (int i = 2; i <= n; ++i) L[i] = min({L[i], L[i - 1] + 1, R[i - 1] + 1});
    for (int i = n - 1; i; --i) L[i] = min(L[i], L[i + 1] + 1), R[i] = min(R[i], L[i + 1] + 1);
    for (int i = 2; i <= n; ++i) L[i] = min({L[i], L[i - 1] + 1, R[i - 1] + 1});
    for (int i = n - 1; i; --i) L[i] = min(L[i], L[i + 1] + 1), R[i] = min(R[i], L[i + 1] + 1);
    int res = abs(sl - el) + abs(ec - min(sc, qry(sl, el)));
    for (int i = 1; i <= n; ++i) res = min(res, L[i] + abs(i - el) + abs(ec - 1));
    for (int i = 1; i <= n; ++i) res = min(res, R[i] + abs(i - el) + abs(ec - min(a[i], qry(i, el))));
    cout << res << '\n';
}

} // namespace lowspeed_song
```

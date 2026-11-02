---
title: "CF1442D Sum 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-cf1442d"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "分治"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1442D).
:::

:::info[Solution]{open}
经典套路了。观察性质可以发现最优解一定是枚举一个数字选了一半，剩下的数组要么全选要么全都不选。证明可以调整法简单处理。直接暴力背包转移时间复杂度是 $O(n^2k^2)$ 的，考虑优化。容易想到背包满足加法因此直接维护前后缀背包最后合并，时间复杂度为 $O(nk^2)$，仍需优化。

考虑分治，对当前的分治区间 $[l,r]$ 求出区间中点 $mid$，然后把 $[mid+1,r]$ 区间作为 $01$ 背包的物品插入，对 $[l,mid]$ 递归处理，然后再倒过来做一遍即可。这样每个数组就只会被插入 $\log$ 次而不是原来的 $n$ 次，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> a[N];
int sum[N], res, n, k, f[N];
inline void cdq(int l, int r) {
    if (l == r) {
        int pre = 0;
        for (int i = 0; i <= min<int>(k, a[l].size()); ++i)
            res = max(res, pre + f[k - i]), pre += a[l].size() == i ? 0 : a[l][i];
        return;
    } vector<int> g(k + 1);
    for (int i = 0; i <= k; ++i) g[i] = f[i];
    int mid = l + r >> 1;
    for (int i = mid + 1; i <= r; ++i)
        for (int j = k; j >= a[i].size(); --j)
            f[j] = max(f[j], f[j - a[i].size()] + sum[i]);
    cdq(l, mid);
    for (int i = 0; i <= k; ++i) f[i] = g[i];
    for (int i = l; i <= mid; ++i)
        for (int j = k; j >= a[i].size(); --j)
            f[j] = max(f[j], f[j - a[i].size()] + sum[i]);
    cdq(mid + 1, r);
}

inline void sol() {
    cin >> n >> k;
    for (int i = 1; i <= n; ++i) {
        int t; cin >> t;
        a[i].resize(t);
        for (int &j : a[i]) cin >> j, sum[i] += j;
    } cdq(1, n), cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：7

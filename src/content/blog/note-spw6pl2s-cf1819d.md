---
title: "CF1819D Misha and Apples 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-cf1819d"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "动态规划"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1819D).
:::

:::info[Solution]{open}
我咋可以爆紫贪心了（

注意到最后一次清空操作之前加入到集合中的数都是无效的，因此考虑贪心的让最后一次清空操作的时刻尽量的靠前。

考虑 dp。设 $f_i$ 表示若只操作编号在 $[1,i]$ 范围内的集合，最后一次清空操作最靠前位于 $f_i$ 位置。则若已知 $f_n$，答案可以简单分类讨论得出：

+ 若 $(f_n,n]$ 范围内存在超级集合，则答案必然为 $m$。
+ 否则，答案就是 $(f_n,n]$ 区间内集合的并集大小。

现在考虑快速计算 $f_1,f_2,\ldots,f_n$ 的值。容易发现 $f_i$ 数组是单调不下降的，因此考虑直接双指针滑动扫描解决。具体的：先令 $f_i\leftarrow f_{i-1}$，然后向右扫描移动 $f_i$ 的位置即可。这个部分是简单的，因此不再赘述。

算法时间复杂度为 $O(n)$，可以通过本题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> a[N];
int f[N], las[N], can[N], pre[N];

inline void sol() {
    int n, m; cin >> n >> m;
    for (int i = 1; i <= n; ++i) {
        int k; cin >> k;
        vector<int> S(k);
        for (int &j : S) cin >> j, las[j] = 0;
        a[i] = S, pre[i] = pre[i - 1];
        if (S.empty()) ++pre[i];
    }
    can[0] = 1;
    for (int i = 1, j = 0; i <= n; ++i) {
        int pos = 0;
        for (int &k : a[i]) pos = max(pos, las[k]), las[k] = i;
        if (j < pos || pre[i] != pre[j]) can[i] = 1;
        else can[i] = 0;
        j = max(j, pos);
        while (!can[j]) ++j;
        f[i] = j;
    } if (pre[n] != pre[f[n]]) cout << m << '\n';
    else {
        int res = 0;
        for (int i = f[n] + 1; i <= n; ++i) res += a[i].size();
        cout << res << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：蓝

鲜活指数：9

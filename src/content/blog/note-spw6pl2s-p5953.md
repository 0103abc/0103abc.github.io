---
title: "P5953 [POI 2018] Różnorodność 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p5953"
categories: ["题解"]
tags: ["洛谷", "数学", "线性代数", "基础算法", "差分"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P5953).
:::

:::info[Solution]{open}
考虑对每种颜色分开处理，然后计算这个颜色对哪些 $k\times k$ 大小的子矩阵有贡献。

对一个位于 $(i,j)$ 的数字，其会出现在所有满足 $x\in[i,i+k-1],y\in[j,j+k-1]$ 的窗口中，也就是可以看作给 $f$ 数组的一个子矩形整体 $+\;\!1$。但是这样的话因为同一种颜色可能出现多次，多个贡献矩形之间会互相重叠，而同一个颜色再同一个窗口中只能算一次。即产生贡献的部分是所有窗口的并集。因此考虑对每种颜色，按行做扫描线：

+ 扫描到某个点 $(i,j)$ 时，将横向区间 $[j,j+k-1]$ 加入到一个 multiset 中。
+ 扫描到第 $i+k$ 行的时候，把前面加入的横向区间删除。
+ multiset 中维护当前扫描行上仍然有效的所有区间。对一次插入或删除区间 $[l,r]$ 的操作而言，只需要处理其再 multiset 中的前驱和后继得到其真正新增或消失的部分，二维差分将贡献 $O(1)$ 加入到答案数组中即可。

容易证明上述做法的正确性。时间复杂度为 $O(n^2\log n)$，可以通过该题。
:::

:::success[Code]
大份。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

set<int> se;
vector<int> buc[N];
int a[3010][3010], cnt[N], diff[3010][3010], n, m, k;
inline void mdf(int x, int l, int o) {
    if (o == 1) {
        if (++cnt[l] > 1) return;
        auto it = se.insert(l).first;
        int L = l, R = min(m, l + k - 1);
        if (it != se.begin()) L = max(L, *prev(it) + k);
        if (++it != se.end()) R = min(R, *it - 1);
        if (x <= n && L <= R) ++diff[x][L], --diff[x][R + 1];
    } else {
        if (--cnt[l] > 0) return;
        auto it = se.find(l);
        int L = l, R = min(m, l + k - 1);
        if (it != se.begin()) L = max(L, *prev(it) + k);
        if (++it != se.end()) R = min(R, *it - 1);
        if (x <= n && L <= R) --diff[x][L], ++diff[x][R + 1];
        se.erase(--it);
    }
}
inline void gao(vector<int> &vec) {
    int i = 0, j = 0;
    while (i < vec.size() && j < vec.size()) {
        int ii = i;
        if (vec[i] / (m + 1) <= vec[j] / (m + 1) + k) mdf(vec[i] / (m + 1), vec[i] % (m + 1), 1), ++i;
        if (vec[ii] / (m + 1) >= vec[j] / (m + 1) + k) mdf(vec[j] / (m + 1) + k, vec[j] % (m + 1), -1), ++j;
    } while (j < vec.size()) mdf(vec[j] / (m + 1) + k, vec[j] % (m + 1), -1), ++j;
    se.clear();
}

inline void sol() {
    cin >> n >> m >> k;
    for (int i = 1; i <= n; ++i) for (int j = 1; j <= m; ++j)
        cin >> a[i][j], buc[a[i][j]].emplace_back(i * (m + 1) + j);
    for (int i = 1; i < N; ++i) if (buc[i].size()) gao(buc[i]);
    // cerr << "!!!\n";
    for (int i = 1; i <= n; ++i)
        for (int j = 1; j <= m; ++j) diff[i][j] += diff[i][j - 1] + diff[i - 1][j] - diff[i - 1][j - 1];
    int mx = 0, sum = 0;
    for (int i = k; i <= n; ++i)
        for (int j = k; j <= m; ++j) mx = max(mx, diff[i][j]), sum += diff[i][j];
    cout << mx << ' ' << sum << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：2

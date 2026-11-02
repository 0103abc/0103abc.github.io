---
title: "P7843 「C.E.L.U-03」布尔 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p7843"
categories: ["题解"]
tags: ["洛谷", "基础算法", "模拟", "数据结构", "并查集", "二分"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P7843).
:::

:::info[Solution]{open}
~~这题为啥被放 2-Sat 题单里了来着~~ 哦好像确实有点关系（）

感觉和 nfls 提高组模拟赛 R1 的 T4 很相似啊。考虑拆点然后扩展域并查集，给每个变量 $i$ 建立两个点 $(i,0),(i,1)$ 然后加入限制 $(s_u=x)\Leftrightarrow(s_v=y)$，需要合并结点 $(u,x),(v,y)$ 和 $(u,x\oplus 1),(v,y\oplus 1)$。如果存在某个变量 $i$ 满足 $(i,0),(i,1)$ 被直接或者间接合并到了一起，则当前限制下必然无解。

套路的考虑维护 $f_i$ 表示最小的 $j$ 使得 $[i,j]$ 区间内的限制是无解的。特殊的，如果 $i$ 到 $m$ 都是合法的则记 $f_i=m+1$。$f_i$ 是单调递增的，可以整体二分 $2\log$ 求出来。

询问是简单的，直接倍增求即可。总时间复杂度为 $O(n\log^2n+Q\log n)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

struct undoDSU {
    int fa[N], siz[N];
    stack<pair<int, int>> hist;
    inline undoDSU() { iota(fa, fa + N, 0), fill(siz, siz + N, 1); }
    inline void init(int maxn) { iota(fa, fa + maxn + 1, 0), fill(siz, siz + maxn + 1, 1); }
    inline int find(int x) { return fa[x] == x ? x : find(fa[x]); }
    inline int merge(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) return 0;
        if (siz[x] < siz[y]) swap(x,y);
        siz[x] += siz[y], fa[y] = x, hist.emplace(x, y);
        return 1;
    }
    inline int snap() { return hist.size(); }
    inline void undo(int timestamp) {
        while (hist.size() > timestamp) {
            auto [x, y] = hist.top();
            hist.pop(), fa[y] = y, siz[x] -= siz[y];
        }
    }
} dsu;

int n, u[N], v[N], f[N];
inline int anot(int x) { return x <= n ? x + n : x - n; }
inline void ae(int x) { dsu.merge(u[x], v[x]), dsu.merge(anot(u[x]), anot(v[x])); }
inline void cdq(int l, int r, int ll, int rr) {
    if (l > r) return;
    if (ll == rr) {
        for (int i = l; i <= r; ++i) f[i] = ll;
        return;
    } int mid = l + r >> 1, timestamp = dsu.snap();
    for (int i = mid; i <= min(r, ll - 1); ++i) ae(i);
    int timestamp_ = dsu.snap();
    for (int i = max(mid, ll); i <= rr; ++i) {
        ae(i);
        if (dsu.find(u[i]) == dsu.find(anot(u[i]))) {
            f[mid] = i;
            break;
        }
    } dsu.undo(timestamp_);
    cdq(l, mid - 1, ll, f[mid]);
    dsu.undo(timestamp);
    for (int i = max(ll, r + 1); i < f[mid]; ++i) ae(i);
    cdq(mid + 1, r, f[mid], rr), dsu.undo(timestamp);
}

int st[N][20], pre[N];

inline void sol() {
    int m, q; cin >> n >> m >> q;
    for (int i = 1; i <= m; ++i) {
        int a, x, b, y; cin >> a >> x >> b >> y;
        u[i] = a + x * n, v[i] = b + y * n, pre[i] = pre[i - 1] + (int)(a == b && x != y);
    } u[m + 1] = 1, v[m + 1] = n + 1, cdq(1, m, 1, m + 1);
    for (int i = 1; i <= m; ++i) st[i][0] = f[i];
    st[m + 1][0] = m + 1;
    for (int i = 1; i < 20; ++i)
        for (int j = 1; j <= m + 1; ++j)
            st[j][i] = st[st[j][i - 1]][i - 1];
    while (q--) {
        int l, r; cin >> l >> r;
        if (pre[l - 1] != pre[r]) { cout << -1 << '\n'; continue; }
        int cnt = 0, pos = l;
        for (int i = 19; ~i; --i)
            if (st[pos][i] <= r) cnt |= (1 << i), pos = st[pos][i];
        cout << cnt + 1 << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：4

---
title: "P14019 [ICPC 2024 Nanjing R] 地铁 题解"
date: "2026-08-09T00:22:35.000Z"
link: "luogu-b7f04cci"
categories: ["题解"]
tags: ["洛谷", "图论", "最短路", "基础算法", "排序"]
draft: false
---

考虑用一个二元组 $(u,i)$ 来维护状态，表示当前在车站 $u$ 的 $i$ 号线上。一个暴力的做法是直接建出整张图然后跑 dijk，但是时间复杂度明显爆炸了。

注意到导致边的数量爆炸的原因主要是换乘，因此考虑优化这个部分。在某个车站从线路 $x$ 换到线路 $y$ 的代价固定为 $a_yb_x$。如果 $(u,x)$ 状态的最短距离已经被去确定为 $(u,x)$ 则她换到 $y$ 线的总距离就是 $dis_x+b_xa_y$ 是一个一次函数的形式（把 $a_y$ 看作变量 $t$ 后可以被表示为 $f_x(t)=b_xt+d_x$）。因此考虑对每个车站把所有已经确定的线路对应的直接放到一个 LiChao SegTree 上，此时对每个车站直接把所有已经确定的线路对应的直线扔到李超树里，要切换到线路 $y$ 的时候只需要查询 $f_x(t)$ 函数在 $t=a_y$ 位置的最小值即可。

然后注意到 $b_x>0$ 一定成立，因此所有的 $f_x(t)$ 都是单调递增的直线，因此考虑在当前站台所有没有确定的线路都按照 $a_y$ 的值从小到大排序，则换乘得到的下一个最小后按一定是 $a_y$ 最小的那一个。对每个车站维护指针每次只把当前最小的 $a$ 的未确定状态加入 dijkstra 即可。

具体来说，跑 dijkstra 的过程中若当前弹出的状态是 $(u,i)$，则考虑先用她来更新 $u$ 车站的答案然后把 $u$ 的 LiChao SegTree 插入直线 $b_it+dis$，沿着 $i$ 号线路走到下一站，找到车站 $u$ 中 $a$ 值最小的没有确定的线路 $j$ 查询 LiChao SegTree 中 $a$ 值最小的没有确定的线路 $j$ 查询 LiChao SegTree 在 $a_j$ 位置的值然后将其加入候选队列即可。时间复杂度是 $O(n\log n)$ 级别的。具体见代码。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> rail[N];
int n, k, a[N], b[N], frt[N], bel[N], e[N], pos[N], idx_, w[N], dis[N], res[N], vis[N];

namespace LiChaoSgt {
    vector<int> tree[N];
    pair<int, int> seg[N];
    inline int calc(int id, int u, int x) {
        if (!id) return inf;
        return seg[id].first * a[bel[rail[u][x]]] + seg[id].second;
    }
    inline void ins(int u, int l, int r, int rt, int id) {
        if (l == r) {
            if (!tree[u][rt] || calc(id, u, l) < calc(tree[u][rt], u, l)) tree[u][rt] = id;
            return;
        } int mid = l + r >> 1;
        if (calc(id, u, mid) < calc(tree[u][rt], u, mid)) swap(tree[u][rt], id);
        if (calc(id, u, l) < calc(tree[u][rt], u, l)) ins(u, l, mid, rt << 1, id);
        if (calc(id, u, r) < calc(tree[u][rt], u, r)) ins(u, mid + 1, r, rt << 1 | 1, id);
    }
    inline void ins(int u, int k, int b, int id) { seg[id] = {k, b}, ins(u, 0, (int)rail[u].size() - 1, 1, id); }
    inline int qry(int u, int l, int r, int rt, int val) {
        if (l == r) return calc(tree[u][rt], u, val);
        int mid = l + r >> 1, now = calc(tree[u][rt], u, val);
        if (val <= mid) return min(now, qry(u, l, mid, rt << 1, val));
        return min(now, qry(u, mid + 1, r, rt << 1 | 1, val));
    }
    inline int qry(int u, int pos) { return qry(u, 0, (int)rail[u].size() - 1, 1, pos); }
}

inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n >> k;
    for (int i = 1; i <= k; ++i) cin >> a[i];
    for (int i = 1; i <= k; ++i) cin >> b[i];
    for (int i = 1; i <= k; ++i) {
        int p, x, las = ++idx_;
        cin >> p >> x;
        frt[las] = x, bel[las] = i, rail[x].emplace_back(las);
        for (int j = 1; j < p; ++j) {
            int c, now = ++idx_; cin >> c >> x;
            frt[now] = x, bel[now] = i, rail[x].emplace_back(now);
            e[las] = now, w[las] = c, las = now;
        }
    }
    for (int i = 1; i <= n; ++i) sort(rail[i].begin(), rail[i].end(), [&](auto &x, auto &y) { return a[bel[x]] < a[bel[y]]; });
    for (int i = 1; i <= n; ++i) LiChaoSgt::tree[i].resize(rail[i].size() * 4 + 5);
    memset(dis, 0x3f, sizeof dis), memset(res, 0x3f, sizeof res);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;
    for (int &i : rail[1]) dis[i] = 0, q.emplace(0, i);
    // cerr << "!!!\n";
    while (q.size()) {
        auto [D, id] = q.top();
        q.pop();
        if (vis[id] || D != dis[id]) continue;
        vis[id] = 1;
        int u = frt[id], c = bel[id];
        res[u] = min(res[u], D), LiChaoSgt::ins(u, b[c], D, id);
        if (e[id] && dis[e[id]] > D + w[id]) dis[e[id]] = D + w[id], q.emplace(dis[e[id]], e[id]);
        while (pos[u] < rail[u].size() && vis[rail[u][pos[u]]]) ++pos[u];
        if (pos[u] < rail[u].size()) {
            int nd = LiChaoSgt::qry(u, pos[u]);
            if (dis[rail[u][pos[u]]] > nd) dis[rail[u][pos[u]]] = nd, q.emplace(nd, rail[u][pos[u]]);
        }
    }
    for (int i = 2; i <= n; ++i) cout << res[i] << ' ';
    cout << '\n';
}

} // namespace lowspeed_song
```
:::

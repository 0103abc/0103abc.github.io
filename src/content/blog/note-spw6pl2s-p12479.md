---
title: "P12479 [集训队互测 2024] 长野原龙势流星群 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p12479"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "动态规划", "基础算法", "贪心"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P12479).
:::

:::info[Solution]{open}
挺简单的题，但是容易想到数据结构优化 dp 上去。

考虑贪心。DFS 遍历整个树。设当前遍历的结点为 $u$ 点，且 $u$ 点为根的所有子树都已经被遍历过，则 $u$ 点的答案可能是：

+ 只选择 $u$ 点自己。
+ 选择 $u$ 点和其若干个子树 $v$ 内的点。容易发现此时为了让所有选出的点都和 $u$ 点在树上连通，必须要选择一个以 $v$ 为根的连通块拼接到点 $u$ 上。

但是发现这个东西不太好维护，因此考虑换一个方向，用堆来维护每个当前时刻被合并的连通块，每次找到平均值最大的连通块，更新该连通块最顶端结点的答案，然后将该连通块和其父亲结点所属的连通块合并并重新加入到堆中。容易证明该做法的正确性。

时间复杂度为 $O(n\log n)$，可以通过。具体实现可以再写一个并查集来维护树上连通块的信息。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int p[N], w[N], cnt[N], sum[N];

struct Node {
    int high, cnt, sum;
    inline bool operator<(const Node &r) const {
        return sum * r.cnt < r.sum * cnt;
    }
};

struct DSU {
    int fa[N];
    inline DSU() { iota(fa, fa + N, 0); }
    inline int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }
    inline int merge(int x, int y) {
        x = find(x), y = find(y);
        if (x != y) return fa[x] = y, 1;
        return 0;
    }
} dsu;

ld res[N];

inline void sol() {
    int n; cin >> n;
    for (int i = 2; i <= n; ++i) cin >> p[i];
    for (int i = 1; i <= n; ++i) cin >> w[i];
    for (int i = 1; i <= n; ++i) cnt[i] = 1, sum[i] = w[i];
    priority_queue<Node> q;
    for (int i = 1; i <= n; ++i) q.push({i, 1, w[i]});
    while (q.size()) {
        int x = q.top().high; q.pop();
        if (dsu.fa[x] == x) {
            res[x] = 1.L * sum[x] / cnt[x];
            if (p[x]) {
                int up = dsu.find(p[x]);
                dsu.fa[x] = up, sum[up] += sum[x], cnt[up] += cnt[x];
                q.push({up, cnt[up], sum[up]});
            } else dsu.fa[x] = 0;
        }
    } for (int i = 1; i <= n; ++i) cout << res[i] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：7

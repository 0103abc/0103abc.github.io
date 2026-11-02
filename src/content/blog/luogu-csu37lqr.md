---
title: "CF1033E Hidden Bipartite Graph 题解"
date: "2026-07-01T13:34:43.000Z"
link: "luogu-csu37lqr"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分", "算法思想", "构造", "图论", "树"]
draft: false
---

题目给的操作看着就十分不优美，同样还是考虑先构造出一些更好被利用的操作。

考虑如何判定一个点和一个点集之间是否有边相连。容易想到先询问点集内边的数量，然后把点加入点集再询问新的点集内边的数量。若两次询问结果相同则没有边相连，否则一定有边相连。容易发现这个过程还可以顺便算出点和点集之间边的数量。

然后再考虑如何找出这样的一条边。容易想到对点集二分，若二分得到的点集左区间和点有边相连，那么就在左区间里继续二分；否则在右区间里继续二分。

最后考虑如何在点集中找出一条边。方法和上面的差不多同样也是二分集合，这里就不再赘述了。

如果已知图的一个生成树（因为图是连通的所以一定存在一个生成树），则直接把点按在生成树上的深度的奇偶性黑白染色，然后看两个颜色的集合是否都是内部没有边相连的即可。然后考虑怎么找一个生成树，容易想到用栈来模拟这个过程，初始栈中只有根结点，然后每次操作判断当前栈顶结点是否和没有连过边的集合有边相连，若有就直接连上然后扩展栈，否则弹出栈顶元素。容易证明这个策略可以正确的找到图的一个生成树。

于是这个题就做完了，时间复杂度 $O(n\log n)$，询问次数也是 $O(n\log n)$ 的，询问限制很松基本上怎么写都能过。

:::success[代码]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N];
vector<int> adj[N];

inline int qry(vector<int> vec) {
    if (vec.size() < 2) return 0;
    cout << "? " << vec.size() << endl;
    for (int &i : vec) cout << i << ' ';
    cout << endl;
    int _ ; cin >> _;
    return _;
}

// 计算点 x 和点集 vec 之间的连边数量
inline int count(int x, vector<int> vec) {
    int v1 = qry(vec);
    vec.emplace_back(x);
    return qry(vec) - v1;
}

// 从 u 点出发找其在 other 集合里的相邻结点
inline int find(int u, vector<int> other) {
    int l = 0, r = other.size() - 1, best = -1;
    while (l <= r) {
        int mid = l + r >> 1;
        vector<int> tmp;
        for (int j = 0; j <= mid; ++j) tmp.emplace_back(other[j]);
        count(u, tmp) ? (best = mid, r = mid - 1) : (l = mid + 1);
    } assert(~best);
    return other[best];
}

// 找出点集 vec 中至少一条边
inline pair<int, int> find_edge(vector<int> vec) {
    int l = 0, r = vec.size() - 1, best = -1;
    while (l <= r) {
        int mid = l + r >> 1; 
        vector<int> tmp;
        for (int i = 0; i <= mid; ++i) tmp.emplace_back(vec[i]);
        qry(tmp) ? (best = mid, r = mid - 1) : (l = mid + 1);
    } int x = vec[best];
    vector<int> near;
    for (int &i : vec) if (i != x) near.emplace_back(i);
    return {x, find(x, near)};
}

int dep[N], up[N];

// 求树上 u~v 的简单路径
inline vector<int> getpath(int u, int v) {
    if (dep[u] < dep[v]) swap(u, v);
    vector<int> lnk, lnk2;
    while (dep[u] > dep[v]) lnk.emplace_back(u), u = up[u];
    while (u != v) lnk.emplace_back(u), lnk2.emplace_back(v), u = up[u], v = up[v];
    lnk.emplace_back(u); reverse(lnk2.begin(), lnk2.end());
    for (int &i : lnk2) lnk.emplace_back(i);
    return lnk;
}

inline void sol() {
    int n, cnt = 0; cin >> n;
    vector<int> other;
    for (int i = 2; i <= n; ++i) other.emplace_back(i);
    stack<int> stk;
    stk.emplace(1);
    while (stk.size()) {
        if (other.empty()) break;
        if (!count(stk.top(), other)) { stk.pop(); continue; }
        int v = find(stk.top(), other);
        adj[stk.top()].emplace_back(v), adj[v].emplace_back(stk.top());
        dep[v] = dep[stk.top()] + 1, up[v] = stk.top();
        for (int i = 0; i < other.size(); ++i)
            if (other[i] == v) { other.erase(other.begin() + i); break; }
        stk.emplace(v);
    }
    vector<int> part[2];
    for (int i = 1; i <= n; ++i) part[dep[i] & 1].emplace_back(i);
    if (qry(part[0])) {
        auto [x, y] = find_edge(part[0]);
        vector<int> cyc = getpath(x, y);
        cout << "N " << cyc.size() << endl;
        for (int &i : cyc) cout << i << ' ';
        cout << endl;
        return;
    }
    if (qry(part[1])) {
        auto [x, y] = find_edge(part[1]);
        vector<int> cyc = getpath(x, y);
        cout << "N " << cyc.size() << endl;
        for (int &i : cyc) cout << i << ' ';
        cout << endl;
        return;
    }
    cout << "Y " << part[0].size() << endl;
    for (int &i : part[0]) cout << i << ' ';
    cout << endl;
}

} // namespace lowspeed_song
```
:::

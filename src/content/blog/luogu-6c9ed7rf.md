---
title: "CF2245G NPC Challenge 题解"
date: "2026-08-13T22:08:33.000Z"
link: "luogu-6c9ed7rf"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造", "分治"]
draft: false
---

部分参考了官方题解。

题目给的操作直接用起来很不方便，因此套路的考虑先构造几个操作。若两个集合 $A,B$ 都已经被确定为是独立集，则考虑先把 $A$ 集合按照任意顺序加入 $S$ 中，然后再把 $B$ 集合按照任意顺序加入 $S$ 中。则此时必然可以得到集合 $N(A)\cap B$ 的信息（即 $A\cup B$ 中所有未被加入集合 $S$ 中的元素）。

（然后我就不会做了，观察了 40min 没想到任何东西）

设 $A,B$ 两个集合都是独立集，同时保证 $B$ 集合中的每个点至少和 $A$ 集合中的一个点相邻。把 $A$ 集合划分为 $A_1,A_2$ 两个集合，则先求出 $B_1=N(A_1)\cap B$，则 $B_1$ 集合中的点一定和 $A_1$ 集合有边相邻，可以递归处理 $(A_1,B_1)$ 的信息。同样也可以得出 $B_2=(B\backslash B_1)\cup (N(A_2)\cap B_1)$ 然后递归处理 $(A_2,B_2)$ 的信息。边界条件是 $|A|=1$ 此时 $B$ 集合的所有点都只能和 $A$ 集合中唯一的点相邻，特殊处理即可。

然后考虑怎么处理整个树。考虑对一个点集 $V$ 询问一次，然后把成功加入的点扔到集合 $S$ 中，没成功加入的点扔到集合 $T$ 中。则此时显然 $S$ 集合是独立集，$T$ 集合中的每个点都至少和某个已经进入集合的 $S$ 点相邻。因为原图是树，因此 $T$ 集合的诱导子图是一片森林，递归处理 $T$ 求出 $T$ 内部的每一条边后，把森林黑白染色后可以得到两个独立集 $T_0,T_1$。因此考虑对每个 $T_i$ 用一开始构造的操作找出所有 $S$ 集合中所有和 $T_i$ 集合相邻的点组成的集合，然后用上面的独立集分治求出 $T_i$ 集合和 $S$ 集合之间的所有边信息即可。精细实现一下即可满足题目的询问限制。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, vis[N];
vector<int> adj[N];

inline string qry(vector<int> vec) {
    cout << "? " << vec.size() << ' ';
    for (int &i : vec) cout << i << ' '; cout << endl;
    string repo; cin >> repo; return repo;
}

inline vector<int> get(vector<int> a, vector<int> b) {
    if (a.empty() || b.empty()) return {};
    vector<int> vec, c = a; for (int &i : b) c.emplace_back(i);
    string s = qry(c);
    for (int i = 0; i < b.size(); ++i)
        if (s[a.size() + i] == '0') vec.emplace_back(b[i]);
    return vec;
}
inline void find_e(vector<int> a, vector<int> b) {
    if (a.empty() || b.empty()) return;
    if (a.size() == 1) {
        for (int &v : b) {
            adj[a[0]].emplace_back(v);
            adj[v].emplace_back(a[0]);
        } return;
    }
    vector<int> a1, a2;
    for (int i = 0; i < a.size() / 2; ++i) a1.emplace_back(a[i]);
    for (int i = a.size() / 2; i < a.size(); ++i) a2.emplace_back(a[i]);
    vector<int> b1 = get(a1, b);
    for (int &i : b1) vis[i] = 1;
    vector<int> b2;
    for (int &i : b) if (!vis[i]) b2.emplace_back(i);
    for (int &i : b1) vis[i] = 0;
    vector<int> vec = get(a2, b1);
    for (int &i : vec) b2.emplace_back(i);
    find_e(a1, b1), find_e(a2, b2);
}

int col[N];
vector<int> buc[2];
inline void dfs(int u, int c) {
    col[u] = c, buc[c].emplace_back(u);
    for (int &v : adj[u]) if (!~col[v]) dfs(v, c ^ 1);
}

inline void cdq(vector<int> vec) {
    if (vec.size() < 2) return;
    vector<int> a, b;
    string s = qry(vec);
    for (int i = 0; i < vec.size(); ++i) {
        if (s[i] == '1') a.emplace_back(vec[i]);
        else b.emplace_back(vec[i]);
    } cdq(b);
    for (int i = 1; i <= n; ++i) col[i] = -1;
    buc[0].clear(), buc[1].clear();
    for (int &i : b) if (!~col[i]) dfs(i, 0);
    for (int i = 0; i < 2; ++i) find_e(buc[i], get(buc[i], a));
}

inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n;
    for (int i = 1; i <= n; ++i) adj[i].clear();
    vector<int> vec(n); iota(vec.begin(), vec.end(), 1);
    cdq(vec);
    cout << "!" << endl;
    for (int i = 1; i <= n; ++i) for (int &j : adj[i])
        if (i < j) cout << i << ' ' << j << '\n';
}

} // namespace lowspeed_song
```
:::

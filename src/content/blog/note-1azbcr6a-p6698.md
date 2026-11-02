---
title: "P6698 [BalticOI 2020] 病毒 (Day2) 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p6698"
categories: ["题解"]
tags: ["洛谷", "字符串", "自动机", "基础算法", "排序", "图论", "最短路"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P6698).
:::

:::info[Solution]{open}
这个真难吧。。。。。。直接复读题解了

设 $f_{x.s,t}$ 表示从一个基因 $x$ 开始，经过若干次变异最终得到一个 $01$ 串 $w$ 而且满足 AC 自动机一开始处于状态 $s$，把 $w$ 从左往右放入 AC 自动机中，中途不能经过任何一个匹配到抗体的危险状态，最后自动机停在状态 $t$，最短的串 $w$ 长度是多少。如果不存在这样的串 $w$ 则记 $f_{x,s,t}=+\infin$。

为了方便，后面记 $go(s,c)$ 表示在 AC 自动机上从 $s$ 状态出发，沿着 $c$ 字符的方向扩展一步后状态的位置是哪里。

初始条件就是对基因 $0,1$，如果从 $s$ 状态走过去不会进入危险状态的话，那么就有 $f_{c,s,go(s,c)}=1$。

然后考虑处理变异规则。假设有规则 $a\to b_1b_2\ldots b_k$，则考虑固定初始状态 $s$ 设 $g_u$ 表示处理完当前的若干个基因后，停在状态 $u$ 所需要的最短长度。每次加入一个基因 $b_i$ 时直接转移 $g'_v\leftarrow\min\limits_u(g_u+f_{b_i,u,v})$ 即可。

但是直接拓扑排序显然是不行的，因为转移图可能存在环。因此考虑用一个类似 SPFA 的过程来维护维护转移过程，如果一个状态能够更新答案那么才将其加入到队列中即可。时间复杂度是 $O(能过)$ 的。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int idx = 0, fail[N];
struct Node {
    int ne[2], bad;
    inline Node() { ne[0] = ne[1] = bad = 0; }
} tree[102];
struct Info {
    int x;
    vector<int> a;
} rule[102];
int G, n, m, f[52], g[52], h[102][102][52], vis[N];
vector<int> adj[N];

inline void ins() {
    int n, now = 0; cin >> n;
    while (n--) {
        int c; cin >> c;
        if (!tree[now].ne[c]) tree[now].ne[c] = ++idx;
        now = tree[now].ne[c];
    } tree[now].bad = 1;
}

inline void build() {
    queue<int> q;
    for (int i = 0; i < 2; ++i)
        if (tree[0].ne[i]) q.emplace(tree[0].ne[i]);
    while (q.size()) {
        int t = q.front(); q.pop();
        tree[t].bad |= tree[fail[t]].bad;
        for (int i = 0; i < 2; ++i)
            if (tree[t].ne[i]) fail[tree[t].ne[i]] = tree[fail[t]].ne[i], q.emplace(tree[t].ne[i]);
            else tree[t].ne[i] = tree[fail[t]].ne[i];
    }
}

inline int gao(int id) {
    auto &[x, a] = rule[id];
    memset(f, 0, sizeof f), memset(g, 0, sizeof g);
    int ok = 0;
    for (signed i = 0; i <= idx; ++i) {
        for (signed j = 0; j <= idx; ++j) f[j] = inf;
        f[i] = 0;
        for (int &j : a) {
            #pragma GCC unroll 8
            for (signed k = 0; k <= idx; ++k) g[k] = inf;
            #pragma GCC unroll 8
            for (signed k = 0; k <= idx; ++k)
            #pragma GCC unroll 8
                for (int p = 0; p <= idx; ++p)
                    g[p] = min(g[p], f[k] + h[j][k][p]);
            for (signed k = 0; k <= idx; ++k) f[k] = g[k];
        }
            #pragma GCC unroll 8
        for (signed j = 0; j <= idx; ++j)
            if (f[j] < h[x][i][j]) h[x][i][j] = f[j], ok = 1;
    } return ok;
}

inline void sol() {
    memset(h, 0x3f, sizeof h);
    cin >> G >> n >> m;
    for (int i = 0; i < n; ++i) {
        cin >> rule[i].x;
        int k; cin >> k;
        while (k--) {
            int x; cin >> x;
            rule[i].a.emplace_back(x);
            adj[x].emplace_back(i);
        }
    } while (m--) ins();
    build();
    memset(f, 0x3f, sizeof f);
    for (int i = 0; i <= idx; ++i)
        for (int j = 0; j < 2; ++j)
            if(!tree[i].bad && !tree[tree[i].ne[j]].bad) h[j][i][tree[i].ne[j]] = 1;
    queue<int> q;
    q.emplace(0), q.emplace(1), vis[0] = vis[1] = 1;
    while (q.size()) {
        int t = q.front(); q.pop(), vis[t] = 0;
        for (int &id : adj[t]) if (gao(id) && !vis[rule[id].x]) vis[rule[id].x] = 1, q.emplace(rule[id].x);
    }
    for (int i = 2; i < G; ++i) {
        int res = inf;
        for (int j = 0; j <= idx; ++j) res = min(res, h[i][0][j]);
        if (res < inf / 2) cout << "NO " << res << '\n';
        else cout << "YES\n";
    }
}

} // namespace lowspeed_song
```
:::

难度：黑

鲜活指数：9

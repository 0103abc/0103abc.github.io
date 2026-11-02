---
title: "P6965 [NEERC 2016] Binary Code 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p6965"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "强连通分量"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P6965).
:::

:::info[Solution]{open}
注意到每个串最多有两种不同的选择方案，因此容易想到 2-Sat。然后看到前缀关系容易想到建立 Trie 树，则 $A$ 串是 $B$ 串的前缀当且仅当 $A$ 串在 Trie 上的结束结点是 $B$ 串在 Trie 上的结束结点的祖先。

因此假设某个候选状态 $x$ 结束在 Trie 树上节点 $u$，则选择 $x$ 状态后所有结束在 $u$ 到根节点路径上的串和在 $u$ 为根的子树里的串都不能被选。

一个非常暴力的做法是用 GBBST 优化建树做到 $O(n\log n)$ 条边然后跑 2-Sat，~~但是应该没有人类想写 GBBST~~，所以考虑一些更鲜活的做法。考虑拆出两个 semi-Trie 树，第一个 Trie 树的边从儿子结点指向父亲结点用来一次表示禁止所有祖先，第二个 Trie 树的边从父亲结点指向儿子结点用来一次表示禁止所有子树内结点。每个候选点只需要连到两个辅助 semi-Trie 结构上，然后再让 semi-Trie 上的结点连到该结点结束的候选的反状态就可以总共建立 $O(n)$ 条边完成整个 2-Sat 建图过程了。

最后跑一遍有向图 tarjan 即可。

总时间复杂度为 $O(n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n;
string s[N];

inline int anot(int x) {
    return (x <= n) ? x + n : x - n;
}

vector<int> adj[N];

inline void ae(int u, int v) {
    if (u && v) adj[u].emplace_back(v);
}

int ne[N][2], idx, tr[N];
vector<int> endpos[N];

inline void ins(string s, int id) {
    int now = n << 1 | 1;
    for (char &i : s) {
        if (!ne[now][i & 1]) ne[now][i & 1] = ++idx;
        now = ne[now][i & 1];
    } endpos[now].emplace_back(id);
}

inline void build(int u, int fa) {
    tr[u] = ++idx;
    if (fa) ae(u, fa), ae(tr[fa], tr[u]);
    for (int &v : endpos[u]) ae(v, fa), ae(u, anot(v)), ae(tr[u], anot(v));
    if (fa) for (int &v : endpos[fa]) ae(v, tr[u]);
    for (int &x : endpos[u]) for (int &y : endpos[u])
        if (x != y) ae(x, anot(y));
    if (ne[u][0]) build(ne[u][0], u);
    if (ne[u][1]) build(ne[u][1], u);
}

stack<int> stk;
int tms, dfn[N], low[N], bel[N], tot, ins_[N];

inline void dfs(int u) {
    dfn[u] = low[u] = ++tms, ins_[u] = 1, stk.emplace(u);
    for (int &v : adj[u])
        if (!dfn[v]) dfs(v), low[u] = min(low[u], low[v]);
        else if (ins_[v]) low[u] = min(low[u], dfn[v]);
    if (dfn[u] == low[u]) { ++tot;
        while (stk.top() != u) {
            int t = stk.top(); stk.pop();
            bel[t] = tot, ins_[t] = 0;
        }
        int t = stk.top(); stk.pop();
        bel[t] = tot, ins_[t] = 0;
    }
}

inline void sol() {
    cin >> n;
    idx = n << 1 | 1;
    map<string, int> buc;
    for (int i = 1; i <= n; ++i) {
        cin >> s[i];
        if (++buc[s[i]] == 3) { cout << "NO\n"; return; }
        int pos = -1;
        for (int j = 0; j < s[i].size(); ++j)
            if (s[i][j] == '?') { pos = j; break; }
        if (!~pos) ins(s[i], i), ins(s[i], n + i);
        else {
            string t = s[i];
            t[pos] = '0', ins(t, i);
            t[pos] = '1', ins(t, n + i);
        }
    } build(n << 1 | 1, 0);
    for (int i = 1; i <= idx; ++i)
        if (!dfn[i]) dfs(i);
    for (int i = 1; i <= n; ++i)
        if (bel[i] == bel[i + n]) { cout << "NO\n"; return; }
    cout << "YES\n";
    for (int i = 1; i <= n; ++i) {
        for (char &j : s[i])
            if (j == '?') {
                if (bel[i] < bel[i + n]) j = '0';
                else j = '1';
            }
        cout << s[i] << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：7

---
title: "P9483 [NOI2023] 合并书本 题解"
date: "2026-08-24T01:17:53.000Z"
link: "luogu-r0cjks8l"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "动态规划", "基础算法", "排序"]
draft: false
---

考虑把整个合并的过程看作一个二叉树的结构，每个非叶子结点都恰好有左儿子和右儿子两个子结点，表示把左儿子结点对应的所有书放到有儿子对应的书的上面。则如果这个二叉树的结构已经确定，则总费用可以被拆分为重量和磨损两个部分。具体的：记 $cnt_i$ 表示 $i$ 这本书在从叶子结点走到根节点的过程中作为左儿子的次数，则重量的贡献就是 $\sum\limits_icnt_iw_i$。记 $w(u)$ 表示合并树中 $u$ 结点对应的书在她内部合并完成后磨损值是多少，转移分类讨论：若 $u$ 结点是叶子结点则显然有 $w(u)=0$，否则直接合并得到 $w(u)=2\max(w(l_u),w(r_u))+1$ 其中 $l_u$ 表示 $u$ 结点的左儿子编号，$r_u$ 表示 $u$ 结点的右儿子编号，磨损部分的总贡献就是 $\sum\limits_{i\text{不为根结点}}w(i)$。

考虑一个比较暴力的做法。直接预处理出所有可行的合并树的结构，对每个状态维护信息 $cnt_1,cnt_2,\ldots,cnt_k$ 以及内部的磨损贡献 $cost$ 和当前子树最后形成的磨损值 $W$。然后如果当前把状态 $L$ 放到状态 $R$ 上则需要更新 $W\leftarrow 2\max(W_L,W_R)+1,cost\leftarrow cost_L+cost_R+W_L+W_R$，然后让 $L$ 状态中所有叶子结点的 $cnt_i$ 信息都自增 $1$ 即可。因此容易想到搞一个类似 dp 的东西，设 $f_i$ 表示用 $i$ 本书合并成一摞书时，所有有必要保留的属性状态组成的集合。转移可以直接枚举左子树内结点的数量，形如 $f_i=\bigcup\limits_{j=1}^{i-1}merge(f_j,f_{i-j})$。

考虑进一步优化。容易想到 Pareto 剪枝，定义状态的偏序关系，对于两个状态 $A,B$ 而言，若 $A$ 状态的 $W,cost$ 都不大于 $B$，且 $A,B$ 两个状态的 $cnt$ 数组升序排序后 $A$ 的每个 $cnt$ 都比 $B$ 状态对应的 $cnt$ 的值要小，则认为 $B$ 状态被 $A$ 状态偏序，dp 数组中的 Pareto 状态就只需要保留 $A$ 状态无需保留 $B$ 状态了。写个代码可以发现此时 $n=100$ 时合法的 Pareto 状态数的和只有 $10^3$ 级别，随便写一下就可以通过该题了。

```cpp line-numbers
namespace lowspeed_song {

int a[N], pre[N];

struct State {
    int W, cost, cnt[8];
    inline bool operator<(const State &r) const {
        if (W != r.W) return W < r.W;
        if (cost != r.cost) return cost < r.cost;
        for (int i = 1; i <= 7; ++i)
            if (cnt[i] != r.cnt[i]) return cnt[i] < r.cnt[i];
        return 0;
    }
    inline bool operator<=(const State &r) const {
        if (W < r.W || cost < r.cost) return 1;
        for (int i = 1; i <= 7; ++i)
            if (cnt[i] < r.cnt[i]) return 1;
        return 0;
    }
};
vector<State> f[110];

// merge r into l
inline State operator+(const State &l, const State &r) {
    State res = l;
    res.W = 2 * max(l.W, r.W) + 1, res.cost = l.cost + r.cost + l.W + r.W;
    for (int i = 0; i < 7; ++i) res.cnt[i + 1] += r.cnt[i];
    res.cnt[0] += r.cnt[0]; return res;
}

inline void init() {
    State s{};
    s.W = s.cost = 0, s.cnt[0] = 1;
    f[1].push_back(s);
    for (int n = 2; n <= 100; ++n) {
        for (int i = 1; i <= n - i; ++i) {
            for (auto &x : f[i]) {
                for (auto &y : f[n - i]) {
                    if (y.W <= 500) {
                        State z = x + y;
                        if (f[n].empty() || z <= f[n].back()) f[n].push_back(z);
                    }
                    if (i != n - i && x.W <= 500) {
                        State z = y + x;
                        if (f[n].empty() || z <= f[n].back()) f[n].push_back(z);
                    }
                }
            } sort(f[n].begin(), f[n].end());
            vector<State> g;
            for (auto &s : f[n]) {
                if (s.cost >= 1e12) continue;
                if (g.empty() || s <= g.back()) g.push_back(s);
            } f[n].swap(g);
        }
    }
}

inline void sol([[maybe_unused]]int __testcase_id) {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    sort(a + 1, a + n + 1);
    for (int i = 1; i <= n; ++i) pre[i] = pre[i - 1] + a[i];
    int res = inf;
    for (auto &mask : f[n]) {
        int cost = mask.cost;
        for (int i = 1; i <= 7; ++i) cost += pre[mask.cnt[i]];
        res = min(res, cost);
    } cout << res << '\n';
}

} // namespace lowspeed_song
```

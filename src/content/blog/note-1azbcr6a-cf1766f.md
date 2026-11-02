---
title: "CF1766F MCF 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1766f"
categories: ["题解"]
tags: ["Codeforces", "图论", "网络流", "最短路"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1766F).
:::

:::info[Solution]{open}
题目要求对每条边 $i$ 都满足其流量 $f_i$ 和容量 $c_i$ 的奇偶性相同。容易想到对 $c_i$ 是计数的边先提前流 $1$ 的流量，这样所有边的流量限制就都是偶数，然后一次流 $2$ 的流量即可。因此行啊都给所有容量都整体除以 $2$ 然后每次流 $1$ 的流量变成正常的最小费用可行流问题。

考虑怎么处理提前流 $1$ 的情况。维护数组 $e_i$ 表示 $i$ 点的固定奇数流入流量减去 $i$ 点的固定奇数流出流量的值。则因为中间的点 $i$ 需要满足流量守恒即 $e_i+2(网络流流入-网络流流出)=0$，对奇偶性分析可得若有 $2\nmid e_i$ 则必然无解。

但是 $1,n$ 两个点不需要满足流量守恒，因此她们的差额可以自由调整。如果 $e_1$ 是奇数则令 $e_1$ 减少 $1$，$e_n$ 增加 $1$。此时所有的 $e_i$ 就都是偶数。

为了处理奇数添加的额外流量信息，考虑搞超级源汇点 $S,T$，对一个中部点 $i$ 而言，如果 $e_i>0$ 则需要额外流出 $\frac{e_i}2$ 的流量，因此连一条 $S\to i$ 流量为 $\frac{e_i}2$ 费用为 $-\infin$ 的边；否则需要额外流入 $-\frac{e_i}2$ 的流量，连一条 $i\to T$ 流量为 $-\frac{e_i}2$ 费用为 $-\infin$ 的边即可。

然后因为没有限制图的流量，因此还需要额外从 $S$ 点连向 $1$ 点流量为 $+\infin$ 费用为 $0$ 的边和一条从 $n$ 点连向 $T$ 点流量为 $+\infin$ 费用为 $0$ 的边以自由决定真正的 $1\to n$ 的流量大小。

然后每次增广直接找费用为负的 $S\to T$ 最短路增广，增广完后如果由某条费用为 $-\infin$ 的边没有流满则说明无解。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

namespace MCMF {
    int S, T, hhh[N], e[N], f[N], ne[N], idxx, q[N], pre[N], incf[N], st[N];
    int w[N], d[N];
    inline int ae(int a, int b, int c, int cost) {
        int id = idxx;
        e[idxx] = b, w[idxx] = cost, f[idxx] = c, ne[idxx] = hhh[a], hhh[a] = idxx++;
        e[idxx] = a, w[idxx] = -cost, f[idxx] = 0, ne[idxx] = hhh[b], hhh[b] = idxx++;
        return id;
    }
    inline int spfa() {
        int hh = 0, tt = 1;
        fill(d, d + N, inf);
        memset(incf, 0, sizeof incf);
        q[0] = S, d[S] = 0, incf[S] = inf, st[S] = 1;
        while (hh != tt) {
            int t = q[hh++];
            if (hh == N) hh = 0;
            st[t] = 0;
            for (int i = hhh[t]; ~i; i = ne[i]) {
                int v = e[i];
                if (f[i] && d[v] > d[t] + w[i]) {
                    d[v] = d[t] + w[i];
                    pre[v] = i, incf[v] = min(incf[t], f[i]);
                    if (!st[v]) {
                        q[tt++] = v;
                        if (tt == N) tt = 0;
                        st[v] = 1;
                    }
                }
            }
        }
        return incf[T] > 0;
    }
    inline void ek() {
        while (spfa()) {
            if (d[T] > 0) break;
            int flow = incf[T];
            for (int i = T; i != S; i = e[pre[i] ^ 1]) f[pre[i]] -= flow, f[pre[i] ^ 1] += flow;
        }
    }
    inline void init() { memset(hhh, -1, sizeof hhh), idxx = 0; }
}

int c[N], id[N], e[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, m; cin >> n >> m;
    MCMF::init();
    for (int i = 0; i < m; ++i) {
        int x, y, w;
        cin >> x >> y >> c[i] >> w;
        if (c[i] & 1) ++e[x], --e[y];
        id[i] = MCMF::ae(x, y, c[i] >> 1, 2 * w);
    }
    if (e[1] & 1) ++e[1], --e[n];
    MCMF::S = N - 1, MCMF::T = N - 2;
    vector<int> vec;
    for (int i = 1; i <= n; ++i) {
        if (e[i] & 1) { cout << "Impossible\n"; return; }
        int x = abs(e[i]) / 2;
        if (e[i] < 0) vec.emplace_back(MCMF::ae(MCMF::S, i, x, -1e9));
        else if (e[i] > 0) vec.emplace_back(MCMF::ae(i, MCMF::T, x, -1e9));
    }
    MCMF::ae(MCMF::S, 1, inf, 0), MCMF::ae(n, MCMF::T, inf, 0), MCMF::ek();
    for (int x : vec) if (MCMF::f[x]) { cout << "Impossible\n"; return; }
    cout << "Possible\n";
    for (int i = 0; i < m; ++i) cout << c[i] - 2 * MCMF::f[id[i]] << ' ';
    cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：5

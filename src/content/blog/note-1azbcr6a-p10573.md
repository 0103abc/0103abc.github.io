---
title: "P10573 [JRKSJ R8] C0mp0nents 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p10573"
categories: ["题解"]
tags: ["洛谷", "基础算法", "差分", "前缀和"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P10573).
:::

:::info[Solution]{open}
很显然 $k$ 是没有用的，因此后面分析将只考虑 $k=1$ 的情况。

容易证明固定一个 $s$ 的时候答案一定是连续的一段区间。一个区间 $[l,r]$ 如果想要合法，则必须同时满足下面三个条件：

+ $[l,r]$ 区间必须是连续的（整体连通）。
+ 每个 $x\in (l,s)$ 都有边连向更小的位置。
+ 每个 $x\in(s,r)$ 都有边连向更大的位置。

因此考虑处理出 $L_i$ 表示只考虑向左的条件时最远能扩展到哪里，$R_i$ 表示只考虑向右的条件时最远能扩展到哪里。显然 $L_i$ 和 $R_i$ 都是满足单调性的，因此直接扫描一下就可以线性处理出结果。

此时可以知道对一个起始位置 $s$ 而言，$[L_s,s)$ 和 $(s,R_s]$ 之间都是连通的可以互相转移，问题在于 $\lbrace s\rbrace$ 是否能和上面两个区间连通起来互相转移。直接对 $s$ 枚举每一条边 $<u,v>$ 时间复杂度爆炸了，考虑优化。反过来先枚举每一条边 $<u,v>$ 然后考虑判断是否存在一条边 $<u,v>$ 满足 $L_s\le u<s<v\le R_s$。容易注意到这样的边能帮助的 $s$ 要么为空要么为一段连续的区间，因此直接快速求出合法的区间然后差分 + 前缀和处理 $s$ 这个位置是否存在一条边可以让她们连通即可。

细节实现的好的话可以做到线性时间复杂度。代码没有太多细节。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
int n, m, k, res[N], a[N], diff[N], e[N], L[N], R[N], LL[N], RR[N], pre[N], suf[N];

inline void gao(int st) {
    int idx = 0;
    for (int i = st; i <= n; i += k) a[++idx] = i, e[i] = idx;
    for (int i = 0; i <= idx + 1; ++i) diff[i] = 0;
    for (int i = 1; i <= idx; ++i) {
        L[i] = 0, R[i] = idx + 1;
        for (int &v : adj[a[i]])
            if (e[v] < i) L[i] = max(L[i], e[v]);
            else R[i] = min(R[i], e[v]);
    }
    LL[1] = 1;
    for (int i = 2; i <= idx; ++i) {
        LL[i] = LL[i - 1];
        if (L[i - 1] < LL[i]) LL[i] = i - 1;
    }
    RR[idx] = idx;
    for (int i = idx - 1; i; --i) {
        RR[i] = RR[i + 1];
        if (R[i + 1] > RR[i]) RR[i] = i + 1;
    }
    pre[idx + 1] = idx + 1;
    for (int i = idx; i; --i) {
        pre[i] = pre[i + 1];
        while (pre[i] > 1 && RR[pre[i] - 1] >= i) --pre[i];
    }
    suf[0] = 0;
    for (int i = 1; i <= idx; ++i) {
        suf[i] = suf[i - 1];
        while (suf[i] < idx && LL[suf[i] + 1] <= i) ++suf[i];
    }
    for (int i = 1; i <= idx; ++i)
        for (int &v : adj[a[i]]) if (i < e[v]) {
            int l = max(i + 1, pre[e[v]]), r = min(e[v] - 1, suf[i]);
            if (l <= r) ++diff[l], --diff[r + 1];
        }
    for (int i = 1; i <= idx; ++i) {
        diff[i] += diff[i - 1];
        if (L[i] < LL[i] && R[i] > RR[i])
            LL[i] = RR[i] = i;
        else if (!diff[i]) {
            if (L[i] < LL[i]) LL[i] = i;
            else if (R[i] > RR[i]) RR[i] = i;
        }
        res[a[i]] = RR[i] - LL[i] + 1;
    }
}

inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n >> m >> k;
    while (m--) {
        int a, b; cin >> a >> b;
        if (a % k == b % k) adj[a].emplace_back(b), adj[b].emplace_back(a);
    } for (int i = 1; i <= k; ++i) gao(i);
    for (int i = 1; i <= n; ++i) cout << res[i] << ' '; cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：7

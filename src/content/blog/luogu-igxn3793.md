---
title: "AT_arc226_d [ARC226D] Penta-Queue 题解"
date: "2026-08-31T01:26:00.000Z"
link: "luogu-igxn3793"
categories: ["题解"]
tags: ["AtCoder", "数学", "数论"]
draft: false
---

首先考虑一个更简单的问题：如果有一个长度为 $n$ 的有序序列 $a$ 和一个长度为 $m$ 的有序序列 $b$，如何通过 $n+m$ 次操作简单的归并这两个序列。容易想到循环移位一轮序列 $b$，然后再循环移位的过程中把序列 $a$ 中的元素直接对应插入到序列 $b$ 内即可。

然后考虑解决原问题。设立四个阈值 $B_1<B_2<B_3<B_4$，$B_i$ 表示第 $i$ 个队列归并到第 $i+1$ 个队列的阈值。具体来说，如果第 $i$ 个序列内的元素数超过 $B_i$ 时，就把这个序列归并到第 $i+1$ 个序列中。然后因为第一个序列内每次 push 操作都会加入一个未知值的元素，因此该序列想要保持有序必须时刻保证其内拥有不超过 $1$ 个元素，即必有 $B_1=1$。然后另外三个 $B_i$ 的值可以猜一下，这里可以证明取 $B_i=9^{i-1}$ 即 $B_2=9,B_3=81,B_4=729$ 时可以满足移动次数的限制要求。

对队列 $i$ 而言，其每一次会从队列 $i-1$ 中弄到一个大小为 $S$ 的有序块，而队列 $i$ 最多攒 $9$ 个块 $0,S,2S,\ldots,8S$。这 $9$ 次移动过程一共会造成 $45S$ 次移动，加入了 $9S$ 个元素，因此平均一个元素会在一层造成 $5$ 次移动操作。而一共有四个这样的层，因此平均每个元素在整个流程中造成 $20$ 次移动操作。而宗元素数量为 $5000$，因此所有元素不会移动超过 $5000\times 20=10^5$ 次，满足题目的限制条件。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

deque<int> Q[10];

inline void merge(int x, int y, vector<pair<int, int>> &res) {
    int n = Q[y].size();
    for (int i = 1; i <= n; ++i) {
        while (Q[x].size() && Q[x].front() < Q[y].front()) {
            res.emplace_back(x, y);
            Q[y].emplace_back(Q[x].front()), Q[x].pop_front();
        } res.emplace_back(y, y), Q[y].emplace_back(Q[y].front()), Q[y].pop_front();
    } while (Q[x].size()) res.emplace_back(x, y), Q[y].emplace_back(Q[x].front()), Q[x].pop_front();
}

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int q; cin >> q;
    constexpr int B[] = {1, 9, 81, 729};
    for (int i = 1; i <= q + q; ++i) {
        int o; cin >> o;
        if (o == 1) {
            int x; cin >> x;
            Q[1].emplace_back(x);
            vector<pair<int, int>> res;
            for (int i : {1, 2, 3, 4})
                if (Q[i].size() >= B[i - 1]) merge(i, i + 1, res);
            cout << res.size() << endl;
            for (auto &[i, j] : res) cout << i << ' ' << j << endl;
        } else {
            int id = 0;
            for (int i : {1, 2, 3, 4, 5})
                if (Q[i].size() && (Q[id].empty() || Q[i].front() < Q[id].front())) id = i;
            cout << id << endl, Q[id].pop_front();
        }
    }
}

} // namespace lowspeed_song
```
:::

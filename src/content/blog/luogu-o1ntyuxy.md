---
title: "P5101 [JOI 2017 Final] 绳 / Rope 题解"
date: "2026-07-26T13:55:05.000Z"
link: "luogu-o1ntyuxy"
categories: ["题解"]
tags: ["洛谷", "基础算法", "模拟"]
draft: false
---

真的是人类能想出来的题吗？？？？

套路的先挖掘题目的性质。容易发现先染色再折叠一定不会更差。证明可以考虑厚度为 $k$ 的绳子染色需要花费 $k$ 等价于再折叠前把组成她的 $k$ 根单位绳分别染色或者调整法。

然后考虑在大脑中想象绳子折叠的过程。此时可以发现一个只含有两个颜色的序列能够折成长度为 $2$ 的粗绳子，当且仅当染色后 $(1,2),(3,4),(5,6),\ldots$ 每一对绳子颜色都相同，或 $(2,3),(4,5),(6,7),\ldots$ 每一对绳子颜色都相同。考虑固定最后答案中必须有颜色 $x$，则枚举另一个最终颜色为 $y\neq x$，记 $cnt_x$ 表示原序列中颜色 $x$ 出现的次数，$f_{x,y}$ 表示当前选择的两两配对方式中，有多少对二元组的颜色恰好分别是 $x$ 和 $y$。首先需要把所有不是 $x,y$ 的位置染成 $x,y$ 两个颜色，费用是 $n-cnt_x-cnt_y$。但是每个 $(x,y)$ 异色对都必须修改其中一个位置的颜色使得这一对的颜色相同。因此额外还需要 $f_{x,y}$ 的费用。因此对于颜色 $x$ 的答案就可以被表示为 $n-cnt_x-\max\limits_{y\neq x}(cnt_y-f_{x,y})$。

直接做时间复杂度是 $O(n^2)$ 的，考虑进一步优化。注意到只有 $O(n)$ 个二元组 $(x,y)$ 满足 $f_{x,y}\neq 0$。时间复杂度瓶颈部分的式子是 $\max\limits_{y\neq x}(cnt_y-f_{x,y})$，把所有 $y$ 分类两类：

+ 如果 $f_{x,y}=0$，则此时上面的部分就可以被写作是 $\max\limits_{y\neq x}cnt_y$，直接找一个不等于 $x$ 且和 $x$ 不相邻的颜色中出现次数最大的即可。
+ 如果 $f_{x,y}\neq 0$，则所有满足条件的 $y$ 均摊是 $O(n)$ 级别的，直接对每个 $x$ 处理出所有 $y$ 满足 $f_{x,y}\neq 0$ 然后暴力枚举即可。

第一类情况可以用一个以 $cnt_y$ 为第一关键字的 multiset 来维护，对每个 $x$ 把 $x$ 本身和所有和 $x$ 相邻的颜色 $y'$ 从 multiset 中删除，然后查询最大值，再撤销前面的删除操作即可。同样分析可得对 multiset 的操作均摊是 $O(n)$ 次的，因此直接按照上述流程模拟算法实现可以做到 $O(n\log n)$ 时间复杂度，可以解决问题。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

vector<int> adj[N];
int a[N], res[N], buc[N], buc2[N];

inline void sol() {
    int n, m; cin >> n >> m;
    for (int i = 1; i <= n; ++i) cin >> a[i], ++buc[a[i]];
    for (int i = 1; i <= m; ++i) res[i] = n;
    function<void(int)> solve = [&](int st) {
        for (int i = 1; i <= n; ++i) adj[i].clear();
        for (int i = st; i < n; i += 2) if (a[i] != a[i + 1])
            adj[a[i]].emplace_back(a[i + 1]), adj[a[i + 1]].emplace_back(a[i]);
        memset(buc2, 0, sizeof buc2);
        int mx = 0;
        function<void(int)> add = [&](int id) {
            --buc2[buc[id]], ++buc2[++buc[id]], mx = max(mx, buc[id]);
        };
        function<void(int)> del = [&](int id) {
            --buc2[buc[id]], ++buc2[--buc[id]];
            while (mx && !buc2[mx]) --mx;
        };
        for (int i = 1; i <= m; ++i) ++buc2[buc[i]], mx = max(mx, buc[i]);
        for (int x = 1; x <= m; ++x) {
            --buc2[buc[x]];
            while (mx && !buc2[mx]) --mx;
            for (int &y : adj[x]) del(y);
            res[x] = min(res[x], n - buc[x] - mx);
            for (int &y : adj[x]) add(y);
            ++buc2[buc[x]], mx = max(mx, buc[x]);
        }
    };
    solve(1), solve(2);
    for (int i = 1; i <= m; ++i) cout << res[i] << '\n';
}

} // namespace lowspeed_song
```
:::

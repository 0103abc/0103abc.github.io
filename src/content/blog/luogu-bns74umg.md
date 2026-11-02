---
title: "CF2248F Matrix Elimination 题解"
date: "2026-09-06T02:19:42.000Z"
link: "luogu-bns74umg"
categories: ["题解"]
tags: ["Codeforces", "数学", "线性代数", "基础算法", "排序"]
draft: false
---

先考虑 $n,m\ge 2$ 的情况。此时记第 $i$ 行内所有元素的和为 $R_i$，第 $j$ 列内所有元素的和为 $C_j$。则一个位置 $(i,j)$ 是合法的当且仅当 $a_{i,j}\ge (R_i-a_{i,j})+(C_j-a_{i,j})$ 即 $R_i+C_j-3a_{i,j}\le 0$。然后考虑当前操作选了个 $x\times y$ 的子矩形，则对该子矩形内的每个点 $(i,j)$，$R_i$ 都会减少 $y$，$C_j$ 都会减少 $x$，$a_{i,j}$ 都会减少 $1$，因此 $R_i+C_j-3a_{i,j}$ 的值必然减少 $x+y-3$。为了更快的减少 $R_i+C_j-3a_{i,j}$ 的值，很显然希望每次减少的量尽量多，因此每次直接减去整个矩阵必然是最优情况。此时每个格子变成峰值所需要的次数就是 $\max(0,\lceil\frac{R_i+C_j-3a_{i,j}}{n+m-3}\rceil)$，排序取第 $k$ 小即可。

然后考虑 $\min(n,m)=1$ 的情况，为了方便这里只讨论 $n=1$，问题变为一个长度为 $m$ 的数组 $a$，记 $a$ 数组所有元素的和为 $S$，则峰值条件就是 $a_i\ge S-a_i$ 即 $S-2a_i\le 0$。对一个长度为 $k$ 的连续区间做操作，则一个位置 $i$ 如果在操作区间中则 $S-2a_i$ 会减少 $m-2$，否则 $S-2a_i$ 会减少 $m$。容易证明此时操作长度不超过 $n-2$ 的区间一定不如直接对整个数组整体操作，因此有效的操作区间只有 $[1,m],[1,m-1],[2,m]$ 三个。此时还可以发现不能同时执行区间 $[1,m-1]$ 和 $[2,m]$，否则把这两次操作都换成对 $[1,m]$ 执行一定不会让结果更差。因此直接分类讨论可能执行的另一个区间是 $[1,m-1]$ 还是 $[2,m]$ 然后解不等式组即可，解不等式组部分是 boring 的 dirty work，这里就不再展开赘述了，细节可以看代码实现。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

mt19937 mt(time(0));

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n, m, k;
    cin >> n >> m >> k;
    vector<vector<int>> a(n, vector<int>(m, 0));
    for (int i : views::iota(0, n))
        for (int j : views::iota(0, m))
            cin >> a[i][j];
    function<int(int, int)> calc = [&](int a, int b) {
        a = max<int>(a, 0);
        return (a + b - 1) / b;
    };
    if (n > 1 && m > 1) {
        vector<int> R(n, 0), C(m, 0);
        for (int i : views::iota(0, n))
            for (int j : views::iota(0, m))
                R[i] += a[i][j], C[j] += a[i][j];
        vector<int> cand;
        for (int i : views::iota(0, n))
            for (int j : views::iota(0, m))
                cand.emplace_back(max<int>(0, calc(R[i] + C[j] - 3 * a[i][j], n + m - 3)));
        sort(cand.begin(), cand.end());
        cout << cand[k - 1] << '\n';
    } else {
        vector<int> a_1d;
        for (int i : views::iota(0, n))
            for (int j : views::iota(0, m))
                a_1d.emplace_back(a[i][j]);
        function<int(vector<int>, int)> solve = [&](vector<int> a_1d, int k) -> int {
            int n = a_1d.size();
            if (n == 1)
                return a_1d[0] >= 0 ? 0 : -1;
            if (n == 2)
                return (k == 1) ? 0 : abs(a_1d[0] - a_1d[1]);
            int sum = accumulate(a_1d.begin(), a_1d.end(), 0ll);
            vector<int> b = a_1d;
            sort(b.begin(), b.end(), greater<>());
            int res = calc(sum - 2 * b[k - 1], n - 2);
            function<int(int)> calc_inner = [&](int p) -> int {
                if (k == 1)
                    return calc(sum - 2 * p, n - 1);
                int pos = lower_bound(b.begin(), b.end(), p, greater<>()) - b.begin();
                int q = (pos < k - 1) ? b[k - 1] : b[k - 2];
                return max({
                    calc(sum - 2 * p, n - 1), 
                    calc(sum - 2 * q, n - 2), 
                    calc(sum - p - q, n - 2)
                });
            };
            res = min({
                res, 
                calc_inner(a_1d[0]), 
                calc_inner(a_1d.back())
            });
            return res;
        };
        cout << solve(a_1d, k) << '\n';
    }
}

} // namespace lowspeed_song
```

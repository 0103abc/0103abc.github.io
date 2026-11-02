---
title: "CF1525F Goblins And Gnomes 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1525f"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分", "图论", "二分图匹配", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1525F).
:::

:::info[Solution]{open}
套路的考虑把每个点拆成左部点和右部点，对原图的边 $u\to v$ 连一条二分图边，即从左部点 $u$ 连边向右部点 $v$。设二分图最大匹配大小为 $M$ 则 DAG 的最小路径覆盖就是 $n-M$。也就是说至少需要 $n-M$ 个哥布林才能用若干条互不相交的路径把所有点全部走完。因此第 $i$ 轮有 $i$ 个哥布林时如果想要活下来就必须满足 $i<n-M$ 即 $i+M<n$。

然后考虑封锁一个点对答案的影响。如果操作 $+u$ 封锁 $u$ 点的所有出边，相当于把二分图的左部点 $u$ 从图中删除；如果操作 $-u$ 封锁 $u$ 点的所有入边相当于把二分图的右部点 $u$ 从图中删除。很显然删除一个二分图结点后，最大匹配数要么不变要么减少 $1$。

由 Konig 定理可知二分图最大匹配大小等于最小电覆盖大小，因此如果删除最小点覆盖终点任意一个点，那么剩下的点覆盖大小最多为 $M-1$ 即新的最大匹配最多为 $M-1$。因此如果最大匹配满足 $M>0$ 则一定可以找到一个点使得删除她后最大匹配变为 $M-1$。考虑求出这样的一个删点序列，因为 $n$ 很小所以考虑直接暴力的尝试删除每个左部点 / 右部点然后重新跑最大匹配即可。记这个处理出的操作序列为 $op_0,op_1,op_2,\ldots,op_M$。

然后考虑 dp。设 $f_{i,j}$ 表示已经处理完了前 $i$ 轮，且已经执行了操作序列中的前 $j$ 个封边操作时能够得到的最大分数是多少。由前面的分析可知此时最大匹配大小一定为 $M-j$。假设前 $i-1$ 轮操作结束时已经执行了 $j$ 个操作，则可以考虑在第 $i$ 轮在执行 $t$ 次操作，准备时间就是 $t$ 个单位时间，可以得到 $\max(0,x_i-ty_i)$ 的收益。执行完操作后当前最大匹配的大小为 $M-j-t$ 因此当前最小路径覆盖为 $n-(M-j-t)$。为了成功防御第 $i$ 波攻击需要满足 $n-(M-j-t)>i$ 即 $i+M-j-t<n$，如果满足条件则转移形如 $f_{i,j+t}\leftarrow f_{i-1,j}+\max(0,x_i-ty_i)$，然后记录一下转移路径即可。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int f[55][55], pre[55][55], zx[55], x[55], y[55], banL[55], banR[55], mat[55], used[55], mp[55][55], n, m, k;

inline int dfs(int u) {
    for (int i = 1; i <= n; ++i) {
        if (!mp[u][i] || banR[i] || used[i]) continue;
        used[i] = 1;
        if (!mat[i] || dfs(mat[i])) return mat[i] = u, 1;
    } return 0;
}

inline int calc() {
    memset(mat, 0, sizeof mat);
    int res = 0;
    for (int i = 1; i <= n; ++i)
        if (!banL[i]) memset(used, 0, sizeof used), res += dfs(i);
    return res;
}

vector<int> adj[N];


inline void sol([[maybe_unused]]int __testcase_id) {
    cin >> n >> m >> k;
    while (m--) {
        int a, b; cin >> a >> b;
        adj[a].emplace_back(b), mp[a][b] = 1;
    } for (int i = 1; i <= k; ++i) cin >> x[i] >> y[i];
    vector<int> op;
    int M = calc();
    for (int i = M; i; --i) {
        for (int j = 1; j <= n; ++j) {
            if (!banL[j]) {
                banL[j] = 1;
                if (calc() < i) { op.emplace_back(j); break; }
                banL[j] = 0;
            } if (!banR[j]) {
                banR[j] = 1;
                if (calc() < i) { op.emplace_back(-j); break; }
                banR[j] = 0;
            }
        }
    }
    // cerr << "!!!\n";
    memset(f, -0x3f, sizeof f);
    memset(pre, -1, sizeof pre);
    f[0][0] = 0;
    for (int i = 1; i <= k; ++i)
        for (int j = 0; j <= M; ++j) {
            for (int jj = j; jj <= M; ++jj) {
                if (i + M - jj >= n) continue;
                int w = max<int>(0, x[i] - (jj - j) * y[i]);
                if (f[i][jj] < f[i - 1][j] + w) f[i][jj] = f[i - 1][j] + w, pre[i][jj] = j;
            }
        }
    // cerr << "???\n";
    zx[k] = max_element(f[k], f[k] + M + 1) - f[k];
    for (int i = k; i; --i) zx[i - 1] = pre[i][zx[i]];
    vector<int> res;
    for (int i = 1; i <= k; ++i) {
        for (int j = zx[i - 1]; j < zx[i]; ++j) res.emplace_back(op[j]);
        res.emplace_back(0);
    } cout << res.size() << '\n';
    for (int &i : res) cout << i << ' ';
    cout << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫+

鲜活指数：7

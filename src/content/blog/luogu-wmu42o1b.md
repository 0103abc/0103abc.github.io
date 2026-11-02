---
title: "CF2262E Paired Bracket Sequences 题解"
date: "2026-09-21T12:22:54.000Z"
link: "luogu-wmu42o1b"
categories: ["题解"]
tags: ["Codeforces", "数学", "组合数学", "动态规划", "搜索", "深度优先搜索"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/wmu42o1b)。

怎么全世界都觉得这个是黑题，来写一个简单做法的题解。

为了方便，后面记 $C_i=\frac{\binom{2i}i}{i+1}$ 为 Catalan 数列。

直接做比较困难，因此考虑容斥。钦定有 $k$ 对公共配对，剩下部分被分成了 $k+1$ 个连续段。若某一段有 $x$ 对括号则两个序列在这一块可以分别任取合法序列，贡献就是 $C_x^2$。

因此考虑 dp。设 $f_{i,j}$ 表示当前考虑了前 $i+1$ 个连续段，放了 $j$ 对普通括号的方案权值的和是多少。初始条件显然就是 $f_{0,j}=C_j^2$，转移枚举下一段的长度 $f_{i,j+k}\leftarrow f_{i-1,j}C_k^2$。此时 $f_{i,n-i}$ 的含义就是标记了 $i$ 个配对后剩下 $n-i$ 对括号的配对方案数。由结论可知标记 $k$ 个公共配对的总方案数为 $\frac{\binom{2n}k}{k+1}f_{k,n-k}$，二项式反演回去就可以算出答案。时间复杂度 $O(n^3)$，好像能用一些科技继续优化时间复杂度但是没啥必要。

::::info[$\frac{\binom{2n}k}{k+1}$ 是什么？]{open}
这个结论可以理解为是 $k$ 个配对把整个结构连接成一个 $k+1$ 个块组成的树。设 $k+1$ 个块的大小分别为 $v_1,v_2,\ldots,v_{k+1}$，则必有 $\sum v_j=n-k$，这些块内部的方案数加起来就是 $F_{v_1}F_{v_2}\ldots F_{v_{k+1}}$，为了方便这里记 $F_i=C_i^2$。把所有可能的 $v_1,v_2,\ldots,v_{k+1}$ 对答案的贡献求和得到 $\sum\limits_{v_1+v_2+\ldots+v_{k+1}=n-k}F_{v_1}F_{v_2}\ldots F_{v_{k+1}}$。

然后考虑怎么把 $k+1$ 个块用 $k$ 个配对连起来。第 $i$ 个块有 $2v_i+1$ 个地方可以用来连接其他块，若其挂了 $c_i$ 个子块则方案数就是 $\binom{2v_i+c_i}c_i$，整个结构有 $k$ 个连接因此必有 $c_1+c_2+\ldots+c_{k+1}=k$，求和得到总连接方法数为 $\sum\limits_{c_1+c_2+\ldots+c_{k+1}=k}\prod\limits_{i=1}^{k+1}\binom{2v_i+c_i}{c_i}$，换元一下然后直接上 ex-Vandermonde 可得上式的值为 $\binom{2n-k+1+k-1}k=\binom{2n}k$。

然后考虑每个点的儿子数量分别为 $c_1,c_2,\ldots,c_{k+1}$，考虑到 $c_1+c_2+\ldots+c_{k+1}=k$ 因此套路的把每个 $c_i$ 的值都减 $1$，此时 $\sum c_i=-1$。一个树按照 DFS 顺序访问这些结点的时候需要满足最后一个点钱已经出现的儿子总数始终不少于已经用掉的点数。考虑下面给出的引理：

:::info[循环引理]{open}
对一个总和为 $-1$ 的序列，其所有循环移位中恰有一个移位满足上面给出的树的条件。

[Reference](https://www.luogu.com.cn/article/cxqp7uhm).
:::

所以同一种儿子数加上连接方法从 $k+1$ 个不同的位置开始看必然恰好只有一个是真正合法的有根树。因此 $\binom {2n}k$ 种方法中合法方案占比只有 $\frac1{k+1}$，最终结果就是 $\frac{\binom{2n}k}{k+1}$。
::::

```cpp line-numbers
namespace lowspeed_song {

mt19937_64 mt(time(0));

int fac[N], inv[N], ifac[N];

inline void init() {
}

int a[N], b[N], res[N], f[510][510];

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n, mod; cin >> n >> mod;
    fac[0] = inv[0] = ifac[0] = 1;
    fac[1] = inv[1] = ifac[1] = 1;
    for (int i = 2; i < N; ++i) {
        fac[i] = fac[i - 1] * i % mod;
        inv[i] = mod - inv[mod % i] * (mod / i) % mod;
        ifac[i] = ifac[i - 1] * inv[i] % mod;
    } memset(f, 0, sizeof f);
    function<int(int, int)> binom = [&](int a, int b) { return fac[a] * ifac[b] % mod * ifac[a - b] % mod; };
    function<int(int, int)> calc = [&](int n, int k) { return binom(n, k) * inv[k + 1] % mod; };
    for (int i = 0; i <= n; ++i) f[0][i] = calc(i + i, i) * calc(i + i, i) % mod;
    for (int i = 1; i <= n; ++i) for (int j = 0; j <= n; ++j) for (int k = 0; k <= n - j; ++k)
        f[i][j + k] = (f[i][j + k] + f[i - 1][j] * f[0][k] % mod) % mod;
    for (int i = 0; i <= n; ++i) res[i] = calc(n + n, i) * f[i][n - i] % mod;
    for (int i = n - 1; ~i; --i) for (int j = i + 1; j <= n; ++j) res[i] = (res[i] + mod - res[j] * binom(j, i) % mod) % mod;
    for (int i = 0; i <= n; ++i) cout << res[i] << ' '; cout << '\n';
}

} // namespace lowspeed_song
```

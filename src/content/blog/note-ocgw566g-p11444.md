---
title: "P11444 [Code+#6] 祖玛 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p11444"
categories: ["题解"]
tags: ["洛谷", "动态规划", "基础算法", "模拟"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P11444).
:::

:::info[Solution]{open}
考虑区间 dp。设 $f_{i,j,k}$ 表示处理区间 $[i,j]$ 后，只保留 $k$ 个值恰好为 $a_l$ 的数，其余的数全都删除，能够获得的最大分数是多少。

考虑转移。如果转移中只保留 $a_l$ 的话显然可以写成是 $f_{l,r,1}=f_{l+1,r,0}$，也就是把区间 $[l+1,r]$ 都删空。然后枚举另外一个和 $a_l$ 值相同的位置 $p$，删空其中间的区间后就可以把两个部分的区间拼接起来，即：$f_{l,r,k}=\max\limits_{l<p<r\land a_p=a_i}(f_{l+1,p-1,0}+f_{p,r,k-1})$。如果最后剩下的数的数量 $k$ 满足 $k\in[X_{\min},X_{\max}]$ 就可以把剩下的 $k$ 个数字一次性删除，也就是 $f_{l,r,0}=\max\limits_{k=X_{\min}}^{X_{\max}}(f_{l,r,k}+k^2)$。

最后考虑设 $g_i$ 保留前 $i$ 个位置能够获得的最大分数是多少。位置 $i$ 可以不删除，转移就是 $g_i=g_{i-1}$；否则考虑把某个以 $i$ 结尾的区间 $[j,i]$ 全部删除，转移就是 $g_i=\max\limits_{1\le j<i}(g_{j-1}+f_{j,i,0})$，最终答案就是 $g_n$。

直接模拟上述过程转移时间复杂度为 $O(n^4)$ 可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int f[110][110][110], a[N], g[N];

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    int xmin, xmax; cin >> xmin >> xmax;
    memset(f, -0x3f, sizeof f);
    function<int(int, int)> calc = [&](int l, int r) {
        if (l > r) return 0ll;
        return f[l][r][0];
    };
    for (int len = 1; len <= n; ++len)
        for (int i = 1, j = len; j <= n; ++i, ++j) {
            f[i][j][1] = calc(i + 1, j);
            for (int k = i + 1; k <= j; ++k)
                if (a[k] == a[i])
                    for (int p = 2; p <= j - i + 1; ++p)
                        f[i][j][p] = max(f[i][j][p], calc(i + 1, k - 1) + f[k][j][p - 1]);
            for (int k = xmin; k <= xmax; ++k)
                f[i][j][0] = max(f[i][j][0], f[i][j][k] + k * k);
        }
    g[0] = 0;
    for (int i = 1; i <= n; ++i) {
        g[i] = g[i - 1];
        for (int j = 1; j <= i; ++j) g[i] = max(g[i], g[j - 1] + f[j][i][0]);
    } cout << g[n] << '\n';
}

} // namespace lowspeed_song
```
:::

难度：蓝

鲜活指数：7

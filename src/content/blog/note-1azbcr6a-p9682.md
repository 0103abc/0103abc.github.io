---
title: "P9682 Electro Master 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p9682"
categories: ["题解"]
tags: ["洛谷", "动态规划", "数学", "组合数学"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P9682).
:::

:::info[Solution]{open}
先考虑如果序列中不存在 `?`，怎么计数序列的权值。先观察一下题目中给的操作的性质：

+ 任意时刻序列中向左 / 向右移动的粒子数量不变。
+ 所有粒子的相对位置在任何时刻都是不变的。
+ 最终向左移动的第 $i$ 个粒子和 $i-1$ 个粒子的碰撞次数为前 $i-1$ 个粒子中负电荷粒子的数量。

考虑判断第 $i$ 个粒子是否会在最后变成 `B`。容易发现这个条件等价于其经历的有效碰撞次数为奇数。设前 $i-1$ 个粒子中有 $k$ 个粒子是负电荷，则第 $i$ 个粒子的有效碰撞次数的次数就是 $k[s_i\neq s_{i-1}]+[s_i\neq s_{i+1}](k+[s_i=\red{-}])$，奇偶性也是容易算的。因此这个问题可以线性解决。

然后考虑加入 `?` 的情况。为了方便处理，这里认为 $s_0$ 粒子是正电荷粒子，$s_{n+1}$ 粒子是负电荷粒子。容易想到 dp，设 $f_{i,j,a,b,c}$ 表示当前处理了前 $i$ 个粒子，前 $\red{i-1}$ 个粒子中共有 $j$ 个正电荷粒子，$s_{i-1}=a,s_i=b,s_{i+1}=c$ 有多少种不同的合法串的填写方法。转移是十分容易的，显然有 $f_{i+1,j+b,b,c,d}\leftarrow f_{i+1,j+b,b,c,d}+f_{i,j,a,b,c}$。

记 $suf_i$ 表示位置 $i\sim n$ 中已经确定是正电荷的粒子数量。则当前已经确定的正电荷的数量是 $j+b+c+suf_{i+2}$，而第 $i$ 个粒子想要从左边出去至少需要有 $i+1$ 个正电荷粒子，因此后面的 `?` 至少还需要有 $need=i+1-j-b-c-suf_{i+2}$ 个粒子填成正电荷。如果后面有 $cnt$ 个未知电荷的粒子，那么可以直接组合数算出总合法的填写方案数就是 $\sum\limits_{j=need}^{cnt}\binom{cnt}j$。把所有合法方案数加起来就可以得到答案。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

char s[N];
int C[2010][2010], suf[N], suf2[N], f[2010][2][2][2], sc[2010][2010], g[2010][2][2][2];
inline int calc(int x, int y) {
    if (y <= 0) return sc[x][0];
    if (y > x) return 0;
    return sc[x][y];
}
inline void add(int &x, int v) { x = (x + v) % mod; }
inline int chk(char c, int x) { return c == '?' || c == '+' && x || c == '-' && !x; }

inline void sol([[maybe_unused]]int __testcase_id) {
    scanf("%s", s + 1);
    int n = strlen(s + 1);
    s[0] = '+', s[n + 1] = '-';
    C[0][0] = 1;
    for (int i = 1; i < 2010; ++i) {
        C[i][0] = 1;
        for (int j = 1; j <= i; ++j) C[i][j] = (C[i - 1][j - 1] + C[i - 1][j]) % mod;
    } for (int i = 0; i < 2010; ++i)
        for (int j = i; ~j; --j) sc[i][j] = (sc[i][j + 1] + C[i][j]) % mod;
    for (int i = n; i; --i) suf[i] = suf[i + 1] + (int)(s[i] == '?'), suf2[i] = suf2[i + 1] + (int)(s[i] == '+');
    for (int y : {0, 1}) for (int z : {0, 1}) if (chk(s[1], y) && chk(s[2], z)) f[1][1][y][z] = 1;
    int res = 0;
    for (int i = 1; i <= n; i++) {
        // 统计第 i 个粒子的贡献
        for (int j = 1; j <= i; ++j)
            for (int x : {0, 1}) for (int y : {0, 1}) for (int z : {0, 1})
                if (((int)(i - j) * (x != y) + (int)(i - j + !y) * (y != z)) & 1) add(res, f[j][x][y][z] * calc(suf[i + 2], i + 1 - j - y - z - suf2[i + 2]));
        if (i == n) break;
        memset(g, 0, sizeof g);
        for (int j = 1; j <= i; ++j) for (int x : {0, 1}) for (int y : {0, 1}) for (int z : {0, 1}) for (int w : {0, 1})
            if (chk(s[i + 2], w)) add(g[j + y][y][z][w], f[j][x][y][z]);
        memcpy(f, g, sizeof f);
    }
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

难度：紫

鲜活指数：7

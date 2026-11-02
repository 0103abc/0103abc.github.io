---
title: "【学习笔记】随机游走优化 dp"
date: "2026-04-15T02:47:07.000Z"
link: "luogu-7zl18kne"
categories: ["学习笔记"]
tags: ["动态规划", "数学", "概率与期望"]
draft: false
---

upd：ChatGPT 给出的证明部分数学公式出现了一点问题，已经修复。

### 引入

> 一个数轴，初始有一个点在 $0$ 位置。现在这个点会移动 $n$ 次，每一次有 $\frac12$ 的概率点从 $x$ 移动到 $x+1$，另外 $\frac12$ 的概率点从 $x$ 移动到 $x-1$。问移动完 $n$ 次之后 $|x|$ 的期望值是多少。

上述问题的答案不超过 $O(\sqrt n)$ 级别。下面给出一个简单的证明：

直接计算 $E[|x|]$ 比较复杂。考虑先放缩一下，计算出 $E[x^2]$ 的值，然后就可以直接得到 $E[|x|]\le \sqrt{E[x^2]}$。

记第 $i$ 步 $x$ 移动的决策是 $p_i$（也就是 $x$ 在第 $i$ 次操作中移动到了 $x+p_i$ 位置）。则显然有 $x^2=(p_1+p_2+\ldots+p_n)^2$，也就可以得到 $E[x^2]=\sum\limits_{i=1}^nE[p_i^2]+2\sum\limits_{i=1}^n\sum\limits_{j=i+1}^nE[p_ip_j]=n+2\sum\limits_{i=1}^n\sum\limits_{j=i+1}^nE[p_ip_j]$。又因为决策之间是两两独立的，所以直接分类 $p_i,p_j$ 的取值分别算期望，可以得到 $E[p_ip_j]=0$，也就得到了 $E[x^2]=n\Rightarrow E[x]\le O(\sqrt n)$。

现在在上面的问题上扩展，考虑另外一个与其相似的问题：

> 一个数轴，初始有一个点在 $0$ 位置。现在这个点会移动 $n$ 次，每一次有 $\frac12$ 的概率点从 $x$ 移动到 $x+1$，另外 $\frac12$ 的概率点从 $x$ 移动到 $x-1$。问移动完 $n$ 次后，$x$ 移动到的全部 $n+1$ 个位置中绝对值最大的点的期望值是多少。

解决完上一个问题之后容易猜测答案还是 $O(\sqrt n)$ 级别的。下面给出一个证明：

设随机游走位置为 $S_0=0,S_k=\xi_1+\xi_2+\cdots+\xi_k$，其中每个 $\xi_i$ 有 $\frac12$ 的概率为 $1$，另外 $\frac12$ 的概率为 $-1$。为了方便，记 $M_i=\max\limits_{j=0}^i|S_j|$ 即前 $i$ 次移动中距离原点最远的距离是多少。

因为 $M_n$ 是非负整数，所以 $\mathbb E[M_n]=\sum_{t\ge1}\Pr(M_n\ge t)$。

所以只要我们能证明 $\Pr(M_n\ge t)\le C e^{-c t^2/n}$，把这个式子对 $t$ 求和，就会得到 $\mathbb E[M_n]=O(\sqrt n)$。

事件 $M_n\ge t$ 的意思是：在前 $n$ 步里，曾经到过 $t$ 或者 $-t$。所以 $
\Pr(M_n\ge t)
\le
\Pr\Bigl(\max_{0\le k\le n}S_k\ge t\Bigr)
+
\Pr\Bigl(\min_{0\le k\le n}S_k\le -t\Bigr)$。

由于对称性，这两项相等，因此有：$\Pr(M_n\ge t)\le 2\Pr\Bigl(\max_{0\le k\le n}S_k\ge t\Bigr)$。

现在用一维随机游走最经典的“反射法”结论：$\Pr\Bigl(\max_{0\le k\le n}S_k\ge t\Bigr)\le 2\Pr(S_n\ge t)$，结合一下就可以得到 $\Pr(M_n\ge t)\le 4\Pr(S_n\ge t)$。

此时又因为 $S_n=\xi_1+\cdots+\xi_n$ 是 $n$ 个独立 $\pm1$ 的和，所以它的方差是 $n$，标准差是 $\sqrt n$。更进一步，$S_n$ 有高斯型尾估计：$\Pr(S_n\ge t)\le e^{-t^2/(2n)}$，因此 $\Pr(M_n\ge t)\le 4e^{-t^2/(2n)}$。

结合一开始得到的式子，有：

$$
\mathbb E[M_n]=
\sum_{t\ge1}\Pr(M_n\ge t)\le\sum_{t\ge1}4e^{-t^2/(2n)}$$

而这个和的量级就是 $\sqrt n$。最简单的看法是把它和积分比较：

$$
\sum_{t\ge1}e^{-t^2/(2n)}
\le
\int_0^\infty e^{-x^2/(2n)}{dx}=
\sqrt n\int_0^\infty e^{-u^2/2}du=
C\sqrt n
$$

所以有 $\mathbb E[M_n]\le 4C\sqrt n$。于是得到最终结论：

$$
\boxed{\mathbb E[M_n]=O(\sqrt n)}
$$

事实上，可以继续收紧上下界得到 $\mathbb E[M_n]\sim\sqrt{\frac{\pi n}2}$，但是我不会证，而且在实际题目中并不需要这么紧的上界，因此这里直接给出一个由 ChatGPT 5.4 Thinking 给出的证明过程：

:::info[证明过程]
设随机游走的过程为：

$$
S_0=0,\qquad S_k=\sum_{i=1}^k \xi_i,\qquad \Pr(\xi_i=1)=\Pr(\xi_i=-1)=\frac12,
$$

题目要求的是 $M_n:=\max_{0\le k\le n}|S_k|$ 的期望 $\mathbb E[M_n]$。

## 1. 先写成尾和公式

因为 $M_n$ 是非负整数值随机变量，所以：

$$
\mathbb E[M_n]=\sum_{m\ge1}\Pr(M_n\ge m).
$$

而 $n$ 步最多走到距离 $n$，所以实际上：

$$
\boxed{\mathbb E[M_n]=\sum_{m=1}^n \Pr(M_n\ge m)}
$$

也就是：

$$
\boxed{\mathbb E[M_n]=\sum_{m=1}^n \Bigl(1-\Pr(M_n<m)\Bigr)}
$$

---

## 2. 精确公式

事件 $M_n<m$ 就是“前 $n$ 步始终没有碰到 $\pm m$”，也就是随机游走在区间 ${-m+1,-m+2,\dots,m-1}$
内存活到第 $n$ 步。

这是经典吸收随机游走，谱分解可得：

$$
\Pr(M_n<m)
=

\frac1m\sum_{j=0}^{m-1}
(-1)^j
\cot\frac{(2j+1)\pi}{4m},
\Bigl(\cos\frac{(2j+1)\pi}{2m}\Bigr)^n.
$$

因此：

$$
\boxed{
\mathbb E[M_n]
=

\sum_{m=1}^n
\left[
1-
\frac1m\sum_{j=0}^{m-1}
(-1)^j
\cot\frac{(2j+1)\pi}{4m},
\Bigl(\cos\frac{(2j+1)\pi}{2m}\Bigr)^n
\right].
}
$$

这就是这个期望的一个标准精确表达式。

---

## 3. 渐近结果

当 $n\to\infty$ 时，有经典极限定理：

$$
\frac{M_n}{\sqrt n}\ \Longrightarrow\ \sup_{0\le t\le 1}|B_t|
$$

其中 $B_t$ 是标准布朗运动。并且该极限随机变量的期望是：

$$
\mathbb E\Bigl[\sup_{0\le t\le 1}|B_t|\Bigr]
=

\sqrt{\frac{\pi}{2}}
$$

所以：

$$
\boxed{\mathbb E[M_n]\sim \sqrt{\frac{\pi n}{2}}}
$$

也就是主项约为：

$$
\mathbb E[M_n]\approx 1.253314\sqrt n.
$$

---

## 4. 对比一下末位置

注意这不是最后位置 $|S_n|$ 的期望。后者是 $\mathbb E|S_n|\sim \sqrt{\frac{2n}{\pi}},$，而这里取的是全过程的最大绝对值，所以更大，主常数变成了 $\sqrt{\frac{\pi}{2}}$。

## 5. 最终结论

精确值：

$$
\boxed{
\mathbb E\left[\max_{0\le k\le n}|S_k|\right]
=

\sum_{m=1}^n
\left[
1-
\frac1m\sum_{j=0}^{m-1}
(-1)^j
\cot\frac{(2j+1)\pi}{4m},
\Bigl(\cos \frac{(2j+1)\pi}{2m}\Bigr)^n
\right].
}
$$

渐近值：

$$
\boxed{
\mathbb E!\left[\max_{0\le k\le n}|S_k|\right]
\sim
\sqrt{\frac{\pi n}{2}}}
$$

:::

### 解决问题

考虑用上面给出的 trick 解决一道[经典题目](https://www.luogu.com.cn/problem/P7606)！

题目给出的六边形网格不太好处理，因此容易想到把这个东西压扁，将六个方向修改为上，下，左，右，右上，左下。此时容易想到直接 dp。设 $f_{i,x,y,j,k}$ 表示当前处理了前 $i$ 个 idea，$L=j,G=k$，当前网格的横坐标是 $x$，纵坐标是 $y$，是否是可行的状态。

考虑优化这个 dp。可行性 dp 通常有下面两种优化方法：

+ 把一维状态写到答案里。
+ 用 bitset 优化。

这个问题看着很不能把状态写到答案里，因此考虑用 bitset 优化。发现 $y$ 这个 dp 维度其实就是在做一次循环移位操作，用 bitset 优化可以让时间复杂度除一个 $w$，但是仍然难以通过。

考虑利用上面的 trick。注意到最后需要让所在的位置 $(x,y)$ 回到 $(0,0)$，而上面的 trick 在更高维度上也同样满足距离 $(0,0)$ 的曼哈顿距离期望为 $O(\sqrt n)$ 级别。因此考虑**直接随机打乱输入的 idea 顺序，此时对于距离原点超过 $O(\sqrt n)$ 的位置，其很大概率是可以被不超过 $O(\sqrt n)$ 的位置所替代的，因此只需要处理 $\boldsymbol{x,y\in[-O(\sqrt n),O(\sqrt n)]}$ 的部分，范围以外的 dp 值直接截断处理即可**。此时算法的时间复杂度被优化到 $O(\frac{n^2p^2}w)$，卡常后可以通过该题。

:::success[代码]
因为作者不太会卡常所以目前只有用 C++98 提交才能通过/kel

```cpp line-numbers
#include <bits/stdc++.h>
using namespace std;
const int N = 400010;
const int mod = 998244353;
bitset<26> f[2][110][110][26];
int p[N], a[N][12];
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int n, M; cin >> n >> M;
    const int m = M, st = sqrt(n) + 2;
    for (int i = 1; i <= n; ++i)
        for (int j = 0; j < 12; ++j) cin >> a[i][j];
    int x, y; cin >> x >> y;
    for (int i = 1; i <= n; ++i) p[i] = i;
    random_shuffle(p + 1, p + n + 1);
    f[0][0][0][st] = 1 << st;
    for (int I = 1, i = p[1]; I <= n; i = p[++I])
        for (int j = 0; j < m; ++j)
            for (int k = 0; k < m; ++k)
                for (int h = 0; h <= st * 2; ++h) {
                    f[I & 1][j][k][h] = f[~I & 1][(j - a[i][4] + m) % m][(k - a[i][5] + m) % m][h + 1] >> 1 | f[~I & 1][(j - a[i][0] + m) % m][(k - a[i][1] + m) % m][h] << 1 | f[~I & 1][(j - a[i][2] + m) % m][(k - a[i][3] + m) % m][h + 1] | f[~I & 1][(j - a[i][6] + m) % m][(k - a[i][7] + m) % m][h] >> 1;
                    if (h) f[I & 1][j][k][h] |= f[~I & 1][(j - a[i][8] + m) % m][(k - a[i][9] + m) % m][h - 1] | f[~I & 1][(j - a[i][10] + m) % m][(k - a[i][11] + m) % m][h - 1] << 1;
                }
    cout << ((f[n & 1][x][y][st][st]) ? "Chaotic Evil" : "Not a true problem setter") << '\n';
    return 0;
}
:::

### 练习

> 给定一个 $n$ 个结点的树，每条边都有边权（边权可能为负）。你需要选择若干条有 $4$ 条边组成的简单路径（可以不选），使得没有一条边被超过一条路径覆盖。问所有被路径覆盖的边的边权的和最大是多少。
>
> 数据范围：$2\le n\le 2\times 10^5$。

考虑一个暴力的 dp 做法。设 $f_{i,0/1/2/3}$ 表示当前只处理 $i$ 结点为根的子树，$i$ 结点没有挂长度不为 $4$ 的链 / 在子树里挂了一条长度为 $1/2/3$ 的链，边权之和最大是多少。转移过程需要合并儿子结点的 dp 信息，考虑再记一个 dp 数组辅助转移：设 $g_{i,0/1}$ 表示当前合并了若干个儿子结点的信息，其中儿子结点里长度为 $0$ 的链比长度为 $2$ 的链多 $i$ 条，长度为 $1$ 的链数量 $\bmod\ 2=0,1$，边权和最大是多少（只记录这些信息是因为子树内合并链只能是长度为 $0,2$ 的链对应匹配，长度为 $1$ 的链单独匹配）。此时合并信息是简单的。

直接做转移时间复杂度为 $O(n^2)$。注意到辅助转移的 $g$ 数组中 $i$ 维度维护的是两类儿子结点的链的差值，而一个儿子结点只能有最多一条连向父亲结点的链，最后可以转移到 $f$ 数组里的 $g$ 也只有 $g_{-1,*},g_{0,*},g_{1,*}$ 三类。因此考虑把长度为 $0$ 的链看作 $1$，长度为 $2$ 的链看作 $-1$，则可以看作是在数轴上做随机游走，打乱儿子结点顺序后 $g_i$ 这个维度只需要维护 $O(\sqrt n)$ 个 $i$ 的信息即可。此时算法的时间复杂度优化到 $O(n\sqrt n)$，可以通过该题。

:::success[代码]
```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;
const int N = 200010;
const int mod = 998244353;
const int inf = 1e18;
constexpr inline void add(int &x, int v) { x += v; if (x >= mod) x -= mod; }
constexpr inline void sub(int &x, int v) { x = (x + mod - v) % mod; }
vector<pair<int, int>> adj[N];
int f[N][4], g[2][1010][2];
inline void dfs(int u, int fa) {
    for (auto &[v, w] : adj[u]) if (v != fa) dfs(v, u);
    memset(g, -0x3f, sizeof g);
    int l = 500, r = 500, o = 0; g[0][500][0] = g[1][500][0] = 0;
    for (auto &[v, w] : adj[u]) if (v != fa) {
        --l, ++r, o ^= 1;
        if (l < 1) l = 1;
        if (r > 1000) r = 1000;
        for (int i = l; i <= r; ++i)
            for (int j = 0; j < 2; ++j)
                g[o][i][j] = max({
                    f[v][0] + g[o ^ 1][i][j], 
                    f[v][0] + g[o ^ 1][i - 1][j] + w, 
                    f[v][1] + g[o ^ 1][i][j ^ 1] + w, 
                    f[v][2] + g[o ^ 1][i + 1][j] + w, 
                    f[v][3] + g[o ^ 1][i][j] + w
                });
    } f[u][0] = g[o][500][0], f[u][1] = g[o][501][0], f[u][2] = g[o][500][1], f[u][3] = g[o][499][0];
}
signed main() {
    cin.tie(0)->sync_with_stdio(false);
    int n; cin >> n;
    for (int i = 1; i < n; ++i) {
        int a, b, c; cin >> a >> b >> c;
        adj[a].emplace_back(b, c), adj[b].emplace_back(a, c);
    } for (int i = 1; i <= n; ++i) random_shuffle(adj[i].begin(), adj[i].end());
    dfs(1, 0), cout << f[1][0] << '\n';
    return 0;
}
```
:::

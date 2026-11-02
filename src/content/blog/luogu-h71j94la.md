---
title: "P17618 [Math+Girl×1] dancing With Myself in the sunset / Wheels Mst 题解"
date: "2026-10-06T11:47:11.000Z"
link: "luogu-h71j94la"
categories: ["题解"]
tags: ["洛谷", "数学", "图论", "最小生成树", "组合数学"]
draft: false
---

AI 使用声明：前半部分和最后的线性算答案部分做法是 ChatGPT 教我的。

被官方题解的一大堆积分吓哭了，所以这里给出一个完全不需要任何高等数学知识的题解。

先不考虑额外加入的一条弦。固定一个 $1\sim 2n$ 的边权排列，设她的 MST 中 $n$ 条边的权值为 $a_1<a_2<\ldots<a_n$。记 $c_i$ 表示只保留权值 $\le i$ 的边后图的连通块数量。则考虑 Kruskal 处理完前 $k$ 个权值后森林中边数必然为 $n+1-c_k$，此时这些边必然就是 MST 内权值 $\le k$ 的边，因此可以得到关系 $c_k-1=\sum\limits_{i=1}^n[a_i>k]$，简单推导一下可得 $\sum\limits_{i=0}^{2n}(c_i-1)=\sum\limits_{i=1}^na_i$ 也就是 MST 上边权的和。

考虑把所有 $1\sim 2n$ 的排列对上面的式子求和，即 $\sum\limits_{\pi}\sum\limits_{i=0}^{2n}(c_{\pi,i}-1)$，交换求和顺序得 $\sum\limits_{i=0}^{2n}\sum\limits_{\pi}(c_{\pi,i}-1)$。此时对固定的 $i$ 而言 $c_i-1$ 就是不含有中心点的连通块数量。此时把外圈长度为 $l$ 的连通块记作 $I$，记 $[\text{I is component}]$ 的值为 $1$ 当且仅当 $I$ 是一个不含有中心的连通块，则 $c_{\pi,k}-1=\sum\limits_{i=1}^n\sum\limits_{|I|=i}[\text{I is component}]$，上面的和式的值就是 $\sum\limits_{i=1}^n\sum\limits_{|I|=i}\sum\limits_{j=0}^{2n}\sum\limits_{\pi}[\text{I is component}]$。

考虑把 $i<n$ 和 $i=n$ 分开讨论算答案。

### $i<n$

固定一个长度为 $i$ 的部分 $I$，则其内部有 $i-1$ 条外圈边必须满足其权值 $\le k$，而 $i$ 条从中心连向外侧的边和两条边界的外圈边必须满足权值 $>k$。剩余边的数量为 $2n-2i-1$。因此固定 $l,k,I$ 时排列数为 $\binom{k}{i-1}(i-1)!\binom{2n-k}{i+2}(i+2)!(2n-2i-1)!=\binom{k!(2n-k)!(2n-2i-1)!}{(k-i+1)!(2n-k-i-2)!}=\binom{2n-2i-1}{k-i+1}k!(2n-k)!$。而长度为 $i$ 的连续外圈段一共有 $n$ 个，因此这个部分的答案就是 $n\sum\limits_{i=1}^{n-1}\sum\limits_{k=0}^{2n}\binom{2n-2i-1}{k-i+1}k!(2n-k)!$。

### $i=n$

此时整个外圈部分构成了一个连通块，而所有 $n$ 条从中间连向外侧的边都必须满足权值 $>w_k$，而外圈的 $n$ 条边中至少有 $n-1$ 条满足权值 $\le k$，所以此时当且仅当 $k\in\lbrace n-1,n\rbrace$ 时答案非 $0$。这个部分可以简单分类讨论一下：

+ $k=n$：贡献为 $(n!)^2$。
+ $k=n-1$，贡献为 $n(n-1)!(n+1)!=(n!)^2(n+1)$。

把贡献加起来可得该部分对答案的贡献为 $(n+2)(n!)^2$。

把 $i<n$ 和 $i=n$ 的部分合起来，总的贡献就是 $(n+2)(n!)^2+n\sum\limits_{i=1}^{n-1}\sum\limits_{k=0}^{2n}\binom{2n-2i-1}{k-i+1}k!(2n-k)!$。直接算时间复杂度是 $O(n^2)$ 的，核心难点在于如何快速计算中间的 $\sum\limits_{i=1}^{n-1}\sum\limits_{k=0}^{2n}\binom{2n-2i-1}{k-i+1}k!(2n-k)!$。考虑换元，记 $j=k-i+1,m=2n-2i-1$，则：

$$
\begin{aligned}
 &\sum\limits_k\binom{2n-2i-1}{k-i+1}k!(2n-k)!\\
=&\sum\limits_{j=0}^m\binom mj(i+j-1)!(m-j+i+2)!\\
=&m!(i-1)!(i+2)!\sum\limits_{j=0}^m\binom{i+j-1}{i-1}\binom{m-j+i+2}{i+2}\\
=&m!(i-1)!(i+2)!\binom{m+2i+2}{2i+2}\\
=&\frac{(2n+1)!(i-1)!(i+2)!}{(2i+2)!}
\end{aligned}
$$

然后再考虑加弦的情况。加入一条弦 $(1,x)$ 后总边数变为 $2n+1$。考虑从不加弦的情况扩展而来就是把贡献拆分为原来的部分加上新变化的部分，而新变化的部分就是这条弦带来的实际减小量。固定加弦之后的一个边权排列，设新弦 $(1,x)$ 的权值为 $w$，则暂时删掉这条弦之后记 $t$ 是最小的 $k$ 权值满足只考虑权值 $\le k$ 的边时 $1,x$ 两个点在图上已经连通。那么考虑分类讨论对答案的影响：

+ 若 $k<w$，则弦还没有出现，不会有任何影响。
+ 若 $w\le k<t$，则弦已经出现，但是 $1,x$ 两个点原本还没有连通，因此此时弦会让连通块的数量减少 $1$。
+ 若 $k\ge t$，则原图中 $1,x$ 两个点本身就连通，弦不会对连通块数量产生影响。

因此很容易发现减少的量的和就是 $\max(0,t-w)$。接下来只要统计弦已经出现但是 $1,x$ 在原来的图中仍然是不连通的方案数即可。假设固定了 $a$ 条边的时候必须满足权值 $\le k$，固定了 $b$ 条边的时候必须满足权值 $>k$，则固定 $k$ 时对应的合法排列数就是 $\binom kaa!\binom{2n+1-k}bb!(2n+1-a-b)!$，对所有 $k$ 求和后答案就是 $\sum\limits_k\binom kaa!\binom{2n+1-k}bb!(2n+1-a-b)!=a!b!(2n+1-a-b)!\sum\limits k\binom ka\binom{2n+1-k}b=a!b!(2n+1-a-b)!\binom{2n+2}{a+b+1}=(2n+2)!\frac{a!b!}{(a+b+1)!}$。为了方便，后面记 $F(a,b)=\frac{a!b!}{(a+b+1)!}$，上面的贡献也可以被表示为 $(2n+2)!F(a,b)$。然后考虑只看外圈权值 $\le k$ 的边，设 $C_1,C_x$ 分别是 $1,x$ 两个点所在的外圈连通块。则 $1,x$ 两个点不连通当且仅当 $C_1\neq C_x$ 且 $1,x$ 不能通过中心点来连通。当 $C_1\neq C_x$ 时两个点通过中心连通当且仅当 $C_1$ 中存在一条连接到中心点的边 $\le k$ 且 $C_x$ 中存在一条连接到中心点的边 $\le k$，容斥一下可知不合法情况就是 $C_1$ 中所有连向中心点的边权值 $>k$ 且 $C_x$ 中所有连向中心点的边权值 $>k$。设 $A$ 表示只要求 $C_1$ 没有可用连向中心点的边的贡献，$B$ 表示 $C_1,C_x$ 都没有可用连向中心点的边的贡献，则总减少的量就是 $2A-B$（$C_1,C_x$ 两侧的贡献是对称相同的）。

考虑先计算 $A$ 的值。沿着长度为 $d$ 的路径从 $1$ 开始有连续 $p$ 条外圈边满足 $\le k$ 然后遇到第一条 $>k$ 的边，沿着另外一条长度为 $e$ 的路径同样有连续 $q$ 条边权 $\le k$ 的边然后遇到第一条 $>k$ 的边，则必然有 $0\le p<d\land 0\le q<e$，则此时 $C_1$ 一共有 $p+q+1$ 个点，必须满足边权 $\le k$ 的边的数量是 $p+q+1$。必须满足边权 $>k$ 的边有两条阻断 $C_1$ 的外圈边和 $C_1$ 上的 $p+q+1$ 条连向中心点的边，因此有 $b=p+q+3$。因此可以计算出 $A=(2n+2)!\sum\limits_{i=0}^{d-1}\sum\limits_{j=0}^{e-1}F(i+j+1,i+j+3)$。

然后再考虑计算 $B$ 的值，此时单独考虑一条长度为 $L$ 的路径，设从左右两个端点开始出发，分别由连续 $p,q$ 条外圈边满足其边权均 $\le k$。则若 $p+q\le L-2$，则左右两侧遇到的是两条不同的边权 $>k$ 的边，且满足 $p+q=s$ 的方案有 $s+1$ 种。而若 $p+q=L-1$，则两侧遇到的是同样一条边，而且这条边是唯一一条在外侧满足边权 $>k$ 的边。这条边可以处于 $L$ 个位置中的任意一个，因此有 $L$ 种不同的方案，也就是两题奥路径分别有普通情况和只断一条边的两种情况，考虑对四种情况作分类讨论：

若两条路径都至少剩下两条没有确定的边界，则设对应参数为 $0\le p\le d-2,0\le q\le e-2$，则方案数的系数为 $(p+1)(q+1)$，必须在前面的边就是 $p+q+1$ 条，必须在后面的边就是两个端点自己连向中心点的两条边，两条路径的一共四条断边和剩下的属于 $C_1,C_x$ 的 $p+q$ 个点连向中间点的 $p+q$ 条边，一共是 $p+q+6$ 条边，对答案的贡献就是 $\sum\limits_{p=0}^{d-2}\sum\limits_{q=0}^{e-2}(p+1)(q+1)F(p+q+1,p+q+6)$。

若长度为 $d$ 的路径有两条没确定的边界，而长度为 $e$ 的路径只有一条断掉的边，则因为后者有 $e$ 种断边的方法，所以总的贡献就是 $e\sum\limits_{p=0}^{d-2}(p+1)F(p+e,p+e+4)$。而若长度为 $e$ 的路径有两条没有确定的边界，而长度为 $d$ 的路径只有一条断掉的边，则贡献反过来就是 $d\sum\limits_{q=0}^{e-2}(q+1)F(d+q,d+q+4)$。最后一类情况是两条路径都只有一条断的边，则此时边权必须 $\le k$ 的边的数量为 $n-1$，必须 $>k$ 的边的数量为 $n+2$，总的贡献就是 $deF(n-1,n+2)$。

直接把四类贡献合并起来求和时间复杂度为 $O(n^2)$，考虑进一步优化。为了方便，记 $u_r=F(r+1,r+3),v_r=F(r+1,r+6),q_r=F(r,r+4),A_d=\sum\limits_{i=0}^{d-1}\sum\limits_{j=0}^{e-1}u_{i+j},B_d=\sum\limits_{i=0}^{d-2}\sum\limits_{j=0}^{e-2}(i+1)(j+1)v_{i+j},C_d=\sum\limits_{i=e}^{n-2}(i-e+1)q_i,D_d=\sum\limits_{i=d}^{n-2}(i-d+1)q_i$，则减少量可以被表示为 $(2n+2)!(2A_d-B_d-eC_d-dD_d-deF(n-1,n+2))$ 的形式，问题在于怎么对所有的 $d$ 在线性时间内求出上面的所有量。

考虑先维护 $A_d$ 的值。记 $F_d=\sum\limits_{i=d}^{n-2}u_i,G_d=\sum\limits_{i=e-1}^{n-2}u_i$，则当 $d$ 自增 $1$，$e$ 自减 $1$ 的时候，变化量显然就是 $A_{d+1}-A_d=P_d-Q_d$，同时 $P_{d+1}-P_d=-u_d,Q_{d+1}-Q_d=u_{e-2}$。然后用类似的方式维护 $B_d$，记 $R_d=\sum\limits_{i=d-1}^{n-4}(i-d+2)v_i,F'_d=\sum\limits_{i=d-1}^{n-4}v_i,C_d=\sum\limits_{i=e-2}^{n-4}(i-e+3)v_i,G'_d=\sum\limits_{i=e-2}^{n-4}v_i$，则同样考虑 $d$ 自增 $1$，$e$ 自减 $1$ 时的变化量，可以发现 $B_{d+1}-B_d=dR_d-(e-1)C_d$，递推另外四个量可以得到 $R_{d+1}-R_d=-F'_d,C_{d+1}-C_d=G'_{d+1},F'_{d+1}-F'_d=-v_{d-1},G'_{d+1}-G'_d=v_{e-3}$。$F_d,G_d$ 的变化量则同样可以借助前面提到的 $C_*,D_*$ 进行转移，这里就不再赘述了。因此上述所有信息都可以 $O(1)$ 的从 $d$ 更新到 $d+1$ 的信息，总时间复杂度也就是 $O(n)$ 的了。

代码写丑了，可能会被卡常。

```cpp line-numbers
namespace lowspeed_song {

mt19937_64 mt(time(0));

int fac[N], inv[N], ifac[N];

inline void init() {
    fac[0] = 1;
    for (int i = 1; i < N; ++i) fac[i] = fac[i - 1] * i % mod;
    ifac[N - 1] = inversion(fac[N - 1]);
    for (int i = N - 2; ~i; --i) ifac[i] = ifac[i + 1] * (i + 1) % mod;
    // fac[0] = inv[0] = ifac[0] = 1;
    // fac[1] = inv[1] = ifac[1] = 1;
    // for (int i = 2; i < N; ++i) {
    //     fac[i] = fac[i - 1] * i % mod;
    //     inv[i] = mod - inv[mod % i] * (mod / i) % mod;
    //     ifac[i] = ifac[i - 1] * inv[i] % mod;
    // }
}

inline int binom(int a, int b) {
    if (b < 0 || a < b) return 0;
    return fac[a] * ifac[b] % mod * ifac[a - b] % mod;
}

inline int F(int a, int b) { return fac[a] * fac[b] % mod * ifac[a + b + 1] % mod; };
inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n; cin >> n;
    int sum = 0;
    for (int i = 1; i < n; ++i) addmod(sum, F(i - 1, i + 2));
    int S = ((n + 2) * fac[n] % mod * fac[n] + n * fac[n + n + 1] % mod * sum) % mod, bs = S * (n + n + 2) % mod;
    int A = 0, v1 = 0, v2 = F(n - 1, n + 1), R = 0, v3 = 0, N = 0, v4 = 0;
    for (int i = 0; i <= n - 2; ++i) {
        addmod(A, F(i + 1, i + 3));
        if (i) addmod(v1, F(i + 1, i + 3));
        if (i < n - 3) addmod(v3, F(i + 1, i + 6)), addmod(R, F(i + 1, i + 6) * (i + 1) % mod);
        if (i) addmod(v4, F(i, i + 4)), addmod(N, F(i, i + 4) * i % mod);
    } int B = 0, C = 0, M = 0, v5 = 0, v6 = 0;
    for (int i = 1; i < n / 2; ++i) {
        addmod(A, (v1 - v2 + mod) % mod);
        addmod(v2, F(n - i - 1, n - i + 1)), submod(v1, F(i + 1, i + 3));
        addmod(B, (i * R - C * (n - i - 1) % mod + mod) % mod);
        submod(R, v3);
        if (i - 1 <= n - 4) submod(v3, F(i, i + 5));
        if (n - i > 2 && n - i - 3 <= n - 4) addmod(v6, F(n - i - 2, n - i + 3));
        addmod(C, v6), submod(N, v4);
        if (i < n - 1) submod(v4, F(i, i + 4));
        addmod(v5, F(n - i - 1, n - i + 3)), addmod(M, v5);
        int val = 2 * A % mod;
        submod(val, B), submod(val, (n - (i + 1)) * M % mod);
        submod(val, (i + 1) * N % mod);
        submod(val, (i + 1) * (n - (i + 1)) % mod * F(n - 1, n + 2) % mod);
        cout << (bs - val * fac[n + n + 2] % mod + mod) % mod << ' ';
    } cout << '\n';
}

} // namespace lowspeed_song
```

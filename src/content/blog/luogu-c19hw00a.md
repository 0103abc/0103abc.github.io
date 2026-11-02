---
title: "P10895 选择困难症 题解"
date: "2024-09-17T14:21:40.000Z"
link: "luogu-c19hw00a"
categories: ["题解"]
tags: ["洛谷", "数学", "数论", "算法思想", "构造"]
draft: false
---

~~为了写这个题学习的亚线性求区间质数个数~~ 写完这个题真的玉玉了

思路参考第一篇题解。

题目大意是问 $[0,\text{L}(n))$ 中有多少个数 $i$ 满足 $i\bmod 2$，$i\bmod 3$，$\ldots$，$i\bmod n$ 两两不同。其中 $\text{L}(n)=\text{lcm}(1,2,3,\ldots,i)$。

首先有一种很简单的方法（最喜欢的）：写一个暴力然后瞪眼找规律，可以很容易的发现答案。

正确做法：

首先根据~~山茶的~~《奥赛经典 · 初中数学竞赛中的数论问题》可以得到：

$\textbf{Lemma 1}$ 若 $x\equiv a(\bmod\ p)$，则 $x\equiv pl+a(\bmod\ p)$。

$\textbf{Proof}$ 对于 $x\equiv a(\bmod\ p)$ 根据同余的基本性质可以得到若得到 $x\equiv b(\bmod\ p)$ 则相加得到 $x\equiv a+b(\bmod\ p)$。此时构造 $x\equiv pl\equiv 0(\bmod\ p)$，将原式与上述式子相加得到 $x\equiv pl+a(\bmod p)$，得证。

考虑现在知道 $x$ 是一个满足条件的解，则：

+ 若 $x\equiv1(\bmod\ 2)$，则根据数论知识得到 $x\equiv1,3(\bmod\ 4)$。为保证 $x\bmod 2\neq x\bmod 4$，所以得到 $x\equiv 3(\bmod\ 4)$，同理此时 $x\equiv (2k-1)(\bmod\ 2k)$。
+ 否则有 $x\equiv0(\bmod\ 2)$，则根据数论知识得到 $x\equiv0,2(\bmod\ 4))$。为保证 $x\bmod 2\neq x\bmod 4$，所以得到 $x\equiv 2(\bmod\ 4)$，同理此时 $x\equiv (2k-2)(\bmod\ 2k)$。

$\bmod\ 3$、$\bmod\ 5$ 的情况同理。所以：

$\textbf{Lemma 2}$ 若目前已知 $x\bmod p$ 的值，则 $x\bmod kp(k\in\textbf{N}_+)$ 的情况必然确定。

$\textbf{Proof}$ 若 $x\bmod p=q$（$0\le q<p$ 且 $q\in\textbf{N}$），则 $x\bmod 2p$ 的取值仅可以为 $q,q+p$，为保证互不相同条件需有 $ $。同理 $x\bmod 3p$ 的取值仅可以为 $q,q+p,q+2p$，以此类推。得到 $x\bmod kp$ 的取值仅可以为 $q,q+p,q+2p,\ldots,q+(k-1)p$。回顾行列式上三角矩阵求值方法/大雾，$x\bmod p=q$，则 $x\bmod 2p$ 为和 $x\bmod p$ 不同必须满足 $x\bmod 2p\neq q$，即 $x\bmod 2p=q+p$。同理 $x\bmod 3p=q+2p$，$\ldots$，$x\bmod kp=q+(k-1)p$。因此构造出了唯一满足条件的解并证明引理 $2$。

然后考虑 $x\bmod 2$ 的值确定，就可以确定出 $x\bmod (2\times 3)$ 即 $x\bmod 6$ 的值。若 $x\bmod 6=q$，则考虑用 $x\bmod 3$ 的值反推答案。令 $x\bmod 3=p$，则 $x\bmod 6$ 只能取 $p$ 和 $p+3$。目前已经知道 $x\bmod 6$ 的值为 $p$ 或者 $p+3$，显然可以反推出 $x\bmod 3$ 的值为 $p$ 或者 $p+3$ 中不为 $x\bmod 6$ 的那个值。也就是说：$x\bmod 2$ 的值已知，那么可以得到 $x\bmod 3$ 的值。

$\textbf{Lemma 3}$ 若 $x\bmod p$ 的值已知，且 $\text{lcm}(p,q)\le n$，则可以用 $x\bmod p$ 的值直接唯一确定 $x\bmod q$ 的值。

$\textbf{Proof}$ 首先可以用 $x\bmod p$ 的值直接唯一确定 $x\bmod \text{lcm}(p,q)$ 的值，然后考虑根据 $x\bmod \text{lcm}(p,q)$ 的值直接反推出 $x\bmod kq$ 的值（$k\in \textbf{N}$ 且 $kq\le n$），发现 $x\bmod kq$ 的值都可以使用上述方法唯一确定。因此得证。

然后考虑什么数不可以使用 $\textbf{Lemma 3}$ 来确定。发现若 $p\ge\lfloor\frac{n}{2}\rfloor+1$ 则 $x\bmod p$ 的值没法被唯一确定。考虑继续分类讨论：

+ $x\equiv 0(\bmod\ 2)$。此时继续分类讨论：
  + 若 $n$ 不为质数则手摸一会儿可以发现对于每一个剩下的质数都有一组唯一的配对方案，因此答案为 $1$。
  + 否则 $x\bmod n$ 的情况多一组配对方案，因此答案为 $1+1=2$。
+ $x\equiv 1(\bmod\ 2)$。此时发现剩下的每一个质数都恰好有两种不同的配对方案。因此设在 $[\lfloor\frac{n}{2}\rfloor+1,n]$ 中有 $C$ 个质数，则恰好有 $2^C$ 种不同的配对方案。和 $n$ 是否为质数无关。

总结：

$$
F(n)=\left\lbrace
\begin{aligned}
& 2^C+2 & n\in\text{prime}\\
& 2^C+1 & n\not\in\text{prime}
\end{aligned}\right.
$$

然后高兴的发现 $n$ 为 $2\times 10^9$，直接数区间素数过不了……

考虑 SD NOIP2023 赛前九连测 Day7 T2 的做法，使用如 Meissel-Lehmer 或者 Min-25 筛等亚线性做法求解，判断 $n$ 是否为质数不需要 Miller-rabin 直接 $O(\sqrt n)$ 暴力判断，即可以通过。

核心代码：

```cpp
void solve(unsigned int __testid=1){
    // cerr<<"Pi(10)="<<lehmer(10)<<'\n';
    int n;cin>>n;
    int cnt=lehmer(n)-lehmer(n/2);
    cnt%=mod;
    cnt=ksm(2,cnt,mod);
    if(chk(n))cnt+=2;
    else ++cnt;
    cnt%=mod;
    cout<<cnt<<'\n';
}
```

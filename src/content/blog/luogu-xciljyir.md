---
title: "P17800 [CXOI R7-D] 使一颗心不免哀伤 题解"
date: "2026-10-25T13:37:20.000Z"
link: "luogu-xciljyir"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造", "图论", "树", "基础算法", "贪心"]
draft: false
---

Official Solution.

### sol 1

sol: Lemansky

Time：2024/05

首先看到 XOR 构造容易想到一个经典的套路：$2k\oplus(2k+1)=1$（partner），不妨把这样的组合称为 **P**。

---

先考虑无解的情况，显然 $x$ 的最高位不能超过 $n$，否则无解。

$n$ 为 $2$ 的幂可以发现二进制下第 $k$ 位只有 $n$ 是 $1$ 不能消去，所以 $x<n$ 无解。

$n\le 3$ 进行特判，除 $n=2,x=3$ 和 $n=3,x=0$ 外无解，有解的构造都是链。

---

接下来考虑 $n$ 为奇数且 $x<n$，也就是说 $2\sim n$ 每个数都能和 partner 配对使得异或完为 $1$。于是我们只需要以 $1$ 为根，$x$ 和 $x\oplus 1$ 作为 $1$ 的子，P 作为 $x$ 的子即可。此时 $n\ge 5,x\ge 2$ 均有解。

$x=0$ 时直接 $1$ 接 P，$x=1$ 时找一对 P 顶替 $1$ 的位置即可。

$n$ 为偶数且 $x=n$ 也可以这么做，此时不管 $n\oplus 1$。

---

当 $n$ 为奇数且 $x>n$，由于有解，所以 $x$ 和 $n$ 最高位相同，那么显然有 $x\oplus n<n$，此时我们取 $n\oplus[x\oplus n]=x$，包含其 partner 共四个数： $n,n-1,x\oplus n,x\oplus (n-1)$。它们可以使用，且两两组合可以得到 $x$，于是参照上面做法，根下面拆成两部分接 P 即可。此时 $n\ge 9$ 均有解。

$n=5$ 特判，交换组合得到 $x\oplus 1$，不接 P 即可。

$n=7$ 不会出现此情况。

---

接下来考虑 $n$ 为偶数，设问题为 $T(n,x)$，考虑将 $n$ 作为根，其子树变为 $T(n,x)$ 的子问题 $T'(n-1,x\oplus n)$，也就是构造若干棵树，根到叶子异或和都为 $x\oplus n$，直接使用上面的构造即可。此时 $n\ge 6$ 均有解。

$n=4$ 特判，构造是简单的。

:::success[代码实现]
```cpp line-numbers
#include<bits/stdc++.h>
using namespace std;
int T,n,x;
void cal(int n,int x){
	if(x<=n){
		for(int i=2;i<=n;i++){
		    if(i==x||i==(x^1))cout<<1<<' ';
		    else if(i&1)cout<<(i^1)<<' ';
		    else if(x==0)cout<<1<<' ';
		    else if(x==1)cout<<(i==2?1:3)<<' ';
		    else cout<<x<<' ';
		}
	}
	else{
        int d=0;
		for(int i=2;i<=n;i++){
		    if(i==(n^x)||i==(n^x^1))cout<<(i^x^(n==5))<<' ';
		    else if(i==(n^1))cout<<1<<' ';
		    else if(i==n)cout<<1<<' ';
		    else if(i&1)cout<<(i^1)<<' ';
		    else cout<<(n^x^(d>0))<<' ',++d;
		}
	}
}
int main(){
    cin>>T;
    while(T--){
        cin>>n>>x;
        if(n==2&&x==3)cout<<"Yes\n0 1";
        else if(n==3&&x==0)cout<<"Yes\n0 1 2";
        else if(n==4&&x==5)cout<<"Yes\n4 4 2 0";
        else if(n==4&&x==6)cout<<"Yes\n4 4 1 0";
        else if(n==4&&x==7)cout<<"Yes\n4 1 4 0";
        else if(n<=3||((1<<__lg(n))==n&&x<n)||__lg(x)>__lg(n))cout<<"No";
        else if((n&1)||x==n)cout<<"Yes\n"<<0<<' ',cal(n,x);
        else cout<<"Yes\n"<<n<<' ',cal(n-1,x^n),cout<<0<<' ';
        cout<<'\n';
    }
    return 0;
}
```
:::

### sol 2

sol: Priestess_SLG

Time：2026/02/13

#### $n\le 10$

直接暴力枚举出所有的 prufer 序列，将序列转化为树然后判断是否合法即可。（当然更简单的方法是直接枚举每个结点的父结点）。

#### $n\le 2000$

给一些时间复杂度写假了的做法留的。

#### 一些简单的无解情况

记 $high(n)=2^{\lfloor\log_2n\rfloor}$，即 $high(n)$ 为不超过 $n$ 的最大 $2$ 的整数次幂。很显然 $1\sim n$ 的点的编号异或起来得到的结果一定小于 $2high(n)$。因此若有 $x\ge 2high(n)$ 则无解。

#### $n\le 6$

边界情况，在正解中必须单独讨论处理，套用之前 $n\le 10$ 的暴力做法，或手动打表处理均可。

#### $2\nmid n$ 且 $x=0$

考虑异或的经典性质：$2k\oplus(2k+1)=1$。因此容易想到以 $1$ 号结点为根，然后对于任意正整数 $k$ 满足 $2k+1\le n$，在树上添加一条 $1\to 2k\to 2k+1$ 的链即可。

此时 $3,5,7,9,\ldots,n$ 号结点为叶子结点。容易证明此时上述所有结点到根节点的简单路径上结点编号的异或值都为 $0$，符合构造条件。

#### $2\mid n$ 且 $x=n$

令根结点为 $n$，然后在 $n$ 的子树中操作，此时剩下编号为 $1\sim n-1$ 的结点，在这些结点中只需要满足所有叶子结点到该子树内根结点的路径上所有结点编号的异或值为 $0$ 即可，转化为 $2\nmid n$ 且 $x=0$ 的情况讨论即可。

#### $2\nmid n$ 且 $x=1$

注意到 $1\oplus 2\oplus 3=0$，因此考虑到以 $1$ 号节点为根结点，然后连一条 $1\to 2\to 3$ 的链。而对于 $3$ 号结点为根的子树，此时只需要使得每个叶子结点到 $3$ 号结点的路径上所有结点编号的异或值为 $3\oplus 1=2$ 即可。容易想到对于每个正整数 $k$ 满足 $k>1$ 且 $2k+1\le n$，都构造一条 $3\to 2k\to 2k+1$ 的链即可满足条件。

#### $2\mid n$ 且 $x=n+1$

同样的，考虑以 $n$ 为根，然后问题转化为 $2\nmid n-1$ 且 $x=1$ 的情况，对剩下的 $n-1$ 个点做上面提到的构造即可。

#### $n=2^k,k\in\mathbb{N_+}$

注意到此时二进制表示中 $2^k$ 位只有 $n$ 一个数为 $1$，因此任何一条经过 $n$ 号结点的路径，其结点编号异或值必然 $\ge n$。

因此 $x<n$ 时无解。

而在 $x\ge n$ 时，因为 $2\mid 2^k$，所以再按照 $2\mid n$ 的构造方案构造即可。

#### $2\mid n$

同样的，把根节点设为 $n$ 号结点，然后在 $n$ 号结点的子树内构造答案，此时问题转化为 $2\nmid n$ 的情况，只需要让 $x\leftarrow x\oplus n,n\leftarrow n-1$ 即可。

#### $2\nmid n$ 且 $x\le n$

$x\in\lbrace 0,1\rbrace$ 的情况上面都已经单独讨论过了，因此此时只需要处理 $2\le x\le n$ 的情况即可。

此时考虑一个简单通用的构造方案：令 $1$ 号结点为根结点，然后让 $1$ 号结点的两个儿子结点分别为 $x$ 号结点和 $x\oplus 1$ 号结点。而此时对于所有剩下的 $(2k,2k+1)$ 结点组，构造链 $x\to 2k\to 2k+1$ 即可满足条件。

#### $2\nmid n$ 且 $n<x<2high(n)$

构造的思路和上一类情况是类似的，但是会稍微复杂一些。

记 $p=high(n)\oplus x$。此时从所有的 $(2k,2k+1)$ 结点组里找出一组，使得所有结点组中**不存在**结点 $high(n),high(n)\oplus 1,p,p\oplus 1$ 即可。容易证明此时因为 $n>6$，所以根据鸽巢原理，必然可以找到一个这样的结点组。下面记这个结点对是 $(2u,2u+1)$。

那么考虑下面的构造：先构造一条链 $1\to 2u\to 2u+1\to p\oplus 1\to high(n)$。此时有 $1\sim high(n)$ 这条路径上所有结点编号异或值为 $x\oplus 1$。此时在这条路径上再插入二元组 $(2k,2k+1)$，得到形如 $1\to 2u\to 2u+1\to p\oplus 1\to high(n)\to 2k\to 2k+1$ 的链，就可以满足所有叶子结点 $2k+1$ 到根结点 $1$ 的路径上所有结点编号的异或值都为 $x$。

此时剩下结点 $p,high(n)\oplus1$ 没有被加入树中。注意到 $1\oplus p\oplus (high(n)\oplus1)=x$，因此在树上再插入一条 $1\to p\to high(n)\oplus1$ 的链即可完成构造。

#### 时间复杂度

显然时间复杂度为 $O(\sum n)$，不过 $O(\sum n\log n)$ 的实现比较劣的写法也放过去了。

:::success[代码实现]
```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    int up[N];
    inline int high(int n) { return 1ll << (63 - __builtin_clzll(n)); }
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n, x;
        cin >> n >> x;
        if (x >= 2 * high(n))
            cout << "No\n";
        else
        {
            fill(up + 1, up + n + 1, 0);
            if (n <= 6)
            {
                if (n == 2)
                {
                    if (x < 3)
                        cout << "No\n";
                    else
                        cout << "Yes\n0 1\n";
                }
                else if (n == 3)
                {
                    if (x)
                        cout << "No\n";
                    else
                        cout << "Yes\n0 1 2\n";
                }
                else if (n == 4)
                {
                    if (x < 4)
                        cout << "No\n";
                    else if (x == 4)
                        cout << "Yes\n0 1 2 3\n";
                    else if (x == 5)
                        cout << "Yes\n4 4 2 0\n";
                    else if (x == 6)
                        cout << "Yes\n4 4 1 0\n";
                    else
                        cout << "Yes\n2 4 4 0\n";
                }
                else if (n == 5)
                {
                    if (!x)
                        cout << "Yes\n0 1 2 1 4\n";
                    else if (x == 1)
                        cout << "Yes\n0 1 2 3 4\n";
                    else if (x == 2)
                        cout << "Yes\n0 1 1 2 4\n";
                    else if (x == 3)
                        cout << "Yes\n0 1 1 3 4\n";
                    else if (x == 4)
                        cout << "Yes\n0 4 2 1 1\n";
                    else if (x == 5)
                        cout << "Yes\n0 5 2 1 1\n";
                    else if (x == 6)
                        cout << "Yes\n0 1 1 3 2\n";
                    else
                        cout << "Yes\n0 1 1 2 3\n";
                }
                else
                {
                    if (!x)
                        cout << "Yes\n6 1 1 3 2 0\n";
                    else if (x == 1)
                        cout << "Yes\n6 1 1 2 3 0\n";
                    else if (x == 2)
                        cout << "Yes\n6 4 2 1 1 0\n";
                    else if (x == 3)
                        cout << "Yes\n6 5 2 1 1 0\n";
                    else if (x == 4)
                        cout << "Yes\n6 1 1 2 4 0\n";
                    else if (x == 5)
                        cout << "Yes\n6 1 1 3 4 0\n";
                    else if (x == 6)
                        cout << "Yes\n6 1 2 1 4 0\n";
                    else
                        cout << "Yes\n6 1 2 3 4 0\n";
                }
            }
            else
            {
                if (n % 2 && !x)
                {
                    for (int k = 2; k <= n; k += 2)
                        up[k] = 1, up[k | 1] = k;
                }
                else if (n % 2 == 0 && x == n)
                {
                    up[1] = n;
                    for (int k = 2; k < n; k += 2)
                        up[k] = 1, up[k | 1] = k;
                }
                else if (n % 2 && x == 1)
                {
                    up[2] = 1, up[3] = 2;
                    for (int k = 4; k <= n; k += 2)
                        up[k] = 3, up[k | 1] = k;
                }
                else if (n % 2 == 0 && x == n + 1)
                {
                    up[1] = n, up[2] = 1, up[3] = 2;
                    for (int k = 4; k < n; k += 2)
                        up[k] = 3, up[k | 1] = k;
                }
                else if (n & 1)
                {
                    if (x <= n)
                    {
                        up[x] = 1, up[x ^ 1] = 1;
                        for (int k = 2; k < n; k += 2)
                            if (k != x && k != (x ^ 1))
                                up[k] = x, up[k | 1] = k;
                    }
                    else
                    {
                        int p = high(n) ^ x, u;
                        for (u = 2; u < n; u += 2)
                            if (u != p && u != (p ^ 1) && u != high(n) && u != (high(n) ^ 1))
                                break;
                        up[u] = 1, up[u | 1] = u, up[p ^ 1] = u | 1, up[high(n)] = p ^ 1;
                        for (int k = 2; k < n; k += 2)
                            if (k != p && k != (p ^ 1) && k != u && k != (u ^ 1) && k != high(n) && k != (high(n) ^ 1))
                                up[k] = high(n), up[k | 1] = k;
                        up[p] = 1, up[high(n) ^ 1] = p;
                    }
                }
                else
                {
                    if (!(n & (n - 1)) && x < n)
                    {
                        cout << "No\n";
                        return;
                    }
                    x ^= n;
                    // cerr << "up[n] = " << up[n] << '\n';
                    up[1] = n--;
                    if (x <= n)
                    {
                        up[x] = 1, up[x ^ 1] = 1;
                        for (int k = 2; k < n; k += 2)
                            if (k != x && k != (x ^ 1))
                                up[k] = x, up[k | 1] = k;
                    }
                    else
                    {
                        int p = high(n) ^ x, u;
                        for (u = 2; u < n; u += 2)
                            if (u != p && u != (p ^ 1) && u != high(n) && u != (high(n) ^ 1))
                                break;
                        up[u] = 1, up[u | 1] = u, up[p ^ 1] = u | 1, up[high(n)] = p ^ 1;
                        for (int k = 2; k < n; k += 2)
                            if (k != p && k != (p ^ 1) && k != u && k != (u ^ 1) && k != high(n) && k != (high(n) ^ 1))
                                up[k] = high(n), up[k | 1] = k;
                        up[p] = 1, up[high(n) ^ 1] = p;
                    }
                    ++n;
                }
                cout << "Yes\n";
                for_each(up + 1, up + n + 1, [&](auto &output) { cout << output << ' '; });
            }
        }
    }
} // namespace Loyalty
```
:::

### Sol 3

sol: Bingxiu2, Lemansky

Time: 2026/10/21

#### 构造

不妨先让我们构造出的答案最多只有两个叶子，此时树有且仅有一个分叉点，设从根到分叉点的公共前缀异或和为 $A$，两条分叉链的异或和都为 $B$，则每条根到叶子的路径异或和都是 $A\oplus B$。因此只需要构造出 $A\oplus B=x$。

记 $S=1\oplus2\oplus\cdots\oplus n$。由于所有点 $A\oplus B\oplus B=S$，因此 $A=S,B=S\oplus x$。

---

#### 按 $n\bmod 4$ 初始化

容易发现 $S$ 有周期规律如下：

- $n\bmod4=0$ 时，$S=n$；
- $n\bmod4=1$ 时，$S=1$；
- $n\bmod4=2$ 时，$S=n+1$；
- $n\bmod4=3$ 时，$S=0$。

于是根据 $n\bmod4$ 的取值，作如下讨论：

| $n\bmod4$ | 根 | 公共前缀 | 剩余点区间 |  $B$ |
|---|---|---|---|---|
| $0$ | $n$ | $n$ | $[1,n-1]$ | $x\oplus n$ |
| $1$ | $1$ | $1$ | $[2,n]$ | $x\oplus1$ |
| $2$ | $n$ | $n\to1$ | $[2,n-1]$ | $x\oplus n\oplus1$ |
| $3$ | $n$ | $n\to n-1\to1$ | $[2,n-2]$ | $x$ |

经过上述处理后，剩余点的总异或和都为 $0$。

---

#### 二进制贪心分组

从大到小枚举剩余点 $i$，维护两条链当前的末端 $u,v$。

如果 $(B\&i)=i$，说明 $i$ 的二进制位全部包含在当前 $B$ 中，于是把 $i$ 接到第一组，并令 $B\leftarrow B\oplus i$。否则把 $i$ 接到第二组。

因为剩余点的总异或和为 $0$，所以如果第一组的异或和最终变为 $B$，那么第二组的异或和也必然是 $B$。于是满足要求。

---

#### CORNER CASE

当 $n\bmod4>0$ 时，剩余点从 $2$ 开始，没有点 $1$ 可用，如果贪心结束后还剩下 $B=1$，正常情况下无法直接消去。不过 $n>3$ 时剩余点中一定包含 $2,3$，且 $2\oplus3=1$。所以可以把点 $3$ 和点 $2$ 改接到这条链上，使最后两条新链的异或和都为 $1$，从而补上这个 $1$。

若 $n\le3$，剩余点为空，无法修正，只能输出 `No`。

---

#### 无解判定

完成贪心和特殊修正后，如果剩余 $B=0$，说明构造成功，输出 `Yes`；否则输出 `No`。

此时考虑我们构造不出的情况：

- $B$ 的最高位大于剩余点区间的右端点数的最高位，此时要么 $x$ 的最高位大于 $n$ 的最高位，要么 $x<n=2^k$。可以发现这两种情况根本不可能使得根到叶子异或和恰好为 $x$，无解。

- $n=3$，不满足上一条但无法修正，此时 $x=1$ 或 $2$，都无解。

---

本题做法极为丰富，一些稍复杂的做法也可通过。

:::success[Code]
```cpp
#include<bits/stdc++.h>
using namespace std;
int T,n,x,f[100005],u,v,l,r;
int main(){
    cin>>T;
    while(T--){
        cin>>n>>x;
        if(n%4==0)u=v=n,x^=n,l=1,r=n-1,f[n]=0;
        if(n%4==1)u=v=1,x^=1,l=2,r=n,f[1]=0;
        if(n%4==2)u=v=1,x^=n^1,l=2,r=n-1,f[1]=n,f[n]=0;
        if(n%4==3)u=v=1,l=2,r=n-2,f[1]=n-1,f[n-1]=n,f[n]=0;
        for(int i=r;i>=l;i--)(x&i)==i?(x^=i,f[i]=u,u=i):(f[i]=v,v=i);
        if(n>3&&x==1)f[3]=u,x=0;
        if(x){cout<<"No\n";continue;}
        cout<<"Yes\n";for(int i=1;i<=n;i++)cout<<f[i]<<" \n"[i==n];
    }
    return 0;
}

```
:::

#### Code Golf!

248B 实现，来自 Bingxiu2。

```cpp line-numbers
#import<ios>
int n,x,u,w;main(){for(;~scanf("%d%d",&x,&w);n=w){int k=n,v=1,f[n+1]{};k&3?~k&3?x^=1,k&2?x^=f[1]=k:++k:f[f[1]=--k]=n:x^=v=k;for(u=v;n%4>0<--k;k>x&&x-u?f[k]=v,v=k:x^=u=k)f[k]=u;for(k=n&&!puts(x?"No":"Yes");k++<n>x;printf("%d ",f[k]));}}

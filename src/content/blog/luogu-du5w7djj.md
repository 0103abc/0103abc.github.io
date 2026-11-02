---
title: "P4484 [BJWC2018] 最长上升子序列 题解"
date: "2025-03-27T13:20:12.000Z"
link: "luogu-du5w7djj"
categories: ["题解"]
tags: ["洛谷", "动态规划", "状态压缩"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/du5w7djj)。

不会杨表，所以使用 dp of dp 来求解这个问题。

有一定思维含量的 dp of dp 题。先考虑内层求 LIS 的过程。设 $f_i$ 表示当前以 $i$ 结尾的 LIS 长度最长是多少，转移就是再插入一个数是容易的，但是将其压缩到 dp 数组中是困难的。有一个想法是康托展开，但是仍然有 $n!$ 种不同状态。还有另一种想法是对 $f_i$ 求前缀 $\max$，但是这样转移又变得困难了。

考虑换一个方式做 LIS：还是 dp，但是换一个方式。设 $f_i$ 表示当前以 $1\sim i$ 结尾的 LIS 长度最长是多少，然后**将序列中所有数字从小到大插入到 dp 中**。考虑其正确性：因为钦定所有数从小到大插入到 dp 中，所以每一次转移的一定是一段连续的前缀，而 $f_i$ 则正好表示的是一段连续的前缀，因此其正确性没有问题。而此时相邻两个位置的差要么是 $0$ 要么是 $1$，因此此时可以把状态压到 dp of dp 的计数中。而外层 dp 则可以设 $dp_{i,j}$ 表示前 $i$ 个位置当前状压的 $f$ 状态为 $j$ 的方案数，剩下的就是套路转移了。

直接做跑的非常慢，考虑做一个小小的优化：发现 $f$ 数组每在 $i$ 位置插入一个数，都会使得 $i$ 位置从 $0$ 变成 $1$。而如果此时 $i$ 后面存在一个位置为 $1$，则该位置会从 $1$ 变为 $0$，证明显然。很明显可以通过简单的位运算来优化，省掉一个 $O(n)$ 的枚举。因此总时间复杂度为 $O(n^22^k)$，可以获得 $72\sim 80$ 分。

```cpp
// #pragma GCC optimize(3,"Ofast","inline")
#include<bits/stdc++.h>
#define int long long
using namespace std;
const int N=2000010;
const int mod=998244353;
const int inf=1e18;
int dp[2][N+200000];
int fac[30],inv[30],ifac[30];
//当前长度为 n, 状态为 j, 在 DFA 上找出插入 nw 位置的元素后新的 id
int trans(int n,int j,int nw,int &lasp){
    int mask=((j>>nw)<<(nw+1))|(1<<nw)|(j&((1<<nw)-1));
    if(j>>nw&1)lasp=nw;
    if(~lasp)return mask^(1<<(lasp+1));
    return mask;
}
inline void add(int &a,int b){
    a+=b;if(a>=mod)a-=mod;
}
signed main(){
    cin.tie(0)->sync_with_stdio(false);
    int n;cin>>n;--n;
    fac[0]=inv[0]=ifac[0]=fac[1]=inv[1]=ifac[1]=1;
    for(int i=2;i<30;++i){
        fac[i]=fac[i-1]*i%mod;
        inv[i]=mod-inv[mod%i]*(mod/i)%mod;
        ifac[i]=ifac[i-1]*inv[i]%mod;
    }
    dp[0][0]=1;
    for(int i=1;i<=n;++i){
        memset(dp[i&1],0,sizeof dp[i&1]);
        for(int j=0;j<(1<<(i-1));++j){
            add(dp[i&1][j<<1],dp[~i&1][j]);
            int pos=-1;
            for(int k=i-1;~k;--k){
                int nw=trans(i,j,k,pos);
                add(dp[i&1][nw],dp[~i&1][j]);
            }
        }
    }
    int sum=0;
    for(int i=0;i<(1<<n);++i)add(sum,dp[n&1][i]*(1+__builtin_popcount(i))%mod);
    cout<<sum*ifac[n+1]%mod<<'\n';
}
```

但是仍然无法通过 $n\ge 20$ 的数据。因此考虑在本地打表处理答案然后直接提答，如果手动开 Ofast 的话跑的飞快（$15$ 秒之内就能处理完全部的答案，也可能是我的机子比较好）如果还嫌慢而且有 money 的话可以考虑租机（

完整代码：

```cpp
// #pragma GCC optimize(3,"Ofast","inline")
#include<bits/stdc++.h>
using namespace std;
const int N=2000010;
const int mod=998244353;
const int inf=1e18;
int dp[2][(1ll<<27)+10];
int fac[30],inv[30],ifac[30];
//当前长度为 n, 状态为 j, 在 DFA 上找出插入 nw 位置的元素后新的 id
int trans(int n,int j,int nw,int &lasp){
    int mask=((j>>nw)<<(nw+1))|(1<<nw)|(j&((1<<nw)-1));
    if(j>>nw&1)lasp=nw;
    if(~lasp)return mask^(1<<(lasp+1));
    return mask;
}
inline void add(int &a,int b){
    a+=b;if(a>=mod)a-=mod;
}
signed main(){
    cin.tie(0)->sync_with_stdio(false);
    int n;cin>>n;
    if(n>=20){
        switch(n){
            case 20:cout<<414835038<<'\n';break;
            case 21:cout<<696340671<<'\n';break;
            case 22:cout<<749077581<<'\n';break;
            case 23:cout<<301075008<<'\n';break;
            case 24:cout<<314644758<<'\n';break;
            case 25:cout<<102117126<<'\n';break;
            case 26:cout<<819818153<<'\n';break;
            case 27:cout<<273498600<<'\n';break;
            case 28:cout<<267588741<<'\n';break;
        }
        return 0;
    }
    --n;
    fac[0]=inv[0]=ifac[0]=fac[1]=inv[1]=ifac[1]=1;
    for(int i=2;i<30;++i){
        fac[i]=1ll*fac[i-1]*i%mod;
        inv[i]=mod-1ll*inv[mod%i]*(mod/i)%mod;
        ifac[i]=1ll*ifac[i-1]*inv[i]%mod;
    }
    dp[0][0]=1;
    for(int i=1;i<=n;++i){
        // memset(dp[i&1],0,sizeof dp[i&1]);
        for(int j=0;j<(1<<i);++j)dp[i&1][j]=0;
        for(int j=0;j<(1<<(i-1));++j){
            add(dp[i&1][j<<1],dp[~i&1][j]);
            int pos=-1;
            for(int k=i-1;~k;--k){
                int nw=trans(i,j,k,pos);
                add(dp[i&1][nw],dp[~i&1][j]);
            }
        }
    }
    int sum=0;
    for(int i=0;i<(1<<n);++i)add(sum,1ll*dp[n&1][i]*(1+__builtin_popcount(i))%mod);
    cout<<1ll*sum*ifac[n+1]%mod<<'\n';
}
```

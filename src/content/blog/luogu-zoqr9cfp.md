---
title: "CF979E Kuro and Topological Parity 题解"
date: "2025-04-08T13:15:59.000Z"
link: "luogu-zoqr9cfp"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "状态压缩"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/zoqr9cfp)。

比较奇怪的 dp 题。设 $f_{i,j,k,p}$ 表示 $i\sim n$ 的点中路径条数为 $j$，黑色奇点数目为 $k$，白色奇点数目为 $p$ 方案数是多少。转移直接计数即可是容易的，时间复杂度为 $O(n^4)$。

是否可以优化？答案是可行的。观察到其实路径条数 / 黑色奇点数目 / 白色奇点数目都只需要区分奇偶性即可，因此后三个维度的范围都为 $2$，预处理 $2$ 的幂次之后时间复杂度为 $O(n)$。具体见代码。

```cpp
#pragma GCC optimize(3,"Ofast","inline","unroll-loops")
#include<bits/stdc++.h>
#define int long long
using namespace std;
const int N=55,mod=1e9+7;
int f[N][2][2][2],pwr[N],a[N];
signed main(){
    cin.tie(0)->sync_with_stdio(false);
    int n,p;cin>>n>>p;
    for(int i=1;i<=n;++i)cin>>a[i];
    pwr[0]=1;
    for(int i=1;i<N;++i)pwr[i]=pwr[i-1]*2%mod;
    f[n+1][0][0][0]=1;
    for(int i=n;i;--i)
        for(int j=0;j<2;++j)
            for(int k=0;k<2;++k) 
                for(int p=0;p<2;++p){
                    if(a[i]==0||a[i]==-1){
                        if(p){
                            f[i][j][k][p]=(f[i][j][k][p]+pwr[n-i-1]*f[i+1][j][k][p])%mod;
                            f[i][j^1][1][p]=(f[i][j^1][1][p]+pwr[n-i-1]*f[i+1][j][k][p])%mod;
                        }else f[i][j^1][1][p]=(f[i][j^1][1][p]+pwr[n-i]*f[i+1][j][k][p])%mod;
                    }
                    if(a[i]==1||a[i]==-1){
                        if(k){
                            f[i][j][k][p]=(f[i][j][k][p]+pwr[n-i-1]*f[i+1][j][k][p])%mod;
                            f[i][j^1][k][1]=(f[i][j^1][k][1]+pwr[n-i-1]*f[i+1][j][k][p])%mod;
                        }else f[i][j^1][k][1]=(f[i][j^1][k][1]+pwr[n-i]*f[i+1][j][k][p])%mod;
                    }
                }
    cout<<(f[1][p][0][0]+f[1][p][0][1]+f[1][p][1][0]+f[1][p][1][1])%mod<<'\n';
    return 0;
}
```

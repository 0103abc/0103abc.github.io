---
title: "CF1358E Are You Fired? 题解"
date: "2024-09-23T09:28:13.000Z"
link: "luogu-2vnqfzlj"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "双指针"]
draft: false
---

首先若 $x\ge 0$ 则直接判断整个序列的和是否为正即可。若不为正则其必定不可能对于任意长度为 $k$ 的连续子序列都满足其和大于 $0$。

否则 $x<0$。考虑双指针扫描答案，初始令 $l=\lceil\frac{n}{2}\rceil$，$r=n$ 并分类讨论：

+ 若当前 $\sum\limits_{i=l}^r>0$ 则 $l\leftarrow l-1$，$r\leftarrow r-1$，否则代表 $l\sim p$（$p\ge r$）等区间都不满足条件（感性理解）。直接令 $l\leftarrow l-1$，$r\leftarrow n$ 即可。

时间复杂度为 $O(n)$，可以通过。

```cpp
#pragma GCC optimize(3)
#include<bits/stdc++.h>
#define pb push_back
#define eb emplace_back
#define int long long
#define F(i,x,y) for(int i=x;i<=y;++i)
#define G(i,x,y) for(int i=x;i>=y;--i)
#define FD(i,x,y) for(int i=x;i*i<=y;++i)
#define GD(i,x,y) for(int i=x;i*i>=y;--i)
#define adde(x,y) z[x].eb(y);
#define Adde(x,y) z[x].eb(y),z[y].eb(x);
#define addew(x,y,w) z[x].eb(y,w)
#define Addew(x,y,w) z[x].eb(y,w),z[y].eb(x,w)
#define FIMX(X) memset(X,0x3f,sizeof X)
#define FIMI(X) memset(X,-0x3f,sizeof X)
#define FI0(X) memset(X,0,sizeof X)
#define FIN(X) memset(X,-1,sizeof X)
#define rng(X) X.begin(),X.end()
#define PII pair<int,int>
#define PDD pair<double,double>
#define PIII tuple<int,int,int>
#define VI vector<int>
#define VII vector<PII>
#define VID vector<pair<int,double>>
#define VDD vector<PDD>
using namespace std;
const int N=500100;
const int mod=998244353;
int a[N],s[N];
void solve(unsigned __testid=1) {
    int n;cin>>n;
    F(i,1,(n+1)/2)cin>>a[i];
    int x;cin>>x;F(i,(n+1)/2+1,n)a[i]=x;
    F(i,1,n)s[i]=s[i-1]+a[i];
    if(x>=0){
        if(s[n]>0)cout<<n<<'\n';
        else cout<<"-1\n";
    }else{
        int l=(n+1)/2,r=n;
        while(l>1){
            if(s[r]-s[l-1]>0)--l,--r;
            else --l,r=n;
        }
        if(r==n&&s[n]<=0)cout<<"-1\n";
        else cout<<r<<'\n';
    }
}
int32_t main(){
    // freopen("flag.in","r",stdin);
    // freopen("flag.out","w",stdout);
    int T;
    T=1;
    // cin>>T;
    F(_,1,T)
        solve(_);  
    return 0;
}
```

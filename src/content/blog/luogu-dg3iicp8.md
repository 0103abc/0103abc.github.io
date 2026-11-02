---
title: "CF1165F2 Microtransactions (hard version) 题解"
date: "2024-10-19T01:52:48.000Z"
link: "luogu-dg3iicp8"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分", "贪心"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/dg3iicp8)。

首先问题具有单调性，因此考虑二分答案。设当前二分到的答案为 $p$，则对于每一个商品考虑贪心：

+ 前 $p$ 天内没有活动，那么最后一天以 $2$ 的价格购买。
+ 前 $p$ 天内有活动，那么在最后一个活动日以 $1$ 的价格购买，剩下部分以 $2$ 的价格购买。

时间复杂度为 $O(n\log n)$，可以简单通过问题。

```cpp
#pragma GCC optimize(3)
#include <bits/stdc++.h>
#define eb emplace_back
#define pb push_back
#define int long long
#define F(i,x,y) for(int i=x;i<=y;++i)
#define G(i,x,y) for(int i=x;i>=y;--i)
using namespace std;
const int N=500100;
vector<int>z[N];
int k[N],d[N],t[N],b[N],n,m;
int chk(int p){
    F(i,1,N-1)b[i]=0,z[i].clear();int s=0;
    F(i,1,m)if(d[i]<=p)b[t[i]]=max(b[t[i]],d[i]);
    F(i,1,n){
        if(!b[i])s+=k[i]*2;
        else z[b[i]].eb(i);
    }
    int rem=0;
    for(int i=1;i<=p;++i){
        ++rem;
        if(z[i].size())for(auto &j:z[i]){
            if(rem<k[j]&&i==p)return 0;
            else if(rem<k[j])s+=2*(k[j]-rem),rem=0;
            else rem-=k[j];
        }
    }
    return rem>=s;
}
signed main(){
    cin>>n>>m;
    F(i,1,n)cin>>k[i];
    F(i,1,m)cin>>d[i]>>t[i];
    int l=1,r=N-100,best=-1;
    while(l<=r){
        int mid=l+r>>1;
        if(chk(mid))best=mid,r=mid-1;
        else l=mid+1;
    }
    cout<<best<<'\n';
    return 0;
}
```

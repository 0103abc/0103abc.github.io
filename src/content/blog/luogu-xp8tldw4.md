---
title: "CF1442C Graph Transpositions 题解"
date: "2024-10-20T03:17:11.000Z"
link: "luogu-xp8tldw4"
categories: ["题解"]
tags: ["Codeforces", "图论", "最短路"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/xp8tldw4)。

很厉害的题。首先套路的发现 $f(x)=2^x$ 这个函数增长速度十分的快，在 $x\approx 20$ 的时候代价就超过了直接遍历整张图。因此考虑建 $20$ 层的分层图，若此时能跑到最短路，则可以证明答案一定最优。

还有一种可能就是说 $20$ 层走不到最短路，但是最短路是肯定存在的。因此考虑换一个方式建图。建立两层的分层图，第一层为奇数次，第二层为偶数次。之间的边边权为 $2\times 10^9$，跑一遍最短路，就能得到翻转整张图的次数。于是这道题就做完了。

```cpp
#pragma GCC optimize(3)
#include<bits/stdc++.h>
#define eb emplace_back
#define int long long
using namespace std;
const int N=200100,mod=998244353,inf=mod+1;
int n,m,dis[N*22];
vector<pair<int,int>>z[N*22];
pair<int,int>ed[N];
struct qwq{
    int u,dis;
    bool operator<(const qwq&r)const{
        return dis>r.dis;
    }
};
int ksm(int a,int b,int c){
    if(!b)return 1;
    int ans=ksm(a,b>>1,c);
    ans=ans*ans%c;
    if(b&1)ans=ans*a%c;
    return ans;
}
signed main(){
    cin>>n>>m;
    for(int i=0;i<m;++i){
        int x,y;cin>>x>>y;
        ed[i]={x,y};
        for(int j=0;j<20;++j){
            if(~j&1)
                z[j*n+x].eb(j*n+y,1);
            else
                z[j*n+y].eb(j*n+x,1);
        }
    }
    for(int i=1;i<=n;++i)
        for(int j=0;j<19;++j)
            z[j*n+i].eb((j+1)*n+i,1ll<<j);
    priority_queue<qwq>q;
    memset(dis,0x3f,sizeof dis);
    q.push({1,dis[1]=0});
    while(q.size()){
        auto [x,d]=q.top();q.pop();
        if(dis[x]>=d){
            for(auto &[g,w]:z[x])
            if(dis[g]>dis[x]+w)
            q.push({g,dis[g]=dis[x]+w});
        }
    }
    int mi=1e18;
    for(int i=0;i<20;++i)
        mi=min(mi,dis[i*n+n]);
    if(mi<1e18)cout<<mi<<'\n';
    else{
        for(int i=0;i<N*20;++i)z[i].clear();
        for(int i=0;i<m;++i){
            auto [x,y]=ed[i];
            for(int j=0;j<2;++j){
                if(~j&1)z[j*n+x].eb(j*n+y,1);
                else z[j*n+y].eb(j*n+x,1);
            }
        }
        for(int i=1;i<=n;++i)
            for(int j=0;j<2;++j){
                int k=j^1;
                z[j*n+i].eb(k*n+i,inf);
                z[k*n+i].eb(j*n+i,inf);
            }
        memset(dis,0x3f,sizeof dis);
        q.push({1,dis[1]=0});
        while(q.size()){
            auto [x,d]=q.top();q.pop();
            if(dis[x]>=d){
                for(auto &[g,w]:z[x])
                if(dis[g]>dis[x]+w)
                q.push({g,dis[g]=dis[x]+w});
            }
        }
        int x=min(dis[n],dis[n+n]);
        int lu=x/inf,ki=x%inf;
        cout<<(ki+ksm(2,lu,mod)+mod-1)%mod<<'\n';
    }
}
```

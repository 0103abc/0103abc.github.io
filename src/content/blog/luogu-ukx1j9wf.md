---
title: "CF2030D QED's Favorite Permutation 题解"
date: "2024-10-22T07:22:05.000Z"
link: "luogu-ukx1j9wf"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "排序"]
draft: false
---

考虑一个非常食的写法。

首先观察性质，若存在 $i\in[1,n)\cap\mathbb{N_+}$，$s_i$ 为 `L` 且 $s_{i+1}$ 为 `R` 则 $[1,i]$ 区间中任何一个数都不能移动到 $[i+1,n]$ 区间，反之同理。

因此考虑维护若干个连续段 $[l_1,r_1],[l_2,r_2],\ldots,[l_k,r_k]$ 满足每一个连通块内所有元素都可以互相交换，且任意两个不同的连通块内任意元素都无法互相交换。

然后考虑什么样的序列可以被排序。对于每一个连通块 $[l,r]$，若该区间想要在排序之后所有元素都位于正确的位置，则需要满足该连通块内初始元素恰好为 $l,l+1,l+2,\ldots,r$。又因为该区间内恰好有 $r-l+1$ 个元素，所以只需要满足：

+ 区间内最大值为 $r$。
+ 区间内最小值为 $l$。

使用 ~~SJH Table~~ ST 表维护区间最值，即可做到 $O(n\log n)$ 预处理 $O(1)$ 求区间最值。

但是问题是本题还带单点修改，因此考虑使用 set 来维护每一个这样的连续段，修改一个点的值的时候只需要在 set 上暴力分裂合并所有区间，因此总的时间复杂度为 $O(n\log n)$，可以通过。

代码有很多的情况，十分难写，~~但是我赛时 $10$ 分钟想 $15$ 分钟一遍写过了~~。

```cpp
#pragma GCC optimize(3)
#include<bits/stdc++.h>
#define eb emplace_back
#define int long long
using namespace std;
const int N=200100;
char s[N];
int a[N],f[N][20],g[N][20],lg[N],b[N];
int qu(int l,int r){
    int len=lg[r-l+1];
    return max(f[l][len],f[r-(1ll<<len)+1][len]);
}
int qw(int l,int r){
    int len=lg[r-l+1];
    return min(g[l][len],g[r-(1ll<<len)+1][len]);
}
signed main(){
    lg[0]=-1;
    for(int i=1;i<N;++i)lg[i]=lg[i/2]+1;
    int T;cin>>T;
    while(T--){
        int n,q;cin>>n>>q;
        for(int i=1;i<=n;++i)cin>>a[i];
        scanf("%s",s+1);
        for(int i=1;i<=n;++i)f[i][0]=g[i][0]=a[i];
        for(int i=1;i<20;++i)for(int j=1;j<=n-(1ll<<i)+1;++j)
        f[j][i]=max(f[j][i-1],f[j+(1ll<<(i-1))][i-1]),g[j][i]=min(g[j][i-1],g[j+(1ll<<(i-1))][i-1]);
        int c1=0,c2=0;
        vector<int>poss;
        poss.eb(0);
        for(int i=1;i<n;++i){
            if(s[i]=='L'&&s[i+1]=='R')b[i]=1;else b[i]=0;
            if(s[i]=='L'&&s[i+1]=='R')poss.eb(i);
        }
        poss.eb(n);
        set<pair<int,int>>seg;
        for(int i=1;i<poss.size();++i){
            seg.insert({poss[i-1]+1,poss[i]});
            int qmi=qw(poss[i-1]+1,poss[i]),qmx=qu(poss[i-1]+1,poss[i]);
            if(qmi==poss[i-1]+1&&qmx==poss[i])++c1;
            else ++c2;
        }
        // for(auto &[l,r]:seg)cout<<"["<<l<<","<<r<<"] ";
        //     cout<<'\n';
        while(q--){
            int o;cin>>o;
            if(s[o]=='L'){
                // cout<<"#1\n";
                if(o!=n&&s[o+1]=='R'){
                    auto it=seg.lower_bound({o+1,0ll});
                    auto it1=it;--it1;
                    auto [l,r]=*it;
                    int qmi=qw(l,r),qmx=qu(l,r);
                    if(qmi==l&&qmx==r)--c1;
                    else --c2;
                    auto [L,R]=*it1;
                    qmi=qw(L,R),qmx=qu(L,R);
                    if(qmi==L&&qmx==R)--c1;
                    else --c2;
                    seg.erase(it),seg.erase(it1);
                    qmi=qw(L,r),qmx=qu(L,r);
                    if(qmi==L&&qmx==r)++c1;
                    else ++c2;
                    seg.insert({L,r});
                }
                if(o!=1&&s[o-1]=='L'){
                    // cout<<"#3\n";
                    auto it=seg.lower_bound({o,0ll});--it;
                    auto [l,r]=*it;seg.erase(it);
                    if(qw(l,r)==l&&qu(l,r)==r)--c1;
                    else --c2;
                    if(qw(l,o-1)==l&&qu(l,o-1)==o-1)++c1;
                    else ++c2;
                    if(qw(o,r)==o&&qu(o,r)==r)++c1;
                    else ++c2;
                    seg.insert({l,o-1});
                    seg.insert({o,r});
                }
            }else{
                if(o!=1&&s[o-1]=='L'){
                    auto it=seg.lower_bound({o,0ll});
                    auto it1=it;--it1;
                    auto [l,r]=*it;
                    int qmi=qw(l,r),qmx=qu(l,r);
                    if(qmi==l&&qmx==r)--c1;
                    else --c2;
                    auto [L,R]=*it1;
                    qmi=qw(L,R),qmx=qu(L,R);
                    if(qmi==L&&qmx==R)--c1;
                    else --c2;
                    seg.erase(it),seg.erase(it1);
                    qmi=qw(L,r),qmx=qu(L,r);
                    if(qmi==L&&qmx==r)++c1;
                    else ++c2;
                    seg.insert({L,r});
                }
                if(o!=n&&s[o+1]=='R'){
                    auto it=seg.lower_bound({o+1,0ll});--it;
                    auto [l,r]=*it;seg.erase(it);
                    if(qw(l,r)==l&&qu(l,r)==r)--c1;
                    else --c2;
                    if(qw(l,o)==l&&qu(l,o)==o)++c1;
                    else ++c2;
                    if(qw(o+1,r)==o+1&&qu(o+1,r)==r)++c1;
                    else ++c2;
                    seg.insert({l,o});
                    seg.insert({o+1,r});
                }
            }
            // for(auto &[l,r]:seg)cout<<"["<<l<<","<<r<<"] ";
            // cout<<'\n';
            // cout<<c1<<' '<<c2<<'\n';
            // if(s[o]=='L'){
            //     if(o!=n&&s[o+1]=='R'){
            //         modify(1,n-1,1,o,0);
            //     }
            //     if(o!=1&&s[o-1]=='L'){
            //         modify(1,n-1,1,o-1,1);
            //     }
            // }else{
            //     if(o!=n&&s[o+1]=='R'){
            //         modify(1,n-1,1,o,1);
            //     }
            //     if(o!=1&&s[o-1]=='L'){
            //         modify(1,n-1,1,o-1,0);
            //     }
            // }
            if(s[o]=='L')s[o]='R';else s[o]='L';
            if(c2==0)cout<<"YES\n";else cout<<"NO\n";
        }
    }
}
```

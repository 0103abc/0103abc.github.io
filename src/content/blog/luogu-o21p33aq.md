---
title: "CF2091G Gleb and Boating 题解"
date: "2025-03-26T01:03:27.000Z"
link: "luogu-o21p33aq"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "位运算"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/o21p33aq)。

考虑到 $d\ge k\times k$ 的时候一定可以在两次转弯之内得出答案，因此特判即可，剩余情况均满足 $d<k\times k$。

此时暴力枚举答案为 $i$，则使用 bitset 维护当前所有可以到达的位置即可，更新答案可以直接暴力更新。

```cpp
#pragma GCC optimize(3,"Ofast","inline")
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;
signed main(){
    // freopen("1.out","w",stdout);
    cin.tie(0)->sync_with_stdio(false);
    int T;cin>>T;
    while(T--){
        int d,k;cin>>d>>k;
        if(d%k==0)cout<<k<<'\n';
        else if(d>=k*k)cout<<max(1ll,k-2)<<'\n';
        else{
            //d<=1e6
            bitset<2000010>bit,bit2,lim;
            bit.set(0);
            int o=1;
            for(int i=0;i<=d;++i)lim.set(i);
            for(int i=k;;--i){
                bit2.reset();
                if(!i)i=1;
                int cnt=1;
                if(o)bit2=bit<<i;
                else bit2=bit>>i;
                while(i*cnt<=d){
                    if(o==1)bit2|=(bit2<<i);
                    else bit2|=(bit2>>i);
                    ++cnt;
                }
                bit=bit2;
                bit&=lim;
                o^=1;
                // cerr<<"debug: ";
                // for(int i=0;i<=d;++i)cout<<bit[i];
                // cout<<'\n';
                // _sleep(100);
                if(bit[d]){
                    cout<<i<<'\n';
                    break;
                }
            }
        }
    }
}
```

---
title: "CF1919D 01 Tree 题解"
date: "2025-04-08T07:14:11.000Z"
link: "luogu-ielobme0"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "算法思想", "构造"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/ielobme0)。

一个神经的单 $\log$ 做法。直接做十分神秘，考虑先转化问题：考虑到对于两个有共同父亲结点的叶子结点，她们到根节点的距离的差的绝对值必然为 $1$。因此问题转化为：

> 给定一个长度为 $n$ 的序列 $a$，现每一次可以选择相邻的两个位置，满足她们的差的绝对值为 $1$，删去她们中值较大的那个。问是否存在一组合法的删除方案，使得最终序列中恰好存在 $1$ 个数，且这个数的值为 $0$。

现在这个问题就简单多了：考虑套路贪心，维护一个双向链表，链表中按下标顺序存储所有当前未被删除的序列元素，再维护一个 `set` 表示当前所有可以删除其和其后继元素的位置。每一次贪心的从 `set` 中取出当前值最大的位置，并将其删除。重复上述操作，若最终可以使得序列满足条件，则可以构造出合法解，否则不可以构造出合法解。

于是该题做完了，时间复杂度为 $O(n\log n)$ 可以通过。

```cpp
#pragma GCC optimize(3,"Ofast","inline","unroll-loops")
#include<bits/stdc++.h>
#define int long long
using namespace std;
const int N=500010;
int a[N],pre[N],nxt[N];
signed main(){
    cin.tie(0)->sync_with_stdio(false);
    int T,ca=1;
    cin>>T;
    int tc=T;
    while(T--){
        int n;cin>>n;
        for(int i=1;i<=n;++i)cin>>a[i];
        for(int i=1;i<=n;++i)pre[i]=i-1,nxt[i]=i+1;
        nxt[0]=1,pre[n+1]=n;
        int cnt=n,idx=n+1;
        set<pair<int,int>>pos;
        //pos 存储当前所有可以删除的左侧位置
        for(int i=1;i<n;++i)
            if(abs(a[i]-a[i+1])==1)pos.emplace(a[i]+a[i+1],i);
        while(cnt>1){
            if(pos.empty())break;
            --cnt;
            int id=pos.rbegin()->second;pos.erase(--pos.end());
            int id2=nxt[id];
            a[++idx]=min(a[id],a[id2]);
            pre[idx]=id,nxt[idx]=id2;
            nxt[id]=idx,pre[id2]=idx;
            pre[nxt[id]]=pre[id];
            nxt[pre[id]]=nxt[id];
            pre[nxt[id2]]=pre[id2];
            nxt[pre[id2]]=nxt[id2];
            if(pos.count({a[id2]+a[nxt[id2]],id2}))pos.erase(pos.find({a[id2]+a[nxt[id2]],id2}));
            if(pos.count({a[pre[id]]+a[id],pre[id]}))pos.erase(pos.find({a[pre[id]]+a[id],pre[id]}));
            if(pre[idx]&&abs(a[idx]-a[pre[idx]])==1)pos.emplace(a[pre[idx]]+a[idx],pre[idx]);
            if(nxt[idx]!=n+1&&abs(a[idx]-a[nxt[idx]])==1)pos.emplace(a[idx]+a[nxt[idx]],idx);
        }
    }
    return 0;
}
```

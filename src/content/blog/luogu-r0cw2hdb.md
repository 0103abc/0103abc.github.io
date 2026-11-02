---
title: "CF1453E Dog Snacks 题解"
date: "2024-09-23T07:44:58.000Z"
link: "luogu-r0cw2hdb"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "二分"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/r0cw2hdb)。

易得枚举到以 $j$ 为根节点的子树时，设其直接儿子节点的编号分别为 $i_1,i_2,\ldots,i_k$，必然是获得一个 $1\sim k$ 的排列 $p_1,p_2,\ldots,p_k$，然后以 $i_{p_1},i_{p_2},\ldots,i_{p_k}$ 的顺序遍历子树更为优秀。

首先二分答案为 $k$，然后钦定 $1$ 为根，考虑设 $f_i$ 表示以 $i$ 为根节点的子树中遍历完所有的结点，最后一步跳到子树外面，这个点距离 $i$ 最远距离为多少。特殊的若不能满足这样的条件那么令 $f_i=-1$。更特殊的，若 $i=1$ 则不需要跳到子树外面则需要特殊判断，否则，枚举其所有直接儿子节点 $i_1,i_2,\ldots,i_p$：

+ $p=0$，则直接有 $f_i=k$。
+ $p>0$，则计算其 $i_1,i_2,\ldots,i_p$ 的 $f$ 值，若其中存在一个元素的 $f$ 值为 $-1$，或者至少两个元素的 $f$ 值不足 $1$，则容易证明此时显然不存在任何一组合法的策略。否则，直接计算其中 $f$ 值最大的，让其最后一个访问，显然对其父亲链上结点的影响最优秀，即 $f_i=\max\limits_{j=1}^k f_{i_j}$。

总的时间复杂度为 $O(n\log n)$ 可以通过。

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
VI z[N];
int f[N],n;
//钦定1为根
//f[i] 表示 i 为根的子树, 最后一步距离 i 点的距离最小，可以跳到 i 点子树外距离 i 点最多多远
void dfs(int u,int fa,int k){
    if(u!=1&&z[u].size()<=1){
        f[u]=k;
        return;
    }
    int cnt=0;
    f[u]=0;
    for(auto &v:z[u])
        if(v!=fa){
            dfs(v,u,k);
            if(f[v]==-1){
                f[u]=-1;
                return;
            }
            if(f[v]<=1){
                if(u==1){
                    ++cnt;
                    if(cnt>1){
                        f[u]=-1;
                        return;
                    }
                }else{
                    f[u]=-1;
                    return;
                }
            }
            f[u]=max(f[u],f[v]);
        }
    --f[u];
}
int chk(int k){
    F(i,1,n)f[i]=0;
    dfs(1,0,k);
    return ~f[1];
}
void solve(unsigned __testid=1) {
    cin>>n;
    F(i,1,n)z[i].clear();
    F(i,1,n-1){
        int u,v;cin>>u>>v;
        Adde(u,v);
    }
    int l=1,r=n,best=-1;
    while(l<=r){
        int mid=l+r>>1;
        if(chk(mid))best=mid,r=mid-1;
        else l=mid+1;
    }
    cout<<best<<'\n';
}
int32_t main(){
    freopen("flag.in","r",stdin);
    freopen("flag.out","w",stdout);
    int T;
    // T=1;
    cin>>T;
    F(_,1,T)
        solve(_);  
    return 0;
}
```

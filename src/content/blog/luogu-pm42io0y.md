---
title: "P11078 「FSLOI Round I」迷雾 题解"
date: "2024-09-22T14:25:47.000Z"
link: "luogu-pm42io0y"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/pm42io0y)。

考虑简单线段树，维护当前区间的坐标以及之后每一次询问方向被翻转的次数。每一次更新点的坐标之后，若当前点在迷雾中则将其所对应的影响点在线段树上覆盖次数自增 $1$。具体因为区间不连续但是区间之间的差值相同考虑将点重新映射。总的时间复杂度为 $O(n+q\log q)$，可以通过。

```cpp
// #pragma GCC optimize(3)
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
const int N=1100100,mod=998244353;
const int dx[]={0,0,1,-1},dy[]={-1,1,0,0};
const char op[]={'U','D','R','L'};
char s[555][555];
const int block=140;
int fuck[N];
int a[N],b[N];
struct qwq{
    int l,r,sum,tag;
    void init(int p){
        l=r=p;
        sum=tag=0;
    }
    void yhb(int v){
        sum+=(r-l+1)*v;
        tag+=v;
    }
}z[N<<2];
qwq operator+(const qwq&l,const qwq&r){
    return {l.l,r.r,l.sum+r.sum,0ll};
}
void build(int l,int r,int rt){
    if(l==r)
        return z[rt].init(l);
    int mid=l+r>>1;
    build(l,mid,rt<<1);
    build(mid+1,r,rt<<1|1);
    z[rt]=z[rt<<1]+z[rt<<1|1];
}
void pushyhb(int rt){
    if(z[rt].tag){
        z[rt<<1].yhb(z[rt].tag);
        z[rt<<1|1].yhb(z[rt].tag);
        z[rt].tag=0;
    }
}
void modify(int l,int r,int rt,int ll,int rr,int v){
    if(ll<=l&&r<=rr)
        return z[rt].yhb(v);
    int mid=l+r>>1;
    pushyhb(rt);
    if(ll<=mid)
        modify(l,mid,rt<<1,ll,rr,v);
    if(mid<rr)
        modify(mid+1,r,rt<<1|1,ll,rr,v);
    z[rt]=z[rt<<1]+z[rt<<1|1];
}
int query(int l,int r,int rt,int p){
    if(l==r)return z[rt].sum;
    int mid=l+r>>1;pushyhb(rt);
    if(p<=mid)return query(l,mid,rt<<1,p);
    return query(mid+1,r,rt<<1|1,p);
}
void solve(unsigned __testid=1){
    int n,m,q,k;cin>>n>>m>>q>>k;
    F(i,1,n)F(j,1,m)cin>>s[i][j];
    int x=1,y=1;
    if(k>=block){
        F(i,1,q){
            char c;int a,b;cin>>c>>a>>b;
            if(fuck[i]){
                if(c=='U')c='D';
                else if(c=='D')c='U';
                else if(c=='L')c='R';
                else c='L';
            }
            if(c=='U')x-=a;
            else if(c=='D')x+=a;
            else if(c=='L')y-=a;
            else y+=a;
            if(x<1)x=1;
            if(y<1)y=1;
            if(x>n)x=n;
            if(y>m)y=m;
            if(s[x][y]=='X'){
                F(j,1,b)
                    fuck[i+j*k]^=1;
            }
        }
        cout<<x<<' '<<y<<'\n';
    }else{
        int idx=0;
        F(p,1,k)
            F(i,0,1145141919810){
                int now=i*k+p;
                if(now>q)break;
                ++idx;
                a[now]=idx;
                b[idx]=now;
            }
        build(1,q,1);
        //a[i]:第i个元素所映射的位置
        //b[i]:第i个位置所映射的元素
        F(i,1,q){
            char c;int a,b;cin>>c>>a>>b;
            int pos=query(1,q,1,::a[i]);
            if(pos&1){
                if(c=='U')c='D';
                else if(c=='D')c='U';
                else if(c=='L')c='R';
                else c='L';
            }
            if(c=='U')x-=a;
            else if(c=='D')x+=a;
            else if(c=='L')y-=a;
            else y+=a;
            if(x<1)x=1;
            if(y<1)y=1;
            if(x>n)x=n;
            if(y>m)y=m;
            if(s[x][y]=='X'){
                int bg=::a[i]+1;
                if(b)modify(1,q,1,bg,bg+b-1,1);
            }
        }
        cout<<x<<' '<<y<<'\n';
    }
}
int32_t main(){
    // ios_base::sync_with_stdio(0) ;
    // cin.tie(nullptr);
    int T;
    T=1;
    // cin>>T;
    F(_,1,T)
        solve(_);
    return 0;
}
```

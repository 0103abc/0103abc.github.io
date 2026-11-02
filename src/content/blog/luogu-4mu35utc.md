---
title: "P11952 [科大国创杯初中组 2023] 行走 题解"
date: "2025-03-22T09:44:00.000Z"
link: "luogu-4mu35utc"
categories: ["题解"]
tags: ["洛谷", "图论", "最短路", "动态规划"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/4mu35utc)。

狗屎题。下面提供一个在原有时空限制（$\textbf{2s}\ /\ \textbf{500MB}$）下能通过的算法。

首先因为图是网格图，所以容易想到设 $f_{i,j}$ 为从 $(1,1)$ 开始向下走到 $(i,j)$ 所需要的最小边权，转移容易。若此时无删除操作，则答案即为 $f_{n,n}$。

对于一次删除操作，若其不在最短路上，则显然答案仍然为 $f_{n,n}$。否则本质不同的边的数目只有 $2n-1<10^4$ 条。此时考虑经典结论：所有从 $(1,1)$ 到 $(n,n)$ 的路径对于每一个 $w\in[1,2n)$ 至少要经过一个 $x+y=w$ 的点 $(x,y)$。因此对于这样的询问直接暴力枚举所有满足 $x+y=w$ 的点然后钦定最短路经过这个点，用 $f,g$ 两个数组更新答案，取最小值即可。因为有 $Q$ 次询问，且 $Q$ 的量级远远大于 $O(n)$，因此需要对询问做记忆化，因为任意一条合法路径上从 $(1,1)$ 向 $(n,n)$ 走的过程中都必须恰好经过 $x+y=w$，$w\in[1,2n)$ 的 $(x,y)$ 一次，因此直接对 $x+y$ 的值做记忆化即可。

如果你希望快速的过掉这个题，那么你可以忽略下面一段的内容。如果你希望在原时空限制下过掉题，那么你应当阅读下面一段的内容。

该算法时空复杂度均为 $O(n^2)$，但是因为要开 $2$ 个 `int` 类型的 $n\times n$ 数组存储边权，两个 `long long` 类型的 $n\times n$ 数组存储 $f,g$ 两个 dp 信息，所以在原有空间限制下会爆炸（现在应该不会了）。感觉很♂受，于是分析 $f,g$ 数组存储信息的上界：恰好经过 $2n-1$ 条边，每条边边权最大不超过 $2^{30}$。因为 $2n-1<10^4$，所以乘起来的值小于 $2^{48}$，可以用 $3$ 个 `unsigned short` 压到一起存储计算答案。这样耗的空间为 `500.2MB`。考虑到还需要存储最短路的路径，而路径只有右 / 下两个方向，因此考虑用 `bitset` 压一下，此时空间耗费为 `482.8MB`，可以卡过。然后稍微卡一下常再用 `C++98 with O2` 就可以勉强卡过。下面是（这个人在疯了的时候写的）代码。

```cpp
// #pragma GCC optimize(3,"Ofast","inline")
#include<bits/stdc++.h>
#define int long long
using namespace std;
bool beginmemory;
const int N=200010;
namespace Mahiro{
    typedef long long ll;
    unsigned long long seed;
    int B;
    unsigned long long xorshift64(){
        seed ^= seed << 13;
        seed ^= seed >> 7;
        seed ^= seed << 17;
        return seed;
    }
} using namespace Mahiro;
class int48_t
{
public:
    int48_t();
    int48_t(unsigned long long value);

    int48_t operator+ (int48_t value);
    int48_t operator* (unsigned long long value);
    int48_t operator/ (unsigned long long value);

    void operator= (unsigned long long);
    void operator= (int48_t value);
    operator unsigned long long() const;

    // Declare prefix and postfix increment operators=
    unsigned long long value() const;

private:
    unsigned short mBytes[3];
};
int48_t::int48_t()
{
    mBytes[0] = 0 ;
    mBytes[1] = 0 ;
    mBytes[2] = 0 ;
}

int48_t::int48_t(unsigned long long value)
{
    mBytes[0] =  ( value         & 0xffff);
    mBytes[1] =  ((value >>  16)  & 0xffff);
    mBytes[2] =  ((value >> 32 ) & 0xffff);
}

int48_t int48_t::operator+(int48_t value)
{
    int48_t result ;
    unsigned long long myValue ;
    unsigned long long addValue;


    myValue = this->mBytes[2];
    myValue <<= 16 ;
    myValue |= this->mBytes[1];
    myValue <<= 16 ;
    myValue |= this->mBytes[0];

    addValue = value.mBytes[2];
    addValue <<= 16 ;
    addValue |= value.mBytes[1];
    addValue <<= 16 ;
    addValue |= value.mBytes[0];

    myValue += addValue;

    result = myValue;

    return result;
}

int48_t int48_t::operator*(unsigned long long value)
{
    (*this) = (*this).value() * value;
    return (*this);
}

int48_t int48_t::operator/(unsigned long long value)
{
    (*this) = (*this).value() / value;
    return (*this);
}

void int48_t::operator=(unsigned long long value)
{
    mBytes[0] =  ( value         & 0xffff);
    mBytes[1] =  ((value >> 16)  & 0xffff);
    mBytes[2] =  ((value >> 32 ) & 0xffff);
}

void int48_t::operator=(int48_t value)
{
    mBytes[0] = value.mBytes[0];
    mBytes[1] = value.mBytes[1];
    mBytes[2] = value.mBytes[2];
}

int48_t::operator unsigned long long() const
{
    return value();
}

unsigned long long int48_t::value() const
{
    unsigned long long retVal;

    retVal |= this->mBytes[2];
    retVal <<= 16;
    retVal |= this->mBytes[1];
    retVal <<= 16;
    retVal |= this->mBytes[0];

    return retVal;
}
int n,q;
signed you[5010][5010],xia[5010][5010];
inline int getid(int i,int j){return (i-1)*n+j;}
int48_t f[5010][5010];
int48_t g[5010][5010];
int48_t nmlgb[20010];
enum lesbians{YOU,XIA}Double_Light,Milthm;
bitset<5010*5010>yhb;
int jntm[20010];
//f: pre ;; g: suf
inline int48_t min(int48_t a,int48_t b){
    return a<b?a:b;
}
bool endmemory;
signed main(){
    cin.tie(0)->sync_with_stdio(false);
    cerr<<sizeof(int48_t)<<'\n';
    cerr<<"Memory Used "<<(double)(&beginmemory-&endmemory)/1048576.<<" MB.\n";
    // return 0;
    memset(jntm,-1,sizeof jntm);
    cin>>n>>q>>seed>>B;
    for(int i=1;i<=n;++i)
        for(int j=1;j<n;++j){
            xorshift64();
            you[i][j]=seed&((1ull<<B)-1);
        }
    for(int i=1;i<n;++i)
        for(int j=1;j<=n;++j){
            xorshift64();
            xia[i][j]=seed&((1ull<<B)-1);
        }
    // for(int i=2;i<=n;++i)f[1][i]=f[1][i-1]+you[1][i-1],f[i][1]=f[i-1][1]+xia[i-1][1];
    // yhb[1][1]=XIA;
    // for(int i=2;i<=n;++i)yhb[1][i]=YOU,yhb[i][1]=XIA;
    // for(int i=2;i<=n;++i)for(int j=2;j<=n;++j){
    //     int v1=f[i-1][j]+xia[i-1][j],v2=f[i][j-1]+you[i][j-1];
    //     if(v1<v2)f[i][j]=v1,yhb[i][j]=XIA;else f[i][j]=v2,yhb[i][j]=YOU;
    // }
    // for(int i=n-1;i;--i)g[n][i]=g[n][i+1]+you[n][i],g[i][n]=g[i+1][n]+xia[i][n];
    // for(int i=n-1;i;--i)for(int j=n-1;j;--j){
    //     int v1=g[i+1][j]+xia[i][j],v2=g[i][j+1]+you[i][j];
    //     g[i][j]=min(v1,v2);
    // }
    for(int i=1;i<=n;++i)f[i][0]=(int)(1ll<<47)-1,f[0][i]=(int)(1ll<<47)-1;
    f[0][1]=(int)0;
    for(int i=1;i<=n;++i)
        for(int j=1;j<=n;++j){
            int48_t v1=(int)f[i][j-1]+(int)you[i][j-1],v2=(int)f[i-1][j]+(int)xia[i-1][j];
            if((int)v1<=(int)v2)f[i][j]=v1,yhb[getid(i,j)]=YOU;
            else f[i][j]=v2,yhb[getid(i,j)]=XIA;
        }
    for(int i=1;i<=n;++i)g[i][n+1]=(int)(1ll<<47)-1,g[n+1][i]=(int)(1ll<<47)-1;g[n][n+1]=(int)0;
    for(int i=n;i;--i)for(int j=n;j;--j){
        int48_t v1=(int)g[i][j+1]+(int)you[i][j],v2=(int)g[i+1][j]+(int)xia[i][j];
        if((int)v1<=(int)v2)g[i][j]=v1;else g[i][j]=v2;
    }
    // for(int i=1;i<=n;++i,cout<<'\n')
    //     for(int j=1;j<=n;++j)cout<<yhb[i][j]<<' ';
    assert(g[1][1]==f[n][n]);
    int gzq=n,lbx=n;while(gzq>1||lbx>1){
        if(yhb[getid(gzq,lbx)]==YOU)--lbx,nmlgb[gzq+lbx]=lbx;
        else --gzq,nmlgb[gzq+lbx]=n+gzq;
    }
    int ca=0;
    // cout<<"Wa "<<f[n][n]<<'\n';
    // return 0;
    while(q--){
        ++ca;
        // if(ca>50000)return 0;
        int x1,y1,x2,y2;cin>>x1>>y1>>x2>>y2;
        if(x1==x2){
            //y2=y1+1,key:(x2,y2)
            // cout<<"incorrect "<<x1<<' '<<y1<<' '<<nmlgb[x1+y1]<<'\n';
            if(nmlgb[x1+y1]!=y1)cout<<f[n][n]<<'\n';
            else{
                // if(ca==1)throw;
                if(~jntm[x1+y1]){
                    cout<<jntm[x1+y1]<<'\n';
                    continue;
                }
                int48_t res=(1ll<<47)-1;
                for(int i=1;i<x1;++i)res=min(res,(int48_t)((int)f[i][y2]+(int)g[i][y2]));
                for(int i=1;i<=y1;++i)res=min(res,(int48_t)((int)f[x1+1][i]+(int)g[x1+1][i]));
                cout<<res<<'\n';
                jntm[x1+y1]=res;
            }
        }else{
            assert(y1==y2);
            //x2=x1+1,key:(x2,y2)
            if(nmlgb[x1+y1]!=x1+n)cout<<f[n][n]<<'\n';
            else{
                // if(ca==1)throw;
                if(~jntm[x1+y1]){
                    cout<<jntm[x1+y1]<<'\n';
                    continue;
                }
                int48_t res=(1ll<<47)-1;
                for(int i=1;i<=x1;++i)res=min(res,(int48_t)((int)f[i][y1+1]+(int)g[i][y1+1]));
                for(int i=1;i<y1;++i)res=min(res,(int48_t)((int)f[x2][i]+(int)g[x2][i]));
                cout<<res<<'\n';
                jntm[x1+y1]=res;
            }
        }
    }
    return 0;
}
```

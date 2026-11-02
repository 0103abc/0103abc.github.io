---
title: "P3050 [USACO12MAR] Large Banner G 题解"
date: "2025-03-11T11:58:45.000Z"
link: "luogu-gysq9f02"
categories: ["题解"]
tags: ["洛谷", "数学", "数论"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/gysq9f02)。

好久没写题解了（

很显然，一条连接 $(x_1,y_1)$ 和 $(x_2,y_2)$ 点的线段在平面直角坐标系上可以先把 $(x_1,y_1)$ 点平移到 $(0,0)$，那么就是考虑一条 $(0,0)$ 到 $(x,y)$ 的线段上是否没有其他的整点。

此时令 $d=\gcd(x,y)$，则：

+ 若 $d=1$ 则显然线段上没有其他整点。
+ 若 $d>1$，则把 $x,y$ 同时除以 $d$ 得到 $(x',y')$ 在线段上。

单独处理所有横向和竖向的路径后，要求的东西就是：

$$
\sum\limits_{i=1}^n\sum\limits_{j=1}^m2(n-i+1)(m-j+1)[\gcd(i,j)=1]
$$

看上去很炫酷，因此考虑喵一个反演。套路的，原式为：

$$
\begin{aligned}
&\sum\limits_{i=1}^n\sum\limits_{j=1}^m2(n-i+1)(m-j+1)[\gcd(i,j)=1][边长符合限制条件]\\
=&\sum\limits_{i=1}^n\sum\limits_{j=1}^m\sum\limits_{d=1}^{\min(n,m)}2(n-i+1)(m-j+1)\mu(d)[边长符合限制条件]\\
=&\sum\limits_{d=1}^{\min(n,m)}\mu(d)\sum\limits_{i=1}^{\lfloor\frac nd\rfloor}\sum\limits_{j=1}^{\lfloor \frac md\rfloor}2(n-id+1)(m-jd+1)[边长符合限制条件]\\
=&\sum\limits_{d=1}^{\min(n,m)}\mu(d)\sum\limits_{i=1}^{\lfloor\frac nd\rfloor}\sum\limits_{j=\lceil\frac{\sqrt{l^2-i^2d^2}}{d}\rceil}^{\lfloor\frac{\sqrt{h^2-i^2d^2}}{d}\rfloor}2(n-id+1)(m-jd+1)\\
=&2\sum\limits_{d=1}^{\min(n,m)}\mu(d)\sum\limits_{i=1}^{\lfloor\frac nd\rfloor}(n-id+1)\sum\limits_{j=\lceil\frac{\sqrt{l^2-i^2d^2}}{d}\rceil}^{\lfloor\frac{\sqrt{h^2-i^2d^2}}{d}\rfloor}(m-jd+1)\\
\end{aligned}
$$

式子枚举 $j$ 的后半部分可以直接等差数列求和，前半部分预处理筛出 $\mu$ 积性函数后是调和级数，因此总时间复杂度为 $O(n\log n)$ 可以通过。处理有细节。

```cpp
// #pragma GCC optimize(3,"Ofast","inline")
#include<bits/stdc++.h>
#define int long long
using namespace std;
const int N=1000010;
int pr[N],isp[N],idx,mu[N];
void sieve(){
    mu[1]=1,isp[1]=1;
    for(int i=2;i<N;++i){
        if(!isp[i])pr[++idx]=i,mu[i]=-1;
        for(int j=1;j<=idx&&i*pr[j]<N;++j){
            mu[i*pr[j]]=mu[i]*mu[pr[j]],isp[i*pr[j]]=1;
            if(i%pr[j]==0){mu[i*pr[j]]=0;break;}
        }
    }
}
int calc(int l,int r,int b){
    return (l+r)*(r-l+1)/2%b;
}
int m,n,l,h,b;
signed main(){
    cin.tie(0)->sync_with_stdio(false);
    cout<<fixed<<setprecision(15);
    sieve();
    cin>>m>>n>>l>>h>>b;
    int s=0;
    if(n>m)swap(n,m);
    for(int d=1;d<=min(n,m);++d){
        int now=0;
        for(int i=1;i<=n/d;++i){
            if(h*h<=i*i*d*d)continue;
            int ll=ceil(1.*sqrt(l*l-i*i*d*d)/d),rr=floor(1.*sqrt(h*h-i*i*d*d)/d);
            int L=ll,R=rr,tmp=(m-L*d+1+m-R*d+1)*(R-L+1)%b;
            if(L<1||l*l<=i*i*d*d)L=1;if(R>m/d)R=m/d;if(L>R)continue;
            tmp=(m-L*d+1+m-R*d+1)*(R-L+1)%b;
            now=(now+tmp*(n-i*d+1)%b)%b;
        }
        s=(s+now*mu[d]%b+b)%b;
    }
    if(l<=1)s=(s+n*(m+1)+m*(n+1))%b;
    cout<<s<<'\n';
}
```

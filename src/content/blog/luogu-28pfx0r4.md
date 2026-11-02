---
title: "AT_arc195_e [ARC195E] Random Tree Distance 题解"
date: "2025-03-27T07:11:46.000Z"
link: "luogu-28pfx0r4"
categories: ["题解"]
tags: ["AtCoder", "数学", "概率与期望", "基础算法", "前缀和", "模拟"]
draft: false
---

经典套路为 $\text{dist}(i,j)=\text{dep}_i+\text{dep}_j-2\text{dep}_{\text{lca(i,j)}}$。考虑先求 $\text{dep}_i$ 的期望：显然有 $\text{dep}_1=0,\text{dep}_i=\dfrac{\sum\limits_{j=1}^{i-1}\text{dep}_j}{i-1}+a_i$，可以前缀和优化。

问题在于计算 $\text{dep}_{\text{lca}(i,j)}$（$i<j$）的期望。因为 $p_i<i$ 所以 $\text{lca}(i,j)<i$。考虑模拟不加优化的 $\text{lca}$ 计算的过程：每一次把 $j$ 移动到父亲结点，直到 $j\le i$。考虑到 $p_j$ 在 $[1,j-1]$ 中等概率选取，因此假设 $j$ 跳到了 $p_j$，则 $p_j\le i$ 时落到的结点取 $1\sim i$ 的概率相等。否则令 $j\leftarrow p_j$ 然后此时仍有 $j>i$ 因此返回第一步。容易发现最终 $j$ 落在 $1\sim i$ 的概率是相同的。

因此证明了 $\forall j_1,j_2>i,\text{dep}_{\text{lca}(i,j_1)}=\text{dep}_{\text{lca}(i,j_2)}$。此时 $\text{dep}_{\text{lca}(i,j)}$ 的值和 $j$ 无关只和 $i$ 有关，但是仍然没有计算出其实际的期望值。此时考虑 dp，设 $f_i$ 表示最后 $\text{lca}(i,*)$ 的深度的期望。则显然有递推公式：$f_i=\dfrac{\text{dep}_i+\sum\limits_{j=1}^{i-1}f_j}i$，同样可以前缀和处理。于是做完了。线性处理逆元可以做到 $O(n+Q)$ 通过。注意最后答案需要乘以 $(n-1)!$。

```cpp
#pragma GCC optimize(3,"Ofast","inline")
#include<bits/stdc++.h>
#define int long long
using namespace std;
const int N=1000010;
const int mod=998244353;
const int inf=1e18;
vector<int>adj[N];
int inv[N],f[N],dep[N],pre[N],a[N],fac[N];
signed main(){
    cin.tie(0)->sync_with_stdio(false);
    int n,m;cin>>n>>m;
    for(int i=2;i<=n;++i)cin>>a[i];
    inv[0]=inv[1]=1;
    fac[0]=1;
    for(int i=1;i<N;++i)fac[i]=fac[i-1]*i%mod;
    for(int i=2;i<N;++i)inv[i]=mod-inv[mod%i]*(mod/i)%mod;
    dep[1]=0;
    for(int i=2;i<=n;++i){
        dep[i]=(pre[i-1]*inv[i-1]%mod)+a[i];
        dep[i]%=mod;
        pre[i]=(pre[i-1]+dep[i])%mod;
    }
    f[1]=0;
    for(int i=2;i<=n;++i){
        f[i]=(dep[i]+pre[i-1])*inv[i]%mod;
        pre[i]=(pre[i-1]+f[i])%mod;
    }
    while(m--){
        int a,b;cin>>a>>b;
        cout<<(dep[a]+dep[b]-2*f[a]%mod+mod+mod)%mod*fac[n-1]%mod<<'\n';
    }
}
```

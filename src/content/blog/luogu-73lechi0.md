---
title: "P8456 「SWTR-8」地地铁铁 题解"
date: "2025-03-24T12:14:25.000Z"
link: "luogu-73lechi0"
categories: ["题解"]
tags: ["洛谷", "动态规划", "图论", "强连通分量", "数学", "组合数学"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/73lechi0)。

（标题有含义）

比较困难的题，考察了大量点双的性质

考虑对于一个点双连通分量，其具有下面的性质：

+ 无割点。
+ 任意两个点 $a,b$ 均可存在一条简单路径连通。
+ 递进于上一条，任意两个点 $a,b$ 都存在两条简单路径，使得这两条路径除了 $a,b$ 两个点以外其余点两两不相同。
+ 对于任意两个点 $a,b$ 都存在一个同时经过 $a,b$ 的简单环。
+ 递进于上一条，对于任意三个点 $a,b,c$ 满足 $b,c$ 有一条边相连，则必然存在一个同时经过 $a,b,c$ 的简单环。
+ 递进于上一条，对于任意四个点 $a,b,c,d$ 满足 $b,c$ 有一条边相连，则必然存在一条同时经过 $a,b,c,d$ 的简单路径。
+ 递进于上一条，对于任意三个点 $a,b,c$，存在一条经过 $a,b,c$ 的简单路径。
+ 一个有 $n$ 个结点的无向图中所有点双大小的和是 $O(n)$ 级别的。

知道上述所有性质之后可以开始搞这个题了。题目要计数合法的点对 $(i,j)$。一个点对 $(i,j)$ 合法的充要条件是 $i$ 到 $j$ 存在一条简单路径使得该路径上同时有 `D` 和 `d` 出现。

直接计算十分困难，考虑容斥答案，即求全部方案数（$1$）减去只出现 `D` 的方案数（$2$）减去只出现 `d` 的方案数（$3$）减去 $i=j$ 的方案数（$4$）。其中 $1,4$ 是容易计算的，$1$ 减去 $4$ 的答案为 $\frac{n(n-1)}2$。$2,3$ 两个情况的做法类似可以一起考虑。因此现在其实只需要计数情况 $2$ 的答案，这里将 $2,3$ 一起考虑。

观察到“简单路径”这一性质，即可以想到路径中不能经过重复的结点（当然也就不能经过重复的边），因此想到点双，即对图缩点双然后得到圆方树。

此时存在两类贡献，分别为点双内的贡献和点双外的贡献（这里计数的是负贡献）。对于每一个方点，其对应原图中的一个点双。考虑对这个点双内所有的边处理贡献，则点双可以被分为 D 型点双，d 型点双和 Dd 型点双。其中每一个字母即代表这个点双中存在一条边权为这个字母的边。则若 $i,j$ 不位于同一点双，则其不合法的条件为：其在圆方树上的结点路径中所有方点对应的电刷给你类型相同，且不存在 Dd 型点双。这个部分的计数容易，可以 dp 或者点分。

另一类贡献为点双内的贡献。很明显所有 D 型点双和 d 型点双内所有点对都不合法。有一个猜想是 Dd 型点双内因为路径可以任意经过边所以一定所有点对都是合法的无需计数，但是其实这是错误的。反例形如：

[![pEBrJMT.png](https://s21.ax1x.com/2025/03/24/pEBrJMT.png)](https://imgse.com/i/pEBrJMT)

其中对于 $(1,4)$ 点对，若 $1\leftrightarrow2,2\leftrightarrow3,3\leftrightarrow4$ 的边为 `D`，$1\leftrightarrow5,5\leftrightarrow6,6\leftrightarrow4$ 的边为 `d`，则该点双为 Dd 型点双，但 $1$ 到 $4$ 的路径不能同时经过 `D` 和 `d`。考虑什么时候会出现这样的情况。钦定当前 Dd 型点双中 $i,j$ 出现了该情况，则 $i,j$ 两个点必然同时连了边权为 D 和边权为 d 的边。此时若该点双内还有不同于 $i,j$ 的结点 $k$，$k$ 点也同时连的 `D` 和 `d` 型的边，则根据上面列出的性质可以得知此时为了使得不存在可以从 $i$ 出发走到 $j$ 然后同时经过 D 边权和 d 边权的路径且经过 $k$，必须使得 $i$ 从 D 出发的边只走 D 然后走到 $k$，再从 $k$ 的 D 型边出发走到 $j$，边权为 d 的边也同理。但是这样 $k$ 必然同时可以通过只走边权为 D / d 的边从 $i$ 到达 / 到达 $j$，于是交换路径可以得到：从 $i$ 出发只走边权为 D 的边到 $k$，然后从 $k$ 开始只走边权为 d 的边到 $j$，反之同理。因此该情况不存在。

于是得出结论：Dd 型点双存在上述情况当且仅当只存在两个点同时连了边权为 D 和 d 的边，设这两个点为 $i,j$ 则 $(i,j)$ 不是一个合法的点对，需要计数。很显然此时必然只存在一组合法的点对 $(i,j)$。因此本题搞定，只需 tarjan 处理点双然后建圆方树，对每一个方点求出其所代表的点双是 D 型 / d 型 / Dd 型，然后再跑 dp / 点分求出不同点双之间的点对对答案的贡献即可。时间复杂度为 $O(n)$（dp） / $O(n\log n)$（点分），均可通过。更简单的做法是使用并查集，时间复杂度为 $O(n\log n)$（路径压缩 / 按秩合并）或 $O(\alpha n)$（路径压缩 + 按秩合并）。

代码，调了好长好长时间。

```cpp
// #pragma GCC optimize(3,"Ofast","inline")
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;
struct Triple{
    int first,second,third;
    Triple(){
        first=second=third=0;
    }
    Triple(int a,int b,int c){
        first=a,second=b,third=c;
    }
};
const int N=1000010;
vector<pair<int,int>>adj[N];
vector<int>adj2[N],scc[N],sccc[N],adj3[N];
vector<Triple>sedge[N];
int typ[N];
//1为D，2为d，3为Dd
struct Edge{
    int a,b;
    char o;
}edge[N];
stack<int>stk;
stack<Triple>stk2;
int ind,idx,tot,instk[N],dfn[N],low[N],ins[N],deg[N],inc[N],liuxu[N];
void dfs(int u){
    dfn[u]=low[u]=++idx;
    stk.emplace(u);
    if(!deg[u])scc[++tot].emplace_back(u);
    for(auto &[v,w]:adj[u]){
        if(dfn[v]){
            low[u]=min(low[u],dfn[v]);
            if(dfn[v]<dfn[u])stk2.emplace(u,v,w);
        }
        else{
            stk2.emplace(u,v,w);
            dfs(v);
            low[u]=min(low[u],low[v]);
            if(low[v]>=dfn[u]){
                ++tot;
                int t;
                do{
                    t=stk.top();
                    stk.pop();
                    scc[tot].emplace_back(t);
                }while(t!=v);
                scc[tot].emplace_back(u);
                Triple tmp;
                do{
                    assert(stk2.size());
                    tmp=stk2.top();
                    stk2.pop();
                    sedge[tot].emplace_back(tmp);
                }while(tmp.first!=u||tmp.second!=v);
            }
        }
    }
}
int subid,n,m;
class DSU{//Disjoint Set Union
    public:
    int fa[N],siz[N];
    inline void init(int n){
        iota(fa+1,fa+n+1,1);
        fill(siz+1,siz+n+1,1);
    }
    int girl(int x){
        return x==fa[x]?x:fa[x]=girl(fa[x]);
    }
    int get(int x){
        return siz[girl(x)];
    }
    void les(int a,int b){
        a=girl(a),b=girl(b);
        if(a!=b)fa[a]=b,siz[b]+=siz[a];
    }
}dsu;
int vis[N];
//计算所有满足i!=j且不合法的点对数(i,j)
int calc(){
    int res=0;
    //统计同一点双内的答案
    for(int i=1;i<=tot;++i){
        if(typ[i+n]!=3)res+=scc[i].size()*(scc[i].size()-1)/2;
        else if(inc[i+n]==2)res+=1;
    }
    //统计不同点双内的答案
    dsu.init(tot);
    for(int i=1;i<=tot;++i)dsu.siz[i]=(int)scc[i].size()-1;
    for(int i=1;i<=tot;++i){
        for(int &jj:adj3[i])
            if(typ[i+n]!=3&&typ[jj+n]!=3&&typ[i+n]==typ[jj+n])
                dsu.les(i,jj);
    }
    for(int i=1;i<=tot;++i)sccc[dsu.girl(i)].emplace_back(i);
    for(int i=1;i<=tot;++i)
        if(typ[i+n]!=3&&dsu.girl(i)==i)
            res+=dsu.get(i)*(dsu.get(i)+1)/2;
    for(int i=1;i<=tot;++i)
        if(typ[i+n]!=3)res-=(int)(scc[i].size()-1)*scc[i].size()/2;
    return res;
}
int yhb[N];
using ull=unsigned long long;
inline ull harsh(int i,int j){return i*0x0d000721+j+0x66ccff;}
namespace aimat {
    char *p1,*p2,buf[100010],obuf[100010],*p3=obuf;
    #define gc() (p1==p2&&(p2=(p1=buf)+fread(buf,1,100000,stdin),p1==p2)?EOF:*p1++)
    #define pc(x) (p3==obuf+100000&&fwrite(p3=obuf,1,100000,stdout),*p3++=x)
    int read(){
        int x=0;
        char c=gc();
        while(c<48)c=gc();
        while(47<c)x=(x<<3)+(x<<1)+(c&15),c=gc();
        return x;
    }
    void write(int x){
        if(9<x)write(x/10);
        pc(x%10|48);
    }
} using namespace aimat;
signed main(){
    subid=read();
    n=read(),m=read();
    for(int i=0;i<m;++i){
        int a,b;char o;
        a=read(),b=read();
        o=gc();
        while(o!='d'&&o!='D')o=gc();
        int O=1;if(o=='d')O=2;
        adj[a].emplace_back(b,O);
        adj[b].emplace_back(a,O);
        ++deg[a],++deg[b];
        edge[i]={a,b,o};
    }
    for(int i=1;i<=n;++i)
        if(!dfn[i])dfs(i);
    ind=n;
    int all=0;
    for(int i=1;i<=tot;++i){
        ++ind;
        all+=sedge[i].size();
        for(int &j:scc[i])liuxu[j]=0;
        for(int &j:scc[i]){
            adj2[ind].emplace_back(j);
            adj2[j].emplace_back(ind);
        }
        for(auto &[j,k,v]:sedge[i]){
            assert(v);
            if(v&1){
                typ[ind]|=1;
                liuxu[j]|=1;
                liuxu[k]|=1;
            }
            if(v&2){
                typ[ind]|=2;
                liuxu[j]|=2;
                liuxu[k]|=2;
            }
        }
        for(int &j:scc[i])
        if(liuxu[j]==3)++inc[ind];
        assert(all<=m+m+m);
    }
    for(int i=1;i<=n;++i){
        // for(int x=0;x<adj2[i].size();++x)
        //     for(int y=x+1;y<adj2[i].size();++y){
        //         int id=adj2[i][x],id2=adj2[i][y];
        //         adj3[id-n].emplace_back(id2-n);
        //         adj3[id2-n].emplace_back(id-n);
        //     }
        int id1=-1,id2=-1;
        for(int j=0;j<adj2[i].size();++j){
            if(typ[adj2[i][j]]==1&&!~id1)id1=adj2[i][j];
            if(typ[adj2[i][j]]==2&&!~id2)id2=adj2[i][j];
        }
        for(int j=0;j<adj2[i].size();++j){
            int id3=adj2[i][j];
            if(~id1&&id1!=id3){
                adj3[id1-n].emplace_back(id3-n);
                adj3[id3-n].emplace_back(id1-n);
            }
            if(~id2&&id2!=id3){
                adj3[id2-n].emplace_back(id3-n);
                adj3[id3-n].emplace_back(id2-n);
            }
        }
    }
    cout<<n*(n-1)/2-calc()<<'\n';
    return 0;
}

/*

0
6 5
5 4 d
1 4 D
3 6 d
2 4 D
2 6 d

*/
```

[AC Record](https://www.luogu.com.cn/record/209995614)。

---
title: "P6335 [COCI 2007/2008 #1] STAZA 题解"
date: "2025-03-19T11:21:22.000Z"
link: "luogu-pbdnj87y"
categories: ["题解"]
tags: ["洛谷", "动态规划", "图论", "树", "数学", "组合数学"]
draft: false
---

#### 006. [COCI 2007/2008 #1] STAZA

题意是说给定一个仙人掌，求从 $1$ 号点到任意一个点 $x$ 的路径，使得其满足路径上没有重复的边的条件下，路径上边的数目最多。

很复杂，但是仍然可以看作【模板】仙人掌 dp（但是自己独立完成了，开心

考虑套路的建立狭义圆方树，然后考虑 dp。设 $f_i$ 表示圆方树上以 $i$ 点为根的子树中，最长可以走多长。发现转移困难，因此考虑辅助 dp：设 $g_i$ 表示圆方树上以 $i$ 为根的子树中，最长可以走多长，**且必须满足最后回到了 $i$ 结点。**

首先考虑转移 $g$ 数组。因为“多长”中圆方树建立的辅助结点起不到贡献的作用，因此这里重新具体的定义 $g$ 数组：

+ 若 $i\le n$，则 $g$ 数组的定义不做改动。
+ 若 $i>n$，则 $g$ 数组在这里被定义为：其父亲节点 $j$ 点的 $g$ 值所代表的路径中删去所有 $j$ 点后路径的长度最长是多少。很显然根据狭义圆方树的性质，必然有 $j\le n$。

此时考虑转移。很显然对于任意一个 $i$，若 $i$ 在圆方树中为叶子结点，则必有 $g_i=0$。否则，对 $i$ 做分类讨论：

+ 若 $i>n$，则枚举其所有儿子结点 $j$，每一个 $j$ 都在 $i$ 点在原仙人掌上所对应的环上，因此每一个 $j$ 点都会对答案产生 $1$ 的贡献。同时可以让 $i$ 从 $j$ 开始往下走再走回来最后回到 $i$，即每一个 $j$ 点可以走到的路径，都可以被 $i$ 点走到 $j$ 然后走下去，再从环的另一侧从 $j$ 走回 $i$。因此每个 $j$ 还对答案起 $g_j$ 的贡献。
+ 因此转移方程即为：$g_i=\sum\limits_{\text{j is a son of i}}(g_j+1)$。
+ 若 $i\le n$，则对于其儿子结点 $j$，若 $j\le n$ 则 $i,j$ 不同时在任何一个环上，很显然从 $i$ 走到 $j$ 之后就不能再走回来了（$i\leftrightarrow j$ 一条边在原仙人掌上为割边），因此这样的 $j$ 不会对答案产生任何贡献。否则 $j>n$ 即 $j$ 为新加的辅助结点，此时根据定义 $i$ 必然在 $j$ 所对应的环上，因此 $j$ 可以对 $i$ 产生贡献，即 $g_i\leftarrow g_j$。同理，$i$ 到 $j$ 这条路径必然可以从 $j$ 所对应的环上的另一侧走回来，因此这一段路径可以对答案产生贡献。但是此时发现走回来的半段路径已经在 $g_j$ 中统计过了，没有统计的部分仅为 $i\to j$ 这个长度为 $1$ 的段，只需要将她加入到贡献中即可。
+ 因此转移方程即为：$g_i=\sum\limits_{\text{j is a son of i}}[j\le n](g_j+1)$。

上述对 $g$ 的转移方程时间复杂度为 $O(n)$，考虑如何用 $g$ 来辅助对 $f$ 的计算。

首先对于任意一个 $i$，$g_i$ 一定可以直接被计算到 $f_i$ 上。这是显然的，$g_i$ 的定义为 $f_i$ 的子集，因此 $g_i$ 能走的路径一定可以被 $f_i$ 所走到。

否则，根据仙人掌转狭义圆方树后 dp 的套路分为下面的三个部分：

+ 由圆点向圆点转移。
+ 由圆点向方点转移。
+ 由方点向圆点转移。

其中没有（由方点向方点转移）这个过程是因为根据定义可得圆方树上不存在两个相邻的点使得这两个点都为方点。因此只需要考虑上面三种转移。

其中“由圆点向方点转移”这一个步骤可以不处理，到“由方点向圆点转移”时再一起处理。

那么只需要讨论第一种情况和第三种情况。

（$1$）：由圆点向圆点转移。这个过程和树一样，设从 $v$ 点向 $u$ 点转移贡献，则直接 $u$ 点可以先走到所有和其相邻的方点并转移走贡献，然后再走到 $v$ 点，贡献即为 $f_v+g_u$。

（$2$）：由方点向圆点转移。设从 $v$ 点向 $u$ 点转移贡献，则 $v$ 点为方点。则此时需要从 $v$ 点对应的环中非 $u$ 的一个结点 $v’$ 来转移。则此时 $v'$ 点显然不能再走回来了，但是除了 $v’$ 以外所有在对应环上且不是 $u$ 点的点仍然可以继续走下去再转移上来。考虑容斥计算答案，则该部分答案即为 $g_u-g_v$。然后考虑把环上的结点按照顺（逆）时针顺序排序标号，则走到 $v$ 点可以从 $u$ 在环上顺时针方向 / 逆时针方向两种方向走过来，此时计算前缀价值和和后缀价值和，取两种价值的 $\max$ 转移即可。而 $v$ 点往下走的贡献可以继续 dfs 递归处理，处理之后即为 $f_v$。

该部分时间复杂度仍然为 $O(n)$。

因此总时间复杂度为 $O(n)$，可以通过。

```cpp
// #pragma GCC optimize(3,"Ofast","inline")
#include<bits/stdc++.h>
// #define int long long
using namespace std;
const int N=80010;
stack<int>stk;
set<int>Set[N];
vector<int>adj[N],adj2[N],scc[N];
int ind,idx,tot,instk[N],dfn[N],low[N],ins[N],deg[N];
void dfs(int u){
    dfn[u]=low[u]=++idx;
    stk.emplace(u);
    if(!deg[u])scc[++tot].emplace_back(u),Set[u].emplace(tot);
    for(auto &v:adj[u])
        if(dfn[v])low[u]=min(low[u],dfn[v]);
        else{
            dfs(v);
            low[u]=min(low[u],low[v]);
            if(low[v]>=dfn[u]){
                ++tot;
                int t;
                do{
                    t=stk.top();
                    stk.pop();
                    scc[tot].emplace_back(t);
                    Set[t].emplace(tot);
                }while(t!=v);
                scc[tot].emplace_back(u);
                Set[u].emplace(tot);
            }
        }
}
int f[N],n,m,g[N],h[N];
//f[i] 表示 i 为根的子仙人掌中，最长的路径长度是多少
//g[i] 表示 i 为根的子仙人掌里，最多可以往下走多少然后再返回 i
void dfs(int u,int fa){
    int okk=0;
    if(u>n){
        for(int &v:adj2[u])
            if(v!=fa){
                dfs(v,u);
                g[u]+=g[v]+1;
                ++okk;
            }
    }else{
        for(int &v:adj2[u])
            if(v!=fa){
                dfs(v,u);
                if(v>n)g[u]+=g[v]+1,++okk;
            }
    }
}
int up[N];
void dfs0(int u,int fa){
    up[u]=fa;
    for(int &v:adj2[u])
        if(v!=fa)dfs0(v,u);
}
int wtx[N],ufo[N];
void dfs2(int u,int fa){
    if(u<=n)f[u]=g[u];
    ufo[u]=1;
    for(int &v:adj2[u])
        if(v!=fa){
            ufo[v]=1;
            if(v<=n){
                dfs2(v,u);
                f[u]=max(f[u],f[v]+g[u]+1);
            }
            else{
                vector<int>ring;
                int id=-1;
                for(int i=0;i<scc[v-n].size();++i)
                    if(scc[v-n][i]==u){
                        id=i;
                        break;
                    }
                assert(~id);
                for(int i=1;i<scc[v-n].size();++i){
                    id=(id+1)%scc[v-n].size();
                    ring.emplace_back(scc[v-n][id]);
                }
                assert(ring.size()>1);
                vector<int>pre(ring.size()+1,0),suf(ring.size()+1,0);
                pre[0]=g[ring[0]]+1;
                for(int i=1;i<ring.size();++i)pre[i]=pre[i-1]+g[ring[i]]+1;
                suf[ring.size()]=0;
                for(int i=ring.size()-1;~i;--i)suf[i]=suf[i+1]+g[ring[i]]+1;
                suf[ring.size()]=0;
                for(int i=0;i<ring.size();++i){
                    assert(u!=ring[i]);
                    int x=max(i?pre[i-1]:0,suf[i+1]);
                    dfs2(ring[i],v);
                    f[u]=max(f[u],g[u]-g[v]+x+f[ring[i]]);
                }
            }
        }
}
int fa[N];
int find(int x){
    return x==fa[x]?x:fa[x]=find(fa[x]);
}
signed main(){
    cin.tie(0)->sync_with_stdio(false);
    cin>>n>>m;
    for(int i=0;i<m;++i){
        int a,b;cin>>a>>b;
        adj[a].emplace_back(b);
        adj[b].emplace_back(a);
        ++deg[a],++deg[b];
    }
    ind=n;
    for(int i=1;i<=n;++i)
        if(!dfn[i])dfs(i);
    for(int i=1;i<=tot;++i)
        if(scc[i].size()>2){
            ++ind;
            for(int &j:scc[i]){
                adj2[j].emplace_back(ind);
                adj2[ind].emplace_back(j);
            }
        }else{
            ++ind;
            int a=scc[i][0],b=scc[i][1];
            adj2[a].emplace_back(b);
            adj2[b].emplace_back(a);
        }
    dfs(1,0);
    dfs2(1,0);
    cout<<f[1]<<'\n';
    return 0;
}
```

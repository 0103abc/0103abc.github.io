---
title: "CF1481D AB Graph 题解"
date: "2024-10-18T06:31:37.000Z"
link: "luogu-5ppxjs2b"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造"]
draft: false
---

~~史中食~~

考虑巨大分类讨论（后面需要满足前面的不满足）：

+ $m=1$：输出任意一条边。
+ $m\equiv 1\pmod 2$ ：正反循环输出一条边。
+ $\exists x,y,a_{x,y}=a_{y,x}$：一直输出这一条边。
+ $n=2$：无解。
+ 找到任意一个三元环，若三条边相等则反复输出这三条边。
+ 否则必然存在两条连续的边相等，然后对 $m\bmod 3$ 的值分三类情况讨论：
  + 若 $m\equiv0\pmod 3$ 则构造 `abaabaabaaba` 或 `babbabbabbab`。
  + 若 $m\equiv1\pmod 3$ 则构造 `baabaabaab` 或 `abbabbabba`。
  + 若 $m\equiv2\pmod 3$ 则构造 `aabaabaabaabaa` 或 `bbabbabbabbabb`。

然后就做完了，但是代码很难写。

```cpp
#pragma GCC optimize(3)
#include<bits/stdc++.h>
#define int long long
#define eb emplace_back
#define pb push_back
using namespace std;
char a[2010][2010];
signed main(){
    int T;
    cin>>T;
    int tc=T,ca=1;
    while(T--){
        int n,m;cin>>n>>m;
        for(int i=1;i<=n;++i)
        for(int j=1;j<=n;++j)
        cin>>a[i][j];
        // if(tc==320){
        //     ++ca;
        //     if(ca==58){
        //         cout<<n<<' '<<m<<'\n';
        //         for(int i=1;i<=n;++i,cout<<'\n')
        //         for(int j=1;j<=n;++j)cout<<a[i][j];
        //         return 0;
        //     }else continue;
        // }
        if(m==1)cout<<"YES\n1 2\n";
        else if(m&1){
            cout<<"YES\n";
            for(int i=1;i<=m/2+1;++i)cout<<"1 2 ";
            cout<<'\n';
        }else{
            int ok=0,X,Y;
            for(int i=1;i<n;++i)
            for(int j=i+1;j<=n;++j)
            if(a[i][j]==a[j][i]){
                ok=1;
                X=i,Y=j;
                goto ee;
            }ee:;
            if(ok){
                cout<<"YES\n";
                for(int i=1;i<=m/2;++i)cout<<X<<' '<<Y<<' ';
                cout<<X;
                cout<<'\n';
            }else{
                if(n>2){
                    cout<<"YES\n";
                    char x1=a[1][2],x2=a[2][3],x3=a[3][1];
                    if(x1==x2&&x1==x3){
                        for(int i=0;i<=m;++i){
                            if(i%3==0)cout<<"1 ";
                            else if(i%3==1)cout<<"2 ";
                            else cout<<"3 ";
                        }
                        cout<<'\n';
                        continue;
                    }
                    int cnv=0;
                    if(x1=='a')++cnv;
                    if(x2=='a')++cnv;
                    if(x3=='a')++cnv;
                    if(cnv<2){
                        if(x1=='a')x1='b';else x1='a';
                        if(x2=='a')x2='b';else x2='a';
                        if(x3=='a')x3='b';else x3='a';
                    }
                    switch(m%3){
                    case 0:
                        if(x1=='a'&&x2=='b'){
                            for(int i=0;i<=m;++i){
                                if(i%3==0)cout<<"1 ";
                                else if(i%3==1)cout<<"2 ";
                                else cout<<"3 ";
                            }
                            cout<<'\n';
                        }
                        if(x2=='a'&&x3=='b'){
                            for(int i=0;i<=m;++i){
                                if(i%3==0)cout<<"2 ";
                                else if(i%3==1)cout<<"3 ";
                                else cout<<"1 ";
                            }
                            cout<<'\n';
                        }
                        if(x3=='a'&&x1=='b'){
                            for(int i=0;i<=m;++i){
                                if(i%3==0)cout<<"3 ";
                                else if(i%3==1)cout<<"1 ";
                                else cout<<"2 ";
                            }
                            cout<<'\n';
                        }
                        break;
                    case 2:
                        if(x1=='a'&&x2=='a'){
                            for(int i=0;i<=m;++i){
                                if(i%3==0)cout<<"1 ";
                                else if(i%3==1)cout<<"2 ";
                                else cout<<"3 ";
                            }
                            cout<<'\n';
                        }
                        if(x2=='a'&&x3=='a'){
                            for(int i=0;i<=m;++i){
                                if(i%3==0)cout<<"2 ";
                                else if(i%3==1)cout<<"3 ";
                                else cout<<"1 ";
                            }
                            cout<<'\n';
                        }
                        if(x3=='a'&&x1=='a'){
                            for(int i=0;i<=m;++i){
                                if(i%3==0)cout<<"3 ";
                                else if(i%3==1)cout<<"1 ";
                                else cout<<"2 ";
                            }
                            cout<<'\n';
                        }
                        break;
                    default:
                        if(x1=='b'&&x2=='a'){
                            for(int i=0;i<=m;++i){
                                if(i%3==0)cout<<"1 ";
                                else if(i%3==1)cout<<"2 ";
                                else cout<<"3 ";
                            }
                            cout<<'\n';
                        }
                        if(x2=='b'&&x3=='a'){
                            for(int i=0;i<=m;++i){
                                if(i%3==0)cout<<"2 ";
                                else if(i%3==1)cout<<"3 ";
                                else cout<<"1 ";
                            }
                            cout<<'\n';
                        }
                        if(x3=='b'&&x1=='a'){
                            for(int i=0;i<=m;++i){
                                if(i%3==0)cout<<"3 ";
                                else if(i%3==1)cout<<"1 ";
                                else cout<<"2 ";
                            }
                            cout<<'\n';
                        }
                    }
                }else{
                    cout<<"NO\n";
                }
            }
        }
    }
}
```

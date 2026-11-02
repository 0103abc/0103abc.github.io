---
title: "B4269 [朝阳区小学组 2019] square 题解"
date: "2025-03-26T07:54:23.000Z"
link: "luogu-nxuqv4yo"
categories: ["题解"]
tags: ["洛谷", "基础算法", "贪心", "模拟"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/nxuqv4yo)。

目前这题 C++ 题解全都可以被下面数据 hack：

```
1 100000000000000000
1 100000000000000000
1 100000000000000000
1 100000000000000000
1 100000000000000000
1 100000000000000000
1 100000000000000000
1 100000000000000000
1 100000000000000000
1 100000000000000000
```

所以这里提供一份可以通过数据和 hack 的 C++ 题解。

考虑贪心。很显然把一个边长为 $a$ 的正方形劈开一定不会更好，因此考虑贪心的在长方形中选取最大的正方形。发现这就是辗转相除法，因此直接按辗转相除法模拟即可。时间复杂度为 $O(T\log n)$ 其中 $T=10$ 为数据组数。

给个图方便理解：

[![pEDUHFx.png](https://s21.ax1x.com/2025/03/26/pEDUHFx.png)](https://imgse.com/i/pEDUHFx)

笑点解析：不开 unsigned long long 拿 $30$，时间复杂度错了拿 $100$。

```cpp
// #pragma GCC optimize(3,"Ofast","inline")
#include<bits/stdc++.h>
#include<ext/pb_ds/assoc_container.hpp>
#define int long long
using namespace std;
const int N=4010;
signed main(){
    // freopen("1.out","w",stdout);
    cin.tie(0)->sync_with_stdio(false);
    for(int tc=0;tc<10;++tc){
        int a,b;cin>>a>>b;
        unsigned int sum=0;
        while(a&&b){
            if(a>b)swap(a,b);
            sum+=1ull*(b/a)*a;b%=a;
        }
        cout<<sum<<'\n';
    }
}
```

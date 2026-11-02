---
title: "P10871 [COTS 2022] 皇后  Kraljice 题解"
date: "2025-12-04T09:31:59.000Z"
link: "luogu-mpsodijc"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造", "数学", "线性代数"]
draft: false
---

打表可以发现，在 $n\neq 2$ 时：

+ 若 $2\mid n$，则答案为 $n^2-2$。
+ 若 $2\nmid n$，则答案为 $n^2$。

特判掉 $n\le 2$ 的情况，然后容易想到奇偶分类讨论。

+ $2\nmid n$

考虑沿用 P14158 三角形的构造套路，从 $n-2$ 的答案倒推出 $n$ 的答案。容易想到对于 $n$ 的情况，先构造出右上角的一个图案：

```
...
...
 ..
```

这样剩下两个长度为 $2\times 2k$ 的矩形。矩形的构造是相对简单的，直接分奇偶轮流构造即可。而对于右上角的情况可以直接打表得出构造方案。

最后推到 $n=1$ 的情况即可。

+ $2\mid n$

因为 $n=2$ 的情况太神秘了，所以考虑只推到 $n=4$ 然后对 $4\times 4$ 的矩阵构造。前面倒推的部分和 $2\nmid n$ 的情况相同，对于最后 $n=4$ 的构造可以直接手模，这里给出一个 $14$ 个皇后的构造方案：

```cpp line-number
cout<<1<<' '<<1<<'\n';
cout<<2<<' '<<3<<'\n';
cout<<1<<' '<<2<<'\n';
cout<<3<<' '<<2<<'\n';
cout<<2<<' '<<1<<'\n';
cout<<4<<' '<<1<<'\n';
cout<<4<<' '<<4<<'\n';
cout<<3<<' '<<3<<'\n';
cout<<1<<' '<<3<<'\n';
cout<<3<<' '<<1<<'\n';
cout<<3<<' '<<4<<'\n';
cout<<4<<' '<<3<<'\n';
cout<<2<<' '<<4<<'\n';
cout<<2<<' '<<2<<'\n';
```

完整代码：

```cpp
#include<iostream>
#include<algorithm>
#include<vector>

using namespace std;

const long long inf=1e18;
const int N=500010;

int main()
{
	ios_base::sync_with_stdio(false);
	cin.tie(nullptr);
	int n;
	cin>>n;
	if(n<=2)
	{
		cout<<1<<'\n'<<1<<' '<<1<<'\n';
		return 0;
	}
	if(n%2==1)
	{
		cout<<n*n<<'\n';
		for(int i=n;i>1;i-=2)
		{
			cout<<i<<' '<<i<<'\n';
			cout<<i-1<<' '<<i-2<<'\n';
			cout<<i<<' '<<i-1<<'\n';
			cout<<i-2<<' '<<i-1<<'\n';
			cout<<i-1<<' '<<i-1<<'\n';
			cout<<i<<' '<<i-2<<'\n';
			cout<<i-2<<' '<<i<<'\n';
			cout<<i-1<<' '<<i<<'\n';
			for(int j=i-3,op=0;j;--j,op^=1)
			{
				if(op)
				{
					cout<<i<<' '<<j<<'\n';
					cout<<i-1<<' '<<j<<'\n';
					cout<<j<<' '<<i-1<<'\n';
					cout<<j<<' '<<i<<'\n';
				}
				else
				{
					cout<<i-1<<' '<<j<<'\n';
					cout<<i<<' '<<j<<'\n';
					cout<<j<<' '<<i<<'\n';
					cout<<j<<' '<<i-1<<'\n';
				}
			}
		}
		cout<<1<<' '<<1<<'\n';
	}
	else
	{
		cout<<n*n-2<<'\n';
		for(int i=n;i>4;i-=2)
		{
			cout<<i<<' '<<i<<'\n';
			cout<<i-1<<' '<<i-2<<'\n';
			cout<<i<<' '<<i-1<<'\n';
			cout<<i-2<<' '<<i-1<<'\n';
			cout<<i-1<<' '<<i-1<<'\n';
			cout<<i<<' '<<i-2<<'\n';
			cout<<i-2<<' '<<i<<'\n';
			cout<<i-1<<' '<<i<<'\n';
			for(int j=i-3,op=0;j;--j,op^=1)
			{
				if(op)
				{
					cout<<i<<' '<<j<<'\n';
					cout<<i-1<<' '<<j<<'\n';
					cout<<j<<' '<<i-1<<'\n';
					cout<<j<<' '<<i<<'\n';
				}
				else
				{
					cout<<i-1<<' '<<j<<'\n';
					cout<<i<<' '<<j<<'\n';
					cout<<j<<' '<<i<<'\n';
					cout<<j<<' '<<i-1<<'\n';
				}
			}
		}
		cout<<1<<' '<<1<<'\n';
		cout<<2<<' '<<3<<'\n';
		cout<<1<<' '<<2<<'\n';
		cout<<3<<' '<<2<<'\n';
		cout<<2<<' '<<1<<'\n';
		cout<<4<<' '<<1<<'\n';
		cout<<4<<' '<<4<<'\n';
		cout<<3<<' '<<3<<'\n';
		cout<<1<<' '<<3<<'\n';
		cout<<3<<' '<<1<<'\n';
		cout<<3<<' '<<4<<'\n';
		cout<<4<<' '<<3<<'\n';
		cout<<2<<' '<<4<<'\n';
		cout<<2<<' '<<2<<'\n';
	}
	return 0;
}
```

~~（别问为什么缺省源没了，问就是没有电脑拿不到缺省源）~~

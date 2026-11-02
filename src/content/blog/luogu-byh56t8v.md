---
title: "CF1411F The Thorny Path 题解"
date: "2026-02-26T02:15:21.000Z"
link: "luogu-byh56t8v"
categories: ["题解"]
tags: ["Codeforces", "数学", "博弈"]
draft: false
---

三千的奥义，巴巴的博弈

拆分方案一定是若干个 $3$ 加上 $O(1)$ 个 $2$ 或者 $4$。不难验证 $n$ 比较小的情况，而对 $n$ 较大的情况，$3 \times 3 > 2 \times 2 \times 2$，则拆出 $3$ 总是更优的。

因此我们可以分类讨论：

1. $n = 3k$，先考虑拆出若干个 $3$ 的次数，然后直接设余数为 $1, 2$ 的元素各有 $x, y$ 个，那么有 $\min(x, y)$ 对 $(1, 2)$ 用一次操作抵消，再加上剩下的 $1$ 或 $2$ 的操作次数即可；
2. $n = 3k + 2$，考虑这个 $2$ 可能是两个余数为 $1$ 的元素或者 $1$ 个余数为 $2$ 的元素造出来的，那么分别枚举这两种可能，规约成 $n = 3k$ 的问题；
3. $n = 3k + 1$，若拆出的元素有 $4$，那么枚举 $4$ 是怎么来的，规约成 $n = 3k$ 的问题；否则两个 $2$ 可能由四个余数为 $1$，或两个余数为 $1$、一个余数为 $2$，或两个余数为 $2$ 的元素组成。分别枚举这几种情况，也可以把原问题规约成 $n = 3k$ 的问题。

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) (x & (-x))
using namespace std;

const int N = 1000010, mod = 1e9 + 7;
int T, n, p[N];

inline void sol()
{
	cin >> n;
	for(int i = 1; i <= n; ++i) cin >> p[i];
	
	// 提取出所有的块
	vector < bool > vis(n + 1); vector < int > tmp;
	for(int i = 1, j = 0; i <= n; ++i)
	{
		j = i;
		if(!vis[j]) tmp.push_back(0);
		while(!vis[j]) ++tmp.back(), vis[j] = true, j = p[j];
	}
	
	if(n % 3 == 0)
	{
		int t = 1, ans = 0;
		for(int i = 1; i <= n / 3; ++i) t = t * 3ll % mod;
		int cnt[3] = {0, 0, 0};
		for(int x : tmp) ans += (x - 1) / 3, ++cnt[x % 3];
		ans += min(cnt[1], cnt[2]);
		ans += (cnt[1] - min(cnt[1], cnt[2])) / 3 * 2;
		ans += (cnt[2] - min(cnt[1], cnt[2]));
		cout << t << " " << ans << '\n';
	}
	else if(n % 3 == 1)
	{
		bool flag = false; // tmp 记录有没有 >= 4 的余 1 元素 
		for(int x : tmp) if(x % 3 == 1 && x != 1) flag = true;
		int t = 4, ans = INT_MAX;
		for(int i = 1; i <= (n - 4) / 3; ++i) t = t * 3ll % mod;
		
		function < int () > A = [&]()
		{
			int cnt[3] = {0, 0, 0}, ans = 0; bool tag = false;
			for(int x : tmp)
			{
				if(x % 3 == 1 && x != 1 && !tag)
				{
					ans += (x - 4) / 3;
					tag = true;
				}
				else ans += (x - 1) / 3, ++cnt[x % 3];
			}
			ans += min(cnt[1], cnt[2]);
			ans += (cnt[1] - min(cnt[1], cnt[2])) / 3 * 2;
			ans += (cnt[2] - min(cnt[1], cnt[2]));
			return ans;
		};
		function < int () > B = [&]()
		{
			int cnt[3] = {0, 0, 0}, ans = 0;
			for(int x : tmp) ans += (x - 1) / 3, ++cnt[x % 3];
			if(cnt[2] < 2) return INT_MAX; cnt[2] -= 2;
			ans += min(cnt[1], cnt[2]);
			ans += (cnt[1] - min(cnt[1], cnt[2])) / 3 * 2;
			ans += (cnt[2] - min(cnt[1], cnt[2]));
			return ans;
		};
		function < int () > C = [&]()
		{
			int cnt[3] = {0, 0, 0}, ans = 0;
			for(int x : tmp) ans += (x - 1) / 3, ++cnt[x % 3];
			if(cnt[1] < 4) return INT_MAX; cnt[1] -= 4, ans += 2;
			ans += min(cnt[1], cnt[2]);
			ans += (cnt[1] - min(cnt[1], cnt[2])) / 3 * 2;
			ans += (cnt[2] - min(cnt[1], cnt[2]));
			return ans;
		};
		function < int () > D = [&]()
		{
			int cnt[3] = {0, 0, 0}, ans = 0;
			for(int x : tmp) ans += (x - 1) / 3, ++cnt[x % 3];
			if(cnt[1] < 1 || cnt[0] < 1) return INT_MAX; --cnt[1], --cnt[0], ++ans;
			ans += min(cnt[1], cnt[2]);
			ans += (cnt[1] - min(cnt[1], cnt[2])) / 3 * 2;
			ans += (cnt[2] - min(cnt[1], cnt[2]));
			return ans;
		};
		function < int () > E = [&]()
		{
			int cnt[3] = {0, 0, 0}, ans = 0;
			for(int x : tmp) ans += (x - 1) / 3, ++cnt[x % 3];
			if(cnt[2] < 1 || cnt[1] < 2) return INT_MAX; --cnt[2], cnt[1] -= 2, ++ans;
			ans += min(cnt[1], cnt[2]);
			ans += (cnt[1] - min(cnt[1], cnt[2])) / 3 * 2;
			ans += (cnt[2] - min(cnt[1], cnt[2]));
			return ans;
		};
		if(flag) ans = min(ans, A()); // 直接从一个余 1 的里面拆出一个 4 
		ans = min(ans, B()); // 拿出两个余 2 的元素 
		ans = min(ans, C()); // 拿出四个余 1 的 
		ans = min(ans, D()); // 拿出一个余 3 和一个余 1 的 
		ans = min(ans, E()); // 拿出一个余 2 和两个余 1 的 
		
		cout << t << " " << ans << '\n';
	}
	else
	{
		int t = 2, ans = 0;
		for(int i = 1; i <= (n - 2) / 3; ++i) t = t * 3ll % mod;
		
		int cnt[3] = {0, 0, 0};
		for(int x : tmp) ans += (x - 1) / 3, ++cnt[x % 3];
		function < int () > F11 = [&]()
		{
			if(cnt[1] < 2) return INT_MAX;
			int res = 0;
			res += min(cnt[1] - 2, cnt[2]);
			res += (cnt[1] - 2 - min(cnt[1] - 2, cnt[2])) / 3 * 2;
			res += (cnt[2] - min(cnt[1] - 2, cnt[2]));
			return res + 1;
		};
		function < int () > F2 = [&]()
		{
			if(cnt[2] < 1) return INT_MAX;
			int res = 0;
			res += min(cnt[1], cnt[2] - 1);
			res += (cnt[1] - min(cnt[1], cnt[2] - 1)) / 3 * 2;
			ans += (cnt[2] - 1 - min(cnt[1], cnt[2] - 1));
			return res;
		};
		ans += min(F11(), F2());
		
		cout << t << " " << ans << '\n';
	}
}

int main()
{
	#ifdef LOCAL
//	freopen("text.in", "r", stdin);
//	freopen("prog.out", "w", stdout);
	#endif
	ios::sync_with_stdio(false);
	cin.tie(0), cout.tie(0);
	
	cin >> T;
	while(T--) sol();
	
	return 0;
}
/*
模 3 余 0：
必须拆成若干个 3，那么统计余数的个数即可 
模 3 余 1：
拆成 2 个 2 和一堆 3，或者一个 4 和一堆 3 
模 3 余 2：
拆成 1 个 2 和一堆 3 
*/
```

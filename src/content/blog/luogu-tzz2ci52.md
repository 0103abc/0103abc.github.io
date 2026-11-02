---
title: "CF1906C Cursed Game 题解"
date: "2026-03-04T08:45:05.000Z"
link: "luogu-tzz2ci52"
categories: ["题解"]
tags: ["Codeforces", "数学", "概率与期望", "算法思想", "构造"]
draft: false
---

用时：37 分 17 秒

这啥博弈啊！

我们发现最难的情况是 $n = 3$，且打表发现不存在三种棋盘组合可以稳定地通过所有可能纸带的情况。此时我们发现题目并没有说一次只能用 $3$ 个硬币，而是说 $333$ 次用 $999$ 个硬币，那么直接随机，期望用 $666$ 个硬币。

如果 $n \neq 3$，那么直接把 $(3, 3)$ 位置涂黑，这样纸带上的洞就都问出来了，直接根据纸带的情况构造一组解即可。

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) ((x) & (-(x)))
using namespace std;

const int N = 35;
mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int T = 333, n; bool s[N][N], t[N][N], b[3][3];

inline bool query()
{
	for(int i = 1; i <= n; ++i)
	{
		for(int j = 1; j <= n; ++j)
			cout << s[i][j];
		cout << '\n';
	}
	cout.flush();
	string str; cin >> str;
	if(str == "INCORRECT")
	{
		char c;
		for(int i = 1; i <= n - 2; ++i)
			for(int j = 1; j <= n - 2; ++j)
				cin >> c, t[i][j] = c - '0';
		return false;
	}
	else return true;
}
inline bool check(int x, int y)
{
	bool ans = false;
	for(int i = 0; i <= 2; ++i)
		for(int j = 0; j <= 2; ++j)
			if(b[i][j])
				ans ^= s[x + i][y + j];
	return ans;
}

inline void sol()
{
	cin >> n;
	if(n == 3)
	{
		while(true)
		{
			for(int i = 1; i <= 3; ++i)
				for(int j = 1; j <= 3; ++j)
					s[i][j] = rnd() % 2;
			if(query()) return ;
		}
	}
	else
	{
		for(int i = 1; i <= n; ++i)
			for(int j = 1; j <= n; ++j)
				s[i][j] = t[i][j] = false;
		s[3][3] = true;
		if(query()) return ;
		s[3][3] = false;
		int lst_x = 0, lst_y = 0;
		for(int i = 0; i < 3; ++i)
		{
			for(int j = 0; j < 3; ++j)
			{
				b[i][j] = t[3 - i][3 - j];
				if(b[i][j]) lst_x = i, lst_y = j;
			}
		}
		for(int i = 1; i <= n; ++i)
		{
			for(int j = 1; j <= n; ++j)
			{
				int px = i - lst_x, py = j - lst_y;
				if(1 <= min(px, py) && max(px, py) <= n - 2 && check(px, py) == false)
					s[i][j] = true;
			}
		}
		assert(query());
	}
}

int main()
{
	#ifndef LOCAL
//	freopen("color.in", "r", stdin);
//	freopen("color.out", "w", stdout);
	#endif
	#ifdef LOCAL
//	freopen("text.in", "r", stdin);
//	freopen("prog.out", "w", stdout);
	#endif
	ios::sync_with_stdio(false);
	cin.tie(0), cout.tie(0);
	
	while(T--) sol();
	
	return 0;
}
/*
神经病诈骗题，n = 3 直接随机（期望两次操作） 
否则一次问出纸板的信息，然后考虑构造 
*/
```

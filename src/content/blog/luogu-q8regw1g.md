---
title: "CF1344F Piet's Palette 题解"
date: "2026-02-26T07:47:34.000Z"
link: "luogu-q8regw1g"
categories: ["题解"]
tags: ["Codeforces", "数学", "线性代数"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/q8regw1g)。

尝试刻画题目的条件，不难想到混合操作就是值域在 $[0, 3]$ 中的数的异或。

又由于只有两个数位，我们可以拆开看它们并设为 $2n$ 个布尔变量。不失一般性地，设白、红、黄、蓝分别对应矩阵 $\begin{bmatrix}0 & 0 \end{bmatrix}$，$\begin{bmatrix}0 & 1 \end{bmatrix}$，$\begin{bmatrix}1 & 0 \end{bmatrix}$，$\begin{bmatrix}1 & 1 \end{bmatrix}$，则三种变换操作相当于在模 $2$ 意义下给每个矩阵乘了一个 $2 \times 2$ 的矩阵。

矩阵乘法有结合律，我们可以维护出每个矩阵的懒标记，这样就实时计算出了 $2n$ 个布尔变量中每个变量在每个方程中的系数。最后解一遍异或方程即可，不难用 bitset 优化到 $O(\frac{n^2k}{\omega})$。

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) ((x) & (-(x)))
using namespace std;

const int N = 1010;
int n, m, cnt; bool f[N][2][2];
bitset < N * 2 > g[N * 2], ans;

int main()
{
	#ifdef LOCAL
//	freopen("text.in", "r", stdin);
//	freopen("prog.out", "w", stdout);
	#endif
	ios::sync_with_stdio(false);
	cin.tie(0), cout.tie(0);
	
	cin >> n >> m;
	for(int i = 1; i <= n; ++i) f[i][0][0] = f[i][1][1] = true;
	// f[p][x][y] 表示当前第 p 个数的第 x 位有多少来自初始第 y 位的贡献 
	for(int i = 1; i <= m; ++i)
	{
		string str; int k; cin >> str >> k;
		if(str == "mix")
		{
			// cnt + 1 是第 0 位的方程，cnt + 2 是第 1 位的方程 
			for(int i = 1, x; i <= k; ++i)
			{
				cin >> x;
				g[cnt + 1][x] = f[x][0][0], g[cnt + 1][x + n] = f[x][0][1];
				g[cnt + 2][x] = f[x][1][0], g[cnt + 2][x + n] = f[x][1][1];
			}
			char result; cin >> result;
			if(result == 'R' || result == 'B') g[cnt + 1][2 * n + 1] = 1;
			if(result == 'Y' || result == 'B') g[cnt + 2][2 * n + 1] = 1;
			cnt += 2;
		}
		else if(str == "RY")
		{
			for(int i = 1, x; i <= k; ++i)
				cin >> x, swap(f[x][0], f[x][1]);
		}
		else if(str == "YB")
		{
			for(int i = 1, x; i <= k; ++i)
			{
				cin >> x;
				for(int j : {0, 1}) f[x][0][j] ^= f[x][1][j];
			}
		}
		else if(str == "RB")
		{
			for(int i = 1, x; i <= k; ++i)
			{
				cin >> x;
				for(int j : {0, 1}) f[x][1][j] ^= f[x][0][j];
			}
		}
	}
	
	/*
	for(int i = 1; i <= cnt; ++i)
	{
		for(int j = 1; j <= 2 * n + 1; ++j)
			cerr << g[i][j];
		cerr << '\n';
	}
	*/
	
	for(int i = 1, st = 1; i <= 2 * n; ++i)
	{
		int ID = 0;
		for(int j = st; j <= cnt; ++j)
			if(g[j][i] == 1)
				{ID = j; break;}
		if(!ID) {for(int j = 1; j <= cnt; ++j) g[j][i] = 0; continue;}
		swap(g[ID], g[st]);
		for(int j = 1; j <= cnt; ++j)
			if(j != st && g[j][i] == 1)
				g[j] ^= g[st];
		++st;
	}
	for(int i = 1; i <= cnt; ++i)
	{
		bool flag = false;
		for(int j = 1; j <= 2 * n; ++j)
			if(g[i][j])
				ans[j] = g[i][2 * n + 1], flag = true;
		if(!flag && g[i][2 * n + 1]) {cout << "NO" << '\n'; return 0;}
	}
	
	cout << "YES" << '\n';
	for(int i = 1; i <= n; ++i)
	{
		int val = ans[i] + 2 * ans[i + n];
		switch(val)
		{
			case 0 : cout << '.'; break;
			case 1 : cout << 'R'; break;
			case 2 : cout << 'Y'; break;
			default : cout << 'B'; break;
		}
	}
	return 0;
}
/*

*/
```

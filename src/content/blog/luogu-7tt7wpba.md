---
title: "CF641F Little Artem and 2-SAT 题解"
date: "2026-03-02T13:58:21.000Z"
link: "luogu-7tt7wpba"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造", "图论", "最短路", "数学", "概率与期望"]
draft: false
---

考虑建出 2-SAT 图论模型并各跑一遍 floyd 算法求解有向图闭包传递问题。接下来分类讨论：

- 假设两张图的有解性不同，对有解的图直接构造一组解即可；
- 否则假设两张图的可达性完全一致，这两张图等价；
- 否则假设两张图的已经被确定的变量之间发生了冲突，或者已经被确定的变量集合不一致，容易构造出仅满足一个图的解；
- 否则一定存在两个不相同且没有被确定的元素 $i, j$ 满足在第一张图中有可达性 $i \to j'$ 且 $j \to i'$ 而第二张图都没有。此时钦定 $i, j$ 为真，由于 $i, j$ 都没有被确定且第二张图不存在 $i \to j'$ 或 $j \to i'$，那么 $i, j$ 为真，$i', j'$ 为假的限制仅仅会让第一张图无解，不影响第二张图的有解性。

注意实现时一定要判断清楚哪些元素是已经被确定的，否则有概率在第 110 组数据出错。

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) ((x) & (-(x)))
using namespace std;

const int N = 1005;
inline void similar() {cout << "SIMILAR" << '\n'; exit(0);}
int n, m[2]; bitset < N * 2 > f[2][N * 2];

int dfn[N * 2], low[N * 2], sta[N * 2], top, bel[N * 2], scc, df_sign, at[N * 2], tag[N * 2];
inline void tarjan(int ID, int pos)
{
	dfn[pos] = low[pos] = ++df_sign; sta[++top] = pos; tag[pos] = true;
	for(int to = 1; to <= 2 * n; ++to)
	{
		if(!f[ID][pos][to]) continue;
		if(!dfn[to]) tarjan(ID, to), low[pos] = min(low[pos], low[to]);
		else if(tag[to]) low[pos] = min(low[pos], dfn[to]);
	}
	if(dfn[pos] == low[pos])
	{
		++scc; sta[top + 1] = 0;
		while(sta[top + 1] != pos)
		{
			tag[sta[top]] = false;
			bel[sta[top]] = scc;
			--top;
		}
	}
}

inline void take(int ID)
{
	/*
	cerr << "take " << ID << '\n';
	for(int i = 1; i <= 2 * n; ++i)
	{
		for(int j = 1; j <= 2 * n; ++j)
			cerr << f[ID][i][j];
		cerr << '\n';
	}
	*/
	for(int i = 1; i <= 2 * n; ++i) if(!dfn[i]) tarjan(ID, i);
	function < bool (int, int) > cmp = [&](int x, int y) {return bel[x] < bel[y];};
	for(int i = 1; i <= 2 * n; ++i) at[i] = i;
	sort(at + 1, at + 2 * n + 1, cmp);
	vector < bool > vis(n + 1), ans(n + 1);
	for(int i = 1; i <= 2 * n; ++i)
	{
		int j = at[i]; if(j > n) j -= n;
		if(!vis[j])
		{
			vis[j] = true;
			ans[j] = (at[i] > n);
		}
	}
	for(int i = 1; i <= n; ++i) cout << ans[i] << " "; cout << '\n';
}

bool sure[2][N * 2];

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
	
	cin >> n; for(int i = 0; i <= 1; ++i) cin >> m[i];
	function < void (int) > floyd = [&](int ID)
	{
		for(int k = 1; k <= 2 * n; ++k)
			for(int i = 1; i <= 2 * n; ++i)
				if(f[ID][i][k])
					f[ID][i] |= f[ID][k];
	};
	for(int ID = 0; ID <= 1; ++ID)
	{
		// 建图 
		for(int i = 1; i <= m[ID]; ++i)
		{
			int tp_x, tp_y, x, y; cin >> x >> y;
			tp_x = (x > 0), x = abs(x), tp_y = (y > 0), y = abs(y);
			if(x == y && tp_x == tp_y) f[ID][x + (1 - tp_x) * n][x + tp_x * n] = 1;
			else if(x != y) f[ID][x + (1 - tp_x) * n][y + tp_y * n] = f[ID][y + (1 - tp_y) * n][x + tp_x * n] = 1;
		}
		
		// 传递闭包 
		floyd(ID);
	}
	
	/*
	for(int ID = 0; ID <= 1; ++ID)
	{
		cerr << "ID : " << ID << '\n';
		for(int i = 1; i <= 2 * n; ++i)
		{
			for(int j = 1; j <= 2 * n; ++j)
				cerr << f[ID][i][j];
			cerr << '\n';
		}
	}
	*/
	
	// 判断有无解，之后对每个元素进行判断 
	bool flag = false, ok[2] = {true, true};
	for(int i = 1; i <= n; ++i)
		for(int j = 0; j <= 1; ++j)
			if(f[j][i][i + n] && f[j][i + n][i])
				ok[j] = false;
	
	int type = 0; vector < bool > vis(2 * n + 1);
	function < void (int, int) > dfs = [&](int ID, int pos)
	{
		sure[ID][(pos <= n) ? pos : pos - n] = true;
		vis[pos] = true;
		for(int to = 1; to <= n; ++to)
		{
			if(!f[ID][pos][to]) continue;
			if(!vis[to]) dfs(ID, to);
		}
	};
	for(int i = 0; i <= 1; ++i)
	{
		fill(vis.begin(), vis.end(), 0);
		for(int j = 1; j <= n; ++j)
		{
			if(f[i][j][j + n]) dfs(i, j + n);
			if(f[i][j + n][j]) dfs(i, j);
		}
	}
	
	if(ok[0] && ok[1])
	{
		for(int i = 1; i <= 2 * n; ++i)
		{
			int pi = i;
			if(i <= n) pi += n; else pi -= n;
			for(int ID = 0; ID <= 1; ++ID)
			{
				if(!flag && f[ID][i][pi] && !f[ID ^ 1][i][pi])
				{
//					cerr << "--> " << ID << " " << i << " " << pj << '\n';
					flag = true; type = 1;
					for(int tp = 0; tp <= 1; ++tp) f[tp][pi][i] = 1;
				}
				if(!flag && sure[ID][i] && sure[ID ^ 1][pi])
				{
					flag = true; type = 1;
					for(int tp = 0; tp <= 1; ++tp) f[tp][pi][i] = 1;
				}
			}
		}
		for(int i = 1; i <= 2 * n; ++i)
		{
			int pi = i;
			if(i <= n) pi += n; else pi -= n;
			for(int j = 1; j <= 2 * n; ++j)
			{
				int pj = j;
				if(j <= n) pj += n; else pj -= n;
				for(int ID = 0; ID <= 1; ++ID)
				{
					if(i != pj && !flag && f[ID][i][pj] && !f[ID ^ 1][i][pj])
					{
//						cerr << "--> " << ID << " " << i << " " << pj << '\n';
						flag = true; type = 2;
						for(int tp = 0; tp <= 1; ++tp) f[tp][pi][i] = f[tp][pj][j] = 1;
					}
				}
			}
		}
	}
	
	// 再次传递闭包 
	for(int i = 0; i <= 1; ++i) floyd(i);
	for(int i = 1; i <= n; ++i)
		for(int j = 0; j <= 1; ++j)
			if(f[j][i][i + n] && f[j][i + n][i])
				ok[j] = false;
	
//	cerr << "ok : "; for(int i = 0; i <= 1; ++i) cerr << ok[i] << " "; cerr << '\n';
//	if(type == 2 && !ok[0] && !ok[1]) assert(0);
	
	if(!ok[0] && !ok[1]) similar();
	else if(!flag && ok[0] && ok[1]) similar();
	else if(ok[0]) take(0);
	else take(1);
	
	return 0;
}
/*

*/
```

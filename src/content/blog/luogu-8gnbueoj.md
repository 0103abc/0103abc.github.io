---
title: "CF1381D The Majestic Brown Tree Snake 题解"
date: "2026-02-26T06:47:10.000Z"
link: "luogu-8gnbueoj"
categories: ["题解"]
tags: ["Codeforces", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/8gnbueoj)。

有点奇怪的题，想到了很多题解需要用到的结论但是就是导不出一个形式化做法...

考虑一颗 $4$ 个节点的虚树 $x-a, x-b, x-c$，假设这三条边对应到原树的长度都不小于蛇的长度，那么蛇头 / 尾一旦到达 $x$ 点，就可以完成掉头。

不难发现可能的 $x$ 点有多个，但是蛇能到达 $x_1$ 和蛇能到达 $x_2$ 是完全等价的，因此我们可以以某个 $x$ 为根，然后不断令蛇头 / 尾进行如下操作：

- 找到子树内最深的节点，并移动到那里。

若 $n$ 次此类移动中出现了蛇的一端是另一端祖先的情况即合法。否则不难发现永远无法移动到根，即为非法。

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) ((x) & (-(x)))
using namespace std;

const int N = 100010;
int T, n, st, ed, len; vector < int > tr[N];

int fa[N][22];

inline void sol()
{
	cin >> n >> st >> ed;
	
	// 初始化 
	for(int i = 1; i <= n; ++i) tr[i].clear();
	for(int i = 1, x, y; i < n; ++i)
	{
		cin >> x >> y;
		tr[x].push_back(y);
		tr[y].push_back(x);
	}
	
	function < int (int, int, int) > get_dist = [&](int pos, int prt, int goal)
	{
		if(pos == goal) return 1;
		for(int to : tr[pos])
		{
			if(to == prt) continue;
			int current = get_dist(to, pos, goal);
			if(current) return current + 1;
		}
		return 0;
	}; len = get_dist(st, 0, ed);
	
	vector < int > f(n + 1), g(n + 1), w(n + 1);
	function < void (int, int) > treedp_A = [&](int pos, int prt)
	{
		f[pos] = 1;
		for(int to : tr[pos])
		{
			if(to == prt) continue;
			treedp_A(to, pos), f[pos] = max(f[pos], f[to] + 1);
		}
	}; treedp_A(1, 0);
	function < void (int, int) > treedp_B = [&](int pos, int prt)
	{
		int mx[2] = {0, 0};
		for(int to : tr[pos])
		{
			if(to == prt) continue;
			w[pos] += (f[to] >= len - 1);
			if(f[to] + 1 > mx[0]) mx[1] = mx[0], mx[0] = f[to] + 1;
			else if(f[to] + 1 > mx[1]) mx[1] = f[to] + 1;
		}
		for(int to : tr[pos])
		{
			if(to == prt) continue;
			if(f[to] + 1 == mx[0]) g[to] = max(mx[1], g[pos] + 1);
			else g[to] = max(mx[0], g[pos] + 1);
			w[to] += (g[to] >= len - 1);
			treedp_B(to, pos);
		}
	}; treedp_B(1, 0);
	
	int rt = 0; // 找出一个关键节点 
	for(int i = 1; i <= n; ++i) if(w[i] >= 3) rt = i;
	if(!rt) {cout << "NO" << '\n'; return ;}
	
	vector < int > dep(n + 1), bot(n + 1); // bot 记录最深的节点 
	function < void (int, int) > init = [&](int pos, int prt)
	{
		memset(fa[pos], 0, sizeof(fa[pos]));
		dep[pos] = dep[prt] + 1;
		fa[pos][0] = prt, bot[pos] = pos;
		for(int i = 1; ; ++i)
		{
			if(fa[fa[pos][i - 1]][i - 1]) fa[pos][i] = fa[fa[pos][i - 1]][i - 1];
			else break;
		}
		for(int to : tr[pos])
		{
			if(to == prt) continue;
			init(to, pos);
			if(dep[bot[to]] > dep[bot[pos]]) bot[pos] = bot[to];
		}
	}; init(rt, 0);
	function < int (int, int) > jump = [&](int pos, int dist)
	{
		while(dist) pos = fa[pos][__lg(lowbit(dist))], dist -= lowbit(dist);
		return pos;
	};
	function < int (int, int) > LCA = [&](int x, int y)
	{
		if(dep[x] < dep[y]) swap(x, y);
		while(dep[x] > dep[y]) x = fa[x][__lg(lowbit(dep[x] - dep[y]))];
		if(x == y) return x;
		for(int i = 20; i >= 0; --i)
			if(fa[x][i] != fa[y][i])
				x = fa[x][i], y = fa[y][i];
		return fa[x][0];
	};
	
	for(int i = 1; i <= n; ++i)
	{
		int lca = LCA(st, ed), goal = bot[st];
		if(lca == st || lca == ed) {cout << "YES" << '\n'; return ;}
		if(dep[goal] - dep[st] >= dep[ed] - dep[lca]) {cout << "YES" << '\n'; return ;}
		ed = jump(ed, dep[goal] - dep[st]), st = goal, swap(st, ed);
	}
	cout << "NO" << '\n';
}

int main()
{
	#ifdef LOCAL
	freopen("text.in", "r", stdin);
	freopen("prog.out", "w", stdout);
	#endif
	ios::sync_with_stdio(false);
	cin.tie(0), cout.tie(0);
	
	cin >> T;
	while(T--) sol();
	
	return 0;
}
/*

*/
```

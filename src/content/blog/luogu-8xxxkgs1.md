---
title: "P15416 「yrOI R1」夏日已逝 题解"
date: "2026-02-24T02:13:12.000Z"
link: "luogu-8xxxkgs1"
categories: ["题解"]
tags: ["洛谷", "图论", "树", "算法思想", "构造"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/8xxxkgs1)。

在构造答案之前，我们先需要会判断有无解。一个直接的观察是直径只变长不变短，那么如果初始直径长于最终直径，我们直接声称无解，否则在构造的过程中判断有无解。

一些提示和声明：

- 定义 $p$ 的子树的高度为其内部节点的最大深度（以 $dep_p = 1$ 为标准）。
- 我们认为树是动态变化的。下文所称的树和直径均不表示初始树或对应直径，而是构造过程中的。$len$ 表示直径的长度，直径的范围为 $[1, len]$。

### 1. 把子树拆分成链

考虑一个直径，其上面挂有很多子树。我们可以把这棵子树在这个直径上随意地滑动，但是若我们不想增加这条直径的长度，则高度为 $h$ 的子树的移动范围只能是直径的 $[h + 1, len - h]$ 部分。不难发现，在 $(h + 1, len - h)$ 的位置上，我们无法对这棵子树有进一步的操作，而在 $h + 1$ 或 $len - h$ 这两个位置，我们可以把子树中从根开始的最长链当作直径的一部分，这些链上附着的子树可以被移动到初始的直径上。

由于上述过程可逆，我们可以无压力地把子树拆成尽可能多的链而不影响正确性。根据上述过程，拆分的过程形如长链剖分的过程，则我们拆完子树之后，整棵树形如一条直径上挂了若干条链，此时的有解性和初始时是一样的。

### 2. 扩展直径

可能会出现 $len$ 小于最终直径的情况以及我们拆出来的链不能拼成最终树的情况。此时我们需要注意到，我们可以通过把长度为 $h$ 的链移动到位置 $h$ 或者位置 $len - h + 1$，从而把链的长度“变成”$h - 1$，并给直径加上 $1$（原来的链变为直径的一部分，原来直径的一段变为挂在直径上的链）。因此我们需要做的是形如这样的一个子问题：

> 你有 $n$ 个元素 $a_1, a_2, \dots, a_n$ 以及 $m$ 个元素 $b_1, b_2, \dots, b_m$。你可以做如下操作任意次：
>
> - 选择 $i$，使得 $a_i \larr a_i - 1$。
>
> 整个过程中，等于 $0$ 的元素会被立刻删除。问是否能通过有限次操作使得 $\{a\} = \{b\}$，即两集合相等。

这里的 $a$ 对应了原树的链长集合，$b$ 则是最终树的链长集合。

上面这个问题是经典问题，我们只需要不断拿出 $\{a\}$ 和 $\{b\}$ 中的最大值匹配就可以了。原问题有无解可以在这一步完成判断。

### 3. 把链拼接为子树并重标号

现在我们的链长集合正是最终所需的链长集合，我们可以做一个第一部分的逆过程，把链拼接回去。

重标号（求映射关系）可以在这一步完成。具体地，我们先把直径上的点映射好，然后在最终树的子树中长剖式的递归，对于一个点 $p$ 的长儿子而言，其映射就是 $p$ 映射对应链上的下一个点；对于非长儿子而言，我们需要重新拿出一条链来拼接，则递归求解就可以了。

代码就是把上述过程复述了一遍。加了一点反抄袭，不过保证不影响阅读（应该也没人想阅我这个代码）。

[彩蛋（见这里面的“一些彩蛋”部分）](https://www.luogu.com.cn/discuss/1252022)

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) (x & (-x))
using namespace std;

const int N = 2010;
typedef pair < int, int > PAIR;
int n, id[N]; vector < PAIR > save[N]; deque < int > ch[N];

struct Opt {int p, q, u, v, w;}; vector < Opt > ans;
set < int > tr[2][N];
inline void link(int ID, int x, int y)
{
	tr[ID][x].insert(y);
	tr[ID][y].insert(x);
}
inline void cut(int ID, int x, int y)
{
	assert(tr[ID][x].count(y));
	tr[ID][x].erase(tr[ID][x].find(y));
	tr[ID][y].erase(tr[ID][y].find(x));
}
inline void Record(int p, int q, int u, int v, int w) {ans.push_back({p, q, u, v, w});}
inline void Do(int p, int q, int u, int v, int w)
{
	if(u == w) return ;
//	cerr << "Do " << p << " " << q << " " << u << " " << v << " " << w << '\n';
	Record(p, q, u, v, w);
	cut(0, u, v), link(0, v, w);
}

inline void output()
{
	cout << "Yes" << '\n';
	exit(0);
}

inline vector < int > get_vector(set < int > &S)
{
	vector < int > tmp;
	for(int x : S) tmp.push_back(x);
	return tmp;
}

int main()
{
	#ifdef LOCAL
	freopen("text.in", "r", stdin);
	freopen("prog.out", "w", stdout);
	#endif
	ios::sync_with_stdio(false);
	cin.tie(0), cout.tie(0);
	
	cin >> n;
	for(int i = 0; i <= 1; ++i)
	{
		for(int j = 1, x, y; j < n; ++j)
		{
			cin >> x >> y;
			link(i, x, y);
		}
	}
	
	function < deque < int > (int) > take = [&](int ID)
	{
		// 提取出树 ID 的直径 
		int comp = -1, rec = 0;
		function < void (int, int, int) > dfs = [&](int pos, int prt, int dist)
		{
			if(dist > comp) rec = pos, comp = dist;
			for(int to : tr[ID][pos])
			{
				if(to == prt) continue;
				dfs(to, pos, dist + 1);
			}
		};
		int st = 0, ed = 0;
		dfs(1, 0, 1), st = rec, comp = -1, rec = 0;
		dfs(st, 0, 1), ed = rec, comp = -1, rec = 0;
		
		deque < int > tmp;
		function < bool (int, int) > find = [&](int pos, int prt)
		{
			if(pos == ed)
			{
				tmp.push_back(pos);
				return true;
			}
			for(int to : tr[ID][pos])
			{
				if(to == prt) continue;
				if(find(to, pos))
				{
					tmp.push_back(pos);
					return true;
				}
			}
			return false;
		}; find(st, 0);
		
		return tmp;
	};
	
	deque < int > dia = take(0);
//	cerr << "dia : "; for(int x : dia) cerr << x << " "; cerr << '\n';
	// vis[x] 为真代表 x 这个点已经位于至少一条直径上 
	vector < bool > vis(n + 1);
	for(int x : dia) vis[x] = true; // 标记直径上的点 
	// 不断地拆链 
	while(true)
	{
		vector < int > son(n + 1), dp(n + 1);
		// 分别记录重儿子和子树内深度 
		function < void (int, int) > treedp = [&](int pos, int prt)
		{
			son[pos] = 0; dp[pos] = 1;
			for(int to : tr[0][pos])
			{
				if(to == prt) continue;
				treedp(to, pos);
				dp[pos] = max(dp[pos], dp[to] + 1);
				if(dp[to] > dp[son[pos]]) son[pos] = to;
			}
		};
		
		int i = 0, pos = 0, to = 0; bool flag = false;
		for(i = 0; i < (int)dia.size(); ++i)
		{
			pos = dia[i];
			for(int x : tr[0][pos]) if(!vis[x]) {to = x; flag = true; break;}
			if(flag) break;
		}
		
		if(!flag) break; // 已经拆完了所有的链 
		
		treedp(to, pos);
		if(dp[to] != i && dp[to] != (int)dia.size() - 1 - i)
		{
			// 这个子树不在正确的位置，需要移动 
			Do(dia.front(), dia.back(), dia[i], to, dia[dp[to]]);
			i = dp[to], pos = dia[i];
		}
		int bottom = to; // 查找末端节点 
		while(son[bottom]) bottom = son[bottom];
		function < void (int, int) > perform = [&](int pos, int prt)
		{
			// 提取一条链 
			vis[pos] = true;
			vector < int > tmp = get_vector(tr[0][pos]);
			for(int p : tmp)
			{
				if(p == prt) continue;
				else if(p == son[pos]) perform(p, pos);
				else
				{
					// 这是其他的子树，需要移动到对应的位置 
					if(i == dp[to])
					{
						Do(bottom, dia.back(), pos, p, dia[dia.size() - 1 - dp[p]]);
					}
					else
					{
						Do(bottom, dia.front(), pos, p, dia[dp[p]]);
					}
				}
			}
		}; perform(to, pos);
	}
	
	function < void () > debug = [&]()
	{
		cerr << "debug : +++++++++++++++++++++++\n";
		for(int i = 1; i <= n; ++i)
			for(int j : tr[0][i])
				if(i < j)
					cerr << i << " " << j << '\n';
		cerr << "+++++++++++++++++++++++++++++++\n";
	};
//	cerr << dia.front() << " " << dia.back() << '\n';
//	debug();

	function < void () > move_to_right = [&]()
	{
		fill(vis.begin(), vis.end(), 0);
		for(int x : dia) vis[x] = true;
		int cnt[2] = {0, 0};
		for(int i = 0; i < (int)dia.size() / 2; ++i)
			for(int to : tr[0][dia[i]])
				cnt[0] += (vis[to] == false);
		for(int i = (int)(dia.size() + 1) / 2; i < (int)dia.size(); ++i)
			for(int to : tr[0][dia[i]])
				cnt[1] += (vis[to] == false);
		if(cnt[0] > cnt[1]) reverse(dia.begin(), dia.end());
		for(int i = 0; i < (int)dia.size() / 2; ++i)
		{
			int pos = dia[i];
			vector < int > tmp = get_vector(tr[0][pos]);
			for(int to : tmp)
			{
				if(vis[to]) continue;
				Do(dia.front(), dia.back(), pos, to, dia[(int)dia.size() - 1 - i]);
			}
		}
	}; move_to_right();
	
	// 现在我们开始搞另一棵树的一些信息 
	vector < int > son(n + 1), dp(n + 1), bot(n + 1), ison(n + 1);
	function < void (int, int, int) > treedp = [&](int ID, int pos, int prt)
	{
		son[pos] = ison[pos] = 0; dp[pos] = 1; bot[pos] = pos;
		for(int to : tr[ID][pos])
		{
			if(to == prt) continue;
			treedp(ID, to, pos);
			dp[pos] = max(dp[pos], dp[to] + 1);
			if(dp[to] > dp[son[pos]]) son[pos] = to;
		}
		if(son[pos]) bot[pos] = bot[son[pos]], ison[son[pos]] = pos;
	};
	deque < int > path = take(1);
	function < void () > match = [&]()
	{
		// 这部分代码负责延长直径以及做一些匹配 
		vector < bool > ban(n + 1); // 相当于第二棵树的 vis 数组 
		
		// 首先如果目标直径还要短一些，那么一定是无解的 
		if(dia.size() > path.size()) Impossible();
		
		// 求解可重集合 
		multiset < int > T;
		for(int x : path) ban[x] = true;
		function < void (int, int) > get = [&](int pos, int prt)
		{
			// 收割整个子树中的链 
			ban[pos] = true;
			for(int to : tr[1][pos])
			{
				if(to == prt) continue;
				else if(to == son[pos]) get(to, pos);
				else
				{
					T.insert(dp[to]);
					get(to, pos);
				}
			}
		};
		for(int pos : path)
		{
			for(int to : tr[1][pos])
			{
				if(!ban[to])
				{
					treedp(1, to, pos);
					T.insert(dp[to]); get(to, pos);
				}
			}
		}
		
		// 把原树上面的链调整为这个形态 
		for(int i = 1; i <= n; ++i) T.insert(0);
		fill(vis.begin(), vis.end(), 0);
		for(int x : dia) vis[x] = true;
		function < void (int, int) > get_vis = [&](int pos, int prt)
		{
//			cerr << "get " << pos << " " << prt << '\n';
			dia.push_front(pos);
			vis[pos] = true;
			for(int to : tr[0][pos])
				if(to != prt)
					get_vis(to, pos);
		};
//		debug();
		while(T.size())
		{
//			cerr << "current dia : "; for(int x : dia) cerr << x << " "; cerr << '\n';
			
			int comp = -1, x = 0, y = 0;
			for(int pos : dia)
			{
				for(int to : tr[0][pos])
				{
					if(vis[to]) continue;
					treedp(0, to, pos);
					if(dp[to] > comp) comp = dp[to], x = pos, y = to;
				}
			}
			
//			cerr << "-> " << x << " " << y << " " << comp << " " << *prev(T.end()) << '\n';
//			cerr << "vis : "; for(int i = 1; i <= n; ++i) cerr << vis[i] << " "; cerr << '\n';
			
			if(comp == -1 && *prev(T.end()) == 0) break;
			
			if(comp < *prev(T.end())) Impossible();
			else
			{
				int dia_front = dia.front(), dia_back = dia.back(), goal = dia[*prev(T.end())];
				for(int i = 1; i <= *prev(T.end()); ++i) dia.pop_front();
				get_vis(y, x);
				Do(dia_front, dia_back, x, y, goal);
				T.erase(prev(T.end()));
			}
		}
		
		// 最后再判断一下原树和新树直径长度的关系 
//		debug();
		if(dia.size() != path.size()) Impossible();
	}; match();
	
	move_to_right();
	
//	cerr << "Final Stage : ***************************************\n";
//	cerr << "dia : "; for(int x : dia) cerr << x << " "; cerr << '\n';
//	debug();
	
	vector < int > mat(n + 1);
	function < void () > construct = [&]()
	{
		// 把链再弄回子树的样子 
		
		// 首先把直径重新标号 
		for(int i = 0; i < (int)dia.size(); ++i) id[dia[i]] = path[i], mat[path[i]] = dia[i];
		
		// 首先解析出我们有哪些链 
		// save[len] 里面存有长度为 len 的 (pos, fa) 二元组 
		vector < int > save_dp(n + 1), save_son(n + 1);
		fill(vis.begin(), vis.end(), 0);
		for(int x : dia) vis[x] = true;
		for(int pos : dia)
			for(int to : tr[0][pos])
				if(!vis[to])
				{
					treedp(0, to, pos), save[dp[to]].push_back({to, pos});
					int pt = to;
					while(pt) ch[to].push_back(pt), pt = son[pt];
				}
					
		for(int i = 1; i <= n; ++i)
			save_dp[i] = dp[i], save_son[i] = son[i];
		
		// 然后枚举子树，依次把他们造出来并挂上 
		vector < bool > ban(n + 1);
		for(int x : path) ban[x] = true;
		function < void (int, int, int) > work = [&](int pos, int prt, int ref)
		{
			id[ref] = pos; mat[pos] = ref;
			for(int to : tr[1][pos])
			{
				if(to == prt) continue;
				else if(to == son[pos]) work(to, pos, save_son[ref]);
			}
			for(int to : tr[1][pos])
			{
				// 处理分支链 
				if(to != prt && to != son[pos])
				{
					int pt = bot[pos];
					for(int t = 1; t <= dp[to]; ++t) pt = ison[pt];
					PAIR chain = save[dp[to]].back(); save[dp[to]].pop_back();
					int target = dia.back();
					Do(mat[bot[pos]], target, chain.second, chain.first, mat[pt]);
					work(to, pos, chain.first);
					Do(mat[bot[pos]], target, mat[pt], chain.first, mat[pos]);
				}
			}
		};
		for(int i = 0; i < (int)path.size(); ++i)
		{
			int pos = path[i];
			for(int to : tr[1][pos])
			{
				if(ban[to]) continue;
				// 现在我们有 to 这棵子树 
				treedp(1, to, pos);
				PAIR chain = save[dp[to]].back(); save[dp[to]].pop_back();
				Do(dia.front(), dia.back(), chain.second, chain.first, dia[dp[to]]);
				work(to, pos, chain.first);
				Do(dia.front(), dia.back(), dia[dp[to]], chain.first, dia[i]);
			}
		}
	}; construct();
	
	output();
	
	return 0;
}
/*
7
1 2
1 3
2 4
2 5
5 6
5 7

1 2
2 3
3 4
4 5
5 6
6 7
*/
/*
如何判断有无解？
显然直径只会变长不会变短，因此直径长度超标就无解了 
显然对于一棵子树，你可以保留一条链，然后把上面剩下的东西摘走 
然后我们发现这些链还可以加回来，所以我们可以把整棵树变成晾衣杆 
一个直径上挂了很多咸菜状物，即子树拆出来的链 
处理出两棵树需要使用的链的可重集合，然后一条一条弄 
我们可以通过移动到超限位置的方式把链的长度给到直径 
这样我们需要做的就是从大到小匹配，显然贪心可解 

神经啊还要输出对应哪个点
这样我们就需要确定一个节点在两棵树中的位置，这个可以直接确定直径的一段 
然后跑一遍树哈希，根据哈希值映射 

考虑复杂度，拆出链 O(n)，匹配 O(n)，造子树 O(n)，移动子树 O(n) 
*/
```

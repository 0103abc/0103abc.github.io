---
title: "P15265 [USACO26JAN2] Dynamic Instability P 题解"
date: "2026-02-22T09:43:19.000Z"
link: "luogu-iux1auh0"
categories: ["题解"]
tags: ["洛谷", "数学", "概率与期望", "图论", "树", "基础算法", "前缀和"]
draft: false
---

求图上游走期望步数的通用思想是，给整个游走过程定下一个形式化过程，并要求这个形式化过程是可以拆分为一个个“阶段”的。我们只需要计算出这些阶段各自的贡献，整个过程的期望时间也就不难求解了。

这题的形式化过程可以拆分为 $x \to p, p \to y$ 两部分，其中 $p$ 是 $\text{LCA}(x, y)$ 或者这个点的祖先。由期望的线性性，我们可以求出这两部分的期望后相加。另外，不难分析出第一次跳到 $\text{LCA}(x, y)$ 及其祖先时，跳到每个点的概率是相等的。这样我们只需要求出下面两个贡献：

1. 从 $x$ 开始，第一次跳到 $\text{LCA}(x, y)$ 或其上方的期望时间；
2. 从 $\text{LCA}(x, y)$ 及其上方的随机一个点开始，跳到 $y$ 的期望步数。

然后相加就可以了。

对于第一部分，我们设 $f_p$ 表示当前位于点 $p$，接下来第一次跳到 $p$ 祖先的期望步数。（转移可以参考代码或者其他题解，这里不再赘述）对于 $x$ 而言，$f_x$ 的贡献是一定存在的；对于 $x$ 的祖先 $z$ 而言，在跳到 $z$ 的祖先之前刚好跳到 $z$ 的概率是 $\frac{1}{dep_z}$，则贡献是 $\frac{f_z}{dep_z}$。这是一个树上前缀和，可以预处理后 $O(1)$ 查询。

对于第二部分，我们设 $g_p$ 表示当前位于 $p$ 的父节点，接下来第一次跳到 $p$ 的期望步数。（转移可以参考代码或者其他题解，这里不再赘述）对于 $\text{LCA}(x, y) \to y$ 路径上的边而言，$g$ 的贡献是一定存在的；而 $\text{LCA}(x, y)$ 及其上面的节点的 $g$ 对答案的贡献仍然仅和深度有关，也可以预处理树上前缀和后 $O(1)$ 查询。

不考虑求解 LCA 的复杂度，精细实现可以做到线性。一般的实现是 $O(n\log n)$ 的。

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) (x & (-x))
using namespace std;

const int N = 200010, mod = 1e9 + 7;
inline void Plus(long long &now, long long add) {now = (now + add) % mod;}
inline void Plus(int &now, int add) {now = (now + add) % mod;}
inline long long qpow(long long a, long long b)
{
	long long ans = 1;
	while(b)
	{
		if(b & 1) ans = ans * a % mod;
		b >>= 1, a = a * a % mod;
	}
	return ans;
}

int n, m, fa[N][21], dep[N]; vector < int > tr[N];
long long f[N], g[N], pr_f[2][N], pr_g[2][N];
// f, g 的定义如代码末尾注释所示 
// pr_g[0][x] 表示 g 的树上前缀和，pr_g[1][x] 则是加权（深度）前缀和 

int main()
{
//	freopen("text.in", "r", stdin);
//	freopen("prog.out", "w", stdout);
	ios::sync_with_stdio(false);
	cin.tie(0), cout.tie(0);
	
	cin >> n >> m;
	for(int i = 2; i <= n; ++i) cin >> fa[i][0], tr[fa[i][0]].push_back(i);
	
	// 预处理树上信息后可以 O(\log n) 求解 LCA 
	function < void (int) > init = [&](int pos)
	{
		dep[pos] = dep[fa[pos][0]] + 1;
		for(int i = 1; ; ++i)
		{
			if(fa[fa[pos][i - 1]][i - 1]) fa[pos][i] = fa[fa[pos][i - 1]][i - 1];
			else break;
		}
		for(int to : tr[pos]) init(to);
	}; init(1);
	function < int (int, int) > LCA = [&](int x, int y)
	{
		if(dep[x] < dep[y]) swap(x, y);
		while(dep[x] > dep[y]) x = fa[x][__lg(dep[x] - dep[y])];
		if(x == y) return x;
		for(int i = 20; i >= 0; --i)
			if(fa[x][i] != fa[y][i])
				x = fa[x][i], y = fa[y][i];
		return fa[x][0];
	};
	
	function < void (int) > treedp_f = [&](int pos)
	{
		if(!tr[pos].size())
		{
			// pos 是叶子，直接赋值 f[pos] = 1 
			f[pos] = 1; return ;
		}
		
		int cnt = tr[pos].size(), icnt = qpow(cnt, mod - 2);
		for(int to : tr[pos])
		{
			treedp_f(to);
			Plus(f[pos], f[to] * icnt % mod);
		}
		++f[pos];
		if(pos == 1) f[pos] = 0;
		else f[pos] = 1ll * f[pos] * dep[pos] % mod * qpow(dep[pos] - 1, mod - 2) % mod;
	}; treedp_f(1);
	function < void (int) > treedp_g = [&](int pos)
	{
		// 计算子节点的贡献之和 
		int cnt = tr[pos].size(), icnt = qpow(cnt, mod - 2), sum = 0;
		for(int to : tr[pos]) Plus(sum, f[to] * icnt % mod);
		
		long long delta = pr_g[1][pos] * qpow(dep[pos], mod - 2) % mod;
		delta = delta * (cnt - 1) % mod * icnt % mod;
		
		// 由于走到正确位置的概率仅仅有 1 / cnt，所有 g[to] 需要乘以 cnt 
		for(int to : tr[pos])
		{
			g[to] = (1 + sum - icnt * f[to] % mod + delta + mod) * cnt % mod;
			pr_g[0][to] = (pr_g[0][pos] + g[to]) % mod;
			pr_g[1][to] = (pr_g[1][pos] + g[to] * dep[pos] % mod) % mod;
			pr_f[0][to] = (pr_f[0][pos] + f[to]) % mod;
			pr_f[1][to] = (pr_f[1][pos] + f[to] * qpow(dep[to], mod - 2) % mod) % mod;
			treedp_g(to);
		}
	}; treedp_g(1);
	
	/*
	cerr << "f : "; for(int i = 1; i <= n; ++i) cerr << f[i] << " "; cerr << '\n';
	cerr << "g : "; for(int i = 1; i <= n; ++i) cerr << g[i] << " "; cerr << '\n';
	*/
	
	function < int (int, int) > query = [&](int st, int ed)
	{
		if(LCA(st, ed) == st)
		{
			return (pr_g[0][ed] - pr_g[0][st] + mod) % mod;
		}
		else
		{
			int lca = LCA(st, ed);
			long long ans = 0;
			
			// 计算 st -> p 的期望时间 
			Plus(ans, f[st]);
			Plus(ans, pr_f[1][fa[st][0]] - pr_f[1][lca] + mod);
			// 计算 p -> ed 的期望时间 
			Plus(ans, pr_g[0][ed] - pr_g[0][lca] + mod);
			Plus(ans, pr_g[1][lca] * qpow(dep[lca], mod - 2) % mod);
			
			return ans;
		}
	};
	for(int i = 1; i <= m; ++i)
	{
		// 依次处理询问 
		int st, ed; cin >> st >> ed;
		cout << query(st, ed) << '\n';
	}
	
	return 0;
}
/*
如果 LCA(x, y) != x，那么整个过程分为两步：x -> p, p -> y 
期望具有线性性，我们可以分别计算 x -> p 的平均时间，p -> y 的平均时间再加起来 
p 可以是 LCA(x, y) 以及其祖先中的任意一个点，且易知这个概率是相等的 
对于 x -> p 的计算：
设 f[x] 表示当前处于 x，接下来第一次走到 x 的某祖先（未指定）的期望时间 
然后我们似乎可以矩阵乘法转移，套一个树剖即可完成区间转移 
其实可以不用那么麻烦，下面的点在访问 x 祖先之前先访问 x 的概率是 1 / dep[x] 
因此一个点的贡献可以是独立的，这就能直接做了 
对于 p -> y 的计算：
设 g[x] 表示从 fa[x] 开始第一次走到 x 的期望时间 
1 到 LCA(x, y) 之间的边会被经过的概率形成等差数列，LCA(x, y) 到 y 之间的边会被经过的概率均为 1 
这都可以树上前缀和维护，O(1) 查询 
*/
```

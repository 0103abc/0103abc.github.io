---
title: "P14315 [Aboi Round 2] Faputa 题解"
date: "2025-11-10T03:36:42.000Z"
link: "luogu-6y0y1xdn"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "图论", "强连通分量", "基础算法", "前缀和"]
draft: false
---

选自 [$11$ 月做题笔记](https://www.luogu.com.cn/article/obgeyrgs)。

### 011. [P14315 [Aboi Round 2] Faputa](https://www.luogu.com.cn/problem/P14315)

考虑竞赛图 SCC 计数的经典结论：设 $\deg_i$ 表示竞赛图上 $i$ 点的入度，则该竞赛图 SCC 的数量即为：$\sum\limits_{i=1}^n[\sum\limits_{j=1}^i\deg'_j=\binom i2]$，其中 $\deg'$ 数组是 $\deg$ 升序排序之后得到的数组。证明是显然的。

然后考虑动态的维护翻转一条边的指向 / 查询整张图 SCC 数量这两个操作，根据上面的结论，你只需要维护 $\deg'$ 数组和其前缀和数组即可。此时先维护好 $\deg$ 数组的信息（这是十分简单的），然后你只需要时刻保证 $\deg'$ 有序，且修改的时候修改 $O(1)$ 个位置即可。容易想到修改每个 $\deg$ 数组内的值时，直接二分查找出 $\deg'$ 数组第一个 / 最后一个值和 $\deg_i$ 相同的位置然后修改。因为修改操作要么是 $+1$ 要么是 $-1$ 所以显然可以保证数组有序。

而现在还需要维护 $\deg'$ 数组的前缀和，考虑线段树处理。容易发现每次操作其实就是找出两个位置 $i,j$，使得：

+ $\deg'_i\leftarrow \deg'_i-1,\deg'_j\leftarrow \deg'_j+1$
+ $\deg'_i\leftarrow \deg'_i+1,\deg'_j\leftarrow \deg'_j-1$

容易观察出此时前缀和值会被修改的区间一定是 $[i,j-1]$ 或 $[j,i-1]$，而要么是该段区间被整体 $+1$，要么是该段区间被整体 $-1$。

现在还需要维护整体查询，这个查询到的值形如：

$$
\sum\limits_{i=1}^n[\sum\limits_{j=1}^i\deg'_j=\binom i2]
$$

考虑维护内层 $\sum\limits_{j=1}^i\deg'_j=\binom i2$ 是否成立。因为当前已经可以快速维护 $\sum\limits_{j=1}^i\deg_j'$ 的值了，所以只需要查询区间中值为 $\binom i2$ 的数的个数。比较困难的点在于 $\binom i2$ 的值对每个不同的 $i$ 都不同。但是 $\binom i2$ 对相同的 $i$ 而言其值为定值，因此想到在数据结构上对每个 $i$ 改维护 $(\sum\limits_{j=1}^i\deg'_j)-\binom i2$ 的值，这样问题变为了区间 $\pm 1$ 整体查 $0$ 的数量，可以用树套树做到大常数 $O(n\log^2n)$ 或者分块做到 $O(n\sqrt n)$，均无法通过，只能拿到 $75$ 分。

考虑进一步优化。你会发现 $\sum\limits_{j=1}^i\deg_j'\ge \binom i2$ 这个不等式对于任意 $i=1\ldots n$ 均恒成立，而上述式子的值取 $0$，当且仅当不等式取等号。因此整体查询 $0$ 的数量这一条件可以修改为整体查询最小值的数量，这个是容易维护的。

在线段树上维护下列信息：

+ `mi`：当前线段树结点对应的区间中最小值
+ `cntmi`：当前线段树结点对应的区间中最小值在当前区间中出现的次数
+ `tag`：懒惰标记

上述信息是容易 $O(1)$ 维护的，所以直接拿线段树做这个东西，总时间复杂度为 $O(n\log n)$，可以通过该题。

```cpp
namespace Loyalty
{
    inline void init() { }
    inline int harsh(int i, int j) { return i * 21810563ll + j; }
    int deg[N], srtdeg[N];
    struct Node
    {
    	int l, r, mi, cntmi, tag;
    	inline void init(int p) { l = r = p, mi = 0, cntmi = 1, tag = 0; }
    	inline void push(int x) { mi += x, tag += x; }
	} tree[N << 2];
	inline Node operator+(const Node &l, const Node &r)
	{
		Node o;
		o.l = l.l, o.r = r.r, o.tag = 0;
		if (l.mi == r.mi)
			o.mi = l.mi, o.cntmi = l.cntmi + r.cntmi;
		else if (l.mi > r.mi)
			o.mi = r.mi, o.cntmi = r.cntmi;
		else
			o.mi = l.mi, o.cntmi = l.cntmi;
		return o;
	}
    inline void build(int l, int r, int rt)
    {
    	if (l == r)
    		return tree[rt].init(l);
    	int mid = l + r >> 1;
    	build(l, mid, rt << 1);
    	build(mid + 1, r, rt << 1 | 1);
    	tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
	}
	inline void pushdown(int rt)
	{
		if (tree[rt].tag)
		{
			tree[rt << 1].push(tree[rt].tag);
			tree[rt << 1 | 1].push(tree[rt].tag);
			tree[rt].tag = 0;
		}
	}
	inline void loyalty(int rt, int ll, int rr, int v)
	{
		if (ll > rr)
			return;
		int &l = tree[rt].l, &r = tree[rt].r;
		if (ll <= l && r <= rr)
			return tree[rt].push(v);
		int mid = l + r >> 1;
		pushdown(rt);
		if (ll <= mid)
			loyalty(rt << 1, ll, rr, v);
		if (mid < rr)
			loyalty(rt << 1 | 1, ll, rr, v);
		tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
	}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int atc)
    {
    	int n, m;
    	cin >> n >> m;
    	unordered_map<int, int> mp;
    	for (int i = 1; i <= n; ++i)
    		deg[i] = srtdeg[i] = i - 1;
    	build(1, n, 1);
    	while (m--)
    	{
    		int u, v;
    		cin >> u >> v;
    		if (u > v)
    			u ^= v ^= u ^= v;
    		if (mp[harsh(u, v)])
    		{
    			int x = lower_bound(srtdeg + 1, srtdeg + n + 1, deg[u]) - srtdeg;
    			--srtdeg[x], --deg[u];
    			int y = upper_bound(srtdeg + 1, srtdeg + n + 1, deg[v]) - srtdeg - 1;
//    			cerr << "1: " << x << ' ' << y << '\n';
    			++srtdeg[y], ++deg[v];
//    			--srtdeg[x], ++srtdeg[y], --deg[u], ++deg[v];
    			if (x > y)
    				loyalty(1, y, x - 1, 1);
    			else
    				loyalty(1, x, y - 1, -1);
    			mp[harsh(u, v)] = 0;
			}
			else
			{
				int x = upper_bound(srtdeg + 1, srtdeg + n + 1, deg[u]) - srtdeg - 1;
				++srtdeg[x], ++deg[u];
    			int y = lower_bound(srtdeg + 1, srtdeg + n + 1, deg[v]) - srtdeg;
//    			cerr << "2: " << x << ' ' << y << '\n';
    			--srtdeg[y], --deg[v];
//    			++srtdeg[x], --srtdeg[y], ++deg[u], --deg[v];
    			if (x > y)
    				loyalty(1, y, x - 1, -1);
    			else
    				loyalty(1, x, y - 1, 1);
    			mp[harsh(u, v)] = 1;
			}
			cout << tree[1].cntmi << '\n';
		}
    }
}
```

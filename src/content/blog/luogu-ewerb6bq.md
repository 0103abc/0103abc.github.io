---
title: "CF1408H Rainbow Triples 题解"
date: "2026-02-25T11:42:58.000Z"
link: "luogu-ewerb6bq"
categories: ["题解"]
tags: ["Codeforces", "基础算法", "贪心", "图论", "网络流", "前缀和"]
draft: false
---

先考虑每个非零数不同的情况，我们有经典结论：选出的 $0$ 一定是前 $k$ 个和后 $k$ 个，且正数第 $i$ 个 $0$ 对应的后面的 $0$ 必然是倒数第 $k + 1 - i$ 个 $0$。

如果知道 $k$，我们便把原问题变成了一些区间和一些点匹配的问题。容易使用贪心判断是否能取到 $k$。

再考虑非零数可能相同这一点，不难发现这个匹配可以转化为最大流，进一步对偶成最小割，又因为 $k$ 个候选区间的交一定非空，所以要么割完，要么割一个前缀和一个后缀。

这样一来，一个区间 $[L, R]$ 可以转化为如下限制：

- 如果割掉的前后缀范围分别是 $[1, l], [r, n]$，那么 $l < L, r < R$ 时不需要割这个区间；

一种颜色也可以导出一个区间 $[L, R]$，对应如下限制：

- 如果割掉的前后缀范围是 $[1, l], [r, n]$，那么 $l \leq L \leq R \leq r$ 时不需要割这个颜色。

这是扫描线问题，容易使用线段树维护，套上二分答案（需要轻度卡常数）即可 $O(n \log^2n)$ 快速秒掉这个题。

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) (x & (-x))
using namespace std;

const int N = 500010;
int T, n, cnt, a[N]; vector < int > tmp;
struct Range {int l, r, val;} s[N], t[N];

vector < Range > save[N];
int rt, idx;
struct SGT
{
	int ls, rs, maxn, tag;
	#define ls(x) tree[x].ls
	#define rs(x) tree[x].rs
	#define maxn(x) tree[x].maxn
	#define tag(x) tree[x].tag
} tree[N * 2];
inline void pushup(int now) {maxn(now) = max(maxn(ls(now)), maxn(rs(now)));}
inline void push_tag(int now, int _tag) {maxn(now) += _tag, tag(now) += _tag;}
inline void pushdown(int now)
{
	if(tag(now))
	{
		push_tag(ls(now), tag(now));
		push_tag(rs(now), tag(now));
		tag(now) = 0;
	}
}
inline void build(int &now, int l, int r)
{
	now = ++idx; maxn(now) = tag(now) = ls(now) = rs(now) = 0;
	if(l == r) return ;
	int mid = (l + r) >> 1;
	build(ls(now), l, mid), build(rs(now), mid + 1, r);
	pushup(now);
}
inline void range_add(int now, int l, int r, int L, int R, int num)
{
	if(L <= l && r <= R) {push_tag(now, num); return ;}
	pushdown(now); int mid = (l + r) >> 1;
	if(L <= mid) range_add(ls(now), l, mid, L, R, num);
	if(mid < R) range_add(rs(now), mid + 1, r, L, R, num);
	pushup(now);
}
inline void debug(int now, int l, int r)
{
	if(l == r)
	{
		cerr << maxn(now) << " ";
		return ;
	}
	pushdown(now); int mid = (l + r) >> 1;
	debug(ls(now), l, mid), debug(rs(now), mid + 1, r);
}

inline void sol()
{
	cin >> n; tmp.clear(); // tmp 存储了 0 的位置 
	set < int > S;
	for(int i = 1; i <= n; ++i) cin >> a[i], S.insert(a[i]);
	cnt = S.size() - S.count(0);
	for(int i = 1; i <= n; ++i) if(!a[i]) tmp.push_back(i);
	
	function < bool (int) > check = [&](int m)
	{
		// 检查前 m 个 0 和后 m 个 0 是否可以圈出 m 个数字，检查方式用模拟最小割 
//		cerr << "check " << m << " +++++++++++++++++++++++++++++++\n";
		
		for(int i = 1; i <= m; ++i) s[i] = {tmp[i - 1], tmp[tmp.size() - m - 1 + i]};
		Range global = {s[m].l, s[1].r}; int all = cnt; // global 是一定会被覆盖的区域，all 是元素个数 
		
		// 解析出扫描线 
		function < void (int, int, int, int) > get_rect = [&](int sx, int tx, int sy, int ty)
		{
//			cerr << "get_rect " << sx << " " << tx << " " << sy << " " << ty << '\n';
			save[sx].push_back({sy, ty, 1});
			if(tx + 1 > global.l) return ;
			save[tx + 1].push_back({sy, ty, -1});
		};
		for(int i = 1; i <= n + 1; ++i) save[i].clear(), t[i] = {-N, N};
		// 下端的贡献 
		for(int i = 1; i <= m; ++i) get_rect(1, s[i].l, s[i].r, n), ++all;
		// 上端的贡献 
		for(int i = 1; i < global.l; ++i) if(a[i]) t[a[i]].l = i;
		for(int i = n; i > global.r; --i) if(a[i]) t[a[i]].r = i;
		for(int i = global.l; i <= global.r; ++i) if(a[i]) t[a[i]] = {-N, N};
		for(int i = 1; i <= n; ++i)
		{
			if(t[i].l != -N || t[i].r != N)
			{
				int L = max(1, t[i].l + 1), R = min(n, t[i].r - 1);
				get_rect(L, R, L, R);
			}
		}
		
		// 求解最大值 
		rt = idx = 0; build(rt, global.r, n);
		int ans = all - m;
		for(int i = 1; i <= global.l; ++i)
		{
			for(Range rng : save[i]) range_add(rt, global.r, n, max(global.r, rng.l), rng.r, rng.val);
			ans = max(ans, maxn(rt));
			if(all - ans < m) return false; // 这个值就是最小割，即最大流 
//			cerr << i << " " << maxn(rt) << '\n';
//			cerr << "debug : "; debug(rt, 1, n); cerr << '\n';
		}
		
//		cerr << ans << '\n';
		
		return true;
	};
	
	int l = 1, r = min((int)tmp.size() / 2, cnt), ans = 0;
	while(l <= r)
	{
		int mid = (l + r) >> 1;
		if(check(mid)) ans = mid, l = mid + 1;
		else r = mid - 1;
	}
	cout << ans << '\n';
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
1
6
0 2 0 0 5 0

首先我们要使用的 0 肯定是一段前缀和一段后缀，并且是顺次匹配的 
因为这个 ( + X + ) 模型的左右括号大概满足一个四边形不等式，全都不包含的匹配自由度最高 
那么不妨考虑一下非零的数全都不同怎么做！可以二分答案 
其实不是全部相同也能二分答案，但是 check 就不显然了 
这是一个最大流问题，能不能用数据结构模拟呢
补怼，我有种转最小割的冲动，试试看能不能线性规划对偶一下
我去，可以，不过还是需要人为地求解最小割 
由于一侧的线段全是包含的，所以割掉的是一个前缀和一个后缀 
然后每种颜色正好又能转化为一个限制 (x, y) 表示保留的 [L, R] 满足 x <= L <= R <= y 时不用割 
这就是一个线段树直接做啊 做完了 
*/
```

---
title: "CF331D3 Escaping on Beaveractor 题解"
date: "2026-03-04T03:05:35.000Z"
link: "luogu-lklgqtde"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "倍增", "基础算法", "贪心", "模拟"]
draft: false
---

用时：1 小时 37 分钟 15 秒。

前置技巧：[影跃](https://www.luogu.com.cn/article/0s6u0tio)。

在这道题中，我们发现如果可以提取出 $O(n)$ 个影跃点，然后在这些点上面跑倍增，那么答案就容易求了。

我们考虑这些点的选择：

1. 首先选上从一个箭头出发，第一次碰到其他箭头时所在的位置；
2. 再选上从一个询问点出发，第一次碰到箭头时所在的位置。

这些点的数量级是 $O(n)$ 的，且不难发现除了第一次影跃，剩下的全过程都在这 $O(n)$ 个关键点中进行（当然，需要特判出界的情况）。我们设 $f_{p, i}$ 表示在 $p$ 关键点影跃 $2^i$ 次能到达的关键点的编号，并设 $g_{p, i}$ 表示对应的路程，直接贪心地模拟就可以了。

对于点的提取，也不难使用各种简单数据结构优化到 $O(n \log n)$。

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) ((x) & (-(x)))
using namespace std;

const int N = 100010, LG = 53;
const long long INF = 20000000000000000ll;
int n, m, t, k; // 注意坐标范围是 [0, m] 
struct Point
{
	long long x, y; char c; int id;
}; Point p[N * 4], q[N]; long long dist[N];
struct Range
{
	long long l, r;
	bool operator < (const Range &w) const
	{
		return l < w.l;
	}
	bool operator > (const Range &w) const
	{
		return l > w.l;
	}
}; vector < Range > Ua[N], Da[N], La[N], Ra[N];
set < Range > Ur[N], Dr[N], Lr[N], Rr[N];
vector < int > save[N], extra[N];

int lg = 51, f[N * 4][LG]; long long g[N * 4][LG];
// f[x][k] 表示从 x 开始影跃 2^k 次之后到达的点，g 表示距离 

map < pair < int, int >, int > mp;
inline void upd(int x, int y, char c)
{
	// 加入新点 (x, y) 
	if(!mp.count({x, y})) mp[{x, y}] = ++k, p[k] = {x, y, c};
}

struct Data
{
	long long num; char c;
	bool operator < (const Data &w) const {return num < w.num;}
	bool operator > (const Data &w) const {return num > w.num;}
}; set < Data > Hs[N], Vs[N];
inline Point calc(Point pt)
{
	// 计算从 pt 开始的下一步 
	if(pt.c == 'U')
	{
		auto pter = Vs[pt.y].lower_bound({pt.x, ' '});
		if(pter == Vs[pt.y].begin()) return {-1, pt.y, 'U'};
		return {prev(pter) -> num, pt.y, prev(pter) -> c};
	}
	else if(pt.c == 'D')
	{
		auto pter = Vs[pt.y].upper_bound({pt.x, ' '});
		if(pter == Vs[pt.y].end()) return {m + 1, pt.y, 'D'};
		return {pter -> num, pt.y, pter -> c};
	}
	else if(pt.c == 'L')
	{
		auto pter = Hs[pt.x].lower_bound({pt.y, ' '});
		if(pter == Hs[pt.x].begin()) return {pt.x, -1, 'L'};
		return {pt.x, prev(pter) -> num, prev(pter) -> c};
	}
	else
	{
		auto pter = Hs[pt.x].upper_bound({pt.y, ' '});
		if(pter == Hs[pt.x].end()) return {pt.x, m + 1, 'R'};
		return {pt.x, pter -> num, pter -> c};
	}
}

// 区间染色，单点查询数据结构 
int rt, idx;
struct SGT
{
	int ls, rs, col, tag;
	#define ls(x) tree[x].ls
	#define rs(x) tree[x].rs
	#define col(x) tree[x].col
	#define tag(x) tree[x].tag
} tree[N * 2];
inline void push_tag(int now, int _tag) {col(now) = tag(now) = _tag;}
inline void pushdown(int now)
{
	if(tag(now) != -1)
	{
		push_tag(ls(now), tag(now));
		push_tag(rs(now), tag(now));
		tag(now) = -1;
	}
}
inline void range_col(int now, int l, int r, int L, int R, int num)
{
	if(L <= l && r <= R) {push_tag(now, num); return ;}
	pushdown(now); int mid = (l + r) >> 1;
	if(L <= mid) range_col(ls(now), l, mid, L, R, num);
	if(mid < R) range_col(rs(now), mid + 1, r, L, R, num);
}
inline int query(int now, int l, int r, int pos)
{
	if(l == r) return col(now);
	pushdown(now); int mid = (l + r) >> 1;
	if(pos <= mid) return query(ls(now), l, mid, pos);
	else return query(rs(now), mid + 1, r, pos);
}
inline void build(int &now, int l, int r)
{
	now = ++idx; ls(now) = rs(now) = 0, col(now) = tag(now) = -1;
	if(l == r) return ; int mid = (l + r) >> 1;
	build(ls(now), l, mid), build(rs(now), mid + 1, r);
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
	
	cin >> n >> m;
	for(int i = 1; i <= n; ++i)
	{
		Point st, ed;
		cin >> st.x >> st.y >> ed.x >> ed.y;
		// 存箭头 
		if(st.x == ed.x)
		{
			if(st.y < ed.y) Ra[st.x].push_back({st.y, ed.y}), Rr[st.x].insert({st.y, ed.y});
			else La[st.x].push_back({st.y, ed.y}), Lr[st.x].insert({ed.y, st.y});
		}
		else
		{
			if(st.x < ed.x) Da[st.y].push_back({st.x, ed.x}), Dr[st.y].insert({st.x, ed.x});
			else Ua[st.y].push_back({st.x, ed.x}), Ur[st.y].insert({ed.x, st.x});
		}
	}
	function < bool (set < Range > &, int) > check = [&](set < Range > &tmp, int x)
	{
		auto pter = tmp.upper_bound({x, 0});
		if(pter == tmp.begin()) return false;
		pter = prev(pter);
		if(pter -> l <= x && x <= pter -> r) return true;
		else return false;
	};
	cin >> t;
	for(int i = 1; i <= t; ++i)
	{
		cin >> q[i].x >> q[i].y >> q[i].c >> dist[i];
		if(q[i].c == 'L') q[i].c = 'U';
		else if(q[i].c == 'D') q[i].c = 'L';
		else if(q[i].c == 'U') q[i].c = 'R';
		else q[i].c = 'D';
		if(q[i].c == 'U' && check(Dr[q[i].y], q[i].x)) q[i].c = 'D';
		if(q[i].c == 'D' && check(Ur[q[i].y], q[i].x)) q[i].c = 'U';
		if(q[i].c == 'L' && check(Rr[q[i].x], q[i].y)) q[i].c = 'R';
		if(q[i].c == 'R' && check(Lr[q[i].x], q[i].y)) q[i].c = 'L';
	}
	
	// 处理向左的箭头 
	rt = idx = 0; build(rt, 0, m);
	for(int i = 0; i <= m; ++i) save[i].clear(), extra[i].clear();
	for(int i = 0; i <= m; ++i)
		for(Range rng : La[i])
			save[rng.r].push_back(i);
	for(int i = 0; i <= m; ++i)
		for(Range rng : Ra[i])
			extra[rng.r].push_back(i);
	for(int i = 0; i <= t; ++i)
		if(q[i].c == 'L')
			save[q[i].y].push_back(q[i].x);
	for(int i = 0; i <= m; ++i)
	{
		for(Range rng : Da[i]) range_col(rt, 0, m, rng.l, rng.r, i + 2 * m);
		for(Range rng : Ua[i]) range_col(rt, 0, m, rng.r, rng.l, i);
		for(int x : extra[i]) range_col(rt, 0, m, x, x, i + 4 * m);
		for(int x : save[i])
		{
			int pos = query(rt, 0, m, x); char c = 'U';
			if(pos >= 2 * m) pos -= 2 * m, c = 'D';
			if(pos >= 2 * m) pos -= 2 * m, c = 'R';
			if(pos != -1) upd(x, pos, c);
		}
	}
	// 处理向右的箭头 
	rt = idx = 0; build(rt, 0, m);
	for(int i = 0; i <= m; ++i) save[i].clear(), extra[i].clear();
	for(int i = 0; i <= m; ++i)
		for(Range rng : Ra[i])
			save[rng.r].push_back(i);
	for(int i = 0; i <= m; ++i)
		for(Range rng : La[i])
			extra[rng.r].push_back(i);
	for(int i = 0; i <= t; ++i)
		if(q[i].c == 'R')
			save[q[i].y].push_back(q[i].x);
	for(int i = m; i >= 0; --i)
	{
		for(Range rng : Da[i]) range_col(rt, 0, m, rng.l, rng.r, i + 2 * m);
		for(Range rng : Ua[i]) range_col(rt, 0, m, rng.r, rng.l, i);
		for(int x : extra[i]) range_col(rt, 0, m, x, x, i + 4 * m);
		for(int x : save[i])
		{
			int pos = query(rt, 0, m, x); char c = 'U';
			if(pos >= 2 * m) pos -= 2 * m, c = 'D';
			if(pos >= 2 * m) pos -= 2 * m, c = 'L';
			if(pos != -1) upd(x, pos, c);
		}
	}
	// 处理向上的箭头 
	rt = idx = 0; build(rt, 0, m);
	for(int i = 0; i <= m; ++i) save[i].clear(), extra[i].clear();
	for(int i = 0; i <= m; ++i)
		for(Range rng : Ua[i])
			save[rng.r].push_back(i);
	for(int i = 0; i <= m; ++i)
		for(Range rng : Da[i])
			extra[rng.r].push_back(i);
	for(int i = 0; i <= t; ++i)
		if(q[i].c == 'U')
			save[q[i].x].push_back(q[i].y);
	for(int i = 0; i <= m; ++i)
	{
		for(Range rng : La[i]) range_col(rt, 0, m, rng.r, rng.l, i + 2 * m);
		for(Range rng : Ra[i]) range_col(rt, 0, m, rng.l, rng.r, i);
		for(int x : extra[i]) range_col(rt, 0, m, x, x, i + 4 * m);
		for(int x : save[i])
		{
			int pos = query(rt, 0, m, x); char c = 'R';
			if(pos >= 2 * m) pos -= 2 * m, c = 'L';
			if(pos >= 2 * m) pos -= 2 * m, c = 'D';
			if(pos != -1) upd(pos, x, c);
		}
	}
	// 处理向下的箭头 
	rt = idx = 0; build(rt, 0, m);
	for(int i = 0; i <= m; ++i) save[i].clear(), extra[i].clear();
	for(int i = 0; i <= m; ++i)
		for(Range rng : Da[i])
			save[rng.r].push_back(i);
	for(int i = 0; i <= m; ++i)
		for(Range rng : Ua[i])
			extra[rng.r].push_back(i);
	for(int i = 0; i <= t; ++i)
		if(q[i].c == 'D')
			save[q[i].x].push_back(q[i].y);
	for(int i = m; i >= 0; --i)
	{
		for(Range rng : La[i]) range_col(rt, 0, m, rng.r, rng.l, i + 2 * m);
		for(Range rng : Ra[i]) range_col(rt, 0, m, rng.l, rng.r, i);
		for(int x : extra[i]) range_col(rt, 0, m, x, x, i + 4 * m);
		for(int x : save[i])
		{
			int pos = query(rt, 0, m, x); char c = 'R';
			if(pos >= 2 * m) pos -= 2 * m, c = 'L';
			if(pos >= 2 * m) pos -= 2 * m, c = 'U';
			if(pos != -1) upd(pos, x, c);
		}
	}
	
	/*
	cerr << "+++++++++++++++++++++++++\n";
	cerr << "Points : \n";
	for(int i = 1; i <= k; ++i) cerr << p[i].x << " " << p[i].y << " " << p[i].c << '\n';
	cerr << "+++++++++++++++++++++++++\n";
	*/
	
	// 倍增维护影跃 
	for(int i = 1; i <= k; ++i)
	{
		Hs[p[i].x].insert({p[i].y, p[i].c});
		Vs[p[i].y].insert({p[i].x, p[i].c});
	}
	for(int i = 1; i <= k; ++i)
	{
		Point pt = calc(p[i]);
		if(0 <= min(pt.x, pt.y) && max(pt.x, pt.y) <= m)
		{
			f[i][0] = mp[{pt.x, pt.y}];
			g[i][0] = abs(pt.x - p[i].x) + abs(pt.y - p[i].y);
		}
	}
	for(int i = 1; i <= lg; ++i)
	{
		for(int j = 1; j <= k; ++j)
		{
			f[j][i] = f[f[j][i - 1]][i - 1];
			g[j][i] = min(INF, g[j][i - 1] + g[f[j][i - 1]][i - 1]);
		}
	}
	
	// 处理询问 
	function < Point (Point, Point, long long) > simu = [&](Point pos, Point nxt, long long d)
	{
		// 用于计算距离不够的情况 
		if(pos.x > nxt.x) return (Point){pos.x - d, pos.y};
		else if(pos.x < nxt.x) return (Point){pos.x + d, pos.y};
		else if(pos.y > nxt.y) return (Point){pos.x, pos.y - d};
		else return (Point){pos.x, pos.y + d};
	};
	function < Point (Point, long long, bool) > work = [&](Point pos, long long dist, bool debug_mode)
	{
		int ID = 0;
		if(mp.count({pos.x, pos.y}))
		{
			ID = mp[{pos.x, pos.y}];
			pos = p[ID]; // 调整方向 
		}
		else
		{
			Point nx = calc(pos);
			if(0 <= min(nx.x, nx.y) && max(nx.x, nx.y) <= m)
			{
				ID = mp[{nx.x, nx.y}];
//				cerr << "! " << nx.x << " " << nx.y << " " << ID << '\n';
				if(abs(nx.x - pos.x) + abs(nx.y - pos.y) < dist)
					dist -= abs(nx.x - pos.x) + abs(nx.y - pos.y);
				else return simu(pos, nx, dist);
			}
			else return simu(pos, nx, dist);
		}
		
		for(int i = lg; i >= 0; --i)
		{
			if(f[ID][i] && g[ID][i] < dist)
			{
				dist -= g[ID][i];
				ID = f[ID][i];
			}
		}
		
		return simu(p[ID], calc(p[ID]), dist);
	};
	for(int i = 1; i <= t; ++i)
	{
		Point ans = work(q[i], dist[i], false);
		ans.x = max(ans.x, 0ll), ans.x = min(ans.x, 1ll * m);
		ans.y = max(ans.y, 0ll), ans.y = min(ans.y, 1ll * m);
		cout << ans.x << " " << ans.y << '\n';
	}
	
	return 0;
}
/*
1 10
1 5 9 5
1
5 5 L 1
*/
```

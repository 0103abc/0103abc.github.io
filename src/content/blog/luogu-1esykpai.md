---
title: "P12936 [NERC 2019] Cactus Revenge 题解"
date: "2026-05-05T07:24:50.000Z"
link: "luogu-1esykpai"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造", "图论", "树", "基础算法", "贪心"]
draft: false
---

考虑先构造一些特殊情况。

树的情况是简单的，直接用 Prufer 序列构造即可。

所有结点的度数都是 $2$ 也是简单的，直接构造一个简单环即可。

考虑更一般的情况。容易发现若所有点度数的和为奇数则必然无解，后面记这个度数的和为 $\text{sum\_deg}$。然后考虑计算仙人掌相比树结构多的边数 $c=\frac{\text{sum\_deg}}2-n+1$，则显然 $c<0$ 时也无解。

然后考虑重复执行下面的构造流程：

+ 若此时仙人掌的剩余部分形如一个树结构，则直接用 Prufer 序列构造树即可。
+ 若此时剩余点度数均为 $2$，则直接给剩余点构造一个环即可。
+ 否则，容易证明此时若存在合法仙人掌可以被构造，则剩余部分点的度数的最小值一定为 $1$ 或 $2$。对这个最小值进行分类讨论：
  + 若度数的最小值为 $1$，则任意取出一个度数为 $1$ 的结点，贪心的选择其连向剩余部分的唯一一条边的另一端点。此时发扬~~妖精的魔法~~人类智慧想到让一个点度数为偶数构造起来相对更容易（感性理解，注意到度数最小值为 $2$ 时不会改变结点度数的奇偶性，此时让结点度数为偶数能够更好的消去所有度数），然后再次发扬人类智慧选一个剩余度数更多的点连向当前点一定比选一个剩余度数更少的点要好。
  + 因此选该结点最后一条向外连的边的策略为：
    + 若此时仍然存在度数为奇数且非 $1$ 的点，则选取这样的点里度数最大的点和其连边，并更新当前度数值。
    + 否则，若此时存在度数为偶数且非 $1$ 的点，则选取这样的点里度数里最大的点和其连边，并更新当前度数值。
    + 否则，可以证明此时无法选择一个点和该结点连边，直接判定为无解即可。
  + 若度数的最小值为 $2$，则此时第三次发扬人类智慧，考虑只通过构造三元环结构来构造出整个仙人掌的形态。此时因为选取三个点构造三元环结构会导致每个点的度数都减少 $2$，因此此时必须再找出另外一个度数为 $2$ 的点和另外一个度数不为 $2$ 的点，让这三个点构成一个三元环结构（否则无法保证构造出的图是仙人掌）。第四次发扬人类智慧，选取剩余度数不为 $2$ 的点里度数最大的点和当前选取的两个点连成一个三元环。

直接模拟上述构造策略可以做到时间复杂度 $O(n^2)$。据说可以用广义串并联图做到更优的时间复杂度，但是我不太会/kel

```cpp line-numbers
// #pragma GCC optimize(3, "Ofast", "inline", "unroll-loops")
#include <bits/stdc++.h>
#define int long long
using namespace std;
bool beginmem;
constexpr int N = 500010;
constexpr int mod = 998244353;
constexpr int inf = 1e18;

template<class _Tp>
inline void chkmax(_Tp &a, const _Tp b) {
	if (a < b) a = b;
}

int deg[N], sum[N], used[N], buc[N], remov[N];

inline void sol() {
	int n; cin >> n;
	int sum_deg = 0;
	for (int i = 1; i <= n; ++i) cin >> deg[i], sum_deg += deg[i];
	if ((sum_deg & 1) || sum_deg / 2 - n + 1 < 0) { cout << -1 << '\n'; return; }
	int c = sum_deg / 2 - n + 1, cnt = n;
	vector<pair<int, int>> e;
	for (int i = 1; i <= n; ++i) used[i] = 1;
	while (1) {
		if (!c) {
			vector<int> nds; int s = 0;
			for (int i = 1; i <= n; ++i) if (used[i]) nds.emplace_back(i), s += deg[i];
//			cerr << "hahaha " << nds.size() << ' ' << s << '\n';
			if (s + 2 != 2 * nds.size()) { cout << -1 << '\n'; return; }
			if (nds.size() == 1) break;
			for (int &i : nds) if (deg[i] < 1) { cout << -1 << '\n'; return; }
			for (int i = 1; i <= n; ++i) buc[i] = remov[i] = 0;
			vector<int> prufer;
			for (int &i : nds) {
				buc[i] = deg[i] - 1;
				for (int j = 1; j < deg[i]; ++j) prufer.emplace_back(i);
			}
			priority_queue<int, vector<int>, greater<int>> q;
			for (int &i : nds) if (!buc[i]) q.emplace(i);
			for (int &i : prufer) {
				while (q.size() && remov[q.top()]) q.pop();
				if (q.empty()) { cout << -1 << '\n'; return; }
				int t = q.top(); q.pop();
				remov[t] = 1, e.emplace_back(t, i);
//				cerr << "ae1 " << t << ' ' << i << '\n';
				if (!--buc[i]) q.emplace(i);
			}
			vector<int> vec;
			for (int &i : nds) if (!remov[i]) vec.emplace_back(i);
			if (vec.size() != 2) { cout << -1 << '\n'; return; }
			e.emplace_back(vec[0], vec[1]);
			break;
		}
		int leaf = -1;
		for (int i = 1; i <= n; ++i)
			if (used[i] && deg[i] == 1) { leaf = i; break; }
		if (~leaf) {
			int up = -1;
			for (int i = 1; i <= n; ++i)
				if (i != leaf && used[i] && deg[i] > 1 && deg[i] % 2)
					if (!~up || deg[i] > deg[up]) up = i;
			if (!~up) {
				for (int i = 1; i <= n; ++i)
					if (i != leaf && used[i] && deg[i] > 1)
						if (!~up || deg[i] > deg[up]) up = i;
			}
			if (!~up) { cout << -1 << '\n'; return; }
			e.emplace_back(leaf, up), --deg[leaf], --deg[up], used[leaf] = 0, --cnt;
//			cerr << "ae3 " << leaf << ' ' << up << '\n';
			continue;
		}
		int ok = 1, up = -1;
		vector<int> two;
		for (int i = 1; i <= n; ++i) if (used[i])
			if (deg[i] == 2) two.emplace_back(i);
			else {
				ok = 0;
				if (deg[i] > 2)
					if (!~up || deg[i] > deg[up]) up = i;
			}
		if (c == 1 && ok && cnt >= 3) {
			vector<int> nds;
			for (int i = 1; i <= n; ++i) if (used[i]) nds.emplace_back(i);
			for (int i = 0; i < nds.size(); ++i) e.emplace_back(nds[i], nds[(i + 1) % nds.size()]);
			break;
		}
		if (!~up || two.size() < 2) { cout << -1 << '\n'; return; }
		assert(two.size() >= 2);
		e.emplace_back(two[0], two[1]), e.emplace_back(up, two[0]), e.emplace_back(up, two[1]);
		used[two[0]] = used[two[1]] = 0, deg[two[0]] -= 2, deg[two[1]] -= 2, deg[up] -= 2, --c, cnt -= 2;
	} cout << e.size() << '\n';
	for (auto &X : e) cout << 2 << ' ' << X.first << ' ' << X.second << '\n';
}
bool endmem;

signed main() {
//	freopen("disappear.in", "r", stdin);
//	freopen("disappear.out", "w", stdout);
	cin.tie(0)->sync_with_stdio(false);
	int T = 1;
//	cin >> T;
	while (T--) sol();
	cerr << "Memory Used " << abs(&beginmem - &endmem) / 1048576. << " MB.\n";
	return 0;
}
```

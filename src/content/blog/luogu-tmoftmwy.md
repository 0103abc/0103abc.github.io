---
title: "AT_arc122_d [ARC122D] XOR Game 题解"
date: "2026-03-23T03:32:41.000Z"
link: "luogu-tmoftmwy"
categories: ["题解"]
tags: ["AtCoder", "基础算法", "贪心"]
draft: false
---

感觉是比较套路的题？注意到问题可以转化为把 $2n$ 个数分成 $n$ 个二元组，使得每个二元组内两个数的异或的最大值最小。套路的从二进制的高位开始向低位考虑：

+ 若当前位上有偶数个数二进制表示为 $1$，则显然可以贪心的两两分组使得 $1$ 和 $1$ 分组 $0$ 和 $0$ 分组，因此直接按二进制 $0,1$ 分为两组然后分别递归处理即可。
+ 若当前位上有奇数个数二进制表示为 $1$，则必然需要找恰好一组数使得其中一个数二进制表示为 $1$，另一个数二进制表示为 $0$。直接贪心的找出一组异或最小的数，可以证明这个贪心策略正确。用 01-Trie 维护信息，时间复杂度为 $O(n\log V)$ 可以通过该题。

```cpp line-numbers
namespace Loyalty
{
    inline void init() {}
    struct Node
    {
    	int ne[2], cnt;
    	inline Node() { ne[0] = ne[1] = cnt = 0; }
	} tree[200010 * 30];
	int idx = 1;
	inline void ins(int x)
	{
		int now = 1;
		for (int i = 29; ~i; --i)
		{
			++tree[now].cnt;
			if (!tree[now].ne[x >> i & 1])
				tree[now].ne[x >> i & 1] = ++idx;
			now = tree[now].ne[x >> i & 1];
		}
		++tree[now].cnt;
	}
	inline pair<int, int> qry(int x)
	{
		int now = 1, val = 0, anot = 0;
		for (int i = 29; ~i; --i)
		{
			if (tree[now].ne[x >> i & 1])
				now = tree[now].ne[x >> i & 1], anot |= (x >> i & 1) * (1 << i);
			else
				now = tree[now].ne[~x >> i & 1], val |= (1 << i), anot |= (~x >> i & 1) * (1 << i);
		}
		return {anot, val};
	}
    inline int solve(vector<int> &a, int dep)
    {
    	if (a.empty())
    		return 0;
    	if (a.size() == 2)
    		return a[0] ^ a[1];
    	if (dep < 0)
    		return 0;
    	vector<int> v1, v2;
    	for (int &i : a)
    		((i >> dep & 1) ? v1 : v2).emplace_back(i & (INT_MAX ^ (1 << dep)));
    	assert(v1.size() % 2 == v2.size() % 2);
    	if (~v1.size() & 1)
    		return max(solve(v1, dep - 1), solve(v2, dep - 1));
    	else
    	{
    		for (int &i : v1)
    			ins(i);//, cerr << "ins: " << i << '\n';
    		int anot = -1, val = 1e18, now = -1;
    		for (int &i : v2)
    		{
    			pair<int, int> tmp = qry(i);
    			int x = tmp.first, y = tmp.second;
    			if (y < val)
    				val = y, anot = i, now = x;
			}
			v1.clear(), v2.clear();
			for (int &i : a)
				if (i >> dep & 1)
				{
					if ((i & (INT_MAX ^ (1 << dep))) == now)
						now = -1;
					else
						v1.emplace_back(i & (INT_MAX ^ (1 << dep)));
				}
				else
				{
					if ((i & (INT_MAX ^ (1 << dep))) == anot)
						anot = -1;
					else
						v2.emplace_back(i & (INT_MAX ^ (1 << dep)));
				}
			for (int i = 0; i <= idx + 1; ++i)
				tree[i].ne[0] = tree[i].ne[1] = tree[i].cnt = 0;
			idx = 1;
    		return max({solve(v1, dep - 1), solve(v2, dep - 1), val + (1 << dep)});
		}
	}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n;
        cin >> n;
        vector<int> a;
        for (int i = 1; i <= n + n; ++i)
        {
        	int x;
        	cin >> x;
        	a.emplace_back(x);
		}
        cout << solve(a, 29) << '\n';
    }
} // namespace Loyalty
```

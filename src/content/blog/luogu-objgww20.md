---
title: "CF1975G Zimpha Fan Club 题解"
date: "2026-03-03T07:41:57.000Z"
link: "luogu-objgww20"
categories: ["题解"]
tags: ["Codeforces", "字符串", "数学", "多项式", "基础算法", "贪心"]
draft: false
---

用时：50 分 3 秒。

考虑先简化问题。若 $s$ 和 $t$ 的第一个字符不是 ```*```，那么这两个字符一定匹配，可以把原问题规约为去掉第一个字符的问题。相似的，两个串的末尾也能做这种简化。

然后我们发现，假设 $s$ 的开头和 $t$ 的末尾都是 ```*```，那么一定有解。否则其中一个字符串的首尾都是 ```*```，假设这个串就是 $s$。

此时如果 $t$ 包含 ```*```，容易发现一定有解。否则以 ```*``` 为界把 $s$ 划分为若干个小串，原问题变为能否依次把这些小串嵌入 $t$ 中。

这里我们需要使用一种工具，即 NTT 优化带通配符字符串匹配。这个算法可以 $O(n \log n)$ 时间下匹配两个长度至多为 $n$ 的字符串。我们使用贪心算法，对于每个小串，找出最靠前的匹配位置，然后去掉 $t$ 开头的这一部分再归约到子问题重复求解。

直接二分长度或者倍增会多至少一个 $O(\log)$，无法通过。我们需要使用定长分块平衡复杂度。考虑当前的小串的长度是 $len$，我们可以以 $len$ 为块长对 $t$ 分块，这样一来字符串最多只可能出现在两个相邻的块之间，我们每次仅取出 $t$ 的前两块用 NTT 匹配。如果找不到位置，说明第一块没用，直接删除第一块即可。

因为每多做一个 $O(len \log len)$ 的 NTT 就要删除 $t$ 的 $len$ 个字符，因此复杂度是 $O(n \log n)$。此处视 $n, m$ 同阶。

```cpp
/* 省选：2026.3.7 */
/* YMao99! */
/* Hatsune Miku x Kasane Teto */
#include <bits/stdc++.h>
#define lowbit(x) ((x) & (-(x)))
using namespace std;

const int N = 2000010;
const int mod = 167772161, g = 3, gi = (mod + 1) / g;

inline void No() {cout << "No" << '\n'; exit(0);}
inline void Yes() {cout << "Yes" << '\n'; exit(0);}
inline bool check(char x, char y)
{
	if(x == '-' || y == '-') return true;
	else return (x == y);
}

inline long long qpow(long long a, long long b)
{
	long long res = 1;
	while(b) {if(b & 1) res = res * a % mod; b >>= 1, a = a * a % mod;}
	return res;
}
int rev[N * 4];
struct Poly
{
	vector < long long > f;
	inline void NTT(int len, int type)
	{
		f.resize(len, 0);
		for(int i = 0; i < len; ++i) rev[i] = (rev[i / 2] / 2 + ((i & 1) ? (len / 2) : 0));
		for(int i = 0; i < len; ++i) if(i > rev[i]) swap(f[i], f[rev[i]]);
		for(int i = 1; (1 << i) <= len; ++i)
		{
			long long wn = qpow((type == 1) ? g : gi, (mod - 1) >> i);
			for(int j = 0; j < len; j += (1 << i))
			{
				long long w = 1;
				for(int k = j; k < j + (1 << (i - 1)); ++k, w = w * wn % mod)
				{
					long long n1 = f[k], n2 = f[k + (1 << (i - 1))] * w % mod;
					f[k] = (n1 + n2) % mod, f[k + (1 << (i - 1))] = (n1 - n2 + mod) % mod;
				}
			}
		}
		if(type == -1)
		{
			long long iv = qpow(len, mod - 2);
			for(int i = 0; i < len; ++i) f[i] = 1ll * f[i] * iv % mod;
		}
	}
	
	inline void output() {for(long long x : f) cout << x << " "; cout << '\n';}
};
Poly operator * (Poly u, Poly v)
{
	int r_len = u.f.size() + v.f.size() - 1;
	int len = 1; while(len < r_len) len <<= 1;
	u.NTT(len, 1), v.NTT(len, 1);
	Poly res; for(int i = 0; i < len; ++i) res.f.push_back(u.f[i] * v.f[i] % mod);
	res.NTT(len, -1); res.f.resize(r_len); return res;
}

int n, m; deque < char > s, t;

inline int to_num(char c)
{
	if(c == '-') return 0;
	else return c - 'a' + 1;
}
inline int match(string str, string tmp)
{
	reverse(str.begin(), str.end());
	
	// 预处理需要用到的多项式 
	Poly f_s[3], f_t[3]; // 分别是 s, t 的元素的 1, 2, 3 次方 
	for(int i = 0; i < (int)str.length(); ++i)
	{
		int sum = to_num(str[i]);
		for(int j = 0; j <= 2; ++j)
		{
			f_s[j].f.push_back(sum);
			sum = sum * to_num(str[i]);
		}
	}
	for(int i = 0; i < (int)tmp.length(); ++i)
	{
		int sum = to_num(tmp[i]);
		for(int j = 0; j <= 2; ++j)
		{
			f_t[j].f.push_back(sum);
			sum = sum * to_num(tmp[i]);
		}
	}
	
	// 计算哈希值 
	vector < long long > chk(str.length() + tmp.length(), 0);
	function < void (Poly, int) > upd = [&](Poly result, int val)
	{
		for(int i = 0; i < (int)str.length() + (int)tmp.length() - 1; ++i)
			chk[i] = (chk[i] + result.f[i] * val % mod + mod) % mod;
	};
	upd(f_s[2] * f_t[0], 1);
	upd(f_s[1] * f_t[1], -2);
	upd(f_s[0] * f_t[2], 1);
	
	// 找最优位置 
	for(int i = 0; i < (int)tmp.length() - (int)str.length() + 1; ++i)
		if(!chk[i + str.length() - 1])
			return i;
	return -1;
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
	
	/*
	mt19937_64 rnd(chrono::steady_clock::now().time_since_epoch().count());
	function < char () > get = [&]() {return rnd() % 26 + 'a';};
	s.push_back('*'); for(int i = 2; i <= n - 1; ++i) s.push_back(get()); s.push_back('*');
	for(int i = 1; i <= m; ++i) t.push_back(get());
	*/
	
	for(int i = 1; i <= n; ++i) {char c; cin >> c, s.push_back(c);}
	for(int i = 1; i <= m; ++i) {char c; cin >> c, t.push_back(c);}
	
	// 掐头去尾 
	while(s.size() && t.size() && s.front() != '*' && t.front() != '*')
	{
		if(check(s.front(), t.front())) s.pop_front(), t.pop_front();
		else No();
	}
	while(s.size() && t.size() && s.back() != '*' && t.back() != '*')
	{
		if(check(s.back(), t.back())) s.pop_back(), t.pop_back();
		else No();
	}
	
	if(t.empty()) s.swap(t);
	
	// 情况一：其中一个是空串 
	if(s.empty())
	{
		for(char c : t) if(c != '*') No();
		Yes();
	}
	
	// 情况二：一定有解 
	if(s.front() == '*' && t.back() == '*') Yes();
	if(s.back() == '*' && t.front() == '*') Yes();
	
	// 情况三：需要 NTT 判断 
	if(t.front() == '*' && t.back() == '*') s.swap(t);
	for(char c : t) if(c == '*') Yes();
	while(!s.empty())
	{
		/*
		for(char c : s) cerr << c; cerr << '\n';
		for(char c : t) cerr << c; cerr << '\n';
		*/
		
		if(s.front() == '*') s.pop_front();
		else
		{
			string str = ""; // 这是亟待匹配的字符串 
			while(!s.empty() && s.front() != '*') str += s.front(), s.pop_front();
			while(true) // 定长分块尝试匹配 
			{
				if(t.size() < str.length()) No(); // 不够匹配，直接无解 
				string tmp = ""; // 这是当前用来试验的字符串 
				for(int i = 0; i < min(2 * (int)str.length(), (int)t.size()); ++i) tmp += t[i];
				int ID = match(str, tmp);
				if(ID == -1)
				{
					// 匹配不到，说明前 len 个字符都是没用的，直接弹出 
					for(int i = 1; i <= (int)str.length(); ++i) t.pop_front();
					continue;
				}
				else
				{
					// 匹配到了，弹出对应的字符之后退出循环 
					for(int i = 0; i < ID; ++i) t.pop_front();
					for(int i = 1; i <= (int)str.length(); ++i) t.pop_front();
					break;
				}
			}
		}
	}
	
	Yes(); // 都能匹配就是有解 
	
	return 0;
}
/*
先掐头去尾并判断几种显然的情况，剩下的可以规约为 t 没有 *，且 s 的头尾都有 * 
原问题变为能否把 s 分几段按照顺序匹配进 t 的子串 
*/
```

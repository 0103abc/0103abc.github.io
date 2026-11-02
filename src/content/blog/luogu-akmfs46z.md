---
title: "P14238 [CCPC 2024 Shandong I] 三角形 题解"
date: "2026-10-23T13:15:05.000Z"
link: "luogu-akmfs46z"
categories: ["题解"]
tags: ["洛谷", "字符串", "数学", "组合数学"]
draft: false
---

先观察性质，三个串 $A,B,C$（$A\ge B,C$）可以组成三角形当且仅当 $BC>A$ 或 $CB>A$ 成立。因此考虑对串的大小关系做分类讨论。

### $A=B\ge C$

容易证明此时 $A,B,C$ 三个串一定可以构成合法的三角形。记 $cnt_s$ 表示给定的字符串中有多少个串恰好为 $s$，$f_s$ 表示给定的字符串中有多少个字符串的字典序比 $s$ 小。那么该情况对答案的贡献显然就是 $\frac{cnt_A(cnt_A-1)(cnt_A-2)}6+f_A\times\frac{cnt_A(cnt_A-1)}2$。

### $A>B,C$

此时 $A,B,C$ 可以组成三角形当且仅当 $B,C$ 中至少有一个是 $A$ 串的前缀。为了方便后面设 $B$ 是 $A$ 的前缀。则此时 $A$ 串除掉 $B$ 串这个前缀的剩余部分必须字典序小于 $C$ 串，$A,B,C$ 三个串才可以组成三角形。因此考虑建 Trie 枚举字符串的前缀 $B$，这个前缀对答案的贡献就是 $cnt_{B}\times\max(0,f_B-f_{suf}-cnt_{suf})$，其中 $suf$ 是串 $A$ 除了前缀 $B$ 以外剩下的后缀部分。

然后这个东西就算重了，考虑容斥掉重复计算的部分。可以发现若 $B>suf$ 则 $B=C$ 的情况答案被多统计了一次，需要额外减掉 $\frac{cnt_B(cnt_B+1)}2$；若两个不同前缀 $B_1,B_2$ 同时满足 $B>suf_C,C>suf_B$ 则答案也会被计算两次，这个部分可以把所有前缀直接按字典序排名处理。具体的，设其所有合法真前缀为 $p_1,p_2,\ldots,p_k$ 对应的剩余后缀部分为 $q_1,q_2,\ldots,q_k$ 则对 $i<j$，$p_i,p_j$ 这两个前缀被重复计算当且仅当 $p_j>q_i\land p_i>q_j$，记 $a_i=rk(p_i),b_i=rk(q_i)$ 则固定 $j$ 时重复算的 $i$ 满足 $b_i<a_j\land b_j<a_i<a_j$ 直接二维偏序处理即可。

---

时间复杂度为 $O(n\log n)$，代码细节稍微有点多，然后稍微有点卡常。

```cpp line-numbers
namespace lowspeed_song {

mt19937_64 mt(time(0));

inline void init() {
}

int a[N];

struct BIT {
    int tree[N];
    inline BIT() { memset(tree, 0, sizeof tree); }
    inline void clr(int x) { for (; x < N; x += (x &- x)) tree[x] = 0; }
    inline void add(int x, int v) { for (; x < N; x += (x &- x)) tree[x] += v; }
    inline int qry(int x) { int s = 0; for (; x; x -= (x &- x)) s += tree[x]; return s; }
    inline int qry(int l, int r) { return qry(r) - qry(l - 1); }
} fwt;

char s[N];

namespace Suffix_Array {
    int sa[N], rk[N], buc[N], height[N], n, idx, id[N], len[N];
    // id[i]: 从位置 i 开始到下一个 # 为止的字符串 在所有不同字符串中的字典序的排名是多少
    struct Node {
        int x[2], buc;
        inline Node() { x[0] = x[1] = buc = 0; }
        inline Node(int a, int b, int c) { x[0] = b, x[1] = a, buc = c; }
    } a[N], b[N];
    inline void sort(int up) {
        for (int i : {0, 1}) {
            memset(buc, 0, sizeof buc);
            for (int j = 1; j <= n; ++j) ++buc[a[j].x[i]];
            for (int j = 1; j <= up; ++j) buc[j] += buc[j - 1];
            for (int j = n; j; --j) b[buc[a[j].x[i]]--] = a[j];
            for (int j = 1; j <= n; ++j) a[j] = b[j];
        }
        int idx = 1;
        rk[a[1].buc] = 1;
        for (int i = 2; i <= n; ++i)
            if (a[i].x[0] == a[i - 1].x[0] && a[i].x[1] == a[i - 1].x[1]) rk[a[i].buc] = idx;
            else rk[a[i].buc] = ++idx;
    }
    inline int build() {
        for (int i = 1; i <= n; ++i) a[i] = Node(s[i], 1, i);
        sort(128);
        for (int i = 1; i < n; i <<= 1) {
            for (int j = 1; j <= n; ++j) a[j] = Node(rk[j], (i + j <= n) ? rk[i + j] : 0, j);
            sort(n);
        } for (int i = 1; i <= n; ++i) sa[rk[i]] = i;
        for (int i = 1; i <= n; ++i)
            if (rk[i] == 1) height[rk[i]] = 0;
            else {
                int p = sa[rk[i] - 1], l = max<int>(0, height[rk[i - 1]] - 1);
                while (i + l <= n && p + l <= n && s[i + l] == s[p + l]) ++l;
                height[rk[i]] = l;
            }
        len[n + 1] = 0;
        for (int i = n; i; --i) len[i] = (s[i] == '#') ? 0 : len[i + 1] + 1;
        int las = -1, g = 0;
        for (int i = 1; i <= n; ++i) if (s[sa[i]] != '#') {
            if (!~las || len[sa[i]] != len[las] || height[i] < len[sa[i]]) ++g;
            id[sa[i]] = g, las = sa[i];
        } return g;
    }
} // namespace Suffix_Array

#define SA Suffix_Array

struct TrieNode {
    int ne[26], cnt, id;
    inline TrieNode() { memset(ne, cnt = id = 0, sizeof ne); }
} tree[N];

int idx = 0, endpos[N];

inline void ins(string s, int id) {
    int now = 0;
    for (char &i : s) {
        if (!tree[now].ne[i - 'a']) tree[now].ne[i - 'a'] = ++idx;
        now = tree[now].ne[i - 'a'];
    } ++tree[now].cnt, endpos[id] = now;
}

string str[N];
int st[N], pre[N], buc[N], vis[N], rk[N];

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n; cin >> n;
    #define sidx SA::n
    sidx = 0;
    for (int i = 0; i < n; ++i) {
        cin >> str[i];
        st[i] = sidx + 1;
        for (char &j : str[i]) s[++sidx] = j;
        s[++sidx] = '#';
        ins(str[i], i);
    } int m = SA::build();
    fill(buc, buc + m + 1, 0), fill(vis, vis + idx + 1, 0);
    for (int i = 0; i < n; ++i) ++buc[SA::id[st[i]]], tree[endpos[i]].id = SA::id[st[i]];
    pre[1] = 0; for (int i = 2; i <= m; ++i) pre[i] = pre[i - 1] + buc[i - 1];
    i64 res = 0;
    for (int i = 0; i < n; ++i) if (!vis[endpos[i]]) {
        vis[endpos[i]] = 1;
        int cnt = tree[endpos[i]].cnt, x = pre[SA::id[st[i]]], u = 0;
        i64 now = 0;
        vector<tuple<int, int, int>> event; // {r, t, c}
        for (int j = 0; j + 1 < str[i].size(); ++j) {
            u = tree[u].ne[str[i][j] - 'a'];
            if (!tree[u].cnt) continue;
            int a = tree[u].id, b = SA::id[st[i] + j + 1];
            now += 1ll * tree[u].cnt * max<int>(0, x - pre[b] - buc[b]);
            if (a > b) now -= 1ll * tree[u].cnt * (tree[u].cnt + 1) / 2;
            event.emplace_back(a, b, tree[u].cnt);
        } vector<int> ord(event.size(), 0); ranges::iota(ord, 0);
        ranges::sort(ord, [&](int i, int j) { return get<1>(event[i]) < get<1>(event[j]); });
        for (int i = 0; i < event.size(); ++i) rk[i] = get<0>(event[i]);
        vector<int> fwt_used;
        int pos = 0;
        for (int j = 0; j < event.size(); ++j) {
            while (pos < event.size() && get<1>(event[ord[pos]]) < get<0>(event[j]))
                fwt.add(ord[pos] + 1, get<2>(event[ord[pos]])), fwt_used.emplace_back(ord[pos++] + 1);
            int las = upper_bound(rk, rk + event.size(), get<1>(event[j])) - rk;
            if (las < j) now -= 1ll * get<2>(event[j]) * fwt.qry(las + 1, j);
        } for (int &i : fwt_used) fwt.clr(i);
        res += 1ll * cnt * (cnt - 1) * (cnt - 2) / 6 + 1ll * cnt * (cnt - 1) / 2 * x + 1ll * now * cnt;
    } cout << res << '\n';
    for (int i = 0; i <= idx; ++i) tree[i] = TrieNode();
    for (int i = 0; i <= n; ++i) endpos[i] = 0;
    idx = 0, SA::idx = 0;
}

} // namespace lowspeed_song
```

---
title: "CF1286E Fedya the Potter Strikes Back 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-cf1286e"
categories: ["题解"]
tags: ["Codeforces", "字符串"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF1286E).
:::

:::info[Solution]{open}
~~太棒了我不会 KMP。~~

考虑每次只处理新加入字符对答案额外的贡献。设当前处理到的位置为 $i$，则区间 $[l,i]$ 是合法的当且仅当其是字符串的一个 border。加入新字符后以前的 border 有两种情况：

+ 她期待的下一个字符等于当前字符，则继续延长长度。
+ 否则，将会永久失效。

考虑类比 KMP 的结构，用 KMP 的失配链维护所有的 border，然后按照下一步期待哪个字符来分类以快速的删除所有失配的 border。因为每个 border 最多会被删除一次，因此均摊一下可得总删除次数为 $O(n)$。

然后考虑怎么算贡献。每个 border 对应一段区间，其贡献是区间权值最小值。考虑用 map 来对每个最小值 $x$ 维护最小值为 $x$ 的 border 有多少个，然后每次更新操作把所有大于 $w_i$ 的值合并到 $w_i$ 中即可。border 失效时用 ST 表查询其原来区间最小值然后从贡献中删除即可。

总时间复杂度为 $O(n\log n)$，注意最后算答案需要开 int128。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

int lg[N];

inline void init() {
    lg[0] = -1;
    for (int i = 1; i < N; ++i) lg[i] = lg[i >> 1] + 1;
}

inline void out(i128 x) {
    if (x < 10) cout.put(x + '0');
    else out(x / 10), cout.put(x % 10 + '0');
}
inline void write(i128 x) {
    if (x < 0) x = -x, cout.put('-');
    if (!x) cout.put('0');
    else out(x);
}

char s[N];
int st[N][20], pi[N], ne[N][26], sum;
map<int, int> mp;
inline void add(int x, int v) {
    sum += x * v;
    if (!(mp[x] += v)) mp.erase(x);
}
inline void cap(int x) {
    int cnt = 0;
    for (auto it = mp.upper_bound(x); it != mp.end(); it = mp.erase(it))
        cnt += it->second, sum -= it->first * it->second;
    if (cnt) add(x, cnt);
}
inline int qry(int l, int r) {
    int lgx = lg[r - l + 1];
    return min(st[l][lgx], st[r - (1 << lgx) + 1][lgx]);
}

inline void sol() {
    i128 res = 0;
    int n, pre = inf; cin >> n;
    for (int i = 1; i <= n; ++i) {
        char c; int w; cin >> c >> w;
        s[i] = (char)('a' + (c - 'a' + res % 26) % 26), w ^= (int)(res & ((1 << 30) - 1));
        pre = min(pre, st[i][0] = w);
        for (int j = 1; (1 << j) <= i; ++j)
            st[i - (1 << j)][j] = min(st[i - (1 << j)][j - 1], st[i - (1 << (j - 1))][j - 1]);
        if (i > 1) {
            int p = pi[i - 1];
            while (p && s[p + 1] != s[i]) p = pi[p];
            if (s[p + 1] == s[i]) ++p;
            pi[i] = p;
            for (int j = 0; j < 26; ++j) ne[i][j] = ne[p][j];
            if (p) ne[i][s[p + 1] - 'a'] = p;
            for (int j = 0; j < 26; ++j) if (j != s[i] - 'a')
                for (int k = ne[i - 1][j]; k; k = ne[k][j]) add(qry(i - k, i - 1), -1);
            if (s[i] == s[1]) add(w, 1);
            cap(w);
        } res += sum + pre, write(res), cout << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：黑

鲜活指数：9

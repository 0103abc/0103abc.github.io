---
title: "P5287 [HNOI2019] JOJO 题解"
date: "2026-08-04T10:39:57Z"
link: "note-1azbcr6a-p5287"
categories: ["题解"]
tags: ["洛谷", "字符串", "基础算法", "前缀和", "图论", "树"]
draft: false
---

> 原文作者：Priestess_SLG；[做题记录原文](https://www.luogu.com/article/1azbcr6a)。

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P5287).
:::

:::info[Solution]{open}
先把每次加入操作看作是一个连续段，用一个二元组 $(c_i,l_i)$ 表示第 $i$ 段的字符是什么，以及第 $i$ 段字符的数量。维护 $pre_i=\sum\limits_{j=1}^il_j$ 表示前 $i$ 段的实际字符数。然后在这些连续段上跑 KMP，设 $fail_i$ 表示前 $i$ 段组成的字符串最长的右端点落在段尾的 Border 包含多少段。如果 $fail_i=j$ 则说明前 $j$ 段也是前 $i$ 段字符串的后缀，这个 Border 的实际长度为 $pre_j$。

假设现在有 $m$ 段字符，需要加入新段 $(c,x)$。这个操作会产生 $x$ 个新的前缀，分别对应在新的段中加入了 $1,2,3,\ldots,x$ 个字符。 问题在于快速求出这些新前缀的最长 Border。

考虑旧字符串的一个 Border。设其包含前 $j$ 段，长度为 $pre_j$ 则因为这个部分同时是旧字符串的前缀和后缀，所以加入新字符后，只需要检查前缀中第 $j+1$ 段是否能够继续匹配。如果第 $j+1$ 段的字符也是 $c$，那么其可以最多继续匹配 $t=\min(x,l_{j+1})$ 个字符。因此新段中前 $t$ 个位置分别能够得到 $pre_j+1,pre_j+2,\ldots,pre_j+t$ 的 Border。

旧字符串中可能包含很多 Border，她们恰好是从 $fail_m$ 位置开始不断跳 fail 得到的位置。按照 Border 长度从大到小枚举并维护一个信息 $mx$ 表示新段中前 $mx$ 的位置已经被更长的 Border 处理过。对当前的 Border 如果她最多可以覆盖到第 $t$ 个位置，则只有 $mx+1$ 到 $t$ 这些位置需要被额外处理，新增的贡献就是 $(t-mx)pre_j+\frac{(mx+t+1)(t-mx)}2$，然后令 $mx=t$。因为枚举的顺序是从长到短枚举，所以一个位置第一次被处理时得到的一定是她的最长 Border，不会被重复的计算。

沿 fail 链处理完后还需要单独处理字符串的第一段。如果第一段的字符也是 $c$ 那么新段中的字符还可以直接和字符串开头的连续 $c$ 匹配。前 $l_1$ 个位置的 Border 长度依次增长，超过 $l_1$ 后Border 长度保持为 $l_1$。把尚未处理的位置补上这一部分的贡献即可。

在计算新增答案的同时还需要维护新段的 fail 位置。设旧字符串的某个 Border 包含前 $j$ 段，如果第 $j+1$ 段和新段的字符相同且长度也相同，那么整个第 $j+1$ 段都能够匹配，新状态就可以令 $fail_{m+1}=j+1$。这里必须要求长度相同是因为 fail 状态必须在以后继续按照完整段匹配，只匹配到某一段的中间虽然可以对当前答案产生贡献却不能成为后续 kmp 的状态。同样需要特判第一段，如果一段字符等于 $c$ 且 $l_1\le x$ 则新字符串存在长度为 $l_1$ 的 Border，因此可以让 $fail_{m+1}=1$。从最长 Border 开始寻找找到第一个合法位置即可。

如果每次都完整的遍历整个 fail 链则单次操作的时间复杂度可能是 $O(n)$ 的，因为本题需要查询历史版本信息因此直接在版本树上维护时间复杂度可能退化到平方级别。因此考虑利用 Border 的性质：一个字符串的所有 Border 长度可以被划分为不超过 $O(\log n)$ 段等差数列，因此对同一段等差数列只需要检查最长和次长的洛谷 Border 其余部分可以直接条过。为了快速转移，维护一个指针 $skip_i$：如果 $pre_i-pre_{fail_i}=pre_{fail_i}-pre_{fail_{fail_i}}$ 则这几个 Border 属于同一段等差数列，记 $skip_i=skip_{fail_i}$。否则令 $skip_i=fail_i$ 即可。

这样一来，枚举 Border 时每组检查必要的洛谷位置然后直接用 $skip$ 指针跳到下一组就可以保证每次加入操作只会处理不超过 $O(\log n)$ 段 Border。撤销操作是相对容易处理的。因此整个算法的时间复杂度为 $O(n\log n)$，可以通过该题。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

char s[N], t[N], ach[N], ch[N];
int res[N], ver[N], alen[N], len[N], pre[N], fail[N], sumpi[N];
vector<int> adj[N];

inline int calc(int l, int r) {
    return (l + r) * (r - l + 1) / 2;
}

inline void dfs(int u, int dep) {
    int x = alen[u];
    char c = ach[u];
    len[dep] = x, ch[dep] = c;
    pre[dep] = pre[dep - 1] + x, sumpi[dep] = sumpi[dep - 1], fail[dep] = 0;
    if (dep == 1) sumpi[dep] = x * (x - 1) / 2;
    else {
        int d = dep - fail[dep - 1], i = fail[dep - 1];
        while (i && (ch[i + 1] != c || len[i + 1] != x)) {
            if (i - fail[i] == d) i = i % d + d;
            d = i - fail[i], i = fail[i];
        } if (i) fail[dep] = i + 1;
        else if (ch[1] == c && x >= len[1]) fail[dep] = 1;
        i = fail[dep - 1], d = dep - i - 1;
        int mat = 0;
        while (mat < x && i) {
            if (ch[i + 1] == c && len[i + 1] > mat) {
                int r = min(x, len[i + 1]);
                sumpi[dep] += calc(pre[i] + mat + 1, pre[i] + r);
                mat = len[i + 1];
            }
            if (i - fail[i] == d) i = i % d + d;
            d = i - fail[i], i = fail[i];
        }
        if (mat < x && ch[1] == c) {
            if (len[1] > mat) sumpi[dep] += calc(mat + 1, min(x, len[1]));
            mat = max(mat, min(x, len[1])), sumpi[dep] += len[1] * (x - mat);
        }
    } res[u] = sumpi[dep] % mod;
    for (int &v : adj[u]) dfs(v, dep + 1);
}

inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) {
        int o, x; cin >> o >> x;
        if (o == 1) {
            cin >> ach[i], alen[i] = x;
            ver[i] = i, adj[ver[i - 1]].emplace_back(ver[i]);
        } else ver[i] = ver[x];
    } for (int &i : adj[0]) dfs(i, 1);
    for (int i = 1; i <= n; ++i) cout << res[ver[i]] << '\n';
}

} // namespace lowspeed_song

```
:::

难度：黑

鲜活指数：8

---
title: "AT_tdpc_lexicographical 辞書順 题解"
date: "2024-12-12T16:16:38.000Z"
link: "luogu-a612i956"
categories: ["题解"]
tags: ["AtCoder", "字符串", "自动机", "动态规划", "基础算法", "贪心"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/a612i956)。

简单的问题。子序列相关题目考虑在子序列自动机上 dp。套路的，设 $to_{i,j}$ 表示 $i$ 后面第一个字符 $j$ 出现的位置，$f_i$ 表示当前到 $i$ 位置，可以得到的不同的子序列的数目。则 $to_{i,j}$ 显然可以 $O(n)$ 处理，$f_i$ 有转移式：$f_i=\sum\limits_{j=0}^{25}f_{to_{i,j}}+1$。

计算答案的时候直接贪心一下即可。总时间复杂度为 $O(n)$。

我的做法可能稍微有点难写（

```cpp
char s[N];
int to[N][26], f[N];
void run() {
    scanf("%s", s + 1);
    int k = read();
    int n = strlen(s + 1);
    fill(to[n + 1], to[n + 1] + 26, n + 1);
    for (int i = n; ~i; --i) {
        for (int j = 0; j < 26; ++j) to[i][j] = to[i + 1][j];
        if (i != n) to[i][s[i + 1] - 'a'] = i + 1;
    }
    f[n] = 1;
    for (int i = n - 1; i; --i) {
        f[i] = 1;
        for (int j = 0; j < 26; ++j)
            if (to[i][j] != n + 1) f[i] = min(f[i] + f[to[i][j]], k + 1);
    }
    int su = 0;
    for (int i = 0; i < 26; ++i)
        if (to[0][i] != n + 1) {
            su += f[to[0][i]];
            if (su > k) break;
        }
    if (su < k) cout << "Eel\n";
    else {
        for (int st = 0; st < 26; ++st) {
            int now = to[0][st], ok = 0;
            if (k > f[now]) {
                k -= f[now];
                continue;
            }
            if (now == n + 1) continue;
            while (now <= n) {
                if (k == 0) return;
                if (k == 1) {
                    if (!ok) cout << s[now];
                    cout << '\n';
                    return;
                }
                --k;
                for (int j = 0; j < 26; ++j)
                    if (f[to[now][j]] < k) k -= f[to[now][j]];
                    else {
                        if (!ok) ok = 1, cout << (char)(st + 'a');
                        cout << (char)(j + 'a');
                        now = to[now][j];
                        break;
                    }
            }
        }
        cout << '\n';
    }
}
```

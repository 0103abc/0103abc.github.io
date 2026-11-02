---
title: "P15421 像你这样的朋友 题解"
date: "2026-05-29T06:10:53.000Z"
link: "luogu-wcd6p95z"
categories: ["题解"]
tags: ["洛谷", "算法思想", "构造", "数学", "线性代数"]
draft: false
---

这是一个 240 分的做法，为目前最高得分。

满分做法是非常简单的，直接对整张图做三染色即可满足条件。

具体的，记 $(i,j)$ 位置的颜色为 $(i+j)\bmod 3$，则容易证明选取所有颜色相同的格子一定是满足条件的。然后根据鸽巢原理可知此时出现次数最多的颜色，对应的格子数量一定不少于 $\lceil\frac{nm}3\rceil$。

考虑获得更高的分数。看上去这个结构就十分优秀，不存在什么能优一个数量级的构造，因此后面所有的优化均仅限于对构造出的矩阵做常数级的修改。

这里先给出一个简单的构造：$(i,j)$ 格子放棋子当且仅当 $j\bmod 3\neq 2$ 且 $(\lfloor\frac i2\rfloor\oplus\lfloor\frac j3\rfloor)\bmod 2=t$，其中 $t\in\lbrace 0,1\rbrace$。

更直观的理解是，先将棋盘切割成若干个 $2\times 3$ 的大块。具体的，考虑下面两种形态的 $2\times 3$ 块：

A 类块形如：

```text
xxo
xxo
```

B 类块形如：

```text
ooo
ooo
```

然后在大块上的操作就是黑白染色。容易证明这个策略正确性没有问题。

$n\not\equiv 3\pmod 0$ 时上面的构造已经十分优秀，但是 $n\equiv 3\pmod 0$ 时构造正好取到了下界 $\frac{nm}3$。此时考虑在残块（边界）上做一些小小的处理。按 $n\bmod 24$ 的值进行进一步的分类。这个地方我可能不太清楚怎么描述，所以直接放代码里了可以参考代码了解构造细节。

```cpp line-numbers
inline void sol() {
    function<void(string&, string)> push = [&](string &res, string additional) -> void {
        for (char &i : additional) res.push_back(i);
    };
    for (int n = 1; n <= 270; ++n) {
        if (n < 100) {
            int buc[3] = {0};
            for (int i = 1; i <= n; ++i)
                for (int j = 1; j <= n; ++j) ++buc[(i + j) % 3];
            int id = max_element(buc, buc + 3) - buc;
            for (int i = 1; i <= n; ++i, cout << '\n')
                for (int j = 1; j <= n; ++j) cout << (((i + j) % 3 == id) ? "x" : "o");
        } else if (n == 105) {
            string res[105];
            for (int i = 0; i < n; ++i) {
                for (int j = 0; j < n - 7; ++j)
                    res[i].push_back((j % 3 != 2 && (~((i / 2) ^ (j / 3)) & 1)) ? 'x' : 'o');
                if (!i) push(res[i], "ooxxo");
                else if (i % 8 == 0) push(res[i], "ooxoo");
                else if (i % 8 == 1) push(res[i], "oooxo");
                else if (i % 8 == 2) push(res[i], "oxooo");
                else if (i % 8 == 3) push(res[i], "oxxoo");
                else if (i % 8 == 4) push(res[i], "ooooo");
                else if (i % 8 == 5) push(res[i], "ooxxo");
                else if (i % 8 == 6) push(res[i], "oooxo");
                else push(res[i], "oxooo");
                if (i < 2) push(res[i], "ox");
                else if (i == 2) push(res[i], "oo");
                else if (i == 3) push(res[i], "xo");
                else if (i == 4) push(res[i], "xx");
                else if (i % 4 == 1) push(res[i], "oo");
                else if (i % 4 == 2) push(res[i], "oo");
                else push(res[i], "xx");
            }
            res[0][100] = 'o', res[0][102] = 'x', res[0][104] = 'o';
            res[1][101] = 'o', res[1][102] = 'x';
            res[2][100] = 'x', res[2][104] = 'x';
            res[3][103] = 'o';
            res[4][102] = 'x', res[4][104] = 'o';
            res[5][100] = 'o', res[5][101] = 'o', res[5][102] = 'x', res[5][103] = 'x';
            res[6][99] = 'x', res[6][100] = 'x', res[6][101] = 'o';
            res[7][100] = 'x', res[7][103] = 'o';
            res[8][100] = 'o', res[8][102] = 'x', res[8][103] = 'o';
            res[9][102] = 'x';
            for (int i = 0; i < n; ++i) cout << res[i] << '\n';
        } else if (n == 108) {
            string res[108];
            for (int i = 0; i < n; ++i) {
                for (int j = 0; j < n - 4; ++j)
                    res[i].push_back((j % 3 != 2 && (~((i / 2) ^ (j / 3)) & 1)) ? 'x' : 'o');
                if (!i) push(res[i], "ooxx");
                else if (i % 8 == 0) push(res[i], "ooxo");
                else if (i % 8 == 1) push(res[i], "ooox");
                else if (i % 8 == 2) push(res[i], "oxoo");
                else if (i % 8 == 3) push(res[i], "oxxo");
                else if (i % 8 == 4) push(res[i], "oooo");
                else if (i % 8 == 5) push(res[i], "ooxx");
                else if (i % 8 == 6) push(res[i], "ooox");
                else push(res[i], "oxoo");
            }
            res[103][104] = 'x';
            res[104][103] = 'o', res[104][104] = 'x', res[104][106] = 'o';
            res[105][103] = 'o', res[105][106] = 'x';
            res[106][105] = 'o', res[106][106] = 'x', res[106][107] = 'x';
            res[107][103] = 'x', res[107][104] = 'x', res[107][105] = 'o', res[107][106] = 'o';
            for (int i = 0; i < n; ++i) cout << res[i] << '\n';
        } else if (n == 111) {
            string res[111];
            for (int i = 0; i < n; ++i) {
                for (int j = 0; j < n - 4; ++j)
                    res[i].push_back((j % 3 != 2 && ((i / 2) ^ (j / 3)) & 1) ? 'x' : 'o');
                if (!i) push(res[i], "ooxx");
                else if (i % 8 == 0) push(res[i], "ooxo");
                else if (i % 8 == 1) push(res[i], "ooox");
                else if (i % 8 == 2) push(res[i], "oxoo");
                else if (i % 8 == 3) push(res[i], "oxxo");
                else if (i % 8 == 4) push(res[i], "oooo");
                else if (i % 8 == 5) push(res[i], "ooxx");
                else if (i % 8 == 6) push(res[i], "ooox");
                else push(res[i], "oxoo");
            }
            res[103][107] = 'x';
            res[104][106] = 'o', res[104][107] = 'x', res[104][109] = 'o';
            res[105][106] = 'o', res[105][109] = 'x';
            res[106][108] = 'o', res[106][109] = 'x', res[106][110] = 'x';
            res[107][106] = 'x', res[107][107] = 'x', res[107][108] = 'o', res[107][109] = 'o';
            res[108][105] = 'o', res[108][106] = 'o', res[108][107] = 'x';
            res[109][106] = 'o';
            res[110][106] = 'x', res[110][109] = 'x';
            for (int i = 0; i < n; ++i) cout << res[i] << '\n';
        } else if (n % 3) {
            for (int i = 0; i < n; ++i, cout << '\n')
                for (int j = 0; j < n; ++j)
                    cout << (i % 3 != 2 && (~((i / 3) ^ j) & 1) ? "x" : "o");
        } else if (n % 24 == 0 || n % 24 == 6 || n % 24 == 12 || n % 24 == 18) {
            for (int i = 0; i < n; ++i, cout << '\n') {
                for (int j = 0; j < n - 4; ++j)
                    cout << ((j % 3 != 2 && (~((i / 2) ^ (j / 3)) & 1)) ? "x" : "o");
                if (!i) cout << "ooxx";
                else if (i % 8 == 0) cout << "ooxo";
                else if (i % 8 == 1) cout << "ooox";
                else if (i % 8 == 2) cout << "oxoo";
                else if (i % 8 == 3) cout << "oxxo";
                else if (i % 8 == 4) cout << "oooo";
                else if (i % 8 == 5) cout << "ooxx";
                else if (i % 8 == 6) cout << "ooox";
                else cout << "oxoo";
            }
        } else if (n % 24 == 3) {
            for (int i = 0; i < n; ++i, cout << '\n') {
                for (int j = 0; j < n - 7; ++j)
                    cout << ((j % 3 != 2 && (~((i / 2) ^ (j / 3)) & 1)) ? "x" : "o");
                if (!i) cout << "ooxx";
                else if (i % 8 == 0) cout << "ooxo";
                else if (i % 8 == 1) cout << "ooox";
                else if (i % 8 == 2) cout << "oxoo";
                else if (i % 8 == 3) cout << "oxxo";
                else if (i % 8 == 4) cout << "oooo";
                else if (i % 8 == 5) cout << "ooxx";
                else if (i % 8 == 6) cout << "ooox";
                else cout << "oxoo";
                cout << ((i == n - 1) ? "x" : "o");
                if (i < 2) cout << "ox";
                else if (i == 2) cout << "oo";
                else if (i == 3) cout << "xo";
                else if (i == 4) cout << "xx";
                else if (i % 4 == 1) cout << "oo";
                else if (i % 4 == 2) cout << "oo";
                else cout << "xx";
            }
        } else if (n % 24 == 15) {
            for (int i = 0; i < n; ++i, cout << '\n') {
                for (int j = 0; j < n - 4; ++j)
                    cout << ((j % 3 != 2 && (((i / 2) ^ (j / 3)) & 1)) ? "x" : "o");
                if (!i) cout << "ooxx";
                else if (i % 8 == 0) cout << "ooxo";
                else if (i % 8 == 1) cout << "ooox";
                else if (i % 8 == 2) cout << "oxoo";
                else if (i % 8 == 3) cout << "oxxo";
                else if (i % 8 == 4) cout << "oooo";
                else if (i % 8 == 5) cout << "ooxx";
                else if (i % 8 == 6) cout << "ooox";
                else cout << "oxoo";
            }
        } else {
            for (int i = 0; i < n; ++i, cout << '\n') {
                for (int j = 0; j < n - 7; ++j)
                    cout << ((j % 3 != 2 && (~((i / 2) ^ (j / 3)) & 1)) ? "x" : "o");
                if (!i) cout << "ooxxo";
                else if (i % 8 == 0) cout << "ooxoo";
                else if (i % 8 == 1) cout << "oooxo";
                else if (i % 8 == 2) cout << "oxooo";
                else if (i % 8 == 3) cout << "oxxoo";
                else if (i % 8 == 4) cout << "ooooo";
                else if (i % 8 == 5) cout << "ooxxo";
                else if (i % 8 == 6) cout << "oooxo";
                else cout << "oxooo";
                if (i < 2) cout << "ox";
                else if (i == 2) cout << "oo";
                else if (i == 3) cout << "xo";
                else if (i == 4) cout << "xx";
                else if (i % 4 == 1) cout << "oo";
                else if (i % 4 == 2) cout << "oo";
                else cout << "xx";
            }
        }
    }
}
```

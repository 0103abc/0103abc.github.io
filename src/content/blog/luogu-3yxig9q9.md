---
title: "AT_arc136_d [ARC136D] Without Carry 题解"
date: "2026-04-26T09:43:42.000Z"
link: "luogu-3yxig9q9"
categories: ["题解"]
tags: ["AtCoder", "基础算法", "前缀和"]
draft: false
---

> 原文作者：Priestess_SLG；[洛谷原文](https://www.luogu.com/article/3yxig9q9)。

建议降绿。把 $A_i$ 按照十进制拆成 $6$ 位，记这 $6$ 位分别为 $(v_{i,0},v_{i,1},v_{i,2},v_{i,3},v_{i,4},v_{i,5})$，则 $A_i+A_j$ 不会触发进位的充要条件就是 $\forall k\in\lbrace0,1,2,3,4,5\rbrace,v_{i,k}+v_{j,k}<10$，即合法的区间是一个连续的六面体，直接维护六维前缀和即可做到 $O(kn^k)$ 解决问题。

```cpp line-numbers
int a[N], buc[10][10][10][10][10][10];
inline void sol() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) {
        int v[6] = {0}, tmp = a[i];
        for (int j = 0; j < 6; ++j) v[j] = tmp % 10, tmp /= 10;
        ++buc[v[0]][v[1]][v[2]][v[3]][v[4]][v[5]];
    }
    for (int a = 1; a < 10; ++a)
        for (int b = 0; b < 10; ++b)
            for (int c = 0; c < 10; ++c)
                for (int d = 0; d < 10; ++d)
                    for (int e = 0; e < 10; ++e)
                        for (int f = 0; f < 10; ++f)
                            buc[a][b][c][d][e][f] += buc[a - 1][b][c][d][e][f];
    for (int a = 0; a < 10; ++a)
        for (int b = 1; b < 10; ++b)
            for (int c = 0; c < 10; ++c)
                for (int d = 0; d < 10; ++d)
                    for (int e = 0; e < 10; ++e)
                        for (int f = 0; f < 10; ++f)
                            buc[a][b][c][d][e][f] += buc[a][b - 1][c][d][e][f];
    for (int a = 0; a < 10; ++a)
        for (int b = 0; b < 10; ++b)
            for (int c = 1; c < 10; ++c)
                for (int d = 0; d < 10; ++d)
                    for (int e = 0; e < 10; ++e)
                        for (int f = 0; f < 10; ++f)
                            buc[a][b][c][d][e][f] += buc[a][b][c - 1][d][e][f];
    for (int a = 0; a < 10; ++a)
        for (int b = 0; b < 10; ++b)
            for (int c = 0; c < 10; ++c)
                for (int d = 1; d < 10; ++d)
                    for (int e = 0; e < 10; ++e)
                        for (int f = 0; f < 10; ++f)
                            buc[a][b][c][d][e][f] += buc[a][b][c][d - 1][e][f];
    for (int a = 0; a < 10; ++a)
        for (int b = 0; b < 10; ++b)
            for (int c = 0; c < 10; ++c)
                for (int d = 0; d < 10; ++d)
                    for (int e = 1; e < 10; ++e)
                        for (int f = 0; f < 10; ++f)
                            buc[a][b][c][d][e][f] += buc[a][b][c][d][e - 1][f];
    for (int a = 0; a < 10; ++a)
        for (int b = 0; b < 10; ++b)
            for (int c = 0; c < 10; ++c)
                for (int d = 0; d < 10; ++d)
                    for (int e = 0; e < 10; ++e)
                        for (int f = 1; f < 10; ++f)
                            buc[a][b][c][d][e][f] += buc[a][b][c][d][e][f - 1];
    int cnt = 0;
    for (int i = 1; i <= n; ++i) {
        int v[6] = {0}, tmp = a[i];
        for (int j = 0; j < 6; ++j) v[j] = tmp % 10, tmp /= 10;
        if (v[0] < 5 && v[1] < 5 && v[2] < 5 && v[3] < 5 && v[4] < 5 && v[5] < 5) --cnt;
        cnt += buc[9 - v[0]][9 - v[1]][9 - v[2]][9 - v[3]][9 - v[4]][9 - v[5]];
    } cout << cnt / 2 << '\n';
    assert(~cnt & 1);
}

```

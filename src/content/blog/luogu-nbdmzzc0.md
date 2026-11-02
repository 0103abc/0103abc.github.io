---
title: "P15942 [JOI Final 2026] 赌场 / Casino 题解"
date: "2026-10-21T12:03:30.000Z"
link: "luogu-nbdmzzc0"
categories: ["题解"]
tags: ["洛谷", "基础算法", "交互"]
draft: false
---

先考虑 $L\le 49$ 怎么做。此时把平面划分为 $2n-1$ 条反对角线，则每条反对角线必然被恰好翻转一个位置的值。对每条反对角线设一个校验位使得该对角线上所有奇数行位置上元素的异或和都为 $0$。反转完路径后考虑重新计算这个异或和，若收到的奇数行异或和为 $1$ 则说明被反转的位置在奇数行，否则说明被反转的位置在偶数行。此时下一行的两个候选位置行号奇偶性不同，因此必然可以唯一确定被反转的位置。细节有点多。

然后考虑 $L\le 51$ 怎么做。注意到 $(1,1)$ 和 $(n,n)$ 两个位置必然被反转，因此这两个位置的值根本不用进行处理，还原信息的时候直接反转即可。（有一说一这一点其实是有点困难的，至少我花了很久才注意到）

```cpp line-numbers
vector<vector<int>> Azzurro(int n, int L, string s) {
    vector<vector<int>> a(n, vector<int>(n, 0));
    int pp = 0;
    for (int k = 0; k < 2 * n - 1; ++k) {
        int pos = -1;
        if (k && k < 2 * n - 2) for (int i = 1; i < n; i += 2)
            if (k >= i && k - i < n) { pos = i; break; }
        for (int i = 0; i < n; ++i) {
            if (k < i || k - i >= n || i == pos) continue;
            a[i][k - i] = pp < L && s[pp] == 'B', ++pp;
        } if (~pos) for (int i = 1; i < n; i += 2)
            if (k >= i && k - i < n && i != pos) a[pos][k - pos] ^= a[i][k - i];
    } return a;
}

string Bordeaux(int n, int L, vector<vector<int>> a) {
    string s;
    int xx = 0, yy = 0;
    for (int k = 0; k < 2 * n - 1; ++k) {
        int pos = -1, oo = 0;
        if (k && k < 2 * n - 2) for (int i = 1; i < n; i += 2)
            if (k >= i && k - i < n) { if (!~pos) pos = i; oo ^= a[i][k - i]; }
        if (k == 2 * n - 2) xx = yy = n - 1;
        else if (k) ++((oo == (xx & 1)) ? yy : xx);
        a[xx][yy] ^= 1;
        for (int i = 0; i < n; ++i) if (k >= i && k - i < n && i != pos)
            s.push_back(a[i][k - i] + 'A');
    } s.resize(L);
    return s;
}

```

---
title: "CF2246F Whoname and Unsorted Array 题解"
date: "2026-09-06T03:31:52.000Z"
link: "luogu-vud28zyv"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "构造", "基础算法", "模拟"]
draft: false
---

先找操作的不变量，套路的想到操作前后逆序对奇偶性的变化，在 $i$ 位置进行一次操作会产生 $n-2$ 次交换，而逆序对奇偶性和交换次数奇偶性是相同的，因此若 $n$ 初始为偶数则序列的逆序对数永远不会变化，此时若初始逆序对数量为奇数则必然无解。

然后考虑增量构造，每次在数组中维护一个有序的后缀。设当前的后缀为 $1,2,3,\ldots,i-1$ 要把 $i$ 移动到序列的最后面，则考虑先在数组中找到 $i$ 出现的位置 $pos$。此时若 $pos>1$ 则容易想到直接对 $pos-1$ 位置执行一次操作就可以在不影响 $1,2,3,\ldots,i-1$ 的前提下把 $i$ 扔到数组最后面。而如果 $pos=1$ 则需要单独处理，手玩一下发现可以对 $2,1,n-1$ 三个位置依次进行一次操作，就可以在不影响 $1,2,3,\ldots,i-1$ 的前提下把 $i$ 扔到数组的最后面。因此直接枚举 $i=1,2,3,\ldots,n-2$ 就可以把除了 $n-1$ 和 $n$ 以外的所有元素都正确归位。最后数组只剩下两种不同的情况：

+ $[n-1,n,1,2,3,\ldots,n-2]$。
+ $[n,n-1,1,2,3,\ldots,n-2]$。

考虑分别处理这两种情况。第二种情况考虑先对 $1$ 执行一次操作把序列变为 $[n-1,1,2,3,\ldots,n-2,n]$ 然后再连续对 $2$ 位置执行 $n-2$ 次操作最后再对 $1$ 执行一次操作就可以让整个数组有序。而第一类情况有一个特别简单的构造方法就是依次对 $2,1,n-1,1$ 四个位置分别执行一次操作就可以让整个数组变得有序。

操作次数显然不超过 $4n$。因为 $n$ 很小所以直接暴力模拟 $O(n^2)$ 就可以通过该题。

```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

mt19937 mt(time(0));

int a[N], b[N];

inline void sol([[maybe_unused]]int __testcase_id, [[maybe_unused]]int __testcase_sum) {
    int n; cin >> n;
    for (int i : views::iota(1, n + 1))
        cin >> a[i];
    vector<int> ops;
    function<void(int)> op = [&](int pos) -> void {
        assert(1 <= pos && pos <= n);
        copy(a + 1, a + n + 1, b + 1);
        a[1] = b[pos], a[n] = b[pos + 1];
        for (int i : views::iota(1, pos))
            a[i + 1] = b[i];
        for (int i : views::iota(pos + 2, n + 1))
            a[i - 1] = b[i];
        ops.emplace_back(pos);
        assert(ops.size() <= 4 * n);
    };
    function<int()> calc_inv = [&]() {
        int cnt = 0;
        for (int i : views::iota(1, n))
            for (int j : views::iota(i + 1, n + 1))
                if (a[j] < a[i])
                    ++cnt;
        return cnt;
    };
    cerr << "inverse = " << calc_inv() << '\n';
    if (n % 2 == 0 && calc_inv() % 2) {
        cout << -1 << '\n';
        return;
    }
    for (int i : views::iota(1, n - 1)) {
        int pos = -1;
        for (int j : views::iota(1, n + 1))
            if (a[j] == i) {
                pos = j;
                break;
            }
        if (pos == 1)
            op(2), op(1), op(n - 1);
        else
            op(pos - 1);
    }
    if (n != 2) {
        if (a[1] == n - 1) {
            // [n - 1, n, 1, 2, ..., n - 2]
            op(2);
            op(1);
            op(n - 1);
            op(1);
        } else {
            // [n, n - 1, 1, 2, ..., n - 2]
            op(1);
            for (int i : views::iota(0, n - 2))
                op(2);
            op(1);
        }
    }
    cout << ops.size() << '\n';
    for (int &i : ops)
        cout << i << ' ';
    cout << '\n';
}

} // namespace lowspeed_song
```

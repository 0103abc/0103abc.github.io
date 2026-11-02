---
title: "CF1354G Find a Gift 题解"
date: "2026-08-13T21:36:21.000Z"
link: "luogu-hm39ywu5"
categories: ["题解"]
tags: ["Codeforces", "算法思想", "倍增", "基础算法", "二分"]
draft: false
---

如果已知第一个位置是石头的话做法是容易的，考虑先倍增再二分，具体的，对当前倍增参数 $t$ 判断 $[1,2^t]$ 和 $[2^t+1,2^{t+1}]$ 区间内元素重量是否相同，若不相同则说明 $[2^t+1,2^{t+1}]$ 区间中必然存在石头，在区间中二分查找即可。

判断第一个位置是不是石头也是容易的，直接在后面随机 $30$ 个位置比较，若存在位置的重量低于第一个位置则说明第一个位置是石头。因为 $k\le \frac n2$ 因此错误率低于 $(\frac12)^{30}$，可以接受。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

inline string qry(vector<int> v1, vector<int> v2) {
    cout << "? " << v1.size() << ' ' << v2.size() << endl;
    for (int &i : v1) cout << i << ' '; cout << endl;
    for (int &i : v2) cout << i << ' '; cout << endl;
    string repo; cin >> repo; return repo;
}

inline void sol([[maybe_unused]]int __testcase_id) {
    int n, k; cin >> n >> k;
    mt19937 mt(time(0));
    uniform_int_distribution<int> dist(2, n);
    for (int i = 0; i < 28; ++i) {
        int x = dist(mt);
        string repo = qry({1}, {x});
        if (repo == "SECOND") { cout << "! " << 1 << endl; return; }
    } int now = 1, l = 2, r = n;
    while (now < n) {
        if (now + now >= n) { l = now + 1, r = n; break; }
        vector<int> v1, v2;
        for (int i = 1; i <= now; ++i) v1.emplace_back(i), v2.emplace_back(now + i);
        if (qry(v1, v2) == "FIRST") { l = now + 1, r = now + now; break; } now <<= 1;
    } int best = -1; while (l <= r) {
        int mid = l + r >> 1;
        vector<int> v1, v2;
        for (int i = 1; i <= mid - now; ++i) v1.emplace_back(i);
        for (int i = now + 1; i <= mid; ++i) v2.emplace_back(i);
        string repo = qry(v1, v2);
        if (repo == "FIRST") best = mid, r = mid - 1;
        else l = mid + 1;
    } cout << "! " << best << endl;
}

} // namespace lowspeed_song
```
:::

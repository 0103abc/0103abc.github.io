---
title: "P11678 [USACO25JAN] Watering the Plants P 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-p11678"
categories: ["题解"]
tags: ["洛谷", "基础算法", "差分", "动态规划", "数据结构", "平衡树"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P11678).
:::

:::info[Solution]{open}
先考虑暴力 dp。设 $f_{i,j}$ 表示用了前 $i-1$ 个管子，满足了 $1\sim i-1$ 位置的序求，且 $i$ 位置当前有 $j$ 单位的水，所需要花费的最小费用是多少。转移考虑枚举 $i$ 管子用了 $k$ 次，需要满足 $j+k\ge w_i$ 则可以转移 $f_{i+1,k}\leftarrow kc_i+\min\limits_{j\ge w_i-k}f_{i,j}$。

考虑优化。这个东西看着就非常 slope trick，因此考虑把这个式子拆成四步分别处理。记用来操作的临时数组为 $g$ 数组，则转移流程可以被拆分为：

+ 翻转整个数组。
+ 对整个数组求前缀最小值。
+ 加上一个线性函数。
+ 在 $w_{i+1}$ 位置直接阶截断。

上面四个步骤恰好描述了转移流程，因此套路的考虑 slope，维护差分数组 $d_j=f_{i,j+1}-f_{i,j}$，可以证明差分数组是单调不降的（即 $f$ 这个 dp 信息是凸的）。考虑上面四步操作对斜率的影响：

+ 整体翻转可以看作是斜率全部取反然后整体翻转。
+ 求前缀最小值可以看作是把差分数组尾部的所有正斜率修改为 $0$。
+ 加线性函数可以看作是给所有斜率整体加一个常数。
+ 截断可以看作是从一端直接删除所有超出范围的斜率。

因此只需要维护差分数组 $d$ 的变化即可。这个东西看着就非常能上平衡树维护，但是其实存在线性而且更好写（存疑）的做法：

考虑用双端队列来维护这些段，然后额外维护下列信息：

+ 当前方向是否是翻转的。
+ 斜率的全局加法标记。
+ 函数的左端点的值。
+ 当前斜率的总和。

然后所有操作直接暴力维护即可，每个信息只会最多被加入一次删除一次，因此均摊下来总操作次数是线性的，时间复杂度也就同样是线性的了。

细节不算少。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int w[N], c[N];

inline void sol() {
    constexpr int inf = 1e12;
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> w[i];
    for (int i = 1; i < n; ++i) cin >> c[i];
    int s = *max_element(w + 1, w + n + 1) + 1;
    deque<pair<int, int>> q = {{s, inf}};
    int len = s, res = 0, sum = s * inf, tag = 0, rev = 0;
    function<void(int)> add = [&](int x) { tag += rev ? -x : x, sum += x * len; };
    function<void(int)> gao = [&](int x) {
        pair<int, int> t;
        if (!rev) {
            while (len > x) {
                t = q.back(); q.pop_back();
                if (t.second + tag <= 0) { res += sum, sum = tag = 0, rev = 1, len = s, q = {{s, 0}}; return; }
                len -= t.first, sum -= t.first * (t.second + tag);
            } if (len < x) q.emplace_back(x - len, t.second), sum += (x - len) * (t.second + tag);
            res += sum, sum *= -1, len = x, rev = 1;
            while (q.size() && q.front().second + tag < 0) {
                auto [cnt, d] = q.front(); q.pop_front();
                len -= cnt, sum += cnt * (d + tag);
            } q.emplace_front(s, -tag), len += s;
        } else {
            while (len > x) {
                t = q.front(); q.pop_front();
                if (t.second + tag >= 0) { res += sum, sum = tag = 0, len = s, rev = 0, q = {{s, 0}}; return; }
                len -= t.first, sum += t.first * (t.second + tag);
            } if (len < x) q.emplace_front(x - len, t.second), sum -= (x - len) * (t.second + tag);
            res += sum, sum *= -1, len = x, rev = 0;
            while (q.size() && q.back().second + tag > 0) {
                auto [cnt, d] = q.back(); q.pop_back();
                len -= cnt, sum -= cnt * (d + tag);
            } q.emplace_back(s, -tag), len += s;
        }
    };
    gao(w[1]);
    for (int i = 1; i < n; ++i) {
        add(c[i]), gao(w[i + 1]);
        cout << res << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：黑-

鲜活指数：7

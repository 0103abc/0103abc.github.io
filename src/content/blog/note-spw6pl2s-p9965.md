---
title: "P9965 [THUPC 2024 初赛] 转化 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p9965"
categories: ["题解"]
tags: ["洛谷", "基础算法", "贪心", "排序"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P9965)
:::

:::info[Solution]{open}
感觉很难啊。

考虑先把所有 $a_i>0$ 的颜色，将所有二类工具全部使用。此时该颜色就会有 $a_i+c_i$ 个球。然后再贪心的使用尽量多的一类工具，得到 $\sum \min(a_i,b_i)$ 个可以自由选择颜色的球。

然后考虑一开始没有球但是 $b_i>0,c_i>0$ 的颜色。先把一个可以自由选择颜色的球变成该颜色，然后再使用全部的二类工具得到 $1+c_i$ 个这个颜色的球，最后使用一类工具将一部分该颜色的球变回可以自由选择颜色的球即可。容易证明这样操作后自由选择颜色的球的数量一定不会变少。

最后考虑解决问题。第一问直接把所有自由颜色的球都变成颜色 $i$ 然后用没用完的二类工具让球的数量翻倍即可。因此对颜色 $i$ 而言其答案就可以被表示为 $a_i+c_i+cnt$，其中 $cnt$ 是可以自由选择颜色的球的数量。

对于第二问而言，本身就得到 $cnt+\sum a_i$ 个球，使用上面给出的贪心策略，对 $b_i>0,c_i>0$ 但是没有球的颜色 $i$ 而言，用一个自由选择颜色的球可以额外增加 $c_i$ 个颜色为 $i$ 的球。因为最多能执行这样的操作 $cnt$ 次，因此将所有满足上述条件的颜色 $i$ 按照 $c_i$ 从大到小排序，然后选择 $c_i$ 最多的 $cnt$ 个颜色 $i$ 执行上面的操作即可。

因此问题总时间复杂度为 $O(n\log n)$，可以解决。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N], b[N], c[N], d[N], e[N];

inline void sol() {
    int n, sum = 0, sum2 = 0; cin >> n;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    for (int i = 1; i <= n; ++i) cin >> b[i];
    for (int i = 1; i <= n; ++i) cin >> c[i];
    for (int i = 1; i <= n; ++i) {
        if (a[i]) a[i] += c[i], c[i] = 0, d[i] = min(a[i], b[i]), sum += d[i];
        else {
            if (b[i]) e[i] = min(b[i], c[i] + 1) - 1;
            sum2 += e[i];
        }
    }
    if (!sum) {
        for (int i = 1; i <= n; ++i) cout << a[i] << ' ';
        cout << '\n';
        cout << accumulate(a + 1, a + n + 1, 0ll) << '\n';
    } else {
        for (int i = 1; i <= n; ++i)
            if (a[i]) cout << sum + sum2 + a[i] - d[i] << ' ';
            else cout << sum + sum2 + c[i] - e[i] << ' ';
        cout << '\n';
        int res = sum + sum2;
        for (int i = 1; i <= n; ++i)
            if (a[i]) res += a[i] - d[i];
            else if (b[i]) res += c[i] - e[i];
        vector<int> vec;
        for (int i = 1; i <= n; ++i)
            if (!a[i] && !b[i]) vec.emplace_back(c[i]);
        sort(vec.begin(), vec.end(), greater<>());
        for (int i = 0; i < min<int>(vec.size(), sum + sum2); ++i) res += vec[i];
        cout << res << '\n';
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：6

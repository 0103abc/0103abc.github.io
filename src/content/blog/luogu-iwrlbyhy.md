---
title: "CF1693D Decinc Dividing 题解"
date: "2026-02-03T13:16:32.000Z"
link: "luogu-iwrlbyhy"
categories: ["题解"]
tags: ["Codeforces", "动态规划", "数学", "概率与期望"]
draft: false
---

建议先阅读 [CF1144G](https://www.luogu.com.cn/article/trau57mg) 题解。

直接按照上述做法暴力判断可以做到 $O(n^2)$ 求解，但是这显然过不去。

考虑换一个枚举顺序：从大到小枚举左端点 $l$，然后从 $l$ 位置开始往右扫 $r$。在向左移动左端点 $l$ 的过程中，若对于某个扫描到的右端点位置 $r$，其两个 dp 值均和上一次 $l$ 对应的 dp 值相同，那么容易证明之后所有 dp 值都是相同的（根据 CF1144G 的题解可知 $f_{i,0/1}$ 的值只依赖于 $f_{i-1,0/1}$），后面的 dp 值无需继续更新。

然后你写上这个优化之后惊奇的发现你通过了这道题，下面考虑严格的证明一下该算法正确性。

:::success[证明]
首先可以证明 $f_{i,0}$ 和 $f_{i,1}$ 对于同一个数组一定是分别单调的，原因显然。

然后考虑对于一个位置 $i$，$f_{i,0/1}$ 的取值。

找到最大的位置 $j$ 使得其满足 $a_j>a_{j+1}$，那么 $f_{i,0}$ 的取值必然只能从 $a_j,a_{j+1},+\infin,-\infin$ 中取，后两种情况是无解和还没选到这个序列内（可能不存在这样的 $j$），而考虑到 $a_j,a_{j+1}$ 两个元素必然不能被同时选到单调递减的序列里，所以必然有一个作为单调递增序列的结尾元素。

同理，找到最大的位置 $j$ 使得其满足 $a_j<a_{j+1}$，$f_{i,1}$ 的取值也必然只能从 $a_j,a_{j+1},+\infin,-\infin$ 中取，后两种情况是无解和还没选到这个序列内（可能不存在这样的 $j$），而考虑到 $a_j,a_{j+1}$ 两个元素必然不能被同时选到单调递增的序列里，所以必然有一个作为单调递减序列的结尾元素。

因此一个位置的 dp 值最多有 $8$ 个不同取值，也就是说最多会被改 $O(1)$ 次取值，因此期望均摊枚举 $O(1)$ 个右端点就可以找到和上一次 dp 值相同的位置，总时间复杂度也就被优化到了 $O(n)$。
:::

```cpp line-numbers
namespace Loyalty
{
    int f[N][2], a[N];
    inline void init() {}
    inline void main([[maybe_unused]] int _ca, [[maybe_unused]] int _atc)
    {
        int n, res = 0;
        cin >> n;
        for_each(a + 1, a + n + 1, [&](auto &input) { cin >> input; });
        int pos = n;
        for (int i = n; i; --i)
        {
            f[i][0] = inf, f[i][1] = -inf;
            for (int j = i + 1; j <= n; ++j)
            {
                int new_f = -inf, new_g = inf;
                if (a[j] > a[j - 1])
                    new_f = max(new_f, f[j - 1][0]);
                if (a[j] > f[j - 1][1])
                    new_f = max(new_f, a[j - 1]);
                if (a[j] < a[j - 1])
                    new_g = min(new_g, f[j - 1][1]);
                if (a[j] < f[j - 1][0])
                    new_g = min(new_g, a[j - 1]);
                if (make_pair(new_f, new_g) == make_pair(f[j][0], f[j][1]))
                    break;
                f[j][0] = new_f, f[j][1] = new_g;
            }
            while (f[pos][0] <= -inf / 2 && f[pos][1] >= inf / 2)
                --pos;
            res += pos - i + 1;
        }
        cout << res << '\n';
    }
}
```

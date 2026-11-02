---
title: "P14421 [JOISC 2014] 拉面比较 / Ramen 题解"
date: "2025-11-20T14:32:19.000Z"
link: "luogu-059cyh7v"
categories: ["题解"]
tags: ["洛谷", "基础算法", "交互"]
draft: false
---

为什么我不喜欢函数交互：

![image](https://s21.ax1x.com/2025/11/20/pZFYmBd.png)

其实这个题很简单。注意到限制给的很松，所以随便排除一些一定不合法的位置就可以过。考虑把相邻两个元素分为一组比较，把大的那个放到 $v_1$ 数组中，小的那个放到 $v_2$ 数组中。

此时 $v_2$ 数组中所有元素都一定不是最大值，$v_1$ 数组中所有元素都一定不是最小值。直接在两个数组中线性问出最大 / 最小值即可，容易证明这样满足操作次数限制，可以通过。

```cpp line-numbers
#include <vector>

int Compare(int X, int Y);
void Answer(int X, int Y);
void Ramen(int n)
{
    std::vector<int> v1, v2;
    for (int i = 0; i < n; i += 2)
    {
        if (i < n - 1)
        {
            if (Compare(i, i + 1) == 1)
                v1.emplace_back(i), v2.emplace_back(i + 1);
            else
                v1.emplace_back(i + 1), v2.emplace_back(i);
        }
        else
        {
            v1.emplace_back(n - 1);
            v2.emplace_back(n - 1);
        }
    }
    int i1 = v1[0], i2 = v2[0];
    for (int i = 1; i < v1.size(); ++i)
        if (Compare(i1, v1[i]) == -1)
            i1 = v1[i];
    for (int i = 1; i < v2.size(); ++i)
        if (Compare(i2, v2[i]) == 1)
            i2 = v2[i];
    Answer(i2, i1);
}
```

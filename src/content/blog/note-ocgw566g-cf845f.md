---
title: "CF845F Guards In The Storehouse 题解"
date: "2026-07-30T07:34:22Z"
link: "note-ocgw566g-cf845f"
categories: ["题解"]
tags: ["Codeforces", "动态规划"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/CF845F).
:::

:::info[Solution]{open}
套路的，$nm\le 250$ 可以推出 $\min(n,m)\le 15$，后面将钦定 $n\le m$，此时有 $n\le 15$。

考虑轮廓线 dp，设 $f_{x,y,i,j,k}$ 表示当前在格子 $(x,y)$，上方存在守卫的列的集合为 $i$，$j=1/0$ 表示 $(x,y)$ 格子的左侧存在 / 不存在守卫，$k=1/0$ 表示 $(x,y)$ 之前的格子当前有没有被监视到。则考虑转移：

+ $x=n,y=m$ 特殊处理一下即可。
+ 如果 $(x,y)$ 格子为墙，则 $y$ 上方和左侧的所有守卫都会被挡住视野，在 $i$ 集合中把 $y$ 位置对应的状态扔掉，然后清空 $l\leftarrow 0$ 即可。
+ 否则，如果当前格子已经被监视了，那么放不放守卫都行，直接转移即可。
+ 否则，如果当前 $k=1$ 则只能放一个守卫，然后让 $i$ 集合内加入 $y$ 位置，更新 $l\leftarrow 1$ 即可。
+ 否则，如果 $k=0$，那么当然也可以放守卫，转移和 $k=1$ 的情况完全相同；还存在一种情况是不放守卫，此时更新 $k\leftarrow 1$ 然后直接转移即可。

写起来有点细节。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int n, m;
char mp[510][510];
int f[1 << 15][510][2][2];

inline int get(int i, int j) { return i * m + j; }

inline int dfs(int x, int y, int mask, int j, int k) {
    // cerr << "QwQ " << x << ' ' << y << ' ' << mask << '\n';
    if (~f[mask][get(x, y)][j][k]) return f[mask][get(x, y)][j][k];
    if (x == n) return 1;
    if (y == m) return dfs(x + 1, 0, mask, 0, k);
    if (mp[x][y] == 'x') return f[mask][get(x, y)][j][k] = dfs(x, y + 1, mask & (~(1 << y)), 0, k);
    int res = dfs(x, y + 1, mask | (1 << y), 1, k);
    if ((mask >> y & 1) || j) res = (res + dfs(x, y + 1, mask, j, k)) % mod;
    else if (!k) res = (res + dfs(x, y + 1, mask, 0, 1)) % mod;
    return f[mask][get(x, y)][j][k] = res;
}

inline void sol() {
    cin >> n >> m;
    memset(f, -1, sizeof f);
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < m; ++j) cin >> mp[i][j];
    if (n < m) {
        for (int i = 0; i < n; ++i)
            for (int j = i; j < m; ++j) swap(mp[i][j], mp[j][i]);
        swap(n, m);
    } cout << dfs(0, 0, 0, 0, 0) << '\n';
}

} // namespace lowspeed_song
```
:::

难度：蓝

鲜活指数：4

---
title: "P5278 算术天才⑨与等差数列 题解"
date: "2026-07-20T08:18:41Z"
link: "note-spw6pl2s-p5278"
categories: ["题解"]
tags: ["洛谷", "数据结构", "线段树", "数学", "数论"]
draft: false
---

:::info[Description]
[Link](https://www.luogu.com.cn/problem/P5278).
:::

:::info[Solution]{open}
套路题，考虑 Sum Hash，用线段树维护区间内所有元素的和，平方和，立方和，最大值，最小值以及区间内所有相邻元素的 $\gcd$ 值，将其和首项为 $l$ 末项为 $r$ 公差为 $k$ 的等差数列对应的信息比较，若全部相同则判定为 `Yes`，否则判定为 `No` 即可。

需要特判 $k=0$ 的 corner case。

时间复杂度为 $O(n\log^2n)$，瓶颈在于线段树求区间 $\gcd$ 是 $2\log$ 的。
:::

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

int a[N];

struct Node {
    int l, r, sum, sum2, sum3, mi, mx, g;
    inline void init(int p) {
        l = r = p;
        sum = a[p];
        sum2 = a[p] * a[p] % mod;
        sum3 = a[p] * a[p] % mod * a[p] % mod;
        mi = mx = a[p], g = abs(a[p] - a[p + 1]);
    }
} tree[N << 2];

inline Node operator+(const Node &l, const Node &r) {
    return {l.l, r.r, l.sum + r.sum, (l.sum2 + r.sum2) % mod, (l.sum3 + r.sum3) % mod, min(l.mi, r.mi), max(l.mx, r.mx), gcd(l.g, r.g)};
}

inline void build(int l, int r, int rt) {
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    build(l, mid, rt << 1), build(mid + 1, r, rt << 1 | 1);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline void mdf(int rt, int pos) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (l == r) return tree[rt].init(l);
    int mid = l + r >> 1;
    mdf((pos <= mid) ? (rt << 1) : (rt << 1 | 1), pos);
    tree[rt] = tree[rt << 1] + tree[rt << 1 | 1];
}

inline Node qry(int rt, int ll, int rr) {
    int &l = tree[rt].l, &r = tree[rt].r;
    if (ll <= l && r <= rr) return tree[rt];
    int mid = l + r >> 1;
    if (ll <= mid && mid < rr) return qry(rt << 1, ll, rr) + qry(rt << 1 | 1, ll, rr);
    if (ll <= mid) return qry(rt << 1, ll, rr);
    return qry(rt << 1 | 1, ll, rr);
}

constexpr int i6 = 167422635;

inline int sum1(int l, int r, int k) {
    return ((r - l) / k + 1) * (l + r) / 2;
}

inline int sum2(int l, int r, int k) {
    int n = ((r - l) / k + 1) % mod;
    int s1 = n * ((n - 1 + mod) % mod) % mod * i2 % mod;
    int s2 = n * ((n - 1 + mod) % mod) % mod * ((2 * n - 1 + mod) % mod) % mod * i6 % mod;
    return (n * l % mod * l + 2 * l % mod * k % mod * s1 + k * k % mod * s2) % mod;
}

inline int sum3(int l, int r, int k) {
    int n = ((r - l) / k + 1) % mod;
    int s1 = n * ((n - 1 + mod) % mod) % mod * i2 % mod;
    int s2 = n * ((n - 1 + mod) % mod) % mod * ((2 * n - 1 + mod) % mod) % mod * i6 % mod;
    return (n * l % mod * l % mod * l + 3 * l % mod * l % mod * k % mod * s1 + 3 * l % mod * k % mod * k % mod * s2 + k * k % mod * k % mod * s1 % mod * s1 % mod) % mod;
}

inline void sol() {
    int n, m; cin >> n >> m;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    build(1, n, 1);
    int las = 0;
    while (m--) {
        int o; cin >> o;
        if (o == 1) {
            int x, y; cin >> x >> y;
            x ^= las, y ^= las, a[x] = y, mdf(1, x);
            if (x != 1) mdf(1, x - 1);
        } else {
            int l, r, k; cin >> l >> r >> k;
            l ^= las, r ^= las, k ^= las;
            if (l == r) cout << "Yes\n", ++las;
            else {
                if (!k) {
                    auto o1 = qry(1, l, r);
                    if (o1.mi == o1.mx) cout << "Yes\n", ++las;
                    else cout << "No\n";
                    continue;
                }
                auto o1 = qry(1, l, r);
                int g = qry(1, l, r - 1).g;
                if (g == k && (r - l) * k == o1.mx - o1.mi) {
                    if (o1.sum == sum1(o1.mi, o1.mx, k) && o1.sum2 == sum2(o1.mi, o1.mx, k) && o1.sum3 == sum3(o1.mi, o1.mx, k)) cout << "Yes\n", ++las;
                    else cout << "No\n";
                } else cout << "No\n";
            }
        }
    }
}

} // namespace lowspeed_song
```
:::

难度：紫-

鲜活指数：-2

---
title: "CF1299D Around the World 题解"
date: "2026-08-09T05:42:05.000Z"
link: "luogu-l4b1xowf"
categories: ["题解"]
tags: ["Codeforces", "搜索", "深度优先搜索"]
draft: false
---

~~這也能做嗎.jpg~~

套路的考慮先求出圖的任意一個 DFS 生成樹，然後結合綫性基來維護答案。具體的，任意求出圖的一個 DFS 樹后記 $dis_u$ 表示從根結點到 $u$ 結點上經過的所有邊的邊權的 XOR 值，則考慮一條非樹邊 $<u,v,w>$ 其和樹上的路徑 $u\leftrightarrow v$ 組成一個環，這個環的 XOR 值就是 $dis_u\oplus dis_v\oplus w$。把所有這些環的邊權 XOR 值都插入到異或綫性基裏，因爲任意一條閉合路綫中走偶數次的邊都對 XOR 值沒有影響，因此只需要考慮走了奇數次的邊。而由經典結論可知這些邊必然都可以被上述若干個基本環拼凑得到。因此若某幾個基本環的 XOR 值為 $0$ 則把這些環拼接起來就得到了一個 XOR 值為 $0$ 的閉合路綫。而這個閉合路綫必然是非平凡的，因爲每個基本換都對應一條自己的非樹邊，非樹邊不會被訪問超過 $1$ 次，因此也就不會被抵消掉。

因此題目中的限制條件等價於：所有當前和點 $1$ 連通的基本環的 XOR 之都必須能成功的插入到同一個異或綫性基中。如果某個值沒法插入則説明她能夠被前面的若干個環 XOR 出來，因此存在一個非空組合的 XOR 值為 $0$ 方案非法。

然後把點 $1$ 和所有和點 $1$ 相鄰的邊暫時刪除剩下若干個連通塊即可。因爲題目限制保證不存在經過 $1$ 點且長度 $>3$ 的簡單環，這個條件限制了每個連通塊和 $1$ 結點的連接方式。假設一個連通塊裏有兩個點 $u,v$ 都和 $1$ 號結點相鄰，因爲 $u,v$ 兩個點位於同一個連通塊内所以塊内必然存在至少一條 $u\to v$ 的簡單路徑。再加上 $1\to u$ 和 $v\to 1$ 的路徑就得到了一個經過 $1$ 的簡單環。因爲這個環的長度不能 $>3$ 因此 $u,v$ 兩個點必須直接有邊相鄰。記憶不的，如果一個塊内有三個點 $u,v,w$ 都和 $1$ 號結點相鄰，那麽她們之間兩兩都有路徑項鏈，因此 $1\to u\to v\to w\to 1$ 就形成了一個長度至少為 $4$ 的簡單還，引發矛盾。

因此：刪除點 $1$ 后每個連通塊最多只有兩條邊原來就連向 $1$ 號結點。先分開處理每個連通塊，在塊内 DFS 求出所有基本環的 XOR 并將其插入到一個綫性基 $B$ 中。如果塊的内部發生插入失敗，則這個塊只要和 $1$ 號結點聯通就一定會出現非法路綫。因爲可以從 $1$ 走進這個塊，然後走完這個 XOR 為 $0$ 的閉合路綫再園路返回 $1$，往返路徑出現兩次會全部抵消因此得到不合法的路徑。所以這種塊只能把所有和 $1$ 相鄰的便都刪除掉。

如果塊内部本身合法就考慮她和 $1$ 結點之間的邊。如果只有一條邊那麽考慮分類討論這條邊的情況：

+ 如果刪除了這條邊那麽這個塊和 $1$ 號節點斷開，什麽都不用加入全局綫性基。
+ 如果保留這條邊，那麽點 $1$ 可以進入這個塊，因此把塊内綫性基 $B$ 合并到全局綫性基中即可。

如果有兩條邊設她們分別是 $(1,u,a)$ 和 $(1,v,b)$，則根據前面的分析可知 $u,v$ 之間必然還有一條邊，邊權為 $c$。則此時還會多出一個三元環 $(1,u,v)$ 其 XOR 值就是 $a\oplus b\oplus c$。此時有三種情況：

+ 兩條邊都刪除：什麽也不用加入。
+ 只保留一條邊：點 $1$ 可以進入這個塊，只需要加入綫性基 $B$ 即可。注意有兩種保留一條邊的方法。
+ 保留兩條邊：除了 $B$ 以外還需要加入三元環的貢獻即 XOR $a\oplus b\oplus c$ 這個環。此時如果 $a\oplus b\oplus c$ 插入不了 $B$ 這個綫性記則兩條邊都保留這個操作本身就是非法的。

現在每個連通塊都被壓縮成了兩三個網全局綫性基中加入哪些數的選擇。問題只剩下如何把不同的連通塊合起來處理了。此時顯然不能只保證每個塊内部合法，因爲不同的塊之間也可以凑出 XOR 為 $0$ 的環。所以還需要維護一個全局的異或綫性基。注意到 $w<32$，因此所有的環 XOR 的二進制表示最多只有 $5$ 位 也就是異或綫性基最多只有 $5$ 個元素。DFS 一下可以發現本質不同的不同狀態數量只有 $374$ 種。把這 $374$ 個狀態先全部提前編號，然後設 $f_S$ 表示當前處理完了前若干個連通塊的信息后當前全局綫性基的狀態為 $S$ 的方案數。初始時綫性基為空，處理一個連通塊的過程中根據前面分析出來的選擇進行轉移，如果需要把某個塊的綫性基 $B$ 加入當前狀態則把 $B$ 中的所有數逐個插入當前綫性基。如果有一個數沒法插入就説明轉移非法。如果全部成功插入則可以得到一個新的綫性基狀態。這些合并結果都可以提前預處理出。

記 $merge(A,B)$ 表示合并 $A,B$ 兩個綫性基后得到的新綫性基，則轉移考慮分類討論：

+ 對只有一個便連向 $1$ 的塊，轉移要麽仍然為 $S$ 要麽從 $S$ 變爲 $merge(S,B)$。
+ 對於有兩條邊的塊，轉移方式有下面的三種：
  + $S\to S$，轉移係數為 $1$。
  + $S\to merge(S,B)$，轉移係數為 $2$。
  + $S\to merge(S,B+t)$，轉移係數為 $1$。

需要處理一下綫性基無法插入也就是轉移非法的情況。

處理完所有連通塊后，答案可以被表示爲 $\sum f_S$ 的形式。

正確性顯然是對的，時間複雜度懶得分析了，反正能過。

:::success[Code]
```cpp line-numbers
namespace lowspeed_song {

inline void init() {
}

struct Basis {
    int b[5];
    inline Basis() { memset(b, 0, sizeof b); }
    inline int ins(int x) {
        for (int i = 4; ~i; --i) if (x >> i & 1) {
            if (b[i]) x ^= b[i];
            else return b[i] = x, 1;
        } return 0;
    }
    inline int getmask() const {
        int s = 1;
        for (int i = 0; i < 5; ++i) if (b[i]) {
            int t = s;
            for (int j = 0; j < 32; ++j)
                if (s >> j & 1) t |= 1 << (j ^ b[i]);
            s = t;
        } return s;
    }
};

vector<pair<int, int>> adj[N];
int w_[N], vis[N], dep[N], xr[N], f[N], g[N];
int trans[710][710], idx;
Basis state[N];

inline void sol([[maybe_unused]]int __testcase_id) {
    idx = 1;
    map<int, int> mp; mp[1] = 0;
    for (int i = 0; i < idx; ++i)
        for (int j = 1; j < 32; ++j) {
            Basis t = state[i];
            if (!t.ins(j)) continue;
            int s = t.getmask();
            if (!mp.count(s)) mp[s] = idx, state[idx++] = t;
        }
    memset(trans, -1, sizeof trans);
    for (int i = 0; i < idx; ++i)
        for (int j = 0; j < idx; ++j) {
            Basis t = state[i];
            int ok = 1;
            for (int k = 0; k < 5; ++k)
                if (state[j].b[k] && !t.ins(state[j].b[k])) ok = 0;
            if (ok) trans[i][j] = mp[t.getmask()];
        }
    int n, m; cin >> n >> m;
    memset(w_, -1, sizeof w_);
    while (m--) {
        int u, v, w; cin >> u >> v >> w;
        adj[u].emplace_back(v, w), adj[v].emplace_back(u, w);
        if (u == 1) w_[v] = w;
        if (v == 1) w_[u] = w;
    } f[0] = 1;
    for (int i = 2; i <= n; ++i) if (!vis[i]) {
        Basis basis;
        int ok = 0;
        vector<pair<int, int>> vec;
        function<void(int, int)> dfs = [&](int u, int fa) {
            vis[u] = 1, dep[u] = dep[fa] + 1;
            if (~w_[u]) vec.emplace_back(u, w_[u]);
            for (auto &[v, w] : adj[u]) if (v != fa && v != 1) {
                if (!vis[v]) xr[v] = xr[u] ^ w, dfs(v, u);
                else if (dep[v] < dep[u] && !basis.ins(xr[u] ^ xr[v] ^ w)) ok = 1;
            }
        };
        dfs(i, 0);
        vector<pair<int, int>> vec_ = {{0, 1}};
        if (!ok) {
            int b = mp[basis.getmask()];
            if (vec.size() == 1) vec_.emplace_back(b, 1);
            else if (vec.size() == 2) {
                vec_.emplace_back(b, 2);
                int u = vec[0].first, v = vec[1].first, w = 0;
                for (auto &[vv, c] : adj[u]) if (vv == v) { w = c; break; }
                Basis T = basis;
                if (T.ins(vec[0].second ^ vec[1].second ^ w)) vec_.emplace_back(mp[T.getmask()], 1);
            }
        }
        for (int i = 0; i < idx; ++i) g[i] = 0;
        for (int i = 0; i < idx; ++i) for (auto &[j, k] : vec_)
            if (~trans[i][j]) g[trans[i][j]] = (g[trans[i][j]] + f[i] * k) % mod;
        for (int i = 0; i < idx; ++i) f[i] = g[i];
    }
    int res = 0;
    for (int &i : f) res = (res + i) % mod;
    cout << res << '\n';
}

} // namespace lowspeed_song
```
:::

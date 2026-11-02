const platforms = ['洛谷', 'Codeforces', 'AtCoder', 'UOJ', 'QOJ'];
const algorithms = [
  { group: '基础算法', tags: ['模拟', '排序', '二分', '贪心', '前缀和', '差分'] },
  { group: '动态规划', tags: ['背包', '树形动态规划', '数位动态规划', '状态压缩'] },
  { group: '数据结构', tags: ['线段树', '树状数组', '并查集', '单调栈', '平衡树', '堆'] },
  { group: '图论', tags: ['最短路', '最小生成树', '网络流', '连通分量', '二分图', '树'] },
  { group: '字符串', tags: ['字符串哈希', '后缀数组', '自动机', '回文'] },
  { group: '数学', tags: ['数论', '组合数学', '多项式', '概率与期望', '线性代数'] },
  { group: '搜索', tags: ['深度优先搜索', '广度优先搜索', '回溯'] },
  { group: '算法思想', tags: ['分治', '倍增', '构造'] },
] as const;

export default function TagPicker({ value, onChange }: { value: unknown; onChange: (value: string[]) => void }) {
  const selected = Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === 'string') : [];
  const toggle = (tag: string, group?: string) => {
    if (selected.includes(tag)) onChange(selected.filter((item) => item !== tag));
    else onChange([...new Set([...selected, ...(group ? [group] : []), tag])]);
  };
  const button = (tag: string, group?: string) => (
    <button
      key={tag}
      type="button"
      className="editor-button editor-soft"
      aria-pressed={selected.includes(tag)}
      onClick={() => toggle(tag, group)}
    >
      {selected.includes(tag) ? '✓ ' : '+ '}
      {tag}
    </button>
  );
  return (
    <fieldset className="editor-colophon">
      <legend>选择标签</legend>
      <p className="editor-muted">可选 OJ 和算法；选小类时会自动加入对应大类，也可在上方标签框自由输入。</p>
      <details>
        <summary>OJ</summary>
        <div className="editor-draft-actions">{platforms.map((tag) => button(tag))}</div>
      </details>
      <details>
        <summary>算法</summary>
        {algorithms.map(({ group, tags }) => (
          <details key={group}>
            <summary>{group}</summary>
            <div className="editor-draft-actions">
              {button(group)}
              {tags.map((tag) => button(tag, group))}
            </div>
          </details>
        ))}
      </details>
    </fieldset>
  );
}

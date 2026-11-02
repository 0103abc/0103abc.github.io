/** Stable per-label hue, shared by lists, tag clouds and article pages. */
const topicHues: Record<string, number> = {
  倍增: 270,
  字符串: 190,
  后缀数组: 230,
  入门: 145,
  模拟: 25,
  组合数学: 325,
  数据结构: 5,
  动态规划: 85,
  做题记录: 45,
};

export function tagColorStyle(tag: string): string {
  const label = tag.trim().normalize('NFC');
  let hash = 2166136261;
  for (const letter of label) hash = Math.imul(hash ^ (letter.codePointAt(0) ?? 0), 16777619);
  return `--tag-hue:${Object.hasOwn(topicHues, label) ? topicHues[label] : ((hash >>> 0) % 36000) / 100}`;
}

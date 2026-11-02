import { createEditorSource, parseEditorDocument, updateEditorProperty } from './document';
import type { EditorDraft } from './storage';

export const ARTICLE_KINDS = [
  { id: 'solution', label: '题解', description: '记录题意、思路与解题代码。' },
  { id: 'note', label: '做题笔记', description: '记录尝试、错题与做题复盘。' },
  { id: 'blog', label: '普通博客', description: '随笔、学习记录或其他文章。' },
] as const;
export type ArticleKind = (typeof ARTICLE_KINDS)[number]['id'];

export function newArticleSource(kind: ArticleKind, now = new Date()): string {
  let source = createEditorSource(now);
  if (kind === 'blog') return source;
  source = updateEditorProperty(source, 'title', kind === 'solution' ? '新题解' : '新的做题笔记');
  source = updateEditorProperty(source, 'categories', [kind === 'solution' ? '题解' : '做题笔记']);
  return source.replace(
    /# 从这里开始[\s\S]*$/,
    kind === 'solution'
      ? '# 题目\n\n填写题目链接与题意。\n\n## 思路\n\n## 代码\n\n```cpp\n\n```\n'
      : '# 题目与目标\n\n## 尝试过程\n\n## 错误与改进\n\n## 收获\n',
  );
}

/** A new-article session refreshes the date once; an explicit remote edit keeps its original publication time. */
export function refreshNewArticleDate(draft: EditorDraft, now = new Date()): EditorDraft {
  if (draft.remote || parseEditorDocument(draft.source).error) return draft;
  return {
    ...draft,
    source: updateEditorProperty(draft.source, 'date', new Date(Math.floor(now.getTime() / 60000) * 60000).toISOString()),
  };
}

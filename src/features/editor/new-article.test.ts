import assert from 'node:assert/strict';
import test from 'node:test';
import { parseEditorDocument } from './document';
import { ARTICLE_KINDS, newArticleSource, refreshNewArticleDate } from './new-article';

test('new article types set their category and the actual current instant', () => {
  const now = new Date('2026-11-02T03:04:25Z');
  for (const { id } of ARTICLE_KINDS) {
    const parsed = parseEditorDocument(newArticleSource(id, now));
    assert.equal(parsed.data.date, '2026-11-02T03:04:00.000Z');
    assert.equal(parsed.data.draft, true);
    assert.deepEqual(parsed.data.categories, id === 'blog' ? [] : [id === 'solution' ? '题解' : '做题笔记']);
  }
});

test('reopening a new draft refreshes its date without losing text, while remote edits retain publication time', () => {
  const draft = { id: 'example', title: 'Example', source: newArticleSource('note', new Date('2020-01-01')), updated: 0 };
  const refreshed = refreshNewArticleDate(draft, new Date('2026-11-02T03:04:25Z'));
  assert.equal(parseEditorDocument(refreshed.source).data.date, '2026-11-02T03:04:00.000Z');
  assert.equal(parseEditorDocument(refreshed.source).body, parseEditorDocument(draft.source).body);
  const remote = {
    ...draft,
    remote: { path: 'src/content/blog/example.md', sha: 'a'.repeat(40), slug: 'example', title: 'Example', hidden: false },
  };
  assert.equal(refreshNewArticleDate(remote), remote);
  const malformed = { ...draft, source: '---\ntitle: [broken\n---\nDo not lose this draft.' };
  assert.equal(refreshNewArticleDate(malformed), malformed);
});

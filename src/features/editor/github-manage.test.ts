import assert from 'node:assert/strict';
import test from 'node:test';
import { parseEditorDocument } from './document';
import {
  changeRemotePost,
  checkedPostPath,
  loadRemotePost,
  preparePostUpdate,
  type RemotePost,
  setPostHidden,
} from './github-manage';

const source =
  '---\ntitle: 测试文章\ndate: "2026-11-02T01:00:00Z"\nlink: sample\ndraft: false\ncustom: keep # 保留\n---\n\n正文 🌸\n';
const post: RemotePost = {
  path: 'src/content/blog/sample.md',
  sha: 'a'.repeat(40),
  source,
  slug: 'sample',
  title: '测试文章',
  hidden: false,
};
const file = (sha = post.sha) => ({ type: 'file', sha, encoding: 'base64', content: Buffer.from(source).toString('base64') });

test('only Markdown within the blog root can be managed', () => {
  for (const path of [
    'README.md',
    '.github/workflows/deploy.yml',
    'src/content/blog/../secret.md',
    'src/content/blog/a%2fb.md',
    'src/content/blog/a\\b.md',
    'src/content/blog/a.md?x=1',
  ])
    assert.throws(() => checkedPostPath(path));
  assert.equal(checkedPostPath('src/content/blog/zh/笔记.md'), 'src/content/blog/zh/笔记.md');
});

test('remote reads decode Unicode and retain the precise revision', async () => {
  const loaded = await loadRemotePost(post.path, '', async () => Response.json(file()));
  assert.deepEqual(loaded, post);
});

test('updates keep publication time, body, comments and URL while setting the update instant', () => {
  const updated = preparePostUpdate(source, post, 'Asia/Shanghai', new Date('2026-11-02T02:03:04Z'));
  const parsed = parseEditorDocument(updated);
  assert.equal(parsed.data.date, '2026-11-02T01:00:00.000Z');
  assert.equal(parsed.data.updated, '2026-11-02T02:03:04.000Z');
  assert.equal(parsed.data.link, 'sample');
  assert.equal(parsed.body, parseEditorDocument(source).body);
  assert.match(updated, /# 保留/);
  const hidden = setPostHidden(source, true);
  assert.equal(parseEditorDocument(hidden).data.draft, true);
  assert.equal(parseEditorDocument(setPostHidden(hidden, false)).data.draft, false);
});

test('another account cannot update or delete any article', async () => {
  let writes = 0;
  const request: typeof fetch = async (_url, init) => {
    if (init?.method) writes++;
    return Response.json({ login: 'visitor' });
  };
  for (const value of [source, null])
    await assert.rejects(changeRemotePost('test-token', post, value, request), /只有博客所有者/);
  assert.equal(writes, 0);
});

test('stale drafts never overwrite or delete a newer remote version', async () => {
  let writes = 0;
  const request: typeof fetch = async (url, init) => {
    if (init?.method) writes++;
    return Response.json(String(url).endsWith('/user') ? { login: '0103abc' } : file('b'.repeat(40)));
  };
  for (const value of [source, null]) await assert.rejects(changeRemotePost('test-token', post, value, request), /已有新版本/);
  assert.equal(writes, 0);
});

test('update and delete carry the current SHA and target only the owner repository', async () => {
  const writes: RequestInit[] = [];
  const request: typeof fetch = async (url, init) => {
    assert.ok(String(url).startsWith('https://api.github.com/'));
    assert.equal(init?.credentials, 'omit');
    assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer test-token');
    if (String(url).endsWith('/user')) return Response.json({ login: '0103abc' });
    if (!init?.method) return Response.json(file());
    writes.push(init);
    assert.equal(JSON.parse(String(init.body)).sha, post.sha);
    return Response.json({ content: { sha: 'b'.repeat(40) } });
  };
  const saved = await changeRemotePost('test-token', post, setPostHidden(source, true), request);
  assert.equal(saved?.hidden, true);
  assert.equal(saved?.sha, 'b'.repeat(40));
  await changeRemotePost('test-token', post, null, request);
  assert.deepEqual(
    writes.map((w) => w.method),
    ['PUT', 'DELETE'],
  );
  assert.equal(Object.hasOwn(JSON.parse(String(writes[1].body)), 'content'), false);
});

test('a write-time race conflict is surfaced without retrying the mutation', async () => {
  let writes = 0;
  const request: typeof fetch = async (url, init) => {
    if (String(url).endsWith('/user')) return Response.json({ login: '0103abc' });
    if (!init?.method) return Response.json(file());
    writes++;
    return Response.json({}, { status: 409 });
  };
  await assert.rejects(changeRemotePost('test-token', post, source, request));
  assert.equal(writes, 1);
});

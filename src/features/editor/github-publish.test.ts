import assert from 'node:assert/strict';
import test from 'node:test';
import { parseEditorDocument } from './document';
import { preparePublication, publishNewPost, verifyGitHubOwner } from './github-publish';

const source =
  '---\ntitle: 中文与 C++\ndate: 2026-11-02 12:00:00\ndraft: true\ntags: [随笔]\ncustom: keep # 备注\n---\n\n正文 🌸 $a+b$\n\n```cpp\ncout << "你好";\n```\n';
const reply = (value: unknown, status = 200) => Response.json(value, { status });

test('publishing retains body, custom properties and comments while making the post public', () => {
  const post = preparePublication(source, 'my-first-post');
  const parsed = parseEditorDocument(post.source);
  assert.equal(parsed.body, parseEditorDocument(source).body);
  assert.equal(parsed.data.draft, false);
  assert.equal(parsed.data.link, 'my-first-post');
  assert.equal(parsed.data.custom, 'keep');
  assert.match(post.source, /# 备注/);
  assert.equal(post.path, 'src/content/blog/my-first-post.md');
});

test('unsafe paths, case-folded old links, malformed metadata and empty bodies cannot be published', () => {
  for (const slug of ['../P14510', 'a/b', 'a\\b', '.hidden', 'a.md', 'a?x', '-start', 'a'.repeat(101)]) {
    assert.throws(() => preparePublication(source, slug));
  }
  assert.throws(() => preparePublication(source, 'p14510', ['P14510']), /已被使用/);
  assert.throws(() => preparePublication(source.replace('2026-11-02 12:00:00', 'invalid'), 'valid'), /文章属性/);
  assert.throws(() => preparePublication(source.replace('tags: [随笔]', 'tags: broken'), 'valid'), /文章属性/);
  assert.throws(() => preparePublication('---\ntitle: T\ndate: 2026-11-02\n---\n', 'valid'), /正文/);
  assert.throws(() => preparePublication(source.replace('draft: true', 'password: secret'), 'valid'), /公开文章/);
  assert.throws(() => preparePublication(source, 'valid', ['VALID']));
  assert.equal(preparePublication(source, '算法笔记').slug, '算法笔记');
});

test('an account other than the owner never reaches a write request', async () => {
  let calls = 0;
  const request: typeof fetch = async () => {
    calls++;
    return reply({ login: 'someone-else' });
  };
  await assert.rejects(publishNewPost('test-token', preparePublication(source, 'valid'), request), /只有博客所有者/);
  assert.equal(calls, 1);
});

test('Unicode article content is sent only to GitHub and create requests never contain an overwrite SHA', async () => {
  const writes: RequestInit[] = [];
  const post = preparePublication(source, '你好');
  const request: typeof fetch = async (url, init) => {
    assert.ok(String(url).startsWith('https://api.github.com/'));
    assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer test-token');
    assert.equal(init?.credentials, 'omit');
    assert.equal(init?.redirect, 'error');
    if (String(url).endsWith('/user')) return reply({ login: '0103abc' });
    if (String(url).includes('/git/trees/')) return reply({ tree: [] });
    assert.ok(init);
    writes.push(init);
    return reply({ commit: { html_url: 'https://github.com/0103abc/0103abc.github.io/commit/test' } }, 201);
  };
  const result = await publishNewPost('test-token', post, request);
  assert.equal(result.articleUrl, '/post/%E4%BD%A0%E5%A5%BD');
  assert.equal(writes.length, 1);
  const body = JSON.parse(String(writes[0].body));
  assert.equal(Buffer.from(body.content, 'base64').toString('utf8'), post.source);
  assert.equal(body.branch, 'main');
  assert.equal(Object.hasOwn(body, 'sha'), false);
});

test('an existing differently cased file cannot be overwritten', async () => {
  let writes = 0;
  const request: typeof fetch = async (url, init) => {
    if (init?.method === 'PUT') writes++;
    if (String(url).endsWith('/user')) return reply({ login: '0103abc' });
    if (String(url).includes('/git/trees/')) return reply({ tree: [{ path: 'src/content/blog/VALID.md' }] });
    return reply({ content: Buffer.from('different article').toString('base64'), encoding: 'base64' });
  };
  await assert.rejects(publishNewPost('test-token', preparePublication(source, 'valid'), request), /已存在/);
  assert.equal(writes, 0);
});

test('a lost PUT response can recover a confirmed matching file without creating another commit', async () => {
  const post = preparePublication(source, 'valid');
  let writes = 0;
  const request: typeof fetch = async (url, init) => {
    if (String(url).endsWith('/user')) return reply({ login: '0103abc' });
    if (String(url).includes('/git/trees/')) return reply({ tree: [] });
    if (init?.method === 'PUT') {
      writes++;
      throw new TypeError('network response lost');
    }
    return reply({ content: Buffer.from(post.source).toString('base64'), encoding: 'base64' });
  };
  const result = await publishNewPost('test-token', post, request);
  assert.equal(result.recovered, true);
  assert.equal(writes, 1);
});

test('race conflicts and expired credentials produce a recoverable message without retrying a write', async () => {
  await assert.rejects(
    verifyGitHubOwner('test-token', async () => reply({}, 401)),
    /已过期/,
  );
  const request: typeof fetch = async (url) => {
    if (String(url).endsWith('/user')) return reply({ login: '0103abc' });
    if (String(url).includes('/git/trees/')) return reply({ tree: [] });
    return reply({}, 422);
  };
  await assert.rejects(publishNewPost('test-token', preparePublication(source, 'valid'), request), /不会被覆盖/);
});

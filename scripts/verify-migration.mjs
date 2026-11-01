import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(fs.readFileSync('migration/manifest.json', 'utf8'));
const read = (file) => fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
const entities = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };
const decode = (text) =>
  text.replace(/&(#x[\da-f]+|#\d+|lt|gt|amp|quot|apos);/gi, (whole, entity) => {
    if (entity.startsWith('#x')) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    return entities[entity] ?? whole;
  });
const text = (html) => decode(html.replace(/<[^>]*>/g, ''));
const codeBlocks = (html) => [...html.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/g)].map((match) => text(match[1]).trim());
const emitted = (url) => {
  const relative = url.replace(/^\//, '');
  const file = [path.join('dist', relative), path.join('dist', relative, 'index.html')].find(
    (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
  );
  assert.ok(file, `Missing emitted route: ${url}`);
  return read(file);
};

for (const [file, hash] of Object.entries(manifest.files)) {
  assert.equal(
    createHash('sha256')
      .update(fs.readFileSync(path.join('migration/original', file)))
      .digest('hex'),
    hash,
    `Changed original archive: ${file}`,
  );
}
for (const post of manifest.posts) {
  const original = read(`migration/original/${post.source}`);
  const markdown = read(post.markdown);
  let source = original.match(/<script id="solutionMarkdown" type="text\/markdown">([\s\S]*?)<\/script>/)?.[1].trim();
  if (post.source.endsWith('CF1654F.html')) source = source.replace(/\n````\s*$/, '');
  if (source) assert.ok(markdown.includes(source), `Missing original Markdown: ${post.source}`);
  const originalCodes = source
    ? [...source.matchAll(/```cpp[^\n]*\n([\s\S]*?)\n`{3,4}/g)].map((match) => match[1].trim())
    : codeBlocks(original);
  for (const route of [post.url, post.legacyUrl]) {
    const html = emitted(route);
    assert.ok(html.includes('0103abc'), `Missing site identity: ${route}`);
    assert.deepEqual(codeBlocks(html), originalCodes, `Changed C++ code: ${route}`);
    assert.ok(html.includes(`https://0103abc.github.io${post.url}`), `Missing canonical URL: ${route}`);
    if (source) assert.ok(html.includes('katex'), `Missing math rendering: ${route}`);
  }
  assert.ok(emitted('/').includes(post.url), `Post missing from homepage: ${post.url}`);
  assert.ok(emitted('/archives').includes(post.url), `Post missing from archives: ${post.url}`);
}
for (const url of ['/solution_list.html', '/solve_list.html', '/apps', '/about', '/categories', '/tags', '/rss.xml'])
  emitted(url);
for (const file of ['duipai-online.html', 'ai/catgirl/index.html', 'ai/catgirl/api.php', 'solution_data.js', 'solve_data.js']) {
  assert.deepEqual(
    fs.readFileSync(`dist/${file}`),
    fs.readFileSync(`migration/original/${file}`),
    `Changed original application or data: ${file}`,
  );
}
assert.ok(
  fs.readdirSync('dist/pagefind').some((name) => name.endsWith('.js')),
  'Missing search index',
);
console.log(
  `PASS: ${Object.keys(manifest.files).length} archived originals, ${manifest.posts.length} complete solutions, old URLs, C++ code, math, applications and search index.`,
);

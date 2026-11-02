import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(path.join(root, 'config/hydro-assets.json'), 'utf8'));
assert.match(config.version, /^\d+\.\d+\.\d+$/);
assert.equal(config.basePath, `hydro-assets/ui-${config.version}`);
assert.equal(config.tarball, `https://registry.npmjs.org/@hydrooj/ui-default/-/ui-default-${config.version}.tgz`);
const cache = path.join(root, '.cache/hydro-ui');
await mkdir(cache, { recursive: true });
const archive = path.join(cache, `ui-${config.version}.tgz`);
let bytes;
try {
  bytes = await readFile(archive);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const response = await fetch(config.tarball, { signal: AbortSignal.timeout(60_000) });
  assert.ok(response.ok, `Hydro UI download failed: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
}
assert.equal(`sha512-${createHash('sha512').update(bytes).digest('base64')}`, config.integrity, 'Hydro UI integrity mismatch');
await writeFile(archive, bytes);
// Extract only the public directory from the pinned, verified upstream package.
const files = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
  .trim()
  .split(/\r?\n/);
for (const name of files) {
  assert.ok(name.startsWith('package/') && !name.split('/').includes('..') && !name.includes('\\'));
}
const destination = path.join(root, 'dist', config.basePath);
await mkdir(destination, { recursive: true });
execFileSync('tar', ['-xzf', archive, '--strip-components=2', '-C', destination, 'package/public']);
const locales = path.join(destination, 'resource', config.version);
await mkdir(locales, { recursive: true });
for (const lang of ['en', 'zh', 'zh_TW', 'ko']) {
  await copyFile(path.join(root, 'static/hydro-locales', `lang-${lang}.js.txt`), path.join(locales, `lang-${lang}.js`));
}
await copyFile(path.join(root, 'LICENSE'), path.join(destination, 'LICENSE-AGPL-3.0.txt'));
await writeFile(
  path.join(destination, 'NOTICE.txt'),
  `Hydro UI ${config.version}\nCopyright Hydro contributors; AGPL-3.0.\nSource: ${config.source}\nPackage: ${config.tarball}\nThird-party materials retain their original licenses and notices.\nOnly public UI assets and locale dictionaries are mirrored here.\n`,
);
for (const name of [`hydro-${config.version}.js`, `theme-${config.version}.css`, `resource/${config.version}/lang-zh.js`]) {
  assert.ok((await readFile(path.join(destination, name))).length > 0, `Missing Hydro asset: ${name}`);
}
console.log(`Prepared verified Hydro UI ${config.version} at /${config.basePath}/`);

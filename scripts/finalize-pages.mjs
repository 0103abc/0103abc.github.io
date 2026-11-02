import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default function legacyHtmlFiles() {
  return {
    name: 'legacy-html-files',
    hooks: {
      'astro:build:done': ({ dir }) => finalizeLegacyUrls(fileURLToPath(dir)),
    },
  };
}

function finalizeLegacyUrls(directoryPath) {
  const dist = path.resolve(directoryPath);
  const manifest = JSON.parse(fs.readFileSync('migration/manifest.json', 'utf8'));
  // Astro's directory output makes .html.astro pages into .html/index.html.
  // GitHub Pages needs real files at the old URLs, without an added slash.
  for (const name of ['solution_list.html', 'solve_list.html']) {
    const directory = path.resolve(dist, name);
    assert.equal(path.dirname(directory), dist);
    const file = path.join(directory, 'index.html');
    const content = fs.readFileSync(file);
    fs.unlinkSync(file);
    fs.rmdirSync(directory); // Refuse to remove a nonempty directory.
    fs.writeFileSync(directory, content);
  }

  for (const post of manifest.posts) {
    const source = path.resolve(dist, `.${post.url}`, 'index.html');
    const target = path.resolve(dist, `.${post.legacyUrl}`);
    assert.ok(source.startsWith(`${dist}${path.sep}`));
    assert.ok(target.startsWith(`${dist}${path.sep}`));
    // A hidden or deleted article has no canonical page in this build.
    if (!fs.existsSync(source)) continue;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    // Keep old URLs accessible while indexing each article only at its canonical URL.
    const content = fs.readFileSync(source, 'utf8').replace('<html ', '<html data-pagefind-ignore="all" ');
    fs.writeFileSync(target, content);
  }
  console.log('Emitted original .html URLs as real files for GitHub Pages.');
}

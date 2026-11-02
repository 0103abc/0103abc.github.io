import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalCommentTerm } from './comment-term';

test('canonical and historical article URLs use the same stable discussion key', () => {
  const canonical = 'https://0103abc.github.io/post/CF1654F';
  assert.equal(canonicalCommentTerm(canonical, 'https://0103abc.github.io/solutions/CF1654F.html?q=1#code'), '/post/CF1654F');
  assert.equal(canonicalCommentTerm(canonical, `${canonical}/`), '/post/CF1654F');
  assert.equal(canonicalCommentTerm(undefined, 'https://0103abc.github.io/post/example/?x=1#top'), '/post/example');
});

test('other origins do not replace the discussion key for the current blog page', () => {
  assert.equal(canonicalCommentTerm('https://other.example/path', 'https://0103abc.github.io/post/example'), '/post/example');
  assert.equal(canonicalCommentTerm(undefined, 'https://0103abc.github.io/'), '/');
});

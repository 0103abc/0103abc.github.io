import assert from 'node:assert/strict';
import test from 'node:test';
import { hydroProblemUrl, hydroUrl } from './hydro';

test('links use the selected live Hydro domain and retain a deployment path prefix', () => {
  assert.equal(hydroUrl('https://oj.example/', '/p'), 'https://oj.example/p');
  assert.equal(hydroUrl('https://oj.example/oj/?old=1#top', 'record', 'atcoder'), 'https://oj.example/oj/d/atcoder/record');
  assert.equal(hydroProblemUrl('https://oj.example/', 'system', ' P1001 '), 'https://oj.example/p/P1001');
  assert.equal(hydroProblemUrl('https://oj.example/', 'codeforces', '100A'), 'https://oj.example/d/codeforces/p/100A');
});

test('problem lookup cannot escape the configured host or domain', () => {
  for (const pid of ['', '.', '..', '../manage', '//other.example', 'https://other.example/', 'a?b', 'a#b', '%2f']) {
    assert.throws(() => hydroProblemUrl('https://oj.example/', 'system', pid));
  }
  assert.throws(() => hydroUrl('https://oj.example/', 'p', '../manage'));
  assert.throws(() => hydroUrl('http://oj.example/', 'p'));
  assert.throws(() => hydroUrl('https://user:password@oj.example/', 'p'));
});

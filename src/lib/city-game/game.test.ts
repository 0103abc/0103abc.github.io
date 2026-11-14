import assert from 'node:assert/strict';
import test from 'node:test';
import { chooseAction } from './ai';
import { CITY_POOL } from './data';
import { applyAction, createGame, type Game, legalActions, neighbors, observe, type Piece, randomSource } from './engine';

const piece = (score: number, side: 0 | 1, open = true): Piece => ({
  city: { ...CITY_POOL[0], code: `test-${side}`, name: '测试城市', score },
  side,
  open,
});
const fixture = (): Game => ({ ...createGame('fixture'), board: Array(289).fill(null), humanSide: 0, lost: [142, 142] });
test('roster contains 292 unique prefecture-level cities and excludes unwanted jurisdictions', () => {
  assert.equal(CITY_POOL.length, 292);
  assert.equal(new Set(CITY_POOL.map((c) => c.code)).size, 292);
  for (const c of CITY_POOL) {
    assert.equal(c.code.length, 4);
    assert.ok(!['11', '12', '31', '50', '71', '81', '82'].includes(c.code.slice(0, 2)));
    assert.ok(!/林区|自治州|地区|县/.test(c.name));
  }
});
test('a seed replays the same layout and different seeds create random layouts, fills 17×17 with unique cities, and balances sides and strength', () => {
  const a = createGame('2026-11-15');
  assert.deepEqual(a, createGame('2026-11-15'));
  assert.notDeepEqual(a.board, createGame('2026-11-16').board);
  assert.equal(a.board.length, 289);
  assert.equal(a.board[144], null);
  assert.equal(new Set(a.board.filter((p) => p).map((p) => p?.city.code)).size, 288);
  for (const side of [0, 1]) assert.equal(a.board.filter((p) => p?.side === side).length, 144);
  assert.equal(a.board.filter((p) => p?.open).length, 0);
});
test('first reveal determines sides, alternates turns and does not mutate the previous board', () => {
  const old = createGame('turns');
  const at = old.board.findIndex((p) => p);
  const next = applyAction(old, { type: 'flip', at });
  assert.equal(next.humanSide, old.board[at]?.side);
  assert.equal(next.turn, 1);
  assert.equal(next.board[at]?.open, true);
  assert.equal(old.board[at]?.open, false);
});
test('moves must be orthogonally adjacent and cannot eat covered or friendly pieces', () => {
  const g = fixture();
  g.board[16] = piece(60, 0);
  g.board[17] = piece(40, 1);
  g.board[15] = piece(40, 1, false);
  g.board[33] = piece(40, 0);
  assert.ok(!neighbors(16).includes(17));
  for (const to of [17, 15, 33]) assert.throws(() => applyAction(g, { type: 'move', from: 16, to }));
  g.board[15] = null;
  assert.equal(applyAction(g, { type: 'move', from: 16, to: 15 }).board[15]?.side, 0);
});
test('stronger attacker survives, weaker attacker disappears, and equal pieces mutually disappear', () => {
  for (const score of [40, 60, 80]) {
    const g = fixture();
    g.board[0] = piece(score, 0);
    g.board[1] = piece(60, 1);
    const next = applyAction(g, { type: 'move', from: 0, to: 1 });
    assert.equal(next.board[0], null);
    assert.equal(next.board[1]?.side, score === 60 ? undefined : score > 60 ? 0 : 1);
    assert.equal(next.quiet, 0);
    assert.equal(next.lost[0], score <= 60 ? 143 : 142);
    assert.equal(next.lost[1], score >= 60 ? 143 : 142);
  }
});
test('elimination wins and all-open 16 quiet turns draws, while reveal and capture reset the clock', () => {
  const g = fixture();
  g.lost = [142, 143];
  g.board[0] = piece(80, 0);
  g.board[1] = piece(40, 1);
  assert.equal(applyAction(g, { type: 'move', from: 0, to: 1 }).winner, 0);
  const d = fixture();
  d.board[0] = piece(40, 0);
  d.board[288] = piece(80, 1);
  d.quiet = 15;
  assert.equal(applyAction(d, { type: 'move', from: 0, to: 1 }).winner, 'draw');
  d.board[2] = piece(40, 1, false);
  assert.equal(applyAction(d, { type: 'move', from: 0, to: 1 }).winner, null);
  assert.equal(applyAction(d, { type: 'flip', at: 2 }).quiet, 0);
});
test('immobile side passes without changing pieces', () => {
  const g = fixture();
  g.board[0] = piece(80, 1);
  assert.deepEqual(legalActions(observe(g, 0)), [{ type: 'pass' }]);
  assert.equal(applyAction(g, { type: 'pass' }).turn, 1);
});
test('hidden identities never enter AI observation or change its choice', () => {
  const g = createGame('private');
  const at = g.board.findIndex((p) => p);
  const changed = {
    ...g,
    board: g.board.map((p) =>
      p ? { ...p, city: { ...p.city, score: 999, name: '秘密城市' }, side: p.side === 0 ? (1 as const) : (0 as const) } : null,
    ),
  };
  const a = observe(g, 1),
    b = observe(changed, 1);
  assert.deepEqual(a, b);
  assert.deepEqual(a.board[at], { hidden: true });
  for (let level = 1; level <= 5; level++)
    assert.deepEqual(chooseAction(a, level, randomSource('choice')), chooseAction(b, level, randomSource('choice')));
});
test('higher difficulties choose a free capture rather than suicide', () => {
  const g = fixture();
  g.board[0] = piece(80, 0);
  g.board[1] = piece(40, 1);
  g.board[288] = piece(40, 0);
  g.board[287] = piece(100, 1);
  for (const level of [3, 4, 5])
    assert.deepEqual(
      chooseAction(observe(g, 0), level, () => 0.5),
      { type: 'move', from: 0, to: 1 },
    );
});
test('all five difficulties make legal moves through long games with piece conservation', () => {
  for (let level = 1; level <= 5; level++) {
    let g = createGame(`simulation-${level}`);
    const random = randomSource(`ai-${level}`);
    for (let move = 0; move < 180 && g.winner === null; move++) {
      const side = g.humanSide === null ? 0 : g.turn === 0 ? g.humanSide : g.humanSide === 0 ? 1 : 0;
      const view = observe(g, side);
      const action = chooseAction(view, level, random);
      g = applyAction(g, action);
      assert.equal(g.board.filter((p) => p).length + g.lost[0] + g.lost[1], 288);
    }
  }
});

test('all score inputs are 2025 GDP and weights include administrative status', () => {
  for (const city of CITY_POOL) {
    assert.equal(city.year, 2025);
    assert.ok(city.gdp2025 > 0 && Number.isFinite(city.gdp2025));
    assert.ok(city.source.startsWith('https://'));
    assert.equal(city.score, Math.round(city.gdpScore * 0.8 + city.statusScore * 0.2));
  }
  assert.equal(CITY_POOL.filter((c) => c.status === '副省级省会').length, 10);
  assert.equal(CITY_POOL.filter((c) => c.status === '计划单列市').length, 5);
  assert.equal(CITY_POOL.filter((c) => c.status === '省会／首府').length, 17);
  assert.ok(!CITY_POOL.some((c) => c.name === '三沙'));
});

test('five difficulties finish sparse endgames with a valid win or draw', () => {
  for (let level = 1; level <= 5; level++) {
    let g = fixture();
    g.lost = [140, 140];
    for (const [at, score, side] of [
      [0, 30, 0],
      [1, 25, 1],
      [40, 70, 0],
      [41, 80, 1],
      [120, 40, 0],
      [121, 40, 1],
      [270, 100, 0],
      [271, 90, 1],
    ] as const)
      g.board[at] = piece(score, side);
    const random = randomSource(`end-${level}`);
    for (let step = 0; step < 400 && g.winner === null; step++) {
      const side = g.turn === 0 ? 0 : 1;
      g = applyAction(g, chooseAction(observe(g, side), level, random));
      assert.equal(g.board.filter((p) => p).length + g.lost[0] + g.lost[1], 288);
    }
    assert.notEqual(g.winner, null);
  }
});

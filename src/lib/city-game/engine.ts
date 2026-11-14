import { CITY_POOL, type City } from './data';

const SIZE = 17;
export type Side = 0 | 1;
export type Piece = { city: City; side: Side; open: boolean };
export type Action = { type: 'flip'; at: number } | { type: 'move'; from: number; to: number } | { type: 'pass' };
export interface Game {
  board: (Piece | null)[];
  turn: Side;
  humanSide: Side | null;
  lost: [number, number];
  quiet: number;
  winner: Side | 'draw' | null;
  moves: number;
  message: string;
}
export function randomSource(seed: string) {
  let n = 2166136261;
  for (const char of seed) n = Math.imul(n ^ char.charCodeAt(0), 16777619);
  return () => {
    n += 0x6d2b79f5;
    let t = n;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export function createGame(seed: string): Game {
  const random = randomSource(seed);
  const chosen = shuffled(CITY_POOL, random)
    .slice(0, 288)
    .sort((a, b) => b.score - a.score);
  const pieces: Piece[] = [];
  for (let i = 0; i < chosen.length; i += 2) {
    const side: Side = random() < 0.5 ? 0 : 1;
    pieces.push({ city: chosen[i], side, open: false }, { city: chosen[i + 1], side: side === 0 ? 1 : 0, open: false });
  }
  const board: (Piece | null)[] = shuffled(pieces, random);
  board.splice(144, 0, null);
  return {
    board,
    turn: 0,
    humanSide: null,
    lost: [0, 0],
    quiet: 0,
    winner: null,
    moves: 0,
    message: '先翻开一枚棋子，确定你的阵营。',
  };
}
export function neighbors(at: number): number[] {
  const row = Math.floor(at / SIZE),
    col = at % SIZE;
  return [
    row > 0 ? at - SIZE : -1,
    row < SIZE - 1 ? at + SIZE : -1,
    col > 0 ? at - 1 : -1,
    col < SIZE - 1 ? at + 1 : -1,
  ].filter((n) => n >= 0);
}
/** Public view deliberately has no hidden city, side, or strength. */
export type ViewCell = { hidden: true } | { hidden: false; side: Side; score: number; name: string } | null;
export interface View {
  board: ViewCell[];
  side: Side;
  quiet: number;
  lost: [number, number];
}
export function observe(game: Game, side: Side): View {
  return {
    board: game.board.map((p) =>
      !p ? null : p.open ? { hidden: false, side: p.side, score: p.city.score, name: p.city.name } : { hidden: true },
    ),
    side,
    quiet: game.quiet,
    lost: [...game.lost],
  };
}
export function legalActions(view: View): Action[] {
  const moves: Action[] = [];
  view.board.forEach((p, from) => {
    if (!p) return;
    if (p.hidden) {
      moves.push({ type: 'flip', at: from });
      return;
    }
    if (p.side !== view.side) return;
    for (const to of neighbors(from)) {
      const target = view.board[to];
      if (!target || (!target.hidden && target.side !== view.side)) moves.push({ type: 'move', from, to });
    }
  });
  return moves.length ? moves : [{ type: 'pass' }];
}
export function applyAction(game: Game, action: Action): Game {
  if (game.winner !== null) throw new Error('本局已结束。');
  const side: Side = game.humanSide === null ? 0 : game.turn === 0 ? game.humanSide : game.humanSide === 0 ? 1 : 0;
  if (!legalActions(observe(game, side)).some((a) => JSON.stringify(a) === JSON.stringify(action)))
    throw new Error('不能这样走。');
  const next: Game = {
    ...game,
    board: [...game.board],
    lost: [...game.lost],
    turn: game.turn === 0 ? 1 : 0,
    moves: game.moves + 1,
    quiet: game.quiet + 1,
  };
  if (action.type === 'flip') {
    next.quiet = 0;
    const p = game.board[action.at]!;
    next.board[action.at] = { ...p, open: true };
    if (game.humanSide === null) next.humanSide = p.side;
    next.message = `翻开 ${p.city.name}（${p.city.score}分，${p.side === 0 ? '红' : '蓝'}方）。`;
  } else if (action.type === 'move') {
    const p = game.board[action.from]!,
      target = game.board[action.to];
    next.board[action.from] = null;
    if (!target) {
      next.board[action.to] = p;
      next.message = `${p.city.name}移动一格。`;
    } else {
      next.quiet = 0;
      if (p.city.score >= target.city.score) {
        next.lost[target.side]++;
        next.board[action.to] = p;
      } else next.board[action.to] = target;
      if (p.city.score <= target.city.score) {
        next.lost[p.side]++;
        if (p.city.score === target.city.score) next.board[action.to] = null;
      }
      next.message = `${p.city.name}（${p.city.score}）挑战${target.city.name}（${target.city.score}）：${p.city.score === target.city.score ? '同归于尽' : p.city.score > target.city.score ? '进攻方获胜' : '进攻方消失'}。`;
    }
  } else next.message = '无棋可走，跳过回合。';
  if (next.lost[0] === 144 && next.lost[1] === 144) next.winner = 'draw';
  else if (next.lost[0] === 144) next.winner = 1;
  else if (next.lost[1] === 144) next.winner = 0;
  else if (next.board.every((p) => !p || p.open) && next.quiet >= 16) next.winner = 'draw';
  return next;
}

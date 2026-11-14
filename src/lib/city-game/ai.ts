import { type Action, legalActions, neighbors, type Side, type View, type ViewCell } from './engine';
export const LEVELS = ['随性', '入门', '稳健', '进阶', '强手'] as const;
const value = (score: number) => 12 + score / 8;
function danger(board: ViewCell[], at: number, side: Side, score: number): number {
  return neighbors(at).reduce((sum, n) => {
    const p = board[n];
    return sum + (p && !p.hidden && p.side !== side && p.score >= score ? value(score) * (p.score === score ? 0.5 : 0.85) : 0);
  }, 0);
}
function evaluate(view: View, perspective: Side): number {
  let score = (view.lost[perspective === 0 ? 1 : 0] - view.lost[perspective]) * 18;
  view.board.forEach((p, at) => {
    if (!p || p.hidden) return;
    const sign = p.side === perspective ? 1 : -1;
    score += sign * (value(p.score) - danger(view.board, at, p.side, p.score) * 0.55);
  });
  return score;
}
function simulate(view: View, action: Action): View {
  const next: View = { ...view, board: [...view.board], lost: [...view.lost], side: view.side === 0 ? 1 : 0 };
  if (action.type !== 'move') return next;
  const p = next.board[action.from],
    t = next.board[action.to];
  if (!p || p.hidden) return next;
  next.board[action.from] = null;
  if (!t) next.board[action.to] = p;
  else if (!t.hidden) {
    if (p.score >= t.score) {
      next.lost[t.side]++;
      next.board[action.to] = p;
    }
    if (p.score <= t.score) {
      next.lost[p.side]++;
      next.board[action.to] = p.score === t.score ? null : t;
    }
  }
  return next;
}
function distance(from: number, to: number) {
  return Math.abs(Math.floor(from / 17) - Math.floor(to / 17)) + Math.abs((from % 17) - (to % 17));
}
function priority(view: View, action: Action): number {
  if (action.type === 'pass') return -100;
  if (action.type === 'flip') {
    const around = neighbors(action.at).map((i) => view.board[i]);
    const support = around.filter((p) => p && !p.hidden && p.side === view.side).length;
    const threats = around.filter((p) => p && !p.hidden && p.side !== view.side).length;
    // Unknown pieces remain unknown: use a modest exploration reward, not their actual identity.
    return 2 + support * 0.1 - threats * 0.15;
  }
  const p = view.board[action.from];
  if (!p || p.hidden) return -100;
  const before = evaluate(view, view.side),
    after = evaluate(simulate(view, action), view.side);
  const prey = view.board
    .map((t, i) => (t && !t.hidden && t.side !== p.side && t.score <= p.score ? i : -1))
    .filter((i) => i >= 0);
  const approach = prey.length
    ? (Math.min(...prey.map((i) => distance(action.from, i))) - Math.min(...prey.map((i) => distance(action.to, i)))) * 0.5
    : 0;
  return after - before + approach;
}
function candidates(view: View, width: number): Action[] {
  const all = legalActions(view)
    .map((action) => ({ action, score: priority(view, action) }))
    .sort((a, b) => b.score - a.score);
  // Keep one reveal option but avoid branching on hundreds of indistinguishable hidden identities.
  const flips = all.filter((a) => a.action.type === 'flip').slice(0, 1);
  return [...all.filter((a) => a.action.type !== 'flip').slice(0, width), ...flips].map((a) => a.action);
}
function search(view: View, depth: number, perspective: Side, width: number): number {
  if (!depth) return evaluate(view, perspective);
  const values = candidates(view, width).map((a) =>
    a.type === 'move' ? search(simulate(view, a), depth - 1, perspective, width) : evaluate(view, perspective),
  );
  return view.side === perspective ? Math.max(...values) : Math.min(...values);
}
/** The only input is the public observation; this function cannot inspect covered pieces. */
export function chooseAction(view: View, level: number, random: () => number = Math.random): Action {
  const difficulty = Math.max(1, Math.min(5, Math.floor(level)));
  const all = legalActions(view);
  if (random() < [0.8, 0.35, 0.18, 0.08, 0.03][difficulty - 1]) return all[Math.floor(random() * all.length)];
  const ranked = all
    .map((action) => ({ action, score: priority(view, action) + random() * 0.12 }))
    .sort((a, b) => b.score - a.score);
  if (difficulty <= 3) return ranked[0].action;
  const options = [
    ...ranked.filter((a) => a.action.type !== 'flip').slice(0, difficulty === 5 ? 10 : 6),
    ...ranked.filter((a) => a.action.type === 'flip').slice(0, 1),
  ];
  let best = options[0];
  let bestValue = -Infinity;
  for (const option of options) {
    const future =
      option.action.type === 'move'
        ? search(simulate(view, option.action), difficulty === 5 ? 2 : 1, view.side, 5) - evaluate(view, view.side)
        : 0;
    const total = option.score * 0.5 + future;
    if (total > bestValue) {
      bestValue = total;
      best = option;
    }
  }
  return best.action;
}

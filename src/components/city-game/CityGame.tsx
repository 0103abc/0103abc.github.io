import { useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LEVELS } from '@/lib/city-game/ai';
import { type Action, applyAction, createGame, type Game, legalActions, observe, type Side } from '@/lib/city-game/engine';
import './city-game.css';

const sideName = (side: Side | null) => (side === null ? '未定阵营' : side === 0 ? '红方' : '蓝方');
export default function CityGame() {
  return (
    <ErrorBoundary>
      <GameView />
    </ErrorBoundary>
  );
}
function GameView() {
  const [game, setGame] = useState<Game | null>(null);
  const [seed, setSeed] = useState('');
  const [level, setLevel] = useState(3);
  const [selected, setSelected] = useState<number | null>(null);
  const [undoUsed, setUndoUsed] = useState(false);
  const [compact, setCompact] = useState(false);
  const [notice, setNotice] = useState('');
  const checkpoint = useRef<Game | null>(null);
  useEffect(() => {
    const randomSeed = crypto.randomUUID();
    setSeed(randomSeed);
    setGame(createGame(randomSeed));
  }, []);
  useEffect(() => {
    if (!game || game.turn !== 1 || game.winner !== null || game.humanSide === null) return;
    const side: Side = game.humanSide === 0 ? 1 : 0;
    const view = observe(game, side);
    let worker: Worker | undefined;
    let settled = false;
    let deadline = 0;
    const timer = window.setTimeout(() => {
      const fallback = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(deadline);
        worker?.terminate();
        setNotice('策略线程不可用，本回合采用简单策略。');
        setGame(applyAction(game, legalActions(view)[0]));
      };
      deadline = window.setTimeout(fallback, 15000);
      try {
        worker = new Worker(new URL('../../lib/city-game/ai.worker.ts', import.meta.url), { type: 'module' });
        worker.onmessage = (event: MessageEvent<Action>) => {
          if (settled) return;
          try {
            const next = applyAction(game, event.data);
            settled = true;
            window.clearTimeout(deadline);
            setGame(next);
          } catch {
            fallback();
          }
        };
        worker.onerror = fallback;
        worker.postMessage({ view, level });
      } catch {
        fallback();
      }
    }, 450);
    return () => {
      settled = true;
      window.clearTimeout(timer);
      window.clearTimeout(deadline);
      worker?.terminate();
    };
  }, [game, level]);
  if (!game) return <output>正在准备棋局…</output>;
  const humanSide = game.humanSide;
  const busy = game.turn === 1 && game.winner === null;
  const ended = game.winner !== null;
  const actions = legalActions(observe(game, humanSide ?? 0));
  const targets =
    selected === null
      ? []
      : actions
          .filter((a): a is Extract<Action, { type: 'move' }> => a.type === 'move' && a.from === selected)
          .map((a) => a.to);
  const play = (action: Action) => {
    if (busy || ended) return;
    checkpoint.current = game;
    setGame(applyAction(game, action));
    setSelected(null);
    setNotice('');
  };
  const click = (index: number) => {
    if (busy || ended) return;
    if (selected !== null && targets.includes(index)) {
      play({ type: 'move', from: selected, to: index });
      return;
    }
    const p = game.board[index];
    if (p && !p.open) {
      play({ type: 'flip', at: index });
      return;
    }
    if (p?.open && p.side === humanSide) setSelected(selected === index ? null : index);
    else {
      setSelected(null);
      setNotice(p ? `${p.city.name}属于${sideName(p.side)}。` : '先选择一枚己方明棋，再走向相邻空格。');
    }
  };
  const restart = () => {
    if (!window.confirm('重开当前这盘棋？当前进度将清空，已用掉的悔棋不会恢复。')) return;
    setGame(createGame(seed));
    checkpoint.current = null;
    setSelected(null);
    setNotice('');
  };
  const randomGame = () => {
    if (game.moves > 0 && !window.confirm('随机生成一盘新棋？当前进度将清空。')) return;
    const nextSeed = crypto.randomUUID();
    setSeed(nextSeed);
    setGame(createGame(nextSeed));
    checkpoint.current = null;
    setSelected(null);
    setUndoUsed(false);
    setNotice('已生成随机新棋盘。');
  };
  const undo = () => {
    if (!checkpoint.current || undoUsed || busy) return;
    setGame(checkpoint.current);
    checkpoint.current = null;
    setSelected(null);
    setUndoUsed(true);
    setNotice('已撤回你的一步与对手的回应。');
  };
  const result =
    game.winner === 'draw'
      ? '本局和棋'
      : ended
        ? game.winner === humanSide
          ? '你获胜了！'
          : '对手获胜'
        : busy
          ? '对手正在思考…'
          : humanSide === null
            ? '你的回合 · 先翻一枚定阵营'
            : '你的回合 · 翻棋或移动己方明棋';
  const selectedPiece = selected === null ? null : game.board[selected];
  return (
    <div className="city-game">
      <header className="city-heading">
        <div>
          <span className="city-kicker">CITY CHESS</span>
          <h2>
            城市揭棋 <small>17 × 17</small>
          </h2>
          <p>随机城市棋盘 · 五档策略对手</p>
        </div>
        <a href="/apps/">← 应用</a>
      </header>
      <div className="city-controls">
        <label>
          对手难度{' '}
          <select value={level} disabled={busy} onChange={(e) => setLevel(Number(e.target.value))}>
            {LEVELS.map((name, i) => (
              <option key={name} value={i + 1}>
                {i + 1} · {name}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={undo} disabled={!checkpoint.current || undoUsed || busy}>
          悔棋 {undoUsed ? '已使用' : '1 次'}
        </button>
        <button type="button" onClick={restart}>
          重开本盘
        </button>
        <button type="button" onClick={randomGame}>
          随机新局
        </button>
        <label className="city-compact">
          <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
          紧凑棋盘
        </label>
      </div>
      <div className="city-sides">
        <span>
          你 · <b>{sideName(humanSide)}</b>
        </span>
        <span>
          对手 · <b>{sideName(humanSide === null ? null : humanSide === 0 ? 1 : 0)}</b>
        </span>
      </div>
      <output className={`city-status ${ended ? 'finished' : ''}`} aria-live="polite">
        <strong>{result}</strong>
        <span>{game.message}</span>
        {notice && <span>{notice}</span>}
      </output>
      {selectedPiece?.open && <p className="city-selected">已选：{selectedPiece.city.name}。亮框可走，红框可交战。</p>}
      <section className="city-scroll" aria-label="17乘17棋盘，窄屏可横向滚动">
        <div className={`city-board ${compact ? 'compact' : ''}`}>
          {game.board.map((p, index) => (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed board coordinates are stable keys
              key={`cell-${index}`}
              className={`city-cell ${p ? (p.open ? (p.side === 0 ? 'red' : 'blue') : 'covered') : 'empty'} ${selected === index ? 'selected' : ''} ${targets.includes(index) ? (p ? 'attack' : 'target') : ''}`}
              aria-label={`第${Math.floor(index / 17) + 1}行第${(index % 17) + 1}列，${p ? (p.open ? `${sideName(p.side)}${p.city.name}` : '未翻开') : '空格'}`}
              aria-pressed={selected === index}
              disabled={busy || ended}
              onClick={() => click(index)}
            >
              {p ? (
                p.open ? (
                  <span>{p.city.name}</span>
                ) : (
                  <span aria-hidden="true">?</span>
                )
              ) : (
                <span aria-hidden="true">·</span>
              )}
            </button>
          ))}
        </div>
      </section>
      <p className="city-hint">窄屏可左右滑动棋盘。先点己方明棋，再点相邻空格或对方明棋；也可直接点暗子翻开。</p>
      {actions[0]?.type === 'pass' && !busy && !ended && (
        <button type="button" onClick={() => play({ type: 'pass' })}>
          无合法行动，跳过回合
        </button>
      )}
      <details className="city-panel">
        <summary>规则与五档策略</summary>
        <ol>
          <li>双方各 144 枚，中心一格为空。你先翻棋，第一枚的颜色成为你的阵营。</li>
          <li>每回合翻一枚暗子，或将己方明棋上下左右移动一格。不能跳棋、斜走、吃暗子或吃己方棋子。</li>
          <li>挑战相邻敌方明棋：高分方存活；进攻者分数更低则进攻者消失，防守者不动；同分双方消失。</li>
          <li>
            吃光对方城市获胜。全部翻开后，连续 16 步（双方各走一次算两步）未吃子则和棋；吃子重新计数。没有合法行动时跳过。
          </li>
          <li>
            每次进入都随机生成棋盘。「随机新局」重新抽取城市及布局，「重开本盘」保留本盘布局和悔棋使用状态。每局一次免费悔棋，撤回最近一整轮，对手思考期间不能悔棋。刷新会开始新局。
          </li>
          <li>
            五档：随性偏随机，入门偏吃子，稳健会避险，进阶考虑对手回应，强手进行三层有限搜索。所有档位只看明棋，保留一定随机选择，均非最优解。
          </li>
        </ol>
        <p>
          对局与策略完全在本地运行，依据 2025 年 GDP
          和城市行政地位判定交战强弱；数值不在对局界面显示。城市范围为地级市，排除直辖市、港澳台、县级市和林区，三沙因缺少该年度数据暂不入池。
        </p>
        <p>
          数据与名单来源：
          <a href="https://www.oweidata.com/rank/gdp/city" target="_blank" rel="noreferrer">
            GDP 汇编
          </a>
          、
          <a href="https://fgw.wuhan.gov.cn/xwzx/mtgz/202001/t20200116_864672.html" target="_blank" rel="noreferrer">
            行政类别资料
          </a>
          、
          <a href="https://github.com/modood/Administrative-divisions-of-China" target="_blank" rel="noreferrer">
            行政区划数据（WTFPL）
          </a>
          。
        </p>
      </details>
    </div>
  );
}

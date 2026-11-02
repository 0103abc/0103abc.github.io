import { useEffect, useRef, useState } from 'react';
import { changeRemotePost, loadRemotePost, type RemotePost, setPostHidden } from '../github-manage';
import { TOKEN_SETUP_URL, verifyGitHubOwner } from '../github-publish';

export default function PostManager({ path, title }: { path: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const token = useRef('');
  const locked = useRef(false);
  const [mode, setMode] = useState<'hide' | 'delete'>('hide');
  const [post, setPost] = useState<RemotePost | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    const clear = () => {
      token.current = '';
      if (input.current) input.current.value = '';
      setPost(null);
    };
    window.addEventListener('pagehide', clear);
    return () => {
      clear();
      window.removeEventListener('pagehide', clear);
    };
  }, []);
  const close = () => {
    if (locked.current) return;
    token.current = '';
    if (input.current) input.current.value = '';
    setPost(null);
    dialog.current?.close();
  };
  const run = async (action: () => Promise<void>) => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '操作未完成，请检查 GitHub 后重试。');
    } finally {
      locked.current = false;
      setBusy(false);
    }
  };
  const button = 'rounded-lg border border-current/20 px-3 py-1.5 text-sm hover:bg-primary/10 disabled:opacity-50';
  return (
    <>
      <span className="flex gap-2">
        {(['hide', 'delete'] as const).map((action) => (
          <button
            key={action}
            type="button"
            disabled={deleted}
            className={button}
            onClick={() => {
              setMode(action);
              setMessage('');
              setError('');
              dialog.current?.showModal();
            }}
          >
            {action === 'hide' ? '隐藏' : '删除'}
          </button>
        ))}
      </span>
      <dialog
        ref={dialog}
        className="m-auto max-h-[90dvh] w-[min(94vw,30rem)] overflow-y-auto rounded-2xl border border-current/20 bg-background p-6 text-foreground shadow-xl backdrop:bg-black/50"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-lg">{mode === 'hide' ? '隐藏／恢复文章' : '删除文章'}</h2>
          <button type="button" className={button} disabled={busy} onClick={close}>
            关闭
          </button>
        </div>
        <p className="my-3 break-all">{post?.title ?? title}</p>
        {!post && !deleted ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void run(async () => {
                const value = input.current?.value.trim() ?? '';
                await verifyGitHubOwner(value);
                const loaded = await loadRemotePost(path, value);
                token.current = value;
                if (input.current) input.current.value = '';
                setPost(loaded);
              });
            }}
          >
            <p className="text-sm">
              仅站主 0103abc 可操作。
              <a className="underline" href={TOKEN_SETUP_URL} target="_blank" rel="noreferrer">
                创建 GitHub 令牌
              </a>
              ，只授权此仓库的 Contents 读写权限。
            </p>
            <label className="flex flex-col gap-2 text-sm">
              GitHub 令牌
              <input
                ref={input}
                type="password"
                required
                autoComplete="off"
                className="rounded-lg border border-current/20 bg-transparent p-2"
              />
            </label>
            <button type="submit" className={button} disabled={busy}>
              {busy ? '正在连接…' : '连接并载入最新版本'}
            </button>
          </form>
        ) : post && !deleted ? (
          <div className="flex flex-col gap-4 text-sm">
            <p>
              {mode === 'hide'
                ? '隐藏会设为草稿，部署后从文章列表、原网址和搜索中移除。源码仍在公开 GitHub 仓库中，可在写作室「管理文章」恢复。'
                : '删除会从博客仓库移除这篇原文；Git 历史仍可用于恢复。'}
            </p>
            <p className="break-all opacity-70">{post.path}</p>
            <button
              type="button"
              className={button}
              disabled={busy}
              onClick={() => {
                void run(async () => {
                  if (mode === 'delete' && !window.confirm(`确认删除「${post.title}」？此操作将移除仓库中的文章文件。`)) return;
                  const saved = await changeRemotePost(
                    token.current,
                    post,
                    mode === 'delete' ? null : setPostHidden(post.source, !post.hidden),
                  );
                  if (saved) setPost(saved);
                  else {
                    setDeleted(true);
                    token.current = '';
                  }
                  setMessage('已提交到 GitHub，网站部署完成后生效。');
                });
              }}
            >
              {busy ? '正在提交…' : mode === 'delete' ? '确认删除文章' : post.hidden ? '恢复显示' : '确认隐藏文章'}
            </button>
          </div>
        ) : null}
        {message && (
          <output className="mt-4 block text-sm">
            {message}{' '}
            <a
              className="underline"
              href="https://github.com/0103abc/0103abc.github.io/actions"
              target="_blank"
              rel="noreferrer"
            >
              查看部署进度
            </a>
          </output>
        )}
        {error && (
          <p className="mt-4 text-red-600 text-sm" role="alert">
            {error}
          </p>
        )}
      </dialog>
    </>
  );
}

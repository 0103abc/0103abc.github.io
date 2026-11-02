import { useEffect, useId, useRef, useState } from 'react';
import { parseEditorDocument } from '../document';
import { changeRemotePost, loadRemotePost, preparePostUpdate, type RemoteRevision } from '../github-manage';
import {
  BLOG_REPOSITORY,
  type PublishedPost,
  preparePublication,
  publishNewPost,
  suggestPostSlug,
  TOKEN_SETUP_URL,
  verifyGitHubOwner,
} from '../github-publish';
import EditorIcon from './EditorIcon';

interface Props {
  source: string;
  draftId: string;
  reservedLinks: readonly string[];
  siteTimezone?: string;
  remote?: RemoteRevision;
  recoveryPath?: string;
  onPublished: (source: string, remote?: RemoteRevision) => void;
}

export default function GitHubPublisher({
  source,
  draftId,
  reservedLinks,
  onPublished,
  remote: originalRemote,
  recoveryPath,
  siteTimezone = 'Asia/Shanghai',
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const tokenInput = useRef<HTMLInputElement>(null);
  const token = useRef('');
  const busyRef = useRef(false);
  const openedDraft = useRef('');
  const [account, setAccount] = useState('');
  const [slug, setSlug] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PublishedPost | null>(null);
  const [recovered, setRecovered] = useState<{ draftId: string; revision: RemoteRevision } | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const remote = originalRemote ?? (recovered?.draftId === draftId ? recovered.revision : undefined);
  const recovering = Boolean(recoveryPath && !originalRemote);
  const id = useId();

  useEffect(() => {
    const clear = () => {
      token.current = '';
      setAccount('');
      if (tokenInput.current) tokenInput.current.value = '';
    };
    window.addEventListener('pagehide', clear);
    return () => {
      clear();
      window.removeEventListener('pagehide', clear);
    };
  }, []);

  const open = () => {
    if (openedDraft.current !== draftId) {
      openedDraft.current = draftId;
      const link = parseEditorDocument(source).data.link;
      setSlug(typeof link === 'string' && link ? link : remote?.slug ?? suggestPostSlug(source));
      setConfirmed(false);
      setResult(null);
    }
    if (remote) setResult(null);
    setError('');
    dialog.current?.showModal();
  };
  const close = () => {
    if (busyRef.current) return;
    if (tokenInput.current) tokenInput.current.value = '';
    dialog.current?.close();
  };
  const connect = async () => {
    if (busyRef.current) return;
    const value = tokenInput.current?.value.trim() ?? '';
    if (!value) {
      setError('请先填写 GitHub 令牌。');
      return;
    }
    busyRef.current = true;
    setBusy(true);
    setError('');
    try {
      const login = await verifyGitHubOwner(value);
      if (recovering && recoveryPath) {
        const latest = await loadRemotePost(recoveryPath, value);
        if (parseEditorDocument(source).data.link !== latest.slug)
          throw new Error('当前草稿与要编辑的文章地址不一致。请先下载草稿，再从文章页重新打开。');
        const { source: _original, ...revision } = latest;
        setRecovered({ draftId, revision });
        setSlug(revision.slug);
      }
      token.current = value;
      if (tokenInput.current) tokenInput.current.value = '';
      setAccount(login);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '连接失败，请重试。');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  const publish = async () => {
    if (busyRef.current || !token.current || result || (recovering && (!remote || !confirmed))) return;
    busyRef.current = true;
    setBusy(true);
    setError('');
    try {
      if (remote) {
        const document = parseEditorDocument(source);
        if (document.data.title !== remote.title && !window.confirm(`当前标题与原文章标题不同。\n原文章：${remote.title}\n当前草稿：${String(document.data.title ?? '')}\n\n确定将当前内容保存到原文章吗？`)) return;
        if (slug.trim() !== remote.slug && !window.confirm(`文章地址将从 ${remote.slug} 改为 ${slug.trim()}，原地址可能失效。确定继续吗？`)) return;
        const sourceToSave = preparePostUpdate(source, remote, siteTimezone, new Date(), slug.trim(), reservedLinks);
        const saved = await changeRemotePost(token.current, remote, sourceToSave);
        if (!saved) throw new Error('未能确认文章更新结果');
        const { source: savedSource, ...revision } = saved;
        onPublished(savedSource, revision);
        setResult({
          articleUrl: `/post/${saved.slug.split('/').map(encodeURIComponent).join('/')}`,
          sourceUrl: `https://github.com/${BLOG_REPOSITORY}/blob/main/${saved.path}`,
        });
        return;
      }
      const publication = preparePublication(source, slug.trim(), reservedLinks, siteTimezone);
      const saved = await publishNewPost(token.current, publication);
      setResult(saved);
      onPublished(publication.source);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '发布未完成，草稿仍在当前浏览器。');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  const title = parseEditorDocument(source).data.title;

  return (
    <>
      <button
        type="button"
        className="editor-button editor-primary"
        onClick={open}
        title={remote || recoveryPath ? '保存修改' : '发布到博客'}
        aria-label={remote || recoveryPath ? '保存修改' : '发布到博客'}
      >
        <EditorIcon name="save" />
        <span>{remote || recoveryPath ? '保存修改' : '发布'}</span>
      </button>
      <dialog
        ref={dialog}
        className="editor-github-dialog"
        aria-labelledby={`${id}-title`}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <div className="editor-github-heading">
          <h2 id={`${id}-title`}>{remote || recoveryPath ? '更新原文章' : '发布到博客'}</h2>
          <button type="button" className="editor-icon-button" aria-label="关闭发布面板" onClick={close} disabled={busy}>
            <EditorIcon name="close" />
          </button>
        </div>
        {result ? (
          <div className="editor-github-content" aria-live="polite">
            <h3>文章已提交到 GitHub</h3>
            <p>网站正在自动构建。部署完成后，文章会出现在首页、归档和搜索中。</p>
            <div className="editor-github-actions">
              <a
                className="editor-button editor-primary"
                href={`https://github.com/${BLOG_REPOSITORY}/actions/workflows/deploy.yml`}
                target="_blank"
                rel="noreferrer"
              >
                查看发布进度
              </a>
              <a className="editor-button" href={result.articleUrl} target="_blank" rel="noreferrer">
                部署完成后查看文章
              </a>
            </div>
            <a href={result.sourceUrl} target="_blank" rel="noreferrer">
              查看已保存的 Markdown
            </a>
            <p className="editor-muted">当前草稿已保留。可以关闭面板，点击「新建」继续写下一篇。</p>
          </div>
        ) : !account ? (
          <form
            key="github-connect"
            className="editor-github-content"
            onSubmit={(event) => {
              event.preventDefault();
              void connect();
            }}
          >
            <p>连接你自己的 GitHub 账号后，即可{remote || recoveryPath ? '保存对原文章的修改' : '在这里发布新文章'}。</p>
            <ol className="editor-github-help">
              <li>
                <a href={TOKEN_SETUP_URL} target="_blank" rel="noreferrer">
                  创建博客专用令牌
                </a>
                （需要登录 0103abc）。
              </li>
              <li>
                Repository access 选择 Only select repositories，只勾选 <strong>0103abc.github.io</strong>。
              </li>
              <li>
                确认 Contents 为 <strong>Read and write</strong>，生成后粘贴到下方。
              </li>
            </ol>
            <label className="editor-field" htmlFor={`${id}-token`}>
              <span>GitHub 令牌</span>
              <input
                id={`${id}-token`}
                ref={tokenInput}
                type="password"
                autoComplete="off"
                spellCheck={false}
                placeholder="github_pat_…"
                disabled={busy}
                required
              />
            </label>
            <p className="editor-muted">
              令牌只发送给 GitHub，不会写入文章、仓库或浏览器存储；刷新、离开页面或断开连接后需要重新填写。
            </p>
            <button className="editor-button editor-primary" type="submit" disabled={busy}>
              {busy ? '正在连接…' : '连接 GitHub'}
            </button>
          </form>
        ) : (
          <form
            key="github-publish"
            className="editor-github-content"
            onSubmit={(event) => {
              event.preventDefault();
              void publish();
            }}
          >
            <p>
              已连接 <strong>{account}</strong> · {BLOG_REPOSITORY}
            </p>
            <h3>{typeof title === 'string' ? title : '请先在文章属性中填写标题'}</h3>
            <label className="editor-field" htmlFor={`${id}-slug`}>
              <span>文章地址</span>
              <input
                id={`${id}-slug`}
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                maxLength={100}
                disabled={busy}
                required
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <p className="editor-muted editor-github-url">https://0103abc.github.io/post/{encodeURIComponent(slug)}</p>
            <p>
              {remote
                ? `将更新原文件 ${remote.path}。修改文章地址会改变网址；若已有其他修改，本次会停止保存。`
                : '点击发布会将当前文章设为公开。已有文章和题解不会被覆盖。'}
            </p>
            {recovering && remote && (
              <label className="editor-field">
                <span>
                  此草稿缺少原始版本信息。请先
                  <a href={`https://github.com/${BLOG_REPOSITORY}/blob/main/${remote.path}`} target="_blank" rel="noreferrer">
                    查看 GitHub 当前原文
                  </a>
                  ，确认草稿包含需要保留的内容。
                </span>
                <span>
                  <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />{' '}
                  我已核对，使用当前草稿更新原文章
                </span>
              </label>
            )}
            <div className="editor-github-actions">
              <button className="editor-button editor-primary" type="submit" disabled={busy || (recovering && !confirmed)}>
                {busy ? '正在提交…' : remote ? '保存修改' : '发布新文章'}
              </button>
              <button
                className="editor-button"
                type="button"
                disabled={busy}
                onClick={() => {
                  token.current = '';
                  setAccount('');
                  setError('');
                }}
              >
                断开 GitHub
              </button>
            </div>
          </form>
        )}
        {error && (
          <p className="editor-github-error" role="alert">
            {error}
          </p>
        )}
      </dialog>
    </>
  );
}

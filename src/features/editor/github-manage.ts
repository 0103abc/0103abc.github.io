import { parseEditorDocument, updateEditorProperty } from './document';
import { BLOG_REPOSITORY, encodedContent, githubError, options, preparePublication, verifyGitHubOwner } from './github-publish';
import { MAX_MARKDOWN_BYTES } from './import-source';

const API = `https://api.github.com/repos/${BLOG_REPOSITORY}`;
export interface RemotePost {
  path: string;
  sha: string;
  source: string;
  slug: string;
  title: string;
  hidden: boolean;
}
export type RemoteRevision = Omit<RemotePost, 'source'>;

export function checkedPostPath(path: string): string {
  if (
    !path.startsWith('src/content/blog/') ||
    !/\.mdx?$/.test(path) ||
    path.split('/').some((p) => !p || p === '.' || p === '..') ||
    /[\\\p{Cc}?#%]/u.test(path)
  )
    throw new Error('只能管理博客目录中的 Markdown 文章。');
  return path;
}
const fileUrl = (path: string) => `${API}/contents/${checkedPostPath(path).split('/').map(encodeURIComponent).join('/')}`;
const readOptions = (): RequestInit => ({
  headers: { Accept: 'application/vnd.github+json' },
  credentials: 'omit',
  cache: 'no-store',
  signal: AbortSignal.timeout(30000),
});

export async function loadRemotePost(path: string, token = '', request: typeof fetch = fetch): Promise<RemotePost> {
  const response = await request(`${fileUrl(path)}?ref=main`, token ? options(token) : readOptions());
  if (!response.ok) throw githubError(response.status);
  const file: { type?: string; sha?: string; content?: string; encoding?: string; size?: number } = await response.json();
  if (
    file.type !== 'file' ||
    file.encoding !== 'base64' ||
    !file.content ||
    !/^[a-f0-9]{40}$/.test(file.sha ?? '') ||
    (file.size ?? 0) > MAX_MARKDOWN_BYTES
  )
    throw new Error('无法安全读取这篇文章，请在 GitHub 检查原文件。');
  const source = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(
    Uint8Array.from(atob(file.content.replace(/\s/g, '')), (c) => c.charCodeAt(0)),
  );
  if (new TextEncoder().encode(source).byteLength > MAX_MARKDOWN_BYTES) throw new Error('文章不能超过 5 MB。');
  const parsed = parseEditorDocument(source);
  if (parsed.error || parsed.data.password || /^\s*:::encrypted\b/m.test(parsed.body))
    throw new Error('这篇文章不支持网页编辑，请使用仓库工作流。');
  const slug =
    typeof parsed.data.link === 'string' ? parsed.data.link : path.slice('src/content/blog/'.length).replace(/\.mdx?$/, '');
  return {
    path,
    sha: file.sha as string,
    source,
    slug,
    title: typeof parsed.data.title === 'string' ? parsed.data.title : slug,
    hidden: parsed.data.draft === true,
  };
}

/** Optimistic concurrency: both our preflight and GitHub's SHA check reject stale edits. */
export async function changeRemotePost(
  token: string,
  post: RemoteRevision,
  source: string | null,
  request: typeof fetch = fetch,
): Promise<RemotePost | null> {
  checkedPostPath(post.path);
  if (!/^[a-f0-9]{40}$/.test(post.sha)) throw new Error('缺少文章版本，请重新载入原文。');
  await verifyGitHubOwner(token, request);
  const current = await loadRemotePost(post.path, token, request);
  if (current.sha !== post.sha) throw new Error('文章已有新版本，本次未覆盖或删除。请先下载草稿，再重新载入最新原文。');
  const response = await request(
    fileUrl(post.path),
    options(token, {
      method: source === null ? 'DELETE' : 'PUT',
      body: JSON.stringify({
        branch: 'main',
        sha: post.sha,
        message: `${source === null ? 'delete' : 'update'} post: ${current.title.replace(/[\r\n]/g, ' ')}`,
        ...(source === null ? {} : { content: encodedContent(source) }),
      }),
    }),
  );
  if (!response.ok) throw githubError(response.status);
  const saved: { content?: { sha?: string } } = await response.json();
  if (source === null) return null;
  if (!/^[a-f0-9]{40}$/.test(saved.content?.sha ?? ''))
    throw new Error('GitHub 已接收修改，但版本信息未确认，请重新载入原文后继续。');
  const parsed = parseEditorDocument(source);
  return {
    ...current,
    source,
    sha: saved.content?.sha as string,
    title: String(parsed.data.title ?? current.title),
    hidden: parsed.data.draft === true,
  };
}

export function preparePostUpdate(source: string, post: RemoteRevision, timezone: string, now = new Date()): string {
  const parsed = parseEditorDocument(source);
  let updated = preparePublication(source, 'editor-update', [], timezone).source;
  updated = updateEditorProperty(updated, 'link', post.slug);
  updated = updateEditorProperty(updated, 'draft', parsed.data.draft === true);
  return updateEditorProperty(updated, 'updated', now.toISOString());
}

export function setPostHidden(source: string, hidden: boolean): string {
  return updateEditorProperty(updateEditorProperty(source, 'draft', hidden), 'updated', new Date().toISOString());
}

export async function listRemotePostPaths(request: typeof fetch = fetch): Promise<string[]> {
  const response = await request(`${API}/git/trees/main?recursive=1`, readOptions());
  if (!response.ok) throw githubError(response.status);
  const tree: { truncated?: boolean; tree: { path: string; type: string }[] } = await response.json();
  if (tree.truncated) throw new Error('目录过大，请从 GitHub 仓库选择文章。');
  return tree.tree
    .filter((entry) => entry.type === 'blob' && entry.path.startsWith('src/content/blog/') && /\.mdx?$/.test(entry.path))
    .map((entry) => checkedPostPath(entry.path))
    .sort();
}

import { z } from 'zod';
import { COLOPHON_PLACEMENTS, COLOPHON_TONES } from '../../lib/config/colophon';
import { utcPostTimestamp } from './date-time';
import { parseEditorDocument, updateEditorProperty } from './document';
import { MAX_MARKDOWN_BYTES } from './import-source';

export const BLOG_REPOSITORY = '0103abc/0103abc.github.io';
export const TOKEN_SETUP_URL =
  'https://github.com/settings/personal-access-tokens/new?name=0103abc-blog&target_name=0103abc&expires_in=30&contents=write';
const API = `https://api.github.com/repos/${BLOG_REPOSITORY}`;
const ROOT = 'src/content/blog/';
const date = z
  .string()
  .refine(
    (value) => Boolean(value.trim()) && Number.isFinite(Date.parse(value.trim().replace(/^(\d{4}-\d{2}-\d{2}) /, '$1T'))),
    '日期无效',
  );
const stringList = z.array(z.string());
const postSchema = z
  .object({
    title: z.string().trim().min(1, '请先填写文章标题'),
    date,
    updated: date.optional(),
    description: z.string().optional(),
    cover: z.string().optional(),
    subtitle: z.string().optional(),
    tags: stringList.optional(),
    keywords: stringList.optional(),
    categories: stringList.or(z.array(stringList)).optional(),
    sticky: z.boolean().optional(),
    draft: z.boolean().optional(),
    catalog: z.boolean().optional(),
    tocNumbering: z.boolean().optional(),
    excludeFromSummary: z.boolean().optional(),
    math: z.boolean().optional(),
    quiz: z.boolean().optional(),
    password: z.string().optional(),
    colophon: z
      .array(
        z.union([
          z.string(),
          z.object({ id: z.string(), note: z.string().optional() }),
          z.object({
            icon: z.string(),
            label: z.string(),
            description: z.string().optional(),
            note: z.string().optional(),
            tone: z.enum(COLOPHON_TONES).optional(),
            placement: z
              .enum(COLOPHON_PLACEMENTS)
              .or(z.array(z.enum(COLOPHON_PLACEMENTS)))
              .optional(),
          }),
        ]),
      )
      .optional(),
  })
  .passthrough();

export interface Publication {
  source: string;
  slug: string;
  title: string;
  path: string;
}
export interface PublishedPost {
  articleUrl: string;
  sourceUrl: string;
  commitUrl?: string;
  recovered?: boolean;
}

export function suggestPostSlug(source: string): string {
  const { data } = parseEditorDocument(source);
  if (typeof data.link === 'string') return data.link;
  return `post-${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 8)}`;
}

/** Only new, public Markdown files inside the blog collection can be created. */
export function preparePublication(
  source: string,
  slug: string,
  reservedLinks: readonly string[] = [],
  siteTimezone = 'Asia/Shanghai',
): Publication {
  if (new TextEncoder().encode(source).byteLength > MAX_MARKDOWN_BYTES) throw new Error('文章不能超过 5 MB。');
  if (!/^[\p{L}\p{N}][\p{L}\p{N}_-]{0,99}$/u.test(slug))
    throw new Error('文章地址须为 1–100 个字母、中文、数字、短横线或下划线，且以文字或数字开头。');
  if (reservedLinks.some((link) => link.toLowerCase() === slug.toLowerCase()))
    throw new Error('这个文章地址已被使用，请换一个；已有文章不会被覆盖。');
  const parsed = parseEditorDocument(source);
  if (parsed.error) throw new Error('文章属性格式有误，请先修正 YAML。');
  const validated = postSchema.safeParse(parsed.data);
  if (!validated.success)
    throw new Error(
      `请检查文章属性：${validated.error.issues.map((issue) => `${issue.path.join('.')} ${issue.message}`).join('；')}`,
    );
  if (!parsed.body.trim()) throw new Error('请先填写文章正文。');
  if (validated.data.password || /^\s*:::encrypted\b/m.test(parsed.body))
    throw new Error('网页发布只支持公开文章，请移除加密密码或使用本地工作流。');
  let published = updateEditorProperty(source, 'date', utcPostTimestamp(parsed.data.date, siteTimezone));
  if (parsed.data.updated !== undefined)
    published = updateEditorProperty(published, 'updated', utcPostTimestamp(parsed.data.updated, siteTimezone));
  published = updateEditorProperty(published, 'link', slug);
  published = updateEditorProperty(published, 'draft', false);
  return { source: published, slug, title: validated.data.title, path: `${ROOT}${slug}.md` };
}

function encodedContent(source: string): string {
  const bytes = new TextEncoder().encode(source);
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 8192)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  return btoa(binary);
}

function checkedToken(value: string): string {
  const token = value.trim();
  if (!token || token.length > 300 || /\s/.test(token)) throw new Error('请填写有效的 GitHub 令牌。');
  return token;
}

function options(token: string, init: RequestInit = {}): RequestInit {
  return {
    ...init,
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    redirect: 'error',
    cache: 'no-store',
    signal: AbortSignal.timeout(30000),
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${checkedToken(token)}`,
      'Content-Type': 'application/json',
    },
  };
}

function githubError(status: number): Error {
  if (status === 401) return new Error('GitHub 令牌无效或已过期，请重新连接。');
  if (status === 403)
    return new Error('GitHub 拒绝了请求。请确认令牌已选中此仓库，Contents 权限为 Read and write，或稍后再试。');
  if (status === 409 || status === 422)
    return new Error('文章地址已存在或仓库有新变更；已有文件不会被覆盖，请检查仓库后重试。');
  if (status === 404) return new Error('无法访问博客仓库，请检查令牌授权。');
  return new Error(`GitHub 暂时无法处理请求（${status}），草稿仍在当前浏览器。`);
}

export async function verifyGitHubOwner(token: string, request: typeof fetch = fetch): Promise<string> {
  let response: Response;
  try {
    response = await request('https://api.github.com/user', options(token));
  } catch {
    throw new Error('无法连接 GitHub，请检查网络及令牌后重试。');
  }
  if (!response.ok) throw githubError(response.status);
  const user: { login?: unknown } = await response.json();
  if (typeof user.login !== 'string' || user.login.toLowerCase() !== '0103abc')
    throw new Error('只有博客所有者 0103abc 的 GitHub 账号可以在这里发布。');
  return user.login;
}

/** A create-only request deliberately omits SHA, so even a race cannot overwrite a file. */
export async function publishNewPost(
  token: string,
  publication: Publication,
  request: typeof fetch = fetch,
): Promise<PublishedPost> {
  const safe = preparePublication(publication.source, publication.slug);
  await verifyGitHubOwner(token, request);
  const url = `${API}/contents/${safe.path.split('/').map(encodeURIComponent).join('/')}`;
  const content = encodedContent(safe.source);
  const result = (commitUrl?: string, recovered = false): PublishedPost => ({
    articleUrl: `/post/${encodeURIComponent(safe.slug)}`,
    sourceUrl: `https://github.com/${BLOG_REPOSITORY}/blob/main/${safe.path.split('/').map(encodeURIComponent).join('/')}`,
    commitUrl,
    recovered,
  });
  // Check the current tree rather than a stale build's post list, including filename case collisions.
  const treeResponse = await request(`${API}/git/trees/main?recursive=1`, options(token));
  if (!treeResponse.ok) throw githubError(treeResponse.status);
  const tree: { truncated?: boolean; tree: { path: string }[] } = await treeResponse.json();
  if (tree.truncated) throw new Error('文章目录过大，暂时无法安全检查重复地址。请使用仓库发布。');
  const existing = tree.tree.some((entry) => entry.path.toLowerCase() === safe.path.toLowerCase());
  const findPrevious = async (): Promise<boolean> => {
    const response = await request(`${url}?ref=main`, options(token));
    if (!response.ok) return false;
    const file: { content?: string; encoding?: string } = await response.json();
    return file.encoding === 'base64' && file.content?.replace(/\s/g, '') === content;
  };
  if (existing) {
    if (await findPrevious()) return result(undefined, true);
    throw new Error('这个文章文件已存在，请换一个地址；已有文章不会被覆盖。');
  }
  let response: Response;
  try {
    response = await request(
      url,
      options(token, {
        method: 'PUT',
        body: JSON.stringify({ message: `post: ${safe.title.replace(/[\r\n]/g, ' ')}`, branch: 'main', content }),
      }),
    );
  } catch {
    try {
      if (await findPrevious()) return result(undefined, true);
    } catch {
      /* Preserve the ambiguous-result message. */
    }
    throw new Error('未能确认提交结果，请先查看 GitHub 仓库；草稿已保留，勿换地址重复提交。');
  }
  if (!response.ok) throw githubError(response.status);
  const saved: { commit?: { html_url?: string } } = await response.json();
  return result(saved.commit?.html_url);
}

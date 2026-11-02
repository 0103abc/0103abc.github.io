/** Build links to the existing Hydro database, including its mounted domains. */
export function hydroUrl(baseUrl: string, path: string, domain = 'system'): string {
  const base = new URL(baseUrl);
  if (base.protocol !== 'https:' || base.username || base.password) throw new Error('Hydro 地址需要使用 HTTPS');
  if (!/^[a-zA-Z0-9_-]+$/.test(domain)) throw new Error('无效的题库域');
  base.search = '';
  base.hash = '';
  const prefix = `${base.pathname.replace(/\/$/, '')}${domain === 'system' ? '' : `/d/${domain}`}`;
  base.pathname = `${prefix}/${path.replace(/^\/+/, '')}`;
  return base.href;
}

export function hydroProblemUrl(baseUrl: string, domain: string, problemId: string): string {
  const pid = problemId.trim();
  if (!/^[\p{L}\p{N}_.-]{1,80}$/u.test(pid) || pid === '.' || pid === '..') {
    throw new Error('请输入题号，如 P1001 或 100A；请勿粘贴完整网址。');
  }
  return hydroUrl(baseUrl, `p/${encodeURIComponent(pid)}`, domain);
}

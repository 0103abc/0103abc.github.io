/** Historical .html article URLs and canonical post URLs share one discussion. */
export function canonicalCommentTerm(canonical: string | undefined, href: string): string {
  const current = new URL(href);
  let target = current;
  try {
    const candidate = canonical ? new URL(canonical, current) : current;
    if (candidate.origin === current.origin) target = candidate;
  } catch {
    /* Fall back to the current article when a canonical link is invalid. */
  }
  return target.pathname.replace(/\/+$/, '') || '/';
}

/** Enhance the server-rendered catalog without replacing its content. */
export function initProblemCatalog(doc: Document): (() => void) | undefined {
  const root = doc.querySelector<HTMLElement>('[data-problem-catalog]');
  if (!root) return;
  const form = root.querySelector<HTMLFormElement>('form');
  const search = root.querySelector<HTMLInputElement>('input[name="q"]');
  const oj = root.querySelector<HTMLSelectElement>('select[name="oj"]');
  const previous = root.querySelector<HTMLButtonElement>('[data-catalog-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-catalog-next]');
  const info = root.querySelector<HTMLElement>('[data-catalog-info]');
  const empty = root.querySelector<HTMLElement>('[data-catalog-empty]');
  const pageLabel = root.querySelector<HTMLElement>('[data-catalog-page]');
  if (!form || !search || !oj || !previous || !next || !info || !empty || !pageLabel) return;

  const items = [...root.querySelectorAll<HTMLElement>('[data-catalog-item]')];
  const abort = new AbortController();
  const { signal } = abort;
  let page = 1;
  const pageSize = 20;
  const render = (updateUrl = true) => {
    const query = search.value.trim().toLowerCase();
    const matching = items.filter(
      (item) => item.dataset.search?.includes(query) && (oj.value === 'all' || item.dataset.oj === oj.value),
    );
    const pages = Math.max(1, Math.ceil(matching.length / pageSize));
    page = Math.min(Math.max(1, page), pages);
    const visible = new Set(matching.slice((page - 1) * pageSize, page * pageSize));
    for (const item of items) item.hidden = !visible.has(item);
    info.textContent = `共 ${matching.length} 项，当前显示 ${visible.size} 项`;
    empty.hidden = matching.length > 0;
    previous.hidden = next.hidden = pages <= 1;
    previous.disabled = page <= 1;
    next.disabled = page >= pages;
    pageLabel.textContent = matching.length ? `${page} / ${pages}` : '';
    if (updateUrl) {
      const url = new URL(window.location.href);
      for (const key of ['q', 'oj', 'page']) url.searchParams.delete(key);
      if (search.value.trim()) url.searchParams.set('q', search.value.trim());
      if (oj.value !== 'all') url.searchParams.set('oj', oj.value);
      if (page > 1) url.searchParams.set('page', String(page));
      window.history.replaceState(window.history.state, '', url);
    }
  };
  const readUrl = () => {
    const params = new URLSearchParams(window.location.search);
    search.value = params.get('q') ?? '';
    const platform = params.get('oj') ?? 'all';
    oj.value = [...oj.options].some((option) => option.value === platform) ? platform : 'all';
    const requestedPage = Number(params.get('page'));
    page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    render(false);
  };
  const filter = () => {
    page = 1;
    render();
  };
  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      filter();
    },
    { signal },
  );
  search.addEventListener('input', filter, { signal });
  oj.addEventListener('change', filter, { signal });
  previous.addEventListener(
    'click',
    () => {
      page--;
      render();
    },
    { signal },
  );
  next.addEventListener(
    'click',
    () => {
      page++;
      render();
    },
    { signal },
  );
  window.addEventListener('popstate', readUrl, { signal });
  readUrl();
  return () => abort.abort();
}

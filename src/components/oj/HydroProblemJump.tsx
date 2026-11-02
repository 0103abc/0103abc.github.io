import { useState } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { hydroProblemUrl } from '@/lib/hydro';

interface Props {
  baseUrl: string;
  domains: { id: string; name: string }[];
}

function ProblemJumpForm({ baseUrl, domains }: Props) {
  const [error, setError] = useState('');

  return (
    <form
      className="not-prose my-6 rounded-2xl border border-current/15 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
          const url = hydroProblemUrl(baseUrl, String(data.get('domain')), String(data.get('pid')));
          setError('');
          window.location.assign(url);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : '题号无效');
        }
      }}
    >
      <h2 className="mb-4 font-semibold text-xl">按题号直达</h2>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-36 flex-col gap-2 text-sm">
          题库
          <select name="domain" className="rounded-lg border border-current/20 bg-transparent p-2">
            {domains.map(({ id, name }) => (
              <option key={id} value={id} className="bg-white text-neutral-900">
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-40 flex-1 flex-col gap-2 text-sm">
          题号
          <input
            name="pid"
            required
            maxLength={80}
            placeholder="例如 P1001"
            autoComplete="off"
            aria-describedby="hydro-jump-error"
            className="rounded-lg border border-current/20 bg-transparent p-2"
          />
        </label>
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-white transition-opacity hover:opacity-85">
          打开题目
        </button>
      </div>
      <output id="hydro-jump-error" className="mt-3 block text-red-600 text-sm dark:text-red-400">
        {error}
      </output>
    </form>
  );
}

export default function HydroProblemJump(props: Props) {
  return (
    <ErrorBoundary fallback={<p>题号跳转暂不可用，请通过上方题库入口查找题目。</p>}>
      <ProblemJumpForm {...props} />
    </ErrorBoundary>
  );
}

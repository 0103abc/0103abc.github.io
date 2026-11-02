import { useEffect, useId, useState } from 'react';
import {
  type EditorTimeZone,
  formatDateTimeInput,
  parseDateTimeInput,
  parsePostTimestamp,
  UTC_OFFSETS,
  utcOffsetLabel,
} from '../date-time';

interface Props {
  label: string;
  value: unknown;
  legacyTimezone: string;
  required?: boolean;
  onChange: (value: string | undefined) => void;
}

export default function DateTimeField({ label, value, legacyTimezone, required = false, onChange }: Props) {
  const id = useId();
  const [zone, setZone] = useState<EditorTimeZone>('local');
  const [localName, setLocalName] = useState('浏览器本地时区');
  const instant = parsePostTimestamp(value, legacyTimezone);
  const [input, setInput] = useState(() => formatDateTimeInput(instant, 'local'));
  const [error, setError] = useState('');
  useEffect(() => {
    setLocalName(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);
  useEffect(() => {
    setInput(formatDateTimeInput(instant, zone));
    setError('');
  }, [instant, zone]);

  return (
    <fieldset className="editor-date-time">
      <legend>{label}</legend>
      <div className="editor-field-row">
        <label className="editor-field" htmlFor={`${id}-time`}>
          <span>日期与时间</span>
          <input
            id={`${id}-time`}
            type="datetime-local"
            step={60}
            value={input}
            required={required}
            aria-label={label}
            onChange={(event) => {
              const next = event.target.value;
              setInput(next);
              if (!next) {
                setError('');
                onChange(undefined);
                return;
              }
              const timestamp = parseDateTimeInput(next, zone);
              if (!Number.isFinite(timestamp)) {
                setError('这个时间无效或处于夏令时跳过的时段，原时间未修改。');
                return;
              }
              setError('');
              onChange(new Date(timestamp).toISOString());
            }}
          />
        </label>
        <label className="editor-field" htmlFor={`${id}-zone`}>
          <span>显示时区</span>
          <select
            id={`${id}-zone`}
            value={String(zone)}
            aria-label={`${label}时区`}
            onChange={(event) => {
              const next = event.target.value === 'local' ? 'local' : Number(event.target.value);
              setZone(next);
              setInput(formatDateTimeInput(instant, next));
              setError('');
            }}
          >
            <option value="local">自动（{localName}）</option>
            {UTC_OFFSETS.map((offset) => (
              <option key={offset} value={offset}>
                {utcOffsetLabel(offset)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="editor-date-time-detail">
        <output aria-live="polite">
          {Number.isFinite(instant)
            ? `对应 UTC：${new Date(instant).toISOString()}`
            : value
              ? '原日期无法识别，请重新选择。'
              : '尚未设置时间'}
        </output>
        <button
          type="button"
          className="editor-button"
          onClick={() => {
            onChange(new Date(Math.floor(Date.now() / 60000) * 60000).toISOString());
            setError('');
          }}
        >
          设为当前时间
        </button>
      </div>
      {error && (
        <p className="editor-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

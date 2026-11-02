import { fromZonedTime } from 'date-fns-tz';

export type EditorTimeZone = 'local' | number;
export const UTC_OFFSETS = Array.from({ length: 105 }, (_, index) => -720 + index * 15);
const pad = (value: number, length = 2) => String(value).padStart(length, '0');

export function utcOffsetLabel(minutes: number): string {
  return `UTC${minutes < 0 ? '−' : '+'}${pad(Math.floor(Math.abs(minutes) / 60))}:${pad(Math.abs(minutes) % 60)}`;
}

function validZone(zone: EditorTimeZone): boolean {
  return zone === 'local' || (Number.isInteger(zone) && zone >= -720 && zone <= 840 && zone % 15 === 0);
}

function parts(value: string): number[] | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(value);
  if (!match) return null;
  const result = match.slice(1, 7).map((part) => Number(part ?? 0));
  result.push(Number((match[7] ?? '').padEnd(3, '0')));
  const [year, month, day, hour, minute, second, millisecond] = result;
  if (year < 1 || month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) return null;
  const probe = new Date(0);
  probe.setUTCFullYear(year, month - 1, day);
  probe.setUTCHours(hour, minute, second, millisecond);
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return null;
  return result;
}

/** Format a wall clock for an input; changing the view never changes its underlying instant. */
export function formatDateTimeInput(instant: number, zone: EditorTimeZone): string {
  if (!Number.isFinite(instant) || !validZone(zone)) return '';
  const date = new Date(instant + (zone === 'local' ? 0 : zone * 60000));
  if (Number.isNaN(date.getTime())) return '';
  if (zone !== 'local') return date.toISOString().slice(0, 16);
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Reject impossible calendar dates and local daylight-saving gaps instead of silently shifting them. */
export function parseDateTimeInput(value: string, zone: EditorTimeZone): number {
  const parsed = parts(value);
  if (!parsed || !validZone(zone)) return NaN;
  const [year, month, day, hour, minute, second, millisecond] = parsed;
  const date = new Date(0);
  if (zone === 'local') {
    date.setFullYear(year, month - 1, day);
    date.setHours(hour, minute, second, millisecond);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      date.getHours() !== hour ||
      date.getMinutes() !== minute
    )
      return NaN;
    return date.getTime();
  }
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, millisecond);
  return date.getTime() - zone * 60000;
}

/** Old offset-free metadata belongs to the site's timezone, never the writer's browser timezone. */
export function parsePostTimestamp(value: unknown, legacyTimezone: string): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value !== 'string') return NaN;
  const normalized = value.trim().replace(/^(\d{4}-\d{2}-\d{2}) /, '$1T');
  const zoned = /^(.*)(Z|[+-]\d{2}:?\d{2})$/i.exec(normalized);
  if (zoned) {
    if (!parts(zoned[1])) return NaN;
    const instant = Date.parse(normalized);
    return Number.isFinite(instant) ? instant : NaN;
  }
  const wallClock = /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? `${normalized}T00:00` : normalized;
  if (!parts(wallClock)) return NaN;
  return fromZonedTime(wallClock, legacyTimezone).getTime();
}

export function utcPostTimestamp(value: unknown, legacyTimezone: string): string {
  const instant = parsePostTimestamp(value, legacyTimezone);
  if (!Number.isFinite(instant)) throw new Error('日期无效，请在文章属性中重新选择时间。');
  return new Date(instant).toISOString();
}

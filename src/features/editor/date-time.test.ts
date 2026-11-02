import assert from 'node:assert/strict';
import test from 'node:test';
import { toDate } from 'date-fns-tz';
import matter from 'gray-matter';
import {
  formatDateTimeInput,
  parseDateTimeInput,
  parsePostTimestamp,
  UTC_OFFSETS,
  utcOffsetLabel,
  utcPostTimestamp,
} from './date-time';
import { createEditorSource, parseEditorDocument, updateEditorProperty } from './document';
import { preparePublication } from './github-publish';

test('new articles use the current instant rounded to minutes and remain YAML strings in the content loader', () => {
  const now = new Date('2026-11-02T10:30:58.123+09:00');
  const source = createEditorSource(now);
  assert.equal(parseEditorDocument(source).data.date, '2026-11-02T01:30:00.000Z');
  assert.match(source, /date: "2026-11-02T01:30:00.000Z"/);
  const loaded = matter(source).data.date;
  assert.equal(typeof loaded, 'string');
  assert.equal(toDate(loaded, { timeZone: 'Asia/Shanghai' }).getTime(), Date.parse('2026-11-02T01:30:00Z'));
});

test('every 15-minute UTC offset from -12 to +14 roundtrips, including month/year boundaries', () => {
  assert.equal(UTC_OFFSETS[0], -720);
  assert.equal(UTC_OFFSETS.at(-1), 840);
  assert.equal(UTC_OFFSETS.length, 105);
  for (const date of ['2026-11-02T01:30:00Z', '2026-01-01T00:15:00Z', '2026-12-31T23:45:00Z']) {
    const instant = Date.parse(date);
    for (const offset of UTC_OFFSETS)
      assert.equal(parseDateTimeInput(formatDateTimeInput(instant, offset), offset), instant, `${date} ${offset}`);
  }
  assert.equal(formatDateTimeInput(Date.parse('2026-11-02T01:30:00Z'), 480), '2026-11-02T09:30');
  assert.equal(formatDateTimeInput(Date.parse('2026-11-02T01:30:00Z'), 540), '2026-11-02T10:30');
  assert.equal(formatDateTimeInput(Date.parse('2026-11-02T01:30:00Z'), 330), '2026-11-02T07:00');
  assert.equal(formatDateTimeInput(Date.parse('2026-11-02T01:30:00Z'), 345), '2026-11-02T07:15');
  assert.equal(utcOffsetLabel(345), 'UTC+05:45');
  assert.equal(utcOffsetLabel(-720), 'UTC−12:00');
});

test('automatic local time follows daylight saving and rejects missing spring-forward wall times', () => {
  const previous = process.env.TZ;
  process.env.TZ = 'America/New_York';
  try {
    assert.equal(formatDateTimeInput(Date.parse('2026-07-01T12:00:00Z'), 'local'), '2026-07-01T08:00');
    assert.equal(formatDateTimeInput(Date.parse('2026-01-01T12:00:00Z'), 'local'), '2026-01-01T07:00');
    assert.equal(parseDateTimeInput('2026-07-01T08:00', 'local'), Date.parse('2026-07-01T12:00:00Z'));
    assert.ok(Number.isNaN(parseDateTimeInput('2026-03-08T02:30', 'local')));
    assert.equal(parseDateTimeInput('2026-03-08T02:30', -300), Date.parse('2026-03-08T07:30:00Z'));
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

test('impossible calendar dates and unsupported offsets do not silently normalize', () => {
  for (const value of [
    '2026-02-30T10:00',
    '2026-13-01T00:00',
    '2026-01-00T00:00',
    '2026-01-01T24:00',
    '2026-01-01T01:60',
    'not-a-date',
  ]) {
    assert.ok(Number.isNaN(parseDateTimeInput(value, 0)), value);
  }
  assert.ok(Number.isNaN(parseDateTimeInput('2026-01-01T00:00', 855)));
  assert.equal(formatDateTimeInput(NaN, 0), '');
  assert.equal(parseDateTimeInput('0099-01-01T00:00', 0), Date.parse('0099-01-01T00:00:00Z'));
});

test('old dates use the site timezone while explicit UTC/offset timestamps retain their exact instant', () => {
  assert.equal(utcPostTimestamp('2026-11-02 09:30:00', 'Asia/Shanghai'), '2026-11-02T01:30:00.000Z');
  assert.equal(utcPostTimestamp('2026-11-02T10:30:00+09:00', 'Asia/Shanghai'), '2026-11-02T01:30:00.000Z');
  assert.equal(utcPostTimestamp('2026-11-02T01:30:23.456Z', 'Asia/Shanghai'), '2026-11-02T01:30:23.456Z');
  assert.equal(utcPostTimestamp('2026-06-13', 'Asia/Shanghai'), '2026-06-12T16:00:00.000Z');
  assert.ok(Number.isNaN(parsePostTimestamp('2026-02-30T00:00:00Z', 'Asia/Shanghai')));
  assert.throws(() => utcPostTimestamp('', 'Asia/Shanghai'), /日期无效/);
});

test('publishing canonical UTC dates preserves body and survives the production YAML date parser', () => {
  const source =
    '---\ntitle: T\ndate: 2026-11-02 09:30:00\nupdated: 2026-11-02T12:00:00+05:45\ncustom: keep # 原注释\n---\n\n正文与代码不改。\n';
  const post = preparePublication(source, 'timezone-test', [], 'Asia/Shanghai');
  const loaded = matter(post.source).data;
  assert.equal(loaded.date, '2026-11-02T01:30:00.000Z');
  assert.equal(loaded.updated, '2026-11-02T06:15:00.000Z');
  assert.equal(toDate(loaded.date, { timeZone: 'Asia/Shanghai' }).toISOString(), loaded.date);
  assert.equal(parseEditorDocument(post.source).body, parseEditorDocument(source).body);
  assert.match(post.source, /# 原注释/);
  const retitled = updateEditorProperty(source, 'title', 'New');
  assert.match(retitled, /date: 2026-11-02 09:30:00/);
  assert.equal(preparePublication(post.source, 'timezone-test').source, post.source);
});

import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	TimestampFormat,
	TimestampKind,
	formatTimestamp,
	formatTimestampCopy,
	formatTimestampFull,
	formatTimestampRelative,
	isSupportedTimeZone,
	parseTimestamp,
	type TimestampLocaleOptions,
	type TimestampValue,
} from '../../src/utils/format-timestamp.js'

// Exact strings are pinned to the ICU in .nvmrc's Node (24.14.0, ICU 78.2). Bumping .nvmrc is a
// deliberate change that regenerates these expectations.
const NOW = Date.parse('2026-10-01T21:04:09Z')
const SECOND = 1_000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const ALL_FORMATS = [
	TimestampFormat.Compact,
	TimestampFormat.Relative,
	TimestampFormat.Contextual,
	TimestampFormat.Time,
	TimestampFormat.Absolute,
	TimestampFormat.Date,
] as const

type LadderRow = [label: string, offsetMs: number, compact: string, relative: string, contextual: string, time: string, absolute: string, date: string, unbounded: string]

const DENVER = { locale: 'en-US', timeZone: 'America/Denver' }
const LONDON = { locale: 'en-GB', timeZone: 'Europe/London' }

const DENVER_LADDER: LadderRow[] = [
	['+30 s (skew)', 30 * SECOND, 'now', 'now', 'Today at 3:04 PM', '3:04 PM', 'Oct 1, 2026, 3:04 PM', 'Thu, Oct 1, 2026', 'now'],
	['-20 s', -20 * SECOND, 'now', 'now', 'Today at 3:03 PM', '3:03 PM', 'Oct 1, 2026, 3:03 PM', 'Thu, Oct 1, 2026', 'now'],
	['-5 m', -5 * MINUTE, '5m', '5 minutes ago', 'Today at 2:59 PM', '2:59 PM', 'Oct 1, 2026, 2:59 PM', 'Thu, Oct 1, 2026', '5 minutes ago'],
	['-59 m', -59 * MINUTE, '59m', '59 minutes ago', 'Today at 2:05 PM', '2:05 PM', 'Oct 1, 2026, 2:05 PM', 'Thu, Oct 1, 2026', '59 minutes ago'],
	['-3 h', -3 * HOUR, '3h', '3 hours ago', 'Today at 12:04 PM', '12:04 PM', 'Oct 1, 2026, 12:04 PM', 'Thu, Oct 1, 2026', '3 hours ago'],
	['-20 h', -20 * HOUR, '20h', '20 hours ago', 'Yesterday at 7:04 PM', '7:04 PM', 'Sep 30, 2026, 7:04 PM', 'Wed, Sep 30, 2026', '20 hours ago'],
	['-30 h', -30 * HOUR, 'Sep 30', 'yesterday', 'Yesterday at 9:04 AM', '9:04 AM', 'Sep 30, 2026, 9:04 AM', 'Wed, Sep 30, 2026', 'yesterday'],
	['-2 d', -2 * DAY, 'Sep 29', '2 days ago', 'Tuesday at 3:04 PM', '3:04 PM', 'Sep 29, 2026, 3:04 PM', 'Tue, Sep 29, 2026', '2 days ago'],
	['-6 d', -6 * DAY, 'Sep 25', '6 days ago', 'Friday at 3:04 PM', '3:04 PM', 'Sep 25, 2026, 3:04 PM', 'Fri, Sep 25, 2026', '6 days ago'],
	['-8 d', -8 * DAY, 'Sep 23', 'Sep 23', 'Sep 23 at 3:04 PM', '3:04 PM', 'Sep 23, 2026, 3:04 PM', 'Wed, Sep 23, 2026', '1 week ago'],
	['-30 d', -30 * DAY, 'Sep 1', 'Sep 1', 'Sep 1 at 3:04 PM', '3:04 PM', 'Sep 1, 2026, 3:04 PM', 'Tue, Sep 1, 2026', '1 month ago'],
	['-200 d', -200 * DAY, 'Mar 15, 2026', 'Mar 15, 2026', 'Mar 15, 2026 at 3:04 PM', '3:04 PM', 'Mar 15, 2026, 3:04 PM', 'Sun, Mar 15, 2026', '6 months ago'],
	['-400 d', -400 * DAY, 'Aug 27, 2025', 'Aug 27, 2025', 'Aug 27, 2025 at 3:04 PM', '3:04 PM', 'Aug 27, 2025, 3:04 PM', 'Wed, Aug 27, 2025', '1 year ago'],
	['+5 m', 5 * MINUTE, '3:09 PM', 'in 5 minutes', 'Today at 3:09 PM', '3:09 PM', 'Oct 1, 2026, 3:09 PM', 'Thu, Oct 1, 2026', 'in 5 minutes'],
	['+3 h', 3 * HOUR, '6:04 PM', 'in 3 hours', 'Today at 6:04 PM', '6:04 PM', 'Oct 1, 2026, 6:04 PM', 'Thu, Oct 1, 2026', 'in 3 hours'],
	['+1 d', DAY, 'Oct 2', 'tomorrow', 'Tomorrow at 3:04 PM', '3:04 PM', 'Oct 2, 2026, 3:04 PM', 'Fri, Oct 2, 2026', 'tomorrow'],
	['+4 d', 4 * DAY, 'Oct 5', 'in 4 days', 'Monday at 3:04 PM', '3:04 PM', 'Oct 5, 2026, 3:04 PM', 'Mon, Oct 5, 2026', 'in 4 days'],
	['+40 d', 40 * DAY, 'Nov 10', 'Nov 10', 'Nov 10 at 2:04 PM', '2:04 PM', 'Nov 10, 2026, 2:04 PM', 'Tue, Nov 10, 2026', 'in 1 month'],
]

const LONDON_LADDER: LadderRow[] = [
	['+30 s', 30 * SECOND, 'now', 'now', 'Today at 22:04', '22:04', '1 Oct 2026, 22:04', 'Thu, 1 Oct 2026', 'now'],
	['-5 m', -5 * MINUTE, '5m', '5 minutes ago', 'Today at 21:59', '21:59', '1 Oct 2026, 21:59', 'Thu, 1 Oct 2026', '5 minutes ago'],
	['-3 h', -3 * HOUR, '3h', '3 hours ago', 'Today at 19:04', '19:04', '1 Oct 2026, 19:04', 'Thu, 1 Oct 2026', '3 hours ago'],
	['-20 h', -20 * HOUR, '20h', '20 hours ago', 'Today at 02:04', '02:04', '1 Oct 2026, 02:04', 'Thu, 1 Oct 2026', '20 hours ago'],
	['-30 h', -30 * HOUR, '30 Sept', 'yesterday', 'Yesterday at 16:04', '16:04', '30 Sept 2026, 16:04', 'Wed, 30 Sept 2026', 'yesterday'],
	['-2 d', -2 * DAY, '29 Sept', '2 days ago', 'Tuesday at 22:04', '22:04', '29 Sept 2026, 22:04', 'Tue, 29 Sept 2026', '2 days ago'],
	['-8 d', -8 * DAY, '23 Sept', '23 Sept', '23 Sept at 22:04', '22:04', '23 Sept 2026, 22:04', 'Wed, 23 Sept 2026', '1 week ago'],
	['-200 d', -200 * DAY, '15 Mar 2026', '15 Mar 2026', '15 Mar 2026 at 21:04', '21:04', '15 Mar 2026, 21:04', 'Sun, 15 Mar 2026', '6 months ago'],
	['+5 m', 5 * MINUTE, '22:09', 'in 5 minutes', 'Today at 22:09', '22:09', '1 Oct 2026, 22:09', 'Thu, 1 Oct 2026', 'in 5 minutes'],
	['+3 h', 3 * HOUR, '2 Oct', 'in 3 hours', 'Tomorrow at 01:04', '01:04', '2 Oct 2026, 01:04', 'Fri, 2 Oct 2026', 'in 3 hours'],
	['+1 d', DAY, '2 Oct', 'tomorrow', 'Tomorrow at 22:04', '22:04', '2 Oct 2026, 22:04', 'Fri, 2 Oct 2026', 'tomorrow'],
]

function getLadder(value: number, viewer: TimestampLocaleOptions, now = NOW): string[] {
	const live = { ...viewer, now }
	return [
		...ALL_FORMATS.map(format => formatTimestamp(value, format, live) ?? 'null'),
		formatTimestampRelative(value, live) ?? 'null',
	]
}

describe('formatTimestamp ladders', () => {
	it.each(DENVER_LADDER)('en-US, America/Denver, %s', (_label, offset, ...expected) => {
		expect(getLadder(NOW + offset, DENVER)).toEqual(expected)
	})

	it.each(LONDON_LADDER)('en-GB, Europe/London, %s', (_label, offset, ...expected) => {
		expect(getLadder(NOW + offset, LONDON)).toEqual(expected)
	})

	it('accepts string literals wherever the enum is', () => {
		expect(formatTimestamp(NOW - 5 * MINUTE, 'RELATIVE', { ...DENVER, now: NOW })).toBe('5 minutes ago')
		expect(formatTimestamp(NOW, 'ABSOLUTE', DENVER)).toBe('Oct 1, 2026, 3:04 PM')
	})

	it('reads Contextual in the locale\u2019s own joiner and casing', () => {
		const offsets = [0, -30 * HOUR, -2 * DAY, -40 * DAY]
		const contextual = (locale: string, timeZone: string) =>
			offsets.map(offset => formatTimestamp(NOW + offset, TimestampFormat.Contextual, { locale, timeZone, now: NOW }))
		const [deToday, deYesterday, deWeekday, deDate] = contextual('de-DE', 'Europe/Berlin')
		expect(deToday).toMatch(/^Heute um \d{2}:\d{2}$/)
		expect(deYesterday).toMatch(/^Gestern um \d{2}:\d{2}$/)
		expect(deWeekday).toMatch(/^Dienstag um \d{2}:\d{2}$/)
		expect(deDate).toMatch(/^22\. Aug\.? um \d{2}:\d{2}$/)
		const [frToday, frYesterday, frWeekday] = contextual('fr-FR', 'Europe/Paris')
		expect(frToday).toMatch(/^Aujourd.hui à \d{2}:\d{2}$/)
		expect(frYesterday).toMatch(/^Hier à \d{2}:\d{2}$/)
		expect(frWeekday).toMatch(/^Mardi à \d{2}:\d{2}$/)
		const [esToday, esYesterday, esWeekday] = contextual('es-ES', 'Europe/Madrid')
		expect(esToday).toMatch(/^Hoy a las \d{1,2}:\d{2}$/)
		expect(esYesterday).toMatch(/^Ayer a las \d{1,2}:\d{2}$/)
		expect(esWeekday).toMatch(/^Martes a las \d{1,2}:\d{2}$/)
		const [jaToday, jaYesterday, jaWeekday] = contextual('ja-JP', 'Asia/Tokyo')
		expect(jaToday).toMatch(/^今日 \d{1,2}:\d{2}$/)
		expect(jaYesterday).toMatch(/^昨日 \d{1,2}:\d{2}$/)
		expect(jaWeekday).toMatch(/^水曜日 \d{1,2}:\d{2}$/)
		const [zhToday, , zhWeekday] = contextual('zh-CN', 'Asia/Shanghai')
		expect(zhToday).toMatch(/^今天 \d{2}:\d{2}$/)
		expect(zhWeekday).toMatch(/^星期三 \d{2}:\d{2}$/)
	})

	it('keeps Georgian day labels in Mkhedruli, never Mtavruli capitals', () => {
		const [today, weekday] = [0, -5 * DAY].map(offset =>
			formatTimestamp(NOW + offset, TimestampFormat.Contextual, { locale: 'ka-GE', timeZone: 'Europe/Berlin', now: NOW })
		)
		const mtavruli = /[\u1C90-\u1CBF]/
		expect(today).toMatch(/^დღეს, \d{2}:\d{2}$/)
		expect(today).not.toMatch(mtavruli)
		expect(weekday).toMatch(/^შაბათი, \d{2}:\d{2}$/)
		expect(formatTimestamp('2026-10-01', TimestampFormat.Compact, { locale: 'ka-GE', timeZone: 'Europe/Berlin', now: NOW })).not.toMatch(
			mtavruli
		)
	})
})

describe('hour cycle and padding', () => {
	it('forces a 24-hour clock with hourCycle h23, so midnight is 00:00, never 24:00', () => {
		const h23 = { ...DENVER, hour12: false, now: NOW }
		expect(formatTimestamp(NOW, TimestampFormat.Time, h23)).toBe('15:04')
		expect(formatTimestamp(NOW - 2 * DAY, TimestampFormat.Contextual, h23)).toBe('Tuesday at 15:04')
		expect(formatTimestamp('2026-10-01T06:00:00Z', TimestampFormat.Absolute, h23)).toBe('Oct 1, 2026, 00:00')
	})

	it('lets the locale pick h11 or h12 for a 12-hour clock', () => {
		expect(
			formatTimestamp('2026-10-01T15:00:00Z', TimestampFormat.Time, { locale: 'ja-JP', timeZone: 'Asia/Tokyo', hour12: true })
		).toBe('午前0:00')
		expect(formatTimestamp(NOW, TimestampFormat.Time, { ...LONDON, hour12: true })).toBe('10:04 pm')
	})

	it('uses the locale’s own unpadded 12-hour form when hour12 forces it on a 24-hour locale', () => {
		const value = '2026-10-01T09:05:00Z'
		expect(formatTimestamp(value, TimestampFormat.Time, { locale: 'en-GB', timeZone: 'UTC', hour12: true })).toBe('9:05 am')
		expect(formatTimestamp(value, TimestampFormat.Time, { locale: 'en-US-u-hc-h23', timeZone: 'UTC', hour12: true })).toBe(
			'9:05 AM'
		)
		expect(formatTimestampCopy(value, { locale: 'en-GB', timeZone: 'UTC', hour12: true })).toBe('Thu, 1 Oct 2026, 9:05 am UTC')
		expect(formatTimestamp(value, TimestampFormat.Time, { locale: 'en-GB', timeZone: 'UTC' })).toBe('09:05')
	})

	it('pads the hour only where the locale does', () => {
		const value = '2026-10-01T02:04:00Z'
		expect(formatTimestamp(value, TimestampFormat.Time, { locale: 'en-GB', timeZone: 'UTC' })).toBe('02:04')
		expect(formatTimestamp(value, TimestampFormat.Time, { locale: 'en-US', timeZone: 'UTC' })).toBe('2:04 AM')
	})
})

describe('tooltip and copy text', () => {
	const COPY_TABLE: [locale: string, timeZone: string, instant: string, full: string, copy: string][] = [
		['en-US', 'America/Denver', '2026-10-01T21:04:09Z', 'Thursday, October 1, 2026 at 3:04:09 PM MDT', 'Thu, Oct 1, 2026, 3:04 PM MDT (UTC-6)'],
		['en-US', 'America/Denver', '2026-11-01T07:30:00Z', 'Sunday, November 1, 2026 at 1:30:00 AM MDT', 'Sun, Nov 1, 2026, 1:30 AM MDT (UTC-6)'],
		['en-US', 'America/Denver', '2026-11-01T08:30:00Z', 'Sunday, November 1, 2026 at 1:30:00 AM MST', 'Sun, Nov 1, 2026, 1:30 AM MST (UTC-7)'],
		['en-GB', 'Europe/Berlin', '2026-10-01T21:04:09Z', 'Thursday, 1 October 2026 at 23:04:09 CEST', 'Thu, 1 Oct 2026, 23:04 CEST (UTC+2)'],
		['en-US', 'Europe/Berlin', '2026-10-01T21:04:09Z', 'Thursday, October 1, 2026 at 11:04:09 PM UTC+2', 'Thu, Oct 1, 2026, 11:04 PM UTC+2'],
		['en-GB', 'Europe/London', '2026-01-15T09:30:00Z', 'Thursday, 15 January 2026 at 09:30:00 GMT', 'Thu, 15 Jan 2026, 09:30 GMT (UTC+0)'],
		['en-US', 'UTC', '2026-10-01T21:04:09Z', 'Thursday, October 1, 2026 at 9:04:09 PM UTC', 'Thu, Oct 1, 2026, 9:04 PM UTC'],
		['en-IN', 'Asia/Kolkata', '2026-10-01T21:04:09Z', 'Friday, 2 October 2026 at 2:34:09 am IST', 'Fri, 2 Oct, 2026, 2:34 am IST (UTC+5:30)'],
		['en-US', 'Pacific/Chatham', '2026-10-01T21:04:09Z', 'Friday, October 2, 2026 at 10:49:09 AM UTC+13:45', 'Fri, Oct 2, 2026, 10:49 AM UTC+13:45'],
		['de-DE', 'Europe/Berlin', '2026-10-01T21:04:09Z', 'Donnerstag, 1. Oktober 2026 um 23:04:09 MESZ', 'Do., 1. Okt. 2026, 23:04 MESZ (UTC+2)'],
		['fr-FR', 'America/Denver', '2026-10-01T21:04:09Z', 'jeudi 1 octobre 2026 à 15:04:09 UTC-6', 'jeu. 1 oct. 2026, 15:04 UTC-6'],
		['ja-JP', 'Asia/Tokyo', '2026-10-01T21:04:09Z', '2026年10月2日金曜日 6:04:09 JST', '2026年10月2日(金) 6:04 JST (UTC+9)'],
	]

	it.each(COPY_TABLE)('%s, %s, %s', (locale, timeZone, instant, full, copy) => {
		expect(formatTimestampFull(instant, { locale, timeZone })).toBe(full)
		expect(formatTimestampCopy(instant, { locale, timeZone })).toBe(copy)
	})

	// Historical local mean time: tzdata offsets with seconds. Each offset must agree with the local time beside it.
	const LOCAL_MEAN_TIME_TABLE: [timeZone: string, instant: string, full: string, copy: string][] = [
		['Africa/Monrovia', '1970-06-01T12:00:00Z', 'Monday, June 1, 1970 at 11:15:30 AM UTC-0:44:30', 'Mon, Jun 1, 1970, 11:15 AM UTC-0:44:30'],
		['America/Denver', '1850-01-01T19:00:00Z', 'Tuesday, January 1, 1850 at 12:00:04 PM UTC-6:59:56', 'Tue, Jan 1, 1850, 12:00 PM UTC-6:59:56'],
		['Asia/Kolkata', '1900-01-01T12:00:00Z', 'Monday, January 1, 1900 at 5:21:10 PM UTC+5:21:10', 'Mon, Jan 1, 1900, 5:21 PM UTC+5:21:10'],
	]

	it.each(LOCAL_MEAN_TIME_TABLE)('labels a seconds offset exactly: %s %s', (timeZone, instant, full, copy) => {
		expect(formatTimestampFull(instant, { locale: 'en-US', timeZone })).toBe(full)
		expect(formatTimestampCopy(instant, { locale: 'en-US', timeZone })).toBe(copy)
	})
})

describe('date-only values', () => {
	const DATE_ONLY_TABLE: [viewer: TimestampLocaleOptions, value: string, compact: string, relative: string, date: string, full: string, line2: string, copy: string][] = [
		[DENVER, '2026-10-01', 'Today', 'today', 'Thu, Oct 1, 2026', 'Thursday, October 1, 2026', 'today', 'Thu, Oct 1, 2026'],
		[DENVER, '2026-10-05', 'Monday', 'in 4 days', 'Mon, Oct 5, 2026', 'Monday, October 5, 2026', 'in 4 days', 'Mon, Oct 5, 2026'],
		[DENVER, '2026-10-20', 'Oct 20', 'Oct 20', 'Tue, Oct 20, 2026', 'Tuesday, October 20, 2026', 'in 2 weeks', 'Tue, Oct 20, 2026'],
		[DENVER, '2027-06-01', 'Jun 1, 2027', 'Jun 1, 2027', 'Tue, Jun 1, 2027', 'Tuesday, June 1, 2027', 'in 8 months', 'Tue, Jun 1, 2027'],
		[{ locale: 'en-US', timeZone: 'Asia/Tokyo' }, '2026-10-01', 'Yesterday', 'yesterday', 'Thu, Oct 1, 2026', 'Thursday, October 1, 2026', 'yesterday', 'Thu, Oct 1, 2026'],
		[LONDON, '2026-09-30', 'Yesterday', 'yesterday', 'Wed, 30 Sept 2026', 'Wednesday, 30 September 2026', 'yesterday', 'Wed, 30 Sept 2026'],
	]

	it.each(DATE_ONLY_TABLE)('%o %s', (viewer, value, compact, relative, date, full, line2, copy) => {
		const live = { ...viewer, now: NOW }
		expect(formatTimestamp(value, TimestampFormat.Compact, live)).toBe(compact)
		expect(formatTimestamp(value, TimestampFormat.Contextual, live)).toBe(compact)
		expect(formatTimestamp(value, TimestampFormat.Relative, live)).toBe(relative)
		expect(formatTimestamp(value, TimestampFormat.Date, viewer)).toBe(date)
		expect(formatTimestamp(value, TimestampFormat.Absolute, viewer)).toBe(date)
		expect(formatTimestamp(value, TimestampFormat.Time, viewer)).toBe(date)
		expect(formatTimestampFull(value, viewer)).toBe(full)
		expect(formatTimestampRelative(value, live)).toBe(line2)
		expect(formatTimestampCopy(value, viewer)).toBe(copy)
		expect(parseTimestamp(value)?.dateTime).toBe(value)
	})

	it('never shows a time or zone in the full line or the copy', () => {
		for (const timeZone of ['America/Denver', 'Asia/Tokyo', 'Pacific/Chatham', 'UTC']) {
			const options = { locale: 'en-US', timeZone }
			expect(formatTimestampFull('2026-10-05', options)).not.toMatch(/\d:\d|UTC|GMT/)
			expect(formatTimestampCopy('2026-10-05', options)).not.toMatch(/\d:\d|UTC|GMT/)
		}
	})

	it('returns null for a date that does not exist', () => {
		const live = { ...DENVER, now: NOW }
		expect(parseTimestamp('2026-02-30')).toBeNull()
		expect(formatTimestamp('2026-02-30', TimestampFormat.Compact, live)).toBeNull()
		expect(formatTimestampRelative('2026-02-30', live)).toBeNull()
		expect(formatTimestampFull('2026-02-30', DENVER)).toBeNull()
		expect(formatTimestampCopy('2026-02-30', DENVER)).toBeNull()
	})
})

describe('edge cases', () => {
	it('keeps a 25-hour fall-back day as one calendar day', () => {
		const now = Date.parse('2026-11-02T06:30:00Z')
		const live = { ...DENVER, now }
		expect(formatTimestamp('2026-11-01T06:00:00Z', TimestampFormat.Contextual, live)).toBe('Today at 12:00 AM')
		expect(formatTimestamp('2026-11-01T06:00:00Z', TimestampFormat.Relative, live)).toBe('24 hours ago')
	})

	it('handles a 23-hour spring-forward day', () => {
		const live = { ...DENVER, now: Date.parse('2026-03-09T06:30:00Z') }
		expect(formatTimestamp('2026-03-08T07:30:00Z', TimestampFormat.Contextual, live)).toBe('Yesterday at 12:30 AM')
		expect(formatTimestamp('2026-03-08T07:30:00Z', TimestampFormat.Relative, live)).toBe('23 hours ago')
	})

	it('splits two minutes across midnight into yesterday', () => {
		const live = { ...DENVER, now: Date.parse('2026-10-02T06:01:00Z') }
		expect(formatTimestamp('2026-10-02T05:59:00Z', TimestampFormat.Contextual, live)).toBe('Yesterday at 11:59 PM')
		expect(formatTimestamp('2026-10-02T05:59:00Z', TimestampFormat.Compact, live)).toBe('2m')
	})

	it('reads a +10:30 zone\u2019s future straddle as tomorrow', () => {
		const live = { locale: 'en-US', timeZone: 'Australia/Lord_Howe', now: Date.parse('2026-10-01T13:29:00Z') }
		expect(formatTimestamp('2026-10-01T13:31:00Z', TimestampFormat.Contextual, live)).toBe('Tomorrow at 12:01 AM')
	})

	it('takes the year from the viewer\u2019s zone at the year boundary', () => {
		expect(
			formatTimestamp('2026-12-31T11:00:00Z', TimestampFormat.Absolute, { locale: 'en-US', timeZone: 'Pacific/Chatham' })
		).toBe('Jan 1, 2027, 12:45 AM')
	})

	it('omits the year for the previous year inside the six-month window', () => {
		const live = { ...DENVER, now: Date.parse('2027-01-02T19:00:00Z') }
		expect(formatTimestamp('2026-12-31T19:00:00Z', TimestampFormat.Compact, live)).toBe('Dec 31')
	})

	it('shows the year from 183 calendar days away', () => {
		const live = { ...DENVER, now: NOW }
		expect(formatTimestamp(NOW - 182 * DAY, TimestampFormat.Compact, live)).toBe('Apr 2')
		expect(formatTimestamp(NOW - 183 * DAY, TimestampFormat.Compact, live)).toBe('Apr 1, 2026')
	})

	it('never says "this month" for a 30-day gap inside one month', () => {
		const live = { ...DENVER, now: Date.parse('2027-01-31T19:00:00Z') }
		expect(formatTimestampRelative('2027-01-01T19:00:00Z', live)).toBe('1 month ago')
	})

	it('counts years before 100 CE and BCE as signed proleptic Gregorian years', () => {
		const utc = { locale: 'en-US', timeZone: 'UTC', now: Date.parse('2026-06-01T00:00:00Z') }
		expect(formatTimestampRelative('0000-06-01T00:00:00Z', utc)).toBe('2,026 years ago')
		expect(formatTimestampRelative('0050-06-01T00:00:00Z', utc)).toBe('1,976 years ago')
		expect(formatTimestampRelative(new Date(0).setUTCFullYear(-1, 0, 1), utc)).toBe('2,027 years ago')
		expect(formatTimestampRelative(-8.64e15, { ...DENVER, now: NOW })).toBe('273,847 years ago')
		expect(formatTimestamp('0000-06-01T00:00:00Z', TimestampFormat.Absolute, utc)).toBe('Jun 1, 1 BC, 12:00 AM')
		expect(formatTimestamp('0000-06-01', TimestampFormat.Date, utc)).toBe('Thu, Jun 1, 1 BC')
		expect(formatTimestamp('0050-06-01T00:00:00Z', TimestampFormat.Absolute, utc)).toBe('Jun 1, 50, 12:00 AM')
	})

	it('treats 61 seconds ahead as the future, not now', () => {
		const live = { ...DENVER, now: NOW }
		expect(formatTimestamp(NOW + 61 * SECOND, TimestampFormat.Compact, live)).toBe('3:05 PM')
		expect(formatTimestamp(NOW + 61 * SECOND, TimestampFormat.Relative, live)).toBe('in 1 minute')
		expect(formatTimestamp(NOW + 30 * SECOND, TimestampFormat.Compact, live)).toBe('now')
	})
})

describe('parseTimestamp', () => {
	it('parses Postgres timestamptz text', () => {
		expect(parseTimestamp('2026-10-01 21:04:09.123456+00')).toEqual({
			kind: TimestampKind.Instant,
			epochMs: Date.parse('2026-10-01T21:04:09.123Z'),
			dateTime: '2026-10-01T21:04:09.123Z',
		})
	})

	it.each([
		'2026-10-01T21:04:09Z',
		'2026-10-01T21:04:09z',
		'2026-10-01T21:04:09+00',
		'2026-10-01T21:04:09+0000',
		'2026-10-01T21:04:09+00:00',
		'2026-10-01 21:04:09Z',
		'2026-10-01T21:04:09.000000000Z',
		'2026-10-01T15:04:09-06:00',
		'2026-10-02T02:34:09+0530',
	])('reads %s as the same instant', value => {
		expect(parseTimestamp(value)?.dateTime).toBe('2026-10-01T21:04:09.000Z')
	})

	it('truncates fractional digits past milliseconds', () => {
		expect(parseTimestamp('2026-10-01T21:04:09.987654321Z')?.dateTime).toBe('2026-10-01T21:04:09.987Z')
		expect(parseTimestamp('2026-10-01T21:04:09,5Z')?.dateTime).toBe('2026-10-01T21:04:09.500Z')
	})

	it('accepts a Date and epoch milliseconds', () => {
		expect(parseTimestamp(new Date(NOW))?.dateTime).toBe('2026-10-01T21:04:09.000Z')
		expect(parseTimestamp(NOW)?.kind).toBe(TimestampKind.Instant)
	})

	it.each<TimestampValue>([
		'not a date',
		'',
		Number.NaN,
		Number.POSITIVE_INFINITY,
		new Date('x'),
		'2026-13-01',
		'2026-10-01T15:00',
		'2026-10-01T15:00:00',
		9e15,
		'2026-10-01T24:00:00Z',
		'2026-10-01T23:60:00Z',
		'2026-10-01T23:59:60Z',
		'2026-02-29T00:00:00Z',
		'2026-10-01T21:04:09+24:00',
		'2026-10-01T21:04:09+05:60',
		'2026-10-01T21:04:09.1234567890Z',
	])('returns null for %o', value => {
		expect(parseTimestamp(value)).toBeNull()
		expect(formatTimestamp(value, TimestampFormat.Relative, { ...DENVER, now: NOW })).toBeNull()
		expect(formatTimestampCopy(value, DENVER)).toBeNull()
	})
})

describe('configuration errors', () => {
	it('throws RangeError for an invalid locale or zone', () => {
		expect(() => formatTimestamp(NOW, TimestampFormat.Absolute, { locale: 'en_US', timeZone: 'UTC' })).toThrow(RangeError)
		expect(() => formatTimestamp(NOW, TimestampFormat.Absolute, { locale: 'en-US', timeZone: 'Mars/Olympus' })).toThrow(
			RangeError
		)
		expect(() => formatTimestampCopy(NOW, { locale: 'en-US', timeZone: 'Mars/Olympus' })).toThrow(RangeError)
	})

	it.each([
		['an Invalid Date', new Date('x')],
		['NaN', Number.NaN],
		['a string from plain JavaScript', '2026-10-01T21:04:09Z'],
	])('throws a named TypeError when now is %s', (_label, now) => {
		const error = new TypeError('now must be a finite epoch ms or a valid Date')
		const options = { ...DENVER, now: now as number }
		expect(() => formatTimestamp(NOW, TimestampFormat.Relative, options)).toThrow(error)
		expect(() => formatTimestampRelative(NOW, options)).toThrow(error)
		expect(formatTimestamp(NOW, TimestampFormat.Absolute, options)).toBe('Oct 1, 2026, 3:04 PM')
	})

	it('requires now for live formats', () => {
		// @ts-expect-error a live format without `now` is a compile error (checked by tsconfig.type-tests.json)
		expect(() => formatTimestamp(NOW, TimestampFormat.Relative, DENVER)).toThrow(new TypeError('now is required for RELATIVE'))
		const heldInAVariable: TimestampFormat[] = [TimestampFormat.Compact]
		expect(() => formatTimestamp(NOW, heldInAVariable[0], DENVER)).toThrow(TypeError)
	})

	it('checks a zone by constructing a formatter', () => {
		expect(isSupportedTimeZone('America/Denver')).toBe(true)
		expect(isSupportedTimeZone('Asia/Calcutta')).toBe(true)
		expect(isSupportedTimeZone('Mars/Olympus')).toBe(false)
		expect(isSupportedTimeZone('')).toBe(false)
	})
})

describe('normalization', () => {
	it('never emits narrow, thin, figure or no-break spaces, or Unicode minus and dashes', () => {
		let seed = 0x5eed
		const random = () => {
			seed = (seed + 0x6d2b79f5) | 0
			let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
			return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
		}
		const locales = ['en-US', 'en-GB', 'de-DE', 'ja-JP', 'fr-FR']
		const zones = ['America/Denver', 'Europe/Berlin', 'Asia/Kolkata', 'Pacific/Chatham', 'Australia/Lord_Howe', 'UTC']
		const forbidden = /[\u202F\u2009\u2007\u00A0\u2212\u2013]/
		const offenders: string[] = []
		for (let index = 0; index < 2_000; index += 1) {
			const value = NOW + Math.round((random() - 0.5) * 2 * 800 * DAY)
			const locale = locales[index % locales.length]
			const timeZone = zones[Math.floor(random() * zones.length)]
			const live = { locale, timeZone, now: NOW, hour12: index % 3 === 0 ? undefined : index % 3 === 1 }
			const outputs = [
				...ALL_FORMATS.map(format => formatTimestamp(value, format, live)),
				formatTimestampRelative(value, live),
				formatTimestampFull(value, live),
				formatTimestampCopy(value, live),
			]
			for (const output of outputs) if (output === null || forbidden.test(output)) offenders.push(`${locale} ${timeZone} ${output}`)
		}
		expect(offenders).toEqual([])
	})
})

describe('formatter cache', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('constructs each preset once for one locale and zone', () => {
		const constructor = vi.spyOn(Intl, 'DateTimeFormat')
		const viewer = { locale: 'en-AU', timeZone: 'Australia/Perth', now: NOW }
		const formatAll = (value: number) => {
			for (const format of ALL_FORMATS) formatTimestamp(value, format, viewer)
			formatTimestampRelative(value, viewer)
			formatTimestampFull(value, viewer)
			formatTimestampCopy(value, viewer)
		}
		const values = Array.from({ length: 100 }, (_, index) => NOW - index * 7 * HOUR)
		for (const value of values) formatAll(value)
		const constructed = constructor.mock.calls.map(call => JSON.stringify(call))
		expect(new Set(constructed).size).toBe(constructed.length)
		for (const value of values) formatAll(value)
		expect(constructor.mock.calls.length).toBe(constructed.length)
	})
})

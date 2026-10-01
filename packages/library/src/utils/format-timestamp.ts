import { DAY_MS, HOUR_MS, MINUTE_MS } from '../internal/time-units.js'

/**
 * How a timestamp's visible label reads. Values are UPPER_SNAKE_CASE per the enum-modeling standard;
 * the matching string literal (`'RELATIVE'`) is accepted wherever the enum is.
 */
export enum TimestampFormat {
	/** Dense lists, feeds, table cells: `now`, `5m`, `3h`, then `Sep 28`. A future time today shows the time of day (`3:09 PM`). */
	Compact = 'COMPACT',
	/** Activity, comments, notifications: `5 minutes ago`, `yesterday`, `6 days ago`, then `Sep 23`. */
	Relative = 'RELATIVE',
	/** Chat messages, schedules, reminders: `Today at 3:04 PM`, `Monday at 9:00 AM`, `Sep 23 at 3:04 PM`. */
	Contextual = 'CONTEXTUAL',
	/** Rows under a day divider: `3:04 PM`. A date-only value shows the Date format instead. */
	Time = 'TIME',
	/** Audit logs, billing, legal, security, exports. Never relative, never ticks: `Oct 1, 2026, 3:04 PM`. */
	Absolute = 'ABSOLUTE',
	/** Calendar dates such as due dates and birthdays: `Thu, Oct 1, 2026`. */
	Date = 'DATE',
}

/** Formats whose label depends on the current instant. */
export type LiveTimestampFormat =
	| TimestampFormat.Compact
	| TimestampFormat.Relative
	| TimestampFormat.Contextual
	| `${TimestampFormat.Compact}`
	| `${TimestampFormat.Relative}`
	| `${TimestampFormat.Contextual}`

/** Formats whose label never depends on the current instant. */
export type FixedTimestampFormat =
	| TimestampFormat.Time
	| TimestampFormat.Absolute
	| TimestampFormat.Date
	| `${TimestampFormat.Time}`
	| `${TimestampFormat.Absolute}`
	| `${TimestampFormat.Date}`

/** Whether a value is a moment in time or a calendar date. */
export enum TimestampKind {
	/** A moment in time, shown in the viewer's zone. */
	Instant = 'INSTANT',
	/** A `YYYY-MM-DD` calendar date: no time, no zone, never shifts a day. */
	DateOnly = 'DATE_ONLY',
}

/** What went wrong, reported through `TimestampProvider`'s `onError`. */
export enum TimestampIssueKind {
	/** The value is not a real instant or calendar date. */
	InvalidValue = 'INVALID_VALUE',
	/** The locale is not a well-formed BCP 47 tag. */
	InvalidLocale = 'INVALID_LOCALE',
	/** The time zone is not a supported IANA zone. */
	InvalidTimeZone = 'INVALID_TIME_ZONE',
	/** The clipboard refused the write or is unavailable. */
	CopyFailed = 'COPY_FAILED',
}

/**
 * A `Date`; a number of **epoch milliseconds** (not Unix seconds: multiply seconds by 1000);
 * an ISO 8601 / RFC 3339 instant with an offset; or a `YYYY-MM-DD` calendar date.
 */
export type TimestampValue = Date | number | string

/** Where and how the viewer reads time. */
export interface TimestampLocaleOptions {
	/** BCP 47 tag, e.g. `en-US`. An invalid tag throws `RangeError`. */
	locale: string
	/** IANA zone, e.g. `America/Denver`. An invalid zone throws `RangeError`. */
	timeZone: string
	/** `true` forces the locale's 12-hour clock, `false` forces 24-hour. @default the locale's convention */
	hour12?: boolean
}

/** Locale options plus the injected clock. */
export interface TimestampFormatOptions extends TimestampLocaleOptions {
	/** The current instant. Required by live formats. */
	now?: Date | number
}

/** A validated timestamp. */
export interface ParsedTimestamp {
	/** Whether the value is an instant or a calendar date. */
	kind: TimestampKind
	/** UTC epoch ms. For a date-only value, UTC midnight of that date. */
	epochMs: number
	/** Value for `<time dateTime>`: `2026-10-01T21:04:09.000Z` or `2026-10-01`. */
	dateTime: string
}

/** ECMAScript's time range; beyond it `toISOString` throws. */
const MAX_EPOCH_MS = 8.64e15
/** A future instant up to 60 s ahead counts as "now" (clock skew, optimistic writes). */
const FUTURE_SKEW_TOLERANCE_MS = MINUTE_MS
/** Up to ±6 calendar days, use day names. */
const NAMED_DAY_WINDOW_DAYS = 6
/** `formatTimestampRelative` uses weeks below this many days, months from it. */
const WEEK_BAND_LIMIT_DAYS = 30
/** Within ±182 calendar days, drop the year (six months, so "Dec 30" read in January is never ambiguous). */
const YEAR_OMIT_WINDOW_DAYS = 182
/** 9:30 AM UTC, used to detect whether the locale pads hours. */
const HOUR_PROBE_EPOCH_MS = Date.UTC(2026, 0, 15, 9, 30)
const DAYS_PER_WEEK = 7
const MONTHS_PER_YEAR = 12
const MINUTES_PER_HOUR = 60
const MAX_MONTH = 12
const MAX_HOUR = 23
const MAX_MINUTE = 59
const MAX_SECOND = 59
const MILLISECOND_DIGITS = 3
const PADDED_HOUR_LENGTH = 2
const OFFSET_HOUR_DIGITS = 2
const UTC_ZONE = 'UTC'
/** Locale for machine-read parts (year, month, day, offset): fixed so digits are always Latin. */
const PARTS_LOCALE = 'en-US'

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const INSTANT_PATTERN =
	/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?\s?(Z|[+-]\d{2}(?::?\d{2})?)$/i
const LONG_OFFSET_PATTERN = /^GMT(?:([+-])(\d{1,2})(?::(\d{2}))?)?$/
const SPACE_VARIANTS = /[    ]/g
const DASH_VARIANTS = /[−–]/g

/** Named Intl.DateTimeFormat option sets; each is cached per locale, zone and clock. */
enum DateTimePreset {
	Time = 'TIME',
	Weekday = 'WEEKDAY',
	MonthDay = 'MONTH_DAY',
	MonthDayYear = 'MONTH_DAY_YEAR',
	Absolute = 'ABSOLUTE',
	Date = 'DATE',
	Full = 'FULL',
	FullDate = 'FULL_DATE',
	Copy = 'COPY',
	Glue = 'GLUE',
	GlueDate = 'GLUE_DATE',
	ShortOffset = 'SHORT_OFFSET',
	LongOffset = 'LONG_OFFSET',
	ZonedParts = 'ZONED_PARTS',
}

/** Which hour cycle a formatter uses; doubles as the cache token. */
enum HourClock {
	Locale = 'LOCALE',
	H12 = 'H12',
	H23 = 'H23',
}

/** The hour field is filled in per locale by {@link getHourStyle}, so it is a placeholder here. */
const PRESET_OPTIONS: Record<DateTimePreset, Intl.DateTimeFormatOptions> = {
	[DateTimePreset.Time]: { hour: 'numeric', minute: '2-digit' },
	[DateTimePreset.Weekday]: { weekday: 'long' },
	[DateTimePreset.MonthDay]: { month: 'short', day: 'numeric' },
	[DateTimePreset.MonthDayYear]: { year: 'numeric', month: 'short', day: 'numeric' },
	[DateTimePreset.Absolute]: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' },
	[DateTimePreset.Date]: { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
	[DateTimePreset.Full]: {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short',
	},
	[DateTimePreset.FullDate]: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
	[DateTimePreset.Copy]: {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		timeZoneName: 'short',
	},
	[DateTimePreset.Glue]: { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' },
	[DateTimePreset.GlueDate]: { year: 'numeric', month: 'long', day: 'numeric' },
	[DateTimePreset.ShortOffset]: { timeZoneName: 'shortOffset' },
	[DateTimePreset.LongOffset]: { timeZoneName: 'longOffset' },
	[DateTimePreset.ZonedParts]: {
		calendar: 'gregory',
		numberingSystem: 'latn',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	},
}

const LIVE_FORMATS: ReadonlySet<string> = new Set<string>([
	TimestampFormat.Compact,
	TimestampFormat.Relative,
	TimestampFormat.Contextual,
])

const dateTimeFormatCache = new Map<string, Intl.DateTimeFormat>()
const relativeTimeFormatCache = new Map<string, Intl.RelativeTimeFormat>()
const unitFormatCache = new Map<string, Intl.NumberFormat>()
const hourStyleCache = new Map<string, 'numeric' | '2-digit'>()
const glueCache = new Map<string, DateTimeGlue>()
const timeZoneSupportCache = new Map<string, boolean>()

interface DateTimeGlue {
	/** True when the locale writes the date before the time. */
	dateFirst: boolean
	/** The locale's own joiner, e.g. " at ", " um ", " a las ". */
	joiner: string
}

interface ZonedDate {
	year: number
	month: number
	day: number
}

/** Everything a formatter needs once the value is parsed. */
interface FormatContext extends TimestampLocaleOptions {
	parsed: ParsedTimestamp
	/** The current instant in epoch ms, when the format needs it. */
	now: number
}

/** Unit a Compact label uses in its minute and hour bands. */
export enum CompactUnit {
	Minute = 'minute',
	Hour = 'hour',
}

/** Replaces engine-specific spaces and dashes so text is identical to type and safe to paste into an SMS. */
function normalizeSpacing(text: string): string {
	return text.replace(SPACE_VARIANTS, ' ').replace(DASH_VARIANTS, '-')
}

function getHourClock(hour12: boolean | undefined): HourClock {
	if (hour12 === undefined) return HourClock.Locale
	return hour12 ? HourClock.H12 : HourClock.H23
}

/**
 * `hour12: true` lets the locale pick h11 or h12 (ja-JP `午前0:00`, en-US `12:00 AM`); 24-hour uses
 * `hourCycle: 'h23'`, never `hour12: false`, which some engines resolve to h24 (`24:00`).
 */
function getClockOptions(clock: HourClock): Intl.DateTimeFormatOptions {
	if (clock === HourClock.H12) return { hour12: true }
	if (clock === HourClock.H23) return { hourCycle: 'h23' }
	return {}
}

/** `'2-digit'` when the locale's own short time pads the hour (`09:30`), so labels, tooltip and copy agree. */
function getHourStyle(locale: string, clock: HourClock): 'numeric' | '2-digit' {
	const key = `${locale}|${clock}`
	const cached = hourStyleCache.get(key)
	if (cached) return cached
	const probe = new Intl.DateTimeFormat(locale, { timeZone: UTC_ZONE, timeStyle: 'short', ...getClockOptions(clock) })
	const hour = probe.formatToParts(HOUR_PROBE_EPOCH_MS).find(part => part.type === 'hour')?.value ?? ''
	const style = hour.length === PADDED_HOUR_LENGTH ? '2-digit' : 'numeric'
	hourStyleCache.set(key, style)
	return style
}

function getDateTimeFormat(
	locale: string,
	timeZone: string,
	preset: DateTimePreset,
	hour12?: boolean
): Intl.DateTimeFormat {
	const base = PRESET_OPTIONS[preset]
	const hasHour = base.hour !== undefined
	const clock = hasHour ? getHourClock(hour12) : HourClock.Locale
	const key = `${locale}|${timeZone}|${preset}|${clock}`
	const cached = dateTimeFormatCache.get(key)
	if (cached) return cached
	const options: Intl.DateTimeFormatOptions = hasHour
		? { ...base, hour: getHourStyle(locale, clock), ...getClockOptions(clock), timeZone }
		: { ...base, timeZone }
	const format = new Intl.DateTimeFormat(locale, options)
	dateTimeFormatCache.set(key, format)
	return format
}

function getRelativeTimeFormat(locale: string, numeric: 'auto' | 'always'): Intl.RelativeTimeFormat {
	const style = 'long'
	const key = `${locale}|${style}|${numeric}`
	const cached = relativeTimeFormatCache.get(key)
	if (cached) return cached
	const format = new Intl.RelativeTimeFormat(locale, { numeric, style })
	relativeTimeFormatCache.set(key, format)
	return format
}

function getUnitFormat(locale: string, unit: CompactUnit): Intl.NumberFormat {
	const key = `${locale}|${unit}`
	const cached = unitFormatCache.get(key)
	if (cached) return cached
	const format = new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'narrow' })
	unitFormatCache.set(key, format)
	return format
}

/**
 * Builds UTC epoch ms from calendar fields, or null when any field is out of range or the day does
 * not exist in that month. Uses `setUTCFullYear`, so years 0–99 are not read as 1900–1999.
 */
function getUtcEpochMs(
	year: number,
	month: number,
	day: number,
	hour: number,
	minute: number,
	second: number,
	millisecond: number
): number | null {
	if (month < 1 || month > MAX_MONTH || hour > MAX_HOUR || minute > MAX_MINUTE || second > MAX_SECOND) return null
	const date = new Date(0)
	date.setUTCFullYear(year, month - 1, day)
	date.setUTCHours(hour, minute, second, millisecond)
	if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
	return date.getTime()
}

function createInstant(epochMs: number): ParsedTimestamp | null {
	if (!Number.isFinite(epochMs) || Math.abs(epochMs) > MAX_EPOCH_MS) return null
	return { kind: TimestampKind.Instant, epochMs, dateTime: new Date(epochMs).toISOString() }
}

function parseDateOnly(value: string): ParsedTimestamp | null {
	const match = DATE_ONLY_PATTERN.exec(value)
	if (!match) return null
	const epochMs = getUtcEpochMs(Number(match[1]), Number(match[2]), Number(match[3]), 0, 0, 0, 0)
	if (epochMs === null) return null
	return { kind: TimestampKind.DateOnly, epochMs, dateTime: value }
}

function getOffsetMinutes(offset: string): number | null {
	if (offset.toUpperCase() === 'Z') return 0
	const sign = offset.startsWith('-') ? -1 : 1
	const digits = offset.slice(1).replace(':', '')
	const hours = Number(digits.slice(0, OFFSET_HOUR_DIGITS))
	const minutes = Number(digits.slice(OFFSET_HOUR_DIGITS) || '0')
	if (hours > MAX_HOUR || minutes > MAX_MINUTE) return null
	return sign * (hours * MINUTES_PER_HOUR + minutes)
}

function parseInstantString(value: string): ParsedTimestamp | null {
	const match = INSTANT_PATTERN.exec(value)
	if (!match) return null
	const fraction = match[7] ?? ''
	const millisecond = Number(fraction.slice(0, MILLISECOND_DIGITS).padEnd(MILLISECOND_DIGITS, '0'))
	const wallClockMs = getUtcEpochMs(
		Number(match[1]),
		Number(match[2]),
		Number(match[3]),
		Number(match[4]),
		Number(match[5]),
		Number(match[6] ?? '0'),
		millisecond
	)
	const offsetMinutes = getOffsetMinutes(match[8])
	if (wallClockMs === null || offsetMinutes === null) return null
	return createInstant(wallClockMs - offsetMinutes * MINUTE_MS)
}

/**
 * Validates a value. Returns null for anything that is not a real instant or calendar date.
 *
 * Strings are read with a fixed grammar, never `Date.parse`, so every engine agrees: an instant needs
 * an explicit offset (`Z`, `±hh`, `±hhmm`, `±hh:mm`) and may use a space separator and up to nine
 * fractional digits, so Postgres `timestamptz` text parses.
 *
 * @param value - A `Date`, epoch milliseconds, an ISO 8601 instant with an offset, or `YYYY-MM-DD`.
 * @returns The parsed timestamp, or null when the value is invalid.
 * @example
 * parseTimestamp('2026-10-01 21:04:09.123456+00')?.dateTime // '2026-10-01T21:04:09.123Z'
 * parseTimestamp('2026-10-01T15:00') // null: no offset, so it names no instant
 */
export function parseTimestamp(value: TimestampValue): ParsedTimestamp | null {
	if (typeof value === 'number') return createInstant(value)
	if (typeof value === 'string') return parseDateOnly(value) ?? parseInstantString(value)
	if (typeof value === 'object' && value !== null && typeof value.getTime === 'function') {
		return createInstant(value.getTime())
	}
	return null
}

function getZonedDate(epochMs: number, timeZone: string): ZonedDate {
	const zoned: ZonedDate = { year: 0, month: 0, day: 0 }
	for (const part of getDateTimeFormat(PARTS_LOCALE, timeZone, DateTimePreset.ZonedParts).formatToParts(epochMs)) {
		if (part.type === 'year') zoned.year = Number(part.value)
		if (part.type === 'month') zoned.month = Number(part.value)
		if (part.type === 'day') zoned.day = Number(part.value)
	}
	return zoned
}

function getEpochDay(zoned: ZonedDate): number {
	return Date.UTC(zoned.year, zoned.month - 1, zoned.day) / DAY_MS
}

/** The zone a value's labels are drawn in: the viewer's, or UTC for a calendar date. */
function getLabelZone(context: FormatContext): string {
	return context.parsed.kind === TimestampKind.DateOnly ? UTC_ZONE : context.timeZone
}

/** Calendar days from today to the value, both in the viewer's zone (never elapsed hours, never UTC). */
function getDayDiff(context: FormatContext): number {
	const { parsed, timeZone, now } = context
	const target = parsed.kind === TimestampKind.DateOnly ? parsed.epochMs / DAY_MS : getEpochDay(getZonedDate(parsed.epochMs, timeZone))
	return target - getEpochDay(getZonedDate(now, timeZone))
}

function formatShortDate(context: FormatContext, dayDiff: number): string {
	const preset = Math.abs(dayDiff) <= YEAR_OMIT_WINDOW_DAYS ? DateTimePreset.MonthDay : DateTimePreset.MonthDayYear
	return getDateTimeFormat(context.locale, getLabelZone(context), preset).format(context.parsed.epochMs)
}

function formatTimeOfDay(context: FormatContext): string {
	return getDateTimeFormat(context.locale, context.timeZone, DateTimePreset.Time, context.hour12).format(
		context.parsed.epochMs
	)
}

function formatDateLabel(context: FormatContext): string {
	return getDateTimeFormat(context.locale, getLabelZone(context), DateTimePreset.Date).format(context.parsed.epochMs)
}

function capitalize(text: string, locale: string): string {
	return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1)
}

/** `today` / `yesterday` / `tomorrow`, the weekday within ±6 days, otherwise the date. */
function formatDayLabel(context: FormatContext, dayDiff: number): string {
	if (Math.abs(dayDiff) <= 1) return getRelativeTimeFormat(context.locale, 'auto').format(dayDiff, 'day')
	if (Math.abs(dayDiff) <= NAMED_DAY_WINDOW_DAYS) {
		return getDateTimeFormat(context.locale, getLabelZone(context), DateTimePreset.Weekday).format(context.parsed.epochMs)
	}
	return formatShortDate(context, dayDiff)
}

/** The locale's own date-time joiner, found by removing the date-only and time-only strings from a combined one. */
function getGlue(locale: string): DateTimeGlue {
	const cached = glueCache.get(locale)
	if (cached) return cached
	const full = normalizeSpacing(getDateTimeFormat(locale, UTC_ZONE, DateTimePreset.Glue).format(0))
	const date = normalizeSpacing(getDateTimeFormat(locale, UTC_ZONE, DateTimePreset.GlueDate).format(0))
	const time = normalizeSpacing(getDateTimeFormat(locale, UTC_ZONE, DateTimePreset.Time).format(0))
	let glue: DateTimeGlue = { dateFirst: true, joiner: ' ' }
	if (full.startsWith(date) && full.endsWith(time)) {
		glue = { dateFirst: true, joiner: full.slice(date.length, full.length - time.length) }
	} else if (full.startsWith(time) && full.endsWith(date)) {
		glue = { dateFirst: false, joiner: full.slice(time.length, full.length - date.length) }
	}
	glueCache.set(locale, glue)
	return glue
}

function formatContextual(context: FormatContext, dayDiff: number): string {
	const day = formatDayLabel(context, dayDiff)
	const time = formatTimeOfDay(context)
	const glue = getGlue(context.locale)
	return glue.dateFirst ? capitalize(day, context.locale) + glue.joiner + time : time + glue.joiner + day
}

function isInNowBand(delta: number): boolean {
	return delta >= -FUTURE_SKEW_TOLERANCE_MS && delta < MINUTE_MS
}

function formatNow(locale: string): string {
	return getRelativeTimeFormat(locale, 'auto').format(0, 'second')
}

/** The minute or hour unit when an elapsed gap reads as minutes or hours, otherwise null. */
function getElapsedUnit(absDelta: number, dayDiff: number): CompactUnit | null {
	if (absDelta < HOUR_MS) return CompactUnit.Minute
	if (absDelta < DAY_MS || dayDiff === 0) return CompactUnit.Hour
	return null
}

function getUnitCount(absDelta: number, unit: CompactUnit): number {
	return Math.trunc(absDelta / (unit === CompactUnit.Minute ? MINUTE_MS : HOUR_MS))
}

/**
 * The unit a Compact label shows (`5m`, `3h`), or null when it shows `now`, a time or a date.
 * Internal: the component uses it to add a spoken suffix ("5m, 5 minutes ago").
 */
export function getCompactUnit(parsed: ParsedTimestamp, options: TimestampLocaleOptions & { now: number }): CompactUnit | null {
	if (parsed.kind === TimestampKind.DateOnly) return null
	const context: FormatContext = { ...options, parsed }
	const delta = context.now - parsed.epochMs
	if (isInNowBand(delta) || delta < 0) return null
	return getElapsedUnit(delta, getDayDiff(context))
}

function formatCompactInstant(context: FormatContext, dayDiff: number): string {
	const delta = context.now - context.parsed.epochMs
	if (isInNowBand(delta)) return formatNow(context.locale)
	if (delta < 0) return dayDiff === 0 ? formatTimeOfDay(context) : formatShortDate(context, dayDiff)
	const unit = getElapsedUnit(delta, dayDiff)
	if (!unit) return formatShortDate(context, dayDiff)
	return getUnitFormat(context.locale, unit).format(getUnitCount(delta, unit))
}

/** Shared by the Relative label and the tooltip's relative line: `now`, then minutes, then hours. */
function formatElapsedPhrase(context: FormatContext, dayDiff: number): string | null {
	const delta = context.now - context.parsed.epochMs
	if (isInNowBand(delta)) return formatNow(context.locale)
	const absDelta = Math.abs(delta)
	const unit = getElapsedUnit(absDelta, dayDiff)
	if (!unit) return null
	const sign = delta > 0 ? -1 : 1
	return getRelativeTimeFormat(context.locale, 'auto').format(sign * getUnitCount(absDelta, unit), unit)
}

function formatRelativeLabel(context: FormatContext, dayDiff: number): string {
	if (context.parsed.kind === TimestampKind.Instant) {
		const elapsed = formatElapsedPhrase(context, dayDiff)
		if (elapsed !== null) return elapsed
	}
	if (Math.abs(dayDiff) <= NAMED_DAY_WINDOW_DAYS) return getRelativeTimeFormat(context.locale, 'auto').format(dayDiff, 'day')
	return formatShortDate(context, dayDiff)
}

function formatCompactDateOnly(context: FormatContext, dayDiff: number): string {
	if (Math.abs(dayDiff) <= NAMED_DAY_WINDOW_DAYS) return capitalize(formatDayLabel(context, dayDiff), context.locale)
	return formatShortDate(context, dayDiff)
}

/** Calendar months between now and the value, counted in the viewer's zone, never zero. */
function getCalendarMonths(context: FormatContext, dayDiff: number): number {
	const target = getZonedDate(context.parsed.epochMs, getLabelZone(context))
	const today = getZonedDate(context.now, context.timeZone)
	let months = (target.year - today.year) * MONTHS_PER_YEAR + (target.month - today.month)
	if (months > 0 && target.day < today.day) months -= 1
	if (months < 0 && target.day > today.day) months += 1
	return months === 0 ? Math.sign(dayDiff) : months
}

function formatUnboundedRelative(context: FormatContext): string {
	const dayDiff = getDayDiff(context)
	if (context.parsed.kind === TimestampKind.Instant) {
		const elapsed = formatElapsedPhrase(context, dayDiff)
		if (elapsed !== null) return elapsed
	}
	const absDays = Math.abs(dayDiff)
	if (absDays <= NAMED_DAY_WINDOW_DAYS) return getRelativeTimeFormat(context.locale, 'auto').format(dayDiff, 'day')
	const always = getRelativeTimeFormat(context.locale, 'always')
	if (absDays < WEEK_BAND_LIMIT_DAYS) return always.format(Math.sign(dayDiff) * Math.trunc(absDays / DAYS_PER_WEEK), 'week')
	const months = getCalendarMonths(context, dayDiff)
	if (Math.abs(months) < MONTHS_PER_YEAR) return always.format(months, 'month')
	return always.format(Math.trunc(months / MONTHS_PER_YEAR), 'year')
}

function getTimeZoneNamePart(format: Intl.DateTimeFormat, epochMs: number): string {
	return format.formatToParts(epochMs).find(part => part.type === 'timeZoneName')?.value ?? ''
}

/** ASCII offset from the zone's long offset: `UTC-6`, `UTC+5:30`, `UTC+13:45`, `UTC+0`. */
function getOffsetLabel(epochMs: number, timeZone: string): string {
	const longOffset = normalizeSpacing(
		getTimeZoneNamePart(getDateTimeFormat(PARTS_LOCALE, timeZone, DateTimePreset.LongOffset), epochMs)
	)
	const match = LONG_OFFSET_PATTERN.exec(longOffset)
	if (!match || !match[1]) return `${UTC_ZONE}+0`
	const minutes = match[3] && match[3] !== '00' ? `:${match[3]}` : ''
	return `${UTC_ZONE}${match[1]}${Number(match[2])}${minutes}`
}

/**
 * The zone label shared by tooltip and copy: the locale's real name (`MDT`, `MESZ`, `JST`), or an
 * ASCII offset when the locale only has a GMT-offset form for this zone.
 */
function formatZoneLabel(zoneName: string, context: FormatContext, appendOffset: boolean): string {
	const name = normalizeSpacing(zoneName)
	if (name === UTC_ZONE) return UTC_ZONE
	const { parsed, locale, timeZone } = context
	const offsetName = normalizeSpacing(
		getTimeZoneNamePart(getDateTimeFormat(locale, timeZone, DateTimePreset.ShortOffset), parsed.epochMs)
	)
	const offset = getOffsetLabel(parsed.epochMs, timeZone)
	if (offsetName === name) return offset
	return appendOffset ? `${name} (${offset})` : name
}

function formatWithZoneLabel(context: FormatContext, preset: DateTimePreset, appendOffset: boolean): string {
	return getDateTimeFormat(context.locale, context.timeZone, preset, context.hour12)
		.formatToParts(context.parsed.epochMs)
		.map(part => (part.type === 'timeZoneName' ? formatZoneLabel(part.value, context, appendOffset) : part.value))
		.join('')
}

function toEpochMs(now: Date | number): number {
	return typeof now === 'number' ? now : now.getTime()
}

/**
 * Whether a format's label depends on the current instant. Internal: the component uses it to pick
 * the static or the client path.
 */
export function isLiveTimestampFormat(format: TimestampFormat | `${TimestampFormat}`): boolean {
	return LIVE_FORMATS.has(format)
}

/**
 * Formats an already-parsed value. Internal: the component parses once and formats on every tick.
 */
export function formatParsedTimestamp(
	parsed: ParsedTimestamp,
	format: TimestampFormat | `${TimestampFormat}`,
	options: TimestampFormatOptions
): string {
	const live = isLiveTimestampFormat(format)
	if (live && options.now === undefined) throw new TypeError(`now is required for ${format}`)
	const context: FormatContext = { ...options, parsed, now: options.now === undefined ? 0 : toEpochMs(options.now) }
	if (parsed.kind === TimestampKind.DateOnly && !live) return normalizeSpacing(formatDateLabel(context))
	switch (format) {
		case TimestampFormat.Time:
			return normalizeSpacing(formatTimeOfDay(context))
		case TimestampFormat.Date:
			return normalizeSpacing(formatDateLabel(context))
		case TimestampFormat.Absolute:
			return normalizeSpacing(
				getDateTimeFormat(context.locale, context.timeZone, DateTimePreset.Absolute, context.hour12).format(parsed.epochMs)
			)
		case TimestampFormat.Compact: {
			const dayDiff = getDayDiff(context)
			if (parsed.kind === TimestampKind.DateOnly) return normalizeSpacing(formatCompactDateOnly(context, dayDiff))
			return normalizeSpacing(formatCompactInstant(context, dayDiff))
		}
		case TimestampFormat.Contextual: {
			const dayDiff = getDayDiff(context)
			if (parsed.kind === TimestampKind.DateOnly) return normalizeSpacing(formatCompactDateOnly(context, dayDiff))
			return normalizeSpacing(formatContextual(context, dayDiff))
		}
		case TimestampFormat.Relative:
			return normalizeSpacing(formatRelativeLabel(context, getDayDiff(context)))
		default:
			throw new RangeError(`Unknown timestamp format: ${String(format)}`)
	}
}

/** Unbounded relative phrase for an already-parsed value. Internal; see {@link formatTimestampRelative}. */
export function formatParsedRelative(parsed: ParsedTimestamp, options: TimestampLocaleOptions & { now: Date | number }): string {
	return normalizeSpacing(formatUnboundedRelative({ ...options, parsed, now: toEpochMs(options.now) }))
}

/** Full tooltip line for an already-parsed value. Internal; see {@link formatTimestampFull}. */
export function formatParsedFull(parsed: ParsedTimestamp, options: TimestampLocaleOptions): string {
	if (parsed.kind === TimestampKind.DateOnly) {
		return normalizeSpacing(getDateTimeFormat(options.locale, UTC_ZONE, DateTimePreset.FullDate).format(parsed.epochMs))
	}
	return normalizeSpacing(formatWithZoneLabel({ ...options, parsed, now: parsed.epochMs }, DateTimePreset.Full, false))
}

/** Clipboard text for an already-parsed value. Internal; see {@link formatTimestampCopy}. */
export function formatParsedCopy(parsed: ParsedTimestamp, options: TimestampLocaleOptions): string {
	if (parsed.kind === TimestampKind.DateOnly) {
		return normalizeSpacing(getDateTimeFormat(options.locale, UTC_ZONE, DateTimePreset.Date).format(parsed.epochMs))
	}
	return normalizeSpacing(formatWithZoneLabel({ ...options, parsed, now: parsed.epochMs }, DateTimePreset.Copy, true))
}

/**
 * The visible label. Calendar decisions (today, yesterday, weekday names, whether to show the year)
 * use calendar days in the viewer's zone. A date-only value never shows a time or zone.
 *
 * @param value - The instant or calendar date. See {@link TimestampValue}.
 * @param format - Which label to produce. Live formats (Compact, Relative, Contextual) require `now`.
 * @param options - Locale, IANA zone, optional 12/24-hour override, and `now` for live formats.
 * @returns The label with plain spaces, or null when the value is invalid.
 * @throws RangeError when the locale or time zone is invalid.
 * @throws TypeError when a live format is called without `now`.
 * @example
 * const now = Date.parse('2026-10-01T21:04:09Z')
 * const viewer = { locale: 'en-US', timeZone: 'America/Denver', now }
 * formatTimestamp(now - 5 * 60_000, TimestampFormat.Compact, viewer) // '5m'
 * formatTimestamp(now - 30 * 3_600_000, TimestampFormat.Relative, viewer) // 'yesterday'
 * formatTimestamp(now - 2 * 86_400_000, TimestampFormat.Contextual, viewer) // 'Tuesday at 3:04 PM'
 * formatTimestamp(now, TimestampFormat.Absolute, { locale: 'en-US', timeZone: 'America/Denver' }) // 'Oct 1, 2026, 3:04 PM'
 */
export function formatTimestamp(
	value: TimestampValue,
	format: LiveTimestampFormat,
	options: TimestampLocaleOptions & { now: Date | number }
): string | null
export function formatTimestamp(
	value: TimestampValue,
	format: FixedTimestampFormat,
	options: TimestampLocaleOptions
): string | null
export function formatTimestamp<F extends TimestampFormat | `${TimestampFormat}`>(
	value: TimestampValue,
	format: F,
	options: [F] extends [LiveTimestampFormat] ? TimestampLocaleOptions & { now: Date | number } : TimestampFormatOptions
): string | null
export function formatTimestamp(
	value: TimestampValue,
	format: TimestampFormat | `${TimestampFormat}`,
	options: TimestampFormatOptions
): string | null {
	if (isLiveTimestampFormat(format) && options.now === undefined) throw new TypeError(`now is required for ${format}`)
	const parsed = parseTimestamp(value)
	if (!parsed) return null
	return formatParsedTimestamp(parsed, format, options)
}

/**
 * An unbounded relative phrase (`3 weeks ago`, `in 8 months`) for the tooltip's second line.
 * Days use `yesterday` and `tomorrow`; weeks, months and years always use numbers (`1 week ago`).
 *
 * @param value - The instant or calendar date.
 * @param options - Locale, IANA zone and `now`.
 * @returns The phrase with plain spaces, or null when the value is invalid.
 * @throws RangeError when the locale or time zone is invalid.
 * @example
 * const now = Date.parse('2026-10-01T21:04:09Z')
 * formatTimestampRelative(now - 8 * 86_400_000, { locale: 'en-US', timeZone: 'America/Denver', now }) // '1 week ago'
 * formatTimestampRelative('2027-06-01', { locale: 'en-US', timeZone: 'America/Denver', now }) // 'in 8 months'
 */
export function formatTimestampRelative(
	value: TimestampValue,
	options: TimestampLocaleOptions & { now: Date | number }
): string | null {
	const parsed = parseTimestamp(value)
	if (!parsed) return null
	return formatParsedRelative(parsed, options)
}

/**
 * Tooltip line 1: full local date, time with seconds, and zone. The zone is the locale's real name
 * (`MDT`, `MESZ`) or, when it has none, an ASCII offset (`UTC+2`). A date-only value shows the date only.
 *
 * @param value - The instant or calendar date.
 * @param options - Locale, IANA zone and optional 12/24-hour override.
 * @returns The full line with plain spaces, or null when the value is invalid.
 * @throws RangeError when the locale or time zone is invalid.
 * @example
 * formatTimestampFull('2026-10-01T21:04:09Z', { locale: 'en-US', timeZone: 'America/Denver' })
 * // 'Thursday, October 1, 2026 at 3:04:09 PM MDT'
 */
export function formatTimestampFull(value: TimestampValue, options: TimestampLocaleOptions): string | null {
	const parsed = parseTimestamp(value)
	if (!parsed) return null
	return formatParsedFull(parsed, options)
}

/**
 * Clipboard text: explicit and self-contained. Weekday, date with year, minute-precision time, the
 * zone name when the locale has one, and the numeric UTC offset, with plain spaces. A date-only value
 * copies the date only.
 *
 * @param value - The instant or calendar date.
 * @param options - The copier's locale, IANA zone and optional 12/24-hour override.
 * @returns The copy text, or null when the value is invalid.
 * @throws RangeError when the locale or time zone is invalid.
 * @example
 * formatTimestampCopy('2026-10-01T21:04:09Z', { locale: 'en-US', timeZone: 'America/Denver' })
 * // 'Thu, Oct 1, 2026, 3:04 PM MDT (UTC-6)'
 */
export function formatTimestampCopy(value: TimestampValue, options: TimestampLocaleOptions): string | null {
	const parsed = parseTimestamp(value)
	if (!parsed) return null
	return formatParsedCopy(parsed, options)
}

/**
 * Checks a stored user preference by constructing a formatter; never compares zone IDs as strings,
 * so aliases such as `Asia/Calcutta` pass. Results are cached.
 *
 * @param timeZone - An IANA zone name.
 * @returns True when this runtime can format in that zone.
 * @example
 * isSupportedTimeZone('America/Denver') // true
 * isSupportedTimeZone('Mars/Olympus') // false
 */
export function isSupportedTimeZone(timeZone: string): boolean {
	const cached = timeZoneSupportCache.get(timeZone)
	if (cached !== undefined) return cached
	let supported = true
	try {
		new Intl.DateTimeFormat(PARTS_LOCALE, { timeZone })
	} catch (error) {
		if (!(error instanceof RangeError)) throw error
		supported = false
	}
	timeZoneSupportCache.set(timeZone, supported)
	return supported
}

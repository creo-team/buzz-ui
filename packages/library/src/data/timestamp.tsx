"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { announcePolite } from '../internal/announcer.js'
import { getClockSnapshot, subscribeClock } from '../internal/clock-store.js'
import { CopyFallback } from '../internal/copy-fallback.js'
import type { Side } from '../internal/use-position.js'
import { CopyStatus, useCopyToClipboard } from '../hooks/use-copy-to-clipboard.js'
import { formatHotkey } from '../hooks/use-hotkey.js'
import { Tooltip, TooltipDirection } from '../overlays/tooltip.js'
import {
	TimestampFormat,
	TimestampIssueKind,
	TimestampKind,
	formatParsedCopy,
	formatParsedFull,
	formatParsedRelative,
	formatParsedTimestamp,
	getCompactUnit,
	isLiveTimestampFormat,
	isSupportedTimeZone,
	parseTimestamp,
	type ParsedTimestamp,
	type TimestampValue,
} from '../utils/format-timestamp.js'

/** Strings the component shows. Override through TimestampProvider to localize. All values are plain strings, so a Server Component can pass them. */
export interface TimestampMessages {
	/** @default 'Click to copy' */
	clickToCopy: string
	/** @default 'Press Enter to copy' */
	enterToCopy: string
	/** @default 'Tap again to copy' */
	tapToCopy: string
	/** Appended to the accessible description. @default 'Copies the date and time.' */
	copyDescription: string
	/** Shown and announced after a successful copy. @default 'Copied' */
	copied: string
	/** Shown and announced when the clipboard refuses, on keyboard or mouse. `{shortcut}` becomes formatHotkey('mod+c'). @default "Couldn't copy. Press {shortcut} to copy the selected text." */
	copyFailed: string
	/** Same, after a touch. @default "Couldn't copy. Press and hold the text to copy it." */
	copyFailedTouch: string
	/** Visible text for an invalid value. @default '—' */
	invalid: string
}

/** A problem reported through TimestampProvider's onError. */
export interface TimestampIssue {
	/** What went wrong. */
	kind: TimestampIssueKind
	/** The offending locale, zone or value as a string, truncated to 64 characters. */
	input?: string
	/** The underlying error, for COPY_FAILED and invalid configuration. */
	error?: unknown
}

/** Props for {@link Timestamp}. */
export interface TimestampProps {
	/** Extra classes on the root span. */
	className?: string
	/** Whether clicking copies. Set false inside an `<a>` or a stretched-link card: renders a non-focusable span with a hover tooltip and no copy. In a row with its own onClick, keep the default; the click stops at the timestamp. @default true */
	copyable?: boolean
	/** Side the tooltip prefers. @default TooltipDirection.Top */
	direction?: TooltipDirection | Side
	/** How the visible label reads. @default TimestampFormat.Relative */
	format?: TimestampFormat | `${TimestampFormat}`
	/** Force a 12-hour (true) or 24-hour (false) clock. @default the nearest TimestampProvider, else the locale's convention */
	hour12?: boolean
	/** Id on the root span. */
	id?: string
	/** BCP 47 locale. Invalid values fall back and are reported. @default the nearest TimestampProvider, else the browser locale */
	locale?: string
	/** Called with the copied text after a successful copy. A function, so it cannot be passed from a Server Component. */
	onCopied?: (text: string) => void
	/** Ref to the root span, which exists in every state. */
	ref?: React.Ref<HTMLSpanElement>
	/** IANA time zone. Invalid values fall back and are reported. @default the nearest TimestampProvider, else the viewer's zone */
	timeZone?: string
	/** The moment or calendar date to show. See TimestampValue. */
	value: TimestampValue
	/** `data-*` attributes land on the root span. */
	[dataAttribute: `data-${string}`]: string | undefined
}

/** Props for {@link TimestampProvider}: app-wide defaults, e.g. from the signed-in user's settings. */
export interface TimestampProviderProps {
	/** The subtree whose timestamps use these defaults. */
	children: React.ReactNode
	/** Force a 12-hour (true) or 24-hour (false) clock. @default the locale's convention */
	hour12?: boolean
	/** Validated once; an invalid tag falls back to the browser locale and is reported. @default the browser locale */
	locale?: string
	/** Partial overrides of the English defaults. @default the English messages */
	messages?: Partial<TimestampMessages>
	/** Receives invalid values, invalid configuration and copy failures; wire it to the app's structured logger. A function, so wrap the provider in your own `"use client"` component to pass it. */
	onError?: (issue: TimestampIssue) => void
	/** Validated once with isSupportedTimeZone; an invalid zone falls back to the viewer's zone and is reported. @default the viewer's zone */
	timeZone?: string
}

/** Options for {@link useTimestamp}; each falls back to the nearest TimestampProvider, then the viewer. */
export interface UseTimestampOptions {
	/** How the label reads. @default TimestampFormat.Relative */
	format?: TimestampFormat | `${TimestampFormat}`
	/** Force a 12-hour (true) or 24-hour (false) clock. @default the nearest TimestampProvider, else the locale's convention */
	hour12?: boolean
	/** BCP 47 locale. Invalid values fall back and are reported. @default the nearest TimestampProvider, else the browser locale */
	locale?: string
	/** IANA time zone. Invalid values fall back and are reported. @default the nearest TimestampProvider, else the viewer's zone */
	timeZone?: string
}

/** What {@link useTimestamp} returns for a valid value: pending until the client knows the clock, then every string the component shows. */
export type TimestampState =
	| {
			/** True on the server and during hydration for live formats or an unknown zone. */
			pending: true
			/** Value for `<time dateTime>`. */
			dateTime: string
	  }
	| {
			pending: false
			/** Value for `<time dateTime>`. */
			dateTime: string
			/** The visible label. */
			label: string
			/** Full local date, time with seconds, and zone. */
			full: string
			/** The explicit text a click copies. */
			copy: string
			/** Instant or calendar date. */
			kind: TimestampKind
	  }

const DEFAULT_MESSAGES: TimestampMessages = {
	clickToCopy: 'Click to copy',
	enterToCopy: 'Press Enter to copy',
	tapToCopy: 'Tap again to copy',
	copyDescription: 'Copies the date and time.',
	copied: 'Copied',
	copyFailed: "Couldn't copy. Press {shortcut} to copy the selected text.",
	copyFailedTouch: "Couldn't copy. Press and hold the text to copy it.",
	invalid: '—',
}

/** Token replaced in `copyFailed`. */
const SHORTCUT_PLACEHOLDER = '{shortcut}'
const COPY_HOTKEY = 'mod+c'
const ISSUE_INPUT_MAX_LENGTH = 64
const TOUCH_POINTER = 'touch'
/** Zone for formatting a calendar date when the viewer's zone is unknown; date-only output always uses UTC. */
const DATE_ONLY_ZONE = 'UTC'

/** How the tooltip was reached, which picks the copy hint. */
enum InputModality {
	Keyboard = 'KEYBOARD',
	Pointer = 'POINTER',
	Touch = 'TOUCH',
}

const FORMAT_DATA: Record<`${TimestampFormat}`, string> = {
	[TimestampFormat.Compact]: 'compact',
	[TimestampFormat.Relative]: 'relative',
	[TimestampFormat.Contextual]: 'contextual',
	[TimestampFormat.Time]: 'time',
	[TimestampFormat.Absolute]: 'absolute',
	[TimestampFormat.Date]: 'date',
}

const COPY_STATUS_DATA: Record<CopyStatus, string> = {
	[CopyStatus.Idle]: 'idle',
	[CopyStatus.Copied]: 'copied',
	[CopyStatus.Failed]: 'failed',
}

interface TimestampContextValue {
	locale?: string
	timeZone?: string
	hour12?: boolean
	messages: TimestampMessages
	onError?: (issue: TimestampIssue) => void
}

const TimestampContext = React.createContext<TimestampContextValue>({ messages: DEFAULT_MESSAGES })

const localeValidity = new Map<string, boolean>()

function isValidLocale(locale: string): boolean {
	const cached = localeValidity.get(locale)
	if (cached !== undefined) return cached
	let valid = true
	try {
		Intl.getCanonicalLocales(locale)
	} catch (error) {
		if (!(error instanceof RangeError)) throw error
		valid = false
	}
	localeValidity.set(locale, valid)
	return valid
}

function getValidLocale(locale: string | undefined): string | undefined {
	return locale !== undefined && isValidLocale(locale) ? locale : undefined
}

function getValidTimeZone(timeZone: string | undefined): string | undefined {
	return timeZone !== undefined && isSupportedTimeZone(timeZone) ? timeZone : undefined
}

function truncateInput(input: string): string {
	return input.slice(0, ISSUE_INPUT_MAX_LENGTH)
}

function describeValue(value: TimestampValue): string {
	if (typeof value === 'string') return value
	if (typeof value === 'number') return String(value)
	return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString()
}

/** Reports an issue once per distinct input, from an effect (never during render), StrictMode-safe. */
function useIssueReport(
	kind: TimestampIssueKind,
	input: string | undefined,
	active: boolean,
	onError: ((issue: TimestampIssue) => void) | undefined
): void {
	const onErrorRef = React.useRef(onError)
	onErrorRef.current = onError
	const reportedRef = React.useRef<string | null>(null)
	React.useEffect(() => {
		if (!active || input === undefined) {
			reportedRef.current = null
			return
		}
		if (reportedRef.current === input) return
		reportedRef.current = input
		onErrorRef.current?.({ kind, input: truncateInput(input) })
	}, [kind, input, active])
}

/**
 * Sets locale, time zone, 12/24-hour clock, messages and an `onError` reporter once for every
 * Timestamp in a subtree. Invalid settings fall back to the viewer's defaults and are reported once,
 * so no stored preference can make a Timestamp throw. Renders from a Server Component with
 * serializable props; to pass `onError`, wrap it in your own `"use client"` provider.
 *
 * @example
 * <TimestampProvider locale={user.locale} timeZone={user.timeZone} hour12={user.hour12}>
 *   <App />
 * </TimestampProvider>
 */
export function TimestampProvider({ children, hour12, locale, messages, onError, timeZone }: TimestampProviderProps) {
	const parent = React.useContext(TimestampContext)
	const validLocale = getValidLocale(locale)
	const validTimeZone = getValidTimeZone(timeZone)
	useIssueReport(TimestampIssueKind.InvalidLocale, locale, locale !== undefined && validLocale === undefined, onError)
	useIssueReport(TimestampIssueKind.InvalidTimeZone, timeZone, timeZone !== undefined && validTimeZone === undefined, onError)

	const value = React.useMemo<TimestampContextValue>(
		() => ({
			locale: validLocale ?? parent.locale,
			timeZone: validTimeZone ?? parent.timeZone,
			hour12: hour12 ?? parent.hour12,
			messages: { ...parent.messages, ...messages },
			onError: onError ?? parent.onError,
		}),
		[validLocale, validTimeZone, hour12, messages, onError, parent]
	)

	return <TimestampContext.Provider value={value}>{children}</TimestampContext.Provider>
}

/** Every string a rendered timestamp needs. */
interface TimestampView {
	label: string
	/** Spoken after a Compact unit label (", 5 minutes ago"), so "5m" is never read as "5 meters". */
	srSuffix: string | null
	full: string
	copy: string
}

interface ViewSettings {
	locale: string
	timeZone: string
	hour12?: boolean
}

function deriveView(
	parsed: ParsedTimestamp,
	format: TimestampFormat | `${TimestampFormat}`,
	settings: ViewSettings,
	now: number
): TimestampView {
	const live = { ...settings, now }
	const label = formatParsedTimestamp(parsed, format, live)
	const unit = format === TimestampFormat.Compact ? getCompactUnit(parsed, live) : null
	return {
		label,
		srSuffix: unit === null ? null : `, ${formatParsedTimestamp(parsed, TimestampFormat.Relative, live)}`,
		full: formatParsedFull(parsed, settings),
		copy: formatParsedCopy(parsed, settings),
	}
}

function isSameView(a: TimestampView, b: TimestampView): boolean {
	return a.label === b.label && a.full === b.full && a.copy === b.copy && a.srSuffix === b.srSuffix
}

function getValueKey(value: TimestampValue): string | number {
	return typeof value === 'object' && value !== null ? value.getTime() : value
}

function subscribeNothing(): () => void {
	return () => undefined
}

interface TimestampEngine {
	parsed: ParsedTimestamp | null
	/** Null while pending (server render and hydration of the client case). */
	view: TimestampView | null
	/** True when the view was computed without the clock, so the server text is already final. */
	isStatic: boolean
	locale?: string
	timeZone?: string
	context: TimestampContextValue
}

/** The engine shared by Timestamp and useTimestamp: settings resolution, static or client path, the shared clock. */
function useTimestampEngine(value: TimestampValue, options: UseTimestampOptions): TimestampEngine {
	const context = React.useContext(TimestampContext)
	const format = options.format ?? TimestampFormat.Relative
	const propLocale = getValidLocale(options.locale)
	const propTimeZone = getValidTimeZone(options.timeZone)
	useIssueReport(
		TimestampIssueKind.InvalidLocale,
		options.locale,
		options.locale !== undefined && propLocale === undefined,
		context.onError
	)
	useIssueReport(
		TimestampIssueKind.InvalidTimeZone,
		options.timeZone,
		options.timeZone !== undefined && propTimeZone === undefined,
		context.onError
	)
	const locale = propLocale ?? context.locale
	const timeZone = propTimeZone ?? context.timeZone
	const hour12 = options.hour12 ?? context.hour12

	const valueKey = getValueKey(value)
	// Keyed by the instant, so a new Date for the same moment does not re-parse.
	const parsed = React.useMemo(() => parseTimestamp(value), [valueKey])
	useIssueReport(
		TimestampIssueKind.InvalidValue,
		parsed === null ? describeValue(value) : undefined,
		parsed === null,
		context.onError
	)

	const live = isLiveTimestampFormat(format)
	const isStatic =
		parsed !== null && !live && locale !== undefined && (parsed.kind === TimestampKind.DateOnly || timeZone !== undefined)

	const staticView = React.useMemo(() => {
		if (!isStatic || parsed === null || locale === undefined) return null
		return deriveView(parsed, format, { locale, timeZone: timeZone ?? DATE_ONLY_ZONE, hour12 }, parsed.epochMs)
	}, [isStatic, parsed, format, locale, timeZone, hour12])

	const viewRef = React.useRef<TimestampView | null>(null)
	const getView = React.useCallback((): TimestampView | null => {
		if (parsed === null) return null
		if (staticView !== null) return staticView
		const snapshot = getClockSnapshot()
		const next = deriveView(
			parsed,
			format,
			{ locale: locale ?? snapshot.locale, timeZone: timeZone ?? snapshot.timeZone, hour12 },
			snapshot.now
		)
		const previous = viewRef.current
		if (previous !== null && isSameView(previous, next)) return previous
		viewRef.current = next
		return next
	}, [parsed, staticView, format, locale, timeZone, hour12])

	const getServerView = React.useCallback(() => staticView, [staticView])

	const minuteBandEpochMs =
		parsed !== null &&
		parsed.kind === TimestampKind.Instant &&
		(format === TimestampFormat.Compact || format === TimestampFormat.Relative)
			? parsed.epochMs
			: null
	const subscribesToClock = parsed !== null && live
	const subscribe = React.useCallback(
		(listener: () => void) => (subscribesToClock ? subscribeClock(listener, minuteBandEpochMs) : subscribeNothing()),
		[subscribesToClock, minuteBandEpochMs]
	)

	const view = React.useSyncExternalStore(subscribe, getView, getServerView)
	return { parsed, view, isStatic, locale, timeZone, context }
}

/**
 * The Timestamp engine for custom displays (a day divider, a "last seen" pill): the same settings
 * resolution, shared clock and strings as `<Timestamp>`, without its markup.
 *
 * @param value - The moment or calendar date. See TimestampValue.
 * @param options - Format and per-call overrides of the provider's locale, zone and clock.
 * @returns Null for an invalid value; `{ pending: true }` until the client knows the clock; otherwise every string.
 * @example
 * const state = useTimestamp(message.sentAt, { format: TimestampFormat.Contextual })
 * return <time dateTime={state?.dateTime}>{state && !state.pending ? state.label : null}</time>
 */
export function useTimestamp(value: TimestampValue, options: UseTimestampOptions = {}): TimestampState | null {
	const { parsed, view } = useTimestampEngine(value, options)
	if (parsed === null) return null
	if (view === null) return { pending: true, dateTime: parsed.dateTime }
	return { pending: false, dateTime: parsed.dateTime, label: view.label, full: view.full, copy: view.copy, kind: parsed.kind }
}

interface RelativeLineProps {
	parsed: ParsedTimestamp
	label: string
	locale?: string
	timeZone?: string
}

/** Tooltip line 2, mounted only while the tooltip is open, so a closed timestamp holds no subscription for it. */
function TimestampRelativeLine({ parsed, label, locale, timeZone }: RelativeLineProps) {
	const minuteBandEpochMs = parsed.kind === TimestampKind.Instant ? parsed.epochMs : null
	const subscribe = React.useCallback(
		(listener: () => void) => subscribeClock(listener, minuteBandEpochMs),
		[minuteBandEpochMs]
	)
	const getText = React.useCallback(() => {
		const snapshot = getClockSnapshot()
		return formatParsedRelative(parsed, {
			locale: locale ?? snapshot.locale,
			timeZone: timeZone ?? snapshot.timeZone,
			now: snapshot.now,
		})
	}, [parsed, locale, timeZone])
	const text = React.useSyncExternalStore(subscribe, getText, () => null)
	if (text === null || text.toLocaleLowerCase() === label.toLocaleLowerCase()) return null
	return <span className="bz-timestamp__relative">{text}</span>
}

function getModality(pointerType: string | null, hovering: boolean): InputModality {
	if (pointerType === TOUCH_POINTER) return InputModality.Touch
	if (pointerType !== null || hovering) return InputModality.Pointer
	return InputModality.Keyboard
}

function getHint(messages: TimestampMessages, modality: InputModality): string {
	if (modality === InputModality.Touch) return messages.tapToCopy
	if (modality === InputModality.Pointer) return messages.clickToCopy
	return messages.enterToCopy
}

function getFailureHint(messages: TimestampMessages, modality: InputModality): string {
	if (modality === InputModality.Touch) return messages.copyFailedTouch
	return messages.copyFailed.split(SHORTCUT_PLACEHOLDER).join(formatHotkey(COPY_HOTKEY))
}

function stopPropagation(event: React.SyntheticEvent): void {
	event.stopPropagation()
}

/**
 * A date or time label that shows the full local date, time and zone on hover or focus and copies an
 * explicit, zone-safe string (`Thu, Oct 1, 2026, 3:04 PM MDT (UTC-6)`) on click, Enter or Space, with
 * "Copied" announced politely.
 *
 * - Live formats (Compact, Relative, Contextual) render after hydration from one shared clock that
 *   pauses while the tab is hidden; fixed formats with a known locale and zone render on the server.
 * - A click stops at the timestamp, so a clickable row's `onClick` does not fire.
 * - Inside an `<a>` or a stretched-link card, pass `copyable={false}`: the label becomes a
 *   non-focusable span with a hover tooltip; keyboard and screen-reader users get the label inside
 *   the link's name and the full time on the destination page.
 * - A failed copy is never silent: the text is shown selected with a shortcut hint and reported to
 *   the provider's `onError`.
 *
 * @example
 * <Timestamp value={comment.createdAt} />
 * <Timestamp value={message.sentAt} format={TimestampFormat.Contextual} />
 * <Timestamp value={invoice.issuedAt} format={TimestampFormat.Absolute} />
 * <Timestamp value={task.dueOn} format={TimestampFormat.Date} /> // dueOn: '2026-10-05'
 */
export function Timestamp({
	className,
	copyable = true,
	direction = TooltipDirection.Top,
	format = TimestampFormat.Relative,
	hour12,
	id,
	locale,
	onCopied,
	ref,
	timeZone,
	value,
	...dataAttributes
}: TimestampProps) {
	const engine = useTimestampEngine(value, { format, hour12, locale, timeZone })
	const { parsed, view, isStatic, context } = engine
	const { messages } = context
	const descriptionId = `${React.useId()}-desc`
	const triggerRef = React.useRef<HTMLButtonElement>(null)
	const [open, setOpen] = React.useState(false)
	const [modality, setModality] = React.useState<InputModality>(InputModality.Keyboard)
	const modalityRef = React.useRef(modality)
	modalityRef.current = modality
	const pointerTypeRef = React.useRef<string | null>(null)
	const hoveringRef = React.useRef(false)
	const touchWhileClosedRef = React.useRef(false)

	const { copy, status, reset } = useCopyToClipboard({
		onCopied: text => {
			announcePolite(messages.copied, triggerRef.current)
			onCopied?.(text)
		},
		onCopyError: error => {
			announcePolite(getFailureHint(messages, modalityRef.current), triggerRef.current)
			context.onError?.({ kind: TimestampIssueKind.CopyFailed, error })
		},
	})

	const handleOpenChange = (next: boolean) => {
		if (next) {
			setModality(getModality(pointerTypeRef.current, hoveringRef.current))
			setOpen(true)
			return
		}
		setOpen(false)
		if (status === CopyStatus.Failed) reset()
	}

	const formatData = FORMAT_DATA[format]
	const rootProps = { ...dataAttributes, ref, id, className: cx('bz-timestamp', className) }

	if (parsed === null) {
		return (
			<span {...rootProps} data-invalid="">
				{messages.invalid}
			</span>
		)
	}

	if (view === null) {
		return (
			<span {...rootProps} data-format={formatData} data-pending="">
				<time dateTime={parsed.dateTime} />
			</span>
		)
	}

	const time = (
		<time dateTime={parsed.dateTime} suppressHydrationWarning={isStatic}>
			{view.label}
		</time>
	)

	const renderTooltip = (hint: React.ReactNode, trigger: React.ReactElement) => (
		<Tooltip
			content={
				<div className="bz-timestamp__tooltip">
					<span className="bz-timestamp__full">{view.full}</span>
					<TimestampRelativeLine parsed={parsed} label={view.label} locale={engine.locale} timeZone={engine.timeZone} />
					{hint}
				</div>
			}
			describeTrigger={false}
			direction={direction}
			onOpenChange={handleOpenChange}
			open={open}
		>
			{trigger}
		</Tooltip>
	)

	if (!copyable) {
		return (
			<span {...rootProps} data-copyable="false" data-format={formatData}>
				{renderTooltip(null, <span className="bz-timestamp__trigger">{time}</span>)}
			</span>
		)
	}

	const hint =
		status === CopyStatus.Failed ? (
			<CopyFallback text={view.copy} hint={getFailureHint(messages, modality)} />
		) : (
			<span className="bz-timestamp__hint">
				{status === CopyStatus.Copied ? messages.copied : getHint(messages, modality)}
			</span>
		)

	const trigger = (
		<button
			ref={triggerRef}
			type="button"
			className="bz-timestamp__trigger"
			aria-describedby={descriptionId}
			onPointerEnter={event => {
				if (event.pointerType !== TOUCH_POINTER) hoveringRef.current = true
			}}
			onPointerLeave={() => {
				hoveringRef.current = false
			}}
			onPointerDown={event => {
				pointerTypeRef.current = event.pointerType
				touchWhileClosedRef.current = event.pointerType === TOUCH_POINTER && !open
				setModality(getModality(event.pointerType, hoveringRef.current))
			}}
			onBlur={() => {
				pointerTypeRef.current = null
			}}
			onClick={() => {
				if (touchWhileClosedRef.current) {
					touchWhileClosedRef.current = false
					return
				}
				void copy(view.copy)
				if (!open) handleOpenChange(true)
			}}
		>
			{time}
			{view.srSuffix !== null && <span className="bz-visually-hidden">{view.srSuffix}</span>}
		</button>
	)

	return (
		<span
			{...rootProps}
			data-copy-status={COPY_STATUS_DATA[status]}
			data-format={formatData}
			onClick={stopPropagation}
		>
			{renderTooltip(hint, trigger)}
			<span id={descriptionId} hidden suppressHydrationWarning={isStatic}>
				{`${view.full}. ${messages.copyDescription}`}
			</span>
		</span>
	)
}

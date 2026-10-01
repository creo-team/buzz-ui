import { HOUR_MS } from './time-units.js'

/** One frozen reading of the clock and the viewer's defaults. */
export interface ClockSnapshot {
	/** Epoch ms when the snapshot was taken. */
	readonly now: number
	/** The runtime's default locale. */
	readonly locale: string
	/** The runtime's default IANA time zone. */
	readonly timeZone: string
}

/** Cadence while any registered instant is within an hour of now, so minute labels stay current. */
const FAST_TICK_MS = 10_000
/** Cadence otherwise: hour and day labels change at most once a minute. */
const SLOW_TICK_MS = 60_000

type Listener = () => void

/** Each listener with the instant whose label may change every minute, or null. */
const listeners = new Map<Listener, number | null>()
let snapshot: ClockSnapshot | null = null
let timer: ReturnType<typeof setTimeout> | null = null
let timerCadenceMs: number | null = null
let pageListenersAttached = false

function readSnapshot(): ClockSnapshot {
	const { locale, timeZone } = new Intl.DateTimeFormat().resolvedOptions()
	return { now: Date.now(), locale, timeZone }
}

function isDocumentHidden(): boolean {
	return typeof document !== 'undefined' && document.visibilityState === 'hidden'
}

/** Stale when older than the fast cadence, or from the future after the system clock moved back. */
function refreshIfStale(): void {
	if (snapshot === null || Math.abs(Date.now() - snapshot.now) >= FAST_TICK_MS) snapshot = readSnapshot()
}

function clearTimer(): void {
	if (timer !== null) clearTimeout(timer)
	timer = null
	timerCadenceMs = null
}

function getCadenceMs(now: number): number | null {
	if (listeners.size === 0 || isDocumentHidden()) return null
	for (const epochMs of listeners.values()) {
		if (epochMs !== null && Math.abs(now - epochMs) < HOUR_MS) return FAST_TICK_MS
	}
	return SLOW_TICK_MS
}

function notifyAll(): void {
	for (const listener of [...listeners.keys()]) listener()
}

function tick(): void {
	timer = null
	timerCadenceMs = null
	snapshot = readSnapshot()
	notifyAll()
	schedule()
}

/** Keeps one timer for the document, rescheduling only when the cadence changes; aligned to the wall clock. */
function schedule(): void {
	const now = Date.now()
	const cadenceMs = getCadenceMs(now)
	if (cadenceMs === null) {
		clearTimer()
		return
	}
	if (timer !== null && timerCadenceMs === cadenceMs) return
	clearTimer()
	timerCadenceMs = cadenceMs
	timer = setTimeout(tick, cadenceMs - (now % cadenceMs))
}

function resync(): void {
	snapshot = readSnapshot()
	notifyAll()
	schedule()
}

function handleVisibilityChange(): void {
	if (isDocumentHidden()) {
		clearTimer()
		return
	}
	resync()
}

function attachPageListeners(): void {
	if (pageListenersAttached || typeof document === 'undefined') return
	document.addEventListener('visibilitychange', handleVisibilityChange)
	window.addEventListener('pageshow', resync)
	pageListenersAttached = true
}

function detachPageListenersIfIdle(): void {
	if (!pageListenersAttached || listeners.size > 0) return
	document.removeEventListener('visibilitychange', handleVisibilityChange)
	window.removeEventListener('pageshow', resync)
	pageListenersAttached = false
}

/**
 * Subscribes a listener to the shared clock. `minuteBandEpochMs` is the instant whose label may
 * change every minute, or null. Returns the unsubscribe function.
 */
export function subscribeClock(listener: Listener, minuteBandEpochMs: number | null): () => void {
	if (timer === null) refreshIfStale()
	listeners.set(listener, minuteBandEpochMs)
	attachPageListeners()
	schedule()
	return () => {
		listeners.delete(listener)
		schedule()
		detachPageListenersIfIdle()
	}
}

/**
 * The current snapshot. While no timer runs (no subscribers, or a hidden tab), a snapshot older
 * than the fast cadence is replaced first, so a read after an idle period is never stale; calls
 * within that window return the same object, as `useSyncExternalStore` requires.
 */
export function getClockSnapshot(): ClockSnapshot {
	if (timer === null || snapshot === null) refreshIfStale()
	return snapshot ?? readSnapshot()
}

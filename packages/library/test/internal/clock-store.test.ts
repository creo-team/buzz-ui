import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type ClockStore = typeof import('../../src/internal/clock-store.js')

const NOW = Date.parse('2026-10-01T21:04:09Z')
const SECOND = 1_000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

let visibility: DocumentVisibilityState = 'visible'
const cleanups: (() => void)[] = []

/** A fresh module per test, so no test inherits another's listeners or snapshot. */
async function loadStore(): Promise<ClockStore> {
	vi.resetModules()
	const store = await import('../../src/internal/clock-store.js')
	return {
		...store,
		subscribeClock: (listener, minuteBandEpochMs) => {
			const unsubscribe = store.subscribeClock(listener, minuteBandEpochMs)
			cleanups.push(unsubscribe)
			return unsubscribe
		},
	}
}

function setVisibility(state: DocumentVisibilityState) {
	visibility = state
	document.dispatchEvent(new Event('visibilitychange'))
}

beforeEach(() => {
	vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
	vi.setSystemTime(NOW)
	visibility = 'visible'
	Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => visibility })
})

afterEach(() => {
	for (const cleanup of cleanups.splice(0)) cleanup()
	vi.useRealTimers()
})

describe('clock store', () => {
	it('keeps one timer for 100 subscribers, at 60 s when no instant is within the hour', async () => {
		const store = await loadStore()
		const listener = vi.fn()
		const unsubscribes = Array.from({ length: 100 }, () => store.subscribeClock(() => listener(), null))
		expect(vi.getTimerCount()).toBe(1)

		// Aligned to the wall clock: 21:04:09 ticks first at 21:05:00.
		vi.advanceTimersByTime(51 * SECOND - 1)
		expect(listener).not.toHaveBeenCalled()
		vi.advanceTimersByTime(1)
		expect(listener).toHaveBeenCalledTimes(100)
		vi.advanceTimersByTime(MINUTE)
		expect(listener).toHaveBeenCalledTimes(200)
		expect(vi.getTimerCount()).toBe(1)

		for (const unsubscribe of unsubscribes) unsubscribe()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('ticks every 10 s while a registered instant is within the hour', async () => {
		const store = await loadStore()
		const listener = vi.fn()
		const unsubscribe = store.subscribeClock(listener, NOW - 5 * MINUTE)
		store.subscribeClock(() => undefined, null)
		expect(vi.getTimerCount()).toBe(1)

		vi.advanceTimersByTime(SECOND)
		expect(listener).toHaveBeenCalledTimes(1)
		vi.advanceTimersByTime(10 * SECOND)
		expect(listener).toHaveBeenCalledTimes(2)
		expect(store.getClockSnapshot().now).toBe(NOW + 11 * SECOND)
		unsubscribe()
	})

	it('drops to 60 s once the instant leaves the hour band', async () => {
		const store = await loadStore()
		const listener = vi.fn()
		store.subscribeClock(listener, NOW - HOUR + 30 * SECOND)
		vi.advanceTimersByTime(31 * SECOND)
		const callsInFastBand = listener.mock.calls.length
		expect(callsInFastBand).toBe(4)
		vi.advanceTimersByTime(MINUTE - 10 * SECOND)
		expect(listener).toHaveBeenCalledTimes(callsInFastBand + 1)
	})

	it('refreshes a stale snapshot on read after an idle period', async () => {
		const store = await loadStore()
		const unsubscribe = store.subscribeClock(() => undefined, null)
		unsubscribe()
		vi.advanceTimersByTime(2 * HOUR)
		expect(store.getClockSnapshot().now).toBe(Date.now())
	})

	it('returns the same object for reads within 10 s while idle', async () => {
		const store = await loadStore()
		const first = store.getClockSnapshot()
		vi.advanceTimersByTime(9 * SECOND)
		expect(store.getClockSnapshot()).toBe(first)
		vi.advanceTimersByTime(SECOND)
		expect(store.getClockSnapshot()).not.toBe(first)
	})

	it('reads the viewer’s locale and zone from the runtime', async () => {
		const store = await loadStore()
		const resolved = new Intl.DateTimeFormat().resolvedOptions()
		expect(store.getClockSnapshot()).toMatchObject({ locale: resolved.locale, timeZone: resolved.timeZone })
	})

	it('stops while the tab is hidden and notifies once when it is visible again', async () => {
		const store = await loadStore()
		const listener = vi.fn()
		store.subscribeClock(listener, null)
		expect(vi.getTimerCount()).toBe(1)

		setVisibility('hidden')
		expect(vi.getTimerCount()).toBe(0)
		vi.advanceTimersByTime(HOUR)
		expect(listener).not.toHaveBeenCalled()

		setVisibility('visible')
		expect(listener).toHaveBeenCalledTimes(1)
		expect(store.getClockSnapshot().now).toBe(NOW + HOUR)
		expect(vi.getTimerCount()).toBe(1)
	})

	it('refreshes a stale snapshot on read while a slow timer runs, and moves existing subscribers to it once', async () => {
		vi.setSystemTime(Date.parse('2026-10-01T21:04:00Z'))
		const store = await loadStore()
		const listener = vi.fn()
		store.subscribeClock(listener, null)
		const first = store.getClockSnapshot()

		// The 60 s timer fires at 21:05:00; 58 s in, a new reader must not get the 21:04:00 snapshot.
		vi.advanceTimersByTime(58 * SECOND)
		expect(listener).not.toHaveBeenCalled()
		const fresh = store.getClockSnapshot()
		expect(fresh.now).toBe(Date.now())
		expect(fresh).not.toBe(first)
		expect(store.getClockSnapshot()).toBe(fresh)
		await Promise.resolve()
		expect(listener).toHaveBeenCalledTimes(1)
		expect(vi.getTimerCount()).toBe(1)
	})

	it('refreshes on subscribe while another subscriber keeps the timer running', async () => {
		vi.setSystemTime(Date.parse('2026-10-01T21:04:00Z'))
		const store = await loadStore()
		store.subscribeClock(() => undefined, null)
		vi.advanceTimersByTime(50 * SECOND)
		store.subscribeClock(() => undefined, Date.now())
		expect(store.getClockSnapshot().now).toBe(Date.now())
	})

	it('resyncs on a back-forward cache restore', async () => {
		const store = await loadStore()
		const listener = vi.fn()
		store.subscribeClock(listener, null)
		window.dispatchEvent(new Event('pageshow'))
		expect(listener).toHaveBeenCalledTimes(1)
	})
})

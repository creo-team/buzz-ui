// @vitest-environment node
import React from 'react'
import { renderToString } from 'react-dom/server'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { Timestamp, TimestampProvider } from '../../src/data/timestamp'
import { TimestampFormat } from '../../src/utils/format-timestamp'

// Server renders run in a real Node environment (no window, no document). Hydration then runs in a
// jsdom window installed on the globals afterwards, the way a browser receives the server's HTML.

const NOW = Date.parse('2026-10-01T21:04:09Z')
const FIVE_MINUTES = 5 * 60_000

const RealDate = Date

/** A Date whose zero-argument constructor and Date.now throw, to prove no clock read during a server render. */
class GuardedDate extends RealDate {
	constructor(...args: [] | [number | string | Date]) {
		if (args.length === 0) throw new Error('new Date() read the clock during a server render')
		super(args[0])
	}

	static override now(): number {
		throw new Error('Date.now() read the clock during a server render')
	}
}

function renderWithClockGuard(element: React.ReactElement): string {
	globalThis.Date = GuardedDate as DateConstructor
	try {
		return renderToString(element)
	} finally {
		globalThis.Date = RealDate
	}
}

function RelativeTree({ value }: { value: number }) {
	return (
		<TimestampProvider locale="en-US" timeZone="America/Denver">
			<p>
				Edited <Timestamp value={value} />
			</p>
		</TimestampProvider>
	)
}

function AbsoluteTree({ onRef }: { onRef?: (node: HTMLSpanElement | null) => void }) {
	return (
		<p>
			Issued <Timestamp ref={onRef} value={NOW} format={TimestampFormat.Absolute} locale="en-US" timeZone="America/Denver" />
		</p>
	)
}

describe('server render', () => {
	it('never reads the clock', () => {
		expect(() => renderWithClockGuard(<RelativeTree value={NOW - FIVE_MINUTES} />)).not.toThrow()
		expect(() => renderWithClockGuard(<AbsoluteTree />)).not.toThrow()
	})

	it('renders a live format as a pending span with an empty <time>', () => {
		const html = renderWithClockGuard(<RelativeTree value={NOW - FIVE_MINUTES} />)
		expect(html).toContain('data-pending=""')
		expect(html).toContain('data-format="relative"')
		expect(html).toMatch(/<time datetime="2026-10-01T20:59:09\.000Z"><\/time>/i)
	})

	it('renders an absolute format with a known locale and zone as final text', () => {
		const html = renderWithClockGuard(<AbsoluteTree />)
		expect(html).toMatch(/<time datetime="2026-10-01T21:04:09\.000Z">Oct 1, 2026, 3:04 PM<\/time>/i)
		expect(html).not.toContain('data-pending')
	})
})

describe('hydration', () => {
	type HydrateRoot = typeof import('react-dom/client').hydrateRoot
	let hydrateRoot: HydrateRoot
	let installedKeys: string[] = []
	let container: HTMLElement

	beforeAll(async () => {
		const { JSDOM } = await import('jsdom')
		const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true, url: 'http://localhost/' })
		const globals = globalThis as Record<string, unknown>
		installedKeys = Object.getOwnPropertyNames(dom.window).filter(key => !(key in globalThis))
		for (const key of installedKeys) globals[key] = (dom.window as unknown as Record<string, unknown>)[key]
		globals.window = dom.window
		globals.document = dom.window.document
		globals.IS_REACT_ACT_ENVIRONMENT = true
		installedKeys.push('window', 'document', 'IS_REACT_ACT_ENVIRONMENT')
		;({ hydrateRoot } = await import('react-dom/client'))
	})

	afterAll(() => {
		const globals = globalThis as Record<string, unknown>
		for (const key of installedKeys) delete globals[key]
	})

	function mount(html: string): HTMLElement {
		container = document.createElement('div')
		container.innerHTML = html
		document.body.appendChild(container)
		return container
	}

	it('hydrates a pending timestamp without errors, then shows the label', async () => {
		const value = Date.now() - FIVE_MINUTES
		const html = renderWithClockGuard(<RelativeTree value={value} />)
		const root = mount(html)
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const onRecoverableError = vi.fn()

		await React.act(async () => {
			hydrateRoot(root, <RelativeTree value={value} />, { onRecoverableError })
		})

		expect(consoleError).not.toHaveBeenCalled()
		expect(onRecoverableError).not.toHaveBeenCalled()
		expect(root.querySelector('time')?.textContent).toBe('5 minutes ago')
		expect(root.querySelector('[data-pending]')).toBeNull()
		consoleError.mockRestore()
	})

	it('attaches the ref to the pending root span during hydration', async () => {
		const value = Date.now() - FIVE_MINUTES
		const pendingAtAttach: boolean[] = []
		const recordRef = (node: HTMLSpanElement | null) => {
			if (node) pendingAtAttach.push(node.hasAttribute('data-pending'))
		}
		function Tree() {
			return (
				<TimestampProvider locale="en-US" timeZone="America/Denver">
					<Timestamp ref={recordRef} value={value} />
				</TimestampProvider>
			)
		}
		const root = mount(renderWithClockGuard(<Tree />))
		await React.act(async () => {
			hydrateRoot(root, <Tree />)
		})
		expect(pendingAtAttach[0]).toBe(true)
		expect(root.firstElementChild?.hasAttribute('data-pending')).toBe(false)
	})

	it('keeps server text for an absolute label when only the CLDR spelling differs', async () => {
		const html = renderWithClockGuard(<AbsoluteTree />).replace('>Oct 1, 2026, 3:04 PM<', '>Oct 1, 2026, 3:04 pm<')
		expect(html).toContain('3:04 pm')
		const root = mount(html)
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const onRecoverableError = vi.fn()

		await React.act(async () => {
			hydrateRoot(root, <AbsoluteTree />, { onRecoverableError })
		})

		expect(consoleError).not.toHaveBeenCalled()
		expect(onRecoverableError).not.toHaveBeenCalled()
		expect(root.querySelector('time')?.textContent).toBe('Oct 1, 2026, 3:04 pm')
		consoleError.mockRestore()
	})
})

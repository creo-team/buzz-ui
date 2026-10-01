import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Timestamp, TimestampProvider, useTimestamp, type TimestampIssue } from '../../src/data/timestamp'
import { formatHotkey } from '../../src/hooks/use-hotkey'
import { Modal } from '../../src/overlays/modal'
import { TimestampFormat, TimestampIssueKind, TimestampKind } from '../../src/utils/format-timestamp'

const NOW = Date.parse('2026-10-01T21:04:09Z')
const SECOND = 1_000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const FIVE_MINUTES_AGO = NOW - 5 * MINUTE
const COPY_TEXT = 'Thu, Oct 1, 2026, 2:59 PM MDT (UTC-6)'
const FULL_TEXT = 'Thursday, October 1, 2026 at 2:59:09 PM MDT'
const DESCRIPTION = `${FULL_TEXT}. Copies the date and time.`
const TOOLTIP_DELAY_MS = 400
/** The tooltip measures its position on the next animation frame. */
const FRAME_MS = 16

const writeText = vi.fn<(text: string) => Promise<void>>()

function Denver({ children, onError }: { children: React.ReactNode; onError?: (issue: TimestampIssue) => void }) {
	return (
		<TimestampProvider locale="en-US" timeZone="America/Denver" onError={onError}>
			{children}
		</TimestampProvider>
	)
}

function getTrigger(): HTMLElement {
	return screen.getByRole('button')
}

function getTooltip(): HTMLElement {
	return screen.getByRole('tooltip')
}

function getAnnouncer(): Element | null {
	return document.querySelector('[data-bz-announcer]')
}

async function flushPromises() {
	await act(async () => {
		await Promise.resolve()
	})
}

function advance(ms: number) {
	act(() => {
		vi.advanceTimersByTime(ms)
	})
}

function focusTrigger() {
	act(() => getTrigger().focus())
	advance(FRAME_MS)
}

function mouseClick(element: HTMLElement) {
	fireEvent.pointerDown(element, { pointerType: 'mouse' })
	fireEvent.click(element)
	advance(FRAME_MS)
}

function tap(element: HTMLElement) {
	fireEvent.pointerDown(element, { pointerType: 'touch' })
	fireEvent.click(element)
	advance(FRAME_MS)
}

beforeEach(() => {
	vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date', 'requestAnimationFrame', 'cancelAnimationFrame'] })
	vi.setSystemTime(NOW)
	writeText.mockReset().mockResolvedValue(undefined)
	Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
	window.getSelection()?.removeAllRanges()
})

afterEach(() => {
	cleanup()
	for (const region of document.querySelectorAll('[data-bz-announcer]')) region.remove()
	vi.useRealTimers()
})

describe('Timestamp rendering', () => {
	it('renders a root span, a button and a <time> with the instant and the label', () => {
		const ref = React.createRef<HTMLSpanElement>()
		const { container } = render(
			<Denver>
				<Timestamp ref={ref} value={FIVE_MINUTES_AGO} id="created" className="extra" data-testid="stamp" />
			</Denver>
		)
		const root = container.firstElementChild as HTMLElement
		expect(root).toHaveClass('bz-timestamp', 'extra')
		expect(root).toHaveAttribute('id', 'created')
		expect(root).toHaveAttribute('data-testid', 'stamp')
		expect(root).toHaveAttribute('data-format', 'relative')
		expect(root).toHaveAttribute('data-copy-status', 'idle')
		expect(ref.current).toBe(root)
		const time = root.querySelector('time')
		expect(time).toHaveAttribute('datetime', '2026-10-01T20:59:09.000Z')
		expect(time).toHaveTextContent(/^5 minutes ago$/)
		expect(screen.getByRole('button', { name: /^5 minutes ago/ })).toBe(getTrigger())
	})

	it('keeps the ref on the root span when not copyable and when invalid', () => {
		const ref = React.createRef<HTMLSpanElement>()
		const { container, rerender } = render(
			<Denver>
				<Timestamp ref={ref} value={FIVE_MINUTES_AGO} copyable={false} />
			</Denver>
		)
		expect(ref.current).toBe(container.firstElementChild)
		expect(ref.current).toHaveAttribute('data-copyable', 'false')
		rerender(
			<Denver>
				<Timestamp ref={ref} value="not a date" />
			</Denver>
		)
		expect(ref.current).toBe(container.firstElementChild)
		expect(ref.current).toHaveAttribute('data-invalid', '')
	})

	it('names a Compact label with a spoken suffix', () => {
		render(
			<Denver>
				<Timestamp value={FIVE_MINUTES_AGO} format={TimestampFormat.Compact} />
			</Denver>
		)
		expect(getTrigger()).toHaveAccessibleName('5m, 5 minutes ago')
		expect(getTrigger().querySelector('time')).toHaveTextContent(/^5m$/)
	})

	it('accepts the format as a string literal', () => {
		render(
			<Denver>
				<Timestamp value={NOW} format="ABSOLUTE" />
			</Denver>
		)
		expect(getTrigger()).toHaveAccessibleName('Oct 1, 2026, 3:04 PM')
	})

	it('describes the trigger from the first render, once, with no modality hint', async () => {
		render(
			<Denver>
				<Timestamp value={FIVE_MINUTES_AGO} />
			</Denver>
		)
		const trigger = getTrigger()
		const descriptionId = trigger.getAttribute('aria-describedby')
		expect(trigger).toHaveAccessibleDescription(DESCRIPTION)

		act(() => trigger.focus())
		advance(FRAME_MS)
		expect(getTooltip()).toBeInTheDocument()
		expect(trigger.getAttribute('aria-describedby')).toBe(descriptionId)
		expect(trigger).toHaveAccessibleDescription(DESCRIPTION)
	})

	it('describes a calendar date as copying the date only', () => {
		render(
			<Denver>
				<Timestamp value="2026-10-05" format={TimestampFormat.Date} />
			</Denver>
		)
		expect(getTrigger()).toHaveAccessibleDescription('Monday, October 5, 2026. Copies the date.')
	})
})

describe('Timestamp tooltip', () => {
	it('opens on hover after 400 ms with the full line and a click hint', () => {
		render(
			<Denver>
				<Timestamp value={FIVE_MINUTES_AGO} />
			</Denver>
		)
		fireEvent.pointerEnter(getTrigger(), { pointerType: 'mouse' })
		advance(TOOLTIP_DELAY_MS - 1)
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
		advance(1)
		advance(FRAME_MS)
		expect(getTooltip()).toHaveTextContent(FULL_TEXT)
		expect(getTooltip()).toHaveTextContent('Click to copy')
	})

	it('opens at once on keyboard focus with an Enter hint, and Escape closes it', () => {
		render(
			<Denver>
				<Timestamp value={FIVE_MINUTES_AGO} />
			</Denver>
		)
		focusTrigger()
		expect(getTooltip()).toHaveTextContent('Press Enter to copy')
		fireEvent.keyDown(getTrigger(), { key: 'Escape' })
		advance(200)
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
		expect(getTrigger()).toHaveFocus()
	})

	it('adds the unbounded relative phrase when the label is not already relative', () => {
		render(
			<Denver>
				<Timestamp value={NOW - 8 * 24 * HOUR} format={TimestampFormat.Absolute} />
			</Denver>
		)
		focusTrigger()
		expect(getTooltip().querySelector('.bz-timestamp__relative')).toHaveTextContent('1 week ago')
	})

	it('omits the relative phrase when it equals the label', () => {
		render(
			<Denver>
				<Timestamp value={FIVE_MINUTES_AGO} />
			</Denver>
		)
		focusTrigger()
		expect(getTooltip().querySelector('.bz-timestamp__relative')).toBeNull()
	})
})

describe('Timestamp copy', () => {
	it('copies the explicit text on click, says Copied, announces it, then reverts', async () => {
		const onCopied = vi.fn()
		const { container } = render(
			<Denver>
				<Timestamp value={FIVE_MINUTES_AGO} onCopied={onCopied} />
			</Denver>
		)
		mouseClick(getTrigger())
		expect(writeText).toHaveBeenCalledWith(COPY_TEXT)
		await flushPromises()
		expect(container.firstElementChild).toHaveAttribute('data-copy-status', 'copied')
		expect(getTooltip()).toHaveTextContent('Copied')
		expect(onCopied).toHaveBeenCalledWith(COPY_TEXT)

		advance(100)
		expect(getAnnouncer()).toHaveTextContent('Copied')
		expect(getAnnouncer()?.parentElement).toBe(document.body)

		advance(1400)
		expect(getTooltip()).toHaveTextContent('Click to copy')
		expect(container.firstElementChild).toHaveAttribute('data-copy-status', 'idle')
	})

	it('copies on Enter and on Space, and keeps focus on the trigger', async () => {
		// user-event drives native button activation; it awaits real timers.
		vi.useRealTimers()
		const user = userEvent.setup()
		// user-event installs its own clipboard stub; observe writes on it.
		const write = vi.spyOn(navigator.clipboard, 'writeText')
		render(
			<Denver>
				<Timestamp value={FIVE_MINUTES_AGO} />
			</Denver>
		)
		await user.tab()
		expect(getTrigger()).toHaveFocus()
		await user.keyboard('{Enter}')
		expect(write).toHaveBeenCalledTimes(1)
		await user.keyboard(' ')
		expect(write).toHaveBeenCalledTimes(2)
		expect(write).toHaveBeenLastCalledWith(COPY_TEXT)
		expect(await navigator.clipboard.readText()).toBe(COPY_TEXT)
		expect(getTrigger()).toHaveFocus()
		expect(await screen.findByText('Copied')).toBeInTheDocument()
	})

	it('announces inside an open modal dialog', async () => {
		render(
			<Denver>
				<Modal open onOpenChange={() => undefined} header="Activity">
					<Timestamp value={FIVE_MINUTES_AGO} />
				</Modal>
			</Denver>
		)
		const trigger = screen.getByRole('button', { name: /5 minutes ago/ })
		mouseClick(trigger)
		await flushPromises()
		advance(100)
		const dialog = screen.getByRole('dialog')
		expect(dialog).toHaveAttribute('aria-modal', 'true')
		expect(getAnnouncer()?.parentElement).toBe(dialog)
		expect(getAnnouncer()).toHaveTextContent('Copied')
	})

	it('shows a failure with the text selected, announces it and reports it', async () => {
		const failure = new DOMException('Write permission denied.', 'NotAllowedError')
		writeText.mockRejectedValue(failure)
		const onError = vi.fn()
		const { container } = render(
			<Denver onError={onError}>
				<Timestamp value={FIVE_MINUTES_AGO} />
			</Denver>
		)
		mouseClick(getTrigger())
		await flushPromises()

		expect(container.firstElementChild).toHaveAttribute('data-copy-status', 'failed')
		const tooltip = getTooltip()
		expect(tooltip.querySelector('.bz-copy-fallback__text')).toHaveTextContent(COPY_TEXT)
		expect(window.getSelection()?.toString()).toBe(COPY_TEXT)
		const hint = `Couldn't copy. Press ${formatHotkey('mod+c')} to copy the selected text.`
		expect(tooltip).toHaveTextContent(hint)
		advance(100)
		expect(getAnnouncer()).toHaveTextContent(hint)
		expect(onError).toHaveBeenCalledWith({ kind: TimestampIssueKind.CopyFailed, error: failure })

		advance(5_000)
		expect(getTooltip()).toHaveAttribute('data-state', 'open')
	})

	it('gives a press-and-hold hint after a touch failure', async () => {
		writeText.mockRejectedValue(new DOMException('Denied', 'NotAllowedError'))
		render(
			<Denver>
				<Timestamp value={FIVE_MINUTES_AGO} />
			</Denver>
		)
		tap(getTrigger())
		tap(getTrigger())
		await flushPromises()
		expect(getTooltip()).toHaveTextContent("Couldn't copy. Press and hold the text to copy it.")
	})

	it('follows the same failure path, without throwing, when the clipboard is missing', async () => {
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
		const onError = vi.fn()
		const { container } = render(
			<Denver onError={onError}>
				<Timestamp value={FIVE_MINUTES_AGO} />
			</Denver>
		)
		mouseClick(getTrigger())
		await flushPromises()
		expect(container.firstElementChild).toHaveAttribute('data-copy-status', 'failed')
		expect(onError).toHaveBeenCalledWith(expect.objectContaining({ kind: TimestampIssueKind.CopyFailed }))
	})

	it('opens on the first tap without copying, copies on the second, closes on an outside tap', () => {
		render(
			<Denver>
				<Timestamp value={FIVE_MINUTES_AGO} />
				<button type="button">Elsewhere</button>
			</Denver>
		)
		const trigger = screen.getByRole('button', { name: /5 minutes ago/ })
		tap(trigger)
		expect(getTooltip()).toHaveTextContent('Tap again to copy')
		expect(writeText).not.toHaveBeenCalled()

		tap(trigger)
		expect(writeText).toHaveBeenCalledWith(COPY_TEXT)

		fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }), { pointerType: 'touch' })
		advance(200)
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
	})

	it('renders a non-interactive span inside a link that never copies', () => {
		render(
			<Denver>
				<a href="#post">
					Posted <Timestamp value={FIVE_MINUTES_AGO} copyable={false} />
				</a>
			</Denver>
		)
		const link = screen.getByRole('link')
		expect(link.querySelector('button')).toBeNull()
		expect(link.querySelector('[tabindex]')).toBeNull()
		expect(link).toHaveAccessibleName('Posted 5 minutes ago')
		const label = link.querySelector('.bz-timestamp__trigger') as HTMLElement
		fireEvent.click(label)
		expect(writeText).not.toHaveBeenCalled()
		fireEvent.pointerEnter(label, { pointerType: 'mouse' })
		advance(TOOLTIP_DELAY_MS)
		advance(FRAME_MS)
		expect(getTooltip()).toHaveTextContent(FULL_TEXT)
		expect(getTooltip()).not.toHaveTextContent('to copy')
	})

	it('stops the click before a clickable row', () => {
		const onRowClick = vi.fn()
		render(
			<Denver>
				<table>
					<tbody>
						<tr onClick={onRowClick}>
							<td>
								<Timestamp value={FIVE_MINUTES_AGO} />
							</td>
						</tr>
					</tbody>
				</table>
			</Denver>
		)
		mouseClick(getTrigger())
		expect(writeText).toHaveBeenCalled()
		expect(onRowClick).not.toHaveBeenCalled()
	})

	it('stops Enter and Space before a keyboard-operable row, and lets other keys through', async () => {
		vi.useRealTimers()
		const user = userEvent.setup()
		const write = vi.spyOn(navigator.clipboard, 'writeText')
		const onRowClick = vi.fn()
		const onRowKeyDown = vi.fn()
		render(
			<Denver>
				<table>
					<tbody>
						<tr tabIndex={0} onClick={onRowClick} onKeyDown={event => onRowKeyDown(event.key)}>
							<td>
								<Timestamp value={FIVE_MINUTES_AGO} />
							</td>
						</tr>
					</tbody>
				</table>
			</Denver>
		)
		await user.tab()
		await user.tab()
		expect(getTrigger()).toHaveFocus()
		onRowKeyDown.mockClear()
		await user.keyboard('{Enter}')
		await user.keyboard(' ')
		expect(write).toHaveBeenCalledTimes(2)
		expect(onRowClick).not.toHaveBeenCalled()
		expect(onRowKeyDown).not.toHaveBeenCalled()
		await user.keyboard('{ArrowDown}')
		expect(onRowKeyDown).toHaveBeenCalledWith('ArrowDown')
	})
})

describe('Timestamp live updates', () => {
	it('ticks a Relative label from now to 1 minute ago', () => {
		render(
			<Denver>
				<Timestamp value={NOW} />
			</Denver>
		)
		expect(getTrigger()).toHaveAccessibleName(/^now/)
		advance(70 * SECOND)
		expect(getTrigger()).toHaveAccessibleName(/^1 minute ago/)
	})

	it('shares one timer across 100 Relative timestamps', () => {
		render(
			<Denver>
				{Array.from({ length: 100 }, (_, index) => (
					<Timestamp key={index} value={NOW - index * MINUTE} />
				))}
			</Denver>
		)
		expect(vi.getTimerCount()).toBe(1)
	})

	it('holds no timer for closed Absolute, Time and Date timestamps', () => {
		render(
			<Denver>
				<Timestamp value={NOW} format={TimestampFormat.Absolute} />
				<Timestamp value={NOW} format={TimestampFormat.Time} />
				<Timestamp value={NOW} format={TimestampFormat.Date} />
				<Timestamp value="2026-10-05" format={TimestampFormat.Date} />
			</Denver>
		)
		expect(vi.getTimerCount()).toBe(0)
	})

	it('moves a Contextual label to Yesterday at midnight', () => {
		const lateEvening = Date.parse('2026-10-02T05:59:30Z')
		vi.setSystemTime(lateEvening)
		render(
			<Denver>
				<Timestamp value={lateEvening} format={TimestampFormat.Contextual} />
			</Denver>
		)
		expect(getTrigger()).toHaveAccessibleName('Today at 11:59 PM')
		advance(60 * SECOND)
		expect(getTrigger()).toHaveAccessibleName('Yesterday at 11:59 PM')
	})

	it('commits nothing on a tick that changes no label', () => {
		const onRender = vi.fn()
		render(
			<Denver>
				<React.Profiler id="feed" onRender={onRender}>
					{Array.from({ length: 50 }, (_, index) => (
						<Timestamp key={index} value={NOW - HOUR - MINUTE - index * SECOND} />
					))}
				</React.Profiler>
			</Denver>
		)
		const commits = onRender.mock.calls.length
		advance(60 * SECOND)
		expect(screen.getAllByRole('button')[0]).toHaveAccessibleName(/^1 hour ago/)
		expect(onRender.mock.calls.length).toBe(commits)
	})

	it('commits a fresh label first after an idle period', () => {
		const first = render(
			<Denver>
				<Timestamp value={NOW} />
			</Denver>
		)
		first.unmount()
		advance(2 * HOUR)
		const committed: string[] = []
		const recordFirstCommit = (node: HTMLSpanElement | null) => {
			if (node) committed.push(node.querySelector('time')?.textContent ?? '')
		}
		render(
			<Denver>
				<Timestamp ref={recordFirstCommit} value={Date.now() - MINUTE} />
			</Denver>
		)
		expect(committed[0]).toBe('1 minute ago')
	})

	it('commits a fresh label first while another timestamp keeps a slow timer running', async () => {
		vi.setSystemTime(Date.parse('2026-10-01T21:04:00Z'))
		render(
			<Denver>
				<Timestamp value={Date.now()} format={TimestampFormat.Contextual} />
			</Denver>
		)
		// The Contextual timestamp keeps the 60 s cadence; its first tick is at 21:05:00.
		advance(58 * SECOND)
		const committed: string[] = []
		const recordFirstCommit = (node: HTMLSpanElement | null) => {
			if (node) committed.push(node.querySelector('time')?.textContent ?? '')
		}
		const skewed = Date.now() + 5 * SECOND
		render(
			<Denver>
				<Timestamp ref={recordFirstCommit} value={skewed} />
				<Timestamp value={skewed} format={TimestampFormat.Compact} data-testid="compact" />
				<Timestamp value={Date.now() - 5 * MINUTE} data-testid="five" />
			</Denver>
		)
		expect(committed[0]).toBe('now')
		expect(screen.getByTestId('compact').querySelector('time')).toHaveTextContent(/^now$/)
		expect(screen.getByTestId('five').querySelector('time')).toHaveTextContent('5 minutes ago')
		await flushPromises()
		expect(screen.getAllByText('Today at 3:04 PM')).toHaveLength(1)
	})

	it('creates one timer and one announcer region under StrictMode', async () => {
		render(
			<React.StrictMode>
				<Denver>
					<Timestamp value={FIVE_MINUTES_AGO} />
				</Denver>
			</React.StrictMode>
		)
		expect(vi.getTimerCount()).toBe(1)
		mouseClick(getTrigger())
		await flushPromises()
		advance(1500)
		mouseClick(getTrigger())
		await flushPromises()
		expect(document.querySelectorAll('[data-bz-announcer]')).toHaveLength(1)
	})
})

describe('TimestampProvider and invalid input', () => {
	it('falls back from an invalid locale and zone and reports each once', () => {
		const onError = vi.fn()
		render(
			<TimestampProvider locale="en_US" timeZone="Mars/Olympus" onError={onError}>
				<Timestamp value={FIVE_MINUTES_AGO} />
				<Timestamp value={NOW} format={TimestampFormat.Absolute} />
			</TimestampProvider>
		)
		expect(screen.getAllByRole('button')).toHaveLength(2)
		expect(onError).toHaveBeenCalledTimes(2)
		expect(onError).toHaveBeenCalledWith({ kind: TimestampIssueKind.InvalidLocale, input: 'en_US' })
		expect(onError).toHaveBeenCalledWith({ kind: TimestampIssueKind.InvalidTimeZone, input: 'Mars/Olympus' })
	})

	it('falls back from invalid per-instance props and reports them', () => {
		const onError = vi.fn()
		render(
			<Denver onError={onError}>
				<Timestamp value={NOW} format={TimestampFormat.Absolute} timeZone="Mars/Olympus" />
			</Denver>
		)
		expect(getTrigger()).toHaveAccessibleName('Oct 1, 2026, 3:04 PM')
		expect(onError).toHaveBeenCalledWith({ kind: TimestampIssueKind.InvalidTimeZone, input: 'Mars/Olympus' })
	})

	it('renders an invalid value as a dash with no focus, tooltip or copy, and reports it', () => {
		const onError = vi.fn()
		const { container } = render(
			<Denver onError={onError}>
				<Timestamp value="2026-10-01T15:00" />
			</Denver>
		)
		const root = container.firstElementChild as HTMLElement
		expect(root).toHaveTextContent('—')
		expect(root).toHaveAttribute('data-invalid', '')
		expect(root.querySelector('button, time, [tabindex]')).toBeNull()
		fireEvent.pointerEnter(root, { pointerType: 'mouse' })
		advance(TOOLTIP_DELAY_MS)
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
		expect(onError).toHaveBeenCalledTimes(1)
		expect(onError).toHaveBeenCalledWith({ kind: TimestampIssueKind.InvalidValue, input: '2026-10-01T15:00' })
	})

	it('localizes through provider messages', () => {
		render(
			<TimestampProvider locale="en-US" timeZone="America/Denver" messages={{ copyDescription: 'Kopiert Datum und Uhrzeit.' }}>
				<Timestamp value={FIVE_MINUTES_AGO} />
			</TimestampProvider>
		)
		expect(getTrigger()).toHaveAccessibleDescription(`${FULL_TEXT}. Kopiert Datum und Uhrzeit.`)
	})
})

describe('useTimestamp', () => {
	it('returns every string for custom displays, and null for an invalid value', () => {
		const states: unknown[] = []
		function Probe({ value }: { value: string | number }) {
			states.push(useTimestamp(value, { format: TimestampFormat.Contextual }))
			return null
		}
		render(
			<Denver>
				<Probe value={FIVE_MINUTES_AGO} />
				<Probe value="2026-02-30" />
			</Denver>
		)
		expect(states).toContainEqual({
			pending: false,
			dateTime: '2026-10-01T20:59:09.000Z',
			label: 'Today at 2:59 PM',
			full: FULL_TEXT,
			copy: COPY_TEXT,
			kind: TimestampKind.Instant,
		})
		expect(states).toContain(null)
	})
})

describe('Timestamp accessibility', () => {
	// jsdom cannot compute colors. `region` is off because overlays portal to <body>, outside any
	// landmark, by design; the tooltip is not page content.
	const AXE_OPTIONS: axe.RunOptions = { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } }

	async function getViolations(): Promise<string[]> {
		vi.useRealTimers()
		const results = await axe.run(document.body, AXE_OPTIONS)
		return results.violations.map(violation => `${violation.id}: ${violation.nodes.map(node => node.html).join(' | ')}`)
	}

	function renderInMain(children: React.ReactNode, onError?: (issue: TimestampIssue) => void) {
		return render(
			<main>
				<h1>Activity</h1>
				<Denver onError={onError}>{children}</Denver>
			</main>
		)
	}

	it('has no violations when idle', async () => {
		renderInMain(<Timestamp value={FIVE_MINUTES_AGO} />)
		expect(await getViolations()).toEqual([])
	})

	it('has no violations when open', async () => {
		renderInMain(<Timestamp value={FIVE_MINUTES_AGO} />)
		focusTrigger()
		expect(getTooltip()).toBeInTheDocument()
		expect(await getViolations()).toEqual([])
	})

	it('has no violations when copied', async () => {
		renderInMain(<Timestamp value={FIVE_MINUTES_AGO} />)
		mouseClick(getTrigger())
		await flushPromises()
		advance(100)
		expect(getTooltip()).toHaveTextContent('Copied')
		expect(await getViolations()).toEqual([])
	})

	it('has no violations when the copy failed', async () => {
		writeText.mockRejectedValue(new DOMException('Denied', 'NotAllowedError'))
		renderInMain(<Timestamp value={FIVE_MINUTES_AGO} />)
		mouseClick(getTrigger())
		await flushPromises()
		expect(getTooltip().querySelector('.bz-copy-fallback')).not.toBeNull()
		expect(await getViolations()).toEqual([])
	})

	it('has no violations when not copyable', async () => {
		renderInMain(
			<a href="#post">
				Posted <Timestamp value={FIVE_MINUTES_AGO} copyable={false} />
			</a>
		)
		expect(await getViolations()).toEqual([])
	})

	it('has no violations when invalid', async () => {
		renderInMain(<Timestamp value="not a date" />, () => undefined)
		expect(await getViolations()).toEqual([])
	})
})

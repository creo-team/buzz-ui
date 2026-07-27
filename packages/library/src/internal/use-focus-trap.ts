"use client"
import * as React from 'react'

const FOCUSABLE =
	'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

function getTabbables(container: HTMLElement): HTMLElement[] {
	// Layout information is unavailable in some environments (jsdom); only
	// apply the visibility filter when the document actually has layout.
	const hasLayout =
		typeof document !== 'undefined' &&
		(document.body.offsetWidth > 0 || document.body.getClientRects().length > 0)

	return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => {
		if (el.getAttribute('aria-hidden') === 'true' || el.hidden) return false
		if (!hasLayout) return true
		return el.offsetParent !== null || el.getClientRects().length > 0
	})
}

export interface FocusTrapOptions {
	/** Focus this element on activation instead of the default heuristic. */
	initialFocusRef?: React.RefObject<HTMLElement | null>
	/** Return focus to the previously focused element on deactivation. Default true. */
	restoreFocus?: boolean
}

/**
 * Traps Tab focus within `containerRef` while `active`, focuses an initial
 * element on activation ([data-autofocus] → [autofocus] → first tabbable →
 * the container itself), and restores focus on deactivation.
 *
 * Waits for the container to appear — portal content mounts a frame after
 * the overlay opens.
 */
export function useFocusTrap(
	containerRef: React.RefObject<HTMLElement | null>,
	active: boolean,
	{ initialFocusRef, restoreFocus = true }: FocusTrapOptions = {}
) {
	const previouslyFocused = React.useRef<HTMLElement | null>(null)

	React.useEffect(() => {
		if (!active) return
		previouslyFocused.current = (document.activeElement as HTMLElement) ?? null

		let disposed = false
		const focusInitial = () => {
			if (disposed) return
			const container = containerRef.current
			if (!container) {
				requestAnimationFrame(focusInitial)
				return
			}
			const target =
				initialFocusRef?.current ??
				container.querySelector<HTMLElement>('[data-autofocus]') ??
				container.querySelector<HTMLElement>('[autofocus]') ??
				getTabbables(container)[0] ??
				container
			if (target === container && !container.hasAttribute('tabindex')) {
				container.setAttribute('tabindex', '-1')
			}
			target.focus({ preventScroll: true })
		}
		focusInitial()

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') return
			const container = containerRef.current
			if (!container) return
			const tabbables = getTabbables(container)
			if (tabbables.length === 0) {
				event.preventDefault()
				return
			}
			const first = tabbables[0]
			const last = tabbables[tabbables.length - 1]
			const current = document.activeElement as HTMLElement | null

			if (event.shiftKey) {
				if (current === first || !container.contains(current)) {
					event.preventDefault()
					last.focus()
				}
			} else if (current === last || !container.contains(current)) {
				event.preventDefault()
				first.focus()
			}
		}

		document.addEventListener('keydown', handleKeydown, true)
		return () => {
			disposed = true
			document.removeEventListener('keydown', handleKeydown, true)
			if (restoreFocus) {
				previouslyFocused.current?.focus?.({ preventScroll: true })
			}
		}
	}, [active, containerRef, initialFocusRef, restoreFocus])
}

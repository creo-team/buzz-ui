"use client"
import * as React from 'react'

/**
 * Reference-counted body scroll lock. Multiple overlays can lock at once;
 * the original inline styles are restored only when the last one unlocks.
 * Compensates for scrollbar width so the page doesn't shift.
 */
let lockCount = 0
let previousOverflow = ''
let previousPaddingRight = ''

function lock() {
	if (lockCount === 0) {
		const body = document.body
		previousOverflow = body.style.overflow
		previousPaddingRight = body.style.paddingRight
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
		// Sanity-bound: layoutless environments (jsdom) report clientWidth 0.
		if (scrollbarWidth > 0 && scrollbarWidth < 60) {
			const computed = parseFloat(getComputedStyle(body).paddingRight) || 0
			body.style.paddingRight = `${computed + scrollbarWidth}px`
		}
		body.style.overflow = 'hidden'
	}
	lockCount++
}

function unlock() {
	lockCount = Math.max(0, lockCount - 1)
	if (lockCount === 0) {
		document.body.style.overflow = previousOverflow
		document.body.style.paddingRight = previousPaddingRight
	}
}

export function useScrollLock(active: boolean) {
	React.useEffect(() => {
		if (!active) return
		lock()
		return unlock
	}, [active])
}

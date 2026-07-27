"use client"
import * as React from 'react'

/**
 * Keeps an element mounted for `duration` ms after `open` flips to false so
 * CSS exit animations (keyed off `data-state="closed"`) can play.
 */
export function usePresence(open: boolean, duration = 180): boolean {
	const [mounted, setMounted] = React.useState(open)
	React.useEffect(() => {
		if (open) {
			setMounted(true)
			return
		}
		const timer = setTimeout(() => setMounted(false), duration)
		return () => clearTimeout(timer)
	}, [open, duration])
	return open || mounted
}

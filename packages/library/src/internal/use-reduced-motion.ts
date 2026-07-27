"use client"
import * as React from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
	const mql = window.matchMedia(QUERY)
	mql.addEventListener('change', callback)
	return () => mql.removeEventListener('change', callback)
}

/**
 * SSR-safe `prefers-reduced-motion` — false on the server, live on the client.
 * Components use this to skip JS-driven animation work; CSS animations are
 * additionally gated by a media query in the stylesheet.
 */
export function useReducedMotion(): boolean {
	return React.useSyncExternalStore(
		subscribe,
		() => window.matchMedia(QUERY).matches,
		() => false
	)
}

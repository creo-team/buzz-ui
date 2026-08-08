"use client"
import * as React from 'react'
import { toast } from '../overlays/toast.js'
import { Style, type StyleConfig, setStyleCookie, getStyleFromCookie } from './style-types.js'

export interface UseStyleSwitcherOptions {
	styles: StyleConfig[]
	defaultStyle?: Style | string
	initialStyle?: string
	showToast?: boolean
}

// Module-level broadcast so every mounted instance (top-nav switcher, a
// gallery, a settings page) tracks the same active style instead of each
// holding its own stale copy.
const listeners = new Set<(value: string) => void>()

function broadcast(value: string) {
	for (const listener of listeners) listener(value)
}

/**
 * The engine behind `StyleSwitcher`: applies `data-style` to `<html>`,
 * persists the choice in its own cookie (independent of the theme cookie),
 * announces changes with a toast, and keeps every mounted instance in sync.
 * Build a custom picker on top of it.
 */
export function useStyleSwitcher({
	styles,
	defaultStyle = Style.Soft,
	initialStyle,
	showToast = true,
}: UseStyleSwitcherOptions) {
	const [style, setStyleState] = React.useState(initialStyle || defaultStyle.toString())
	const [mounted, setMounted] = React.useState(Boolean(initialStyle))

	const apply = React.useCallback((value: string) => {
		document.documentElement.setAttribute('data-style', value)
	}, [])

	React.useEffect(() => {
		listeners.add(setStyleState)
		return () => {
			listeners.delete(setStyleState)
		}
	}, [])

	React.useEffect(() => {
		setMounted(true)
		if (!initialStyle) {
			const saved = getStyleFromCookie(defaultStyle)
			setStyleState(saved)
			apply(saved)
			return
		}
		apply(initialStyle)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultStyle, initialStyle])

	const setStyle = React.useCallback(
		(value: string, options?: { silent?: boolean }) => {
			setStyleState(value)
			broadcast(value)
			apply(value)
			setStyleCookie(value)
			if (showToast && !options?.silent) {
				const config = styles.find(s => s.value === value)
				if (config) {
					toast(`${config.label} style enabled`, {
						id: 'bz-style-toast',
						duration: 1500,
						position: 'top-center',
					})
				}
			}
		},
		[apply, styles, showToast]
	)

	const cycle = React.useCallback(() => {
		const index = styles.findIndex(s => s.value === style)
		const next = styles[(index + 1) % styles.length]?.value
		if (next) setStyle(next.toString())
	}, [style, styles, setStyle])

	return { style, mounted, setStyle, cycle }
}

"use client"
import { useHotkeys } from 'react-hotkeys-hook'

export interface HotkeyConfig {
	/** The key combination (e.g., 'ctrl+k', 'alt+t', 'enter', 'escape') */
	key: string
	/** The action to perform when the hotkey is pressed */
	action: () => void
	/** Optional description for the hotkey (useful for tooltips/help) */
	description?: string
	/** Whether the hotkey is enabled (default: true) */
	enabled?: boolean
	/** Prevent default browser behavior (default: true) */
	preventDefault?: boolean
}

/**
 * Simple, reusable hotkey hook that wraps react-hotkeys-hook
 * with consistent defaults and TypeScript support
 */
export function useHotkey(config: HotkeyConfig | HotkeyConfig[]) {
	const configs = Array.isArray(config) ? config : [config]
	
	configs.forEach(({ key, action, enabled = true, preventDefault = true }) => {
		useHotkeys(
			key,
			(event) => {
				if (preventDefault) {
					event.preventDefault()
				}
				action()
			},
			{
				enabled,
				preventDefault,
			}
		)
	})
}

/**
 * Utility to format hotkey for display (e.g., "Ctrl+K" instead of "ctrl+k")
 */
export function formatHotkey(key: string): string {
	return key
		.split('+')
		.map(part => {
			switch (part.toLowerCase()) {
				case 'ctrl': return 'Ctrl'
				case 'cmd': return 'Cmd'
				case 'alt': return 'Alt'
				case 'shift': return 'Shift'
				case 'meta': return 'Meta'
				case 'enter': return 'Enter'
				case 'escape': return 'Esc'
				case 'space': return 'Space'
				case 'tab': return 'Tab'
				case 'backspace': return 'Backspace'
				case 'delete': return 'Delete'
				default: return part.toUpperCase()
			}
		})
		.join('+')
}

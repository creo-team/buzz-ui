"use client"
import * as React from 'react'

export interface HotkeyConfig {
	/** The key combination (e.g. 'ctrl+k', 'mod+s', 'alt+t', 'enter', 'escape'). */
	key: string
	/** The action to perform when the hotkey is pressed. */
	action: () => void
	/** Optional description (useful for tooltips/help). */
	description?: string
	/** Whether the hotkey is enabled (default: true). */
	enabled?: boolean
	/** Prevent default browser behavior (default: true). */
	preventDefault?: boolean
	/**
	 * Fire even when focus is inside an input, textarea, select or
	 * contenteditable. Defaults to false for plain keys; combos that include
	 * ctrl/meta/alt always fire.
	 */
	enableOnFormTags?: boolean
}

interface ParsedCombo {
	key: string
	ctrl: boolean
	meta: boolean
	alt: boolean
	shift: boolean
	/** 'mod' was used — matches meta on macOS, ctrl elsewhere. */
	mod: boolean
}

export function isMacPlatform(): boolean {
	if (typeof navigator === 'undefined') return false
	return /mac|iphone|ipad|ipod/i.test(navigator.platform ?? '') || /mac/i.test(navigator.userAgent ?? '')
}

const KEY_ALIASES: Record<string, string> = {
	esc: 'escape',
	return: 'enter',
	spacebar: ' ',
	space: ' ',
	up: 'arrowup',
	down: 'arrowdown',
	left: 'arrowleft',
	right: 'arrowright',
}

function parseCombo(combo: string): ParsedCombo {
	const parts = combo.toLowerCase().split('+').map(p => p.trim())
	const parsed: ParsedCombo = { key: '', ctrl: false, meta: false, alt: false, shift: false, mod: false }
	for (const part of parts) {
		if (part === 'ctrl' || part === 'control') parsed.ctrl = true
		else if (part === 'meta' || part === 'cmd' || part === 'command') parsed.meta = true
		else if (part === 'alt' || part === 'option') parsed.alt = true
		else if (part === 'shift') parsed.shift = true
		else if (part === 'mod') parsed.mod = true
		else parsed.key = KEY_ALIASES[part] ?? part
	}
	return parsed
}

function comboMatches(parsed: ParsedCombo, event: KeyboardEvent): boolean {
	const isMac = isMacPlatform()
	const wantCtrl = parsed.ctrl || (parsed.mod && !isMac)
	const wantMeta = parsed.meta || (parsed.mod && isMac)
	if (event.ctrlKey !== wantCtrl) return false
	if (event.metaKey !== wantMeta) return false
	if (event.altKey !== parsed.alt) return false
	// Shift is required when declared. When not declared, still allow it for
	// single characters that may need shift to type (e.g. '?').
	if (parsed.shift && !event.shiftKey) return false
	if (!parsed.shift && event.shiftKey && parsed.key.length > 1) return false
	return event.key.toLowerCase() === parsed.key
}

function isEditableTarget(event: KeyboardEvent): boolean {
	const target = event.target as HTMLElement | null
	if (!target) return false
	const tag = target.tagName
	return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

/**
 * Registers one or many keyboard shortcuts. Safe for dynamic arrays — a
 * single event listener handles every config, so the rules of hooks hold no
 * matter how the config list changes between renders.
 *
 * Supports 'mod' (⌘ on macOS, Ctrl elsewhere): `useHotkey({ key: 'mod+k', action })`.
 */
export function useHotkey(config: HotkeyConfig | HotkeyConfig[]) {
	const configsRef = React.useRef<HotkeyConfig[]>([])
	configsRef.current = Array.isArray(config) ? config : [config]

	// Re-attach only when the set of active combos changes, not on every render.
	const signature = configsRef.current.map(c => `${c.key}:${c.enabled !== false}`).join('|')

	React.useEffect(() => {
		if (typeof document === 'undefined') return
		const anyEnabled = configsRef.current.some(c => c.enabled !== false)
		if (!anyEnabled) return

		const handler = (event: KeyboardEvent) => {
			for (const cfg of configsRef.current) {
				if (cfg.enabled === false) continue
				const parsed = parseCombo(cfg.key)
				if (!comboMatches(parsed, event)) continue
				const hasModifier = parsed.ctrl || parsed.meta || parsed.alt || parsed.mod
				if (!hasModifier && !cfg.enableOnFormTags && isEditableTarget(event)) continue
				if (cfg.preventDefault !== false) event.preventDefault()
				cfg.action()
			}
		}

		document.addEventListener('keydown', handler)
		return () => document.removeEventListener('keydown', handler)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [signature])
}

const FORMAT_LABELS: Record<string, string> = {
	ctrl: 'Ctrl',
	control: 'Ctrl',
	cmd: 'Cmd',
	command: 'Cmd',
	alt: 'Alt',
	option: 'Alt',
	shift: 'Shift',
	meta: 'Meta',
	enter: 'Enter',
	return: 'Enter',
	escape: 'Esc',
	esc: 'Esc',
	space: 'Space',
	tab: 'Tab',
	backspace: 'Backspace',
	delete: 'Delete',
	arrowup: '↑',
	arrowdown: '↓',
	arrowleft: '←',
	arrowright: '→',
}

/** Format a hotkey for display (e.g. "Ctrl+K" from "ctrl+k", "⌘" for mod on macOS). */
export function formatHotkey(key: string): string {
	return key
		.split('+')
		.map(part => {
			const lower = part.toLowerCase().trim()
			if (lower === 'mod') return isMacPlatform() ? '⌘' : 'Ctrl'
			return FORMAT_LABELS[lower] ?? part.toUpperCase()
		})
		.join('+')
}

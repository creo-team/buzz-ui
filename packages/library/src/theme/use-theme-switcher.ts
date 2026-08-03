"use client"
import * as React from 'react'
import { toast } from '../overlays/toast.js'
import { useHotkey } from '../hooks/use-hotkey.js'
import { setThemeCookie, getThemeFromCookie } from './theme-types.js'
import { applyThemeColors, type ThemeConfigWithPreset } from './theme-presets.js'
import {
	IconSun,
	IconMoon,
	IconPalette,
	IconTree,
	IconWaves,
	IconSparkles,
	type IconProps,
} from '../internal/icons.js'

export interface AnyThemeConfig {
	value: string
	label: string
	icon?: React.ComponentType<{ className?: string }> | string
	colors?: ThemeConfigWithPreset['colors']
}

export type ThemeIconComponent = React.ComponentType<IconProps>

const ICON_BY_NAME: Record<string, ThemeIconComponent> = {
	sun: IconSun,
	moon: IconMoon,
	palette: IconPalette,
	'tree-pine': IconTree,
	waves: IconWaves,
	sparkles: IconSparkles,
}

/** Infer a fitting icon from the theme's name when none is provided. */
export function smartThemeIcon(value: string, label: string): ThemeIconComponent {
	const haystack = `${value} ${label}`.toLowerCase()
	if (haystack.includes('light') || haystack.includes('day')) return IconSun
	if (haystack.includes('dark') || haystack.includes('night') || haystack.includes('midnight')) return IconMoon
	if (haystack.includes('forest') || haystack.includes('nature')) return IconTree
	if (haystack.includes('ocean') || haystack.includes('sea') || haystack.includes('water')) return IconWaves
	if (haystack.includes('umbro') || haystack.includes('premium')) return IconSparkles
	return IconPalette
}

export function resolveThemeIcon(config: AnyThemeConfig): ThemeIconComponent {
	if (config.icon) {
		if (typeof config.icon === 'string') return ICON_BY_NAME[config.icon] ?? IconPalette
		return config.icon as ThemeIconComponent
	}
	return smartThemeIcon(config.value, config.label)
}

function applyThemeToDom(value: string, allValues: string[], config?: AnyThemeConfig) {
	const root = document.documentElement
	for (const v of allValues) root.classList.remove(v)
	root.classList.add(value)
	root.setAttribute('data-theme', value)

	// Clear inline custom-color overrides so switching back to CSS-defined
	// themes never inherits stale values. (style can be absent in test mocks.)
	if (root.style) {
		const inlineProps = Array.from(root.style as ArrayLike<string>).filter(prop =>
			prop.startsWith('--c-')
		)
		for (const prop of inlineProps) root.style.removeProperty(prop)
		if (config?.colors) applyThemeColors(config as ThemeConfigWithPreset)
	}
}

export interface UseThemeSwitcherOptions {
	themes: AnyThemeConfig[]
	defaultTheme?: string
	/** Server-read theme for flicker-free SSR (pass from `getServerTheme`). */
	initialTheme?: string
	/** Register Alt+T to cycle themes. Default true. */
	enableHotkey?: boolean
	/** Announce changes with a toast. Default true. */
	showToast?: boolean
}

/**
 * Shared engine behind every theme switcher: SSR-safe mounting, cookie
 * persistence, DOM application (class + data-theme + custom palettes),
 * cycling, and the Alt+T hotkey.
 */
export function useThemeSwitcher({
	themes,
	defaultTheme = 'light',
	initialTheme,
	enableHotkey = true,
	showToast = true,
}: UseThemeSwitcherOptions) {
	const [theme, setThemeState] = React.useState(initialTheme || defaultTheme)
	const [mounted, setMounted] = React.useState(Boolean(initialTheme))

	const themesRef = React.useRef(themes)
	themesRef.current = themes

	const applyTheme = React.useCallback((value: string) => {
		const all = themesRef.current
		applyThemeToDom(
			value,
			all.map(t => t.value),
			all.find(t => t.value === value)
		)
	}, [])

	React.useEffect(() => {
		setMounted(true)
		if (!initialTheme) {
			const saved = getThemeFromCookie(defaultTheme)
			setThemeState(saved)
			applyTheme(saved)
			return
		}
		applyTheme(initialTheme)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultTheme, initialTheme])

	const announce = React.useCallback(
		(value: string) => {
			if (!showToast) return
			const config = themesRef.current.find(t => t.value === value)
			if (!config) return
			toast(`${config.label} mode enabled`, { id: 'bz-theme-toast', duration: 1500, position: 'top-center' })
		},
		[showToast]
	)

	const setTheme = React.useCallback(
		(value: string, options?: { silent?: boolean }) => {
			setThemeState(value)
			applyTheme(value)
			setThemeCookie(value)
			if (!options?.silent) announce(value)
		},
		[applyTheme, announce]
	)

	const cycle = React.useCallback(() => {
		const all = themesRef.current
		const index = all.findIndex(t => t.value === theme)
		const next = all[(index + 1) % all.length]?.value
		if (next) setTheme(next)
	}, [theme, setTheme])

	// Alt+T is global — when several switchers are mounted (e.g. header +
	// footer), only the first-registered instance owns the hotkey so a single
	// keypress cycles exactly once.
	const instanceId = React.useId()
	const [ownsHotkey, setOwnsHotkey] = React.useState(false)
	React.useEffect(() => {
		if (!enableHotkey) return
		hotkeyOwners.add(instanceId)
		const update = () => setOwnsHotkey(firstOwner() === instanceId)
		update()
		ownerListeners.add(update)
		return () => {
			hotkeyOwners.delete(instanceId)
			ownerListeners.delete(update)
			for (const listener of ownerListeners) listener()
		}
	}, [enableHotkey, instanceId])

	useHotkey({
		key: 'alt+t',
		action: cycle,
		enabled: enableHotkey && mounted && ownsHotkey,
		description: 'Cycle theme',
	})

	return { theme, mounted, setTheme, cycle }
}

const hotkeyOwners = new Set<string>()
const ownerListeners = new Set<() => void>()
function firstOwner(): string | undefined {
	return hotkeyOwners.values().next().value
}

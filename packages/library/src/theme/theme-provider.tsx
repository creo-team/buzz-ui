"use client"

import * as React from 'react'
import { THEME_COOKIE_NAME } from './theme-types.js'

export type Theme = string

export interface ThemeConfig {
	value: string
	label: string
	/** Component or built-in icon name ('sun', 'moon', 'palette', …). */
	icon: React.ComponentType<{ className?: string }> | string
}

export interface ThemeProviderProps {
	children: React.ReactNode
	defaultTheme?: string
	themes?: ThemeConfig[]
	disableTransitionOnChange?: boolean
}

interface ThemeProviderState {
	theme: Theme
	setTheme: (theme: Theme) => void
	resolvedTheme: Theme | undefined
	themes: ThemeConfig[]
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined)

function applyTheme(theme: Theme, availableThemes: string[]) {
	const root = document.documentElement
	for (const t of availableThemes) root.classList.remove(t)
	root.setAttribute('data-theme', theme)
	root.classList.add(theme)
}

/**
 * App-level theme context: applies the theme to `<html>` (class +
 * `data-theme`), persists it in a cookie, and exposes `useTheme()`.
 */
export function ThemeProvider({
	children,
	defaultTheme = 'light',
	themes = [],
	disableTransitionOnChange = false,
}: ThemeProviderProps) {
	const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
	const [resolvedTheme, setResolvedTheme] = React.useState<Theme>()

	// A stable signature avoids re-running the effect (or recreating the
	// context value below) when the caller passes a new array identity each
	// render with equivalent content. Icons may be components, so identity
	// is used for them rather than stringification.
	const themeValues = themes.map(t => t.value)
	const themeSignature = themeValues.join('|')
	const themesFingerprint = themes.map(t => `${t.value}:${t.label}:${typeof t.icon === 'string' ? t.icon : '#'}`).join('|')
	const iconIdentities = themes.map(t => (typeof t.icon === 'string' ? null : t.icon))

	React.useEffect(() => {
		applyTheme(theme, themeSignature ? themeSignature.split('|') : ['light', 'dark'])
		setResolvedTheme(theme)
	}, [theme, themeSignature])

	const setTheme = React.useCallback(
		(newTheme: Theme) => {
			if (disableTransitionOnChange) {
				document.documentElement.classList.add('bz-disable-transitions')
			}
			setThemeState(newTheme)
			document.cookie = `${THEME_COOKIE_NAME}=${newTheme};path=/;max-age=31536000;SameSite=Lax`
			if (disableTransitionOnChange) {
				requestAnimationFrame(() => {
					document.documentElement.classList.remove('bz-disable-transitions')
				})
			}
		},
		[disableTransitionOnChange]
	)

	// Keep the context value stable across renders even when the caller passes
	// a fresh `themes` array literal each time — but still pick up real
	// changes to labels or icons (a relabel or icon swap must not be dropped
	// forever just because the theme `value`s are unchanged).
	const themesRef = React.useRef(themes)
	const fingerprintRef = React.useRef(themesFingerprint)
	const iconIdentitiesRef = React.useRef(iconIdentities)
	const iconsChanged =
		iconIdentitiesRef.current.length !== iconIdentities.length ||
		iconIdentitiesRef.current.some((icon, i) => icon !== iconIdentities[i])
	if (fingerprintRef.current !== themesFingerprint || iconsChanged) {
		themesRef.current = themes
		fingerprintRef.current = themesFingerprint
		iconIdentitiesRef.current = iconIdentities
	}
	const stableThemes = themesRef.current

	const value = React.useMemo(
		() => ({ theme, setTheme, resolvedTheme: resolvedTheme ?? theme, themes: stableThemes }),
		[theme, setTheme, resolvedTheme, stableThemes]
	)

	return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
	const context = React.useContext(ThemeProviderContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

"use client"

import * as React from 'react'
import { THEME_COOKIE_NAME } from './theme-types.js'

export type Theme = string

export interface ThemeConfig {
	value: string
	label: string
	icon: React.ComponentType<{ className?: string }>
}

interface ThemeProviderProps {
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

	// A stable signature avoids re-running the effect when the caller passes a
	// new array identity each render.
	const themeValues = themes.map(t => t.value)
	const themeSignature = themeValues.join('|')

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

	const value = React.useMemo(
		() => ({ theme, setTheme, resolvedTheme: resolvedTheme ?? theme, themes }),
		[theme, setTheme, resolvedTheme, themes]
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

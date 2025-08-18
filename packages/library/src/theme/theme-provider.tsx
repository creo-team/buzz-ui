"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type Theme = string

export interface ThemeConfig {
	value: string
	label: string
	icon: React.ComponentType<{ className?: string }>
}

type ThemeProviderProps = {
	children: React.ReactNode
	defaultTheme?: string
	themes?: ThemeConfig[]
	disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
	theme: Theme
	setTheme: (theme: Theme) => void
	resolvedTheme: Theme | undefined
	themes: ThemeConfig[]
}

const initialState: ThemeProviderState = {
	theme: "light",
	setTheme: () => null,
	resolvedTheme: undefined,
	themes: [],
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Helper function to apply theme changes directly to the DOM
function applyTheme(theme: Theme, availableThemes: string[] = ["light", "dark"]): Theme {
	const root = document.documentElement
	
	// Remove all theme classes
	availableThemes.forEach(t => root.classList.remove(t))
	
	// Store theme in attribute for CSS selectors
	root.setAttribute("data-theme", theme)
	
	// Add the theme class
	root.classList.add(theme)
	return theme
}

export function ThemeProvider({
	children,
	defaultTheme = "light",
	themes = [],
	disableTransitionOnChange = false,
}: ThemeProviderProps) {
	// Initialize state from the defaultTheme prop
	const [theme, setThemeState] = useState<Theme>(defaultTheme)
	const [resolvedTheme, setResolvedTheme] = useState<Theme>()
	
	// Get available theme values for DOM cleanup
	const availableThemes = themes.map(t => t.value)
	
	// Update resolvedTheme whenever the theme changes or on initial mount
	useEffect(() => {
		// Apply theme on initial mount
		const initialResolvedTheme = applyTheme(theme, availableThemes)
		setResolvedTheme(initialResolvedTheme)
	}, [theme, availableThemes])
	
	// Function to handle theme changes triggered by user
	const setTheme = (newTheme: Theme) => {
		// Disable transitions temporarily if needed
		if (disableTransitionOnChange) {
			document.documentElement.classList.add("disable-transition")
		}
		
		// Apply the theme change directly to the DOM
		const newResolvedTheme = applyTheme(newTheme, availableThemes)
		
		// Update state to match DOM changes
		setThemeState(newTheme)
		setResolvedTheme(newResolvedTheme)
		
		// Store in cookie for persistence
		document.cookie = `theme=${newTheme};path=/;max-age=31536000;SameSite=Lax`
		
		// Re-enable transitions after a tiny delay
		if (disableTransitionOnChange) {
			setTimeout(() => {
				document.documentElement.classList.remove("disable-transition")
			}, 0)
		}
	}
	
	return (
		<ThemeProviderContext.Provider value={{
			theme,
			setTheme,
			resolvedTheme: resolvedTheme || theme,
			themes
		}}>
			{children}
		</ThemeProviderContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext)
	
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider")
	}
	
	return context
}


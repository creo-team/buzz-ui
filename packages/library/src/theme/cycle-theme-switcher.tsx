"use client"

import { useState, useEffect } from "react"
import { Tooltip } from "../overlays/tooltip"
import { Sun, Moon, Palette, TreePine, Waves, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import { useHotkey } from '../hooks/use-hotkey'
import { setThemeCookie, getThemeFromCookie } from './theme-types'
import { ThemeConfigWithPreset, applyThemeColors } from './theme-presets'

export interface CycleThemeConfig {
	value: string
	label: string
	icon?: React.ComponentType<{ className?: string }> | string // Optional for smart defaults
	colors?: any // For backward compatibility
}

interface CycleThemeSwitcherProps {
	themes?: (CycleThemeConfig | ThemeConfigWithPreset)[]
	defaultTheme?: string
	initialTheme?: string // For SSR - pass the theme from server-side cookie reading
	className?: string
	showTooltip?: boolean
	enableHotkey?: boolean
}

const defaultCycleThemes: CycleThemeConfig[] = [
	{ value: "light", label: "Light" }, // Will auto-detect sun icon
	{ value: "dark", label: "Dark" }, // Will auto-detect moon icon
	{ value: "midnight", label: "Midnight" }, // Will auto-detect moon icon
	{ value: "forest", label: "Forest" }, // Will auto-detect tree icon
	{ value: "ocean", label: "Ocean" }, // Will auto-detect waves icon
	{ value: "umbro", label: "Umbro" }, // Will auto-detect sparkles icon
]

export function CycleThemeSwitcher({ 
	themes = defaultCycleThemes,
	defaultTheme = "light",
	initialTheme,
	className = "",
	showTooltip = true,
	enableHotkey = true
}: CycleThemeSwitcherProps) {
	// Use initialTheme from SSR if provided, otherwise fallback to defaultTheme
	const [theme, setTheme] = useState<string>(initialTheme || defaultTheme)
	const [mounted, setMounted] = useState(Boolean(initialTheme)) // If we have initialTheme, we can render immediately
	
	// Smart icon detection based on theme name/value
	const getSmartIcon = (themeValue: string, themeLabel: string): React.ComponentType<{ className?: string }> => {
		const value = themeValue.toLowerCase()
		const label = themeLabel.toLowerCase()
		
		// Check for light themes
		if (value.includes('light') || label.includes('light')) return Sun
		
		// Check for dark themes
		if (value.includes('dark') || label.includes('dark') || 
			value.includes('night') || label.includes('night') ||
			value.includes('midnight') || label.includes('midnight')) return Moon
		
		// Check for specific theme types
		if (value.includes('forest') || label.includes('forest') || 
			value.includes('nature') || label.includes('nature')) return TreePine
		if (value.includes('ocean') || label.includes('ocean') || 
			value.includes('sea') || label.includes('sea') ||
			value.includes('water') || label.includes('water')) return Waves
		if (value.includes('umbro') || label.includes('umbro') ||
			value.includes('premium') || label.includes('premium')) return Sparkles
		
		// Default fallback
		return Palette
	}

	// Icon helper function with smart defaults
	const getIconComponent = (themeConfig: CycleThemeConfig): React.ComponentType<{ className?: string }> => {
		// If icon is explicitly provided, use it
		if (themeConfig.icon) {
			if (typeof themeConfig.icon === 'string') {
				switch (themeConfig.icon) {
					case 'sun': return Sun
					case 'moon': return Moon
					case 'palette': return Palette
					case 'tree-pine': return TreePine
					case 'waves': return Waves
					case 'sparkles': return Sparkles
					default: return Palette
				}
			}
			return themeConfig.icon
		}
		
		// If no icon provided, use smart detection
		return getSmartIcon(themeConfig.value, themeConfig.label)
	}

	// Handle SSR
	useEffect(() => {
		setMounted(true)
		
		// If no initialTheme was provided (not SSR), read from cookie
		if (!initialTheme) {
			const savedTheme = getThemeFromCookie(defaultTheme)
			
			if (savedTheme !== theme) {
				setTheme(savedTheme)
				applyTheme(savedTheme)
				return
			}
		}
		
		// Always apply the current theme on mount (in case server/client mismatch)
		applyTheme(theme)
	}, [defaultTheme, initialTheme])

	const applyTheme = (newTheme: string) => {
		const root = document.documentElement
		// Remove all possible theme classes
		themes.forEach(opt => root.classList.remove(opt.value))
		root.classList.add(newTheme)
		root.setAttribute('data-theme', newTheme)
		
		// Clear all custom CSS properties first to prevent conflicts
		const colorProps = [
			'--c-text', '--c-text-secondary', '--c-surface', '--c-surface-2', '--c-background',
			'--c-border', '--c-hover', '--c-primary', '--c-primary-light', '--c-primary-hover',
			'--c-success', '--c-warning', '--c-error', '--c-info'
		]
		colorProps.forEach(prop => root.style.removeProperty(prop))
		
		// Apply custom colors if theme has them
		const themeConfig = themes.find(t => t.value === newTheme)
		if (themeConfig && 'colors' in themeConfig && themeConfig.colors) {
			applyThemeColors(themeConfig as ThemeConfigWithPreset)
		}
	}

	const getNextTheme = () => {
		const idx = themes.findIndex(opt => opt.value === theme)
		return themes[(idx + 1) % themes.length].value
	}

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme)
		applyTheme(newTheme)
		setThemeCookie(newTheme)
		showToast(newTheme)
	}

	const handleCycle = () => {
		if (!mounted) return
		const nextTheme = getNextTheme()
		handleThemeChange(nextTheme)
	}

	const showToast = (themeValue: string) => {
		const option = themes.find(opt => opt.value === themeValue)
		if (option) {
			const Icon = getIconComponent(option)
			toast.success(
				<div className="flex items-center gap-2">
					<Icon className="h-4 w-4 text-[var(--c-primary)]" />
					<span>{option.label} mode enabled</span>
				</div>,
				{
					duration: 1500,
					position: "top-center",
					style: {
						background: 'var(--c-surface)',
						color: 'var(--c-text)',
						border: '1px solid var(--c-border)',
						fontSize: '0.875rem',
						maxWidth: '260px',
						padding: '0.625rem 0.75rem',
						borderRadius: '8px',
					},
				}
			)
		}
	}

	// Optional hotkey support
	if (enableHotkey) {
		useHotkey({
			key: 'alt+t',
			action: handleCycle,
			description: 'Cycle theme'
		})
	}

	// Only show loading state if we don't have initialTheme (non-SSR case)
	if (!mounted && !initialTheme) {
		return (
			<div className={`w-8 h-8 rounded-full backdrop-blur-md bg-[var(--c-surface)]/20 border border-[var(--c-border)]/30 ${className}`} />
		)
	}

	const currentThemeConfig = themes.find(t => t.value === theme) || themes[0]
	const CurrentIcon = getIconComponent(currentThemeConfig)
	const tooltipText = showTooltip 
		? `${currentThemeConfig.label}${enableHotkey ? ' (Alt+T)' : ''} - Click to cycle`
		: undefined

	const button = (
		<button
			onClick={handleCycle}
			className={`w-8 h-8 rounded-full backdrop-blur-md bg-[var(--c-surface)]/20 border border-[var(--c-border)]/30 flex items-center justify-center transition-colors text-[var(--c-text)] hover:bg-[var(--c-surface)]/40 ${className} ${!mounted ? 'cursor-default' : ''}`}
			aria-label={`Current theme: ${currentThemeConfig.label}. Click to cycle themes.`}
			disabled={!mounted}
		>
			<CurrentIcon className="h-4 w-4" />
		</button>
	)

	return showTooltip ? (
		<Tooltip content={tooltipText}>
			{button}
		</Tooltip>
	) : button
}

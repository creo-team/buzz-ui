"use client"

import { useState, useEffect } from "react"
import { Tooltip } from "../overlays/tooltip"
import { Sun, Moon, Palette } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useHotkey } from '../hooks/use-hotkey'
import { Theme, ThemeIcon, setThemeCookie, getThemeFromCookie } from './theme-types'

export interface ThemeConfig {
	value: string
	label: string
	icon: React.ComponentType<{ className?: string }> | string
}

interface ThemeSwitcherProps {
	themes?: ThemeConfig[]
	defaultTheme?: string
	initialTheme?: string // For SSR - pass the theme from server-side cookie reading
	className?: string
}

const defaultThemes: ThemeConfig[] = [
	{ value: "light", label: "Light", icon: "sun" },
	{ value: "dark", label: "Dark", icon: "moon" },
]

export function ThemeSwitcher({ 
	themes = defaultThemes, 
	defaultTheme = "light",
	initialTheme,
	className = ""
}: ThemeSwitcherProps) {
	const [theme, setTheme] = useState<string>(initialTheme || defaultTheme)
	const [mounted, setMounted] = useState(Boolean(initialTheme)) // If we have initialTheme, we can render immediately
	
	// Use provided themes or fallback to defaults, max 3 themes
	const allOptions = themes.length > 0 ? themes.slice(0, 3) : defaultThemes

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
		allOptions.forEach(opt => root.classList.remove(opt.value))
		root.classList.add(newTheme)
		root.setAttribute('data-theme', newTheme)
	}

	const getNextTheme = () => {
		const idx = allOptions.findIndex(opt => opt.value === theme)
		return allOptions[(idx + 1) % allOptions.length].value
	}

	const handleThemeChange = (clicked: string) => {
		if (theme === clicked) {
			// If clicking current theme, cycle to next
			const nextTheme = getNextTheme()
			setTheme(nextTheme)
			applyTheme(nextTheme)
			setThemeCookie(nextTheme)
			showToast(nextTheme)
		} else {
			// Switch to clicked theme
					setTheme(clicked)
		applyTheme(clicked)
		setThemeCookie(clicked) // Use enum-based cookie utility
		showToast(clicked)
		}
	}

	const getIconComponent = (icon: React.ComponentType<{ className?: string }> | string) => {
		if (typeof icon === 'string') {
			// Handle string icon names
			switch (icon) {
				case 'sun': return Sun
				case 'moon': return Moon
				case 'palette': return Palette
				default: return Sun
			}
		}
		return icon
	}

	const showToast = (themeValue: string) => {
		const option = allOptions.find(opt => opt.value === themeValue)
		if (option) {
			const Icon = getIconComponent(option.icon)
			toast.success(
				<div className="flex items-center gap-2">
					<Icon className="h-4 w-4" style={{ color: 'var(--c-primary)' }} />
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

	useHotkey({
		key: 'alt+t',
		action: () => {
			const nextTheme = getNextTheme()
			setTheme(nextTheme)
			applyTheme(nextTheme)
			setThemeCookie(nextTheme)
			showToast(nextTheme)
		},
		description: 'Toggle theme'
	})

	// Only show loading state if we don't have initialTheme (non-SSR case)
	if (!mounted && !initialTheme) {
		return (
			<div className={`relative flex items-center backdrop-blur-md bg-[var(--c-surface)]/20 border border-[var(--c-border)]/30 rounded-full p-1 ${className}`}>
				{allOptions.map((_, index) => (
					<div key={index} className="w-8 h-8" />
				))}
			</div>
		)
	}

	return (
		<div className={`relative flex items-center backdrop-blur-md bg-[var(--c-surface)]/20 border border-[var(--c-border)]/30 rounded-full p-1 ${className}`}>
			{allOptions.map((option) => {
				const Icon = getIconComponent(option.icon)
				const isActive = theme === option.value
				
				return (
					<div key={option.value} className="flex-1 relative">
						<Tooltip content={`${option.label} (Alt+T)`}>
							<button
								onClick={mounted ? () => handleThemeChange(option.value) : undefined}
								className={`w-8 h-8 rounded-full relative z-10 flex items-center justify-center transition-colors ${
									isActive ? 'text-[var(--c-text)]' : 'text-[var(--c-text-secondary)] hover:text-[var(--c-text)]'
								} ${!mounted ? 'cursor-default' : ''}`}
								aria-label={`Switch to ${option.value} theme`}
								disabled={!mounted}
							>
								{isActive && (
									<motion.div
										layoutId="theme-indicator"
										className="absolute inset-0 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)]/50"
										transition={{ type: "spring", stiffness: 300, damping: 30 }}
									/>
								)}
								<Icon className="h-4 w-4 relative z-10" />
							</button>
						</Tooltip>
					</div>
				)
			})}
		</div>
	)
}


"use client"

import { useState, useEffect, useRef } from "react"
import { Tooltip } from "../overlays/tooltip"
import { Sun, Moon, Palette, TreePine, Waves, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import { useHotkey } from '../hooks/use-hotkey'
import { Theme, ThemeIcon, setThemeCookie, getThemeFromCookie } from './theme-types'
import { ThemeConfigWithPreset, applyThemeColors } from './theme-presets'

export interface EnhancedThemeConfig {
	value: string
	label: string
	icon?: React.ComponentType<{ className?: string }> | string // Made optional for smart defaults
	colors?: any // For backward compatibility
}

interface EnhancedThemeSwitcherProps {
	primaryThemes?: (EnhancedThemeConfig | ThemeConfigWithPreset)[]
	allThemes?: (EnhancedThemeConfig | ThemeConfigWithPreset)[]
	defaultTheme?: string
	initialTheme?: string // For SSR - pass the theme from server-side cookie reading
	className?: string
	maxPrimaryThemes?: number
}

const defaultPrimaryThemes: EnhancedThemeConfig[] = [
	{ value: "light", label: "Light" }, // Will auto-detect sun icon
	{ value: "dark", label: "Dark" }, // Will auto-detect moon icon
]

const defaultAllThemes: EnhancedThemeConfig[] = [
	{ value: "light", label: "Light" }, // Will auto-detect sun icon
	{ value: "dark", label: "Dark" }, // Will auto-detect moon icon
	{ value: "midnight", label: "Midnight" }, // Will auto-detect moon icon
	{ value: "forest", label: "Forest" }, // Will auto-detect tree icon
	{ value: "ocean", label: "Ocean" }, // Will auto-detect waves icon
	{ value: "umbro", label: "Umbro" }, // Will auto-detect sparkles icon
]

export function EnhancedThemeSwitcher({ 
	primaryThemes = defaultPrimaryThemes,
	allThemes = defaultAllThemes,
	defaultTheme = "light",
	initialTheme,
	className = "",
	maxPrimaryThemes = 2
}: EnhancedThemeSwitcherProps) {
	// Use initialTheme from SSR if provided, otherwise fallback to defaultTheme
	const [theme, setTheme] = useState<string>(initialTheme || defaultTheme)
	const [mounted, setMounted] = useState(Boolean(initialTheme)) // If we have initialTheme, we can render immediately
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	
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
	const getIconComponent = (themeConfig: EnhancedThemeConfig): React.ComponentType<{ className?: string }> => {
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

	// Primary themes are shown as pills, additional themes in dropdown
	const primaryThemeOptions = primaryThemes.slice(0, maxPrimaryThemes)
	const additionalThemes = allThemes.filter(t => !primaryThemeOptions.find(p => p.value === t.value))
	const hasAdditionalThemes = additionalThemes.length > 0

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

	// Handle click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownOpen(false)
			}
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setDropdownOpen(false)
			}
		}

		if (dropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			document.addEventListener('keydown', handleEscape)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [dropdownOpen])

	const applyTheme = (newTheme: string) => {
		const root: any = document.documentElement
		// Remove all possible theme classes
		allThemes.forEach(opt => root.classList.remove(opt.value))
		root.classList.add(newTheme)
		root.setAttribute('data-theme', newTheme)
		
		// Clear all custom CSS properties first to prevent conflicts (guard style in tests)
		const colorProps = [
			'--c-text', '--c-text-secondary', '--c-surface', '--c-surface-2', '--c-background',
			'--c-border', '--c-hover', '--c-primary', '--c-primary-light', '--c-primary-hover',
			'--c-success', '--c-warning', '--c-error', '--c-info'
		]
		if (root && root.style) {
			colorProps.forEach((prop: string) => root.style.removeProperty(prop))
		}
		
		// Apply custom colors if theme has them
		const themeConfig = allThemes.find(t => t.value === newTheme)
		if (themeConfig && 'colors' in themeConfig && (themeConfig as any).colors) {
			applyThemeColors(themeConfig as ThemeConfigWithPreset)
		}
	}

	const getNextTheme = () => {
		const idx = allThemes.findIndex(opt => opt.value === theme)
		return allThemes[(idx + 1) % allThemes.length].value
	}

	const handleDropdownToggle = () => {
		setDropdownOpen(!dropdownOpen)
	}

	const handleThemeChange = (clicked: string) => {
		setTheme(clicked)
		applyTheme(clicked)
		setThemeCookie(clicked) // Use enum-based cookie utility
		showToast(clicked)
		setDropdownOpen(false) // Close dropdown after selection
	}

	const showToast = (themeValue: string) => {
		const option = allThemes.find(opt => opt.value === themeValue)
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

	useHotkey({
		key: 'alt+t',
		action: () => {
			const nextTheme = getNextTheme()
			handleThemeChange(nextTheme)
		},
		description: 'Toggle theme'
	})

	// Only show loading state if we don't have initialTheme (non-SSR case)
	if (!mounted && !initialTheme) {
		return (
			<div className={`relative flex items-center backdrop-blur-md bg-[var(--c-surface)]/20 border border-[var(--c-border)]/30 rounded-full p-1 ${className}`}>
				{primaryThemeOptions.map((_, index) => (
					<div key={index} className="w-8 h-8" />
				))}
				{hasAdditionalThemes && <div className="w-8 h-8" />}
			</div>
		)
	}

	return (
		<div className={`relative flex items-center backdrop-blur-md bg-[var(--c-surface)]/20 border border-[var(--c-border)]/30 rounded-full p-1 ${className}`}>
			{/* Primary theme buttons */}
			{primaryThemeOptions.map((option) => {
				const Icon = getIconComponent(option)
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
			
			{/* Additional themes dropdown */}
			{hasAdditionalThemes && mounted && (
				<div className="relative" style={{ isolation: 'isolate', zIndex: 999999 }} ref={dropdownRef}>
					<button
						onClick={handleDropdownToggle}
						className={`w-8 h-8 rounded-full relative z-10 flex items-center justify-center transition-colors ${
							additionalThemes.some(t => t.value === theme) 
								? 'text-[var(--c-text)]' 
								: 'text-[var(--c-text-secondary)] hover:text-[var(--c-text)]'
						}`}
						aria-label="More themes"
						title="More themes"
					>
						{additionalThemes.some(t => t.value === theme) && (
							<motion.div
								layoutId="theme-indicator"
								className="absolute inset-0 rounded-full bg-[var(--c-surface)] border border-[var(--c-border)]/50"
								transition={{ type: "spring", stiffness: 300, damping: 30 }}
							/>
						)}
						{(() => {
							// Show current theme's icon if it's in additional themes, otherwise show palette
							const currentTheme = additionalThemes.find(t => t.value === theme)
							if (currentTheme) {
								const CurrentIcon = getIconComponent(currentTheme)
								return <CurrentIcon className="h-4 w-4 relative z-10" />
							}
							return <Palette className="h-4 w-4 relative z-10" />
						})()}
					</button>

					<AnimatePresence>
						{dropdownOpen && (
							<motion.div
								initial={{ opacity: 0, y: -10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -10, scale: 0.95 }}
								transition={{ duration: 0.15 }}
								className="absolute right-0 top-full mt-2 min-w-[160px] rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]/95 backdrop-blur-md shadow-xl overflow-hidden"
								style={{ 
									zIndex: 999999, // Very high z-index within isolated stacking context
								}}
							>
								{additionalThemes.map((option) => {
									const Icon = getIconComponent(option)
									const isActive = theme === option.value
									
									return (
										<button
											key={option.value}
											onClick={() => handleThemeChange(option.value)}
											className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
												isActive 
													? 'bg-[var(--c-primary-light)] text-[var(--c-primary)]' 
													: 'text-[var(--c-text)] hover:bg-[var(--c-hover)]'
											}`}
										>
											<Icon className="h-4 w-4" />
											<span className="text-sm font-medium">{option.label}</span>
											{isActive && (
												<svg className="h-4 w-4 text-[var(--c-primary)] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
												</svg>
											)}
										</button>
									)
								})}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}
			
			{/* Loading state for dropdown */}
			{hasAdditionalThemes && !mounted && (
				<div className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--c-text-secondary)]">
					<Palette className="h-4 w-4" />
				</div>
			)}
		</div>
	)
}

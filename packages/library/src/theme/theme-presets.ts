/**
 * Theme Presets - Elegant enum-based theme system with customizable colors and labels
 * 
 * Usage:
 * ```tsx
 * import { ThemePreset, createThemeConfig } from '@creo-team/buzz-ui/client'
 * 
 * // Simple - use built-in everything
 * const themes = [ThemePreset.Light, ThemePreset.Dark, ThemePreset.Forest]
 * 
 * // Custom labels
 * const themes = [
 *   createThemeConfig(ThemePreset.Light, { label: "Day Mode" }),
 *   createThemeConfig(ThemePreset.Dark, { label: "Night Mode" })
 * ]
 * 
 * // Custom colors
 * const themes = [
 *   createThemeConfig(ThemePreset.Light, { 
 *     colors: { primary: "#ff6b35", surface: "#ffffff" }
 *   })
 * ]
 * ```
 */

export enum ThemePreset {
	Light = 'light',
	Dark = 'dark', 
	Midnight = 'midnight',
	Forest = 'forest',
	Ocean = 'ocean',
	Umbro = 'umbro',
}

/**
 * Color palette interface for theme customization
 */
export interface ThemeColorPalette {
	// Core colors
	text?: string
	textSecondary?: string
	textMuted?: string
	textInverse?: string
	
	// Surface hierarchy
	background?: string // Page background
	surface?: string // Card/panel background  
	surface2?: string // Secondary surfaces
	surface3?: string // Code blocks, tertiary surfaces
	surfaceOverlay?: string // Modal/dropdown overlays
	
	// Borders and dividers
	border?: string // Default borders
	borderStrong?: string // Emphasized borders
	borderSubtle?: string // Subtle borders
	divider?: string // Divider lines
	
	// Interactive states
	hover?: string // Hover backgrounds
	hoverBorder?: string // Hover borders
	active?: string // Active/pressed states
	selected?: string // Selected items
	focus?: string // Focus rings
	
	// Brand colors
	primary?: string
	primaryLight?: string // Light backgrounds
	primaryHover?: string
	primaryForeground?: string // Text on primary
	onPrimary?: string // Alias for primaryForeground
	primaryRing?: string // Focus rings
	
	// Semantic colors
	success?: string
	successLight?: string
	successHover?: string
	successForeground?: string
	
	warning?: string
	warningLight?: string
	warningHover?: string
	warningForeground?: string
	
	error?: string
	errorLight?: string
	errorHover?: string
	errorForeground?: string
	danger?: string // Alias for error
	dangerHover?: string
	
	info?: string
	infoLight?: string
	infoHover?: string
	infoForeground?: string
	
	// Component-specific
	tooltipBg?: string
	tooltipText?: string
	tooltipBorder?: string
	
	modalBg?: string
	modalOverlay?: string
	modalBorder?: string
	
	dropdownBg?: string
	dropdownBorder?: string
	dropdownHover?: string
	
	codeBlockBg?: string
	codeBlockBorder?: string
	codeBlockText?: string
	codeBlockLineNumber?: string
	
	// Shadows (not colors but often themed)
	shadowSm?: string
	shadowMd?: string
	shadowLg?: string
	shadowXl?: string
	
	// Radius values (often themed)
	radiusSm?: string
	radiusMd?: string
	radiusLg?: string
	radiusXl?: string
}

/**
 * Theme configuration with preset support
 */
export interface ThemeConfigWithPreset {
	value: string
	label: string
	icon?: React.ComponentType<{ className?: string }> | string
	colors?: ThemeColorPalette
}

/**
 * Built-in theme metadata and default color palettes
 */
export const THEME_PRESETS = {
	[ThemePreset.Light]: {
		label: 'Light',
		icon: 'sun',
		colors: {
			// Core text colors
			text: '#1f2937',
			textSecondary: '#6b7280',
			textMuted: '#9ca3af',
			textInverse: '#ffffff',
			
			// Surface hierarchy
			background: '#ffffff',
			surface: '#ffffff',
			surface2: '#f9fafb',
			surface3: '#f3f4f6',
			surfaceOverlay: 'rgba(255, 255, 255, 0.95)',
			
			// Borders and dividers
			border: '#e5e7eb',
			borderStrong: '#d1d5db',
			borderSubtle: '#f3f4f6',
			divider: '#e5e7eb',
			
			// Interactive states
			hover: 'rgba(0, 0, 0, 0.04)',
			hoverBorder: '#d1d5db',
			active: 'rgba(0, 0, 0, 0.08)',
			selected: '#f0f9ff',
			focus: 'rgba(59, 130, 246, 0.5)',
			
			// Brand colors
			primary: '#dc2626',
			primaryLight: '#fef2f2',
			primaryHover: '#b91c1c',
			primaryForeground: '#ffffff',
			onPrimary: '#ffffff',
			primaryRing: 'rgba(220, 38, 38, 0.2)',
			
			// Semantic colors
			success: '#059669',
			successLight: '#f0fdf4',
			successHover: '#059669',
			successForeground: '#ffffff',
			
			warning: '#d97706',
			warningLight: '#fffbeb',
			warningHover: '#d97706',
			warningForeground: '#ffffff',
			
			error: '#dc2626',
			errorLight: '#fef2f2',
			errorHover: '#dc2626',
			errorForeground: '#ffffff',
			danger: '#dc2626',
			dangerHover: '#dc2626',
			
			info: '#2563eb',
			infoLight: '#eff6ff',
			infoHover: '#2563eb',
			infoForeground: '#ffffff',
			
			// Component-specific
			tooltipBg: '#1f2937',
			tooltipText: '#f9fafb',
			tooltipBorder: 'rgba(31, 41, 55, 0.1)',
			
			modalBg: '#ffffff',
			modalOverlay: 'rgba(0, 0, 0, 0.5)',
			modalBorder: '#e5e7eb',
			
			dropdownBg: '#ffffff',
			dropdownBorder: '#e5e7eb',
			dropdownHover: '#f3f4f6',
			
			codeBlockBg: '#1e293b',
			codeBlockBorder: '#334155',
			codeBlockText: '#e2e8f0',
			codeBlockLineNumber: '#64748b',
			
			// Shadows
			shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
			shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
			shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
			shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
			
			// Radius values
			radiusSm: '0.25rem',
			radiusMd: '0.375rem',
			radiusLg: '0.5rem',
			radiusXl: '0.75rem',
		}
	},
	[ThemePreset.Dark]: {
		label: 'Dark',
		icon: 'moon',
		colors: {
			// Core text colors
			text: '#f9fafb',
			textSecondary: '#d1d5db',
			textMuted: '#9ca3af',
			textInverse: '#111827',
			
			// Surface hierarchy
			background: '#0f172a',
			surface: '#111827',
			surface2: '#1f2937',
			surface3: '#374151',
			surfaceOverlay: 'rgba(17, 24, 39, 0.95)',
			
			// Borders and dividers
			border: '#374151',
			borderStrong: '#4b5563',
			borderSubtle: '#1f2937',
			divider: '#374151',
			
			// Interactive states
			hover: 'rgba(255, 255, 255, 0.05)',
			hoverBorder: '#4b5563',
			active: 'rgba(255, 255, 255, 0.1)',
			selected: '#1e293b',
			focus: 'rgba(59, 130, 246, 0.5)',
			
			// Brand colors
			primary: '#ef4444',
			primaryLight: 'rgba(239, 68, 68, 0.1)',
			primaryHover: '#dc2626',
			primaryForeground: '#ffffff',
			onPrimary: '#ffffff',
			primaryRing: 'rgba(239, 68, 68, 0.3)',
			
			// Semantic colors
			success: '#10b981',
			successLight: 'rgba(16, 185, 129, 0.1)',
			successHover: '#10b981',
			successForeground: '#111827',
			
			warning: '#f59e0b',
			warningLight: 'rgba(245, 158, 11, 0.1)',
			warningHover: '#f59e0b',
			warningForeground: '#111827',
			
			error: '#ef4444',
			errorLight: 'rgba(239, 68, 68, 0.1)',
			errorHover: '#ef4444',
			errorForeground: '#111827',
			danger: '#ef4444',
			dangerHover: '#ef4444',
			
			info: '#3b82f6',
			infoLight: 'rgba(59, 130, 246, 0.1)',
			infoHover: '#3b82f6',
			infoForeground: '#111827',
			
			// Component-specific
			tooltipBg: '#f9fafb',
			tooltipText: '#111827',
			tooltipBorder: 'rgba(249, 250, 251, 0.1)',
			
			modalBg: '#111827',
			modalOverlay: 'rgba(0, 0, 0, 0.7)',
			modalBorder: '#374151',
			
			dropdownBg: '#111827',
			dropdownBorder: '#374151',
			dropdownHover: '#1f2937',
			
			codeBlockBg: '#0f172a',
			codeBlockBorder: '#1e293b',
			codeBlockText: '#e2e8f0',
			codeBlockLineNumber: '#64748b',
			
			// Shadows
			shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
			shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
			shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.4)',
			shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
			
			// Radius values
			radiusSm: '0.25rem',
			radiusMd: '0.375rem',
			radiusLg: '0.5rem',
			radiusXl: '0.75rem',
		}
	},
	[ThemePreset.Midnight]: {
		label: 'Midnight',
		icon: 'moon',
		colors: {
			// Core text colors
			text: '#e2e8f0',
			textSecondary: '#cbd5e1',
			textMuted: '#94a3b8',
			textInverse: '#0f172a',
			
			// Surface hierarchy
			background: '#020617',
			surface: '#0f172a',
			surface2: '#1e293b',
			surface3: '#334155',
			surfaceOverlay: 'rgba(15, 23, 42, 0.95)',
			
			// Borders and dividers
			border: '#334155',
			borderStrong: '#475569',
			borderSubtle: '#1e293b',
			divider: '#334155',
			
			// Interactive states
			hover: 'rgba(255, 255, 255, 0.05)',
			hoverBorder: '#475569',
			active: 'rgba(255, 255, 255, 0.1)',
			selected: '#1e1b4b',
			focus: 'rgba(99, 102, 241, 0.5)',
			
			// Brand colors
			primary: '#6366f1',
			primaryLight: 'rgba(99, 102, 241, 0.1)',
			primaryHover: '#4f46e5',
			primaryForeground: '#ffffff',
			onPrimary: '#ffffff',
			primaryRing: 'rgba(99, 102, 241, 0.3)',
			
			// Semantic colors
			success: '#22c55e',
			successLight: 'rgba(34, 197, 94, 0.1)',
			successHover: '#06b6d4',
			successForeground: '#0f172a',
			
			warning: '#f59e0b',
			warningLight: 'rgba(245, 158, 11, 0.1)',
			warningHover: '#d97706',
			warningForeground: '#0f172a',
			
			error: '#ef4444',
			errorLight: 'rgba(239, 68, 68, 0.1)',
			errorHover: '#ec4899',
			errorForeground: '#0f172a',
			danger: '#ef4444',
			dangerHover: '#ec4899',
			
			info: '#06b6d4',
			infoLight: 'rgba(6, 182, 212, 0.1)',
			infoHover: '#7c3aed',
			infoForeground: '#ffffff',
			
			// Component-specific
			tooltipBg: '#e2e8f0',
			tooltipText: '#0f172a',
			tooltipBorder: 'rgba(226, 232, 240, 0.1)',
			
			modalBg: '#0f172a',
			modalOverlay: 'rgba(0, 0, 0, 0.8)',
			modalBorder: '#334155',
			
			dropdownBg: '#0f172a',
			dropdownBorder: '#334155',
			dropdownHover: '#1e293b',
			
			codeBlockBg: '#020617',
			codeBlockBorder: '#1e293b',
			codeBlockText: '#e2e8f0',
			codeBlockLineNumber: '#475569',
			
			// Shadows
			shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
			shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
			shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
			shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.6)',
			
			// Radius values
			radiusSm: '0.25rem',
			radiusMd: '0.375rem',
			radiusLg: '0.5rem',
			radiusXl: '0.75rem',
		}
	},
	[ThemePreset.Forest]: {
		label: 'Forest',
		icon: 'tree-pine',
		colors: {
			// Core text colors
			text: '#14532d',
			textSecondary: '#166534',
			textMuted: '#4d7c5f',
			textInverse: '#ffffff',
			
			// Surface hierarchy
			background: '#fefffe',
			surface: '#ffffff',
			surface2: '#f7fee7',
			surface3: '#ecfccb',
			surfaceOverlay: 'rgba(240, 253, 244, 0.95)',
			
			// Borders and dividers
			border: '#bbf7d0',
			borderStrong: '#86efac',
			borderSubtle: '#dcfce7',
			divider: '#bbf7d0',
			
			// Interactive states
			hover: 'rgba(34, 197, 94, 0.04)',
			hoverBorder: '#86efac',
			active: 'rgba(34, 197, 94, 0.08)',
			selected: '#dcfce7',
			focus: 'rgba(34, 197, 94, 0.5)',
			
			// Brand colors
			primary: '#059669',
			primaryLight: '#f0fdf4',
			primaryHover: '#047857',
			primaryForeground: '#ffffff',
			onPrimary: '#ffffff',
			primaryRing: 'rgba(5, 150, 105, 0.2)',
			
			// Semantic colors
			success: '#059669',
			successLight: '#f0fdf4',
			successHover: '#16a34a',
			successForeground: '#ffffff',
			
			warning: '#d97706',
			warningLight: '#fffbeb',
			warningHover: '#ca8a04',
			warningForeground: '#ffffff',
			
			error: '#dc2626',
			errorLight: '#fef2f2',
			errorHover: '#dc2626',
			errorForeground: '#ffffff',
			danger: '#dc2626',
			dangerHover: '#dc2626',
			
			info: '#0891b2',
			infoLight: '#f0f9ff',
			infoHover: '#0891b2',
			infoForeground: '#ffffff',
			
			// Component-specific
			tooltipBg: '#15803d',
			tooltipText: '#ffffff',
			tooltipBorder: 'rgba(21, 128, 61, 0.2)',
			
			modalBg: '#f0fdf4',
			modalOverlay: 'rgba(0, 0, 0, 0.4)',
			modalBorder: '#bbf7d0',
			
			dropdownBg: '#f0fdf4',
			dropdownBorder: '#bbf7d0',
			dropdownHover: '#dcfce7',
			
			codeBlockBg: '#1e293b',
			codeBlockBorder: '#334155',
			codeBlockText: '#e2e8f0',
			codeBlockLineNumber: '#64748b',
			
			// Shadows
			shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
			shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
			shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
			shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
			
			// Radius values
			radiusSm: '0.25rem',
			radiusMd: '0.375rem',
			radiusLg: '0.5rem',
			radiusXl: '0.75rem',
		}
	},
	[ThemePreset.Ocean]: {
		label: 'Ocean',
		icon: 'waves',
		colors: {
			// Core text colors
			text: '#f8fafc',
			textSecondary: '#e2e8f0',
			textMuted: '#94a3b8',
			textInverse: '#082f49',
			
			// Surface hierarchy
			background: '#082f49',
			surface: '#0c4a6e',
			surface2: '#075985',
			surface3: '#0369a1',
			surfaceOverlay: 'rgba(12, 74, 110, 0.95)',
			
			// Borders and dividers
			border: '#0369a1',
			borderStrong: '#0284c7',
			borderSubtle: '#075985',
			divider: '#075985',
			
			// Interactive states
			hover: 'rgba(255, 255, 255, 0.05)',
			hoverBorder: '#0284c7',
			active: 'rgba(255, 255, 255, 0.1)',
			selected: 'rgba(14, 165, 233, 0.15)',
			focus: 'rgba(14, 165, 233, 0.5)',
			
			// Brand colors
			primary: '#0ea5e9',
			primaryLight: 'rgba(14, 165, 233, 0.1)',
			primaryHover: '#0284c7',
			primaryForeground: '#ffffff',
			onPrimary: '#ffffff',
			primaryRing: 'rgba(14, 165, 233, 0.3)',
			
			// Semantic colors
			success: '#22c55e',
			successLight: 'rgba(34, 197, 94, 0.1)',
			successHover: '#059669',
			successForeground: '#ffffff',
			
			warning: '#f59e0b',
			warningLight: 'rgba(245, 158, 11, 0.1)',
			warningHover: '#d97706',
			warningForeground: '#ffffff',
			
			error: '#ef4444',
			errorLight: 'rgba(239, 68, 68, 0.1)',
			errorHover: '#dc2626',
			errorForeground: '#ffffff',
			danger: '#ef4444',
			dangerHover: '#dc2626',
			
			info: '#06b6d4',
			infoLight: 'rgba(6, 182, 212, 0.1)',
			infoHover: '#0891b2',
			infoForeground: '#ffffff',
			
			// Component-specific
			tooltipBg: '#0369a1',
			tooltipText: '#ffffff',
			tooltipBorder: 'rgba(3, 105, 161, 0.2)',
			
			modalBg: '#0c4a6e',
			modalOverlay: 'rgba(0, 0, 0, 0.4)',
			modalBorder: '#0369a1',
			
			dropdownBg: '#0c4a6e',
			dropdownBorder: '#0369a1',
			dropdownHover: '#075985',
			
			codeBlockBg: '#1e293b',
			codeBlockBorder: '#334155',
			codeBlockText: '#e2e8f0',
			codeBlockLineNumber: '#64748b',
			
			// Shadows
			shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
			shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
			shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
			shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
			
			// Radius values
			radiusSm: '0.25rem',
			radiusMd: '0.375rem',
			radiusLg: '0.5rem',
			radiusXl: '0.75rem',
		}
	},
	[ThemePreset.Umbro]: {
		label: 'Umbro',
		icon: 'sparkles',
		colors: {
			// Core text colors
			text: '#ffffff',
			textSecondary: '#cbd5e1',
			textMuted: '#a0aec0',
			textInverse: '#111827',
			
			// Surface hierarchy
			background: '#0f0f23',
			surface: '#1a1b3e',
			surface2: 'rgba(26, 27, 62, 0.8)',
			surface3: '#2d3748',
			surfaceOverlay: 'rgba(17, 24, 39, 0.98)',
			
			// Borders and dividers
			border: '#2d3748',
			borderStrong: '#4a5568',
			borderSubtle: 'rgba(55, 65, 81, 0.2)',
			divider: 'rgba(75, 85, 99, 0.3)',
			
			// Interactive states
			hover: 'rgba(255, 255, 255, 0.08)',
			hoverBorder: 'rgba(107, 114, 128, 0.5)',
			active: 'rgba(255, 255, 255, 0.12)',
			selected: 'rgba(139, 92, 246, 0.1)',
			focus: 'rgba(168, 85, 247, 0.5)',
			
			// Brand colors
			primary: '#a855f7',
			primaryLight: 'rgba(168, 85, 247, 0.1)',
			primaryHover: '#9333ea',
			primaryForeground: '#ffffff',
			onPrimary: '#ffffff',
			primaryRing: 'rgba(168, 85, 247, 0.3)',
			
			// Semantic colors
			success: '#10b981',
			successLight: 'rgba(16, 185, 129, 0.1)',
			successHover: '#10b981',
			successForeground: '#111827',
			
			warning: '#f59e0b',
			warningLight: 'rgba(245, 158, 11, 0.1)',
			warningHover: '#f59e0b',
			warningForeground: '#111827',
			
			error: '#ef4444',
			errorLight: 'rgba(239, 68, 68, 0.1)',
			errorHover: '#ef4444',
			errorForeground: '#111827',
			danger: '#ef4444',
			dangerHover: '#ef4444',
			
			info: '#06b6d4',
			infoLight: 'rgba(6, 182, 212, 0.1)',
			infoHover: '#3b82f6',
			infoForeground: '#111827',
			
			// Component-specific
			tooltipBg: 'rgba(229, 231, 235, 0.95)',
			tooltipText: '#111827',
			tooltipBorder: 'rgba(229, 231, 235, 0.1)',
			
			modalBg: 'rgba(17, 24, 39, 0.95)',
			modalOverlay: 'rgba(0, 0, 0, 0.8)',
			modalBorder: 'rgba(75, 85, 99, 0.3)',
			
			dropdownBg: 'rgba(17, 24, 39, 0.95)',
			dropdownBorder: 'rgba(75, 85, 99, 0.3)',
			dropdownHover: 'rgba(55, 65, 81, 0.5)',
			
			codeBlockBg: 'rgba(15, 23, 42, 0.98)',
			codeBlockBorder: 'rgba(55, 65, 81, 0.3)',
			codeBlockText: '#e2e8f0',
			codeBlockLineNumber: '#64748b',
			
			// Shadows
			shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
			shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
			shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
			shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.6)',
			
			// Radius values
			radiusSm: '0.25rem',
			radiusMd: '0.375rem',
			radiusLg: '0.5rem',
			radiusXl: '0.75rem',
		}
	},
} as const

/**
 * Create a theme configuration from a preset with optional overrides
 */
export function createThemeConfig(
	preset: ThemePreset, 
	overrides?: {
		label?: string
		icon?: React.ComponentType<{ className?: string }> | string
		colors?: Partial<ThemeColorPalette>
	}
): ThemeConfigWithPreset {
	const presetData = THEME_PRESETS[preset]
	
	return {
		value: preset,
		label: overrides?.label || presetData.label,
		icon: overrides?.icon || presetData.icon,
		colors: overrides?.colors ? { ...presetData.colors, ...overrides.colors } : presetData.colors,
	}
}

/**
 * Generate CSS custom properties for a theme
 */
export function generateThemeCSS(theme: ThemeConfigWithPreset): string {
	if (!theme.colors) return ''
	
	const cssVars = Object.entries(theme.colors)
		.map(([key, value]) => `  --c-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
		.join('\n')
	
	return `html[data-theme="${theme.value}"] {\n${cssVars}\n}`
}

/**
 * Apply theme colors directly to DOM (for runtime theme switching)
 */
export function applyThemeColors(theme: ThemeConfigWithPreset): void {
	if (!theme.colors) return
	
	const root = document.documentElement
	Object.entries(theme.colors).forEach(([key, value]) => {
		const cssVar = `--c-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
		root.style.setProperty(cssVar, value)
	})
}

/**
 * Convenience function to create all standard themes
 */
export function createStandardThemes(overrides?: Partial<Record<ThemePreset, {
	label?: string
	icon?: React.ComponentType<{ className?: string }> | string
	colors?: Partial<ThemeColorPalette>
}>>): ThemeConfigWithPreset[] {
	return Object.values(ThemePreset).map(preset => 
		createThemeConfig(preset, overrides?.[preset])
	)
}

/**
 * Convenience function to create light/dark pair
 */
export function createLightDarkThemes(overrides?: {
	light?: { label?: string; colors?: Partial<ThemeColorPalette> }
	dark?: { label?: string; colors?: Partial<ThemeColorPalette> }
}): ThemeConfigWithPreset[] {
	return [
		createThemeConfig(ThemePreset.Light, overrides?.light),
		createThemeConfig(ThemePreset.Dark, overrides?.dark),
	]
}

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
	surface?: string
	surface2?: string
	background?: string
	border?: string
	hover?: string
	
	// Brand colors
	primary?: string
	primaryLight?: string
	primaryHover?: string
	
	// Semantic colors
	success?: string
	warning?: string
	error?: string
	info?: string
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
			text: '#1f2937',
			textSecondary: '#6b7280',
			surface: '#ffffff',
			surface2: '#f9fafb',
			background: '#ffffff',
			border: '#e5e7eb',
			hover: '#f3f4f6',
			primary: '#dc2626',
			primaryLight: '#fef2f2',
			primaryHover: '#b91c1c',
			success: '#10b981',
			warning: '#f59e0b',
			error: '#ef4444',
			info: '#3b82f6',
		}
	},
	[ThemePreset.Dark]: {
		label: 'Dark',
		icon: 'moon',
		colors: {
			text: '#f9fafb',
			textSecondary: '#d1d5db',
			surface: '#111827',
			surface2: '#1f2937',
			background: '#0f172a',
			border: '#374151',
			hover: '#374151',
			primary: '#ef4444',
			primaryLight: '#1f2937',
			primaryHover: '#dc2626',
			success: '#34d399',
			warning: '#fbbf24',
			error: '#f87171',
			info: '#60a5fa',
		}
	},
	[ThemePreset.Midnight]: {
		label: 'Midnight',
		icon: 'moon',
		colors: {
			text: '#e2e8f0',
			textSecondary: '#94a3b8',
			surface: '#0f172a',
			surface2: '#1e293b',
			background: '#020617',
			border: '#334155',
			hover: '#334155',
			primary: '#6366f1',
			primaryLight: '#1e1b4b',
			primaryHover: '#4f46e5',
			success: '#22d3ee',
			warning: '#f59e0b',
			error: '#f472b6',
			info: '#8b5cf6',
		}
	},
	[ThemePreset.Forest]: {
		label: 'Forest',
		icon: 'tree-pine',
		colors: {
			text: '#1f2937',
			textSecondary: '#6b7280',
			surface: '#f0fdf4',
			surface2: '#dcfce7',
			background: '#ecfdf5',
			border: '#bbf7d0',
			hover: '#d1fae5',
			primary: '#16a34a',
			primaryLight: '#f0fdf4',
			primaryHover: '#15803d',
			success: '#22c55e',
			warning: '#eab308',
			error: '#ef4444',
			info: '#06b6d4',
		}
	},
	[ThemePreset.Ocean]: {
		label: 'Ocean',
		icon: 'waves',
		colors: {
			text: '#1e293b',
			textSecondary: '#64748b',
			surface: '#f0f9ff',
			surface2: '#e0f2fe',
			background: '#f8fafc',
			border: '#bae6fd',
			hover: '#e0f2fe',
			primary: '#0284c7',
			primaryLight: '#f0f9ff',
			primaryHover: '#0369a1',
			success: '#10b981',
			warning: '#f59e0b',
			error: '#ef4444',
			info: '#06b6d4',
		}
	},
	[ThemePreset.Umbro]: {
		label: 'Umbro',
		icon: 'sparkles',
		colors: {
			text: '#e5e7eb',
			textSecondary: '#9ca3af',
			surface: 'rgba(17, 24, 39, 0.8)',
			surface2: 'rgba(31, 41, 55, 0.9)',
			background: 'rgba(15, 23, 42, 0.95)',
			border: 'rgba(75, 85, 99, 0.3)',
			hover: 'rgba(55, 65, 81, 0.5)',
			primary: '#8b5cf6',
			primaryLight: 'rgba(139, 92, 246, 0.1)',
			primaryHover: '#7c3aed',
			success: '#34d399',
			warning: '#fbbf24',
			error: '#f87171',
			info: '#60a5fa',
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

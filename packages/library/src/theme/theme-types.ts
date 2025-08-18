/**
 * Built-in theme values
 * Use these enum values for type safety and consistency
 */
export enum Theme {
	Light = 'light',
	Dark = 'dark',
	Midnight = 'midnight',
	Forest = 'forest',
	Ocean = 'ocean',
	Umbro = 'umbro',
}

/**
 * Built-in theme icon names
 * Maps to Lucide React icons
 */
export enum ThemeIcon {
	Sun = 'sun',
	Moon = 'moon',
	Palette = 'palette',
	TreePine = 'tree-pine',
	Waves = 'waves',
	Sparkles = 'sparkles',
}

/**
 * Theme configuration interface with enum support
 */
export interface ThemeConfig {
	value: Theme | string
	label: string
	icon: ThemeIcon | string | React.ComponentType<{ className?: string }>
}

/**
 * Default theme configurations using string literals
 */
export const DEFAULT_THEMES: ThemeConfig[] = [
	{ value: 'light', label: 'Light', icon: 'sun' },
	{ value: 'dark', label: 'Dark', icon: 'moon' },
]

export const ALL_THEMES: ThemeConfig[] = [
	{ value: 'light', label: 'Light', icon: 'sun' },
	{ value: 'dark', label: 'Dark', icon: 'moon' },
	{ value: 'midnight', label: 'Midnight', icon: 'palette' },
	{ value: 'forest', label: 'Forest', icon: 'tree-pine' },
	{ value: 'ocean', label: 'Ocean', icon: 'waves' },
	{ value: 'umbro', label: 'Umbro', icon: 'sparkles' },
]

/**
 * Cookie utilities with enum support
 */
export const THEME_COOKIE_NAME = 'theme'

export function setThemeCookie(theme: Theme | string): void {
	document.cookie = `${THEME_COOKIE_NAME}=${theme};path=/;max-age=31536000;SameSite=Lax`
}

export function getThemeFromCookie(defaultTheme: Theme | string = "light"): string {
	if (typeof document === 'undefined') return defaultTheme.toString()
	
	const savedTheme = document.cookie
		.split('; ')
		.find(row => row.startsWith(`${THEME_COOKIE_NAME}=`))
		?.split('=')[1]
	
	return savedTheme || defaultTheme.toString()
}

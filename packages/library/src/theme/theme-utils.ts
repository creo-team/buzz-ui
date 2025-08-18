import { Theme, THEME_COOKIE_NAME } from './theme-types'

/**
 * Server-side utility to get the current theme from cookies
 * Use this in server components and layouts to pass initialTheme to theme switchers
 */
export function getServerTheme(defaultTheme: Theme | string = "light"): string {
	try {
		// Dynamic import to avoid bundling next/headers in client
		const { cookies } = require('next/headers')
		const cookieStore = cookies()
		const themeCookie = cookieStore.get(THEME_COOKIE_NAME)
		return themeCookie?.value || defaultTheme.toString()
	} catch (error) {
		// Fallback if cookies() is not available (e.g., in static generation or client-side)
		return defaultTheme.toString()
	}
}

/**
 * Client-side utility to get the current theme from cookies
 * Use this in client components when server-side reading isn't available
 * @deprecated Use getThemeFromCookie from theme-types instead
 */
export function getClientTheme(defaultTheme: Theme | string = "light"): string {
	if (typeof document === 'undefined') return defaultTheme.toString()
	
	const savedTheme = document.cookie
		.split('; ')
		.find(row => row.startsWith(`${THEME_COOKIE_NAME}=`))
		?.split('=')[1]
	
	return savedTheme || defaultTheme.toString()
}

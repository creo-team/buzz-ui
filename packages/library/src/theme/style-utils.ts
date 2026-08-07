import { Style, STYLE_COOKIE_NAME } from './style-types.js'
import type { ThemeCookieSource } from './theme-utils.js'

function readFromSource(source: ThemeCookieSource): string | undefined {
	if (typeof source === 'string') {
		const match = source.split('; ').find(part => part.startsWith(`${STYLE_COOKIE_NAME}=`))
		return match?.split('=')[1] || undefined
	}
	const entry = source.get(STYLE_COOKIE_NAME)
	if (entry == null) return undefined
	return typeof entry === 'string' ? entry : entry.value
}

/**
 * Read the persisted style on the server. Accepts a Next.js `cookies()`
 * store or a raw `Cookie` header string — same contract as `getServerTheme`,
 * including the bare-default overload: a plain string without `=` is treated
 * as the default style, not a Cookie header (`getServerStyle('glass')`).
 */
export function getServerStyle(
	sourceOrDefault?: ThemeCookieSource | Style,
	defaultStyle: Style | string = Style.Soft
): string {
	// Parity with getServerTheme: a plain string without '=' is a default.
	if (typeof sourceOrDefault === 'string' && !sourceOrDefault.includes('=')) {
		return sourceOrDefault.toString()
	}
	if (sourceOrDefault == null) return defaultStyle.toString()
	try {
		return readFromSource(sourceOrDefault) ?? defaultStyle.toString()
	} catch {
		return defaultStyle.toString()
	}
}

/**
 * Inline `<head>` script that applies the cookie style before first paint,
 * guarding against stale cached HTML — same pattern as `themeInitScript`.
 */
export function styleInitScript(defaultStyle: Style | string = Style.Soft): string {
	const fallback = JSON.stringify(defaultStyle.toString())
	return `(function(){try{var m=document.cookie.match(/(?:^|; )${STYLE_COOKIE_NAME}=([^;]*)/);var s=m?m[1]:${fallback};document.documentElement.setAttribute('data-style',s)}catch(e){}})()`
}

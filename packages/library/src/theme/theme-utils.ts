import { Theme, THEME_COOKIE_NAME } from './theme-types.js'

/** Anything that can supply the theme cookie on the server. */
export type ThemeCookieSource =
	| string // a raw Cookie header ("a=1; theme=dark")
	| { get(name: string): { value: string } | string | undefined } // Next.js cookies() store

function readFromSource(source: ThemeCookieSource): string | undefined {
	if (typeof source === 'string') {
		const match = source
			.split('; ')
			.find(part => part.startsWith(`${THEME_COOKIE_NAME}=`))
		return match?.split('=')[1] || undefined
	}
	const entry = source.get(THEME_COOKIE_NAME)
	if (entry == null) return undefined
	return typeof entry === 'string' ? entry : entry.value
}

/**
 * Read the current theme on the server, for flicker-free SSR:
 *
 *   // Next.js App Router
 *   import { cookies } from 'next/headers'
 *   const theme = getServerTheme(await cookies())
 *
 *   // Any framework — pass the Cookie header
 *   const theme = getServerTheme(request.headers.get('cookie') ?? '')
 *
 * Calling it with just a default (`getServerTheme('dark')`) or with no
 * arguments keeps working for backwards compatibility; without a source it
 * can only return the default.
 */
export function getServerTheme(
	sourceOrDefault?: ThemeCookieSource | Theme,
	defaultTheme: Theme | string = 'light'
): string {
	// Back-compat: a plain string without '=' is a default theme, not a header.
	if (typeof sourceOrDefault === 'string' && !sourceOrDefault.includes('=')) {
		return legacyRead(sourceOrDefault)
	}
	if (sourceOrDefault == null) {
		return legacyRead(defaultTheme.toString())
	}
	try {
		return readFromSource(sourceOrDefault as ThemeCookieSource) ?? defaultTheme.toString()
	} catch {
		return defaultTheme.toString()
	}
}

/** Legacy path: try next/headers when available (CJS bundlers only). */
function legacyRead(defaultTheme: string): string {
	try {
		// eslint-disable-next-line @typescript-eslint/no-implied-eval
		const req = typeof require === 'function' ? require : undefined
		if (!req) return defaultTheme
		const { cookies } = req('next/headers')
		const store = cookies()
		return store.get(THEME_COOKIE_NAME)?.value || defaultTheme
	} catch {
		return defaultTheme
	}
}

/**
 * Client-side utility to get the current theme from cookies
 * @deprecated Use getThemeFromCookie from theme-types instead
 */
export function getClientTheme(defaultTheme: Theme | string = 'light'): string {
	if (typeof document === 'undefined') return defaultTheme.toString()
	const savedTheme = document.cookie
		.split('; ')
		.find(row => row.startsWith(`${THEME_COOKIE_NAME}=`))
		?.split('=')[1]
	return savedTheme || defaultTheme.toString()
}

/**
 * Inline script that applies the persisted theme before first paint —
 * eliminates the flash of the wrong theme on hard loads. Render it in
 * `<head>`:
 *
 *   <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
 */
export function themeInitScript(defaultTheme: Theme | string = 'light'): string {
	const fallback = JSON.stringify(defaultTheme.toString())
	return `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE_NAME}=([^;]*)/);var t=m?m[1]:${fallback};var r=document.documentElement;r.setAttribute('data-theme',t);r.classList.add(t)}catch(e){}})()`
}

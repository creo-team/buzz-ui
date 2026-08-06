import { Shape, SHAPE_COOKIE_NAME } from './shape-types.js'
import type { ThemeCookieSource } from './theme-utils.js'

function readFromSource(source: ThemeCookieSource): string | undefined {
	if (typeof source === 'string') {
		const match = source.split('; ').find(part => part.startsWith(`${SHAPE_COOKIE_NAME}=`))
		return match?.split('=')[1] || undefined
	}
	const entry = source.get(SHAPE_COOKIE_NAME)
	if (entry == null) return undefined
	return typeof entry === 'string' ? entry : entry.value
}

/**
 * Read the current shape on the server, for flicker-free SSR — same contract
 * as `getServerTheme`, kept as an independent cookie so shape and color
 * theme can be read/persisted separately:
 *
 *   import { cookies } from 'next/headers'
 *   const shape = getServerShape(await cookies())
 *
 *   // Any framework — pass the Cookie header
 *   const shape = getServerShape(request.headers.get('cookie') ?? '')
 */
export function getServerShape(
	source?: ThemeCookieSource,
	defaultShape: Shape | string = Shape.Soft
): string {
	if (source == null) return defaultShape.toString()
	try {
		return readFromSource(source) ?? defaultShape.toString()
	} catch {
		return defaultShape.toString()
	}
}

/**
 * Inline script that applies the persisted shape before first paint —
 * eliminates a flash of the wrong corner radius on hard loads. Render it in
 * `<head>` alongside (or instead of) `themeInitScript`:
 *
 *   <script dangerouslySetInnerHTML={{ __html: shapeInitScript() }} />
 */
export function shapeInitScript(defaultShape: Shape | string = Shape.Soft): string {
	const fallback = JSON.stringify(defaultShape.toString())
	return `(function(){try{var m=document.cookie.match(/(?:^|; )${SHAPE_COOKIE_NAME}=([^;]*)/);var s=m?m[1]:${fallback};document.documentElement.setAttribute('data-shape',s)}catch(e){}})()`
}

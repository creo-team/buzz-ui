import { describe, it, expect } from 'vitest'
import { getServerTheme, themeInitScript } from '../../src/theme/theme-utils'

describe('getServerTheme', () => {
	it('reads from a raw Cookie header', () => {
		expect(getServerTheme('a=1; theme=ocean; b=2')).toBe('ocean')
	})

	it('reads from a cookie-store object (Next.js cookies())', () => {
		const store = { get: (name: string) => (name === 'theme' ? { value: 'midnight' } : undefined) }
		expect(getServerTheme(store)).toBe('midnight')
	})

	it('falls back to the default when the source has no theme', () => {
		expect(getServerTheme('a=1; b=2', 'forest')).toBe('forest')
		expect(getServerTheme({ get: () => undefined }, 'forest')).toBe('forest')
	})

	it('treats a bare string argument as the legacy defaultTheme', () => {
		expect(getServerTheme('dark')).toBe('dark')
	})
})

describe('themeInitScript', () => {
	it('produces an inline script that applies the cookie theme', () => {
		const script = themeInitScript('light')
		expect(script).toContain('data-theme')
		expect(script).toContain('"light"')
		// Sanity: it should be valid JS
		expect(() => new Function(script)).not.toThrow()
	})
})

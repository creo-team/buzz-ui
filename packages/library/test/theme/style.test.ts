import { describe, it, expect, beforeEach } from 'vitest'
import { getServerStyle, styleInitScript } from '../../src/theme/style-utils'
import { Style, ALL_STYLES, STYLE_COOKIE_NAME, getStyleFromCookie, setStyleCookie } from '../../src/theme/style-types'
import fs from 'node:fs'
import path from 'node:path'

// jsdom's real cookie jar doesn't clear via `document.cookie = ''` (it just
// sets an empty-named cookie); redefine it as a plain overwritable string so
// each test starts clean — matches the established pattern in theme-utils.test.ts.
Object.defineProperty(document, 'cookie', {
	writable: true,
	value: '',
})

describe('getServerStyle', () => {
	it('reads from a raw Cookie header', () => {
		expect(getServerStyle('a=1; style=brutal; b=2')).toBe('brutal')
	})

	it('reads from a cookie-store object (Next.js cookies())', () => {
		const store = { get: (name: string) => (name === 'style' ? { value: 'glass' } : undefined) }
		expect(getServerStyle(store)).toBe('glass')
	})

	it('falls back to the default when the source has no style', () => {
		expect(getServerStyle('a=1; b=2', Style.Sharp)).toBe('sharp')
		expect(getServerStyle({ get: () => undefined }, 'toy')).toBe('toy')
	})

	it('falls back to "soft" with no source at all', () => {
		expect(getServerStyle()).toBe('soft')
	})

	it('never throws on a malformed source', () => {
		const throwing = { get: () => { throw new Error('boom') } }
		expect(() => getServerStyle(throwing)).not.toThrow()
		expect(getServerStyle(throwing, 'depth')).toBe('depth')
	})
})

describe('styleInitScript', () => {
	it('produces an inline script that applies the cookie style', () => {
		const script = styleInitScript('glass')
		expect(script).toContain('data-style')
		expect(script).toContain('"glass"')
		expect(() => new Function(script)).not.toThrow()
	})
})

describe('style cookie utilities', () => {
	beforeEach(() => {
		document.cookie = ''
	})

	it('STYLE_COOKIE_NAME is independent of the theme cookie', () => {
		expect(STYLE_COOKIE_NAME).toBe('style')
	})

	it('getStyleFromCookie reads a previously-set cookie', () => {
		setStyleCookie(Style.Brutal)
		expect(getStyleFromCookie()).toBe('brutal')
	})

	it('getStyleFromCookie falls back to the default when unset', () => {
		expect(getStyleFromCookie('crisp')).toBe('crisp')
	})
})

describe('the ten built-in presets', () => {
	it('ships exactly the ten documented presets, professional -> playful', () => {
		expect(ALL_STYLES.map(s => s.value)).toEqual([
			'soft', 'crisp', 'sharp', 'flat', 'depth', 'glass', 'round', 'puff', 'toy', 'brutal',
		])
	})

	it('every preset has a label and a description', () => {
		for (const preset of ALL_STYLES) {
			expect(preset.label.length).toBeGreaterThan(0)
			expect(preset.description?.length ?? 0).toBeGreaterThan(0)
		}
	})
})

describe('shipped stylesheet coverage', () => {
	const css = fs.readFileSync(path.resolve(__dirname, '../../src/styles/buzz.css'), 'utf8')

	it('defines a token block for every preset, including a soft reset block', () => {
		for (const preset of ALL_STYLES) {
			expect(css, `missing [data-style='${preset.value}'] block`).toContain(`[data-style='${preset.value}']`)
		}
	})

	it('every preset block restates the full style-axis token set (self-contained personalities)', () => {
		// A preset that omits a token would let a nested scoped preview inherit
		// it from an outer active preset — previews must never lie.
		const required = [
			'--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl',
			'--shadow-sm', '--shadow-md', '--shadow-lg', '--shadow-xl',
			'--bz-border-w', '--bz-border-c:', '--bz-border-c-strong',
			'--bz-surface-bg', '--bz-surface-filter',
			'--bz-density', '--bz-duration', '--bz-ease', '--bz-anim',
		]
		for (const preset of ALL_STYLES) {
			const match = css.match(new RegExp(`\\[data-style='${preset.value}'\\]\\s*\\{([^}]*)\\}`))
			expect(match, `no token block for ${preset.value}`).not.toBeNull()
			for (const token of required) {
				expect(match![1], `${preset.value} block missing ${token}`).toContain(token)
			}
		}
	})

	it('theme selectors re-derive the --bz-* indirections for scoped theme containers', () => {
		// Without this, a <div class="dark"> inside a light app would inherit
		// the outer theme's frozen surface/border values.
		const match = css.match(/\[data-theme\], \.light, \.dark, \.midnight, \.forest, \.ocean, \.umbro \{([^}]*)\}/)
		expect(match).not.toBeNull()
		expect(match![1]).toContain('--bz-surface-bg: var(--c-surface)')
		expect(match![1]).toContain('--bz-border-c: var(--c-border)')
		expect(match![1]).toContain('--bz-border-c-strong: var(--c-border-strong)')
	})

	it('scopes structural rules as donuts that stop at nested scoped previews', () => {
		expect(css).toMatch(/@scope \(\[data-style='brutal'\]\) to \(\[data-style\]\)/)
		expect(css).toMatch(/@scope \(\[data-style='toy'\]\) to \(\[data-style\]\)/)
	})

	it('never sets a shadow token to `none` (would void composed shadow lists)', () => {
		// Inside any [data-style] block, --shadow-*: none is forbidden; the
		// list-safe no-op is `0 0 0 0 transparent`.
		expect(css).not.toMatch(/--shadow-(?:sm|md|lg|xl):\s*none/)
	})

	it('style blocks never write color tokens (theme-owned)', () => {
		for (const match of css.matchAll(/\[data-style='[a-z]+'\]\s*\{([^}]*)\}/g)) {
			const body = match[1]
			expect(body, `style block writes a --c-* token:\n${body}`).not.toMatch(/^\s*--c-[a-z-]+\s*:/m)
		}
	})

	it('gates glass translucency and blur together behind @supports', () => {
		expect(css).toMatch(/@supports \(\(backdrop-filter: blur\(1px\)\) or \(-webkit-backdrop-filter: blur\(1px\)\)\)/)
	})

	it('honors prefers-reduced-transparency for glass', () => {
		expect(css).toContain('prefers-reduced-transparency')
	})
})

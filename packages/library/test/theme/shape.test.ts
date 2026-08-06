import { describe, it, expect, beforeEach } from 'vitest'
import { getServerShape, shapeInitScript } from '../../src/theme/shape-utils'
import { Shape, ALL_SHAPES, SHAPE_COOKIE_NAME, getShapeFromCookie, setShapeCookie } from '../../src/theme/shape-types'

// jsdom's real cookie jar doesn't clear via `document.cookie = ''` (it just
// sets an empty-named cookie); redefine it as a plain overwritable string so
// each test starts clean — matches the established pattern in theme-utils.test.ts.
Object.defineProperty(document, 'cookie', {
	writable: true,
	value: '',
})

describe('getServerShape', () => {
	it('reads from a raw Cookie header', () => {
		expect(getServerShape('a=1; shape=sharp; b=2')).toBe('sharp')
	})

	it('reads from a cookie-store object (Next.js cookies())', () => {
		const store = { get: (name: string) => (name === 'shape' ? { value: 'round' } : undefined) }
		expect(getServerShape(store)).toBe('round')
	})

	it('falls back to the default when the source has no shape', () => {
		expect(getServerShape('a=1; b=2', Shape.Sharp)).toBe('sharp')
		expect(getServerShape({ get: () => undefined }, 'round')).toBe('round')
	})

	it('falls back to "soft" with no source at all', () => {
		expect(getServerShape()).toBe('soft')
	})

	it('never throws on a malformed source', () => {
		const throwing = { get: () => { throw new Error('boom') } }
		expect(() => getServerShape(throwing)).not.toThrow()
		expect(getServerShape(throwing, 'round')).toBe('round')
	})
})

describe('shapeInitScript', () => {
	it('produces an inline script that applies the cookie shape', () => {
		const script = shapeInitScript('sharp')
		expect(script).toContain('data-shape')
		expect(script).toContain('"sharp"')
		expect(() => new Function(script)).not.toThrow()
	})
})

describe('shape cookie utilities', () => {
	beforeEach(() => {
		document.cookie = ''
	})

	it('SHAPE_COOKIE_NAME is independent of the theme cookie', () => {
		expect(SHAPE_COOKIE_NAME).toBe('shape')
	})

	it('getShapeFromCookie reads a previously-set cookie', () => {
		setShapeCookie(Shape.Round)
		expect(getShapeFromCookie()).toBe('round')
	})

	it('getShapeFromCookie falls back to the default when unset', () => {
		expect(getShapeFromCookie('sharp')).toBe('sharp')
	})

	it('ships exactly the three documented presets', () => {
		expect(ALL_SHAPES.map(s => s.value)).toEqual(['sharp', 'soft', 'round'])
	})
})

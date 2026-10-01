// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { THEME_PRESETS } from '../../src/theme/theme-presets'

/** WCAG AA for the 12px secondary tooltip lines. */
const MIN_TEXT_CONTRAST = 4.5
const BLACK: Rgb = [0, 0, 0]

type Rgb = [number, number, number]

function parseColor(color: string): { rgb: Rgb; alpha: number } {
	const hex = /^#([0-9a-f]{6})$/i.exec(color)
	if (hex) {
		const value = Number.parseInt(hex[1], 16)
		return { rgb: [(value >> 16) & 255, (value >> 8) & 255, value & 255], alpha: 1 }
	}
	const rgba = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(color)
	if (!rgba) throw new Error(`Unparsed color: ${color}`)
	return { rgb: [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])], alpha: Number(rgba[4] ?? 1) }
}

/** A translucent background composited over its darkest possible backdrop. */
function composite(color: string): Rgb {
	const { rgb, alpha } = parseColor(color)
	return rgb.map((channel, index) => channel * alpha + BLACK[index] * (1 - alpha)) as Rgb
}

function getLuminance(rgb: Rgb): number {
	const [r, g, b] = rgb.map(channel => {
		const c = channel / 255
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
	})
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getContrast(foreground: Rgb, background: Rgb): number {
	const [light, dark] = [getLuminance(foreground), getLuminance(background)].sort((a, b) => b - a)
	return (light + 0.05) / (dark + 0.05)
}

describe('--c-tooltip-text-muted contrast', () => {
	it.each(Object.entries(THEME_PRESETS))('the %s preset sets a muted tooltip color at 4.5:1 or more', (_name, preset) => {
		const { tooltipBg, tooltipTextMuted } = preset.colors
		expect(tooltipBg).toBeDefined()
		expect(tooltipTextMuted).toBeDefined()
		const ratio = getContrast(composite(tooltipTextMuted as string), composite(tooltipBg as string))
		expect(ratio).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
	})

	it('every THEMING.md example that overrides --c-tooltip-bg also sets a passing --c-tooltip-text-muted', () => {
		const theming = readFileSync(new URL('../../THEMING.md', import.meta.url), 'utf8')
		const blocks = theming.split('}').filter(block => /--c-tooltip-bg:\s*#/.test(block))
		expect(blocks.length).toBeGreaterThan(0)
		for (const block of blocks) {
			const bg = /--c-tooltip-bg:\s*(#[0-9a-f]{6})/i.exec(block)?.[1]
			const muted = /--c-tooltip-text-muted:\s*(#[0-9a-f]{6})/i.exec(block)?.[1]
			expect(muted, block).toBeDefined()
			expect(getContrast(composite(muted as string), composite(bg as string))).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST)
		}
	})
})

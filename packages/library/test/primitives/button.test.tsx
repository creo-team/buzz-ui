import { render, screen } from '@testing-library/react'
import React from 'react'
import { Button, ButtonVariant, ButtonTone, resolveButtonStyle } from '../../src/primitives/button'
import { describe, it, expect } from 'vitest'

describe('Button — variant × tone axes', () => {
	it('defaults to solid primary', () => {
		render(<Button>Save</Button>)
		const button = screen.getByRole('button', { name: 'Save' })
		expect(button).toHaveAttribute('data-variant', 'solid')
		expect(button).toHaveAttribute('data-tone', 'primary')
	})

	it('chrome weights default to the neutral tone', () => {
		for (const variant of ['soft', 'outline', 'ghost', 'glass'] as const) {
			const { unmount } = render(<Button variant={variant}>B</Button>)
			expect(screen.getByRole('button')).toHaveAttribute('data-tone', 'neutral')
			unmount()
		}
	})

	it('link defaults to the primary tone', () => {
		render(<Button variant="link">Learn more</Button>)
		expect(screen.getByRole('button')).toHaveAttribute('data-tone', 'primary')
	})

	it('an explicit tone always wins', () => {
		render(
			<Button variant="outline" tone={ButtonTone.Danger}>
				Delete
			</Button>
		)
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('data-variant', 'outline')
		expect(button).toHaveAttribute('data-tone', 'danger')
	})
})

describe('Button — legacy variant aliases (v0.6 compatibility)', () => {
	const cases: Array<[string, string, string]> = [
		['bold', 'solid', 'primary'],
		['subtle', 'soft', 'neutral'],
		['text', 'link', 'primary'],
		['nav', 'ghost', 'neutral'],
		['success', 'solid', 'success'],
		['danger', 'solid', 'danger'],
		['outline', 'outline', 'neutral'],
		['ghost', 'ghost', 'neutral'],
		['glass', 'glass', 'neutral'],
	]

	for (const [legacy, variant, tone] of cases) {
		it(`maps variant="${legacy}" → ${variant} + ${tone}`, () => {
			render(<Button variant={legacy as ButtonVariant}>B</Button>)
			const button = screen.getByRole('button')
			expect(button).toHaveAttribute('data-variant', variant)
			expect(button).toHaveAttribute('data-tone', tone)
		})
	}

	it('maps variant="icon" → ghost + icon shape', () => {
		render(
			<Button variant="icon" aria-label="Settings">
				⚙
			</Button>
		)
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('data-variant', 'ghost')
		expect(button).toHaveAttribute('data-icon-only')
	})

	it('an explicit tone overrides a legacy alias tone', () => {
		render(
			<Button variant={ButtonVariant.Bold} tone="danger">
				B
			</Button>
		)
		expect(screen.getByRole('button')).toHaveAttribute('data-tone', 'danger')
	})

	it('resolveButtonStyle is exported for tooling', () => {
		expect(resolveButtonStyle('bold')).toEqual({ variant: 'solid', tone: 'primary', icon: false })
		expect(resolveButtonStyle('subtle', 'danger')).toEqual({ variant: 'soft', tone: 'danger', icon: false })
		expect(resolveButtonStyle('icon')).toEqual({ variant: 'ghost', tone: 'neutral', icon: true })
	})
})

describe('Button — states', () => {
	it('loading disables the button, sets aria-busy and shows the spinner', () => {
		render(<Button loading>Save</Button>)
		const button = screen.getByRole('button')
		expect(button).toBeDisabled()
		expect(button).toHaveAttribute('aria-busy', 'true')
		expect(button).toHaveAttribute('data-loading')
	})

	it('selected sets aria-pressed and data-selected', () => {
		render(<Button selected>Filter</Button>)
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-pressed', 'true')
		expect(button).toHaveAttribute('data-selected')
	})

	it('defaults type="button" so it never submits forms accidentally', () => {
		render(<Button>B</Button>)
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
	})

	it('honors an explicit type="submit"', () => {
		render(<Button type="submit">Send</Button>)
		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
	})

	it('fullWidth and iconOnly render their data attributes', () => {
		render(
			<Button fullWidth iconOnly aria-label="Add">
				+
			</Button>
		)
		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('data-full-width')
		expect(button).toHaveAttribute('data-icon-only')
	})
})

describe('Button — stylesheet contract', () => {
	// The tone blocks must define every custom property the weight blocks
	// consume, for all four tones — a missing token would silently inherit
	// from an ancestor button.
	it('each tone block defines the full --bz-btn-* palette', async () => {
		const fs = await import('node:fs')
		const path = await import('node:path')
		const css = fs.readFileSync(path.resolve(__dirname, '../../src/styles/buzz.css'), 'utf8')
		const consumed = [...css.matchAll(/var\((--bz-btn-[a-z-]+)[),]/g)].map(m => m[1])
		const required = [...new Set(consumed)]
		expect(required.length).toBeGreaterThanOrEqual(8)
		for (const tone of ['primary', 'neutral', 'success', 'danger']) {
			const block = css.match(new RegExp(`\\.bz-button\\[data-tone='${tone}'\\]\\s*\\{([^}]*)\\}`))
			expect(block, `missing tone block for ${tone}`).not.toBeNull()
			for (const token of required) {
				expect(block![1], `tone ${tone} missing ${token}`).toContain(`${token}:`)
			}
		}
	})

	it('no stylesheet rule targets a legacy button variant name', async () => {
		const fs = await import('node:fs')
		const path = await import('node:path')
		const css = fs.readFileSync(path.resolve(__dirname, '../../src/styles/buzz.css'), 'utf8')
		expect(css).not.toMatch(
			/\.bz-button\[data-variant='(?:bold|subtle|text|nav|icon|success|danger)'\]/
		)
	})
})

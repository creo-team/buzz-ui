import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { StyleSwitcher } from '../../src/theme/style-switcher'
import { ALL_STYLES } from '../../src/theme/style-types'
import { describe, it, expect, beforeEach } from 'vitest'

Object.defineProperty(document, 'cookie', {
	writable: true,
	value: '',
})

describe('StyleSwitcher', () => {
	beforeEach(() => {
		document.cookie = ''
		document.documentElement.removeAttribute('data-style')
	})

	it('renders a trigger whose accessible name contains the visible current style', () => {
		render(<StyleSwitcher initialStyle="soft" />)
		const trigger = screen.getByRole('button', { name: 'Style: Soft' })
		expect(trigger).toHaveTextContent('Soft')
	})

	it('opens a grid with a live-preview tile per preset, each carrying its own data-style', async () => {
		render(<StyleSwitcher initialStyle="soft" />)
		fireEvent.click(screen.getByRole('button', { name: /^Style:/ }))
		await waitFor(() => expect(screen.getByRole('group', { name: 'Styles' })).toBeInTheDocument())

		for (const preset of ALL_STYLES) {
			const tile = screen.getByRole('button', { name: `Switch to ${preset.label.toLowerCase()} style` })
			expect(tile).toHaveAttribute('data-style', preset.value.toString())
		}
	})

	it('marks the active preset with aria-pressed', async () => {
		render(<StyleSwitcher initialStyle="brutal" />)
		fireEvent.click(screen.getByRole('button', { name: /^Style:/ }))
		await waitFor(() => expect(screen.getByRole('group', { name: 'Styles' })).toBeInTheDocument())
		expect(screen.getByRole('button', { name: 'Switch to brutal style' })).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByRole('button', { name: 'Switch to soft style' })).toHaveAttribute('aria-pressed', 'false')
	})

	it('applies data-style to <html>, persists a cookie, and closes on select', async () => {
		render(<StyleSwitcher initialStyle="soft" />)
		fireEvent.click(screen.getByRole('button', { name: /^Style:/ }))
		await waitFor(() => expect(screen.getByRole('group', { name: 'Styles' })).toBeInTheDocument())

		fireEvent.click(screen.getByRole('button', { name: 'Switch to glass style' }))
		expect(document.documentElement.getAttribute('data-style')).toBe('glass')
		expect(document.cookie).toContain('style=glass')
		await waitFor(() => expect(screen.queryByRole('group', { name: 'Styles' })).not.toBeInTheDocument())
	})

	it('supports a restricted custom style list', async () => {
		render(
			<StyleSwitcher
				initialStyle="soft"
				styles={[
					{ value: 'soft', label: 'Soft' },
					{ value: 'brutal', label: 'Brutal' },
				]}
			/>
		)
		fireEvent.click(screen.getByRole('button', { name: /^Style:/ }))
		await waitFor(() => expect(screen.getByRole('group', { name: 'Styles' })).toBeInTheDocument())
		expect(screen.queryByRole('button', { name: 'Switch to glass style' })).not.toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Switch to brutal style' })).toBeInTheDocument()
	})
})

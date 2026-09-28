import { render, screen } from '@testing-library/react'
import React from 'react'
import { Section } from '../../src/layout/section'
import { PageHeader } from '../../src/layout/page-header'
import { describe, it, expect } from 'vitest'

describe('Section', () => {
	it('renders a band with defaults and a width-capped inner column', () => {
		const { container } = render(<Section>content</Section>)
		const section = container.querySelector('section.bz-section')!
		expect(section).toHaveAttribute('data-variant', 'default')
		expect(section).toHaveAttribute('data-padding', 'default')
		expect(section.querySelector('.bz-section__inner')).toHaveAttribute('data-width', 'default')
		expect(screen.getByText('content')).toBeInTheDocument()
	})

	it('applies variant, width, padding and the `as` element', () => {
		const { container } = render(
			<Section variant="muted" width="narrow" padding="spacious" as="aside">
				x
			</Section>
		)
		const aside = container.querySelector('aside.bz-section')!
		expect(aside).toHaveAttribute('data-variant', 'muted')
		expect(aside).toHaveAttribute('data-padding', 'spacious')
		expect(aside.querySelector('.bz-section__inner')).toHaveAttribute('data-width', 'narrow')
	})

	it('passes through arbitrary props and className', () => {
		const { container } = render(
			<Section id="features" aria-label="Features" className="extra">
				x
			</Section>
		)
		const section = container.querySelector('#features')!
		expect(section).toHaveClass('bz-section', 'extra')
		expect(section).toHaveAttribute('aria-label', 'Features')
	})
})

describe('PageHeader', () => {
	it('renders an h1 title by default with the md scale', () => {
		render(<PageHeader title="Members" description="Everyone with access." />)
		const heading = screen.getByRole('heading', { level: 1, name: 'Members' })
		expect(heading).toHaveClass('bz-page-header__title')
		expect(screen.getByText('Everyone with access.')).toHaveClass('bz-page-header__description')
	})

	it('keeps the document outline honest via level, independent of size', () => {
		render(<PageHeader title="Usage" level={2} size="sm" />)
		const heading = screen.getByRole('heading', { level: 2, name: 'Usage' })
		expect(heading.closest('.bz-page-header')).toHaveAttribute('data-size', 'sm')
	})

	it('renders eyebrow and actions slots', () => {
		render(
			<PageHeader
				title="Members"
				eyebrow={<span>Settings / Team</span>}
				actions={<button>Invite</button>}
			/>
		)
		expect(screen.getByText('Settings / Team').closest('.bz-page-header__eyebrow')).not.toBeNull()
		expect(screen.getByRole('button', { name: 'Invite' }).closest('.bz-page-header__actions')).not.toBeNull()
	})

	it('renders the divider only when asked', () => {
		const { container, rerender } = render(<PageHeader title="A" />)
		expect(container.querySelector('.bz-page-header')).not.toHaveAttribute('data-divider')
		rerender(<PageHeader title="A" divider />)
		expect(container.querySelector('.bz-page-header')).toHaveAttribute('data-divider')
	})

	it('omits empty slots from the DOM', () => {
		const { container } = render(<PageHeader title="Only title" />)
		expect(container.querySelector('.bz-page-header__eyebrow')).toBeNull()
		expect(container.querySelector('.bz-page-header__actions')).toBeNull()
		expect(container.querySelector('.bz-page-header__description')).toBeNull()
	})
})

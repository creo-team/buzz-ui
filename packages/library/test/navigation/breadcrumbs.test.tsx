import { render, screen } from '@testing-library/react'
import React from 'react'
import { Breadcrumbs } from '../../src/navigation/breadcrumbs'
import { describe, it, expect } from 'vitest'

const items = [
	{ key: 'home', label: 'Home', href: '/' },
	{ key: 'docs', label: 'Docs', href: '/docs' },
	{ key: 'theming', label: 'Theming', href: '/docs/theming' },
	{ key: 'tokens', label: 'Tokens' },
]

describe('Breadcrumbs', () => {
	it('renders a breadcrumb landmark with aria-current on the last crumb', () => {
		render(<Breadcrumbs items={items} />)
		expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
		expect(screen.getByText('Tokens')).toHaveAttribute('aria-current', 'page')
		// The last crumb is never a link, even with an href present
		expect(screen.getAllByRole('link')).toHaveLength(3)
	})

	it('collapses middle crumbs beyond maxItems', () => {
		render(<Breadcrumbs items={items} maxItems={3} />)
		expect(screen.getByText('Home')).toBeInTheDocument()
		expect(screen.getByText('…')).toBeInTheDocument()
		expect(screen.getByText('Tokens')).toBeInTheDocument()
		expect(screen.queryByText('Docs')).not.toBeInTheDocument()
	})

	it('renders a custom separator', () => {
		render(<Breadcrumbs items={items.slice(0, 2)} separator="→" />)
		expect(screen.getByText('→')).toBeInTheDocument()
	})
})

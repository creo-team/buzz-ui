import { render, screen } from '@testing-library/react'
import React from 'react'
import { SidebarNav, type SidebarNavItem } from '../../src/navigation/sidebar-nav'
import { describe, it, expect } from 'vitest'

const ITEMS: SidebarNavItem[] = [
	{ key: 'button', label: 'Button', href: '/button' },
	{ key: 'modal', label: 'Modal', href: '/modal' },
	{ key: 'input', label: 'Input', href: '/input' },
	{ key: 'tabs', label: 'Tabs', href: '/tabs' },
]

const CATEGORY: Record<string, string> = {
	button: 'Actions',
	modal: 'Overlays',
	input: 'Forms',
	tabs: 'Navigation',
}

function groupTitles() {
	return screen.getAllByRole('heading', { level: 4 }).map(heading => heading.textContent)
}

describe('SidebarNav grouping', () => {
	it('groups items under headings', () => {
		render(<SidebarNav items={ITEMS} title="Components" groupBy={item => CATEGORY[item.key]} />)
		expect(groupTitles()).toEqual(['Actions', 'Forms', 'Navigation', 'Overlays'])
	})

	it('orders groups by groupOrder, alphabetical only for the unlisted rest', () => {
		render(
			<SidebarNav
				items={ITEMS}
				title="Components"
				groupBy={item => CATEGORY[item.key]}
				groupOrder={['Forms', 'Actions']}
			/>
		)
		expect(groupTitles()).toEqual(['Forms', 'Actions', 'Navigation', 'Overlays'])
	})

	it('marks the current path with aria-current', () => {
		render(<SidebarNav items={ITEMS} title="Components" currentPath="/modal" />)
		expect(screen.getByRole('link', { name: 'Modal' })).toHaveAttribute('aria-current', 'page')
	})
})

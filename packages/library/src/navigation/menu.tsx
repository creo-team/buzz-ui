"use client"
import * as React from 'react'
import { Dropdown, type DropdownItem } from '../overlays/dropdown.js'

/** One entry in a {@link Menu}. */
export interface MenuItem {
	key: string
	label: React.ReactNode
	onSelect?: () => void
	disabled?: boolean
	icon?: React.ReactNode
}

/** Props for {@link Menu}. */
export interface MenuProps {
	items: MenuItem[]
	/** Trigger contents — rendered inside the menu's own `<button>`, so pass a label or icon, not a button element. */
	button: React.ReactNode
	className?: string
}

/**
 * Simple button-triggered menu. A thin wrapper over `Dropdown`, sharing its
 * full keyboard support and positioning.
 */
export function Menu({ items, button, className }: MenuProps) {
	const dropdownItems: DropdownItem[] = items.map(item => ({
		key: item.key,
		label: item.label,
		icon: item.icon,
		disabled: item.disabled,
		onClick: item.onSelect,
	}))

	return (
		<Dropdown
			className={className}
			align="end"
			items={dropdownItems}
			trigger={
				<button type="button" className="bz-menu-trigger">
					{button}
				</button>
			}
		/>
	)
}

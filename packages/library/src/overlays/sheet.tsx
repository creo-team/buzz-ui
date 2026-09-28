"use client"
import * as React from 'react'
import { Drawer } from './drawer.js'

/** Props for the deprecated {@link Sheet}. */
export interface SheetProps {
	open: boolean
	/** Called when the sheet requests to close. */
	onClose: () => void
	/** Edge to slide in from. @default 'right' */
	position?: 'left' | 'right'
	/** Heading content (forwarded to Drawer's `title`). */
	header?: React.ReactNode
	children?: React.ReactNode
}

/**
 * @deprecated Use `Drawer` — Sheet is a thin alias kept for compatibility.
 * It now inherits Drawer's focus management, animations and accessibility.
 */
export function Sheet({ open, onClose, position = 'right', header, children }: SheetProps) {
	return (
		<Drawer
			open={open}
			onOpenChange={next => {
				if (!next) onClose()
			}}
			side={position}
			title={header}
			size="sm"
		>
			{children}
		</Drawer>
	)
}

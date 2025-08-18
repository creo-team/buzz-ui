"use client"
import * as React from 'react'

export interface SheetProps {
	open: boolean
	onClose: () => void
	position?: 'left' | 'right'
	header?: React.ReactNode
	children?: React.ReactNode
}

export function Sheet({ open, onClose, position = 'right', header, children }: SheetProps) {
	if (!open) return null
	const side = position === 'right' ? 'right-0' : 'left-0'
	return (
		<div className="fixed inset-0 z-50">
			<div className="absolute inset-0 bg-black/60" onClick={onClose} />
			<div className={["absolute top-0 h-full w-96 border-l border-[var(--c-border)] bg-[var(--c-surface)] p-4 shadow-xl", side].join(' ')}>
				{header && <div className="mb-2 text-base font-semibold">{header}</div>}
				{children}
			</div>
		</div>
	)
}



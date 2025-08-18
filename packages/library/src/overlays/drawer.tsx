"use client"
import * as React from 'react'
import { useHotkey, type HotkeyConfig } from '../hooks/use-hotkey'

export interface DrawerProps {
	children: React.ReactNode
	open: boolean
	onOpenChange: (open: boolean) => void
	side?: 'left' | 'right' | 'top' | 'bottom'
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
	title?: string
	description?: string
	showCloseButton?: boolean
	/** Additional hotkeys for drawer actions */
	hotkeys?: HotkeyConfig[]
}

const sideClasses = {
	left: 'left-0 top-0 h-full',
	right: 'right-0 top-0 h-full',
	top: 'top-0 left-0 w-full',
	bottom: 'bottom-0 left-0 w-full',
}

const sizeClasses = {
	sm: {
		left: 'w-80',
		right: 'w-80',
		top: 'h-64',
		bottom: 'h-64',
	},
	md: {
		left: 'w-96',
		right: 'w-96',
		top: 'h-80',
		bottom: 'h-80',
	},
	lg: {
		left: 'w-[32rem]',
		right: 'w-[32rem]',
		top: 'h-96',
		bottom: 'h-96',
	},
	xl: {
		left: 'w-[40rem]',
		right: 'w-[40rem]',
		top: 'h-[32rem]',
		bottom: 'h-[32rem]',
	},
	full: {
		left: 'w-full',
		right: 'w-full',
		top: 'h-full',
		bottom: 'h-full',
	},
}

const slideClasses = {
	left: {
		enter: 'translate-x-0',
		exit: '-translate-x-full',
	},
	right: {
		enter: 'translate-x-0',
		exit: 'translate-x-full',
	},
	top: {
		enter: 'translate-y-0',
		exit: '-translate-y-full',
	},
	bottom: {
		enter: 'translate-y-0',
		exit: 'translate-y-full',
	},
}

export function Drawer({
	children,
	open,
	onOpenChange,
	side = 'right',
	size = 'md',
	title,
	description,
	showCloseButton = true,
	hotkeys = []
}: DrawerProps) {
	const overlayRef = React.useRef<HTMLDivElement>(null)
	const contentRef = React.useRef<HTMLDivElement>(null)

	// Set up hotkeys when drawer is open
	useHotkey([
		{
			key: 'escape',
			action: () => onOpenChange(false),
			enabled: open
		},
		...hotkeys.map(hotkey => ({
			...hotkey,
			enabled: open && (hotkey.enabled ?? true)
		}))
	])

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [open])

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === overlayRef.current) {
			onOpenChange(false)
		}
	}

	if (!open) return null

	return (
		<div
			ref={overlayRef}
			className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			onClick={handleOverlayClick}
		>
			<div
				ref={contentRef}
				className={`
					fixed bg-[var(--c-surface)] border-[var(--c-border)] shadow-xl
					transition-transform duration-300 ease-out
					${sideClasses[side]}
					${sizeClasses[size][side]}
					${open ? slideClasses[side].enter : slideClasses[side].exit}
					${side === 'left' || side === 'right' ? 'border-r border-l-0' : ''}
					${side === 'top' || side === 'bottom' ? 'border-b border-t-0' : ''}
				`}
			>
				{(title || description || showCloseButton) && (
					<div className="flex items-center justify-between border-b border-[var(--c-border)] px-6 py-4">
						<div>
							{title && (
								<h2 className="text-lg font-semibold text-[var(--c-text)]">
									{title}
								</h2>
							)}
							{description && (
								<p className="mt-1 text-sm text-[var(--c-text-secondary)]">
									{description}
								</p>
							)}
						</div>
						{showCloseButton && (
							<button
								onClick={() => onOpenChange(false)}
								className="rounded-lg p-2 text-[var(--c-text-secondary)] hover:bg-[var(--c-hover)] hover:text-[var(--c-text)] transition-colors"
								aria-label="Close drawer"
							>
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}
					</div>
				)}
				<div className="flex-1 overflow-auto p-6">
					{children}
				</div>
			</div>
		</div>
	)
}

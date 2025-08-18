"use client"
import * as React from 'react'
import { createPortal } from 'react-dom'
import { useHotkey, type HotkeyConfig } from '../hooks/use-hotkey'

export interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	maxWidthClassName?: string
	documentTitle?: string
	header?: React.ReactNode
	actions?: React.ReactNode
	/** Additional hotkeys for modal actions */
	hotkeys?: HotkeyConfig[]
}

/**
 * Modal component inspired by Umbro's design
 * Features backdrop blur, document title management, and clean styling
 */
export function Modal({ 
	isOpen, 
	onClose, 
	children, 
	maxWidthClassName = 'max-w-xl', 
	documentTitle,
	header,
	actions,
	hotkeys = []
}: ModalProps) {
	const previousTitleRef = React.useRef<string | null>(null)

	// Set up additional hotkeys when modal is open
	useHotkey([
		{
			key: 'escape',
			action: onClose,
			enabled: isOpen
		},
		...hotkeys.map(hotkey => ({
			...hotkey,
			enabled: isOpen && (hotkey.enabled ?? true)
		}))
	])

	React.useEffect(() => {
		if (!isOpen) return
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow = previousOverflow
		}
	}, [isOpen])

	// Update document title while modal is open, then restore
	React.useEffect(() => {
		if (!isOpen || !documentTitle) return
		if (previousTitleRef.current == null) previousTitleRef.current = document.title
		document.title = documentTitle
		return () => {
			if (previousTitleRef.current != null) {
				document.title = previousTitleRef.current
				previousTitleRef.current = null
			}
		}
	}, [isOpen, documentTitle])

	if (!isOpen) return null

	const modalContent = (
		<div className="fixed inset-0 z-50" style={{ zIndex: 9999 }} aria-modal role="dialog">
			<div
				data-testid="modal-backdrop"
				className="fixed inset-0 bg-black/60 backdrop-blur backdrop-saturate-150 transition-opacity cursor-pointer"
				onClick={onClose}
			/>
			<div className="flex min-h-screen items-center justify-center px-4 py-4">
				<div
					data-testid="modal-panel"
					className={`relative transform rounded-[var(--radius-xl)] bg-[var(--c-surface)] text-left shadow-[var(--shadow-xl)] transition-all w-full ${maxWidthClassName} border border-[var(--c-border)] ring-1 ring-black/5 max-h-[calc(100vh-2rem)] overflow-y-auto text-[var(--c-text)]`}
				>
					{header && (
						<div className="border-b border-[var(--c-border)] px-6 py-4">
							<h2 className="text-lg font-semibold text-[var(--c-text)]">{header}</h2>
						</div>
					)}
					<div className="px-6 py-4">
						{children}
					</div>
					{actions && (
						<div className="border-t border-[var(--c-border)] px-6 py-4">
							<div className="flex justify-end gap-3">
								{actions}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)

	return createPortal(modalContent, document.body)
}


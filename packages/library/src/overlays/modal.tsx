"use client"
import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useHotkey, type HotkeyConfig } from '../hooks/use-hotkey'
import { type ModalAnimationVariants, AnimationPresets } from '../types/animations'

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
	/** Custom animation variants for modal entrance/exit */
	animationVariants?: ModalAnimationVariants
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
	hotkeys = [],
	animationVariants
}: ModalProps) {
	const previousTitleRef = React.useRef<string | null>(null)

	// Use provided animation variants or elegant default
	const variants = animationVariants || AnimationPresets.modal.elegant
	const backdropVariants = variants.backdrop
	const panelVariants = variants.panel

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

	const modalContent = (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50" style={{ zIndex: 9999 }} aria-modal role="dialog">
											<motion.div
							data-testid="modal-backdrop"
							className="fixed inset-0 bg-[var(--c-modal-overlay,rgba(0,0,0,0.6))] backdrop-blur backdrop-saturate-150 cursor-pointer"
							onClick={onClose}
							variants={backdropVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						/>
					<div className="flex min-h-screen items-center justify-center px-4 py-4">
													<motion.div
								data-testid="modal-panel"
								className={`relative transform rounded-[var(--c-radius-xl,0.75rem)] bg-[var(--c-modal-bg,var(--c-surface))] text-left shadow-[var(--c-shadow-xl,0_20px_25px_-5px_rgb(0_0_0_/_0.1))] w-full ${maxWidthClassName} border border-[var(--c-modal-border,var(--c-border))] ring-1 ring-black/5 max-h-[calc(100vh-2rem)] overflow-y-auto text-[var(--c-text)]`}
								variants={panelVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
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
						</motion.div>
					</div>
				</div>
			)}
		</AnimatePresence>
	)

	return createPortal(modalContent, document.body)
}


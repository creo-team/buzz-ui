"use client"
import * as React from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { type DropdownAnimationVariants, AnimationPresets } from '../types/animations'

export enum DropdownItemVariant {
	Default = 'default',
	Destructive = 'destructive'
}

export interface DropdownItem {
	key: string
	label: React.ReactNode
	icon?: React.ReactNode
	onClick?: () => void
	href?: string
	disabled?: boolean
	variant?: DropdownItemVariant | `${DropdownItemVariant}`
}

export interface DropdownProps {
	trigger: React.ReactElement
	items: (DropdownItem | 'separator')[]
	align?: 'start' | 'center' | 'end'
	side?: 'top' | 'right' | 'bottom' | 'left'
	sideOffset?: number
	className?: string
	/** Custom animation variants for dropdown entrance/exit */
	animationVariants?: DropdownAnimationVariants
}

export function Dropdown({
	trigger,
	items,
	align = 'start',
	side = 'bottom',
	sideOffset = 4,
	className = '',
	animationVariants
}: DropdownProps) {
	const [isOpen, setIsOpen] = React.useState(false)
	const dropdownRef = React.useRef<HTMLDivElement>(null)
	const triggerRef = React.useRef<HTMLElement>(null)

	// Use provided animation variants or elegant default with direction awareness
	const defaultVariants = {
		...AnimationPresets.dropdown.subtle,
		hidden: {
			...AnimationPresets.dropdown.subtle.hidden,
			y: side === 'top' ? 10 : side === 'bottom' ? -10 : AnimationPresets.dropdown.subtle.hidden!.y,
			x: side === 'left' ? 10 : side === 'right' ? -10 : 0
		},
		exit: {
			...AnimationPresets.dropdown.subtle.exit,
			y: side === 'top' ? 5 : side === 'bottom' ? -5 : 0,
			x: side === 'left' ? 5 : side === 'right' ? -5 : 0
		}
	}

	const variants = animationVariants || defaultVariants

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
			document.addEventListener('keydown', handleEscape)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen])

	const getPositionStyle = (): React.CSSProperties => {
		const style: React.CSSProperties = { position: 'absolute', zIndex: 50 }
		
		// Handle alignment
		if (align === 'start') {
			style.left = 0
		} else if (align === 'center') {
			style.left = '50%'
			style.transform = 'translateX(-50%)'
		} else if (align === 'end') {
			style.right = 0
		}
		
		// Handle side and offset
		if (side === 'top') {
			style.bottom = '100%'
			style.marginBottom = `${sideOffset}px`
		} else if (side === 'right') {
			style.left = '100%'
			style.marginLeft = `${sideOffset}px`
		} else if (side === 'bottom') {
			style.top = '100%'
			style.marginTop = `${sideOffset}px`
		} else if (side === 'left') {
			style.right = '100%'
			style.marginRight = `${sideOffset}px`
		}
		
		return style
	}

	const handleItemClick = (item: DropdownItem) => {
		if (item.disabled) return
		
		item.onClick?.()
		setIsOpen(false)
	}

	return (
		<div className="relative inline-block">
			{React.cloneElement(trigger, {
				ref: triggerRef,
				onClick: () => setIsOpen(!isOpen),
				'aria-expanded': isOpen,
				'aria-haspopup': true,
			})}

			<AnimatePresence>
				{isOpen && (
					<motion.div
						ref={dropdownRef}
						className={`
							min-w-[12rem] rounded-lg border border-[var(--c-dropdown-border,var(--c-border))] 
							bg-[var(--c-dropdown-bg,var(--c-surface))] py-1 shadow-lg backdrop-blur-sm
							${className}
						`}
						style={getPositionStyle()}
						variants={variants}
						initial="hidden"
						animate="visible"
						exit="exit"
					>
					{items.map((item, index) => {
						if (item === 'separator') {
							return (
								<div
									key={`separator-${index}`}
									className="my-1 h-px bg-[var(--c-border)]"
								/>
							)
						}

						const ItemComponent = item.href ? 'a' : 'button'
						const itemClasses = [
							'flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors',
							item.disabled
								? 'cursor-not-allowed text-[var(--c-text-secondary)]/50'
								: item.variant === DropdownItemVariant.Destructive
								? 'text-[var(--c-error,#ef4444)] hover:bg-[var(--c-error-light,#fee2e2)] hover:text-[var(--c-error-hover,#dc2626)] dark:text-[var(--c-error,#ef4444)] dark:hover:bg-[var(--c-error-light,#fee2e2)]'
								: 'text-[var(--c-text)] hover:bg-[var(--c-dropdown-hover,var(--c-hover))]',
						].join(' ')

						return (
							<ItemComponent
								key={item.key}
								className={itemClasses}
								onClick={() => handleItemClick(item)}
								href={item.href}
								disabled={item.disabled}
							>
								{item.icon && (
									<span className="flex-shrink-0">
										{item.icon}
									</span>
								)}
								{item.label}
							</ItemComponent>
													)
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

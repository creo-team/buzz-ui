"use client"
import * as React from 'react'

export interface DropdownItem {
	key: string
	label: React.ReactNode
	icon?: React.ReactNode
	onClick?: () => void
	href?: string
	disabled?: boolean
	variant?: 'default' | 'destructive'
}

export interface DropdownProps {
	trigger: React.ReactElement
	items: (DropdownItem | 'separator')[]
	align?: 'start' | 'center' | 'end'
	side?: 'top' | 'right' | 'bottom' | 'left'
	sideOffset?: number
	className?: string
}

export function Dropdown({
	trigger,
	items,
	align = 'start',
	side = 'bottom',
	sideOffset = 4,
	className = '',
}: DropdownProps) {
	const [isOpen, setIsOpen] = React.useState(false)
	const dropdownRef = React.useRef<HTMLDivElement>(null)
	const triggerRef = React.useRef<HTMLElement>(null)

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

	const getPositionClasses = () => {
		const alignClasses = {
			start: 'left-0',
			center: 'left-1/2 -translate-x-1/2',
			end: 'right-0',
		}

		const sideClasses = {
			top: `bottom-full mb-${sideOffset}`,
			right: `left-full ml-${sideOffset}`,
			bottom: `top-full mt-${sideOffset}`,
			left: `right-full mr-${sideOffset}`,
		}

		return `${alignClasses[align]} ${sideClasses[side]}`
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

			{isOpen && (
				<div
					ref={dropdownRef}
					className={`
						absolute z-50 min-w-[12rem] rounded-lg border border-[var(--c-border)] 
						bg-[var(--c-surface)] py-1 shadow-lg backdrop-blur-sm
						${getPositionClasses()}
						${className}
					`}
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
								: item.variant === 'destructive'
								? 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50'
								: 'text-[var(--c-text)] hover:bg-[var(--c-hover)]',
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
				</div>
			)}
		</div>
	)
}

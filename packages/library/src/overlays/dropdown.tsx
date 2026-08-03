"use client"
import * as React from 'react'
import { Portal } from '../internal/portal.js'
import { cx } from '../internal/cx.js'
import { composeRefs } from '../internal/compose-refs.js'
import { usePosition, type Side, type Align } from '../internal/use-position.js'
import { useDismissableLayer } from '../internal/use-dismissable-layer.js'
import { usePresence } from '../internal/use-presence.js'

export enum DropdownItemVariant {
	Default = 'default',
	Destructive = 'destructive',
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
	align?: Align
	side?: Side
	sideOffset?: number
	className?: string
	/** Controlled open state. */
	open?: boolean
	/** Initial open state for uncontrolled usage. */
	defaultOpen?: boolean
	onOpenChange?: (open: boolean) => void
}

/**
 * Menu attached to a trigger element (WAI-ARIA menu pattern):
 * - full keyboard support: arrows, Home/End, Enter/Space, Escape, typeahead
 * - rendered in a portal with collision-aware positioning
 * - focus returns to the trigger on close
 */
export function Dropdown({
	trigger,
	items,
	align = 'start',
	side = 'bottom',
	sideOffset = 4,
	className,
	open: openProp,
	defaultOpen = false,
	onOpenChange,
}: DropdownProps) {
	const menuId = React.useId()
	const triggerRef = React.useRef<HTMLElement | null>(null)
	const menuRef = React.useRef<HTMLDivElement | null>(null)
	const itemRefs = React.useRef<(HTMLElement | null)[]>([])
	const typeahead = React.useRef({ buffer: '', at: 0 })

	const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
	const open = openProp ?? internalOpen
	const setOpen = React.useCallback(
		(next: boolean) => {
			setInternalOpen(next)
			onOpenChange?.(next)
		},
		[onOpenChange]
	)

	const mounted = usePresence(open, 140)
	const { x, y, side: actualSide, ready } = usePosition(triggerRef, menuRef, {
		open: mounted,
		side,
		align,
		sideOffset,
	})

	useDismissableLayer({
		enabled: open,
		onDismiss: () => setOpen(false),
		refs: [menuRef, triggerRef],
	})

	const enabledItems = items.filter(
		(item): item is DropdownItem => item !== 'separator' && !item.disabled
	)

	const focusItem = React.useCallback((index: number) => {
		const target = itemRefs.current[index]
		target?.focus()
	}, [])

	// Focus management on open/close. `wasOpen` guards the close branch so the
	// initial mount never steals focus from the page.
	const openedByKeyboard = React.useRef<'first' | 'last' | null>(null)
	const wasOpen = React.useRef(false)
	React.useEffect(() => {
		if (open) {
			wasOpen.current = true
			const frame = requestAnimationFrame(() => {
				if (openedByKeyboard.current === 'last') focusItem(enabledItems.length - 1)
				else focusItem(0)
				openedByKeyboard.current = null
			})
			return () => cancelAnimationFrame(frame)
		}
		if (wasOpen.current) {
			wasOpen.current = false
			triggerRef.current?.focus?.()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open])

	const activateItem = (item: DropdownItem) => {
		if (item.disabled) return
		item.onClick?.()
		setOpen(false)
	}

	const handleMenuKeyDown = (event: React.KeyboardEvent) => {
		const currentIndex = itemRefs.current.findIndex(el => el === document.activeElement)
		const count = enabledItems.length
		if (count === 0) return

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				focusItem(currentIndex < 0 ? 0 : (currentIndex + 1) % count)
				break
			case 'ArrowUp':
				event.preventDefault()
				focusItem(currentIndex < 0 ? count - 1 : (currentIndex - 1 + count) % count)
				break
			case 'Home':
				event.preventDefault()
				focusItem(0)
				break
			case 'End':
				event.preventDefault()
				focusItem(count - 1)
				break
			case 'Tab':
				// Menus close on Tab rather than cycling focus.
				setOpen(false)
				break
			default: {
				if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
					const now = Date.now()
					const state = typeahead.current
					state.buffer = now - state.at > 500 ? event.key : state.buffer + event.key
					state.at = now
					const query = state.buffer.toLowerCase()
					const startAt = currentIndex >= 0 ? currentIndex : 0
					for (let offset = 0; offset < count; offset++) {
						const index = (startAt + offset + (state.buffer.length === 1 ? 1 : 0)) % count
						const label = labelText(enabledItems[index].label)
						if (label.toLowerCase().startsWith(query)) {
							focusItem(index)
							break
						}
					}
				}
			}
		}
	}

	const triggerElement = React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
		ref: composeRefs(
			triggerRef,
			(trigger.props as { ref?: React.Ref<HTMLElement> }).ref ??
				(trigger as unknown as { ref?: React.Ref<HTMLElement> }).ref
		),
		'aria-haspopup': 'menu',
		'aria-expanded': open,
		'aria-controls': open ? menuId : undefined,
		onClick: (event: React.MouseEvent) => {
			;(trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(event)
			setOpen(!open)
		},
		onKeyDown: (event: React.KeyboardEvent) => {
			;(trigger.props as { onKeyDown?: (e: React.KeyboardEvent) => void }).onKeyDown?.(event)
			if (event.key === 'ArrowDown' || (!open && (event.key === 'Enter' || event.key === ' '))) {
				event.preventDefault()
				openedByKeyboard.current = 'first'
				setOpen(true)
			} else if (event.key === 'ArrowUp') {
				event.preventDefault()
				openedByKeyboard.current = 'last'
				setOpen(true)
			}
		},
	})

	let enabledIndex = -1

	return (
		<>
			{triggerElement}
			{mounted && (
				<Portal>
					<div
						ref={menuRef}
						id={menuId}
						role="menu"
						aria-orientation="vertical"
						className={cx('bz-menu', className)}
						data-side={actualSide}
						data-state={open ? 'open' : 'closed'}
						style={{ position: 'fixed', left: x, top: y, visibility: ready ? undefined : 'hidden' }}
						onKeyDown={handleMenuKeyDown}
					>
						{items.map((item, index) => {
							if (item === 'separator') {
								return <div key={`separator-${index}`} role="separator" className="bz-menu__separator" />
							}
							const isDisabled = Boolean(item.disabled)
							if (!isDisabled) enabledIndex++
							const refIndex = enabledIndex
							const commonProps = {
								role: 'menuitem' as const,
								tabIndex: -1,
								className: 'bz-menu__item',
								'data-variant': (item.variant as string) ?? 'default',
								'aria-disabled': isDisabled || undefined,
								'data-disabled': isDisabled || undefined,
								ref: isDisabled
									? undefined
									: (el: HTMLElement | null) => {
											itemRefs.current[refIndex] = el
										},
							}
							const content = (
								<>
									{item.icon != null && <span className="bz-menu__item-icon">{item.icon}</span>}
									<span className="bz-menu__item-label">{item.label}</span>
								</>
							)
							return item.href && !isDisabled ? (
								<a key={item.key} href={item.href} {...commonProps} onClick={() => activateItem(item)}>
									{content}
								</a>
							) : (
								<button
									key={item.key}
									type="button"
									disabled={isDisabled}
									{...commonProps}
									onClick={() => activateItem(item)}
								>
									{content}
								</button>
							)
						})}
					</div>
				</Portal>
			)}
		</>
	)
}

function labelText(node: React.ReactNode): string {
	if (typeof node === 'string' || typeof node === 'number') return String(node)
	if (Array.isArray(node)) return node.map(labelText).join('')
	if (React.isValidElement(node)) return labelText((node.props as { children?: React.ReactNode }).children)
	return ''
}

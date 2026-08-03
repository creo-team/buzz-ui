"use client"
import * as React from 'react'
import { cx } from '../internal/cx.js'
import { useControllableState } from '../internal/use-controllable-state.js'

export enum TabsVariant {
	Default = 'default',
	Pills = 'pills',
	Underline = 'underline',
	Buttons = 'buttons',
	Glass = 'glass',
}

export enum TabsSize {
	Small = 'sm',
	Medium = 'md',
	Large = 'lg',
}

export interface TabItem {
	key: string
	label: React.ReactNode
	icon?: React.ReactNode
	badge?: string | number
	disabled?: boolean
}

interface TabsContextValue {
	baseId: string
	value: string
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export interface TabsProps {
	items: TabItem[]
	/** Controlled selected key. */
	value?: string
	/** Initial key for uncontrolled usage. */
	defaultValue?: string
	onChange?: (key: string) => void
	variant?: TabsVariant | `${TabsVariant}`
	size?: TabsSize | `${TabsSize}`
	fullWidth?: boolean
	/**
	 * 'auto' selects a tab as focus moves to it (default); 'manual' requires
	 * Enter/Space — better when switching panels is expensive.
	 */
	activationMode?: 'auto' | 'manual'
	className?: string
	/** Render `<TabPanel>` children to get automatic aria wiring. */
	children?: React.ReactNode
}

/**
 * Tab list following the WAI-ARIA tabs pattern: roving tabindex, arrow-key
 * navigation, Home/End, automatic or manual activation, and full
 * `aria-controls`/`aria-labelledby` wiring when combined with `<TabPanel>`.
 */
export function Tabs({
	items,
	value: valueProp,
	defaultValue,
	onChange,
	variant = TabsVariant.Default,
	size = TabsSize.Medium,
	fullWidth = false,
	activationMode = 'auto',
	className,
	children,
}: TabsProps) {
	const baseId = React.useId()
	const [value, setValue] = useControllableState({
		value: valueProp,
		defaultValue: defaultValue ?? items.find(item => !item.disabled)?.key ?? '',
		onChange,
	})
	const tabRefs = React.useRef(new Map<string, HTMLButtonElement>())

	const enabledItems = items.filter(item => !item.disabled)

	const handleKeyDown = (event: React.KeyboardEvent, currentKey: string) => {
		const currentIndex = enabledItems.findIndex(item => item.key === currentKey)
		if (currentIndex === -1) return
		let nextIndex: number | null = null

		switch (event.key) {
			case 'ArrowRight':
				nextIndex = (currentIndex + 1) % enabledItems.length
				break
			case 'ArrowLeft':
				nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length
				break
			case 'Home':
				nextIndex = 0
				break
			case 'End':
				nextIndex = enabledItems.length - 1
				break
			case 'Enter':
			case ' ':
				if (activationMode === 'manual') {
					event.preventDefault()
					setValue(currentKey)
				}
				return
			default:
				return
		}

		event.preventDefault()
		const nextKey = enabledItems[nextIndex].key
		tabRefs.current.get(nextKey)?.focus()
		if (activationMode === 'auto') setValue(nextKey)
	}

	const tablist = (
		<div
			className={cx('bz-tabs', className)}
			data-variant={variant as string}
			data-size={size as string}
			data-full-width={fullWidth || undefined}
			role="tablist"
			aria-orientation="horizontal"
		>
			{items.map(item => {
				const selected = value === item.key
				// If `value` matches no enabled tab, the first enabled tab stays
				// reachable so the tablist never becomes keyboard-inaccessible.
				const hasSelection = enabledItems.some(enabled => enabled.key === value)
				const focusable = selected || (!hasSelection && enabledItems[0]?.key === item.key)
				return (
					<button
						key={item.key}
						ref={el => {
							if (el) tabRefs.current.set(item.key, el)
							else tabRefs.current.delete(item.key)
						}}
						id={`${baseId}-tab-${item.key}`}
						type="button"
						role="tab"
						aria-selected={selected}
						aria-controls={children != null ? `${baseId}-panel-${item.key}` : undefined}
						aria-disabled={item.disabled}
						disabled={item.disabled}
						tabIndex={focusable ? 0 : -1}
						className="bz-tabs__tab"
						data-state={selected ? 'active' : 'inactive'}
						onClick={() => !item.disabled && setValue(item.key)}
						onKeyDown={event => handleKeyDown(event, item.key)}
					>
						{item.icon != null && <span className="bz-tabs__icon">{item.icon}</span>}
						<span className="bz-tabs__label">{item.label}</span>
						{item.badge !== undefined && <span className="bz-tabs__badge">{item.badge}</span>}
					</button>
				)
			})}
		</div>
	)

	if (children == null) return tablist

	return (
		<TabsContext.Provider value={{ baseId, value }}>
			{tablist}
			{children}
		</TabsContext.Provider>
	)
}

export interface TabPanelProps {
	value: string
	/** Optional when rendered inside `<Tabs>` (read from context). */
	selectedValue?: string
	children: React.ReactNode
	className?: string
	/** Keep the panel mounted (hidden) when inactive. */
	keepMounted?: boolean
}

/** Content panel for a tab. Wire-up is automatic inside `<Tabs>`. */
export function TabPanel({ value, selectedValue, children, className, keepMounted = false }: TabPanelProps) {
	const context = React.useContext(TabsContext)
	const selected = (selectedValue ?? context?.value) === value
	if (!selected && !keepMounted) return null

	return (
		<div
			role="tabpanel"
			id={context ? `${context.baseId}-panel-${value}` : undefined}
			aria-labelledby={context ? `${context.baseId}-tab-${value}` : undefined}
			tabIndex={0}
			hidden={!selected}
			className={cx('bz-tab-panel', className)}
		>
			{children}
		</div>
	)
}

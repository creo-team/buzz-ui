"use client"
import * as React from 'react'
import { Portal } from '../internal/portal.js'
import { cx } from '../internal/cx.js'
import { useScrollLock } from '../internal/use-scroll-lock.js'
import { useFocusTrap } from '../internal/use-focus-trap.js'
import { useDismissableLayer } from '../internal/use-dismissable-layer.js'
import { usePresence } from '../internal/use-presence.js'
import { useHotkey, type HotkeyConfig } from '../hooks/use-hotkey.js'
import { IconSearch } from '../internal/icons.js'
import { Kbd } from '../primitives/kbd.js'

export interface CommandItem {
	id: string
	label: string
	description?: string
	icon?: React.ReactNode
	keywords?: string[]
	onSelect: () => void
	group?: string
}

export interface CommandPaletteProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	items: CommandItem[]
	placeholder?: string
	emptyMessage?: string
	/** Additional hotkeys active while the palette is open. */
	hotkeys?: HotkeyConfig[]
	className?: string
}

/**
 * Command palette (⌘K-style) implementing the ARIA combobox + listbox
 * pattern: the input carries `aria-activedescendant` while arrow keys move
 * the highlight through grouped, filtered results.
 */
export function CommandPalette({
	open,
	onOpenChange,
	items,
	placeholder = 'Type a command or search…',
	emptyMessage = 'No results found.',
	hotkeys = [],
	className,
}: CommandPaletteProps) {
	const baseId = React.useId()
	const listId = `${baseId}-list`
	const [search, setSearch] = React.useState('')
	const [activeIndex, setActiveIndex] = React.useState(0)
	const panelRef = React.useRef<HTMLDivElement>(null)
	const inputRef = React.useRef<HTMLInputElement>(null)
	const mounted = usePresence(open, 140)

	const requestClose = React.useCallback(() => onOpenChange(false), [onOpenChange])

	useScrollLock(mounted)
	useFocusTrap(panelRef, open, { initialFocusRef: inputRef })
	useDismissableLayer({
		enabled: open,
		onDismiss: requestClose,
		refs: [panelRef],
	})
	useHotkey(hotkeys.map(h => ({ ...h, enabled: open && (h.enabled ?? true) })))

	// Reset the query each time the palette opens.
	React.useEffect(() => {
		if (open) {
			setSearch('')
			setActiveIndex(0)
		}
	}, [open])

	const filtered = React.useMemo(() => {
		if (!search.trim()) return items
		const query = search.toLowerCase()
		return items.filter(item => {
			return (
				item.label.toLowerCase().includes(query) ||
				item.description?.toLowerCase().includes(query) ||
				item.keywords?.some(keyword => keyword.toLowerCase().includes(query))
			)
		})
	}, [items, search])

	// Group while preserving a flat, navigable order (with an index map so
	// per-option lookups stay O(1)).
	const { groups, flat, indexOf } = React.useMemo(() => {
		const map = new Map<string, CommandItem[]>()
		for (const item of filtered) {
			const group = item.group ?? 'Commands'
			const list = map.get(group) ?? []
			list.push(item)
			map.set(group, list)
		}
		const flatOrder: CommandItem[] = []
		for (const list of map.values()) flatOrder.push(...list)
		const indexMap = new Map<CommandItem, number>()
		flatOrder.forEach((item, index) => indexMap.set(item, index))
		return { groups: map, flat: flatOrder, indexOf: indexMap }
	}, [filtered])

	React.useEffect(() => {
		setActiveIndex(0)
	}, [search])

	const activeItem = flat[activeIndex]

	const select = (item: CommandItem) => {
		item.onSelect()
		requestClose()
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				setActiveIndex(index => Math.min(index + 1, flat.length - 1))
				break
			case 'ArrowUp':
				event.preventDefault()
				setActiveIndex(index => Math.max(index - 1, 0))
				break
			case 'Home':
				event.preventDefault()
				setActiveIndex(0)
				break
			case 'End':
				event.preventDefault()
				setActiveIndex(Math.max(flat.length - 1, 0))
				break
			case 'Enter':
				event.preventDefault()
				if (activeItem) select(activeItem)
				break
		}
	}

	// Keep the highlighted option in view.
	React.useEffect(() => {
		if (!activeItem) return
		document.getElementById(`${baseId}-option-${activeItem.id}`)?.scrollIntoView({ block: 'nearest' })
	}, [activeIndex, activeItem, baseId])

	if (!mounted) return null
	const state = open ? 'open' : 'closed'

	return (
		<Portal>
			<div className="bz-command" data-state={state}>
				<div className="bz-command__backdrop" data-state={state} />
				<div
					ref={panelRef}
					role="dialog"
					aria-modal="true"
					aria-label="Command palette"
					className={cx('bz-command__panel', className)}
					data-state={state}
				>
					<div className="bz-command__input-row">
						<IconSearch className="bz-command__search-icon" />
						<input
							ref={inputRef}
							className="bz-command__input"
							role="combobox"
							aria-expanded="true"
							aria-controls={listId}
							aria-activedescendant={activeItem ? `${baseId}-option-${activeItem.id}` : undefined}
							aria-autocomplete="list"
							placeholder={placeholder}
							value={search}
							onChange={event => setSearch(event.target.value)}
							onKeyDown={handleKeyDown}
							data-autofocus
						/>
					</div>
					<div className="bz-visually-hidden" role="status" aria-live="polite">
						{flat.length === 0
							? emptyMessage
							: `${flat.length} result${flat.length === 1 ? '' : 's'}`}
					</div>
					<div id={listId} role="listbox" aria-label="Commands" className="bz-command__list">
						{flat.length === 0 ? (
							<div className="bz-command__empty">{emptyMessage}</div>
						) : (
							Array.from(groups.entries()).map(([group, groupItems]) => (
								<div key={group} className="bz-command__group" role="group" aria-label={group}>
									<div className="bz-command__group-label" aria-hidden="true">
										{group}
									</div>
									{groupItems.map(item => {
										const index = indexOf.get(item) ?? 0
										const isActive = index === activeIndex
										return (
											<div
												key={item.id}
												id={`${baseId}-option-${item.id}`}
												role="option"
												aria-selected={isActive}
												className="bz-command__option"
												data-active={isActive || undefined}
												onPointerMove={() => setActiveIndex(index)}
												onClick={() => select(item)}
											>
												{item.icon != null && <span className="bz-command__option-icon">{item.icon}</span>}
												<span className="bz-command__option-text">
													<span className="bz-command__option-label">{item.label}</span>
													{item.description && (
														<span className="bz-command__option-description">{item.description}</span>
													)}
												</span>
											</div>
										)
									})}
								</div>
							))
						)}
					</div>
					<div className="bz-command__footer">
						<span className="bz-command__hint">
							<Kbd>↑</Kbd>
							<Kbd>↓</Kbd> navigate
						</span>
						<span className="bz-command__hint">
							<Kbd>↵</Kbd> select
						</span>
						<span className="bz-command__hint">
							<Kbd>Esc</Kbd> close
						</span>
					</div>
				</div>
			</div>
		</Portal>
	)
}

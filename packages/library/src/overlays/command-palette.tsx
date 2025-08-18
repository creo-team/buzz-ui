"use client"
import * as React from 'react'
import { useHotkey, type HotkeyConfig } from '../hooks/use-hotkey'

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
	/** Additional hotkeys for command palette actions */
	hotkeys?: HotkeyConfig[]
}

export function CommandPalette({
	open,
	onOpenChange,
	items,
	placeholder = "Type a command or search...",
	emptyMessage = "No results found.",
	hotkeys = []
}: CommandPaletteProps) {
	const [search, setSearch] = React.useState('')
	const [selectedIndex, setSelectedIndex] = React.useState(0)
	const inputRef = React.useRef<HTMLInputElement>(null)
	const listRef = React.useRef<HTMLDivElement>(null)

	// Filter items based on search
	const filteredItems = React.useMemo(() => {
		if (!search.trim()) return items

		const searchLower = search.toLowerCase()
		return items.filter(item => {
			const labelMatch = item.label.toLowerCase().includes(searchLower)
			const descriptionMatch = item.description?.toLowerCase().includes(searchLower)
			const keywordMatch = item.keywords?.some(keyword => 
				keyword.toLowerCase().includes(searchLower)
			)
			return labelMatch || descriptionMatch || keywordMatch
		})
	}, [items, search])

	// Group filtered items
	const groupedItems = React.useMemo(() => {
		const groups: Record<string, CommandItem[]> = {}
		
		filteredItems.forEach(item => {
			const group = item.group || 'Commands'
			if (!groups[group]) {
				groups[group] = []
			}
			groups[group].push(item)
		})

		return groups
	}, [filteredItems])

	// Set up hotkeys when command palette is open
	useHotkey([
		{
			key: 'escape',
			action: () => onOpenChange(false),
			enabled: open
		},
		{
			key: 'arrowdown',
			action: () => setSelectedIndex(prev => 
				prev < filteredItems.length - 1 ? prev + 1 : prev
			),
			enabled: open
		},
		{
			key: 'arrowup',
			action: () => setSelectedIndex(prev => prev > 0 ? prev - 1 : prev),
			enabled: open
		},
		{
			key: 'enter',
			action: () => {
				if (filteredItems[selectedIndex]) {
					filteredItems[selectedIndex].onSelect()
					onOpenChange(false)
				}
			},
			enabled: open
		},
		...hotkeys.map(hotkey => ({
			...hotkey,
			enabled: open && (hotkey.enabled ?? true)
		}))
	])

	// Reset selected index when items change
	React.useEffect(() => {
		setSelectedIndex(0)
	}, [filteredItems])

	// Focus input when opened
	React.useEffect(() => {
		if (open && inputRef.current) {
			inputRef.current.focus()
		}
	}, [open])



	if (!open) return null

	return (
		<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
			<div className="flex min-h-full items-start justify-center p-4 pt-[10vh]">
				<div className="w-full max-w-xl rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)] shadow-2xl">
					{/* Search Input */}
					<div className="border-b border-[var(--c-border)] p-4">
						<div className="relative">
							<svg
								className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--c-text-secondary)]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								ref={inputRef}
								type="text"
								className="w-full rounded-lg border-0 bg-transparent py-2 pl-10 pr-4 text-[var(--c-text)] placeholder-[var(--c-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--c-primary)] focus:ring-offset-2 focus:ring-offset-[var(--c-surface)]"
								placeholder={placeholder}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>

					{/* Results */}
					<div ref={listRef} className="max-h-80 overflow-y-auto p-2">
						{Object.keys(groupedItems).length === 0 ? (
							<div className="flex flex-col items-center justify-center py-8 text-center">
								<div className="text-[var(--c-text-secondary)]">
									{emptyMessage}
								</div>
							</div>
						) : (
							Object.entries(groupedItems).map(([group, groupItems]) => (
								<div key={group} className="mb-4 last:mb-0">
									<div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-[var(--c-text-secondary)]">
										{group}
									</div>
									{groupItems.map((item, itemIndex) => {
										const globalIndex = filteredItems.indexOf(item)
										const isSelected = globalIndex === selectedIndex

										return (
											<button
												key={item.id}
												className={`
													w-full rounded-lg px-3 py-2 text-left transition-colors
													${isSelected
														? 'bg-[var(--c-primary-light)] text-[var(--c-text)]'
														: 'text-[var(--c-text)] hover:bg-[var(--c-hover)]'
													}
												`}
												onClick={() => {
													item.onSelect()
													onOpenChange(false)
												}}
											>
												<div className="flex items-center gap-3">
													{item.icon && (
														<span className="flex-shrink-0 text-[var(--c-text-secondary)]">
															{item.icon}
														</span>
													)}
													<div className="flex-1 min-w-0">
														<div className="font-medium">
															{item.label}
														</div>
														{item.description && (
															<div className="text-sm text-[var(--c-text-secondary)] truncate">
																{item.description}
															</div>
														)}
													</div>
												</div>
											</button>
										)
									})}
								</div>
							))
						)}
					</div>

					{/* Footer */}
					<div className="border-t border-[var(--c-border)] px-4 py-2 text-xs text-[var(--c-text-secondary)]">
						<div className="flex items-center justify-between">
							<div>
								Use ↑↓ to navigate, ↵ to select, ESC to close
							</div>
							<div>
								{filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

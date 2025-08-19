"use client"

import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

export interface SidebarNavItem {
	key: string
	label: string
	href: string
	description?: string
	badge?: string
	icon?: React.ReactNode
}

export interface SidebarNavEnhancedProps {
	items: SidebarNavItem[]
	title?: string
	className?: string
	sortAlphabetically?: boolean
	showSearch?: boolean
	groupBy?: (item: SidebarNavItem) => string
	variant?: 'default' | 'compact' | 'spacious'
	stickyHeader?: boolean
	currentPath?: string
	linkComponent?: React.ComponentType<{ href: string; className: string; children: React.ReactNode }>
	scrollable?: boolean
}

// Default link component that renders a simple anchor tag
const DefaultLink: React.FC<{ href: string; className: string; children: React.ReactNode }> = ({ href, className, children }) => (
	<a href={href} className={className}>
		{children}
	</a>
)

export function SidebarNavEnhanced({ 
	items, 
	title = "Navigation",
	className = "",
	sortAlphabetically = false,
	showSearch = true,
	groupBy,
	variant = 'default',
	stickyHeader = true,
	currentPath = '',
	linkComponent: LinkComponent = DefaultLink,
	scrollable = false
}: SidebarNavEnhancedProps) {
	const [searchQuery, setSearchQuery] = useState('')

	// Filter and sort items
	const processedItems = useMemo(() => {
		let filtered = items

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase()
			filtered = items.filter(item => {
				const matchLabel = item.label.toLowerCase().includes(query)
				const matchDescription = item.description?.toLowerCase().includes(query)
				const matchHref = item.href.toLowerCase().includes(query)
				return matchLabel || matchDescription || matchHref
			})
			
			// Sort by relevance when searching
			filtered.sort((a, b) => {
				const aLabelMatch = a.label.toLowerCase().startsWith(query) ? 2 : a.label.toLowerCase().includes(query) ? 1 : 0
				const bLabelMatch = b.label.toLowerCase().startsWith(query) ? 2 : b.label.toLowerCase().includes(query) ? 1 : 0
				return bLabelMatch - aLabelMatch
			})
		} else if (sortAlphabetically) {
			// Sort alphabetically when not searching
			filtered = [...filtered].sort((a, b) => a.label.localeCompare(b.label))
		}

		return filtered
	}, [items, searchQuery, sortAlphabetically])

	// Group items if groupBy function is provided
	const groupedItems = useMemo(() => {
		if (!groupBy) return null

		const groups = new Map<string, SidebarNavItem[]>()
		processedItems.forEach(item => {
			const group = groupBy(item)
			if (!groups.has(group)) {
				groups.set(group, [])
			}
			groups.get(group)!.push(item)
		})

		return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
	}, [processedItems, groupBy])

	const getPaddingClass = () => {
		switch (variant) {
			case 'compact': return 'px-2 py-1.5'
			case 'spacious': return 'px-4 py-3'
			default: return 'px-3 py-2'
		}
	}

	const getTextClass = () => {
		switch (variant) {
			case 'compact': return 'text-xs'
			case 'spacious': return 'text-base'
			default: return 'text-sm'
		}
	}

	const renderItem = (item: SidebarNavItem) => {
		const isActive = currentPath === item.href
		const isPartialMatch = currentPath.startsWith(item.href) && item.href !== '/'
		
		const linkClassName = [
			'block rounded-xl transition-all duration-200 no-underline',
			getPaddingClass(),
			getTextClass(),
			isActive 
				? 'bg-[var(--c-primary)]/10 text-[var(--c-primary)] font-medium shadow-sm ring-1 ring-[var(--c-primary)]/20' 
				: isPartialMatch
				? 'bg-[var(--c-hover)]/50 text-[var(--c-text)] hover:bg-[var(--c-hover)]'
				: 'text-[var(--c-text-secondary)] hover:bg-[var(--c-hover)]/40 hover:text-[var(--c-text)]',
		].join(' ')
		
		const content = (
			<div className="flex items-center gap-3">
				{item.icon && (
					<span className="flex-shrink-0 opacity-75">
						{item.icon}
					</span>
				)}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2">
						<span className="truncate">{item.label}</span>
						{item.badge && (
							<span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-medium bg-[var(--c-primary)] text-[var(--c-on-primary)] rounded-full">
								{item.badge}
							</span>
						)}
					</div>
					{item.description && variant === 'spacious' && (
						<div className="text-xs text-[var(--c-text-muted)] mt-0.5 truncate">
							{item.description}
						</div>
					)}
				</div>
			</div>
		)
		
		return (
			<LinkComponent
				key={item.key}
				href={item.href}
				className={linkClassName}
			>
				{content}
			</LinkComponent>
		)
	}

	const navContent = (
		<nav className="space-y-1">
			{(title || showSearch) && (
				<div className={`mb-4 ${stickyHeader ? 'sticky top-0 bg-[var(--c-background)] z-10' : ''}`}>
					{title && (
						<h3 className={`font-semibold text-[var(--c-text)] ${getPaddingClass()} mb-2`}>
							{title}
						</h3>
					)}
					
					{showSearch && (
						<div className={`relative ${getPaddingClass()}`}>
							<Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--c-text-muted)]" />
							<input
								type="text"
								placeholder="Filter components..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className={[
									'w-full pl-10 pr-3 py-2 rounded-lg',
									'bg-[var(--c-surface)] border border-[var(--c-border)]',
									'text-[var(--c-text)] placeholder:text-[var(--c-text-muted)]',
									'focus:outline-none focus:border-[var(--c-primary)] focus:ring-1 focus:ring-[var(--c-primary-ring)]',
									getTextClass()
								].join(' ')}
							/>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery('')}
									className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--c-text-muted)] hover:text-[var(--c-text)]"
								>
									<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							)}
						</div>
					)}
				</div>
			)}

			{processedItems.length === 0 && searchQuery && (
				<div className={`text-center ${getPaddingClass()} text-[var(--c-text-muted)] ${getTextClass()}`}>
					No results found for "{searchQuery}"
				</div>
			)}

			{groupedItems ? (
				// Render grouped items
				groupedItems.map(([group, groupItems]) => (
					<div key={group} className="mb-4">
						<h4 className={`font-medium text-[var(--c-text-secondary)] ${getPaddingClass()} mb-1 ${getTextClass()}`}>
							{group}
						</h4>
						{groupItems.map(renderItem)}
					</div>
				))
			) : (
				// Render flat list
				processedItems.map(renderItem)
			)}
		</nav>
	)
	
	return scrollable ? (
		<div className={`overflow-y-auto ${className}`}>
			{navContent}
		</div>
	) : (
		<div className={className}>
			{navContent}
		</div>
	)
}
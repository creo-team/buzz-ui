"use client"

import * as React from 'react'
import { cx } from '../internal/cx.js'
import { IconSearch, IconX } from '../internal/icons.js'

/** Density of the nav list. */
export enum SidebarNavVariant {
	Default = 'default',
	/** Tighter padding, smaller text. */
	Compact = 'compact',
	/** Roomier padding, larger text — and item descriptions become visible. */
	Spacious = 'spacious',
}

/** One link in a {@link SidebarNav}. */
export interface SidebarNavItem {
	key: string
	label: string
	href: string
	/** Secondary line — shown only in the `spacious` variant, but always searchable. */
	description?: string
	/** Small tag rendered after the label (a count, "New", …). */
	badge?: string
	icon?: React.ReactNode
}

/** Props for {@link SidebarNav}. */
export interface SidebarNavProps {
	items: SidebarNavItem[]
	/** Accessible name of the nav, and the heading above it. @default 'Navigation' */
	title?: string
	className?: string
	/** Sort items by label. Ignored while a filter query is active — relevance wins. */
	sortAlphabetically?: boolean
	/** Render the filter input. @default true */
	showSearch?: boolean
	/** Group items under headings by the returned name. */
	groupBy?: (item: SidebarNavItem) => string
	/**
	 * Explicit group ordering for `groupBy` — groups appear in this order,
	 * with unlisted groups after, alphabetically. Without it, all groups
	 * sort alphabetically.
	 */
	groupOrder?: string[]
	/** Density preset. @default 'default' */
	variant?: SidebarNavVariant | `${SidebarNavVariant}`
	/** Keep the title and search pinned while the list scrolls. @default true */
	stickyHeader?: boolean
	/** Current route — an exact `href` match highlights as active, a prefix match as partial. */
	currentPath?: string
	/** Custom link renderer (e.g. Next.js `Link`). Defaults to `<a>`. */
	linkComponent?: React.ComponentType<{ href: string; className: string; children: React.ReactNode; 'aria-current'?: 'page' }>
	/** Scroll the nav itself, capped near the viewport height. */
	scrollable?: boolean
}

const DefaultLink: NonNullable<SidebarNavProps['linkComponent']> = ({ href, ...props }) => (
	<a href={href} {...props} />
)

/**
 * Filterable sidebar navigation with grouping, active-route highlighting and
 * framework-agnostic links.
 */
export function SidebarNav({
	items,
	title = 'Navigation',
	className,
	sortAlphabetically = false,
	showSearch = true,
	groupBy,
	groupOrder,
	variant = SidebarNavVariant.Default,
	stickyHeader = true,
	currentPath = '',
	linkComponent: LinkComponent = DefaultLink,
	scrollable = false,
}: SidebarNavProps) {
	const [query, setQuery] = React.useState('')
	const searchId = React.useId()

	const processed = React.useMemo(() => {
		let filtered = items
		if (query) {
			const lower = query.toLowerCase()
			filtered = items.filter(
				item =>
					item.label.toLowerCase().includes(lower) ||
					item.description?.toLowerCase().includes(lower) ||
					item.href.toLowerCase().includes(lower)
			)
			filtered = [...filtered].sort((a, b) => {
				const score = (item: SidebarNavItem) =>
					item.label.toLowerCase().startsWith(lower) ? 2 : item.label.toLowerCase().includes(lower) ? 1 : 0
				return score(b) - score(a)
			})
		} else if (sortAlphabetically) {
			filtered = [...filtered].sort((a, b) => a.label.localeCompare(b.label))
		}
		return filtered
	}, [items, query, sortAlphabetically])

	const grouped = React.useMemo(() => {
		if (!groupBy) return null
		const groups = new Map<string, SidebarNavItem[]>()
		for (const item of processed) {
			const group = groupBy(item)
			const list = groups.get(group) ?? []
			list.push(item)
			groups.set(group, list)
		}
		return Array.from(groups.entries()).sort(([a], [b]) => {
			const indexA = groupOrder?.indexOf(a) ?? -1
			const indexB = groupOrder?.indexOf(b) ?? -1
			if (indexA !== -1 && indexB !== -1) return indexA - indexB
			if (indexA !== -1) return -1
			if (indexB !== -1) return 1
			return a.localeCompare(b)
		})
	}, [processed, groupBy, groupOrder])

	const renderItem = (item: SidebarNavItem) => {
		const isActive = currentPath === item.href
		const isPartial = !isActive && item.href !== '/' && currentPath.startsWith(item.href)
		return (
			<LinkComponent
				key={item.key}
				href={item.href}
				aria-current={isActive ? 'page' : undefined}
				className={cx('bz-sidebar-nav__link')}
			>
				<span
					className="bz-sidebar-nav__link-inner"
					data-active={isActive || undefined}
					data-partial={isPartial || undefined}
				>
					{item.icon != null && <span className="bz-sidebar-nav__icon">{item.icon}</span>}
					<span className="bz-sidebar-nav__text">
						<span className="bz-sidebar-nav__label-row">
							<span className="bz-sidebar-nav__label">{item.label}</span>
							{item.badge && <span className="bz-sidebar-nav__badge">{item.badge}</span>}
						</span>
						{item.description && variant === SidebarNavVariant.Spacious && (
							<span className="bz-sidebar-nav__description">{item.description}</span>
						)}
					</span>
				</span>
			</LinkComponent>
		)
	}

	return (
		<div className={cx('bz-sidebar-nav', scrollable && 'bz-sidebar-nav--scrollable', className)} data-variant={variant as string}>
			<nav aria-label={title}>
				{(title || showSearch) && (
					<div className="bz-sidebar-nav__header" data-sticky={stickyHeader || undefined}>
						{title && <h3 className="bz-sidebar-nav__title">{title}</h3>}
						{showSearch && (
							<div className="bz-sidebar-nav__search">
								<IconSearch className="bz-sidebar-nav__search-icon" />
								<input
									id={searchId}
									type="text"
									placeholder="Filter…"
									aria-label={`Filter ${title.toLowerCase()}`}
									value={query}
									onChange={event => setQuery(event.target.value)}
									className="bz-sidebar-nav__search-input"
								/>
								{query && (
									<button
										type="button"
										className="bz-sidebar-nav__search-clear"
										aria-label="Clear filter"
										onClick={() => setQuery('')}
									>
										<IconX />
									</button>
								)}
							</div>
						)}
					</div>
				)}

				{processed.length === 0 && query && (
					<div className="bz-sidebar-nav__empty">No results for “{query}”</div>
				)}

				{grouped ? (
					grouped.map(([group, groupItems]) => (
						<div key={group} className="bz-sidebar-nav__group">
							<h4 className="bz-sidebar-nav__group-title">{group}</h4>
							{groupItems.map(renderItem)}
						</div>
					))
				) : (
					processed.map(renderItem)
				)}
			</nav>
		</div>
	)
}

import * as React from 'react'
import { cx } from '../internal/cx.js'

export interface Crumb {
	key: string
	label: React.ReactNode
	href?: string
}

export interface BreadcrumbsProps {
	items: Crumb[]
	/** Separator glyph between crumbs. Default '/'. */
	separator?: React.ReactNode
	/**
	 * Collapse middle crumbs into an ellipsis when there are more than this
	 * many items (first and last always stay visible).
	 */
	maxItems?: number
	className?: string
}

/**
 * Breadcrumb trail with correct landmark semantics: `nav[aria-label]`,
 * ordered list, and `aria-current="page"` on the final crumb.
 * Server-component safe.
 */
export function Breadcrumbs({ items, separator = '/', maxItems, className }: BreadcrumbsProps) {
	let visible: (Crumb | 'ellipsis')[] = items
	if (maxItems != null && maxItems >= 3 && items.length > maxItems) {
		const tailCount = maxItems - 2
		visible = [items[0], 'ellipsis', ...items.slice(items.length - tailCount)]
	}

	return (
		<nav className={cx('bz-breadcrumbs', className)} aria-label="Breadcrumb">
			<ol className="bz-breadcrumbs__list">
				{visible.map((item, index) => {
					const isLast = index === visible.length - 1
					if (item === 'ellipsis') {
						return (
							<li key="ellipsis" className="bz-breadcrumbs__item">
								<span className="bz-breadcrumbs__ellipsis" aria-hidden="true">
									…
								</span>
								<span className="bz-breadcrumbs__separator" aria-hidden="true">
									{separator}
								</span>
							</li>
						)
					}
					return (
						<li key={item.key} className="bz-breadcrumbs__item">
							{item.href && !isLast ? (
								<a className="bz-breadcrumbs__link" href={item.href}>
									{item.label}
								</a>
							) : (
								<span className="bz-breadcrumbs__current" aria-current={isLast ? 'page' : undefined}>
									{item.label}
								</span>
							)}
							{!isLast && (
								<span className="bz-breadcrumbs__separator" aria-hidden="true">
									{separator}
								</span>
							)}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}

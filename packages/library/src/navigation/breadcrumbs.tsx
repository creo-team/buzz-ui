import * as React from 'react'

export interface Crumb {
	key: string
	label: React.ReactNode
	href?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
	return (
		<nav className="text-sm text-[var(--c-text-secondary)]">
			<ol className="flex flex-wrap items-center gap-2">
				{items.map((item, idx) => (
					<li key={item.key} className="inline-flex items-center gap-2">
						{item.href ? <a className="hover:text-[var(--c-text)] transition-colors" href={item.href}>{item.label}</a> : <span className="text-[var(--c-text)]">{item.label}</span>}
						{idx < items.length - 1 && <span className="select-none text-[var(--c-text-muted)]">/</span>}
					</li>
				))}
			</ol>
		</nav>
	)
}


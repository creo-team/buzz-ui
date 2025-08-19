'use client'
import * as React from 'react'

export interface SidebarItem {
	key: string
	label: string
	href: string
}

interface SidebarNavProps {
	items: SidebarItem[]
	currentPath?: string
	title?: string
	className?: string
	scrollable?: boolean
}

export function SidebarNav({ 
	items, 
	currentPath, 
	title = "Navigation",
	className = "",
	scrollable = false
}: SidebarNavProps) {
	return (
		<nav className={`sticky top-20 hidden h-[calc(100vh-5rem)] w-64 shrink-0 ${scrollable ? 'overflow-y-auto' : 'overflow-visible'} md:block ${className}`}>
			<div className="pb-8">
				<h3 className="mb-4 text-sm font-semibold text-[var(--c-text)] px-3">{title}</h3>
				<ul className="space-y-1 text-sm">
					{items.map(item => (
						<li key={item.key}>
							<a
								href={item.href}
								aria-current={currentPath === item.href ? 'page' : undefined}
								className={[
									'no-underline block rounded-[var(--radius-md)] px-3 py-2 transition-colors',
									currentPath === item.href 
										? 'bg-[var(--c-primary-light)] text-[var(--c-primary)] border-l-2 border-[var(--c-primary)]' 
										: 'text-[var(--c-text-secondary)] hover:bg-[var(--c-hover)] hover:text-[var(--c-text)]',
								].join(' ')}
							>
								{item.label}
							</a>
						</li>
					))}
				</ul>
			</div>
		</nav>
	)
}

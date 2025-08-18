'use client'
import { usePathname } from 'next/navigation'
import { SidebarNav, type SidebarItem } from './sidebar-nav'

interface SidebarNavClientProps {
	items: SidebarItem[]
	title?: string
	className?: string
}

export function SidebarNavClient({ items, title, className }: SidebarNavClientProps) {
	const pathname = usePathname()
	
	return (
		<SidebarNav 
			items={items}
			currentPath={pathname}
			title={title}
			className={className}
		/>
	)
}

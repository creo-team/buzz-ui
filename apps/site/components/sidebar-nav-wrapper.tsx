"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarNav, type SidebarNavProps } from '@creo-team/buzz-ui/client'

// Wrapper component for Next.js Link
const NextLink: React.FC<{ href: string; className: string; children: React.ReactNode }> = ({ href, className, children }) => (
	<Link href={href} className={className}>
		{children}
	</Link>
)

export function SidebarNavWrapper(props: Omit<SidebarNavProps, 'linkComponent' | 'currentPath'>) {
	const pathname = usePathname()
	
	return (
		<SidebarNav
			{...props}
			linkComponent={NextLink}
			currentPath={pathname}
		/>
	)
}



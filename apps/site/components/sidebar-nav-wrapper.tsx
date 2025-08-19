"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarNavEnhanced, type SidebarNavEnhancedProps } from '@creo-team/buzz-ui/client'

// Wrapper component for Next.js Link
const NextLink: React.FC<{ href: string; className: string; children: React.ReactNode }> = ({ href, className, children }) => (
	<Link href={href} className={className}>
		{children}
	</Link>
)

export function SidebarNavWrapper(props: Omit<SidebarNavEnhancedProps, 'linkComponent' | 'currentPath'>) {
	const pathname = usePathname()
	
	return (
		<SidebarNavEnhanced
			{...props}
			linkComponent={NextLink}
			currentPath={pathname}
			scrollable={props.scrollable}
		/>
	)
}



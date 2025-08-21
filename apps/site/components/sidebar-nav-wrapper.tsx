"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { SidebarNav, type SidebarNavProps } from '@creo-team/buzz-ui/client' // Temporarily disabled due to React type conflicts

// Wrapper component for Next.js Link
const NextLink: React.FC<{ href: string; className: string; children: React.ReactNode }> = ({ href, className, children }) => (
	<Link href={href} className={className}>
		{children}
	</Link>
)

export function SidebarNavWrapper(props: any) {
	const pathname = usePathname()
	
	return (
		<div>SidebarNav temporarily disabled due to React type conflicts</div>
	)
}



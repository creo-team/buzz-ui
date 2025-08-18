'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const docsNavigation = [
	{
		title: 'Getting Started',
		items: [
			{ key: 'overview', label: 'Overview', href: '/docs' },
			{ key: 'installation', label: 'Installation', href: '/docs/installation' },
			{ key: 'quick-start', label: 'Quick Start', href: '/docs/quick-start' },
			{ key: 'typescript', label: 'TypeScript', href: '/docs/typescript' },
		]
	},
	{
		title: 'Theming',
		items: [
			{ key: 'theme-overview', label: 'Theme System', href: '/docs/theme' },
			{ key: 'theme-provider', label: 'Theme Provider', href: '/docs/theme/provider' },
			{ key: 'custom-colors', label: 'Custom Colors', href: '/docs/theme/colors' },
			{ key: 'design-tokens', label: 'Design Tokens', href: '/docs/theme/tokens' },
			{ key: 'dark-mode', label: 'Dark Mode', href: '/docs/theme/dark-mode' },
		]
	},
	{
		title: 'Components',
		items: [
			{ key: 'components-overview', label: 'Browse All Components', href: '/components' },
		]
	},
	{
		title: 'Advanced',
		items: [
			{ key: 'customization', label: 'Customization', href: '/docs/customization' },
			{ key: 'best-practices', label: 'Best Practices', href: '/docs/best-practices' },
			{ key: 'migration', label: 'Migration', href: '/docs/migration' },
		]
	}
]

function DocNavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) {
	return (
		<Link
			href={href}
			className={`block px-3 py-2 text-sm rounded-[var(--radius-md)] transition-colors ${
				isActive 
					? 'bg-[var(--c-primary-light)] text-[var(--c-primary)] font-medium' 
					: 'text-[var(--c-text-secondary)] hover:text-[var(--c-text)] hover:bg-[var(--c-hover)]'
			}`}
		>
			{children}
		</Link>
	)
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()

	return (
		<div className="min-h-screen bg-[var(--c-background)]">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex gap-8">
					{/* Docs Sidebar - Full height, no separate scroll */}
					<aside className="w-64 shrink-0">
						<div className="sticky top-20 py-8">
							<nav className="space-y-8">
								{docsNavigation.map((section) => (
									<div key={section.title}>
										<h3 className="text-sm font-semibold text-[var(--c-text)] mb-3">
											{section.title}
										</h3>
										<ul className="space-y-1">
											{section.items.map((item) => (
												<li key={item.href}>
													<DocNavLink href={item.href} isActive={pathname === item.href}>
														{item.label}
													</DocNavLink>
												</li>
											))}
										</ul>
									</div>
								))}
							</nav>
						</div>
					</aside>

					{/* Main content - Uses page scroll */}
					<main className="flex-1 min-w-0 py-8">
						<div className="max-w-4xl">
							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	)
}



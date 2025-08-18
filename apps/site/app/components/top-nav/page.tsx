"use client"
import { useState } from 'react'
import { Breadcrumbs } from '@creo-team/buzz-ui/server'
import { Button, ThemeSwitcher } from '@creo-team/buzz-ui/client'
import { CodeBlock } from '@/components/code-block'
import { ApiTable } from '@/components/api-table'

// Create a preview version that doesn't use fixed positioning
function TopNavPreview({ brand, items, right }: {
	brand?: React.ReactNode
	items?: Array<{ key: string; label: React.ReactNode; href?: string; onClick?: () => void; active?: boolean }>
	right?: React.ReactNode
}) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	return (
		<div className="relative">
			<nav className="w-full border-b border-[var(--c-border)] bg-[var(--c-surface)]/95 backdrop-blur-md">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
					{/* Brand */}
					<div className="flex-shrink-0">
						{brand && (
							<div className="text-lg font-bold text-[var(--c-text)] transition-transform hover:scale-[1.02] cursor-pointer">
								{brand}
							</div>
						)}
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-1">
						{items?.map(item => (
							<a
								key={item.key}
								href={item.href}
								onClick={(e) => {
									e.preventDefault()
									item.onClick?.()
								}}
								className={[
									'no-underline rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
									item.active 
										? 'text-[var(--c-text)] bg-[var(--c-primary-light)] border border-[var(--c-primary)]/20' 
										: 'text-[var(--c-text-secondary)] hover:text-[var(--c-text)] hover:bg-[var(--c-hover)]'
								].join(' ')}
							>
								{item.label}
							</a>
						))}
					</nav>

					{/* Right side content and mobile menu button */}
					<div className="flex items-center gap-3">
						{right}
						
						{/* Mobile menu button */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="md:hidden inline-flex items-center justify-center rounded-lg border border-[var(--c-border)] bg-[var(--c-surface)]/80 p-2 text-[var(--c-text-secondary)] hover:bg-[var(--c-hover)] hover:text-[var(--c-text)] transition-colors"
							aria-label="Toggle navigation menu"
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
								{mobileMenuOpen ? (
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden bg-[var(--c-surface)]/95 backdrop-blur-lg border-t border-[var(--c-border)]">
						<div className="mx-auto max-w-7xl px-4 py-2">
							<div className="flex flex-col gap-1 py-2">
								{items?.map(item => (
									<a
										key={item.key}
										href={item.href}
										onClick={(e) => {
											e.preventDefault()
											item.onClick?.()
											setMobileMenuOpen(false)
										}}
										className={[
											'no-underline px-3 py-2 text-sm font-medium border-l-2 transition-colors rounded-r-lg',
											item.active 
												? 'text-[var(--c-text)] border-[var(--c-primary)] bg-[var(--c-primary-light)]' 
												: 'text-[var(--c-text-secondary)] border-transparent hover:bg-[var(--c-hover)] hover:text-[var(--c-text)]'
										].join(' ')}
									>
										{item.label}
									</a>
								))}
							</div>
						</div>
					</div>
				)}
			</nav>
			{/* Preview content area */}
			<div className="bg-[var(--c-background)] p-8 text-center">
				<p className="text-[var(--c-text-secondary)]">Page content would appear here</p>
			</div>
		</div>
	)
}

export default function TopNavDocs() {
	return (
		<div>
			<Breadcrumbs items={[
				{ key: 'home', label: 'Home', href: '/' },
				{ key: 'docs', label: 'Docs', href: '/docs' },
				{ key: 'top-nav', label: 'TopNav' }
			]} />
			
			<h1 className="mt-6 text-4xl font-bold text-[var(--c-text)]">TopNav</h1>
			<p className="mt-4 text-lg text-[var(--c-text-secondary)]">
				A responsive navigation header with brand, menu items, and actions.
			</p>

			<div className="mt-10">
				<h2 className="text-2xl font-bold text-[var(--c-text)]">Examples</h2>

				<div className="mt-6">
					<h3 className="text-xl font-semibold text-[var(--c-text)]">Basic Usage</h3>
					<p className="mt-2 text-[var(--c-text-secondary)]">
						A simple navigation with brand, menu items, and actions.
					</p>
					
					<div className="mt-4 overflow-hidden rounded-lg border border-[var(--c-border)]">
						<TopNavPreview
							brand="My App"
							items={[
								{ key: 'home', label: 'Home', active: true },
								{ key: 'docs', label: 'Docs' },
								{ key: 'components', label: 'Components' },
							]}
							right={
								<div className="flex items-center gap-2">
									<ThemeSwitcher />
									<Button variant="outline" size="sm">Sign In</Button>
								</div>
							}
						/>
					</div>

					<CodeBlock 
						code={`import { TopNav } from '@creo-team/buzz-ui/server'
import { Button, ThemeSwitcher } from '@creo-team/buzz-ui/client'

export default function Example() {
	return (
		<TopNav
			brand="My App"
			items={[
				{ key: 'home', label: 'Home', href: '/', active: true },
				{ key: 'docs', label: 'Docs', href: '/docs' },
				{ key: 'components', label: 'Components', href: '/components' },
			]}
			right={
				<div className="flex items-center gap-2">
					<ThemeSwitcher />
					<Button variant="outline" size="sm">Sign In</Button>
				</div>
			}
		/>
	)
}`}
						label="Basic TopNav Example"
					/>
				</div>

				<div className="mt-8">
					<h3 className="text-xl font-semibold text-[var(--c-text)]">With Logo and Actions</h3>
					<p className="mt-2 text-[var(--c-text-secondary)]">
						Navigation with a logo component and multiple actions.
					</p>
					
					<div className="mt-4 overflow-hidden rounded-lg border border-[var(--c-border)]">
						<TopNavPreview
							brand={
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
										<span className="text-white font-bold text-sm">L</span>
									</div>
									<span>Logo</span>
								</div>
							}
							items={[
								{ key: 'dashboard', label: 'Dashboard', active: true },
								{ key: 'projects', label: 'Projects' },
								{ key: 'team', label: 'Team' },
								{ key: 'settings', label: 'Settings' },
							]}
							right={
								<div className="flex items-center gap-2">
									<Button variant="text" size="sm">
										<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 6l5-5v5H9z" />
										</svg>
									</Button>
									<Button variant="outline" size="sm">Upgrade</Button>
									<div className="h-8 w-8 rounded-full bg-[var(--c-primary)] flex items-center justify-center">
										<span className="text-white text-sm font-medium">JD</span>
									</div>
								</div>
							}
						/>
					</div>

					<CodeBlock 
						code={`<TopNav
	brand={
		<div className="flex items-center gap-2">
			<Logo className="h-8 w-8" />
			<span>My Company</span>
		</div>
	}
	items={[
		{ key: 'dashboard', label: 'Dashboard', href: '/dashboard', active: true },
		{ key: 'projects', label: 'Projects', href: '/projects' },
		{ key: 'team', label: 'Team', href: '/team' },
	]}
	right={
		<div className="flex items-center gap-2">
			<Button variant="outline" size="sm">Upgrade</Button>
			<Avatar src="/avatar.jpg" alt="User" />
		</div>
	}
/>`}
						label="TopNav with Logo"
					/>
				</div>

				<div className="mt-8">
					<h3 className="text-xl font-semibold text-[var(--c-text)]">Minimal Version</h3>
					<p className="mt-2 text-[var(--c-text-secondary)]">
						A clean, minimal navigation with just essential elements.
					</p>
					
					<div className="mt-4 overflow-hidden rounded-lg border border-[var(--c-border)]">
						<TopNavPreview
							brand="Minimal"
							items={[
								{ key: 'home', label: 'Home' },
								{ key: 'about', label: 'About', active: true },
								{ key: 'contact', label: 'Contact' },
							]}
							right={<Button size="sm">Get Started</Button>}
						/>
					</div>
				</div>

				<ApiTable
					rows={[
						{
							prop: "brand",
							type: "React.ReactNode",
							description: "Brand logo or text to display"
						},
						{
							prop: "items",
							type: "TopNavItem[]",
							default: "[]",
							description: "Navigation menu items"
						},
						{
							prop: "right",
							type: "React.ReactNode",
							description: "Content to display on the right side"
						}
					]}
				/>
			</div>
		</div>
	)
}


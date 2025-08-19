"use client"
import * as React from 'react'

export interface TopNavItem {
	key: string
	label: React.ReactNode
	href?: string
	onClick?: () => void
	active?: boolean
}

export interface TopNavProps {
	brand?: React.ReactNode
	items?: TopNavItem[]
	right?: React.ReactNode
	before?: React.ReactNode
}

export function TopNav({ brand, items = [], right, before }: TopNavProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

	return (
		<>
			{before}
			<header className={`fixed left-0 right-0 z-50 w-full bg-[var(--c-surface)]/20 backdrop-blur-lg border-b border-[var(--c-border)]/30 ${before ? 'top-[40px]' : 'top-0'}`}>
				<div className="mx-auto max-w-7xl px-4">
					<div className="flex h-16 items-center justify-between">
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
							{items.map(item => (
								<a
									key={item.key}
									href={item.href}
									onClick={item.onClick}
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
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden bg-[var(--c-surface)]/95 backdrop-blur-lg border-t border-[var(--c-border)]">
						<div className="mx-auto max-w-7xl px-4 py-2">
							<div className="flex flex-col gap-1 py-2">
								{items.map(item => (
									<a
										key={item.key}
										href={item.href}
										onClick={(e) => {
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
			</header>
		</>
	)
}


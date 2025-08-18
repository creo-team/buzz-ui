import * as React from 'react'

export interface FooterLink {
	key: string
	label: React.ReactNode
	href: string
}

export interface FooterProps {
	links?: FooterLink[]
	copyright?: React.ReactNode
}

export function Footer({ links = [], copyright }: FooterProps) {
	return (
        <footer className="border-t border-[var(--c-border)] bg-[var(--c-surface-2)]">
			<div className="mx-auto max-w-7xl px-6 py-8">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<ul className="flex flex-wrap gap-6 text-sm text-[var(--c-text-secondary)]">
						{links.map(link => (
							<li key={link.key}>
								<a 
									className="hover:text-[var(--c-primary)] transition-colors no-underline" 
									href={link.href}
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
					<div className="text-sm text-[var(--c-text-muted)]">{copyright}</div>
				</div>
			</div>
		</footer>
	)
}


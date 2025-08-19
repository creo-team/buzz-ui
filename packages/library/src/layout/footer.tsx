"use client"
import * as React from 'react'

export interface FooterLink {
	key: string
	label: React.ReactNode
	href: string
	icon?: React.ReactNode
}

export interface FooterSection {
	key: string
	title: string
	links: FooterLink[]
}

export interface FooterProps {
	variant?: 'simple' | 'sections' | 'modern' | 'minimal' | 'glass' | 'epic'
	sections?: FooterSection[]
	links?: FooterLink[]
	copyright?: React.ReactNode
	logo?: React.ReactNode
	social?: FooterLink[]
	newsletter?: {
		title: string
		description: string
		onSubmit: (email: string) => void
	}
	className?: string
}

export function Footer({ 
	variant = 'simple', 
	sections = [], 
	links = [], 
	copyright, 
	logo, 
	social = [],
	newsletter,
	className = ''
}: FooterProps) {
	const [email, setEmail] = React.useState('')

	if (variant === 'minimal') {
		return (
			<footer className={`relative z-[1] border-t border-[var(--c-border)] ${className}`}>
				<div className="mx-auto max-w-7xl px-6 py-6">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						{logo && <div className="text-[var(--c-text)]">{logo}</div>}
						<div className="text-sm text-[var(--c-text-muted)]">{copyright}</div>
					</div>
				</div>
			</footer>
		)
	}

	if (variant === 'simple') {
		return (
			<footer className={`relative z-[1] border-t border-[var(--c-border)] bg-[var(--c-surface-2)] ${className}`}>
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

	if (variant === 'modern') {
		return (
			<footer className={`relative z-[1] bg-gradient-to-b from-[var(--c-surface)] to-[var(--c-surface-2)] border-t border-[var(--c-border)] ${className}`}>
				<div className="mx-auto max-w-7xl px-6 py-12">
					<div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
						{logo && (
							<div className="flex-shrink-0">
								<div className="text-2xl font-bold text-[var(--c-text)]">{logo}</div>
								<p className="mt-2 text-sm text-[var(--c-text-secondary)] max-w-xs">
									Building modern web experiences with elegant components.
								</p>
							</div>
						)}
						
						{newsletter && (
							<div className="flex-1 max-w-md">
								<h3 className="text-lg font-semibold text-[var(--c-text)]">{newsletter.title}</h3>
								<p className="mt-2 text-sm text-[var(--c-text-secondary)]">{newsletter.description}</p>
								<div className="mt-4 flex gap-2">
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"
										className="flex-1 px-4 py-2 text-sm bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-ring)]"
									/>
									<button
										onClick={() => newsletter.onSubmit(email)}
										className="px-4 py-2 text-sm font-medium text-white bg-[var(--c-primary)] hover:bg-[var(--c-primary-hover)] rounded-xl transition-all shadow-md hover:shadow-lg"
									>
										Subscribe
									</button>
								</div>
							</div>
						)}

						{social.length > 0 && (
							<div className="flex gap-4">
								{social.map(item => (
									<a
										key={item.key}
										href={item.href}
										className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--c-hover)] hover:bg-[var(--c-hover)]/70 text-[var(--c-text-secondary)] hover:text-[var(--c-text)] transition-all"
										aria-label={item.label as string}
									>
										{item.icon}
									</a>
								))}
							</div>
						)}
					</div>

					<div className="mt-8 pt-8 border-t border-[var(--c-border)]">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
							<ul className="flex flex-wrap gap-6 text-sm text-[var(--c-text-secondary)]">
								{links.map(link => (
									<li key={link.key}>
										<a className="hover:text-[var(--c-primary)] transition-colors" href={link.href}>
											{link.label}
										</a>
									</li>
								))}
							</ul>
							<div className="text-sm text-[var(--c-text-muted)]">{copyright}</div>
						</div>
					</div>
				</div>
			</footer>
		)
	}

	if (variant === 'glass') {
		return (
			<footer className={`relative z-[1] overflow-hidden ${className}`}>
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 dark:via-black/10 dark:to-black/20 pointer-events-none" />
				<div className="backdrop-blur-xl backdrop-saturate-150 border-t border-white/10 dark:border-white/5">
					<div className="mx-auto max-w-7xl px-6 py-16">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
							{logo && (
								<div className="md:col-span-1">
									<div className="text-2xl font-bold text-[var(--c-text)] mb-4">{logo}</div>
									<p className="text-sm text-[var(--c-text-secondary)] mb-6">
										Crafting elegant interfaces with modern components.
									</p>
									{social.length > 0 && (
										<div className="flex gap-3">
											{social.map(item => (
												<a
													key={item.key}
													href={item.href}
													className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-black/30 text-[var(--c-text)] transition-all"
													aria-label={item.label as string}
												>
													{item.icon}
												</a>
											))}
										</div>
									)}
								</div>
							)}
							
							{sections.slice(0, 3).map(section => (
								<div key={section.key}>
									<h3 className="text-sm font-semibold text-[var(--c-text)] mb-4">{section.title}</h3>
									<ul className="space-y-2">
										{section.links.map(link => (
											<li key={link.key}>
												<a
													href={link.href}
													className="text-sm text-[var(--c-text-secondary)] hover:text-[var(--c-text)] transition-colors"
												>
													{link.label}
												</a>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
						
						<div className="mt-12 pt-8 border-t border-white/10 dark:border-white/5">
							<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
								<div className="text-sm text-[var(--c-text-muted)]">{copyright}</div>
								<ul className="flex flex-wrap gap-6 text-sm text-[var(--c-text-secondary)]">
									{links.map(link => (
										<li key={link.key}>
											<a className="hover:text-[var(--c-text)] transition-colors" href={link.href}>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</footer>
		)
	}

	if (variant === 'epic') {
		return (
			<footer className={`relative z-[1] ${className}`}>
				{/* Background Pattern */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--c-primary)]/5 rounded-full blur-3xl" />
					<div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--c-primary)]/5 rounded-full blur-3xl" />
				</div>
				
				<div className="relative bg-[var(--c-surface-2)]/80 backdrop-blur-sm border-t border-[var(--c-border)]">
					<div className="mx-auto max-w-7xl px-6 py-20">
						{newsletter && (
							<div className="text-center mb-16">
								<h2 className="text-3xl font-bold text-[var(--c-text)] mb-4">{newsletter.title}</h2>
								<p className="text-lg text-[var(--c-text-secondary)] mb-8 max-w-2xl mx-auto">
									{newsletter.description}
								</p>
								<div className="flex gap-3 max-w-md mx-auto">
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"
										className="flex-1 px-5 py-3 bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-[var(--c-border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--c-primary-ring)] text-[var(--c-text)]"
									/>
									<button
										onClick={() => newsletter.onSubmit(email)}
										className="px-6 py-3 font-medium text-white bg-[var(--c-primary)] hover:bg-[var(--c-primary-hover)] rounded-2xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
									>
										Subscribe
									</button>
								</div>
							</div>
						)}
						
						<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
							{logo && (
								<div className="col-span-2">
									<div className="text-3xl font-bold text-[var(--c-text)] mb-4">{logo}</div>
									<p className="text-sm text-[var(--c-text-secondary)] mb-6 max-w-xs">
										Building the future of web experiences with elegant, reusable components.
									</p>
									{social.length > 0 && (
										<div className="flex gap-2">
											{social.map(item => (
												<a
													key={item.key}
													href={item.href}
													className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 dark:bg-black/10 backdrop-blur-sm hover:bg-white/10 dark:hover:bg-black/20 text-[var(--c-text)] transition-all hover:scale-110"
													aria-label={item.label as string}
												>
													{item.icon}
												</a>
											))}
										</div>
									)}
								</div>
							)}
							
							{sections.map(section => (
								<div key={section.key}>
									<h3 className="text-sm font-semibold text-[var(--c-text)] mb-4 uppercase tracking-wider">
										{section.title}
									</h3>
									<ul className="space-y-3">
										{section.links.map(link => (
											<li key={link.key}>
												<a
													href={link.href}
													className="text-sm text-[var(--c-text-secondary)] hover:text-[var(--c-primary)] transition-colors inline-flex items-center gap-1 group"
												>
													{link.icon && <span className="opacity-50 group-hover:opacity-100 transition-opacity">{link.icon}</span>}
													{link.label}
												</a>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
						
						<div className="pt-8 border-t border-[var(--c-border)]">
							<div className="flex flex-col md:flex-row items-center justify-between gap-4">
								<div className="text-sm text-[var(--c-text-muted)]">{copyright}</div>
								<ul className="flex flex-wrap gap-6 text-sm">
									{links.map(link => (
										<li key={link.key}>
											<a 
												className="text-[var(--c-text-secondary)] hover:text-[var(--c-text)] transition-colors" 
												href={link.href}
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</footer>
		)
	}

	// Sections variant (default)
	return (
		<footer className={`relative z-[1] bg-[var(--c-surface-2)] border-t border-[var(--c-border)] ${className}`}>
			<div className="mx-auto max-w-7xl px-6 py-12">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
					{logo && (
						<div className="col-span-2 lg:col-span-1">
							<div className="text-xl font-bold text-[var(--c-text)]">{logo}</div>
							<p className="mt-4 text-sm text-[var(--c-text-secondary)]">
								Building the future of web components.
							</p>
							{social.length > 0 && (
								<div className="mt-6 flex gap-3">
									{social.map(item => (
										<a
											key={item.key}
											href={item.href}
											className="text-[var(--c-text-secondary)] hover:text-[var(--c-text)] transition-colors"
											aria-label={item.label as string}
										>
											{item.icon}
										</a>
									))}
								</div>
							)}
						</div>
					)}
					
					{sections.map(section => (
						<div key={section.key}>
							<h3 className="text-sm font-semibold text-[var(--c-text)]">{section.title}</h3>
							<ul className="mt-4 space-y-3">
								{section.links.map(link => (
									<li key={link.key}>
										<a
											href={link.href}
											className="text-sm text-[var(--c-text-secondary)] hover:text-[var(--c-primary)] transition-colors"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				
				<div className="mt-12 border-t border-[var(--c-border)] pt-8">
					<p className="text-sm text-[var(--c-text-muted)] text-center">{copyright}</p>
				</div>
			</div>
		</footer>
	)
}